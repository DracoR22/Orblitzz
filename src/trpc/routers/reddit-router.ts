import { createRedditInstance } from "@/lib/reddit";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Submission } from "snoowrap";
import { RedditCampaignSchema } from "@/lib/validations/reddit-campaign-schema";
import { db } from "@/lib/db";
import { redditCampaigns } from "@/lib/db/schema/reddit";
import { z } from "zod";

export const redditRouter = router({
    //-------------------------------------------------//GET POSTS ON KEYBOARDS//------------------------------------//
    getSubredditsAndPosts: publicProcedure.input(z.object({ keywords: z.string() })).query(async({ input }) => {

        const { keywords } = input

        try {
            // Get The Keywords
            const keywords = 'programming'

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
    })
})