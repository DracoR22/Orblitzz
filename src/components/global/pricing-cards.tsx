'use client'

import { PLANS } from "@/lib/stripe/plans"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

interface PricingCardProps {
    isDashboard?: boolean
}

const PricingCards = ({ isDashboard }: PricingCardProps) => {

    const pricingItems = [
        {
          plan: 'Free',
          tagline: 'Try out all Orblitzz features for free, easy sign-up, no credit card required.',
          quota: 10,
          features: [
            {
              text: '2 AI replies per month',
            },
            {
              text: 'Automatic replies',
            },
            {
              text: 'Up to 5 keywords',
            },
            {
              text: 'Unlimited AI post editor',
            },
            {
              text: '1 project',
            },
            {
              text: 'Priority support',
            },
          ],
        },
        {
          plan: 'Starter',
          tagline: 'Elevate all Features one step further with more replies per month.',
          features: [
            {
              text: '20 AI replies per month',
            },
            {
              text: 'Automatic replies',
            },
            {
              text: 'Up to 5 keywords',
            },
            {
              text: 'Unlimited AI post editor',
            },
            {
              text: '1 project',
            },
            {
              text: 'Priority support',
            },
          ],
        },
        {
            plan: 'Pro',
            tagline: 'Get more people atention with Pro Plan, be prepared for a huge traffic increase.',
            features: [
                {
                  text: '100 AI replies per month',
                },
                {
                  text: 'Automatic replies',
                },
                {
                  text: 'Up to 10 keywords',
                },
                {
                  text: 'Unlimited AI post editor',
                },
                {
                  text: '1 project',
                },
                {
                  text: 'Priority support',
                },
              ],
          },
      ]

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-x-4", isDashboard ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      {pricingItems.map((item, i) => {
        const price = PLANS.find((p) => p.slug === item.plan.toLowerCase())?.price.amount || 0
        if (isDashboard && item.plan === 'Free') {
          return null; // Skip rendering the Free plan in dashboard
        }
        return (
            <div key={i} className={cn("relative rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-2xl" ,{
                "border-[2px] border-blue-500 shadow-blue-300": item.plan === "Pro",
                "border border-gray-200 dark:border-neutral-700": item.plan !== "Pro"
              })}>
                {item.plan === "Pro" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                       Popular Choice
                    </div>
                  )}

                 <div className="p-5">
                    <h3 className="my-3 text-center font-display text-sm font-medium border p-1 rounded-md">
                      {item.plan}
                    </h3>
                    {/* <p className="text-gray-500">{item.tagline}</p> */}
                    <h4 className="mt-10 font-display text-5xl font-semibold flex justify-center">${price}</h4>
                    <p className="text-gray-500 flex justify-center text-sm mt-5">per month</p>

                    <Button asChild variant={'outline'} className="w-full dark:bg-[#242424] bg-[#fafafa] mt-4 dark:hover:bg-[#1e1e1e] hover:bg-white">
                      <Link href={`/login?plan=${item.plan}`}>
                         Select {item.plan}
                      </Link>
                    </Button>
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