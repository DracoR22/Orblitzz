'use client'

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface ColoredTextProps {
    children: React.ReactNode
    icon?: LucideIcon
    variant: 'success' | 'alert' | 'error'
}

const ColoredText = ({ children, icon: Icon, variant }: ColoredTextProps) => {
  return (
    <div className={cn(`pt-2 px-2 flex items-center gap-x-3 text-xs p-1 font-medium rounded-md`,
     variant === 'success' && 'bg-green-500/20 text-green-500',
     variant === 'alert' && 'bg-yellow-500/20 text-yellow-500',
     variant === 'error' && 'bg-red-500/20 text-red-500')}>
        <span>
            {Icon && <Icon className="w-5 h-5"/>}
        </span>
       {children}
    </div>
  )
}

export default ColoredText