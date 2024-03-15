'use client'

import { trpc } from "@/server/trpc/client"
import { ThemeSwitcher } from "../global/theme-switcher"
import UserMenu from "./user-menu"
import { toast } from "sonner"
import { ZodError } from "zod"
import { getMonthlyReplies, getProjectAutoreplyLimit } from "@/server/actions/reddit-actions"
import { PLANS } from "@/lib/stripe/plans"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { useEffect, useState } from "react"
import ColoredText from "../global/colored-text"
import { AlertTriangleIcon } from "lucide-react"

interface NavbarProps {
  projectId: string
  allKeywords: string[]
  projectAutoReplyLimit: Awaited<ReturnType<typeof getProjectAutoreplyLimit>>
  repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>>
  repliesCreatedToday: Awaited<ReturnType<typeof getMonthlyReplies>>
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const Navbar = ({ projectId, allKeywords, projectAutoReplyLimit, repliesCreatedThisMonth, repliesCreatedToday, subscriptionPlan }: NavbarProps) => {

  const [replyLimitReached, setReplyLimitReached] = useState(false);

  if (!projectAutoReplyLimit || !projectAutoReplyLimit.autoReplyLimit) {
    return
  }

  // Plan Limits
  const isFreeExceeded = repliesCreatedThisMonth.length >= PLANS.find((plan) => plan.name === 'Free')!.repliesPerMonth

  const { mutate: autoReplyMutation } = trpc.reddit.createAutoReply.useMutation({
   
    onSuccess: async () => {
       toast.success('AI has replied to a post!')
      await handleAutoReply(); // Call the function again on success
    },
    onError: async (err) => {
      if (err.data?.code === 'TOO_MANY_REQUESTS') {
        toast.error('Reply limit reached for today');
       
        setReplyLimitReached(true);
      } else if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        
      } else if (err.data?.code === 'FORBIDDEN') {
         await handleAutoReply()
      } else {
        toast.error('AI could not reply to this post at the moment');
        setReplyLimitReached(true);
      }
    },
  });

  const canPlanReply = () => {
    if (subscriptionPlan.name === 'Free' && isFreeExceeded) {
      return false
    }

    return true
  }

  const isReplyPossible = canPlanReply()
  // console.log(isReplyPossible)
  
  const handleAutoReply = async () => {
      // Check if activeKeywords.length is less than 5
    if (allKeywords.length < 5) {
        return; // Exit the function early if the condition is not met
    }
    // TODO: CHECK FOR ALL THE PLANS
    if ((replyLimitReached === false) && (projectAutoReplyLimit.autoReply) && (repliesCreatedToday.length <= projectAutoReplyLimit.autoReplyLimit) && (isReplyPossible)) {
      await autoReplyMutation({ projectId, allKeywords });
      console.log('AI replying')
    } else {
      return
    }
  };
  
  useEffect(() => {
    handleAutoReply();
  }, [repliesCreatedToday, projectAutoReplyLimit, subscriptionPlan, isFreeExceeded]);
  

  return (
    <nav className="hidden sm:flex w-full h-[60px] dark:bg-[#363636] bg-[#f6f6f6]">
      <div className="flex flex-1 justify-end items-center">
        {projectAutoReplyLimit.autoReply && allKeywords.length < 5 && isReplyPossible && (
          <div className="mx-6">
            <ColoredText variant="alert" icon={AlertTriangleIcon}>
              You need at least 5 active keywords in order to use the auto-reply functionality. This way AI will have more posts to reply to.
            </ColoredText>
          </div>
        )}
        {!isReplyPossible && (
          <div className="mx-6">
          <ColoredText variant="error" icon={AlertTriangleIcon}>
            You ran out of replies for this month. Upgrade your plan form more replies
          </ColoredText>
        </div>
        )}
        <div className="pt-1">
            <UserMenu/>
        </div>
          <div className="px-4">
            <ThemeSwitcher/>
          </div>
      </div>
    </nav>
  )
}

export default Navbar

