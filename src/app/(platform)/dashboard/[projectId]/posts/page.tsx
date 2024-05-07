import Heading from "@/components/global/heading"
import Posts from "@/components/posts/posts"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { keywords } from "@/lib/db/schema/keyword"
import { redditReplies } from "@/lib/db/schema/reddit"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { checkPlanReplyLimit } from "@/lib/utils"
import { getActiveKeywords } from "@/server/actions/keyword-actions"
import { getMonthlyReplies } from "@/server/actions/reddit-actions"
import { and, eq } from "drizzle-orm"
import { BotIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"

const PostsPage = async ({ params }: { params: { projectId: string }}) => {

    const userSubscription = await getUserSubscriptionPlan()

    if (!userSubscription.name) {
      return null
    }

    const repliesCreatedThisMonth = await getMonthlyReplies(params.projectId, userSubscription)

    const { isReplyPossible } = checkPlanReplyLimit({ planName: userSubscription.name, repliesCreatedThisMonth })

    
    if (!isReplyPossible) {
      return (
        <div className="flex items-center h-[90%] w-full justify-center">
          <div className="flex-col text-center">
            <h2 className="font-semibold text-2xl mb-4">
              You ran out of replies!
            </h2>
            <p className="text-sm text-muted-foreground">
              If you want more replies you can upgrade your current plan
            </p>
            <Button asChild className="text-white font-medium mt-4">
              <Link href={`/dashboard/${params.projectId}/billing`}>
                Upgrade your plan
                <SparklesIcon className="ml-2 w-4 h-4"/>
              </Link>
            </Button>
          </div>
        </div>
      )
    }

    // Check if already replied to the same post
    const alreadyReplied = await db.query.redditReplies.findMany({
      columns: {
        postId: true
      },
      where: and(
          eq(redditReplies.projectId, params.projectId),
      )
  })

  // Active keywords
  const activeKeywords = await getActiveKeywords(params.projectId)

  if (activeKeywords.length < 1) {
    return(
      <div className="flex items-center h-[90%] w-full justify-center">
          <div className="flex-col text-center">
            <h2 className="font-semibold text-2xl mb-4">
              Choose some keywords first!
            </h2>
            <p className="text-sm text-muted-foreground">
              You need to add at least 1 keyword to your project in order to access this page
            </p>
            <Button asChild className="text-white font-medium mt-4">
              <Link href={`/dashboard/${params.projectId}/keywords`}>
                 Choose Keywords
                <BotIcon className="ml-2 w-4 h-4"/>
              </Link>
            </Button>
          </div>
        </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-[90%] w-full px-10">
      <div className="pb-2 pt-6">
       <Heading title="Posts" description="Below is a list of all the social media posts that 
         best matches your project description"/>
        <Separator className="mt-3"/>
      </div>
      <Posts projectId={params.projectId} alreadyReplied={alreadyReplied} activeKeywordData={activeKeywords}/>
     </ScrollArea>
    </>
  )
}

export default PostsPage