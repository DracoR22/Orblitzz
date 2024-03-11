import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"

const ProjectIdPage = async () => {
  const subscription = await getUserSubscriptionPlan()
  return (
    <div>
      {subscription.name} plan
    </div>
  )
}

export default ProjectIdPage