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
    <Link href={href} className={cn("flex flex-col mt-2 dark:hover:bg-[#363636] hover:bg-[#e3e3e3] rounded-sm p-1 cursor-pointer", active && 'dark:bg-[#363636] bg-[#e3e3e3]')}>
    <div className="flex gap-x-4">
      <Icon className="w-5 h-5 dark:text-neutral-400"/>
      {name}
    </div>
  </Link>
  )
}

export default AdditionalSidebarItem