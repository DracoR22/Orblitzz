'use client'

import TitleSection from "@/components/landing-page/title-section"
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Home = () => {

  return (
    <div>
      {/* HEADING */}
      <section className="overflow-hidden px-4 sm:px-6 sm:flex sm:flex-col md:justify-start ">
     <div className="grid lg:grid-cols-2">
     <div>
        <TitleSection title="Instantly get users for you app" 
        subheading="Get an army of AIs that casually mentions your product in social media conversations"
         pill="✨ How many people know your product?"/>
         <Button className="w-[200px] text-white bg-blue-500 clear-start mt-4">
           Get Started Free
         </Button>
     </div>

          {/* IMAGE */}
         <div>
            <div className=''>
              <div className='flow-root my-10'>
                 <div className='-m-2 rounded-xl bg-gray-900/5 dark:bg-[#242424] p-2 ring-1 ring-inset  ring-gray-900/10 dark:ring-gray-100/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                 <Image src='/landing-page/ai-replies.png' alt='product preview' width={1364} height={866}
                 quality={100} draggable={false} className='rounded-md bg-white dark:bg-[#1e1e1e] p-2 shadow-2xl ring-1 ring-gray-900/10'/>
                 </div>
              </div>
            </div>
          </div>
          </div>
      </section>
    
    </div>
  )
}

export default Home