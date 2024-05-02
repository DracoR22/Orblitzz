'use server'

import { currentUser } from "@/lib/auth/get-server-session"
import { db } from "@/lib/db"
import { redditCampaigns, redditReplies } from "@/lib/db/schema/reddit"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { subMonths } from "date-fns"
import { and, asc, eq } from "drizzle-orm"

export interface GraphData {
  name: string;
  replies: number;
  
}

//-----------------------------------------------------//SEE IF A USER HAS A PROJECT TO REDIRECT TO//---------------------------------------//
export const getFirstCampaign = async () => {
   // Validate user
   const user = await currentUser()

   if (!user || !user.id) {
      throw new Error("User not authenticated or missing user ID.");
   }

   const campaign = await db.query.redditCampaigns.findFirst({
    columns: {
        id: true,
        userId: true
    },
    where: eq(redditCampaigns.userId, user.id)
   })

   return campaign
}

export const getRedditReplies = async (projectId: string) => {
    const reply = await db.select().from(redditReplies).orderBy(asc(redditReplies.createdAt)).where(eq(redditReplies.projectId, projectId))

    return reply
}

//----------------------------------------------------//GET PROJECT BY ID//---------------------------------------------------------------//
export const getRedditCampaignDetails = async (projectId: string) => {
     // Validate user
     const user = await currentUser()

     if (!user || !user.id) {
        throw new Error("User not authenticated or missing user ID.");
     }

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
            eq(redditCampaigns.userId, user.id)
        )
    })

    return campaign
}

//-----------------------------------------------------//GET THE AUTO REPLY LIMIT OF A PROJECT//----------------------------------------//
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

//-----------------------------------------------------//GET ALL USER PROJECTS//-------------------------------------------------------//
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

//---------------------------------------------------//GET PROJECT THIS MONTH REPLIES COUNT//------------------------------------------//
export const getMonthlyReplies = async (projectId: string, subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>) => {
    // Validate user
    const user = await currentUser()

    if (!user || !user.id) {
      throw new Error("User not authenticated or missing user ID.");
    }

    // Check the ammount of replies. 
    const allProjectReplies = await db.query.redditReplies.findMany({
        columns: {
          createdAt: true
        },
        where: and(
          eq(redditReplies.projectId, projectId),
        ),
        orderBy: (redditReplies, { desc }) => [desc(redditReplies.createdAt)]
      })

      if (subscriptionPlan.name === 'Free') {

        return allProjectReplies
      } else {
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
}

//-----------------------------------------//GET COUNT OF ALL USER PROJECTS//---------------------------------------------------------------------//
export const getAllUserProjectsCount = async () => {
  const user = await currentUser()

  if (!user || !user.id) {
    throw new Error("User not authenticated or missing user ID.");
  }

  const allUserProjects = await db.select({
    id: redditCampaigns.id,
    createdAt: redditCampaigns.createdAt,
    title: redditCampaigns.title
  }).from(redditCampaigns).where(eq(redditCampaigns.userId, user.id))

  return allUserProjects
}

//------------------------------------------//GET ALL MONTHS, LAST 2 MONTHS AND LATEST REPLY//---------------------------------------------------//
export const getGraphProjectReplies = async (projectId: string) => {
  try {
    // Validate user
    const user = await currentUser()

    if (!user || !user.id) {
       throw new Error("User not authenticated or missing user ID.");
    }

     const projectReplies = await db.query.redditReplies.findMany({
        columns: {
           createdAt: true
        },
        where: eq(redditReplies.projectId, projectId),
        orderBy: (redditReplies, { desc }) => [desc(redditReplies.createdAt)]
     });

     const monthlyReplies: { [key: string]: number } = {};
     
     // Counting the number of replies in each month
     for (const reply of projectReplies) {
        const replyDate = new Date(reply.createdAt);
        const yearMonth = replyDate.toISOString().slice(0, 7); // Year-month format
        monthlyReplies[yearMonth] = (monthlyReplies[yearMonth] || 0) + 1;
     }

     // Converting the grouped data into the format expected by the graph
     const allMonthsData: GraphData[] = [];
     const currentDate = new Date();
     for (let month = 0; month < 12; month++) {
        const monthName = new Date(currentDate.getFullYear(), month).toLocaleString('default', { month: 'short' });
        const yearMonth = currentDate.getFullYear() + '-' + (month + 1).toString().padStart(2, '0');
        allMonthsData.push({ name: monthName, replies: monthlyReplies[yearMonth] || 0 });
     }

      // Filter replies for the last two months
      const lastTwoMonths = subMonths(new Date(), 1); // Get the date for two months ago
      const filteredReplies = projectReplies.filter(reply => new Date(reply.createdAt) >= lastTwoMonths);

      const lastTwoMonthsReplies: { [key: string]: number } = {};

      // Count the number of replies in each month
      for (const reply of filteredReplies) {
          const replyDate = new Date(reply.createdAt);
          const yearMonth = replyDate.toISOString().slice(0, 7); // Year-month format
          lastTwoMonthsReplies[yearMonth] = (lastTwoMonthsReplies[yearMonth] || 0) + 1;
      }

      // Converting the grouped data into the format expected by the graph
      const lastTwoMonthsData: GraphData[] = [];
      for (let month = 0; month < 2; month++) { // Only the last two months
          const monthName = new Date(currentDate.getFullYear(), currentDate.getMonth() - month).toLocaleString('default', { month: 'short' });
          const yearMonth = currentDate.getFullYear() + '-' + (currentDate.getMonth() - month + 1).toString().padStart(2, '0');
          lastTwoMonthsData.push({ name: monthName, replies: lastTwoMonthsReplies[yearMonth] || 0 }); // Push to the beginning of the array
      }

      // Calculate the percentage difference
      const repliesThisMonth = lastTwoMonthsData[0].replies || 0;
      const repliesLastMonth = lastTwoMonthsData[1].replies || 0;
      const percentageDifference = repliesLastMonth !== 0 ? ((repliesThisMonth - repliesLastMonth) / repliesLastMonth) * 100 : 100;

      lastTwoMonthsData.reverse();

      // Get the replies created this month
      const repliesCreatedThisMonth = projectReplies.filter(reply => {
        const replyDate = new Date(reply.createdAt);
        const currentDate = new Date();
      
        return (
          replyDate.getMonth() === currentDate.getMonth() &&
          replyDate.getFullYear() === currentDate.getFullYear()
        );
      });

      // Get the latest reply
      const latestReply = projectReplies[0]

      return { lastTwoMonthsData, percentageDifference, allMonthsData, repliesCreatedThisMonth, latestReply, projectReplies }
    } catch (error) {
     console.error('Error fetching graph project replies:', error);
     throw error; // Re-throw the error for higher-level error handling
  }
}