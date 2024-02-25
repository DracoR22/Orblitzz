import { publicProcedure, router } from "../trpc";

export const authRouter = router({
    test: publicProcedure.query(async () => {
       return { message: 'trpc is working' }
    })
})