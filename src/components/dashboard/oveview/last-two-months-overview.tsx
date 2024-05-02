'use client'

import { GraphData } from "@/server/actions/reddit-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LastTwoMonthsOverviewProps {
    data: GraphData[]
    percentageDifference: number
}

const LastTwoMonthsOverview = ({ data, percentageDifference }: LastTwoMonthsOverviewProps) => {

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

  return (
    <Card className="col-span-4">
    <CardHeader>
     <div className="flex items-center">
     <CardTitle className="flex-1 flex items-center gap-x-4">
     <CalendarIcon className="w-[35px] h-[35px] p-2 rounded-full bg-purple-400/10 text-purple-500"/>
        Last 2 Months
      </CardTitle>
      <div>
      <Image src={'/dashboard-media/ellipsis.svg'} alt="" width={50} height={50} className="w-[38px] h-[38px] cursor-pointer hover:bg-neutral-800 transition rounded-full p-2"/>
      </div>
     </div>
     <div className="text-xl font-bold mt-1 ">
      {percentageDifference.toFixed()}%
     </div>
     <div className="text-sm text-muted-foreground font-medium">
      vs last month
     </div>
    </CardHeader>
    <CardContent className="pl-2">
        <ResponsiveContainer width='100%' height={100}>
        <LineChart width={730} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
         <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
      </linearGradient>
       </defs>
         <XAxis stroke='#888888' dataKey="name" fontSize={12} tickLine={false} axisLine={false}/>
         <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false}
        tickFormatter={(value) => `${value}`}/>
         <CartesianGrid strokeDasharray="3 3"  stroke="#555555"/>
         <Tooltip/>
           <Line type="monotone" dataKey="replies" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUv)" />
     </LineChart>
       </ResponsiveContainer>
    </CardContent>
  </Card>
  )
}

export default LastTwoMonthsOverview