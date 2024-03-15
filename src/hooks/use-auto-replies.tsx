'use client'

import { PLANS } from "@/lib/stripe/plans"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { getMonthlyReplies, getProjectAutoreplyLimit } from "@/server/actions/reddit-actions"
import { trpc } from "@/server/trpc/client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ZodError } from "zod"

interface UseAutoRepliesProps {
    projectId: string
    allKeywords: string[]
    projectAutoReplyLimit: Awaited<ReturnType<typeof getProjectAutoreplyLimit>>
    repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>>
    repliesCreatedToday: Awaited<ReturnType<typeof getMonthlyReplies>>
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
    autoReplyMutation: (variables?: any) => Promise<void>;
}

export const useAutoReplies = ({ projectId, allKeywords, projectAutoReplyLimit, repliesCreatedThisMonth, repliesCreatedToday, subscriptionPlan, autoReplyMutation }: UseAutoRepliesProps) => {
    const [replyLimitReached, setReplyLimitReached] = useState<boolean>(false);
    
    useEffect(() => {
      if (!projectAutoReplyLimit || !projectAutoReplyLimit.autoReplyLimit) {
        return;
      }

      const isFreeExceeded = repliesCreatedThisMonth.length >= PLANS.find((plan) => plan.name === 'Free')!.repliesPerMonth;
  
      const canPlanReply = () => {
        if (subscriptionPlan.name === 'Free' && isFreeExceeded) {
          return false;
        }
        return true;
      };
  
      const isReplyPossible = canPlanReply();
  
      const handleAutoReply = async () => {
        if (allKeywords.length < 5) {
          return;
        }
  
        if ((replyLimitReached === false) && (projectAutoReplyLimit.autoReply) && (repliesCreatedToday.length <= projectAutoReplyLimit.autoReplyLimit) && (isReplyPossible)) {
            await autoReplyMutation({ projectId, allKeywords });
            console.log('AI replying')
          }
      };
  
      handleAutoReply();
    }, [projectId, allKeywords, projectAutoReplyLimit, repliesCreatedThisMonth, repliesCreatedToday, subscriptionPlan, replyLimitReached]);
  
    return { replyLimitReached };
  };