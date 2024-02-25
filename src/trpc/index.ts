import { authRouter } from "./routers/auth-router"
import { keywordRouter } from "./routers/keyword-router"
import { redditRouter } from "./routers/reddit-router"
import { router } from "./trpc"

export const appRouter = router({
   auth: authRouter,
   reddit: redditRouter,
   keword: keywordRouter
})
 
 export type AppRouter = typeof appRouter