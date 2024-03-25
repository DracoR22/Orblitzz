import { getMonthlyReplies } from "@/server/actions/reddit-actions"

export interface CheckPlanLimitProps {
    planName: string
    repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>> 
}

export interface CheckPlanKeywordsLimitProps {
    planName: string
    activeKeywords: string[]
}