import Heading from "@/components/global/heading"
import KeywordsContainer from "@/components/keywords/keywords-container"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"

const columns = [
  {
    id: '1',
    title: 'Active Keywords',
    isAdded: true
  },
  {
    id: '2',
    title: 'Suggested Keywords',
    isAdded: false,
  }
]

const KeywordsPage = async ({ params }: { params: { projectId: string }}) => {

   const subscriptionPlan = await getUserSubscriptionPlan()

  return (
    <>
    <ScrollArea className="h-[90%] w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
           <Heading title='Keywords' description="Drag and drop the AI generated keywords to
            the 'Active Keywords' column to add the into your project. Then AI will search for posts
            based on the keywords you chose"/>
        </div>
        <Separator/>
      </div>
      {/* DRAG AND DROP */}
      <div className="flex justify-center mx-10 rounded-md py-6">
        <KeywordsContainer subscriptionPlan={subscriptionPlan} columns={columns} projectId={params.projectId}/>
      </div>
      </ScrollArea>
    </>
  )
}

export default KeywordsPage