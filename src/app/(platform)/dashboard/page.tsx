import DashboardSetup from "@/components/dashboard/dashboard-setup"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { getFirstCampaign } from "@/server/actions/reddit-actions"
import { redirect } from "next/navigation"

const DashboardPage = async () => {

  const project = await getFirstCampaign()
  const subscriptionPlan = await getUserSubscriptionPlan()

    if (!project) {
      return (
        <div className="h-screen w-screen flex justify-center items-center">
           <DashboardSetup subscriptionPlan={subscriptionPlan}/>
        </div>
      )
    }

  return redirect(`/dashboard/${project.id}`)
}

export default DashboardPage