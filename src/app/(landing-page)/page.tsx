'use client'

import PricingCards from "@/components/global/pricing-cards";
import SubTitleSection from "@/components/landing-page/subtitle-section";
import TitleSection from "@/components/landing-page/title-section"
import { Button } from "@/components/ui/button";
import { MoonIcon, RocketIcon } from "lucide-react";

import "@/styles/landing-page-styles.css";
import GridSection from "@/components/landing-page/grid-section";
import StarsSection from "@/components/landing-page/stars-section";
import VideosSection from "@/components/landing-page/videos-section";
import ExplanationSection from "@/components/landing-page/explanation-section";
import { TracingBeam } from "@/components/global/animations/tracing-beam-animation";
import { Spotlight } from "@/components/global/animations/spotlight-animation";
import FooterSection from "@/components/landing-page/footer-section";
import { EvervaultCard } from "@/components/global/animations/evervault-card-animation";
import CrispChat from "@/components/global/crisp-chat";
import Link from "next/link";

const Home = () => {
  
  return (
    <div>
       <CrispChat/>
      {/* HEADING */}
       <section className="overflow-hidden px-4 sm:px-6 sm:flex sm:flex-col md:justify-start ">
       <Spotlight className="-top-40 left-0 md:left-40 md:-top-20" fill="white"/>
       <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-x-[100px]">
       <div className="mb-[100px] md:mb-0">
        <TitleSection
         subheading="Orblitzz is an AI that casually mentions your product in social media conversations"
         pill="🦨 How many people know your product?"/>
        <Button asChild className="w-[200px] text-white bg-blue-500 clear-start mt-5 flex items-center gap-x-2">
          <Link href={'/login'}>
          <RocketIcon/>
           Get Started Free
          </Link>
         </Button>
       </div>

      <div className="hidden md:flex absolute top-[200px] right-[200px] h-[500px] w-[300px] blur-3xl bg-blue-500 rounded-full opacity-30"/>
         <div className='flex my-10 justify-center md:justify-start'>
         <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-[500px] mx-auto p-4 relative h-[330px]">
      <MoonIcon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <MoonIcon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <MoonIcon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <MoonIcon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
 
      <EvervaultCard text="AI Replies" />
 
      <h2 className="dark:text-white text-black mt-4 text-sm font-light">
        We make use of advanced machine learning algorithms to search for the best posts to reply to.
      </h2>
      <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
        Task 100% Automated
      </p>
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
        <SubTitleSection title="Flexible Pricing" subheading="Select a plan that suits your needs and take your product to new heights."/>
         <div className="my-10 mx-[100px]">
           <PricingCards/>
         </div>
       </section>

       {/* FOOTER */}
       <div id="pricing" className="mt-20">
         <FooterSection/>
       </div>
    </div>
  )
}

export default Home