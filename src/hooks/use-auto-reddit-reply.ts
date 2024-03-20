'use client'

import { PLANS } from "@/lib/stripe/plans";
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe";
import { getMonthlyReplies, getProjectAutoreplyLimit } from "@/server/actions/reddit-actions";
import { trpc } from "@/server/trpc/client";
import { useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useMonthlyReplies } from "./use-monthly-replies";
import { checkPlanReplyLimit } from "@/lib/utils";

interface Props {
    repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>>
    allKeywords: string[]
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
    repliesCreatedToday: Awaited<ReturnType<typeof getMonthlyReplies>>
    projectAutoReplyLimit: Awaited<ReturnType<typeof getProjectAutoreplyLimit>>
    projectId: string
}

export const useAutoRedditReply = ({ repliesCreatedThisMonth, allKeywords, subscriptionPlan, projectAutoReplyLimit, repliesCreatedToday, projectId }: Props) => {
    const [replyLimitReached, setReplyLimitReached] = useState<boolean>(false);
    const { addReply } = useMonthlyReplies()

    const { mutate: autoReplyMutation } = trpc.reddit.createAutoReply.useMutation({
   
        onSuccess: async ({ newReply }) => {
          toast.success('AI has replied to a post!')
          await handleAutoReply(); // Call the function again on success
          addReply(newReply[0])
        },
        onError: async (err) => {
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
            toast.error('AI could not reply to this post at the moment');
            setReplyLimitReached(true);
          }
        },
      });

       // Plan Limits
       const { isReplyPossible } = checkPlanReplyLimit({ planName: subscriptionPlan.name!, repliesCreatedThisMonth });
  
      const handleAutoReply = async () => {
      // Check if activeKeywords.length is less than 5
       if (allKeywords.length < 5) {
           return; // Exit the function early if the condition is not met
        }
   
       if ((replyLimitReached === false) && (projectAutoReplyLimit?.autoReply) && (repliesCreatedToday.length < projectAutoReplyLimit.autoReplyLimit) && (isReplyPossible)) {
         await autoReplyMutation({ projectId, allKeywords });
           console.log('AI replying')
        } else {
          return
      }
   }; 

   return { handleAutoReply }
}