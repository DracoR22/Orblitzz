import { BadgeCheckIcon, CheckIcon, ChevronDownIcon, ChevronsLeftIcon, PlusCircleIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Hint from "../global/hint"
import { Button } from "../ui/button";
import { useCreateProjectModal } from "@/hooks/modals/use-create-project-modal";
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe";
import { RedditCampaignType } from "@/lib/db/schema/reddit";
import { Label } from "../ui/label";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUpdatePlanModal } from "@/hooks/modals/use-update-plan-modal";

interface SidebarHeaderProps {
  collapse: () => void;
  isMobile: boolean
  projectTitle?: string
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
  allProjects?: Pick<RedditCampaignType, 'id' | 'title' | 'autoReply' | 'autoReplyLimit'>[] | undefined
}

const SidebarHeader = ({ collapse, isMobile, projectTitle, subscriptionPlan, allProjects }: SidebarHeaderProps) => {

   const { onOpen } = useCreateProjectModal()
   const { onOpen: onOpenUpdate } = useUpdatePlanModal()

   const params = useParams()

  return (
    <DropdownMenu>
      <div className="flex items-center mr-4">
       <Hint side="left" description="Switch Projects">
        <DropdownMenuTrigger asChild onClick={(e: any) => e.stopPropagation()}>
          <div role="button" className="w-full text-md font-semibold px-3 flex items-center cursor-pointer h-12 border-neutral-200
           transition truncate">
            <BadgeCheckIcon className="w-6 h-6 text-green-500 mr-3"/>
              {projectTitle}
            <ChevronDownIcon className="h-5 w-5 ml-2 text-muted-foreground"/>
          </div>
        </DropdownMenuTrigger>
        </Hint>
           <div onClick={collapse} role="button" className={cn("h-6 w-6 absolute top-[24px] right-2 text-muted-foreground rounded-sm hover:bg-[#e3e3e3] dark:hover:bg-neutral-600 opacity-100 group-hover/sidebar:opacity-100 transition", isMobile && "opacity-100")}>
             <ChevronsLeftIcon className="h-6 w-6"/>
           </div>
        </div>
        <DropdownMenuContent className="dark:bg-[#1e1e1e] bg-[#ffffff] overflow-auto">
          <div className="mb-2">
          <Label className="mx-2 text-muted-foreground font-medium text-xs">Your Projects</Label>
          </div>
          {/* ALWAYS SHOW FIRST THE CURRENT PROJECT */}
          {allProjects && [...allProjects.filter((project) => project.id === params.projectId),
           ...allProjects.filter((project) => project.id !== params.projectId)].map((project) => (
          <DropdownMenuItem key={project.id} className="w-56 cursor-pointer dark:bg-[#1e1e1e] bg-[#ffffff] text-sm font-medium text-black dark:text-neutral-400 space-y-[2px] hover:bg-[#e3e3e3] dark:hover:bg-[#242424]">
            <Link href={`/dashboard/${project.id}`} className="w-full flex items-center gap-x-2">
              {project.title}
              {project.id === params.projectId && (
                 <CheckIcon className="w-4 h-4 text-green-500" />
              )}
            </Link>
         </DropdownMenuItem>
          ))}
           <DropdownMenuItem className="w-full dark:bg-[#1e1e1e] bg-[#ffffff] text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] hover:bg-[#e3e3e3] dark:hover:bg-[#242424] mt-10">
                {allProjects?.length! >= subscriptionPlan.projects! ? (
                   <Button className="w-full text-white gap-x-2 text-sm" size={'icon'} onClick={() => onOpenUpdate()}>
                      <PlusCircleIcon className="w-4 h-4"/> Create new project
                   </Button>
                ) : (
                  <Button className="w-full text-white gap-x-2 text-sm" size={'icon'} onClick={() => onOpen({ subscriptionPlan })}>
                   <PlusCircleIcon className="w-4 h-4"/> Create new project
                  </Button>
                )}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SidebarHeader