import Heading from "@/components/global/heading"
import PricingCards from "@/components/global/pricing-cards"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { format } from "date-fns"

const BillingPage = async ({ params }: { params: { projectId: string }}) => {

  const currentPlan = await getUserSubscriptionPlan()

  return (
    <>
     <ScrollArea className="h-[90%] w-full px-10">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col">
         <Heading title='Billing' description="In this page you can upgrade or cancel your Orblitzz
         plan at anytime" item={`Current plan: ${currentPlan.name} Plan`}/>

          {currentPlan.isSubscribed ? (
                <p className='rounded-md bg-green-400/20 text-green-500 p-1 w-fit mt-4 text-xs font-medium'>
                  {currentPlan.isCanceled ? 'Your plan will be canceled on ' : 'Your plan renews on '}
                  {format(currentPlan.stripeCurrentPeriodEnd!, 'dd.MM.yyyy')}
                </p>
          ) : null}
      </div>
      <Separator/>
    </div>
    {/* BILLING */}
    <div className="flex justify-center dark:bg-neutral-800 bg-neutral-100 mx-10 rounded-md py-6 px-6">
      <PricingCards currentPlan={currentPlan} isDashboard={true} projectId={params.projectId}/>
    </div>
    </ScrollArea>
  </>
  )
}

export default BillingPage