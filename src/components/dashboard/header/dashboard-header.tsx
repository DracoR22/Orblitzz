'use client'

import { useEffect, useState } from "react"
import RepliesCountMonth from "./replies-count-month"
import RepliesCreatedToday from "./replies-count-today"
import UserProjectsCount from "./user-projects-count"
import { RedditReplyType } from "@/lib/db/schema/reddit"
import LastReply from "./last-reply"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
    repliesMonth: number
    repliesToday: number
    userProjects: number
    lastReply?: Pick<RedditReplyType, 'createdAt'> | undefined
}

const DashboardHeader = ({ repliesMonth, repliesToday, userProjects, lastReply }: Props) => {

   const [isMounted, setIsMounted] = useState<boolean>(false)

   useEffect(() => {
    setIsMounted(true)
   }, [])

   if (!isMounted) {
    return (
          <>
            <Skeleton className="h-[175px] w-full"/>
            <Skeleton className="h-[175px] w-full"/>
            <Skeleton className="h-[175px] w-full"/>
            <Skeleton className="h-[175px] w-full"/>
         </>
    )
   }

   const lastProjectReply = lastReply?.createdAt



  //  const clickProfanity = async () => {
  //   const message = 'Hello my nigas'
  //    const res = await fetch('https://vector.profanity.dev', {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({ message })
  //    })

  //    const json = await res.json()

  //    console.log(json)
  //    return json
  //  }

  return (
    <>
     <RepliesCountMonth replies={repliesMonth}/>
     <RepliesCreatedToday replies={repliesToday}/>
     <LastReply lastReply={lastProjectReply}/>
     <UserProjectsCount projects={userProjects}/>
    </>
  )
}

export default DashboardHeader