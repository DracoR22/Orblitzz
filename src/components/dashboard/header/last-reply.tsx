'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { PinIcon, ReplyAllIcon } from "lucide-react"
import Image from "next/image"

interface LastReplyProps {
    lastReply?: string | undefined
}

const LastReply = ({ lastReply }: LastReplyProps) => {

    const formattedLastReply = lastReply ? formatDistanceToNow(new Date(lastReply), { addSuffix: true }) : 'No replies yet.';

  return (
    <Card>
        <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
          <CardTitle  className="text-sm font-semibold w-full">
            <div className="mb-5 flex items-center w-full" >
                <div className="flex-1">
                  <PinIcon className="w-[35px] h-[35px] p-2 rounded-full bg-pink-400/10 text-pink-500"/>
                </div>
                <div>
                  <Image src={'/dashboard-media/ellipsis.svg'} alt="" width={50} height={50} className="w-[38px] h-[38px] cursor-pointer hover:bg-neutral-800 transition rounded-full p-2"/>
                </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-md font-medium">Last reply</p>
          <p className="text-2xl mt-2 font-bold">{formattedLastReply}</p>
        </CardContent>
    </Card>
  )
}

export default LastReply