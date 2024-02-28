import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { openai } from "@/lib/openai";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { keywords } from "@/lib/db/schema/keyword";
import { and, eq } from "drizzle-orm";
import { redditCampaigns } from "@/lib/db/schema/reddit";

export const keywordRouter = router({
    //----------------------------------------------//CREATE KEYWORDS WITH AI//--------------------------------------//
    createKeywords: privateProcedure.input(z.object({ projectId: z.string(), projectDescription: z.string() })).mutation(async ({ input, ctx }) => {
        const { projectId, projectDescription } = input

        // Create keywords
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { 
                    role: 'system',
                    content: 'You are a helpful AI embedded in a keyword generator app' +
                    'AI can only answer with keywords, NEVER reply with a non list of keywords or a message besides the keywords' + 
                    'Keywords must be the closest to possible Reddit communities' +
                    'Always generate a list of 5 keywords' 
                },
                {
                    role: 'user',
                    content: `Generate a list of 5 relevant keywords on '${projectDescription}'`
                }
            ]
        })

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

          return { projectId }
    }),

    //---------------------------------------------------//UPDATE KEYWORD ORDER AND POSITION//------------------------//
    updateKeywordOrder: privateProcedure.input(z.object({ projectId: z.string(), items: z.any()})).mutation(async ({ ctx, input }) => {
         const { projectId, items } = input

         const project = await db.query.redditCampaigns.findFirst({
            columns: {
                id: true,
                userId: true
            },
            where: and(
                eq(redditCampaigns.id, projectId)
            ),
         })

         if (project?.userId !== ctx.userId) {
            return new TRPCError({ message: 'No project found', code: 'UNAUTHORIZED' })
         }
         
         try {
            const transaction = items.map(async(keyword: any) => {
                return await db.update(keywords).set({ 
                    order: keyword.order,
                    columnId: keyword.columnId
                 }).where(and(
                    eq(keywords.id, keyword.id),
                    eq(keywords.redditCampaignId, projectId)
                 ))
             })

             return { message: transaction }
         } catch (error) {
            return new TRPCError({ message: 'Could not update keyword order ', code: 'BAD_REQUEST' })
         }
    }),

    //--------------------------------------------------//GET ACTIVE KEYWORDS//------------------------------------//
    getActiveKeywords: privateProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {

        const { projectId } = input

        const project = await db.query.redditCampaigns.findFirst({
            columns: {
                id: true,
                userId: true
            },
            where: and(
                eq(redditCampaigns.id, projectId)
            ),
         })

         if (project?.userId !== ctx.userId) {
            return new TRPCError({ message: 'No project found', code: 'UNAUTHORIZED' })
         }

        const activeKeywords = await db.select({
            id: keywords.id,
            columnId: keywords.columnId
        }).from(keywords).where(and(
            eq(keywords.redditCampaignId, projectId),
            eq(keywords.columnId, '1')
        ))

        return { activeKeywords }
    })
})