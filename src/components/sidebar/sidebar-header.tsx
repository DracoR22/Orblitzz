import { ChevronDownIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Image from "next/image"

const SidebarHeader = () => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e: any) => e.stopPropagation()}>
          <div role="button" className="w-full text-md font-semibold px-3 flex items-center cursor-pointer h-12 border-neutral-200
           dark:border-neutral-700 border-b-2  hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition truncate">
               <Image src={'/vercel.svg'} alt="" width={100} height={100} className="w-[50px] h-[50px] rounded-md object-cover mr-4"/>
              Project name
            <ChevronDownIcon className="h-5 w-5 ml-auto"/>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem className="w-56 bg-[#1e1e1e] text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] hover:bg-zinc-700/10 dark:hover:bg-[#242424]">
                List of user projects
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SidebarHeader