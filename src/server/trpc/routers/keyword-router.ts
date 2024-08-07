import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { openai } from "@/lib/openai/openai";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { keywords } from "@/lib/db/schema/keyword";
import { and, eq } from "drizzle-orm";
import { redditCampaigns } from "@/lib/db/schema/reddit";
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe";
import { checkPlanKeywordsLimitServer } from "@/lib/utils";
import { CreateManualKeywordSchema, UpdateKeywordOrderInputSchema } from "@/lib/validations/campaign-keywords-schema";

export const keywordRouter = router({
//--------------------------------------------------------------------------------//CREATE KEYWORDS WITH AI//-----------------------------------------------------------------------//
    createKeywords: privateProcedure.input(z.object({ projectId: z.string(), projectDescription: z.string() })).mutation(async ({ input, ctx }) => {
        const { projectId, projectDescription } = input

        // Create keywords
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { 
                    role: 'system',
                    content: 'You are a helpful AI embedded in a keyword generator app' +
                    'AI can ONLY answer with keywords, NEVER reply with a non list of keywords or a message besides the keywords' + 
                    'Always generate a list of keywords' 
                },
                {
                    role: 'user',
                    content: `Generate a list of 5 keywords based on '${projectDescription}'`
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

          return { projectId }
    }),

//--------------------------------------------------------------------------------//CREATE MANUAL KEYWORD//-----------------------------------------------------------------------//
    createManualKeyword: privateProcedure.input(CreateManualKeywordSchema).mutation(async ({ ctx, input }) => {
       const { content, projectId } = input

       const subscriptionPlan = await getUserSubscriptionPlan()

       if (subscriptionPlan.name === 'Free') {
         throw new TRPCError({ message: 'Upgrade your plan to create your own keywords', code: 'UNAUTHORIZED' })
       }

       const projectKeywords = await db.query.keywords.findMany({
        columns: {
            id: true,
        },
        where: and(
            eq(keywords.redditCampaignId, projectId),
        ),
        // orderBy: (keywords, { asc }) => [asc(keywords.order)]
       })

       if (projectKeywords.length >= subscriptionPlan.keywords!) {
        throw new TRPCError({ message: 'You dont have any keywords left on your plan', code:'BAD_REQUEST' })
       }

       const lastKeyword = await db.query.keywords.findFirst({
        columns: {
            order: true
        },
        where: and(
            eq(keywords.redditCampaignId, projectId),
            eq(keywords.columnId, '3')
        ),
        orderBy: (keywords, { desc }) => [desc(keywords.order)]
       })

    //    console.log('last keyword order is:' + lastKeyword?.order)
       const newOrder = lastKeyword ? lastKeyword.order + 1 : 0

       // Create The Keyword
       const newKeyword = await db.insert(keywords).values({
        redditCampaignId: projectId,
        columnId: '3',
        order: newOrder,
        content,
        manual: true,
        originalColumnId: '3'
       })

       const allKeywords = await db.query.keywords.findMany({
        columns: {
            id: true,
            columnId: true,
            order: true,
            content: true,
            updatedAt: true,
            manual: true,
            originalColumnId: true
        },
        where: and(
            eq(keywords.redditCampaignId, projectId),
        ),
        // orderBy: (keywords, { asc }) => [asc(keywords.order)]
       })

       const manualKeywords = allKeywords.filter(keyword => keyword.originalColumnId === '3')

       // TODO: Right now user can create all the keywords they want, fix that
       if (manualKeywords.length >= 5) {
          throw new TRPCError({ message: 'You can only create up to 5 keywords', code: 'TOO_MANY_REQUESTS' })
       }
      
       return { allKeywords }
    }),

//-------------------------------------------------------------------------//UPDATE KEYWORD ORDER AND POSITION//-----------------------------------------------------------------//
    updateKeywordOrder: privateProcedure.input(UpdateKeywordOrderInputSchema).mutation(async ({ ctx, input }) => {
         const { projectId, items } = input

         const subscriptionPlan = await getUserSubscriptionPlan()

         const columnIds = items && items.map((keyword) => keyword.columnId);
        //  const activeKeywords = columnIds?.filter((columnId: string) => columnId === '1') as string[]

         const { isAddedKeywordPossible } = checkPlanKeywordsLimitServer({ activeKeywords: columnIds, planName: subscriptionPlan.name as string})

         console.log(columnIds)
        //  console.log(activeKeywords)

        if (columnIds.includes('1') && !isAddedKeywordPossible) {
            // console.log('Active keyword limit reached')
          throw new TRPCError({ message: 'Active keyword limit reached', code: 'TOO_MANY_REQUESTS' })
        }

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
            throw new TRPCError({ message: 'No project found', code: 'UNAUTHORIZED' })
         }
         
         try {
            const updatedKeywords = await Promise.all(items.map(async (keyword: any) => {
                const currentDate = new Date().toISOString();
                // Update the keyword
                await db.update(keywords)
                    .set({ 
                        order: keyword.order,
                        columnId: keyword.columnId,
                        updatedAt: currentDate
                    })
                    .where(
                        and(
                            eq(keywords.id, keyword.id),
                            eq(keywords.redditCampaignId, projectId)
                        )
                    );
        
                // Fetch the updated keyword data
                const updatedKeyword = await db.select({ columnId: keywords.columnId, updatedAt: keywords.updatedAt }).from(keywords).where(
                    and(
                        eq(keywords.id, keyword.id),
                        eq(keywords.redditCampaignId, projectId)
                    )
                );
        
                return updatedKeyword[0]; // Assuming only one keyword is updated
            }));
        
            return { updatedKeyword: updatedKeywords[0] }; // Return the array of updated keywords to the frontend
         } catch (error) {
            throw new TRPCError({ message: 'Could not update keyword order ', code: 'BAD_REQUEST' })
         }
    }),

//-------------------------------------------------------------------------//GET ALL PROJECT KEYWORDS//--------------------------------------------------------------------//
    getAllKeywords: privateProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
        const { projectId } = input

        const allKeywords = await db.query.keywords.findMany({
            columns: {
                id: true,
                columnId: true,
                order: true,
                content: true,
                updatedAt: true,
                originalColumnId: true
              },
              where: eq(keywords.redditCampaignId, projectId),
              orderBy: (keywords, { asc }) => [asc(keywords.order)]
        })

        return { allKeywords }
    }),

    deleteManualKeyword: privateProcedure.input(z.object({ projectId: z.string(), keywordId: z.string() })).mutation(async ({ ctx, input }) => {
        const { projectId, keywordId } = input

        const selectedKeyword = await db.query.keywords.findFirst({
            columns: {
              id: true,
              originalColumnId: true
            },
            where: and(
                eq(keywords.redditCampaignId, projectId),
                eq(keywords.id, keywordId)
            )
        })

        if (!selectedKeyword) {
            throw new TRPCError({ message: 'No keyword found', code: 'BAD_REQUEST' })
        }

        if (selectedKeyword.originalColumnId !== '3') {
            throw new TRPCError({ message: 'You can only delete keywords created manually', code: 'BAD_REQUEST' })
        }

        await db.delete(keywords).where(eq(keywords.id, selectedKeyword.id))

        const allKeywords = await db.query.keywords.findMany({
            columns: {
                id: true,
                columnId: true,
                order: true,
                content: true,
                updatedAt: true,
                manual: true,
                originalColumnId: true
            },
            where: and(
                eq(keywords.redditCampaignId, projectId),
            ),
            // orderBy: (keywords, { asc }) => [asc(keywords.order)]
           })
    

        return { allKeywords }
    })
})