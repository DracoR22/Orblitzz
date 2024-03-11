import DashboardSetup from "@/components/dashboard/dashboard-setup"
import Heading from "@/components/global/heading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { currentUser } from "@/lib/auth/get-server-session"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { getRedditCampaignDetails } from "@/server/actions/reddit-actions"

const SettingsPage = async ({ params }: { params: { projectId: string }}) => {

  const user = await currentUser()

  if (!user || !user.id) {
    return
  }

   const data = await getRedditCampaignDetails(params.projectId, user.id)

   const subscriptionPlan = await getUserSubscriptionPlan()

  return (
    <ScrollArea className="h-[650px] w-full px-10">
      <div className="pb-2 pt-6">
       <Heading title="Settings" description="Below is a list of all the social media posts that 
         best matches your project description" item={data?.title}/>
        <Separator className="mt-3"/>
      </div>

      <div className="mt-4">
        <DashboardSetup data={data} projectId={params.projectId} subscriptionPlan={subscriptionPlan}/>
      </div>
    </ScrollArea>
  )
}

export default SettingsPage