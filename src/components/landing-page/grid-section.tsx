'use client'

import { ArrowRightIcon, ChevronRightIcon, ZapIcon } from "lucide-react"
import Image from "next/image"
import SubTitleSection from "./subtitle-section"
import { cn } from "@/lib/utils"
import { poppins } from "../fonts/fonts"
import { BentoGrid, BentoGridItem } from "../global/animations/bento-grid-animation"
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

import { motion } from "framer-motion";

const GridSection = () => {
  return (
    <>
       <section className="my-[180px]  z-[999]">
         <SubTitleSection title="Why you should use Orblitzz?" pill="No need to manually search for posts" subheading=" With Orblitzz you can save thousands of hours by leaving marketing in Auto-Pilot mode"/>
         
         {/* <div className="grid grid-cols-2 gap-x-4 mt-14"  style={{ gridTemplateColumns: '2fr 1fr' }}>
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

        
         <div className="grid grid-cols-2 gap-x-4 mt-5 "  style={{ gridTemplateColumns: '1fr 2fr' }}>
         <div className="w-full relative h-[460px] bg-black/50 p-8 pb-[140px] rounded-3xl z-[999]">
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
           <div className="w-full relative flex flex-col h-[460px] bg-black/50 p-12 rounded-3xl z-[999]">
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
         </div> */}

<BentoGrid className="max-w-4xl mx-auto mt-[80px]">
  {items.map((item, i) => (
    <BentoGridItem
      key={i}
      title={item.title}
      description={item.description}
      header={item.header}
      icon={item.icon}
      className={i === 3 || i === 6 ? "md:col-span-2" : ""}
    />
  ))}
  
  </BentoGrid>
       </section>
    </>
  )
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);
 
const SkeletonThree = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };
 
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-white dark:bg-black"
      >
        <Image src={'/landing-page/avatar_default_1.png'} alt="" width={10} height={10} className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
      >
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <Image src={'/sidebar/reddit-logo.svg'} alt="" width={10} height={10} className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 " />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black"
      >
         <Image src={'/landing-page/avatar_default_1.png'} alt="" width={10} height={10} className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
    </motion.div>
  );
};
const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
          }}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4"
        ></motion.div>
      ))}
    </motion.div>
  );
};
const SkeletonOne = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        backgroundImage: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <Image
          src="/landing-page/reddit-white.svg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Reddit marketing automation
        </p>
        <p className="border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Be more productive
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <Image
          src="/landing-page/openai-dark.svg"
          alt=""
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
           Best text generator AI model
        </p>
        <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
           GPT-4 
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <Image
          src="/landing-page/twitter-white.svg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          AI text editor for any social media marketing
        </p>
        <p className="border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Easy to use
        </p>
      </motion.div>
    </motion.div>
  );
};
const SkeletonFive = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        backgroundImage: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};
const items = [
  {
    title: "Simple Setup",
    description: (
      <span className="text-sm">
        It only takes 1 minute of your time
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Automated Post Searching",
    description: (
      <span className="text-sm">
        AI will generate keywords and find appropiate posts to reply to
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "0 Spam or out of context replies",
    description: (
      <span className="text-sm">
        Our AI will meticulosly pick the best posts to reply to
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Be more productive",
    description: (
      <span className="text-sm">
        Leave marketing in <span className="font-bold">auto-pilot</span> while you focus on other things
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
 
  {
    title: "AI Powered Text Editor",
    description: (
      <span className="text-sm">
        You can also use a smooth AI text editor to write any social media post
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];

export default GridSection