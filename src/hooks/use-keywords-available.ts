import { create } from 'zustand';

// THIS HOOK IS USED FOR GETTING AND UPDATING IN REAL TIME THE USER ACTIVE KEYWORDS

interface KeywordsStore {
  activeKeywords: string[];
  setActiveKeywords: (keywords: string[]) => void;
  addKeyword: (keyword: string) => void;
}

const useKeywordStore = create<KeywordsStore>((set) => ({
  activeKeywords: [],
  setActiveKeywords: (keywords) => set({ activeKeywords: keywords }),
  addKeyword: (keyword) => set((state) => ({ activeKeywords: [...state.activeKeywords, keyword] })),
}));

// Custom hook to access the replies from the store
export const useActiveKeywords = () => {
  const { activeKeywords, setActiveKeywords, addKeyword } = useKeywordStore();
  return { activeKeywords, setActiveKeywords, addKeyword };
};