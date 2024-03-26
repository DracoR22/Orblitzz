'use client'

import PricingCards from "@/components/global/pricing-cards";
import SubTitleSection from "@/components/landing-page/subtitle-section";
import TitleSection from "@/components/landing-page/title-section"
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Check, ChevronRightIcon, RocketIcon, StepForwardIcon, ZapIcon } from "lucide-react";
import Image from "next/image";

import "@/styles/landing-page-styles.css";
import GridSection from "@/components/landing-page/grid-section";
import StarsSection from "@/components/landing-page/stars-section";
import VideosSection from "@/components/landing-page/videos-section";
import ExplanationSection from "@/components/landing-page/explanation-section";
import { LampContainer } from "@/components/global/animations/lamp-animation";
import { TracingBeam } from "@/components/global/animations/tracing-beam-animation";
import { Spotlight } from "@/components/global/animations/spotlight-animation";


const Home = () => {

  return (
    <div>
       
      {/* HEADING */}
      <section className="overflow-hidden px-4 sm:px-6 sm:flex sm:flex-col md:justify-start ">
      <Spotlight className="-top-40 left-0 md:left-40 md:-top-20" fill="white"/>
     <div className="grid lg:grid-cols-2">
     <div>
        <TitleSection
         subheading="Orblitzz is an AI that casually mentions your product in social media conversations"
         pill="🦨 How many people know your product?"/>
        
        <Button className="w-[200px] text-white bg-blue-500 clear-start mt-5 flex items-center gap-x-2">
         <RocketIcon/>
           Get Started Free
         </Button>
        
     </div>

      {/* <div className="absolute -top-10 -left-10 h-[500px] w-[300px] blur-3xl bg-blue-500 rounded-full opacity-30"/> */}
         <div className='flow-root my-10'>
            <div className='glass-container'>
              <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={866}
              quality={100} draggable={false} className='rounded-md shadow-2xl'/>
            </div>
         </div>
          </div>
      </section>
 
     
       <StarsSection/>
      
       <VideosSection/>
       <TracingBeam>
       <GridSection/>
       </TracingBeam>
       <ExplanationSection/>
 
      {/* PRICING */}
       <section className="mt-[200px]">
        <SubTitleSection title="The Perfect Plan For You" subheading=" Select a plan that suits your needs and take your productivity to new heights."/>
         <div className="my-10">
           <PricingCards/>
         </div>
       </section>
    </div>
  )
}

export default Home