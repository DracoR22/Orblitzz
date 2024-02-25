'use client'

import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import Image from "next/image"
import { MoveRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const SidebarItem = () => {

  const pathname = usePathname()
  const router = useRouter()

  const routes = useMemo(() => [
    {
      id: '1',
      label: 'Reddit',
      icon: '/sidebar/reddit-logo.svg',
      href: '/dashboard/reddit'
    },
    {
      id: '2',
      label: 'Gmail',
      icon: '/sidebar/gmail-logo.svg',
      href: '/dashboard/email'
    }
  ], [pathname])

  const onClick = (href: string) => {
    router.push(href)
   }  

  return (
    <>
     {routes.map((route, i) => (
       <AccordionItem value={route.id} className="border-none" key={i}>
       <AccordionTrigger className={cn('no-underline hover:no-underline hover:bg-[#363636] gap-x-2 p-1 rounded-sm')}>
           <div className="text-sm flex items-center gap-x-4 cursor-pointer">
              <div className="flex-1 flex items-center gap-x-4">
              <Image src={route.icon} alt="" width={50} height={50} className="w-6 h-6"/>
                 {route.label}
              </div>
            </div>
       </AccordionTrigger>
       <AccordionContent>
         {/* TODO: Accordion content */}
       </AccordionContent>
    </AccordionItem>
     ))}
    </>
  )
}

export default SidebarItem