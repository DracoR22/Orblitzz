'use server'

import { currentUser } from "@/lib/auth/get-server-session"
import { db } from "@/lib/db"
import { redditCampaigns, redditReplies } from "@/lib/db/schema/reddit"
import { and, asc, eq } from "drizzle-orm"

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
    const reply = await db.select().from(redditReplies).orderBy(asc(redditReplies.createdAt)).where(eq(redditReplies.projectId, projectId))

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

export const getProjectAutoreplyLimit = async (projectId: string, userId: string) => {
  const campaign = await db.query.redditCampaigns.findFirst({
    columns: {
      id: true,
      autoReplyLimit: true,
      autoReply: true,
      title: true
    },
    where: and(
      eq(redditCampaigns.id, projectId),
      eq(redditCampaigns.userId, userId)
    )
  })

  return campaign
}

export const getAllUserProjects = async () => {
  const user = await currentUser()

   if (!user || !user.id) {
      return []
   }

  const allUserProjects = await db.select({
    id: redditCampaigns.id,
    autoReplyLimit: redditCampaigns.autoReplyLimit,
    autoReply: redditCampaigns.autoReply,
    title: redditCampaigns.title
  }).from(redditCampaigns).where(eq(redditCampaigns.userId, user.id))

  return allUserProjects
}

export const getMonthlyReplies = async (projectId: string) => {
    // Check the ammount of replies. 
    const allProjectReplies = await db.query.redditReplies.findMany({
        columns: {
          createdAt: true
        },
        where: and(
          eq(redditReplies.projectId, projectId),
        )
      })

      const repliesCreatedThisMonth = allProjectReplies.filter(reply => {
        const replyDate = new Date(reply.createdAt);
        const currentDate = new Date();
      
        return (
          replyDate.getMonth() === currentDate.getMonth() &&
          replyDate.getFullYear() === currentDate.getFullYear()
        );
      });

      return repliesCreatedThisMonth
}

// export const getAllUserProjects = async () => {
//    const user = await currentUser()

//    if (!user || !user.id) {
//       return
//    }

//    const allUserProjects = await db.query.redditCampaigns.findMany({
//       columns: {
//         id: true,
//         title: true
//       },
//       where: eq(redditCampaigns.userId, user.id)
//    })

//    return allUserProjects
// }