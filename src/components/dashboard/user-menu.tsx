'use client'

import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Skeleton } from "../ui/skeleton"
import { CreditCardIcon, LogOutIcon, UserIcon } from "lucide-react"
import { signOut } from "next-auth/react"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"

interface UserMenuProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const UserMenu = ({ subscriptionPlan }: UserMenuProps) => {

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
            <DropdownMenuLabel className="flex items-center gap-x-2">
              <UserIcon className="w-5 h-5"/>
              {user?.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="flex items-center gap-x-2 cursor-pointer" >
              {subscriptionPlan.name === 'Free' && <CreditCardIcon className="w-5 h-5"/>}
                 <span className="font-semibold">{subscriptionPlan.name}</span>Plan
             </DropdownMenuItem>
             <DropdownMenuSeparator/>
             <DropdownMenuItem className="flex items-center gap-x-2 cursor-pointer" onClick={() => signOut()}>
              <LogOutIcon className="w-5 h-5"/>
                Sign Out
             </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu