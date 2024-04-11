'use client'

import { useEffect, useState } from "react"
import CreateProjectModal from "../modals/create-project-modal"
import UpdatePlanModal from "../modals/update-plan-modal"
import LogoutModal from "../modals/logout-modal"

const ModalProvider = () => {

   const [isMounted, setIsMounted] = useState(false)

   useEffect(() => {
    setIsMounted(true)
   }, [])

   if (!isMounted) {
    return null
   }

  return (
    <>
      <CreateProjectModal/>
      <UpdatePlanModal/>
      <LogoutModal/>
    </>
  )
}

export default ModalProvider