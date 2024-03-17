'use client'

import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Skeleton } from "../ui/skeleton"

const UserMenu = () => {

   const user = useCurrentUser()

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar className="w-[37px] h-[37px]">
            <AvatarImage src={user?.image || ''}/>
            <AvatarFallback>{user?.name && user.name.slice(0, 2)}</AvatarFallback>
         </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-[#1e1e1e]">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu