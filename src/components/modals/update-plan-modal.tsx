'use client'

import { useUpdatePlanModal } from "@/hooks/modals/use-update-plan-modal"
import { Dialog, DialogContent } from "../ui/dialog"
import Image from "next/image"
import { Button } from "../ui/button"
import { useParams, useRouter } from "next/navigation"

const UpdatePlanModal = () => {

  const { isOpen, onClose, onOpen } = useUpdatePlanModal()

  const router = useRouter()
  const params = useParams()

  const handleClick = () => {
    router.push(`/dashboard/${params.projectId}/billing`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden dark:bg-[#1e1e1e]">
        <div className="mx-auto space-y-4 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade for more projects 🚀
          </h2>
          <p className="text-sm font-semibold text-muted-foreground">
            No contracts / cancel anytime
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>More replies per month</li>
              <li>Up to 2 projects</li>
              <li>Increase visibility with more keywords</li>
           
            </ul>
          </div>
          <Button onClick={handleClick} className="text-white w-full">
            See Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpdatePlanModal