import { createRedditInstance, userCredentials } from "@/lib/reddit/reddit";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Submission } from "snoowrap";
import { CreateAutoReplySchema, CreateReplySchema, GetPostsSchema, RedditCampaignSchema, UpdateRedditCampaignSchema } from "@/lib/validations/reddit-campaign-schema";
import { db } from "@/lib/db";
import { redditCampaigns, redditReplies } from "@/lib/db/schema/reddit";
import { z } from "zod";
import { openai } from "@/lib/openai/openai";
import { and, eq } from "drizzle-orm";
import { ResponseTypes } from "openai-edge";
import { isToday } from "date-fns";
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe";
import { getMonthlyReplies } from "@/server/actions/reddit-actions";
import { calculateCosineSimilarity, checkPlanReplyLimit } from "@/lib/utils";
import { v4 } from "uuid"
import { keywords } from "@/lib/db/schema/keyword";
import { replyOutput } from "@/lib/openai/prompts";

export const redditRouter = router({
//--------------------------------------------------------//GET POSTS ON KEYWORDS//---------------------------------------------------------//
    getSubredditsAndPosts: privateProcedure.input(GetPostsSchema).query(async({ input }) => {

        const { allKeywords, projectId } = input
        
        const subscriptionPlan = await getUserSubscriptionPlan();

        if (!subscriptionPlan.repliesPerMonth) {
          throw new TRPCError({ message: 'No plan provided', code: 'UNAUTHORIZED' })
        }

        const monthlyReplies = await getMonthlyReplies(projectId, subscriptionPlan)

        if (monthlyReplies.length >= subscriptionPlan.repliesPerMonth) {
          throw new TRPCError({ message: 'Monthly reply limit reached', code: 'UNAUTHORIZED' })
        }
        
        // Randomly choose between the first and second user
        const selectedUser = userCredentials[Math.floor(Math.random() * userCredentials.length)];
         console.log(selectedUser)
        try { 
            // Create our Reddit instance
            const reddit = createRedditInstance({ 
              clientId: selectedUser.clientId,
              clientSecret: selectedUser.clientSecret,
              userAgent: selectedUser.userAgent,
              username: selectedUser.username,
              password: selectedUser.password
            });

            // Check if already replied to post
            const alreadyReplied = await db.query.redditReplies.findMany({
             columns: {
              postId: true,
              createdAt: true,
              projectId: true,
              accountClientId: true
              },
            })

            const postIdsSet = new Set();
            // Array of latest posts
            const latestPosts = [];
            
            if (allKeywords) {
                for (const oneKeyword of allKeywords) {
                  // Search for posts based on the keyword
                  const searchResults = await reddit.search({
                    query: oneKeyword,
                    subreddit: 'all',
                    sort: 'relevance',
                    time: 'all',
                    syntax: 'plain',
                  });
              
                  // Extract the first 5 unique posts from the search results
                  const formattedPosts = searchResults
                    .filter((post) => post.selftext.trim().length > 0)
                    .map((post) => ({
                      postId: post.id,
                      subreddit: post.subreddit_name_prefixed,
                      title: post.title,
                      url: post.url,
                      content: post.selftext,
                      author: post.author.name,
                      createdAt: new Date(post.created_utc * 1000).toLocaleString(),
                    }))
                    .filter((post) => {
                        // Check if the post ID is not already in the set
                       if (!postIdsSet.has(post.postId)) {
                      // Check if the post has been replied by current user
                      const repliedByCurrentUser = alreadyReplied.some(reply => reply.postId === post.postId && reply.accountClientId === selectedUser.clientId);
                      // Add the post ID to the set and return true to include the post if it's not replied by current user
                      if (!repliedByCurrentUser) {
                       postIdsSet.add(post.postId);
                       return true;
                    }
                  }
                    return false;
                    });
              
                  // Only add the keyword if there are unique posts with content
                  if (formattedPosts.length > 0) {
                    latestPosts.push({
                      keyword: oneKeyword,
                      posts: formattedPosts,
                    });
                  }
                }
              
                // Exclude keywords with no posts
                const filteredLatestPosts = latestPosts.filter((keyword) => keyword.posts.length > 0);
              
                return filteredLatestPosts;
              }
              
              return [];
            } catch (error) {
               console.log('GET_SUBREDDITS_ERROR', error)
               throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
         }
    }), 

    //--------------------------------------------------------//CREATE REDDIT PROJECT//-----------------------------------------//
    createRedditProject: privateProcedure.input(RedditCampaignSchema).mutation(async ({ input, ctx }) => {
        const { userId } = ctx
        const { autoReply, description, title, tone, url, image, autoReplyLimit } = input

        const subscriptionPlan = await getUserSubscriptionPlan()

        const userProjects = await db.query.redditCampaigns.findMany({
          columns: {
            id: true
          },
          where: and(
            eq(redditCampaigns.userId, userId)
        )
        })

        if (userProjects.length >= subscriptionPlan.projects!) {
           throw new TRPCError({ message: 'Upgrade your plan for creating more projects', code: 'FORBIDDEN' })
        }

        const projectId = v4()

        const project = await db.insert(redditCampaigns).values({
          id: projectId,
          image,
          title,
          tone,
          description,
          autoReply,
          url,
          userId,
          autoReplyLimit
      }).returning({
          insertedId: redditCampaigns.id,
          description: redditCampaigns.description
      })  

        try {
           // Create Keywords
         const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: "You are an AI-powered keyword generator designed to assist in marketing products.\n" +
                  "Remember, your responses should consist only of keywords, ensuring they are relevant and unique to the given product description.\n" +
                  "Prioritize keywords that precisely convey the products solution to a problem or its unique features.\n" +
                  "Ensure each keyword contributes distinct value and avoids vagueness or redundancy."
          },
              {
                  role: 'user',
                  content: `Generate a list of 5 relevant and unique keywords based on the following product description: '${description}'`
              }
          ]
      })

       // Get the keywords array and push them into the database
        const data = await response.json()

        const keywordPattern = /\d+\.\s*(\S+)/g;

        const matches = data.choices[0].message.content.matchAll(keywordPattern);

        const keywordsOpenai = Array.from(matches, (match: any) => match[1].trim());

        const trimmedFirstKeyword = keywordsOpenai[0].trim();
        const trimmedSecondKeyword = keywordsOpenai[1].trim();
        const trimmedThirdKeyword = keywordsOpenai[2].trim();
        const trimmedFourthKeyword = keywordsOpenai[3].trim();
        const trimmedFifthKeyword = keywordsOpenai[4].trim();
        // const trimmedSixthKeyword = keywordsOpenai[5].trim();
        // const trimmedSeventhKeyword = keywordsOpenai[6].trim();
        // const trimmedEightKeyword = keywordsOpenai[7].trim();
        // const trimmedNinthKeyword = keywordsOpenai[8].trim();
        // const trimmedTenthKeyword = keywordsOpenai[9].trim();

        // console.log(trimmedFirstKeyword)
        // console.log(trimmedSecondKeyword)
        // console.log(trimmedThirdKeyword)
        // console.log(trimmedFourthKeyword)
        // console.log(trimmedFifthKeyword)
        // console.log(trimmedSixthKeyword)
        // console.log(trimmedSeventhKeyword)
        // console.log(trimmedEightKeyword)
        // console.log(trimmedNinthKeyword)
        // console.log(trimmedTenthKeyword)

       const insertedKeyword = await db.insert(keywords).values({
            redditCampaignId: projectId,
            columnId: '2',
            order: 0,
            content: trimmedFirstKeyword,
            originalColumnId: '2'
       })

       const insertedKeywordS = await db.insert(keywords).values({
          redditCampaignId: projectId,
          columnId: '2',
          order: 1,
          content: trimmedSecondKeyword,
          originalColumnId: '2'
      })

       const insertedKeywordT = await db.insert(keywords).values({
          redditCampaignId: projectId,
          columnId: '2',
          order: 2,
          content: trimmedThirdKeyword,
          originalColumnId: '2'
      })

      const insertedKeywordF = await db.insert(keywords).values({
          redditCampaignId: projectId,
          columnId: '2',
          order: 3,
          content: trimmedFourthKeyword,
          originalColumnId: '2'
      })

     const insertedKeywordFi = await db.insert(keywords).values({
        redditCampaignId: projectId,
        columnId: '2',
        order: 4,
        content: trimmedFifthKeyword,
        originalColumnId: '2'
     })

  //    const insertedKeywordSi = await db.insert(keywords).values({
  //     redditCampaignId: projectId,
  //     columnId: '2',
  //     order: 5,
  //     content: trimmedSixthKeyword,
  //  })

  //    const insertedKeywordSe = await db.insert(keywords).values({
  //     redditCampaignId: projectId,
  //     columnId: '2',
  //     order: 6,
  //     content: trimmedSeventhKeyword,
  //    })

  //    const insertedKeywordEi = await db.insert(keywords).values({
  //     redditCampaignId: projectId,
  //     columnId: '2',
  //     order: 7,
  //     content: trimmedEightKeyword,
  //    })

  //    const insertedKeywordNi = await db.insert(keywords).values({
  //     redditCampaignId: projectId,
  //     columnId: '2',
  //     order: 8,
  //     content: trimmedNinthKeyword,
  //    })

  //    const insertedKeywordTh = await db.insert(keywords).values({
  //     redditCampaignId: projectId,
  //     columnId: '2',
  //     order: 9,
  //     content: trimmedTenthKeyword,
  //     })

        return { projectId: project[0].insertedId, projectDescription: project[0].description }
      } catch (error) {
         throw new TRPCError({ message: 'Something went wrong while creating your project. Please try again later.', code: 'UNPROCESSABLE_CONTENT' })
      }
    }),

    //--------------------------------------------------------------//CREATE REPLY//-------------------------------------------------------------//
    createReply: privateProcedure.input(CreateReplySchema).mutation(async ({ ctx, input }) => {
        const { postId, projectId, postContent, postAuthor, postUrl, postTitle } = input
        const { userId } = ctx

       // Randomly choose between the first and second user
       const selectedUser = userCredentials[Math.floor(Math.random() * userCredentials.length)];

       const subscriptionPlan = await getUserSubscriptionPlan()

       // Replies created this month
       const repliesCreatedThisMonth = await getMonthlyReplies(projectId, subscriptionPlan)

       console.log(repliesCreatedThisMonth)

       // Plan Limits
       const { isReplyPossible } = checkPlanReplyLimit({ planName: subscriptionPlan.name!, repliesCreatedThisMonth });

      // Check if the reply limit is exceeded TODO: DO THE SAME FOR ALL PLANS
      if (!isReplyPossible) {
        throw new TRPCError({ message: 'You have reached the maximum amount of replies for your plan', code: 'TOO_MANY_REQUESTS' })
       }

        // Get the Reddit project
        const project = await db.query.redditCampaigns.findFirst({
            columns: {
              id: true, 
              tone: true, 
              title: true,
              description: true,
              url: true,
              autoReplyLimit: true
            },
            where: and(
                eq(redditCampaigns.id, projectId),
                eq(redditCampaigns.userId, userId)
            )
        })

        if (!project) {
            throw new TRPCError({ message: 'No project found', code: 'UNAUTHORIZED' })
        }

        // Check if already replied to the same post
        const alreadyReplied = await db.query.redditReplies.findFirst({
            columns: {
              postId: true,
              projectId: true,
              accountClientId: true
            },
            where: and(
                eq(redditReplies.postId, postId),
                // eq(redditReplies.projectId, projectId)
            )
        })

        if (alreadyReplied && alreadyReplied.projectId === projectId) {
          throw new TRPCError({ message: 'Already replied to this post', code: 'FORBIDDEN' })
        }
  
        if (alreadyReplied && alreadyReplied.accountClientId === selectedUser.clientId) {
          throw new TRPCError({ message: 'This account already replied to this post', code: 'FORBIDDEN' })
        }

        // Create Reddit instance
        const reddit = createRedditInstance({ 
          clientId: selectedUser.clientId,
          clientSecret: selectedUser.clientSecret,
          userAgent: selectedUser.userAgent,
          username: selectedUser.username,
          password: selectedUser.password })

        // OpenAI reponse
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
              {
                  role: 'system',
                  content: `You are a ${project.tone} Reddit user. You are actively involved
                   in diverse communities, providing helpful and insightful responses.
                   Incorporate mentions of a specific product, [${project.title}](${project.url}), into your
                   replies. Here's a brief description of the product: ${project.description}.
                   Your objective is to share valuable information while subtly promoting
                   this product.`,
              },
              {
                  role: 'user',
                  content: `You come across this Reddit post: ${postTitle} ${postContent}. 
                  Respond to it as you typically would, providing relevant and insightful
                  information. Also, feel free to incorporate your thoughts on different aspects
                  and mention [${project.title}](${project.url}) if it fits naturally.`
              }
          ]
      });
      

        if (!response) {
            throw new TRPCError({ message: 'No Openai response', code: 'BAD_REQUEST' })
        }

        const responseData = (await response.json() as ResponseTypes["createChatCompletion"])
        const cleanedAiResponse = responseData.choices[0].message?.content

        if (!cleanedAiResponse) {
            throw new TRPCError({ message: 'Could not clean the AI response', code: 'BAD_REQUEST' })
        }

        // Get the post to reply
        const post = reddit.getSubmission(postId)

        if (!post) {
            throw new TRPCError({ message: 'Could not find the post to reply', code: 'BAD_REQUEST' })
        }

        // Reply to the post
        const redditReply = post.reply(cleanedAiResponse)

        if (!redditReply) {
            throw new TRPCError({ message: 'Could not reply to post', code: 'BAD_REQUEST' })
        }

        // Extract the first 100 letters of the cleanedAiResponse
         const limitedReply = cleanedAiResponse.slice(0, 100);

        // Save reply into database
        const dbReply = await db.insert(redditReplies).values({
            projectId,
            title: postTitle,
            postAuthor: postAuthor,
            postId,
            postUrl: postUrl,
            reply: limitedReply,
            accountClientId: selectedUser.clientId
        }).returning({
          createdAt: redditReplies.id
        })

        // Return database reply
         return { dbReply }
    }),

    //--------------------------------------------------------------//UPDATE REDDIT PROJECT//----------------------------------------------------------//
    updateRedditProject: privateProcedure.input(UpdateRedditCampaignSchema).mutation(async ({ ctx, input }) => {
      const { userId } = ctx
      const { id, autoReply, description, title, tone, url, image,autoReplyLimit } = input

        // TODO: check for user subscription
        const project = await db.update(redditCampaigns).set({
            image,
            title,
            tone,
            description,
            autoReply,
            url,
            userId,
            autoReplyLimit
        }).where(and(
          eq(redditCampaigns.id, id),
          eq(redditCampaigns.userId, userId)
        )).returning({
            insertedId: redditCampaigns.id,
        })

        console.log(project)

        return { projectId: project[0].insertedId }
    }),

    //-----------------------------------------------------------------//CREATE AUTOMATIC REPLIES//----------------------------------------------------//
    createAutoReply: privateProcedure.input(CreateAutoReplySchema).mutation(async ({ ctx, input }) => {
      const { projectId, allKeywords } = input
      const { userId } = ctx
   
      const subscriptionPlan = await getUserSubscriptionPlan()

       // Get the Reddit project
       const project = await db.query.redditCampaigns.findFirst({
        columns: {
          id: true, 
          tone: true, 
          title: true,
          description: true,
          url: true,
          autoReply: true,
          autoReplyLimit: true,
        },
        where: and(
            eq(redditCampaigns.id, projectId),
            eq(redditCampaigns.userId, userId)
        )
    })

    if (!project) {
        throw new TRPCError({ message: 'No project found', code: 'UNAUTHORIZED' })
    }

    if (project.autoReplyLimit >= 20 && allKeywords.length < 5) {
      throw new TRPCError({ message: 'Insufficient keywords', code: 'UNPROCESSABLE_CONTENT'}) // Exit the function early if the condition is not met
    }

    if (project.autoReplyLimit < 20 && allKeywords.length < 2) {
      throw new TRPCError({ message: 'Insufficient keywords', code: 'UNPROCESSABLE_CONTENT'}) // Exit the function early if the condition is not met
    }

      // Randomly choose between the first and second user
      const selectedUser = userCredentials[Math.floor(Math.random() * userCredentials.length)];

      // Replies created this month
      const repliesCreatedThisMonth = await getMonthlyReplies(projectId, subscriptionPlan)

      // Replies created today
      const repliesCreatedToday = repliesCreatedThisMonth.filter(reply => isToday(reply.createdAt));

      if (repliesCreatedToday.length >= project.autoReplyLimit) {
        throw new TRPCError({ message: 'Reply limit reached for today.', code: 'TOO_MANY_REQUESTS' })
      }

      // Plan Limits 
      const { isReplyPossible } = checkPlanReplyLimit({ planName: subscriptionPlan.name!, repliesCreatedThisMonth });

      // Check if the reply limit is exceeded TODO: DO THE SAME FOR ALL PLANS
      if (!isReplyPossible) {
        throw new TRPCError({ message: 'You have reached the maximum amount of replies for your plan', code: 'TOO_MANY_REQUESTS' })
      }

      // Create Reddit instance
      const reddit = createRedditInstance({
         clientId: selectedUser.clientId,
         clientSecret: selectedUser.clientSecret,
         userAgent: selectedUser.userAgent,
         username: selectedUser.username,
         password: selectedUser.password 
      })

      // Array of latest posts
      const latestPosts = [];

      const oneKeyword = allKeywords[Math.floor(Math.random() * allKeywords.length)];
      
        // Search for posts based on the keyword
          const searchResults = await reddit.search({
             query: oneKeyword,
             subreddit: 'all',
             sort: 'relevance',
             time: 'all',
             syntax: 'plain',
          });
        
          const formattedPosts = searchResults
            .filter((post) => post.selftext.trim().length > 0)
            .map((post) => ({
              postId: post.id,
              subreddit: post.subreddit_name_prefixed,
              title: post.title,
              url: post.url,
              content: post.selftext,
              author: post.author.name,
              createdAt: new Date(post.created_utc * 1000).toLocaleString(),
             }))
       
          // Only add the keyword if there are unique posts with content
            if (formattedPosts.length > 0) {
              latestPosts.push({
                keyword: oneKeyword,
                posts: formattedPosts,
              });
            }
          
        
      // Exclude keywords with no posts
      const filteredLatestPosts = latestPosts.filter((keyword) => keyword.posts.length > 0);
     
      // Get a random post from the filteredLatestPosts array with the seed
      const randomIndex = Math.floor(Math.random() * filteredLatestPosts[0].posts.length);
      const randomPost = filteredLatestPosts[0].posts[randomIndex];

      // Check if already replied to post
      const alreadyReplied = await db.query.redditReplies.findFirst({
        columns: {
          postId: true,
          createdAt: true,
          projectId: true,
          accountClientId: true
        },
        where: and(
            eq(redditReplies.postId, randomPost.postId),
            // eq(redditReplies.projectId, projectId)
        )
      })

      // TODO
      if (alreadyReplied && alreadyReplied.projectId === projectId) {
        throw new TRPCError({ message: 'Already replied to this post', code: 'FORBIDDEN' })
      }

      if (alreadyReplied && alreadyReplied.accountClientId === selectedUser.clientId) {
        throw new TRPCError({ message: 'This account already replied to this post', code: 'FORBIDDEN' })
      }

      // try {
         // Preprocess the text: Remove punctuation and convert to lowercase
       const processedPostContent = randomPost.content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase();
       const processedProjectDescription = project.description.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase();
   
       // Calculate similarity score using cosine similarity
       const similarityScore = calculateCosineSimilarity(processedPostContent, processedProjectDescription);
       console.log(`Similarity score for: //  ${randomPost.content} is ${similarityScore}`)

       if (similarityScore < 0.08) {
        throw new TRPCError({ message: 'Post is not suitable to reply', code: 'FORBIDDEN' })
       }
      // } catch (error) {
      //   console.log(`COULD NOT REFINE POST: ${randomPost.content}, ERROR:  ${error}`)
      //   throw new TRPCError({ message: 'Could not refine post', code: 'INTERNAL_SERVER_ERROR' })
      // }

 
      // OpenAI reponse
 
      // const response = await replyOutput({ 
      //   postContent: randomPost.content,
      //   projectDescription: project.description,
      //   projectTitle: project.title,
      //   projectUrl: project.url,
      //   projectTone: project.tone
      // })

      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `You are a ${project.tone} Reddit user. You are actively involved
                 in diverse communities, providing helpful and insightful responses.
                 Incorporate mentions of a specific product, [${project.title}](${project.url}), into your
                 replies. Here's a brief description of the product: ${project.description}.
                 Your objective is to share valuable information while subtly promoting
                 this product.`,
            },
            {
                role: 'user',
                content: `You come across this Reddit post: ${randomPost.content}. 
                Respond to it as you typically would, providing relevant and insightful
                information. Also, feel free to incorporate your thoughts on different aspects
                and mention [${project.title}](${project.url}) if it fits naturally.`
            }
        ]
    });
    
    if (!response) {
      throw new TRPCError({ message: 'No Openai response', code: 'BAD_REQUEST' })
    }

    // // // Check if the response status is 429 (Rate limit exceeded)
    if (response.status === 429) {
      throw new TRPCError({ message: 'OpenAI rate limit exceeded', code: 'TOO_MANY_REQUESTS' });
    }

    const responseData = (await response.json() as ResponseTypes["createChatCompletion"])
    const cleanedAiResponse = responseData.choices[0].message?.content

    if (!cleanedAiResponse) {
       throw new TRPCError({ message: 'Could not clean the AI response', code: 'BAD_REQUEST' })
    }

    // Get the post to reply
    const post = reddit.getSubmission(randomPost.postId)

    if (!post) {
      throw new TRPCError({ message: 'Could not find the post to reply', code: 'BAD_REQUEST' })
    }

    // console.log(cleanedAiResponse)

    // Reply to the post
    const redditReply = post.reply(cleanedAiResponse)

    if (!redditReply) {
       throw new TRPCError({ message: 'Could not reply to post', code: 'BAD_REQUEST' })
    }

    // Extract the first 100 letters of the cleanedAiResponse
       const limitedReply = cleanedAiResponse.slice(0, 100);

     // Save reply into database
     const newReply = await db.insert(redditReplies).values({
      projectId,
      title: randomPost.title,
      postAuthor: randomPost.author,
      postId: randomPost.postId,
      postUrl: randomPost.url,
      reply: limitedReply,
      accountClientId: selectedUser.clientId
    }).returning({
      createdAt: redditReplies.id
     })

    //  const newReply = await db.insert(redditReplies).values({
    //   projectId,
    //   title: randomPost.title,
    //   postAuthor: randomPost.author,
    //   postId: randomPost.postId,
    //   postUrl: randomPost.url,
    //   reply: '',
    //   accountClientId: selectedUser.clientId
    // }).returning({
    //   createdAt: redditReplies.id
    //  })


      // Save reply to database
       return { newReply }
  }),

//--------------------------------------------------------------//GET ALL PROJECT REPLIES//----------------------------------------------------------------------//
  getProjectReplies: privateProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    const { projectId } = input

    const projectReplies = await db.query.redditReplies.findMany({
      // columns: {
      //   id: true
      // },
      where: eq(redditReplies.projectId, projectId)
    })
    
    if (!projectReplies) {
       return []
    }

    return projectReplies
  })
})