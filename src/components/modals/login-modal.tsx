'use client'

import { useLoginModal } from "@/hooks/use-login-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

const LoginModal = () => {

  const { isOpen, onClose, onOpen } = useLoginModal()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
             <DialogTitle>
              
             </DialogTitle>
          </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default LoginModal