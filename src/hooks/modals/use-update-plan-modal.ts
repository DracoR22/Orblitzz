import { create } from 'zustand'

type UpdatePlanModalStore = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useUpdatePlanModal = create<UpdatePlanModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))