'use server'

import { db } from "@/lib/db"
import { keywords } from "@/lib/db/schema/keyword"
import { and, asc, eq } from "drizzle-orm"

export const getActiveKeywords = async (projectId: string) => {
    const activeKeywords = await db.select({
        id: keywords.id,
        columnId: keywords.columnId,
        content: keywords.content
    }).from(keywords).where(and(
        eq(keywords.redditCampaignId, projectId),
        eq(keywords.columnId, '1')
    )).orderBy(asc(keywords.order))

    return activeKeywords
}