'use server'

import { currentUser } from "@/lib/auth/get-server-session"
import { db } from "@/lib/db"
import { redditCampaigns, redditReplies } from "@/lib/db/schema/reddit"
import { subMonths } from "date-fns"
import { and, asc, eq } from "drizzle-orm"

export interface GraphData {
  name: string;
  replies: number;
  
}

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

export const getAllUserProjectsCount = async () => {
  const user = await currentUser()

   if (!user || !user.id) {
      return []
   }

  const allUserProjects = await db.select({
    createdAt: redditCampaigns.createdAt
  }).from(redditCampaigns).where(eq(redditCampaigns.userId, user.id))

  return allUserProjects
}

//----------------------------------------------//GET ALL MONTHS REDDIT REPLIES//--------------------------------------------------------//
export const getGraphProjectReplies = async (projectId: string): Promise<GraphData[]>  => {
  try {
     const projectReplies = await db.query.redditReplies.findMany({
        columns: {
           createdAt: true
        },
        where: eq(redditReplies.projectId, projectId)
     });

     const monthlyReplies: { [key: string]: number } = {};
     
     // Counting the number of replies in each month
     for (const reply of projectReplies) {
        const replyDate = new Date(reply.createdAt);
        const yearMonth = replyDate.toISOString().slice(0, 7); // Year-month format
        monthlyReplies[yearMonth] = (monthlyReplies[yearMonth] || 0) + 1;
     }

     // Converting the grouped data into the format expected by the graph
     const graphData: GraphData[] = [];
     const currentDate = new Date();
     for (let month = 0; month < 12; month++) {
        const monthName = new Date(currentDate.getFullYear(), month).toLocaleString('default', { month: 'short' });
        const yearMonth = currentDate.getFullYear() + '-' + (month + 1).toString().padStart(2, '0');
        graphData.push({ name: monthName, replies: monthlyReplies[yearMonth] || 0 });
     }



     return graphData
  } catch (error) {
     console.error('Error fetching graph project replies:', error);
     throw error; // Re-throw the error for higher-level error handling
  }
}

export const getLastTwoMonthsReplies = async (projectId: string) => {
  try {
    const projectReplies = await db.query.redditReplies.findMany({
      columns: {
         createdAt: true
        },
        where: eq(redditReplies.projectId, projectId)
      });

      // Filter replies for the last two months
      const lastTwoMonths = subMonths(new Date(), 1); // Get the date for two months ago
      const filteredReplies = projectReplies.filter(reply => new Date(reply.createdAt) >= lastTwoMonths);

      const monthlyReplies: { [key: string]: number } = {};

      // Count the number of replies in each month
      for (const reply of filteredReplies) {
          const replyDate = new Date(reply.createdAt);
          const yearMonth = replyDate.toISOString().slice(0, 7); // Year-month format
          monthlyReplies[yearMonth] = (monthlyReplies[yearMonth] || 0) + 1;
      }

      // Converting the grouped data into the format expected by the graph
      const graphData: GraphData[] = [];
      const currentDate = new Date();
      for (let month = 0; month < 2; month++) { // Only the last two months
          const monthName = new Date(currentDate.getFullYear(), currentDate.getMonth() - month).toLocaleString('default', { month: 'short' });
          const yearMonth = currentDate.getFullYear() + '-' + (currentDate.getMonth() - month + 1).toString().padStart(2, '0');
          graphData.push({ name: monthName, replies: monthlyReplies[yearMonth] || 0 }); // Push to the beginning of the array
      }

        // Calculate the percentage difference
    const repliesThisMonth = graphData[0].replies || 0;
    const repliesLastMonth = graphData[1].replies || 0;
    const percentageDifference = repliesLastMonth !== 0 ? ((repliesThisMonth - repliesLastMonth) / repliesLastMonth) * 100 : 100;

    graphData.reverse();
      return {graphData, percentageDifference}
  } catch (error) {
      console.error('Error fetching graph project replies:', error);
      throw error; // Re-throw the error for higher-level error handling
  }
}


export const getLastReply = async (projectId: string) => {
   const latestReply = await db.query.redditReplies.findFirst({
    columns: {
      createdAt: true
    },
    where: eq(redditReplies.projectId, projectId),
    orderBy: (redditReplies, { desc }) => [desc(redditReplies.createdAt)]
   })

   return latestReply
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