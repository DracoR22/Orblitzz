'use client'

import { useWelcomeModal } from "@/hooks/modals/use-welcome-modal"
import { Dialog, DialogClose, DialogContent } from "../ui/dialog"
import DashboardSetup from "../dashboard/dashboard-setup"
import { Button } from "../ui/button"

const WelcomeModal = () => {

  const { isOpen, onClose, onOpen } = useWelcomeModal()

  return (
    <Dialog defaultOpen>
    <DialogContent className="max-w-md p-0 overflow-hidden dark:bg-[#1e1e1e]">
      <div className="mx-auto space-y-4 p-6">
        <h2 className="font-semibold text-xl">
          Welcome to your dashboard 👋
        </h2>
        <p className="text-sm font-semibold text-muted-foreground">
          Let&apos;s start by choosing the keywords you like the most
        </p>
        <div>
         <p>
            You can start by drag and dropping the keywords AI generated for you to the
             <span className="underline decoration-wavy text-blue-400 mx-1 underline-offset-4 md:underline-offset-8">
              Active Keywords 
            </span>
           field
         </p>
         <p className="mt-3">
          It&apos;s great to have you onboard! 🚀
         </p>
        </div>
        <div className="flex justify-between">
        <div/>
        <DialogClose asChild>
        <Button className="text-white">
          Got It, thanks
        </Button>
        </DialogClose>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  )
}

export default WelcomeModal