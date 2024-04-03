import { getUserSubscriptionPlan } from '@/lib/stripe/stripe'
import { create } from 'zustand'

type LogoutModalStore = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useCreateProjectModal = create<LogoutModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))