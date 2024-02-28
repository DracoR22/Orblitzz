'use client'

import Hint from "@/components/global/hint"
import { Button } from "@/components/ui/button"
import { trpc } from "@/trpc/client"
import { LinkIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const HomePage = () => {

    const { data: subredditData, isPending } = trpc.reddit.getSubredditsAndPosts.useQuery({ keywords: '' })

    if (isPending) {
      return(
        <div>
          Fetching posts...
        </div>
      )
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {subredditData && Array.isArray(subredditData) && subredditData.map((item, i) => (
        <div key={i}>
           {item.posts.map((post) => (
        <div key={post.postId} className="dark:bg-neutral-800 bg-neutral-100 mt-6 rounded-md p-4 h-[320px]  flex flex-col justify-between">
          <h2 className=" text-neutral-400 flex justify-end">{item.subreddit}</h2>
          <div>
           <h3 className="text-2xl font-medium">
             {post.title.length > 50 ? `${post.title.slice(0, 50)}...` : post.title}
           </h3>
          </div>
          <span className="text-neutral-400 text-sm">
            {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
          </span>
          
          <div className="flex items-center gap-x-3">
            <Image src={'/sidebar/reddit-logo.svg'} alt="" width={15} height={15}/>
          <p className="text-sm font-medium">{post.author}</p>
          </div>
         <div className="mt-1 flex items-center justify-between">
         <Hint side="top" sideOffset={10} description="Visit post">
           <a target="_blank" href={post.url}>
            <LinkIcon className="h-4 w-4"/>
          </a>
         </Hint>
         <div className="flex justify-end">
           <Button className="text-white">
             Reply
           </Button>
         </div>
         </div>
        </div>
      ))}
        </div>
      ))}
    </div>
  )
}

export default HomePage