'use client'

import { ElementRef, useEffect, useRef, useState } from "react"
import SidebarHeader from "./sidebar-header"
import { useMediaQuery } from "usehooks-ts"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronsLeftIcon, ContactIcon, CreditCardIcon, InfoIcon, MailIcon, MenuIcon, MoveRightIcon, SettingsIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import Image from "next/image"
import { Accordion } from "../ui/accordion"
import SidebarItem from "./sidebar-item"
import PlanUsage from "./plan-usage"

const Sidebar = () => {

  const isMobile = useMediaQuery("(max-width: 768px)")
  const pathname = usePathname()
  const params = useParams()

  const sidebarRef = useRef<ElementRef<"aside">>(null)
  const navbarRef = useRef<ElementRef<"div">>(null)
  const isResizingRef = useRef(false)

  const [isCollapsed, setIsCollapsed] = useState(isMobile)
  const [isResetting, setIsResetting] = useState(false)
  useEffect(() => {
    if(isMobile) {
      collapse()
    } else {
      resetWidth()
    }
   }, [isMobile])

   useEffect(() => {
    if(isMobile) {
      collapse()
    }
   }, [pathname, isMobile])

   const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
   }

   const handleMouseMove = (event: MouseEvent) => {
    if(!isResizingRef.current) return
    let newWidth = event.clientX

    if(newWidth < 240) newWidth = 240
    if(newWidth > 480) newWidth = 480

    if(sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty("left", `${newWidth}px`)
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`)
    }
   }

   const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
   }

   const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? "100%" : "240px"
      navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)")
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px")

      setTimeout(() => setIsResetting(false), 300)
    }
   }

   const collapse = () => {
    if(sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = "0"
      navbarRef.current.style.setProperty("width", "100%")
      navbarRef.current.style.setProperty("left", "0")
      setTimeout(() => setIsResetting(false), 300)
    }
   }

  return (
    <>
      <aside ref={sidebarRef} className={cn("group/sidebar flex flex-col h-full w-60 relative dark:bg-[#2a2a2a] bg-[#F2F3F5] ", isResetting && "transition-all ease-in-out duration-300", isMobile && "w-0")}>
       <div onClick={collapse} role="button" className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-100 group-hover/sidebar:opacity-100 transition", isMobile && "opacity-100")}>
          <ChevronsLeftIcon className="h-6 w-6"/>
        </div>
         <div className={cn("mt-12", isCollapsed && "hidden")}>
           <SidebarHeader/>
           <div className="mx-3 mt-3">
            <PlanUsage/>
           </div>
           <div className="mt-4 mx-2">
              <p className="text-xs text-neutral-400 mb-3 mt-6">CAMPAIGNS</p>
              {/* CAMPAIGNS */}
              <Accordion type="multiple" defaultValue={['1', '2']} className="space-y-2">
                <SidebarItem/>
              </Accordion>

              <Separator className="my-3"/>

              <div className="mt-2">
                <div className="flex items-center gap-x-4 hover:bg-[#363636] rounded-sm p-1 cursor-pointer">
                   <SettingsIcon className="w-5 h-5 dark:text-neutral-400"/>
                    Settings
                </div>

                <div className="flex items-center gap-x-4 mt-2 hover:bg-[#363636] rounded-sm p-1 cursor-pointer">
                   <CreditCardIcon className="w-5 h-5 dark:text-neutral-400"/>
                   Billing
                </div>

                <div className="flex items-center gap-x-4 mt-2 hover:bg-[#363636] rounded-sm p-1 cursor-pointer">
                   <InfoIcon className="w-5 h-5 dark:text-neutral-400"/>
                    Info
                </div>

                <div className="flex items-center gap-x-4 mt-2 hover:bg-[#363636] rounded-sm p-1 cursor-pointer">
                   <MailIcon className="w-5 h-5 dark:text-neutral-400"/>
                    Contact
                </div>
              </div>
           </div>
         </div>
       <div onMouseDown={handleMouseDown} onClick={resetWidth} className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-[#555555] right-0 top-0"/>
      </aside>

    <div ref={navbarRef} className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]", isResetting && "transition-all ease-in-out duration-300", isMobile && "left-0 w-full")}>
      {!!params.documentId ? (
        // <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth}/> d
        <div></div>
      ) : (
        <nav className="bg-transparent px-3 py-2 mt-2 w-full">
          {isCollapsed && <MenuIcon onClick={resetWidth} className="h-6 w-6 text-muted-foreground cursor-pointer"/>}
        </nav>
      )}
     </div>
    </>
  )
}

export default Sidebar