'use client'


import { cn } from "@/lib/utils"
import React from "react"
import { poppins } from "../fonts/fonts"

interface SubTitleSectionProps {
    title: string
    subheading?: string
    pill?: string
}

const SubTitleSection = ({ title, subheading, pill }: SubTitleSectionProps) => {
  return (
    <React.Fragment>
        <section className="flex flex-col gap-4 justify-center items-start md:items-center">
           {pill && (
            <article className="rounded-full p-[1px] text-sm dark:bg-gradient-to-t dark:from-brand-primaryBlue dark:to-brand-primaryPurple">
            <div className="rounded-full px-3 py-1 dark:bg-black">
               {pill}
            </div>
         </article>
           )}
           {subheading ? (
            <>
              <h2 className={cn("text-left text-3xl sm:text-5xl sm:max-w-[750px] md:text-center font-bold", poppins.className)}>
                 {title}
              </h2>
              <p className="text-muted-foreground sm:max-w-[450px] md:text-center">
                 {subheading}
              </p>
            </>
           ) : (
            <h1  className={cn("text-left text-3xl sm:text-5xl sm:max-w-[750px] md:text-center font-bold", poppins.className)}>
                {title}
            </h1>
           )}
        </section>
    </React.Fragment>
  )
}

export default SubTitleSection