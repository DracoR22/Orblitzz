import DashboardHeader from "@/components/dashboard/header/dashboard-header"
import RepliesCountMonth from "@/components/dashboard/header/replies-count-month"
import LastTwoMonthsOverview from "@/components/dashboard/oveview/last-two-months-overview"
import RepliesOverview from "@/components/dashboard/oveview/replies-overview"
import UserPlan from "@/components/dashboard/oveview/user-plan"
import Heading from "@/components/global/heading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { getAllUserProjectsCount, getGraphProjectReplies } from "@/server/actions/reddit-actions"
import { isToday } from "date-fns"

interface Props {
  params: { projectId: string }
}

const ProjectIdPage = async ({ params }: Props) => {

  const subscriptionPlan = await getUserSubscriptionPlan()
  const allUserProjectsCount = await getAllUserProjectsCount()
  const { allMonthsData, lastTwoMonthsData, percentageDifference, latestReply, repliesCreatedThisMonth } = await getGraphProjectReplies(params.projectId)

  const repliesCreatedToday = repliesCreatedThisMonth.filter(reply => isToday(reply.createdAt));
  const currentProject = allUserProjectsCount.find((project) => project.id === params.projectId)
  
  return (
    <ScrollArea className="h-[90%] w-full">
     <section className="pb-2 p-8 pt-6">
      <Heading title="Overview" item={currentProject?.title} description="You can manage your plan usage and reply creation from this dashboard"/>
      <Separator className="my-3"/>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
         <DashboardHeader lastReply={latestReply} userProjects={allUserProjectsCount.length} repliesMonth={repliesCreatedThisMonth.length} repliesToday={repliesCreatedToday.length}/>
      </div>
      <div className="grid grid-cols-2 mt-4 gap-x-4">
       <div className="relative">
        <div className="absolute inset-0">
           <RepliesOverview data={allMonthsData}/>
        </div>
        </div>
       <div className="relative">
         <div className="absolute inset-0 flex flex-col gap-y-4">
          <div className="flex-grow">
            <UserPlan replies={repliesCreatedThisMonth.length} subscriptionPlan={subscriptionPlan}/>
          </div>
          <div className="flex-grow">
            <LastTwoMonthsOverview data={lastTwoMonthsData} percentageDifference={percentageDifference}/>
          </div>
       </div>
    </div>
   </div>
    </section>
   </ScrollArea>
  )
}

export default ProjectIdPage