import Heading from "@/components/global/heading"
import Posts from "@/components/posts/posts"
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

const PostsPage = async ({ params }: { params: { projectId: string }}) => {

    const userSubscription = await getUserSubscriptionPlan()

    if (!userSubscription.name) {
      return null
    }

    const repliesCreatedThisMonth = await getMonthlyReplies(params.projectId)

    const { isReplyPossible } = checkPlanReplyLimit({ planName: userSubscription.name, repliesCreatedThisMonth })

    // TODO: Check if this works
    if (!isReplyPossible) {
      return (
        <div>
          Plan limit exceeded
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

  return (
    <>
      <ScrollArea className="h-[650px] w-full px-10">
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