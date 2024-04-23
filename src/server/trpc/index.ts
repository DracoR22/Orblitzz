import { keywordRouter } from "./routers/keyword-router"
import { redditRouter } from "./routers/reddit-router"
import { router } from "./trpc"

export const appRouter = router({
   reddit: redditRouter,
   keyword: keywordRouter
})
 
 export type AppRouter = typeof appRouter