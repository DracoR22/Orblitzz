import NextAuth from "next-auth"
import authConfig from "./lib/auth/auth.config"
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, apiStripeWebhookPrefix, authRoutes, publicRoutes } from "./lib/auth/routes"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
  
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isApiStripeWebhook = nextUrl.pathname.startsWith(apiStripeWebhookPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  
    if (isApiAuthRoute || isApiStripeWebhook) {
      return 
    }
  
    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }
      return 
    }
  
    if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL("/", nextUrl))
    }

    if (isLoggedIn && isPublicRoute) {
        return Response.redirect(new URL("/dashboard", nextUrl))
    }
  
    return 
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
 }