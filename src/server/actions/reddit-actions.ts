'use server'

import { db } from "@/lib/db"
import { redditCampaigns, redditReplies } from "@/lib/db/schema/reddit"
import { and, eq } from "drizzle-orm"

export const getFirstCampaign = async (userId: string) => {
   const campaign = await db.query.redditCampaigns.findFirst({
    columns: {
        id: true,
        userId: true
    },
    where: eq(redditCampaigns.userId, userId)
   })

   return campaign
}

export const getRedditReplies = async (projectId: string) => {
    const reply = await db.select().from(redditReplies).orderBy(redditReplies.createdAt).where(eq(redditReplies.projectId, projectId))

    return reply
}

export const getRedditCampaignDetails = async (projectId: string, userId: string) => {
    const campaign = await db.query.redditCampaigns.findFirst({
        columns: {
            title: true,
            description: true,
            autoReply: true,
            tone: true,
            url: true,
            autoReplyLimit: true
        },
        where: and(
            eq(redditCampaigns.id, projectId),
            eq(redditCampaigns.userId, userId)
        )
    })

    return campaign
}