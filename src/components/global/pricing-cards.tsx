'use client'

import { PLANS } from "@/lib/stripe/plans"
import { cn } from "@/lib/utils"
import { Check, Loader2Icon } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"

interface PricingCardProps {
    isDashboard?: boolean
    projectId?: string
    currentPlan?: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const PricingCards = ({ isDashboard, projectId, currentPlan }: PricingCardProps) => {

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    const onClick = async (priceId: string, i: number) => {
      try {
        setLoadingIndex(i);
        const response = await axios.post("/api/stripe", { priceId, projectId });
  
        window.location.href = response.data.url;
      } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data || 'An error occurred';
            toast.error(errorMessage)
        } else {
            console.error('Error:', error.message);
        }
      } finally {
        setLoadingIndex(null)
      }
    }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-x-4", isDashboard ? "lg:grid-cols-2 w-full" : "lg:grid-cols-3")}>
      {PLANS.map((item, i) => {
        // const price = PLANS.find((p) => p.slug === item.plan.toLowerCase())?.price.amount || 0
        if (isDashboard && item.name === 'Free') {
          return null; // Skip rendering the Free plan in dashboard
        }
        return (
            <div key={i} className={cn("relative rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-2xl" ,{
                "border-[2px] border-blue-500 shadow-blue-300": item.name === "Pro",
                "border border-gray-200 dark:border-neutral-700": item.name !== "Pro"
              })}>
                {item.name === "Pro" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                       Popular Choice
                    </div>
                  )}

                 <div className="p-5">
                    <h3 className="my-3 text-center font-display text-sm font-medium border p-1 rounded-md">
                      {item.name}
                    </h3>
                    {/* <p className="text-gray-500">{item.tagline}</p> */}
                    <h4 className="mt-10 font-display text-5xl font-semibold flex justify-center">${item.price.amount}</h4>
                    <p className="text-gray-500 flex justify-center text-sm mt-5">per month</p>

                    {currentPlan && currentPlan.name === item.name && (
                      <Button disabled={loadingIndex !== null} onClick={() => onClick(item.price.priceIds.production, i)} variant={'default'} className="w-full  mt-4 text-white">
                       {loadingIndex === i ? <Loader2Icon className="w-5 h-4 animate-spin"/> : `Manage Plan`}
                     </Button>
                    )}

                    {isDashboard && currentPlan && currentPlan.name !== item.name && (
                        <Button disabled={loadingIndex !== null} onClick={() => onClick(item.price.priceIds.production, i)} variant={'outline'} className="w-full dark:bg-[#242424] bg-[#fafafa] mt-4 dark:hover:bg-[#1e1e1e] hover:bg-white">
                          {loadingIndex === i ? <Loader2Icon className="w-5 h-4 animate-spin"/> : `Upgrade to ${item.name}`}
                        </Button>
                    )}

                    {!isDashboard && (
                      <Button asChild variant={'outline'} className="w-full dark:bg-[#242424] bg-[#fafafa] mt-4 dark:hover:bg-[#1e1e1e] hover:bg-white">
                      <Link href={`/login?plan=${item.name}`}>
                         Select {item.name}
                      </Link>
                    </Button>
                    )}  
                    
                  </div>

                  <ul className="my-4 space-y-5 px-8 mb-14">
                     {item.features.map(({text }) => (
                      <li key={text} className="flex space-x-5">
                         <div className="dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full">
                            <Check className="h-5 w-5 text-green-500"/>
                         </div>
                      
                          <div className="flex items-center space-x-1">
                            <p className='text-sm font-medium'>
                              {text}
                            </p>
                          </div> 
                      </li>
                     ))}
                  </ul>

                  
            </div>
        )
      })}
    </div>
  )
}

export default PricingCards