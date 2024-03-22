'use client'

import { ReplyIcon, ShieldCheckIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import Image from "next/image"

interface UserProjectsCountProps {
    projects: number
}

const UserProjectsCount = ({ projects }: UserProjectsCountProps) => {
  return (
    <Card>
        <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
          <CardTitle  className="text-sm font-semibold w-full">
            <div className="mb-5 flex items-center w-full" >
                <div className="flex-1">
                  <ShieldCheckIcon className="w-[35px] h-[35px] p-2 rounded-full bg-yellow-400/10 text-yellow-500"/>
                </div>
                <div>
                  <Image src={'/dashboard-media/ellipsis.svg'} alt="" width={50} height={50} className="w-[38px] h-[38px] cursor-pointer hover:bg-neutral-800 transition rounded-full p-2"/>
                </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-md font-medium">Total projects</p>
          <p className="text-3xl mt-2 font-bold">{projects}</p>
        </CardContent>
    </Card>
  )
}

export default UserProjectsCount