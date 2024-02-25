import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "../db"
import authConfig from "./auth.config"

export const { handlers, auth } = NextAuth({ 
    pages: {
        signIn: '/login',
    },
    callbacks: {
       session: ({ session, token }) => {
         if (token.sub && session.user) {
            session.user.id = token.sub
         }

         if (session.user && token.email) {
            session.user.name = token.name
            session.user.email = token.email
         }

         return session
       }
    },
    adapter: DrizzleAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig
})