'use client'

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface Props {
    name: string
    icon: LucideIcon
    href: string
    active: boolean
  }

const AdditionalSidebarItem = ({ active, href, icon: Icon, name }: Props)  => {
  return (
    <Link href={href} className={cn("flex flex-col mt-2 hover:bg-[#363636] rounded-sm p-1 cursor-pointer", active && 'bg-[#363636]')}>
    <div className="flex gap-x-4">
      <Icon className="w-5 h-5 dark:text-neutral-400"/>
      {name}
    </div>
  </Link>
  )
}

export default AdditionalSidebarItem