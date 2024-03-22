'use client'

import { useEffect, useState } from "react"
import RepliesCountMonth from "./replies-count-month"
import RepliesCreatedToday from "./replies-count-today"
import UserProjectsCount from "./user-projects-count"
import { RedditReplyType } from "@/lib/db/schema/reddit"
import LastReply from "./last-reply"

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
        <div>
            loading...
        </div>
    )
   }

   const lastProjectReply = lastReply?.createdAt

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