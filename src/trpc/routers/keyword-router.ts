import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { openai } from "@/lib/openai";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { keywords } from "@/lib/db/schema/keyword";

export const keywordRouter = router({
    createKeywords: privateProcedure.input(z.object({ projectId: z.string(), projectDescription: z.string() })).mutation(async ({ input, ctx }) => {
        const { projectId, projectDescription } = input

        console.log(`project id is: ${projectId}. And project description is ${projectDescription}`)

        // Create keywords
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { 
                    role: 'system',
                    content: 'You are a helpful AI embedded in a keyword generator app' +
                    'AI can only answer with keywords and other things that are not relevant keywords must not be added in the response'
                },
                {
                    role: 'user',
                    content: `Generate 5 relevant keywords on '${projectDescription}'`
                }
            ]
        })

        if (!response) {
            return new TRPCError({ code: 'BAD_REQUEST', message: 'No response from OpenAI' })
        }
        

         // Get the keywords array and push them into the database
          const data = await response.json()

          const keywordPattern = /\d+\.\s*(\S+)/g;

          const matches = data.choices[0].message.content.matchAll(keywordPattern);

          const keywordsOpenai = Array.from(matches, (match: any) => match[1].trim());

          // TODO: I think there is a more efficient way of doing this.
          const trimmedFirstKeyword = keywordsOpenai[0].trim();
          const trimmedSecondKeyword = keywordsOpenai[1].trim();
          const trimmedThirdKeyword = keywordsOpenai[2].trim();
          const trimmedFourthKeyword = keywordsOpenai[3].trim();
          const trimmedFifthKeyword = keywordsOpenai[4].trim();

         const insertedKeyword = await db.insert(keywords).values({
              redditCampaignId: projectId,
              columnId: '2',
              order: 1,
              content: trimmedFirstKeyword,
         })

         const insertedKeywordS = await db.insert(keywords).values({
            redditCampaignId: projectId,
            columnId: '2',
            order: 2,
            content: trimmedSecondKeyword,
        })

         const insertedKeywordT = await db.insert(keywords).values({
            redditCampaignId: projectId,
            columnId: '2',
            order: 3,
            content: trimmedThirdKeyword,
        })

        const insertedKeywordF = await db.insert(keywords).values({
            redditCampaignId: projectId,
            columnId: '2',
            order: 4,
            content: trimmedFourthKeyword,
        })

       const insertedKeywordFi = await db.insert(keywords).values({
          redditCampaignId: projectId,
          columnId: '2',
          order: 5,
          content: trimmedFifthKeyword,
       })

          return { message: 'Ok' }
    }),

    updateKeywordOrder: privateProcedure.input (z.object({ columnId: z.string(), items: z.any()})).mutation(async ({ ctx, input }) => {
       try {
         const { columnId, items } = input
       } catch (error) {
         
       }
    })
})