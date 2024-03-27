import { getMonthlyReplies } from "@/server/actions/reddit-actions"

export interface CheckPlanLimitProps {
    planName: string
    repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>> 
}

export interface CheckPlanKeywordsLimitProps {
    planName: string
    activeKeywords: string[]
}

export interface ReplyOutputProps {
    projectTone: string
    projectTitle: string
    projectUrl: string
    projectDescription: string
    postContent: string
}