'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { poppins } from "../fonts/fonts"
import { cn } from "@/lib/utils"

const FooterSection = () => {
  return (
    <div className="flex items-center w-full p-6 z-50 bg-white/75 dark:bg-[#1e1e1e]">
     <div className="hidden md:flex items-center gap-x-4 cursor-pointer">
         <Image draggable="false" quality={100} src="/logo-bg.png" height={65} width={65} alt="Logo" className="rounded-full"/>
          <p className={cn("font-semibold text-2xl transition ml-2", poppins.className)}>
           Orblitzz
         </p>
       </div>
    <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
      <Button asChild variant="ghost" size="sm">
          <a href="" target="_blank">
            Privacy Policy
          </a>
      </Button>
      <Button asChild variant="ghost" size="sm">
        <a href="" target="_blank">
           Terms & Conditions
        </a>
      </Button>
    </div>
  </div>
  )
}

export default FooterSection