'use client'

import PricingCards from "@/components/global/pricing-cards";
import SubTitleSection from "@/components/landing-page/subtitle-section";
import TitleSection from "@/components/landing-page/title-section"
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

import "@/styles/landing-page-styles.css";

const Home = () => {

  return (
    <div>
      {/* HEADING */}
      <section className="overflow-hidden px-4 sm:px-6 sm:flex sm:flex-col md:justify-start ">
     <div className="grid lg:grid-cols-2">
     <div>
        <TitleSection title="Get users for you app without moving a finger" 
        subheading="Get an army of AIs that casually mentions your product in social media conversations"
         pill="✨ How many people know your product?"/>
        
        <Button className="w-[200px] text-white bg-blue-500 clear-start mt-5">
           Get Started Free
         </Button>
        
     </div>

          {/* IMAGE */}
        {/* COLOR BLUR */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
      <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
        className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80a8ff] to-[#968ff1] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'/>
      </div>

         <div className='flow-root my-10'>
                 <div className='-m-2 rounded-xl bg-gray-900/5 dark:bg-[#242424] p-2 ring-1 ring-inset  ring-gray-900/10 dark:ring-gray-100/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                 <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={866}
                 quality={100} draggable={false} className='rounded-md bg-white dark:bg-[#1e1e1e] p-2 shadow-2xl ring-1 ring-gray-900/10'/>
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

        <div className="text-center text-muted-foreground mt-3">With the power of OpenAI <span className="text-white font-semibold">GPT-4</span> <br /> we can provide human level and highly accurate replies</div>
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
              <div className="magic h-[766px] w-[1164px]">
               <Image src='/landing-page/ai-replies.png' alt='product preview' fill
                quality={100} draggable={false} className='p-2 shadow-2xl ring-1 z-[999] ring-gray-900/10 h-full object-cover'/>
              </div>
            </div>
       </section>

      {/* GRID SECTION 1 */}
      <section>
        <h3 className="font-bold text-5xl flex justify-center my-[100px]">I s-dont know what to say here</h3>
        <div className="grid lg:grid-cols-2 mx-[90px]">
        <div className='flow-root my-10'>
                 <div className='-m-2 rounded-xl bg-gray-900/5 dark:bg-[#242424] p-2 ring-1 ring-inset  ring-gray-900/10 dark:ring-gray-100/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                 <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={866}
                 quality={100} draggable={false} className='rounded-md bg-white dark:bg-[#1e1e1e] p-2 shadow-2xl ring-1 ring-gray-900/10'/>
                 </div>
         </div>

          <div className="flex items-center justify-center flex-col ">
            <h3 className="text-3xl font-bold mr-[190px]">Get more users</h3>

            <div className="mt-10">
              <p className="flex items-center gap-x-1 mb-2">
                <Check className="w-4 h-4 text-green-500"/> Find the posts that best matches your product niche
              </p>
              <p className="flex items-center gap-x-1 mb-2">
                <Check className="w-4 h-4 text-green-500"/> AI always generates human level replies
              </p>
              <p className="flex items-center gap-x-1 mb-2">
                <Check className="w-4 h-4 text-green-500"/> AI always recommend your product subtly
              </p>
              <p className="flex items-center gap-x-1 mb-2">
                <Check className="w-4 h-4 text-green-500"/> Automatic replies! No need to move a single finger
              </p>
            </div>

          </div>
        </div>
      </section>

      
      {/* GRID SECTION  2*/}
      <section className="mt-20">
        <div className="grid lg:grid-cols-2 mx-[90px]">
          <div className="flex items-center justify-center flex-col ">
            <h3 className="text-3xl font-bold mr-[190px]">Every reply is tracked in real-time</h3>

            <div className="mt-10">
              <p className="flex items-center gap-x-1 mb-2">
                <Check className="w-4 h-4 text-green-500"/> Find the posts that best matches your product niche
              </p>
              <p className="flex items-center gap-x-1 mb-2">
                <Check className="w-4 h-4 text-green-500"/> AI always generates human level replies
              </p>
              <p className="flex items-center gap-x-1 mb-2">
                <Check className="w-4 h-4 text-green-500"/> AI always recommend your product subtly
              </p>
              <p className="flex items-center gap-x-1 mb-2">
                <Check className="w-4 h-4 text-green-500"/> Automatic replies! No need to move a single finger
              </p>
            </div>

          </div>

          <div className='flow-root my-10'>
          <div className='flow-root my-10'>
                 <div className='-m-2 rounded-xl bg-gray-900/5 dark:bg-[#242424] p-2 ring-1 ring-inset  ring-gray-900/10 dark:ring-gray-100/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                 <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={866}
                 quality={100} draggable={false} className='rounded-md bg-white dark:bg-[#1e1e1e] p-2 shadow-2xl ring-1 ring-gray-900/10'/>
                 </div>
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