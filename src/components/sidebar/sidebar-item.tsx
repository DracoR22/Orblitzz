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

const SidebarItem = ({ active, href, icon: Icon, name }: Props) => {
  return (
    <Link href={href} className={cn("flex items-center gap-x-4 mt-2 hover:bg-[#363636] rounded-sm p-1 cursor-pointer", active && 'bg-[#363636]')}>
         <Icon className="w-5 h-5 dark:text-neutral-400"/>
          {name}
    </Link>
  )
}

export default SidebarItem