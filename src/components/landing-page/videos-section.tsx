'use client'

import Image from "next/image"
import SubTitleSection from "./subtitle-section"
import { RocketIcon } from "lucide-react"
import { Button } from "../ui/button"

const VideosSection = () => {
  return (
    <>
       <section className="px-4 sm:px-6 flex justify-center items-center flex-col relative">
         <div className="w-[30%] blur-[120px] rounded-full h-32 absolute bg-brand-primaryBlue/50 -z-10 top-22"/>
            <SubTitleSection title="Keep track of all your replies" subheading="Capture your ideas, thoughts, and meeting notes in a structured and organized manner."/>
            <div className='flow-root my-10'>
              <div className="magic max-h-[666px] max-w-[1164px] border border-slate-100/20 bg-slate-200 bg-slate-200/10 backdrop-blur-md">
              <video src='/showcase/hero-video.mp4' autoPlay muted loop controls playsInline
               draggable={false} className='rounded-md object-cover shadow-2xl w-full h-full p-2  ring-1 z-[999] ring-gray-900/10'/>
               {/* <Image src='/landing-page/ai-replies.png' alt='product preview' fill
                quality={100} draggable={false} className='p-2 shadow-2xl ring-1 z-[999] ring-gray-900/10 h-full object-cover'/> */}
              </div>
            </div>
            <Button className="text-white font-medium text-md flex items-center gap-x-2">
               <RocketIcon/>
                Increase your visibility now →
            </Button>
            <small className="text-muted-foreground text-sm mt-3">2 clicks away from getting more customers for you product</small>
       </section>

         {/* IMAGE 2 */}
      <section className="px-4 sm:px-6 mt-[100px] md:mt-[200px] flex justify-center items-center flex-col relative">
         <div className="w-[30%] blur-[120px] rounded-full h-32 absolute bg-brand-primaryBlue/50 -z-10 top-22"/>
            <SubTitleSection title="Change keywords at anytime" subheading="AI finds which posts to reply based on the keywords you choose"/>
            <div className='flow-root my-10'>
              <div className="magic max-h-[666px] max-w-[1164px] border border-slate-100/20 bg-slate-200 bg-slate-200/10 backdrop-blur-md">
               <Image src='/landing-page/ai-replies.png' alt='product preview' width={1000} height={1000}
                quality={100} draggable={false} className='p-2 shadow-2xl ring-1 z-[999] ring-gray-900/10 w-full h-full object-cover'/>
              </div>
            </div>
            <Button className="text-white font-medium text-md flex items-center gap-x-2">
               <RocketIcon/>
                Start getting more sales →
            </Button>
            <small className="text-muted-foreground text-sm mt-3">Don&apos;t let your product get left behind because nobody talks about it</small>
       </section>
    </>
  )
}

export default VideosSection