import Heading from "@/components/global/heading"
import { columns } from "@/components/replies/columns"
import { DataTable } from "@/components/replies/data-table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getRedditReplies } from "@/server/actions/reddit-actions"

const RepliesPage = async ({ params }: { params: { projectId: string }}) => {

  const data = await getRedditReplies(params.projectId)
  return (
    <ScrollArea className="h-[650px] w-full p-8 pt-6">
      <Heading title="Replies" description="Below is a list of all the social media posts that 
      best matches your project description"/>
      <Separator className="my-3"/>
      <div className="mt-4">
        <DataTable columns={columns} data={data}/>
      </div>
    </ScrollArea>
  )
}

export default RepliesPage