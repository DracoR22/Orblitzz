import DashboardSetup from "@/components/dashboard/dashboard-setup"
import { currentUser } from "@/lib/auth/get-server-session"
import { getFirstCampaign } from "@/server/actions/reddit-actions"
import { redirect } from "next/navigation"

const DashboardPage = async () => {

  const user = await currentUser()

  if (!user || !user.id) {
    return
  }

  const project = await getFirstCampaign(user.id)

    if (!project) {
      return (
        <div className="h-screen w-screen flex justify-center items-center">
           <DashboardSetup/>
        </div>
      )
    }

  return redirect(`/dashboard/${project.id}`)
}

export default DashboardPage