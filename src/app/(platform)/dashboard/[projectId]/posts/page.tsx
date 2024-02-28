import Heading from "@/components/global/heading"
import Posts from "@/components/posts/posts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const PostsPage = () => {
  return (
    <>
      <ScrollArea className="h-[650px] w-full px-10">
      <div className="pb-2 pt-6">
       <Heading title="Posts" description="Below is a list of all the social media posts that 
         best matches your project description"/>
        <Separator className="mt-3"/>
      </div>
      <Posts/>
     </ScrollArea>
    </>
  )
}

export default PostsPage