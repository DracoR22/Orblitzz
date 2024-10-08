'use client'

import Image from "next/image"
import SubTitleSection from "./subtitle-section"
import { RocketIcon } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

const VideosSection = () => {
  return (
    <>
       <section className="px-4 sm:px-6 flex justify-center items-center flex-col relative">
         <div className="w-[30%] blur-[120px] rounded-full h-32 absolute bg-brand-primaryBlue/50 -z-10 top-22"/>
            <SubTitleSection title="Grow Your Brand on Auto-Pilot" subheading="Orblitzz saves you the effort of manually searching for and replying to social media posts to advertise your product."/>
            <div className='flow-root my-10'>
              <div className="magic max-h-[666px] max-w-[1164px] border border-slate-100/20 bg-slate-200 bg-slate-200/10 backdrop-blur-md">
              <video src='/showcase/hero-video.mp4' autoPlay muted loop controls playsInline
               draggable={false} className='rounded-md object-cover shadow-2xl w-full h-full p-2  ring-1 z-[999] ring-gray-900/10'/>
               {/* <Image src='/landing-page/ai-replies.png' alt='product preview' fill
                quality={100} draggable={false} className='p-2 shadow-2xl ring-1 z-[999] ring-gray-900/10 h-full object-cover'/> */}
              </div>
            </div>
            <Button asChild className="text-white font-medium text-md flex items-center gap-x-2">
               <Link href={`/login`}>
               <RocketIcon/>
                Increase your visibility now →
               </Link>
            </Button>
            <small className="text-muted-foreground text-sm mt-3">2 clicks away from getting more customers for you product</small>
       </section>

         {/* IMAGE 2 */}
      <section className="px-4 sm:px-6 mt-[100px] md:mt-[200px] flex justify-center items-center flex-col relative">
         <div className="w-[30%] blur-[120px] rounded-full h-32 absolute bg-brand-primaryBlue/50 -z-10 top-22"/>
            <SubTitleSection title="Real time reply tracking" subheading="You always have full control over the replies the AI creates."/>
            <div className='flow-root my-10'>
              <div className="magic max-h-[666px] max-w-[1164px] border border-slate-100/20 bg-slate-200 bg-slate-200/10 backdrop-blur-md">
              <video src='/showcase/dboard.mp4' autoPlay muted loop controls playsInline
               draggable={false} className='rounded-md object-cover shadow-2xl w-full h-full p-2  ring-1 z-[999] ring-gray-900/10'/>
              </div>
            </div>
            <Button asChild className="text-white font-medium text-md flex items-center gap-x-2">
               <Link href={`/login`}>
                <RocketIcon/>
                 Start getting more sales →
               </Link>
            </Button>
            <small className="text-muted-foreground text-sm mt-3">Don&apos;t let your product get left behind because nobody talks about it</small>
       </section>
    </>
  )
}

export default VideosSection