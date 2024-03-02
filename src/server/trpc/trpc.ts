import { currentUser } from '@/lib/auth/get-server-session';
import { TRPCError, initTRPC } from '@trpc/server';

const t = initTRPC.create();
const middleware = t.middleware

// AUTH MIDDLEWARE
const isAuth = middleware(async (opts) => {
    const user = await currentUser()

    if (!user || !user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return opts.next({
        ctx: {
            userId: user.id,
            user
        }
    })
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth)