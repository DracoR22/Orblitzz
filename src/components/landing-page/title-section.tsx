import { Check } from "lucide-react"
import React from "react"

interface TitleSectionProps {
    title: string
    subheading?: string
    pill?: string
}

const TitleSection = ({ title, subheading, pill }: TitleSectionProps) => {
  return (
    <React.Fragment>
        <section className="flex flex-col gap-4 md:justify-start items-start ">
          {pill && (
             <article className="rounded-full p-[1px] text-sm dark:bg-gradient-to-t dark:from-blue-500 dark:to-blue-500">
               <div className="rounded-full px-3 py-1 dark:bg-[#0f0f0f]">
                 {pill}
               </div>
             </article>
          )}
           {subheading ? (
            <>
              <h2 className="text-left text-3xl sm:text-5xl sm:max-w-[500px] md:text-left font-bold mb-4">
                 {title}
              </h2>
             <div className="">
             <div className="grid grid-cols-2 gap-x-10">
                <div>
                  <p className="flex items-center gap-x-1 mb-2">
                    <Check className="w-4 h-4 text-green-500"/> AI Reddit Auto-Replies
                  </p>
                  <p className="flex items-center gap-x-1">
                    <Check className="w-4 h-4 text-green-500"/> Keep Track Of All AI Replies
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-x-1 mb-2">
                    <Check className="w-4 h-4 text-green-500"/> Choose AI Replies Tone
                  </p>
                  <p className="flex items-center gap-x-1">
                    <Check className="w-4 h-4 text-green-500"/> Unlimited AI Post Editor
                  </p>
                </div>
              </div>
             </div>
              <p className="dark:text-neutral-400 text-sm sm:max-w-[450px] mt-3">
                 {subheading}
              </p>
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