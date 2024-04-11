'use client'

import { ElementRef, useEffect, useRef, useState } from "react"
import SidebarHeader from "./sidebar-header"
import { useMediaQuery } from "usehooks-ts"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MenuIcon, Plus } from "lucide-react"
import SidebarItem from "./sidebar-item"
import PlanUsage from "./plan-usage"
import { useExtraRoutes, useMarketingRoutes, useRoutes } from "@/hooks/use-routes"
import Hint from "../global/hint"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import { RedditCampaignType } from "@/lib/db/schema/reddit"
import { getMonthlyReplies } from "@/server/actions/reddit-actions"
import { useCreateProjectModal } from "@/hooks/modals/use-create-project-modal"
import { useUpdatePlanModal } from "@/hooks/modals/use-update-plan-modal"

interface SidebarProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
  project: Pick<RedditCampaignType, 'id' | 'title' | 'autoReply' | 'autoReplyLimit'>
  allProjects?:  Pick<RedditCampaignType, 'id' | 'title' | 'autoReply' | 'autoReplyLimit'>[] | undefined
  repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>>
  allKeywords: string[]
}

const Sidebar = ({ subscriptionPlan, project, repliesCreatedThisMonth, allProjects, allKeywords }: SidebarProps) => {

  const isMobile = useMediaQuery("(max-width: 768px)")
  const pathname = usePathname()
  const params = useParams()

  const routes = useRoutes()
  const extraRoutes = useExtraRoutes()
  const marketingRoutes = useMarketingRoutes()

  const { onOpen } = useCreateProjectModal()
  const { onOpen: onOpenUpdate } = useUpdatePlanModal()

  const sidebarRef = useRef<ElementRef<"aside">>(null)
  const navbarRef = useRef<ElementRef<"div">>(null)
  const isResizingRef = useRef<boolean>(false)

  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile)
  const [isResetting, setIsResetting] = useState<boolean>(false)

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
      <aside ref={sidebarRef} className={cn("group/sidebar flex flex-col w-60 relative dark:bg-[#2a2a2a] bg-[#F2F3F5] ", isResetting && "transition-all ease-in-out duration-300", isMobile && "w-0")}>
         <div className={cn("mt-3", isCollapsed && "hidden")}>
           <SidebarHeader allProjects={allProjects} subscriptionPlan={subscriptionPlan} projectTitle={project?.title} collapse={collapse} isMobile={isMobile}/>
           <div className="mx-3 mt-4">
            <PlanUsage allKeywords={allKeywords} subscriptionPlan={subscriptionPlan} repliesCreatedThisMonth={repliesCreatedThisMonth}/>
           </div>
           <div className="mt-4 mx-2">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1 mt-4 font-medium">PROJECT</p>
                </div>
                {allProjects?.length! >= subscriptionPlan.projects! ? (
                <Hint description="New Project">
                 <Plus onClick={() => onOpenUpdate()}
                  className="h-4 mt-[8px] w-4 text-blue-500 rounded-sm cursor-pointer hover:bg-[#e3e3e3] dark:hover:bg-neutral-600 transition"/>
                </Hint>
               ) : (
                <Hint description="New Project">
                 <Plus onClick={() => onOpen({ subscriptionPlan, isModal: true })}
                  className="h-4 mt-[8px] w-4 text-blue-500 rounded-sm cursor-pointer hover:bg-[#e3e3e3] dark:hover:bg-neutral-600 transition"/>
                </Hint>
               )}
              </div>
              
              <div className="mt-2">
                {routes.map((route, i) => (
                 <SidebarItem key={i} active={route.isActive} name={route.name} icon={route.icon} href={route.href}/>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mb-1 mt-6 font-medium">MARKETING TOOLS</p>
              <div className="mt-2">
               {marketingRoutes.map((route, i) => (
                <SidebarItem key={i} active={route.isActive} name={route.name} icon={route.icon} href={route.href}/>
               ))}
              </div>

              <p className="text-xs text-muted-foreground mb-1 mt-6 font-medium">MORE</p>
              <div className="mt-2">
               {extraRoutes.map((route, i) => (
                <SidebarItem key={i} active={route.isActive} name={route.name} icon={route.icon} href={route.href}/>
               ))}
              </div>
           </div>
         </div>
       <div onMouseDown={handleMouseDown} onClick={resetWidth} className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 dark:bg-[#555555] bg-[#d4d4d4] right-0 top-0"/>
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