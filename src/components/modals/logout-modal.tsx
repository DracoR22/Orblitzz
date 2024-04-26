'use client'

import { useUpdatePlanModal } from "@/hooks/modals/use-update-plan-modal"
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { useLogoutModal } from "@/hooks/modals/use-logout-modal"
import { Separator } from "../ui/separator"
import { signOut } from "next-auth/react"
import { LogOutIcon } from "lucide-react"

const LogoutModal = () => {

  const { isOpen, onClose, onOpen } = useLogoutModal()

  const handleLogout = () => {

  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md p-0 overflow-hidden dark:bg-[#1e1e1e]">
      <div className="mx-auto space-y-4 p-6">
        <h2 className="font-semibold text-xl">
          Are you sure you want to sign out?
        </h2>
         <p className="text-sm text-muted-foreground">
            You can always sign back in at any time.
         </p>
      </div>
      
       <div className="p-6 -mt-8 w-full flex justify-between">
        <Button onClick={() => onClose()} variant={'outline'} className="text-white mr-6 bg-transparent dark:hover:bg-neutral-700">
          Cancel
        </Button>
        <Button onClick={() => signOut()} className="text-white ">
          <LogOutIcon className="mr-2"/>
          Sign Out
        </Button>
        </div>
     
    </DialogContent>
  </Dialog>
  )
}

export default LogoutModal