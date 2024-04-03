import { getUserSubscriptionPlan } from '@/lib/stripe/stripe'
import { create } from 'zustand'

type CreateProjectModalData = {
    subscriptionPlan?: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

type CreateProjectModalStore = {
    isOpen: boolean
    onOpen: (data?: CreateProjectModalData) => void
    onClose: () => void
    data: CreateProjectModalData
}

export const useCreateProjectModal = create<CreateProjectModalStore>((set) => ({
    isOpen: false,
    data: {},
    onOpen: (data = {}) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false })
}))