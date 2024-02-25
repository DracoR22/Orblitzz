import { UserType } from "@/lib/db/schema/user";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    isOAuth: boolean
}

declare module 'next-auth' {
    interface Session {
        user: ExtendedUser
    }
}