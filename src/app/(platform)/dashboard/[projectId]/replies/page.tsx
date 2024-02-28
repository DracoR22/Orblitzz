import Heading from "@/components/global/heading"
import { Separator } from "@/components/ui/separator"

const RepliesPage = () => {
  return (
    <div className="p-8 pt-6">
      <Heading title="Replies" description="Below is a list of all the social media posts that 
      best matches your project description"/>
      <Separator className="my-3"/>
      <div className="mt-4">
        posts
      </div>
    </div>
  )
}

export default RepliesPage