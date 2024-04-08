'use client'

import Image from "next/image"
import SubTitleSection from "./subtitle-section"
import { cn } from "@/lib/utils"
import { Check, StepForwardIcon } from "lucide-react"
import { poppins } from "../fonts/fonts"
import { LampContainer } from "../global/animations/lamp-animation"
import { CardContainer, CardItem } from "../global/animations/3d-card-animation"

const ExplanationSection = () => {
  return (
    <>
      <LampContainer className="-mt-[170px] -mb-[350px]">
        <SubTitleSection title="Let AI do all the work" subheading="Orblitzz will automatically market your product while you do other things"/>
        </LampContainer>
    <section >
    

        <div className="grid lg:grid-cols-2 md:mx-[90px]">
        <div className='flow-root my-10'>

            <CardContainer>
            <div className="glass-container">
             <CardItem>
             <Image src='/showcase/ss.png' alt='product preview' width={1364} height={866}
                quality={100} draggable={false} className='rounded-md shadow-2xl h-full object-contain'/>
             </CardItem>
               </div>
            </CardContainer>
          
         </div>

          <div className="flex items-center justify-center flex-col ">
            <div className="lg:ml-10">
            <h3 className={cn("text-3xl font-bold z-[999] text-white ", poppins.className)}>Get more customers</h3>
          <div className="mt-10 mb-[100px] md:mb-0">
      
          <p className="flex text-sm md:text-base items-center gap-x-2 mb-3">
           <Check className="w-8 h-8 text-green-500 dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full"/> Find the posts that best matches your product niche
          </p>
          <p className="flex text-sm md:text-base items-center gap-x-2 mb-3">
           <Check className="w-8 h-8 text-green-500 dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full"/> Customizable AI tone and personality
          </p>
          <p className="flex text-sm md:text-base items-center gap-x-2 mb-3">
           <Check className="w-8 h-8 text-green-500 dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full"/> AI always recommend your product subtly
          </p>
          <p className="flex text-sm md:text-base items-center gap-x-2 mb-3">
           <Check className="w-8 h-8 text-green-500 dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full"/> Automatic replies! No need to move a single finger
          </p>
        </div>
           </div>

          </div>
        </div>
      </section>

      
      {/* GRID SECTION  2*/}
      <section id="explanation" className="">
        <div className="grid lg:grid-cols-2 md:mx-[90px]">
          <div className="flex items-center justify-center flex-col ">
           <div>
           <h3 className="text-3xl font-bold ">How it works?</h3>
           <p className="text-muted-foreground mt-2">It only takes 1 minute of your time.</p>

           <div className="mt-10 -ml-2">
             <p className="flex text-sm md:text-base items-center gap-x-2 mb-3">
              <StepForwardIcon className="w-8 h-8 text-green-500 dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full"/> Create a <span className="font-semibold">FREE</span>  account
             </p>
             <p className="flex text-sm md:text-base items-center gap-x-2 mb-3 ">
             <StepForwardIcon className="w-8 h-8 text-green-500 dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full"/> Type your product name and a simple description
             </p>
             <p className="flex text-sm md:text-base items-center gap-x-2 mb-3 ">
             <StepForwardIcon className="w-8 h-8 text-green-500 dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full"/> AI will generate some keywords
             </p>
             <p className="flex text-sm md:text-base items-center gap-x-2 mb-3 ">
             <StepForwardIcon className="w-8 h-8 text-green-500 dark:bg-[#242424] bg-[#fafafa] p-2 rounded-full"/> Now AI will automatically reply to posts online
             </p>
           </div>
           </div>
          </div>

          <div className='flow-root mt-[70px]'>
              <CardContainer>
            <div className="glass-container">
             <CardItem>
             <Image src='/showcase/dashboard.png' alt='product preview' width={1364} height={866}
                quality={100} draggable={false} className='rounded-md shadow-2xl h-[410px] object-cover'/>
             </CardItem>
               </div>
            </CardContainer>
         </div>
         
        </div>
      </section>
      </>
  )
}

export default ExplanationSection