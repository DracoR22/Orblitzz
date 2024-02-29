import { createRedditInstance } from "@/lib/reddit";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Submission } from "snoowrap";
import { CreateReplySchema, RedditCampaignSchema } from "@/lib/validations/reddit-campaign-schema";
import { db } from "@/lib/db";
import { redditCampaigns, redditReplies } from "@/lib/db/schema/reddit";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { and, eq } from "drizzle-orm";
import { ResponseTypes } from "openai-edge";

export const redditRouter = router({
    //-------------------------------------------------//GET POSTS ON KEYBOARDS//------------------------------------//
    getSubredditsAndPosts: publicProcedure.input(z.object({ keywords: z.string() })).query(async({ input }) => {

        const { keywords } = input

        try {
            // Get the keys of the account we want to use. TODO: I think this should be better if we pass it from the frontend
            const userAgent = process.env.FIRST_REDDIT_USER_AGENT
            const clientId = process.env.FIRST_REDDIT_CLIENT_ID
            const clientSecret = process.env.FIRST_REDDIT_CLIENT_SECRET
            const username = process.env.FIRST_REDDIT_USERNAME
            const password = process.env.FIRST_REDDIT_PASSWORD

            if (!userAgent || !clientId || !clientSecret || !username || !password) {
                throw new TRPCError({ code: 'BAD_REQUEST' })
            }

            // Create our Reddit instance
            const reddit = createRedditInstance({ userAgent, clientId, clientSecret, username, password })

            // Get the subreddits that match our keywords
            const subredditResults = await reddit.search({
                query: keywords,
                subreddit: 'all',
                sort: 'relevance',
                time: 'all',
                syntax: 'plain'
            })

            if (!subredditResults || subredditResults.length < 1) {
                return new TRPCError({ code: 'NOT_FOUND' })
            }

            // Get the subreddit names
            const subredditNames = subredditResults.map(result => result.subreddit.display_name);

            // Array of latest posts
            const latestPosts = []

            const visitedSubreddits = new Set<string>();
              
            for (const subredditName of subredditNames) {
              // Skip the subreddit if it has been visited already
              if (visitedSubreddits.has(subredditName)) {
                 continue;
              }
              // TODO: CHANGE THIS LINE
              // Fetch the latest posts from the subreddit
              const posts = await reddit.getSubreddit(subredditName).getNew({ limit: 4 }); // Adjust the limit as needed

             // Extract relevant information from each post, filtering out posts without content
             const formattedPosts = posts
            .filter((post: Submission) => post.selftext.trim().length > 0) // Filter out posts without content
            .map((post: Submission) => ({
              postId: post.id,
              title: post.title,
              url: post.url,
              content: post.selftext,
              author: post.author.name,
              createdAt: new Date(post.created_utc * 1000).toLocaleString(),
             }));

               
             // Add the subreddit to the set of visited subreddits
             visitedSubreddits.add(subredditName);

            // Only add the subreddit if there are posts with content
            if (formattedPosts.length > 0) {
            latestPosts.push({
             subreddit: subredditName,
             posts: formattedPosts,
             });
             }
           }

            // Exclude subreddits with no posts
            const filteredLatestPosts = latestPosts.filter((subreddit) => subreddit.posts.length > 0);

             return filteredLatestPosts;
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
        const { userCredentials, postId, projectId, postContent } = input
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

        // Save reply into database
        const dbReply = await db.insert(redditReplies).values({
            projectId,
            content: postContent,
            postAuthor: post.author.name,
            postId,
            reply: cleanedAiResponse
        })

        // Save reply to database
         return dbReply
    })
})