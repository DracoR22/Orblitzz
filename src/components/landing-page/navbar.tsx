'use client'

import UseScrollTop from "@/hooks/use-scroll-top"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import Image from "next/image"

const Navbar = () => {

    const scrolled = UseScrollTop()
    const router = useRouter()  

  return (
    <nav className={cn(" z-[99999] bg-transparent fixed top-0 flex w-full p-4 transition-all md:px-20" ,
    scrolled && "border-b shadow-sm bg-white/75 dark:bg-[#1e1e1e] dark:bg-opacity-50 backdrop-blur-md")}>
      {/* LOGO */}
       <Link href={'/'} className="hidden md:flex items-center cursor-pointer">
         <Image draggable="false" src="/logo-orblitzz-bg.png" height={65} width={65} alt="Logo" className="rounded-full"/>
         <p className={cn("font-semibold text-2xl hover:text-blue-200 transition")}>
           Orblitzz
         </p>
       </Link>

       {/* SIGN IN AND UP */}
       <div className="md:ml-auto md:justify-end justify-between flex items-center gap-x-2">
         <div>
             <Button asChild variant='ghost' className="font-semibold">
              <Link href={'#pricing'}>
                  Pricing
              </Link>
             </Button>
         </div>
        
          <div>
             <Button variant='ghost' className="font-semibold" onClick={() => router.push('/log-in')}>
               Features
             </Button>
          </div>

          <div>
             <Button variant='ghost' className="font-semibold" onClick={() => router.push('/log-in')}>
               How it Works?
             </Button>
          </div>

          <div>
             <Button variant='ghost' className="font-semibold" onClick={() => router.push('/')}>
               Contact
             </Button>
          </div>

          <div>
             <Button asChild className="font-semibold text-white">
               <Link href={'/login'}>
                  Sign In
               </Link>
             </Button>
          </div>
       </div>
    </nav>
  )
}

export default Navbar