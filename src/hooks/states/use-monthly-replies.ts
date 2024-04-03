import { RedditReplyType } from '@/lib/db/schema/reddit';
import { create } from 'zustand';

// THIS HOOK IS USED FOR GETTING AND UPDATING IN REAL TIME THE MONTHLY REPLIES OF A USER

interface RepliesStore {
  repliesCreatedThisMonth: Pick<RedditReplyType, 'createdAt'>[];
  setRepliesCreatedThisMonth: (replies: Pick<RedditReplyType, 'createdAt'>[]) => void;
  addReply: (reply: Pick<RedditReplyType, 'createdAt'>) => void;
}

export const useReplyStore = create<RepliesStore>((set) => ({
  repliesCreatedThisMonth: [],
  setRepliesCreatedThisMonth: (replies) => set({ repliesCreatedThisMonth: replies }),
  addReply: (reply) => set((state) => ({ repliesCreatedThisMonth: [...state.repliesCreatedThisMonth, reply] })),
}));

// Custom hook to access the replies from the store
export const useMonthlyReplies = () => {
  const { repliesCreatedThisMonth, setRepliesCreatedThisMonth, addReply } = useReplyStore();
  return { repliesCreatedThisMonth, setRepliesCreatedThisMonth, addReply };
};