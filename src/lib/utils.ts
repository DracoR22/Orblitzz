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

// COSINE SIMILARITY ALGORITHM
const cosineSimilarity = (vector1: number[], vector2: number[]): number => {
  const dotProduct = vector1.reduce((acc, val, index) => acc + val * vector2[index], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val ** 2, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val ** 2, 0));
  return dotProduct / (magnitude1 * magnitude2);
};

const tokenize = (text: string): string[] => {
  return text.split(/\s+/);
};

const vectorize = (tokens: string[], vocabulary: string[]): number[] => {
  return vocabulary.map(word => tokens.includes(word) ? 1 : 0);
};

export const calculateCosineSimilarity = (text1: string, text2: string): number => {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  // Create a vocabulary (set of unique tokens) from both texts
  const vocabulary = Array.from(new Set([...tokens1, ...tokens2]));

  // Vectorize both texts based on the vocabulary
  const vector1 = vectorize(tokens1, vocabulary);
  const vector2 = vectorize(tokens2, vocabulary);

  return cosineSimilarity(vector1, vector2);
};