import { getMonthlyReplies } from "@/server/actions/reddit-actions"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PLANS } from "./stripe/plans"
import { CheckPlanKeywordsLimitProps, CheckPlanLimitProps } from "@/types/types"

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
  const isStarterExceeded = repliesCreatedThisMonth.length >= PLANS.find((plan) => plan.name === 'Starter')!.repliesPerMonth
  const isProExceeded = repliesCreatedThisMonth.length >= PLANS.find((plan) => plan.name === 'Pro')!.repliesPerMonth

  // TODO: CHECK FOR ALL THE PLANS
  const canPlanReply = () => {
   if (planName === 'Free' && isFreeExceeded) {
      return false
    } else if (planName === 'Starter' && isStarterExceeded) {
      return false
    } else if (planName === 'Pro' && isProExceeded) {
      return false
    }

    return true
   }

 const isReplyPossible = canPlanReply()

 return { isReplyPossible }
}

export const checkPlanKeywordsLimitClient = ({ planName, activeKeywords }: CheckPlanKeywordsLimitProps) => {
   // Plan keywords limits
   const isFreeExceeded = activeKeywords && activeKeywords.length >= PLANS.find((plan) => plan.name === 'Free')!.keywords
   const isStarterExceeded = activeKeywords && activeKeywords.length >= PLANS.find((plan) => plan.name === 'Starter')!.keywords
   const isProExceeded = activeKeywords && activeKeywords.length >= PLANS.find((plan) => plan.name === 'Pro')!.keywords

   const canAddKeyword = () => {
    if (planName === 'Free' && isFreeExceeded) {
       return false
     } else if (planName === 'Starter' && isStarterExceeded) {
       return false
     } else if (planName === 'Pro' && isProExceeded) {
       return false
     }
 
     return true
    }

    const isAddedKeywordPossible = canAddKeyword()

    return { isAddedKeywordPossible }
}

export const checkPlanKeywordsLimitServer = ({ planName, activeKeywords }: CheckPlanKeywordsLimitProps) => {
  // Plan keywords limits
  const isFreeExceeded = activeKeywords.length > PLANS.find((plan) => plan.name === 'Free')!.keywords
  const isStarterExceeded = activeKeywords.length > PLANS.find((plan) => plan.name === 'Starter')!.keywords
  const isProExceeded = activeKeywords.length > PLANS.find((plan) => plan.name === 'Pro')!.keywords

  const canAddKeyword = () => {
   if (planName === 'Free' && isFreeExceeded) {
      return false
    } else if (planName === 'Starter' && isStarterExceeded) {
      return false
    } else if (planName === 'Pro' && isProExceeded) {
      return false
    }

    return true
   }

   const isAddedKeywordPossible = canAddKeyword()

   return { isAddedKeywordPossible }
}