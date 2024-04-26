import { create } from 'zustand'

type CreateManualKeywordModalData = {
    setOrderedData?: any
    orderedData?: any
}


type CreateManualKeywordStore = {
    isOpen: boolean
    onOpen: (data?: CreateManualKeywordModalData) => void
    onClose: () => void,
    data: CreateManualKeywordModalData
} 

export const useCreateManualKeywordModal = create<CreateManualKeywordStore>((set) => ({
    isOpen: false,
    data: {},
    onOpen: (data = {}) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false })
}))