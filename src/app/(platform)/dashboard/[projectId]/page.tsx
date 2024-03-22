import DashboardHeader from "@/components/dashboard/header/dashboard-header"
import RepliesCountMonth from "@/components/dashboard/header/replies-count-month"
import LastTwoMonthsOverview from "@/components/dashboard/oveview/last-two-months-overview"
import RepliesOverview from "@/components/dashboard/oveview/replies-overview"
import UserPlan from "@/components/dashboard/oveview/user-plan"
import Heading from "@/components/global/heading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { getAllUserProjectsCount, getGraphProjectReplies, getLastReply, getLastTwoMonthsReplies, getMonthlyReplies } from "@/server/actions/reddit-actions"
import { isToday } from "date-fns"

interface Props {
  params: { projectId: string }
}

const ProjectIdPage = async ({ params }: Props) => {

  const subscriptionPlan = await getUserSubscriptionPlan()

  // Replies created this month
  const repliesCreatedThisMonth = await getMonthlyReplies(params.projectId)

  // Replies created today
  const repliesCreatedToday = repliesCreatedThisMonth.filter(reply => isToday(reply.createdAt));

  const allUserProjectsCount = await getAllUserProjectsCount()

  const allMonths = await getGraphProjectReplies(params.projectId)

  const {graphData, percentageDifference} = await getLastTwoMonthsReplies(params.projectId)

  const latestReply = await getLastReply(params.projectId)
  
  return (
   <ScrollArea className="h-[650px] w-full">
     <section className="pb-2 p-8 pt-6">
      <Heading title="Overview" description="Below is a list of all the social media posts that 
         best matches your project description"/>
      <Separator className="my-3"/>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
         <DashboardHeader lastReply={latestReply} userProjects={allUserProjectsCount.length} repliesMonth={repliesCreatedThisMonth.length} repliesToday={repliesCreatedToday.length}/>
      </div>
      <div className="grid grid-cols-2 mt-4 gap-x-4">
  <div className="relative">
    <div className="absolute inset-0">
      <RepliesOverview data={allMonths}/>
    </div>
  </div>
  <div className="relative">
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-grow">
        <UserPlan replies={repliesCreatedThisMonth.length} subscriptionPlan={subscriptionPlan}/>
      </div>
      <div className="flex-grow">
        <LastTwoMonthsOverview data={graphData} percentageDifference={percentageDifference}/>
      </div>
    </div>
  </div>
</div>

    </section>
   </ScrollArea>
  )
}

export default ProjectIdPage