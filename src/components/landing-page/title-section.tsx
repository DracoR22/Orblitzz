import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import Image from "next/image"
import React from "react"
import { poppins } from "../fonts/fonts"

interface TitleSectionProps {
    title?: string
    subheading?: string
    pill?: string
}

const TitleSection = ({ title, subheading, pill }: TitleSectionProps) => {
  return (
    <React.Fragment>
        <section className="flex flex-col gap-4 md:justify-start items-start ">
          {pill && (
             <article className="rounded-full p-[1.5px] text-sm bg-gradient-to-t from-blue-500 to-blue-500">
               <div className="rounded-full px-3 py-1 dark:bg-[#0f0f0f] bg-[#f6f6f6]">
                 {pill}
               </div>
             </article>
          )}
           {subheading ? (
            <>
              <h2 className={cn("text-left text-3xl sm:text-5xl sm:max-w-[500px] md:text-left font-bold mb-4", poppins.className)}>
                 {title}
              </h2>
             <div className="">
             <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <p className="flex items-center gap-x-1 mb-2">
                    <Check className="w-4 h-4 text-green-500"/> AI Reddit Auto-Replies
                  </p>
                  <p className="flex items-center gap-x-1">
                    <Check className="w-4 h-4 text-green-500"/> Real time reply tracking
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-x-1 mb-2">
                    <Check className="w-4 h-4 text-green-500"/> Choose AI Tone
                  </p>
                  <p className="flex items-center gap-x-1">
                    <Check className="w-4 h-4 text-green-500"/> AI powered text editor
                  </p>
                </div>
              </div>
             </div>
              <p className="dark:text-neutral-400 text-sm sm:max-w-[450px] mt-3">
                 {subheading}
              </p>

              <div className="flex items-center gap-x-2">
                <Image draggable={false} src={'/landing-page/openai-dark.svg'} alt="" width={28} height={28}/>
                <Image draggable={false} src={'/sidebar/reddit-logo.svg'} alt="" width={28} height={28}/>
                <Image draggable={false} src={'/landing-page/twitter.svg'} alt="" width={33} height={33}/>
                <Image draggable={false} src={'/sidebar/gmail-logo.svg'} alt="" width={28} height={28}/>
                <Image draggable={false} src={'/landing-page/adfree.svg'} alt="" width={28} height={28}/>
                <div className="border-r dark:border-neutral-600 border-neutral-400 h-[40px] px-1"/>
                <div>
                  <small className="text-muted-foreground ">
                     AI Reddit replies
                  </small>
                </div>
                <div className="border-r dark:border-neutral-600 border-neutral-400 h-[40px] px-1"/>
                <div>
                  <small className="text-muted-foreground ">
                     AI Reddit repl
                  </small>
                </div>
              </div>
            </>
           ) : (
            <h1 className="text-left text-4xl sm:text-6xl sm:max-w-[850px] font-semibold">
                {title}
            </h1>
           )}
        </section>
    </React.Fragment>
  )
}

export default TitleSection