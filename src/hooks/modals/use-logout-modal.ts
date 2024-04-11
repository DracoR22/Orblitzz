import { create } from 'zustand'

type LogoutModalStore = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useLogoutModal = create<LogoutModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))