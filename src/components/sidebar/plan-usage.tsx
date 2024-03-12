'use client'

import { useEffect, useState } from "react"
import DiamondIcon from "../icons/diamond-icon"
import { Progress } from "../ui/progress"
import { trpc } from "@/server/trpc/client"
import { useParams } from "next/navigation"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"

interface PlanUsageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const PlanUsage = ({ subscriptionPlan }: PlanUsageProps) => {

  const params = useParams()

  const { data } = trpc.reddit.getProjectReplies.useQuery({ projectId: params.projectId as string })

  if (!data) {
    return (
      <article className="mb-4">
    <div className="flex gap-2 text-neutral-400 mb-2 items-center">
      <div className="flex justify-between w-full items-center">
        <div className="h-4 w-4">
          {/* <Image src={'/sidebar/reddit-logo.svg'} height={18} width={18} alt="" /> */}
          <DiamondIcon/>
        </div>
        <div className="text-sm">Free Plan</div>
        <small>0 / {subscriptionPlan.repliesPerMonth as number} Replies</small>
      </div>
    </div>
    <Progress value={(0 / (subscriptionPlan.repliesPerMonth as number || 3)) * 100} className="h-1" />
  </article>
    )
  }


  return (
    <article className="mb-4">
    <div className="flex gap-2 text-neutral-400 mb-2 items-center">
      <div className="flex justify-between w-full items-center">
        <div className="h-4 w-4">
          {/* <Image src={'/sidebar/reddit-logo.svg'} height={18} width={18} alt="" /> */}
          <DiamondIcon/>
        </div>
        <div className="text-sm">Free Plan</div>
        <small>{data.length.toFixed(0)} / {subscriptionPlan.repliesPerMonth as number} Replies</small>
      </div>
    </div>
    <Progress value={(data.length / (subscriptionPlan.repliesPerMonth as number || 3)) * 100} className="h-1" />
  </article>
  )
}

export default PlanUsage