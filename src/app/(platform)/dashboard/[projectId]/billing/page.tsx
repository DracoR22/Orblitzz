import Heading from "@/components/global/heading"
import PricingCards from "@/components/global/pricing-cards"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"

const BillingPage = async () => {

  const currentPlan = await getUserSubscriptionPlan()

  return (
    <>
     <ScrollArea className="h-[650px] w-full px-10">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
         <Heading title='Billing' description="In this page you can upgrade or cancel your Orblitzz
         plan at anytime" item={`Current plan: ${currentPlan.name} Plan`}/>
      </div>
      <Separator/>
    </div>
    {/* BILLING */}
    <div className="flex justify-center dark:bg-neutral-800 bg-neutral-100 mx-10 rounded-md py-6 px-6">
      <PricingCards/>
      
    </div>
    </ScrollArea>
  </>
  )
}

export default BillingPage