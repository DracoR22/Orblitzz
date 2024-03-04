import { createRedditInstance } from "@/lib/reddit";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Submission } from "snoowrap";
import { CreateReplySchema, GetPostsSchema, RedditCampaignSchema } from "@/lib/validations/reddit-campaign-schema";
import { db } from "@/lib/db";
import { redditCampaigns, redditReplies } from "@/lib/db/schema/reddit";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { and, eq } from "drizzle-orm";
import { ResponseTypes } from "openai-edge";

export const redditRouter = router({
    //-------------------------------------------------//GET POSTS ON KEYWORDS//------------------------------------//
    getSubredditsAndPosts: publicProcedure.input(GetPostsSchema).query(async({ input }) => {

        const { allKeywords, userCredentials } = input

        try { 
            // Create our Reddit instance
            const reddit = createRedditInstance({ clientId: userCredentials.clientId,clientSecret : userCredentials.clientSecret, userAgent: userCredentials.userAgent, username: userCredentials.username, password: userCredentials.password })

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
                    .slice(0, 10)
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

    //---------------------------------------------//CREATE REDDIT PROJECT//---------------------------------//
    createRedditProject: privateProcedure.input(RedditCampaignSchema).mutation(async ({ input, ctx }) => {
        const { userId } = ctx
        const { autoReply, description, title, tone, url, image } = input

        // TODO: check for user subscription
        const project = await db.insert(redditCampaigns).values({
            image,
            title,
            tone,
            description,
            autoReply,
            url,
            userId
        }).returning({
            insertedId: redditCampaigns.id,
            description: redditCampaigns.description
        })

        console.log(project)

         return { projectId: project[0].insertedId, projectDescription: project[0].description }
    }),

    //--------------------------------------------//CREATE REPLY//------------------------------------------//
    createReply: privateProcedure.input(CreateReplySchema).mutation(async ({ ctx, input }) => {
        const { userCredentials, postId, projectId, postContent, postAuthor, postUrl, postTitle } = input
        const { userId } = ctx

        // Get the Reddit project
        const project = await db.query.redditCampaigns.findFirst({
            columns: {
              id: true, 
              tone: true, 
              title: true,
              description: true
            },
            where: and(
                eq(redditCampaigns.id, projectId),
                eq(redditCampaigns.userId, userId)
            )
        })

        if (!project) {
            return new TRPCError({ message: 'No project found', code: 'UNAUTHORIZED' })
        }

        // Check if already replied to the same post
        const alreadyReplied = await db.query.redditReplies.findFirst({
            columns: {
              postId: true
            },
            where: and(
                eq(redditReplies.postId, postId)
            )
        })

        if (alreadyReplied) {
            return new TRPCError({ message: 'Already replied to this post', code: 'FORBIDDEN' })
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
                     Incorporate mentions of a specific product, ${project.title}, into your
                     replies. Here's a brief description of the product: ${project.description}.
                     Your objective is to share valuable information while subtly promoting
                     this product.`,
                },
                {
                    role: 'user',
                    content: `You come across this Reddit post: ${postContent}. 
                    Respond to it as you typically would, providing relevant and insightful
                    information. Also, feel free to incorporate your thoughts on different aspects
                    and mention ${project.title} if it fits naturally.`
                }
            ]
        })

        if (!response) {
            return new TRPCError({ message: 'No Openai response', code: 'BAD_REQUEST' })
        }

        const responseData = (await response.json() as ResponseTypes["createChatCompletion"])
        const cleanedAiResponse = responseData.choices[0].message?.content

        if (!cleanedAiResponse) {
            return new TRPCError({ message: 'Could not clean the AI response', code: 'BAD_REQUEST' })
        }

        // Get the post to reply
        const post = reddit.getSubmission(postId)

        if (!post) {
            return new TRPCError({ message: 'Could not find the post to reply', code: 'BAD_REQUEST' })
        }

        // Reply to the post
        const redditReply = post.reply(cleanedAiResponse)

        if (!redditReply) {
            return new TRPCError({ message: 'Could not reply to post', code: 'BAD_REQUEST' })
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
        })

        // Save reply to database
         return dbReply
    })
})