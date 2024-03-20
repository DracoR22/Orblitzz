import { getMonthlyReplies } from "@/server/actions/reddit-actions"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PLANS } from "./stripe/plans"

interface CheckPlanLimitProps {
  planName: string
  repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>> 
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export const checkPlanReplyLimit = ({ planName, repliesCreatedThisMonth }: CheckPlanLimitProps) => {
  // Plan Limits
  const isFreeExceeded = repliesCreatedThisMonth.length >= PLANS.find((plan) => plan.name === 'Free')!.repliesPerMonth

  // TODO: CHECK FOR ALL THE PLANS
  const canPlanReply = () => {
   if (planName === 'Free' && isFreeExceeded) {
      return false
    }

      return true
   }

 const isReplyPossible = canPlanReply()

 return { isReplyPossible }
}