'use client'

import { useEffect } from "react"
import DiamondIcon from "../icons/diamond-icon"
import { Progress } from "../ui/progress"
import { useParams } from "next/navigation"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { getMonthlyReplies } from "@/server/actions/reddit-actions"
import { useMonthlyReplies } from "../../hooks/use-monthly-replies"

interface PlanUsageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
  repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>>
}

const PlanUsage = ({ subscriptionPlan, repliesCreatedThisMonth }: PlanUsageProps) => {

  const params = useParams()

  const { repliesCreatedThisMonth: replies, setRepliesCreatedThisMonth} = useMonthlyReplies()
 
  // SET OUR MONTHLY REPLY STATE WITH THE MONTHLY REPLIES FROM OUR DATABASE
  useEffect(() => {
    // Assuming you have a function to fetch the replies, you can call it here
    const fetchRepliesAndUpdateState = async () => {
      try {
        setRepliesCreatedThisMonth(repliesCreatedThisMonth);
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    fetchRepliesAndUpdateState(); // Call the function when the component mounts
  }, [params.projectId, setRepliesCreatedThisMonth]);

  // console.log(replies);

  // const { data } = trpc.reddit.getProjectReplies.useQuery({ projectId: params.projectId as string })

  // if (!data) {
  //   return (
  //     <article className="mb-4">
  //   <div className="flex gap-2 text-neutral-400 mb-2 items-center">
  //     <div className="flex justify-between w-full items-center">
  //       <div className="h-4 w-4">
  //         {/* <Image src={'/sidebar/reddit-logo.svg'} height={18} width={18} alt="" /> */}
  //         <DiamondIcon/>
  //       </div>
  //       <div className="text-sm">{subscriptionPlan.name} Plan</div>
  //       <small>0 / {subscriptionPlan.repliesPerMonth as number} Replies</small>
  //     </div>
  //   </div>
  //   <Progress value={(0 / (subscriptionPlan.repliesPerMonth as number || 3)) * 100} className="h-1" />
  // </article>
  //   )
  // }


  return (
    <article className="mb-4">
    <div className="flex gap-2 text-neutral-400 mb-2 items-center">
      <div className="flex justify-between w-full items-center">
        <div className="h-4 w-4">
          <DiamondIcon/>
        </div>
        <div className="text-sm">Free Plan</div>
        <small>{replies.length.toFixed(0)} / {subscriptionPlan.repliesPerMonth as number} Replies</small>
      </div>
    </div>
    <Progress value={(replies.length / (subscriptionPlan.repliesPerMonth as number || 3)) * 100} className="h-1" />
  </article>
  )
}

export default PlanUsage