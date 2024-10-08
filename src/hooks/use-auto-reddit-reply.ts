'use client'

import { PLANS } from "@/lib/stripe/plans";
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe";
import { getMonthlyReplies, getProjectAutoreplyLimit } from "@/server/actions/reddit-actions";
import { trpc } from "@/server/trpc/client";
import { useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useMonthlyReplies } from "./states/use-monthly-replies";
import { checkPlanReplyLimit } from "@/lib/utils";
import { RedditCampaignType } from "@/lib/db/schema/reddit";

interface Props {
    repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>>
    allKeywords: string[]
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
    repliesCreatedToday: Awaited<ReturnType<typeof getMonthlyReplies>>
    projectAutoReplyLimit:  Pick<RedditCampaignType, 'id' | 'title' | 'autoReply' | 'autoReplyLimit'>
    projectId: string
}

export const useAutoRedditReply = ({ repliesCreatedThisMonth, allKeywords, subscriptionPlan, projectAutoReplyLimit, repliesCreatedToday, projectId }: Props) => {
    const [replyLimitReached, setReplyLimitReached] = useState<boolean>(false);
    const { addReply } = useMonthlyReplies()
    //  console.log(`REPLIES THIS MONTH: ${repliesCreatedThisMonth}, ALL KEYWORDS: ${allKeywords}, SUBSCRIPTION PLAN: ${subscriptionPlan} PROJECT AUTO REPLY LIMIT: ${projectAutoReplyLimit}, REPLIES CREATED TODAY: ${repliesCreatedToday}, projectId: ${projectId}`)
    const { mutate: autoReplyMutation } = trpc.reddit.createAutoReply.useMutation({
   
        onSuccess: async ({ newReply }) => {
          toast.success('AI has replied to a post!')
          await handleAutoReply(); // Call the function again on success
          addReply(newReply[0])
        },
        onError: async (err: any) => {
          if (err.data?.code === 'TOO_MANY_REQUESTS') {
            toast.error('Reply limit reached for today');
           
            setReplyLimitReached(true);
          } else if (err instanceof ZodError) {
            toast.error(err.issues[0].message);
            
          } else if (err.data?.code === 'FORBIDDEN') {
             await handleAutoReply()
          } else if (err.data?.code === 'UNPROCESSABLE_CONTENT') {
            toast.error('Error while creating replies. Make sure you have at least 5 active keywords')
            setReplyLimitReached(true)
          } else {
            // toast.error('AI could not reply to this post at the moment');
            console.log(err)
            setReplyLimitReached(true);
          }
        },
      });

       // Plan Limits
       const { isReplyPossible } = checkPlanReplyLimit({ planName: subscriptionPlan.name!, repliesCreatedThisMonth });
  
      const handleAutoReply = async () => {
      // Check if activeKeywords.length is less than 5
       if (projectAutoReplyLimit.autoReplyLimit! >= 20 && allKeywords.length < 5) {
        console.log('Insufficient keywords', allKeywords.length)
           return; // Exit the function early if the condition is not met
        }

        if (projectAutoReplyLimit.autoReplyLimit! < 20 && allKeywords.length < 2) {
          console.log('Insufficient keywords', allKeywords.length)
             return; // Exit the function early if the condition is not met
          }
   
       if ((replyLimitReached === false) && (projectAutoReplyLimit?.autoReply) && (repliesCreatedToday.length < projectAutoReplyLimit.autoReplyLimit!) && (isReplyPossible)) {
         await autoReplyMutation({ projectId, allKeywords });
           console.log('AI replying')
        } else {
          // console.log('AI NOT replying')
          return
      }
   }; 

   return { handleAutoReply }
}