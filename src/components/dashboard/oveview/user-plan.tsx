'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { ChevronDownIcon, UserIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface UserPlanProps {
   subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
   replies: number
}

const UserPlan = ({ subscriptionPlan, replies }: UserPlanProps) => {

  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
   setIsMounted(true)
  }, [])

  if (!isMounted) {
   return (
         <>
           <Skeleton className="h-[258px] w-full"/>
        </>
   )
  }

  const percentage = replies / (subscriptionPlan.repliesPerMonth as number || 3) * 100


  return (
    <Card>
        <CardHeader className="w-full">
            <div className="flex items-center">
            <CardTitle className="flex items-center gap-x-4 flex-1">
                <UserIcon className="w-[35px] h-[35px] p-2 rounded-full bg-red-400/10 text-red-500"/>
                User Plan
            </CardTitle>
            <div>
              <Image src={'/dashboard-media/ellipsis.svg'} alt="" width={50} height={50} className="w-[38px] h-[38px] cursor-pointer hover:bg-neutral-800 transition rounded-full p-2"/>
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <Button variant={'outline'} className="bg-transparent flex items-center gap-x-3">
               {subscriptionPlan.name} Plan
               {/* <ChevronDownIcon className="w-4 h-4"/> */}
            </Button>
            <div className="mt-4">
                <p className="text-xl font-bold">
                    {percentage.toFixed()}% <span className="text-sm text-muted-foreground font-medium ml-3">Plan used</span>
                </p>
                <p className="text-muted-foreground text-sm mt-2">{replies} Replies</p>
                <div className="mt-2">
                <Progress value={(replies / (subscriptionPlan.repliesPerMonth as number || 3)) * 100} className="h-3 rounded-sm" />
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default UserPlan