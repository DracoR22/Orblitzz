'use client'

import { useCreateProjectModal } from "@/hooks/modals/use-create-project-modal"
import { Dialog, DialogContent } from "../ui/dialog"
import DashboardSetup from "../dashboard/dashboard-setup"

const CreateProjectModal = () => {

  const { isOpen, onClose, onOpen, data } = useCreateProjectModal()
  const { subscriptionPlan, isModal } = data

  return (
     <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#1e1e1e] overflow-scroll md:max-h-[700px] md:h-fit h-screen">
           <DashboardSetup isModal={isModal} subscriptionPlan={subscriptionPlan!}/>
        </DialogContent>
     </Dialog>
  )
}

export default CreateProjectModal