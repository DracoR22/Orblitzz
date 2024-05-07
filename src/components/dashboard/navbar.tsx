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
import { AlertTriangleIcon, SparklesIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useAutoRedditReply } from "@/hooks/use-auto-reddit-reply"
import { checkPlanReplyLimit } from "@/lib/utils"
import { RedditCampaignType } from "@/lib/db/schema/reddit"
import { useActiveKeywords } from "@/hooks/states/use-keywords-available"
import Link from "next/link"
import { useUpdatePlanModal } from "@/hooks/modals/use-update-plan-modal"

interface NavbarProps {
  projectId: string
  allKeywords: string[]
  projectAutoReplyLimit:  Pick<RedditCampaignType, 'id' | 'title' | 'autoReply' | 'autoReplyLimit'>
  repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>>
  repliesCreatedToday: Awaited<ReturnType<typeof getMonthlyReplies>>
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const Navbar = ({ projectId, allKeywords, projectAutoReplyLimit, repliesCreatedThisMonth, repliesCreatedToday, subscriptionPlan }: NavbarProps) => {
  
  const { isReplyPossible } = checkPlanReplyLimit({ planName: subscriptionPlan.name!, repliesCreatedThisMonth });
  const { activeKeywords } = useActiveKeywords()

   const { onOpen: onOpenUpgrade } = useUpdatePlanModal()

  const { handleAutoReply } = useAutoRedditReply({ repliesCreatedThisMonth, allKeywords, subscriptionPlan, projectAutoReplyLimit, repliesCreatedToday, projectId })
  
  useEffect(() => {
    handleAutoReply();
  }, [repliesCreatedToday, projectAutoReplyLimit, subscriptionPlan]);

  return (
    <nav className="hidden sm:flex w-full h-[60px] dark:bg-[#363636] bg-[#f6f6f6]">
      <div className="flex flex-1 justify-end items-center">
        {/* SUBSCRIPTION BUTTON */}
      <div className="mx-6">
        <Button onClick={onOpenUpgrade} size='sm' className="text-white">
           Need more replies?
          <SparklesIcon className="w-4 h-4 ml-2"/>
        </Button>
      </div>
        {projectAutoReplyLimit?.autoReply && projectAutoReplyLimit.autoReplyLimit! >= 20 && activeKeywords.length < 5 && isReplyPossible && (
          <div className="mr-6">
            <ColoredText variant="alert" icon={AlertTriangleIcon}>
              You need at least 5 active keywords in order to use the auto-reply functionality. This way AI will have more posts to reply to.
            </ColoredText>
          </div>
        )}
         {projectAutoReplyLimit?.autoReply && projectAutoReplyLimit.autoReplyLimit! < 20 && activeKeywords.length < 2 && isReplyPossible && (
          <div className="mr-6">
            <ColoredText variant="alert" icon={AlertTriangleIcon}>
              You need at least 2 active keywords in order to use the auto-reply functionality. This way AI will have more posts to reply to.
            </ColoredText>
          </div>
        )}
        {!isReplyPossible && subscriptionPlan.name === 'Free' && (
          <div className="mr-6">
          <ColoredText variant="alert" icon={AlertTriangleIcon}>
            You ran out of free replies. Upgrade your plan for more replies
          </ColoredText>
        </div>
        )}
         {!isReplyPossible && subscriptionPlan.name !== 'Free' && (
          <div className="mr-6">
          <ColoredText variant="alert" icon={AlertTriangleIcon}>
            You ran out of replies for this month. Upgrade your plan for more replies
          </ColoredText>
        </div>
        )}
        <div className="pt-1">
            <UserMenu subscriptionPlan={subscriptionPlan}/>
        </div>
          <div className="px-4">
            <ThemeSwitcher/>
          </div>
      </div>
    </nav>
  )
}

export default Navbar

