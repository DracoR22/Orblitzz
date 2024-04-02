'use client'

import UseScrollTop from "@/hooks/use-scroll-top"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import Image from "next/image"
import { poppins } from "../fonts/fonts"
import { HoverBorderGradient } from "../global/animations/hover-border-gradient-animation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { BarChart, BotIcon, Clock1Icon, Link2, MenuIcon, ReplyIcon, SquarePenIcon } from "lucide-react"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu"

const Navbar = () => {

    const scrolled = UseScrollTop()
    const router = useRouter()  

  return (
    <>
      <nav className={cn("hidden z-[99999] bg-transparent fixed top-0 md:flex w-full p-2 transition-all md:px-20 " ,
    scrolled && "border-b shadow-sm bg-white/75 dark:bg-[#1e1e1e] dark:bg-opacity-50 backdrop-blur-md")}>
      {/* LOGO */}
       <Link href={'/'} className="hidden md:flex items-center cursor-pointer">
         <Image draggable="false" quality={100} src="/logo-bg.png" height={55} width={55} alt="Logo" className="rounded-full object-cover"/>
         <p className={cn("font-semibold text-2xl transition ml-2", poppins.className)}>
           Orblitzz
         </p>
       </Link>

       {/* SIGN IN AND UP */}
       <div className="md:ml-auto md:justify-end justify-between flex items-center gap-x-2">   
          <div>
             <NavigationMenu>
               <NavigationMenuList>
                 <NavigationMenuItem>
                   <NavigationMenuTrigger className="font-semibold">
                       Features
                   </NavigationMenuTrigger>
                   <NavigationMenuContent className="dark:bg-[#1e1e1e] bg-white">
                    <div className="grid grid-cols-2 gap-x-6 w-[430px] p-4">
                       <div>
                        <div className="flex items-center gap-x-3">
                          <ReplyIcon className="w-5 h-5"/>
                          <span className="text-sm font-semibold">AI Reddit Replies</span>
                          
                        </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            Automatic Reddit replies
                          </p>

                          <div className="flex items-center gap-x-3 mt-4">
                          <BarChart className="w-5 h-5"/>
                          <span className="text-sm font-semibold">Advanced Analytics</span>
                          
                        </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            Powerful real time analytics
                          </p>

                          <div className="flex items-center gap-x-3 mt-4">
                          <Link2 className="w-5 h-5"/>
                          <span className="text-sm font-semibold">Personalization</span>
                          
                        </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            Personalize the AI tone
                          </p>
                       </div>

                       <div>
                        <div className="flex items-center gap-x-3">
                          <BotIcon className="w-5 h-5"/>
                          <span className="text-sm font-semibold">Human Level Replies</span>
                          
                        </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            Powered by GPT-4 
                          </p>

                          <div className="flex items-center gap-x-3 mt-4">
                          <Clock1Icon className="w-5 h-5"/>
                          <span className="text-sm font-semibold">Fast Setup</span>
                          
                        </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            It only takes a minute!
                          </p>

                          <div className="flex items-center gap-x-3 mt-4">
                          <SquarePenIcon className="w-5 h-5"/>
                          <span className="text-sm font-semibold">AI Text Editor</span>
                          
                        </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            Write posts with AI help <span className="text-xs font-semibold">(Comming Soon)</span>
                          </p>
                       </div>
                    </div>
                   </NavigationMenuContent>
                 </NavigationMenuItem>
               </NavigationMenuList>
             </NavigationMenu>
          </div>

          <div>
             <Button variant='ghost' className="font-semibold" onClick={() => router.push('/log-in')}>
               How it Works?
             </Button>
          </div>

          <div>
             <Button asChild variant='ghost' className="font-semibold">
              <Link href={'#pricing'}>
                  Pricing
              </Link>
             </Button>
         </div>

          <div>
             <Button variant='ghost' className="font-semibold" onClick={() => router.push('/')}>
               Contact
             </Button>
          </div>

          <div className="w-full">
          <Link href="/login" className="relative inline-flex w-[100px] h-10 overflow-hidden rounded-md p-[2px] ">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0074FF_0%,#00C3FF_50%,#0074FF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md dark:bg-neutral-900 dark:hover:bg-black transition bg-background px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Log In
          </span>
        </Link>
          </div>
       </div>
    </nav>

    <nav className="absolute top-5 left-5 md:hidden flex">
      <Sheet>
        <SheetTrigger>
          <MenuIcon/>
        </SheetTrigger>
        <SheetContent className="dark:bg-[#1e1e1e] bg-[#ffffff] z-[9999] ">
         <SheetHeader>
           <SheetTitle className="">
           <div className="flex items-center gap-x-3">
           <Image draggable="false" quality={100} src="/logo-bg.png" height={55} width={55} alt="Logo" className="rounded-full object-cover"/>
             <h4 className="text-xl">Orblitzz</h4>
           </div>
          </SheetTitle>
         </SheetHeader>
         <div className="mt-10">
         <div>
             <Button asChild variant='ghost' className="font-semibold w-full mt-4">
              <Link href={'#pricing'}>
                  Pricing
              </Link>
             </Button>
         </div>
        
          <div>
             <Button variant='ghost' className="font-semibold w-full mt-4" onClick={() => router.push('/log-in')}>
               Features
             </Button>
          </div>

          <div>
             <Button variant='ghost' className="font-semibold w-full mt-4" onClick={() => router.push('/log-in')}>
               How it Works?
             </Button>
          </div>

          <div>
             <Button variant='ghost' className="font-semibold w-full mt-4" onClick={() => router.push('/')}>
               Contact
             </Button>
          </div>

          <div className="w-[90%] absolute bottom-8 ">
          <Link href="/login" className="relative w-full inline-flex h-10 overflow-hidden rounded-md p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0074FF_0%,#00C3FF_50%,#0074FF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Log In
          </span>
        </Link>
          </div>
         </div>
        </SheetContent>
      </Sheet>
    </nav>
    </>
  )
}

export default Navbar