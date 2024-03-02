'use client'

import TitleSection from "@/components/landing-page/title-section"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { MoveRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Home = () => {

  return (
    <div>
      <section className="overflow-hidden px-4 sm:px-6 sm:flex sm:flex-col gap-4 md:justify-center md:items-center">
      <div className="hidden dark:block w-full blur-[120px] rounded-full h-32 absolute bg-blue-500 -z-10  top-0"/>
        <TitleSection title="Don't worry about social media marketing anymore." 
        subheading="Orblitzz is an AI tool that automatically gets people to know your product."
         pill="✨ Let AI do all the work"/>
         <Button className="w-[200px] text-white bg-blue-500 clear-start">
           Get Started Free
         </Button>
      </section>
    </div>
  )
}

export default Home