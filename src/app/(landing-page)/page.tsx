'use client'

import PricingCards from "@/components/global/pricing-cards";
import SubTitleSection from "@/components/landing-page/subtitle-section";
import TitleSection from "@/components/landing-page/title-section"
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Check, ChevronRightIcon, RocketIcon, StepForwardIcon, ZapIcon } from "lucide-react";
import Image from "next/image";

import "@/styles/landing-page-styles.css";
import { cn } from "@/lib/utils";
import { poppins } from "@/components/fonts/fonts";


const Home = () => {

  return (
    <div>
      {/* HEADING */}
      <section className="overflow-hidden px-4 sm:px-6 sm:flex sm:flex-col md:justify-start ">
     <div className="grid lg:grid-cols-2">
     <div>
        <TitleSection
         subheading="Get instant access to an AI that casually mentions your product in social media conversations"
         pill="🦨 How many people know your product?"/>
        
        <Button className="w-[200px] text-white bg-blue-500 clear-start mt-5 flex items-center gap-x-2">
         <RocketIcon/>
           Get Started Free
         </Button>
        
     </div>

          {/* IMAGE */}
        {/* COLOR BLUR */}
      {/* <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
      <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
        className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-blue-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'/>
      </div> */}
      <div className="absolute -top-10 -left-10 h-[500px] w-[300px] blur-3xl bg-blue-500 rounded-full opacity-30"/>

         <div className='flow-root my-10'>
            <div className='glass-container'>
              <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={866}
              quality={100} draggable={false} className='rounded-md shadow-2xl'/>
            </div>
         </div>
          </div>
      </section>
    
     {/* RATING SECTION */}
      <section className="my-[200px]">
       <div className="flex justify-center items-center gap-x-3">
       {/* LEFT LEAVE */}
       <Image draggable={false} src={'/landing-page/leaves-left.png'} alt="" width={80} height={80}/>

       {/* Stars container */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-x-3"> {/* Container for stars */}
          <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25}/>
          <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25}/>
          <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25}/>
          <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25}/>
          <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25}/>
        </div>
        {/* "Hello world" text */}
        <div className="text-center mt-4 text-2xl font-medium">5 out of 5 Reply Quality</div>

        <div className="text-center text-muted-foreground mt-3">With the power of OpenAI <span className="text-white font-semibold">GPT-4</span> <br /> we can provide <span className="text-white font-semibold">human level</span> and highly accurate replies</div>
      </div>

       {/* RIGHT LEAVE */}
        <Image draggable={false} src={'/landing-page/leaves-right.png'} alt="" width={80} height={80}/>
       </div>
     </section>

    {/* IMAGE */}
     <section className="px-4 sm:px-6 flex justify-center items-center flex-col relative">
         <div className="w-[30%] blur-[120px] rounded-full h-32 absolute bg-brand-primaryBlue/50 -z-10 top-22"/>
            <SubTitleSection title="Keep track of all your replies" subheading="Capture your ideas, thoughts, and meeting notes in a structured and organized manner."/>
            <div className='flow-root my-10'>
              <div className="magic h-[666px] w-[1164px] border border-slate-100/20 bg-slate-200 bg-slate-200/10 backdrop-blur-md">
               <Image src='/landing-page/ai-replies.png' alt='product preview' fill
                quality={100} draggable={false} className='p-2 shadow-2xl ring-1 z-[999] ring-gray-900/10 h-full object-cover'/>
              </div>
            </div>
            <Button className="text-white font-medium text-md flex items-center gap-x-2">
               <RocketIcon/>
                Increase your visibility now →
            </Button>
            <small className="text-muted-foreground text-sm mt-3">2 clicks away from getting more customers for you product</small>
       </section>

         {/* IMAGE 2 */}
      <section className="px-4 sm:px-6 mt-[200px] flex justify-center items-center flex-col relative">
         <div className="w-[30%] blur-[120px] rounded-full h-32 absolute bg-brand-primaryBlue/50 -z-10 top-22"/>
            <SubTitleSection title="Keep track of all your replies" subheading="Capture your ideas, thoughts, and meeting notes in a structured and organized manner."/>
            <div className='flow-root my-10'>
              <div className="magic h-[666px] w-[1164px] border border-slate-100/20 bg-slate-200 bg-slate-200/10 backdrop-blur-md">
               <Image src='/landing-page/ai-replies.png' alt='product preview' fill
                quality={100} draggable={false} className='p-2 shadow-2xl ring-1 z-[999] ring-gray-900/10 h-full object-cover'/>
              </div>
            </div>
            <Button className="text-white font-medium text-md flex items-center gap-x-2">
               <RocketIcon/>
                Increase your visibility now →
            </Button>
            <small className="text-muted-foreground text-sm mt-3">2 clicks away from getting more customers for you product</small>
       </section>

     {/* GRID IMAGES*/}
       <section className="my-[180px] mx-[80px] z-[999]">
         <SubTitleSection title="Why use Orblitzz?" pill="Say something here" subheading="Tell peaople why they should use this product"/>
         {/* FIRST LINE */}
         <div className="grid grid-cols-2 gap-x-4 mt-14"  style={{ gridTemplateColumns: '2fr 1fr' }}>
           <div className="w-full relative flex flex-col h-[460px] bg-black/50 p-12 rounded-3xl">
              <h4 className={cn("text-5xl font-semibold leading-snug flex-1 z-[999]", poppins.className)}>
                  Simple setup and full control over how much you want AI to automate.
              </h4>

              <button className="relative flex items-center group text-xl font-medium max-w-[210px]">
                <span>Start for free now</span>
                  <ChevronRightIcon className="ml-2 mt-1 group-hover:hidden transition-all duration-300" />
                  <ArrowRightIcon className="ml-2 mt-1 group-hover:block hidden transition-all duration-300"/>
                <span className="absolute left-0 w-0 bottom-0 top-8 h-[3px] bg-blue-500 transition-all group-hover:w-[170px] duration-300"></span>
             </button>
             <div className="absolute bottom-6 right-6 bg-blue-600 rounded-full h-[300px] w-[300px] blur-2xl bg-opacity-10"/>
           </div>

           <div className="w-full relative h-[460px] bg-black/50 p-8 pb-[140px] rounded-3xl">
            <div className="flex-1 h-full">
            <div className="bg-black rounded-full p-5 w-fit border-[4px] border-blue-500">
              <ZapIcon className="w-12 h-12"/>
             </div>
            </div>

             <div className="">
               <h4 className="text-7xl font-bold">90%</h4>
               <p className="text-muted-foreground text-xl">More efficient marketing</p>
             </div>
             <div className="absolute top-0 left-0 bg-blue-600 rounded-full h-[300px] w-[300px] blur-2xl bg-opacity-10"/>
           </div>
         </div>

         {/* SECOND LINE */}
         <div className="grid grid-cols-2 gap-x-4 mt-5"  style={{ gridTemplateColumns: '1fr 2fr' }}>
         <div className="w-full relative h-[460px] bg-black/50 p-8 pb-[140px] rounded-3xl">
            <div className="flex-1 h-full">
           <div className="flex items-center gap-x-10">
           <div className="bg-black rounded-full p-5 w-fit border-[4px] border-blue-500">
              <Image draggable={false} src={'/landing-page/openai-dark.svg'} alt="" width={45} height={45}/>
             </div>
             <div>
             <Image draggable={false} src={'/landing-page/reddit-white.svg'} alt="" width={50} height={50}/>
             </div>
             <div>
             <Image draggable={false} src={'/landing-page/twitter-white.svg'} alt="" width={50} height={50}/>
             </div>
             <div>
             <Image draggable={false} src={'/landing-page/gmail-white.svg'} alt="" width={50} height={50}/>
             </div>
           </div>
            </div>

             <div className="">
               <p className="text-3xl font-semibold">Getting your product noticed has never been easier.</p>
             </div>
             <div className="absolute top-0 left-0 bg-blue-600 rounded-full h-[300px] w-[300px] blur-2xl bg-opacity-10"/>
           </div>
           <div className="w-full relative flex flex-col h-[460px] bg-black/50 p-12 rounded-3xl">
              <h4 className={cn("text-5xl font-semibold leading-snug flex-1 z-[999]", poppins.className)}>
                  Bring new customers without any effort.
              </h4>

              <button className="relative flex items-center group text-xl font-medium">
                <span>See how to setup you product with Orblitzz</span>
                  <ChevronRightIcon className="ml-2 mt-1 group-hover:hidden transition-all duration-300" />
                  <ArrowRightIcon className="ml-2 mt-1 group-hover:block hidden transition-all duration-300"/>
                <span className="absolute left-0 w-0 bottom-0 top-8 h-[3px] bg-blue-500 transition-all group-hover:w-[420px] duration-300"></span>
             </button>
             <div className="absolute bottom-6 right-6 bg-blue-600 rounded-full h-[300px] w-[300px] blur-2xl bg-opacity-10"/>
           </div>
         </div>
       </section>

      {/* GRID SECTION 1 */}
      <section className="my-[100px]">
      
        <SubTitleSection title="Let AI do all the work" subheading="Orblitzz will automatically market your product while you do other things"/>
        <div className="grid lg:grid-cols-2 mx-[90px] mt-10">
        <div className='flow-root my-10'>
            <div className='glass-container'>
              <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={866}
                quality={100} draggable={false} className='rounded-md shadow-2xl h-[500px] object-cover'/>
            </div>
         </div>

          <div className="flex items-center justify-center flex-col ">
           <div className="lg:ml-10">
           <h3 className={cn("text-3xl font-bold mr-[190px]", poppins.className)}>Get more customers</h3>

        <div className="mt-10">
          <p className="flex items-center gap-x-2 mb-2">
           <Check className="w-5 h-5 text-green-500"/> Find the posts that best matches your product niche
          </p>
          <p className="flex items-center gap-x-1 mb-2">
           <Check className="w-5 h-5 text-green-500"/> Customizable AI tone and personality
          </p>
          <p className="flex items-center gap-x-1 mb-2">
           <Check className="w-5 h-5 text-green-500"/> AI always recommend your product subtly
          </p>
          <p className="flex items-center gap-x-1 mb-2">
           <Check className="w-5 h-5 text-green-500"/> Automatic replies! No need to move a single finger
          </p>
        </div>
           </div>

          </div>
        </div>
      </section>

      
      {/* GRID SECTION  2*/}
      <section className="mt-20">
        <div className="grid lg:grid-cols-2 mx-[90px]">
          <div className="flex items-center justify-center flex-col ">
           <div>
           <h3 className="text-3xl font-bold ">How it works?</h3>
           <p className="text-muted-foreground mt-2">It only takes 1 minute of your time.</p>

           <div className="mt-10 ">
             <p className="flex items-center gap-x-2 mb-3 border border-neutral-700 rounded-lg p-4">
              <StepForwardIcon className="w-5 h-5 text-blue-500"/> Create a <span className="font-semibold">FREE</span>  account
             </p>
             <p className="flex items-center gap-x-2 mb-3 border border-neutral-700 rounded-lg p-4">
             <StepForwardIcon className="w-5 h-5 text-blue-500"/> Type your product name and a <span className="font-semibold">simple description</span> 
             </p>
             <p className="flex items-center gap-x-2 mb-3 border border-neutral-700 rounded-lg p-4">
             <StepForwardIcon className="w-5 h-5 text-blue-500"/> AI will generate some keywords based on your <br /> product description
             </p>
             <p className="flex items-center gap-x-2 mb-3 border border-neutral-700 rounded-lg p-4">
             <StepForwardIcon className="w-5 h-5 text-blue-500"/> Now you can either allow AI to automatically reply <br /> to posts or you can choose which posts it can reply to.
             </p>
           </div>
           </div>
          </div>

          <div className='flow-root mt-[70px]'>
             <div className='glass-container'>
                <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={966}
                 quality={100} draggable={false} className='rounded-md shadow-2xl h-[500px] object-cover'/>
             </div>
         </div>
         
        </div>
      </section>

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