'use client'

import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { poppins } from "../fonts/fonts"

const LoginForm = () => {
  return (
      <div className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col">
        <Link href={'/'} className="w-full flex justify-start items-center">
        <Image draggable="false" quality={100} src="/logo-bg.png" height={55} width={55} alt="Logo" className="rounded-full object-cover"/>
         <p className={cn("font-semibold text-2xl transition ml-2", poppins.className)}>
           Orblitzz
         </p>
        </Link>
        <span className="text-foreground/60">
           The AI that casually mentions your product in social media conversations
        </span>

        <div>
          <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
           className="flex w-full justify-center border border-black dark:border-none items-center gap-x-4 bg-white text-black dark:text-white dark:bg-neutral-700 font-medium rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600 transition p-2 px-6">
             <Image src={'/google.svg'} alt="" width={20} height={20}/>
             <span>Continue with Google</span>
          </button>
        </div>
      </div>
  )
}

export default LoginForm