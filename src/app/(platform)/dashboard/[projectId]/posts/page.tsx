import Heading from "@/components/global/heading"
import Posts from "@/components/posts/posts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { redditReplies } from "@/lib/db/schema/reddit"
import { and, eq } from "drizzle-orm"

const PostsPage = async ({ params }: { params: { projectId: string }}) => {

    // Check if already replied to the same post
    const alreadyReplied = await db.query.redditReplies.findFirst({
      columns: {
        postId: true
      },
      where: and(
          eq(redditReplies.id, params.projectId)
      )
  })

  return (
    <>
      <ScrollArea className="h-[650px] w-full px-10">
      <div className="pb-2 pt-6">
       <Heading title="Posts" description="Below is a list of all the social media posts that 
         best matches your project description"/>
        <Separator className="mt-3"/>
      </div>
      <Posts projectId={params.projectId} alreadyRepliedId={alreadyReplied?.postId}/>
     </ScrollArea>
    </>
  )
}

export default PostsPage