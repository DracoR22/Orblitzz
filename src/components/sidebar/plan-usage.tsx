'use client'

import { useState } from "react"
import DiamondIcon from "../icons/diamond-icon"
import { Progress } from "../ui/progress"
import Image from "next/image"

const PlanUsage = () => {

    // const [usagePercentege, setUsagePercentege] = useState((foldersLength / MAX_FOLDERS_FREE_PLAN) * 100)
    const [usagePercentege, setUsagePercentege] = useState(3)

  return (
    <article className="mb-4">
    <div className="flex gap-2 text-neutral-400 mb-2 items-center">
      <div className="flex justify-between w-full items-center">
        <div className="h-4 w-4">
          {/* <Image src={'/sidebar/reddit-logo.svg'} height={18} width={18} alt="" /> */}
          <DiamondIcon/>
        </div>
        <div className="text-sm">Free Plan</div>
        <small>{usagePercentege.toFixed(0)} / 5 Replies</small>
      </div>
    </div>
    <Progress value={(usagePercentege / 5) * 100} className="h-1" />
  </article>
  )
}

export default PlanUsage