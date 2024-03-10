import { ChevronDownIcon, ChevronsLeftIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Hint from "../global/hint"

const SidebarHeader = ({ collapse, isMobile }: { collapse: () => void; isMobile: boolean }) => {
  return (
    <DropdownMenu>
      <div className="flex items-center mr-4">
       <Hint side="left" description="Switch Projects">
        <DropdownMenuTrigger asChild onClick={(e: any) => e.stopPropagation()}>
          <div role="button" className="w-full text-md font-semibold px-3 flex items-center cursor-pointer h-12 border-neutral-200
           transition truncate ">
              Project name
            <ChevronDownIcon className="h-5 w-5 ml-2 text-blue-500 "/>
          </div>
        </DropdownMenuTrigger>
        </Hint>

           <div onClick={collapse} role="button" className={cn("h-6 w-6 absolute top-[24px] right-2 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 opacity-100 group-hover/sidebar:opacity-100 transition", isMobile && "opacity-100")}>
             <ChevronsLeftIcon className="h-6 w-6"/>
           </div>
        </div>
        <DropdownMenuContent>
            <DropdownMenuItem className="w-56 bg-[#1e1e1e] text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] hover:bg-zinc-700/10 dark:hover:bg-[#242424]">
                List of user projects
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SidebarHeader