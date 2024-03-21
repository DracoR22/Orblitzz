'use client'

import { useCreateProjectModal } from "@/hooks/use-create-project-modal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import DashboardSetup from "../dashboard/dashboard-setup"
import { ScrollArea } from "../ui/scroll-area"

const CreateProjectModal = () => {

  const { isOpen, onClose, onOpen, data } = useCreateProjectModal()
  const { subscriptionPlan } = data

  return (
     <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#1e1e1e] w-[1000px]">
           <DashboardSetup subscriptionPlan={subscriptionPlan!}/>
        </DialogContent>
    </Dialog>
  )
}

export default CreateProjectModal