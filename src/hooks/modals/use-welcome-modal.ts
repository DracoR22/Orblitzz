import { create } from 'zustand'

type WelcomeModalStore = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useWelcomeModal = create<WelcomeModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))