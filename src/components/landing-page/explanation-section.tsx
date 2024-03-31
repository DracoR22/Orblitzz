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
      
          <p className="flex text-sm md:text-base items-center gap-x-2 mb-2">
           <Check className="w-5 h-5 text-green-500"/> Find the posts that best matches your product niche
          </p>
          <p className="flex text-sm md:text-base items-center gap-x-2 mb-2">
           <Check className="w-5 h-5 text-green-500"/> Customizable AI tone and personality
          </p>
          <p className="flex text-sm md:text-base items-center gap-x-2 mb-2">
           <Check className="w-5 h-5 text-green-500"/> AI always recommend your product subtly
          </p>
          <p className="flex text-sm md:text-base items-center gap-x-2 mb-2">
           <Check className="w-5 h-5 text-green-500"/> Automatic replies! No need to move a single finger
          </p>
        </div>
           </div>

          </div>
        </div>
      </section>

      
      {/* GRID SECTION  2*/}
      <section className="">
        <div className="grid lg:grid-cols-2 md:mx-[90px]">
          <div className="flex items-center justify-center flex-col ">
           <div>
           <h3 className="text-3xl font-bold ">How it works?</h3>
           <p className="text-muted-foreground mt-2">It only takes 1 minute of your time.</p>

           <div className="mt-10 ">
             <p className="flex text-sm md:text-base items-center gap-x-2 mb-3 border border-neutral-700 rounded-lg p-4">
              <StepForwardIcon className="w-5 h-5 text-blue-500"/> Create a <span className="font-semibold">FREE</span>  account
             </p>
             <p className="flex text-sm md:text-base items-center gap-x-2 mb-3 border border-neutral-700 rounded-lg p-4">
             <StepForwardIcon className="w-5 h-5 text-blue-500"/> Type your product name and a <span className="font-semibold">simple description</span> 
             </p>
             <p className="flex text-sm md:text-base items-center gap-x-2 mb-3 border border-neutral-700 rounded-lg p-4">
             <StepForwardIcon className="w-5 h-5 text-blue-500"/> AI will generate some keywords based on your <br /> product description
             </p>
             <p className="flex text-sm md:text-base items-center gap-x-2 mb-3 border border-neutral-700 rounded-lg p-4">
             <StepForwardIcon className="w-5 h-5 text-blue-500"/> Now you can either allow AI to automatically reply <br /> to posts or you can choose which posts it can reply to.
             </p>
           </div>
           </div>
          </div>

          <div className='flow-root mt-[70px]'>
              <CardContainer>
            <div className="glass-container">
             <CardItem>
             <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={866}
                quality={100} draggable={false} className='rounded-md shadow-2xl h-[500px] object-cover'/>
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