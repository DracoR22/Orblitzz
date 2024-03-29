import { createRedditInstance } from "@/lib/reddit/reddit";
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

        const { allKeywords } = input

        const userCredentials = [
          {
            userAgent: process.env.FIRST_REDDIT_USER_AGENT!,
            clientId: process.env.FIRST_REDDIT_CLIENT_ID!,
            clientSecret: process.env.FIRST_REDDIT_CLIENT_SECRET!,
            username: process.env.FIRST_REDDIT_USERNAME!,
            password: process.env.FIRST_REDDIT_PASSWORD!
          },
          {
            userAgent: process.env.SECOND_REDDIT_USER_AGENT!,
            clientId: process.env.SECOND_REDDIT_CLIENT_ID!,
            clientSecret: process.env.SECOND_REDDIT_CLIENT_SECRET!,
            username: process.env.SECOND_REDDIT_USERNAME!,
            password: process.env.SECOND_REDDIT_PASSWORD!
          }
        ];
        
        const subscriptionPlan = await getUserSubscriptionPlan();
        
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
                        // Add the post ID to the set and return true to include the post
                        postIdsSet.add(post.postId);
                        return true;
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

        const projectId = v4()

        // TODO: check for user subscription
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

         // Create Keywords
         const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
              { 
                  role: 'system',
                  content: 'You are a helpful AI embedded in a keyword generator app' +
                  'AI can ONLY answer with keywords, NEVER reply with a non list of keywords or a message besides the keywords' + 
                  'Always generate a list of UNIQUE keywords' 
              },
              {
                  role: 'user',
                  content: `Generate a list of 10 RELEVANT and UNIQUE keywords based on '${description}'`
              }
          ]
      })

       // Get the keywords array and push them into the database
        const data = await response.json()

        const keywordPattern = /\d+\.\s*(\S+)/g;

        const matches = data.choices[0].message.content.matchAll(keywordPattern);

        const keywordsOpenai = Array.from(matches, (match: any) => match[1].trim());

        // TODO: This is probably the worst way of doing this
        const trimmedFirstKeyword = keywordsOpenai[0].trim();
        const trimmedSecondKeyword = keywordsOpenai[1].trim();
        const trimmedThirdKeyword = keywordsOpenai[2].trim();
        const trimmedFourthKeyword = keywordsOpenai[3].trim();
        const trimmedFifthKeyword = keywordsOpenai[4].trim();
        const trimmedSixthKeyword = keywordsOpenai[5].trim();
        const trimmedSeventhKeyword = keywordsOpenai[6].trim();
        const trimmedEightKeyword = keywordsOpenai[7].trim();
        const trimmedNinthKeyword = keywordsOpenai[8].trim();
        const trimmedTenthKeyword = keywordsOpenai[9].trim();

        console.log(trimmedFirstKeyword)
        console.log(trimmedSecondKeyword)
        console.log(trimmedThirdKeyword)
        console.log(trimmedFourthKeyword)
        console.log(trimmedFifthKeyword)

       const insertedKeyword = await db.insert(keywords).values({
            redditCampaignId: projectId,
            columnId: '2',
            order: 0,
            content: trimmedFirstKeyword,
       })

       const insertedKeywordS = await db.insert(keywords).values({
          redditCampaignId: projectId,
          columnId: '2',
          order: 1,
          content: trimmedSecondKeyword,
      })

       const insertedKeywordT = await db.insert(keywords).values({
          redditCampaignId: projectId,
          columnId: '2',
          order: 2,
          content: trimmedThirdKeyword,
      })

      const insertedKeywordF = await db.insert(keywords).values({
          redditCampaignId: projectId,
          columnId: '2',
          order: 3,
          content: trimmedFourthKeyword,
      })

     const insertedKeywordFi = await db.insert(keywords).values({
        redditCampaignId: projectId,
        columnId: '2',
        order: 4,
        content: trimmedFifthKeyword,
     })

     const insertedKeywordSi = await db.insert(keywords).values({
      redditCampaignId: projectId,
      columnId: '2',
      order: 5,
      content: trimmedSixthKeyword,
   })

    const insertedKeywordSe = await db.insert(keywords).values({
     redditCampaignId: projectId,
     columnId: '2',
     order: 6,
     content: trimmedSeventhKeyword,
    })

    const insertedKeywordEi = await db.insert(keywords).values({
     redditCampaignId: projectId,
     columnId: '2',
     order: 7,
     content: trimmedEightKeyword,
    })

    const insertedKeywordNi = await db.insert(keywords).values({
     redditCampaignId: projectId,
     columnId: '2',
     order: 8,
     content: trimmedNinthKeyword,
    })

    const insertedKeywordTh = await db.insert(keywords).values({
     redditCampaignId: projectId,
     columnId: '2',
     order: 9,
     content: trimmedTenthKeyword,
    })

    return { projectId: project[0].insertedId, projectDescription: project[0].description }
    }),

    //--------------------------------------------------------------//CREATE REPLY//-------------------------------------------------------------//
    createReply: privateProcedure.input(CreateReplySchema).mutation(async ({ ctx, input }) => {
        const { postId, projectId, postContent, postAuthor, postUrl, postTitle } = input
        const { userId } = ctx

        const userCredentials = {
          userAgent: process.env.FIRST_REDDIT_USER_AGENT!,
          clientId: process.env.FIRST_REDDIT_CLIENT_ID!,
          clientSecret: process.env.FIRST_REDDIT_CLIENT_SECRET!,
          username: process.env.FIRST_REDDIT_USERNAME!,
          password: process.env.FIRST_REDDIT_PASSWORD!
       }

       const subscriptionPlan = await getUserSubscriptionPlan()

       // Replies created this month
       const repliesCreatedThisMonth = await getMonthlyReplies(projectId)

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
              postId: true
            },
            where: and(
                eq(redditReplies.postId, postId),
                eq(redditReplies.projectId, projectId)
            )
        })

        if (alreadyReplied) {
            throw new TRPCError({ message: 'Already replied to this post', code: 'FORBIDDEN' })
        }

        // Create Reddit instance
        const reddit = createRedditInstance({ clientId: userCredentials.clientId, clientSecret: userCredentials.clientSecret, userAgent: userCredentials.userAgent, username: userCredentials.username, password: userCredentials.password })

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
            reply: limitedReply
        }).returning({
          createdAt: redditReplies.id
        })

        // Save reply to database
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

      if (allKeywords.length < 5) {
          throw new TRPCError({ message: 'Insufficient keywords', code: 'UNPROCESSABLE_CONTENT'}) // Exit the function early if the condition is not met
      }
   
      const userCredentials = {
        userAgent: process.env.FIRST_REDDIT_USER_AGENT!,
        clientId: process.env.FIRST_REDDIT_CLIENT_ID!,
        clientSecret: process.env.FIRST_REDDIT_CLIENT_SECRET!,
        username: process.env.FIRST_REDDIT_USERNAME!,
        password: process.env.FIRST_REDDIT_PASSWORD!
      }

      const subscriptionPlan = await getUserSubscriptionPlan()

      // Function to count words in a string
      const countWords = (text: string) => text.split(/\s+/).filter((word) => word.length > 0).length;

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

      // Replies created this month
      const repliesCreatedThisMonth = await getMonthlyReplies(projectId)

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
      const reddit = createRedditInstance({ clientId: userCredentials.clientId, clientSecret: userCredentials.clientSecret, userAgent: userCredentials.userAgent, username: userCredentials.username, password: userCredentials.password })

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
          createdAt: true
        },
        where: and(
            eq(redditReplies.postId, randomPost.postId),
            eq(redditReplies.projectId, projectId)
        )
      })

      if (alreadyReplied) {
        throw new TRPCError({ message: 'Already replied to this post', code: 'FORBIDDEN' })
      }

      // try {
         // Preprocess the text: Remove punctuation and convert to lowercase
       const processedPostContent = randomPost.content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase();
       const processedProjectDescription = project.description.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase();
   
       // Calculate similarity score using cosine similarity
       const similarityScore = calculateCosineSimilarity(processedPostContent, processedProjectDescription);
       console.log(`Similarity score for: //  ${randomPost.content} is ${similarityScore}`)

       if (similarityScore < 0.09) {
        throw new TRPCError({ message: 'Post is not suitable to reply', code: 'FORBIDDEN' })
       }
      // } catch (error) {
      //   console.log(`COULD NOT REFINE POST: ${randomPost.content}, ERROR:  ${error}`)
      //   throw new TRPCError({ message: 'Could not refine post', code: 'INTERNAL_SERVER_ERROR' })
      // }

 
      // OpenAI reponse
 
      // const response = await replyOutput({ 
      //   postContent: randomPost.posts[0].content,
      //   projectDescription: project.description,
      //   projectTitle: project.title,
      //   projectUrl: project.url,
      //   projectTone: project.tone
      // })

    //   const response = await openai.createChatCompletion({
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //         {
    //             role: 'system',
    //             content: `You are a ${project.tone} Reddit user. You are actively involved
    //              in diverse communities, providing helpful and insightful responses.
    //              Incorporate mentions of a specific product, [${project.title}](${project.url}), into your
    //              replies. Here's a brief description of the product: ${project.description}.
    //              Your objective is to share valuable information while subtly promoting
    //              this product.`,
    //         },
    //         {
    //             role: 'user',
    //             content: `You come across this Reddit post: ${randomPost.posts[0].content}. 
    //             Respond to it as you typically would, providing relevant and insightful
    //             information. Also, feel free to incorporate your thoughts on different aspects
    //             and mention [${project.title}](${project.url}) if it fits naturally.`
    //         }
    //     ]
    // });
    
    // if (!response) {
    //   return new TRPCError({ message: 'No Openai response', code: 'BAD_REQUEST' })
    // }

    // // Check if the response status is 429 (Rate limit exceeded)
    // if (response.status === 429) {
    //   return new TRPCError({ message: 'OpenAI rate limit exceeded', code: 'TOO_MANY_REQUESTS' });
    // }

    // const responseData = (await response.json() as ResponseTypes["createChatCompletion"])
    // const cleanedAiResponse = responseData.choices[0].message?.content

    // if (!cleanedAiResponse) {
    //    return new TRPCError({ message: 'Could not clean the AI response', code: 'BAD_REQUEST' })
    // }

    // Get the post to reply
    // const post = reddit.getSubmission(randomPost.posts[0].postId)

    // if (!post) {
    //   return new TRPCError({ message: 'Could not find the post to reply', code: 'BAD_REQUEST' })
    // }

    // console.log(cleanedAiResponse)

    // Reply to the post
    // const redditReply = post.reply(cleanedAiResponse)

    //   if (!redditReply) {
    //       return new TRPCError({ message: 'Could not reply to post', code: 'BAD_REQUEST' })
    //   }

    //   // Extract the first 100 letters of the cleanedAiResponse
    //    const limitedReply = cleanedAiResponse.slice(0, 100);

     // Save reply into database
     const newReply = await db.insert(redditReplies).values({
          projectId,
          title: 'test',
          postAuthor: 'test',
          postId: randomPost.postId,
          postUrl: 'test',
          reply: randomPost.content
      }).returning({
        createdAt: redditReplies.id
      })

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