import Navbar from "@/components/dashboard/navbar"
import Sidebar from "@/components/sidebar/sidebar"
import { currentUser } from "@/lib/auth/get-server-session"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { getActiveKeywords } from "@/server/actions/keyword-actions"
import { getMonthlyReplies, getProjectAutoreplyLimit } from "@/server/actions/reddit-actions"
import { isToday } from "date-fns"

interface DashboardLayoutProps {
  children: React.ReactNode,
  params: { projectId: string }
}

const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {

  const user = await currentUser()

  if (!user || !user.id) {
    return
  }

  // Get user subscription
  const subscriptionPlan = await getUserSubscriptionPlan()

  // Get project autoReply limit
  const projectAutoReplyLimit = await getProjectAutoreplyLimit(params.projectId, user.id)

  // Active keywords
  const activeKeywords = await getActiveKeywords(params.projectId)

  // Get only active keyword content
  const allKeywords = activeKeywords.map((k) => k.content)

  // Replies created this month
  const repliesCreatedThisMonth = await getMonthlyReplies(params.projectId)

  // Replies created today
  const repliesCreatedToday = repliesCreatedThisMonth.filter(reply => isToday(reply.createdAt));

    return (
      <div className="h-full flex">
         <Sidebar project={projectAutoReplyLimit} subscriptionPlan={subscriptionPlan} repliesCreatedThisMonth={repliesCreatedThisMonth}/>
        <main className="flex-1 h-full">
        <Navbar projectId={params.projectId} allKeywords={allKeywords} projectAutoReplyLimit={projectAutoReplyLimit}
         repliesCreatedThisMonth={repliesCreatedThisMonth} repliesCreatedToday={repliesCreatedToday} subscriptionPlan={subscriptionPlan}/>
        {children}
        </main>
      </div>
    )
  }
  
  export default DashboardLayout