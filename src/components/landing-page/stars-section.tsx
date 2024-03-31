'use client'

import Image from "next/image"

const StarsSection = () => {
  return (
 <section className="my-[200px]">
    <div className="flex justify-center items-center gap-x-3">
    {/* LEFT LEAVE */}
    <Image draggable={false} src={'/landing-page/leaves-left.png'} alt="" width={80} height={80}/>

    {/* Stars container */}
   <div className="flex flex-col items-center">
     <div className="flex items-center gap-x-3"> {/* Container for stars */}
       <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25} className="md:w-[25px] md:h-[25px] w-[15px] h-[15px]"/>
       <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25} className="md:w-[25px] md:h-[25px] w-[15px] h-[15px]"/>
       <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25} className="md:w-[25px] md:h-[25px] w-[15px] h-[15px]"/>
       <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25} className="md:w-[25px] md:h-[25px] w-[15px] h-[15px]"/>
       <Image draggable={false} src={'/landing-page/star.svg'} alt="" width={25} height={25} className="md:w-[25px] md:h-[25px] w-[15px] h-[15px]"/>
     </div>
     {/* "Hello world" text */}
     <div className="text-center mt-4 text-lg md:text-2xl font-medium">5 out of 5 Reply Quality</div>

     <div className="text-center text-sm md:text-base text-muted-foreground mt-3">With the power of OpenAI <span className="text-white font-semibold">GPT-4</span> <br /> we can provide <span className="text-white font-semibold">human level</span> and highly accurate replies</div>
   </div>

    {/* RIGHT LEAVE */}
     <Image draggable={false} src={'/landing-page/leaves-right.png'} alt="" width={80} height={80}/>
    </div>
  </section>
  )
}

export default StarsSection