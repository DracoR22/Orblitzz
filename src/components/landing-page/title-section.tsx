import React from "react"

interface TitleSectionProps {
    title: string
    subheading?: string
    pill?: string
}

const TitleSection = ({ title, subheading, pill }: TitleSectionProps) => {
  return (
    <React.Fragment>
        <section className="flex flex-col gap-4 justify-center items-start md:items-center">
          {pill && (
             <article className="rounded-full p-[1px] text-sm dark:bg-gradient-to-t dark:from-blue-500 dark:to-purple-500">
               <div className="rounded-full px-3 py-1 dark:bg-[#0f0f0f]">
                 {pill}
               </div>
             </article>
          )}
           {subheading ? (
            <>
              <h2 className="text-left text-3xl sm:text-5xl sm:max-w-[750px] md:text-center font-semibold">
                 {title}
              </h2>
              <p className="dark:text-neutral-400 sm:max-w-[450px] md:text-center">
                 {subheading}
              </p>
            </>
           ) : (
            <h1 className="text-left text-4xl sm:text-6xl sm:max-w-[850px] md:text-center font-semibold">
                {title}
            </h1>
           )}
        </section>
    </React.Fragment>
  )
}

export default TitleSection