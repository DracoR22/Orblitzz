import Heading from "@/components/global/heading"
import { columns } from "@/components/replies/columns"
import { DataTable } from "@/components/replies/data-table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const RepliesPage = async ({ params }: { params: { projectId: string }}) => {
  
  return (
    <ScrollArea className="h-[90%] w-full p-8 pt-6">
      <Heading title="Replies" description="Below is a list of all the social media posts that 
      best matches your project description"/>
      <Separator className="my-3"/>
      <div className="mt-4">
        <DataTable projectId={params.projectId} columns={columns}/>
      </div>
    </ScrollArea>
  )
}

export default RepliesPage