'use client'

import { useEffect, useState } from "react"
import CreateProjectModal from "../modals/create-project-modal"

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
    </>
  )
}

export default ModalProvider