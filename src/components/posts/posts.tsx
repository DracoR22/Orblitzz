'use client'

import Hint from "@/components/global/hint"
import { Button } from "@/components/ui/button"
import { userOne } from "@/lib/reddit/reddit"
import { trpc } from "@/server/trpc/client"
import { LinkIcon } from "lucide-react"
import Image from "next/image"  
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ZodError } from "zod"

interface Props {
    projectId: string
    alreadyReplied?: any[] | undefined | null
    activeKeywordData: any
}

const Posts = ({ projectId, alreadyReplied, activeKeywordData }: Props) => {

    const router = useRouter()

   

    if (!activeKeywordData) {
        return(
            <div>
               Select your keyowrds to access this page
            </div>
        )
    }

    //@ts-ignore
    const allKeywords = activeKeywordData.map((k) => k.content)
console.log(allKeywords)
    const { data: subredditData, isPending } = trpc.reddit.getSubredditsAndPosts.useQuery({ allKeywords })

    const { mutate, isPending: isReplyPending } = trpc.reddit.createReply.useMutation({
        onError: (err) => {
            if (err.data?.code === "UNAUTHORIZED") {
              return toast.error('You are not authorized to perform this action')
            }

            if (err instanceof ZodError) {
              return toast.error(err.issues[0].message)
            }

           toast.error('Something went wrong while creating your project. Please try again later.')
       },
        onSuccess: () => {
          toast.success('Replied to post!')
          router.refresh()
        }
    })

    const { mutate: autoReplyMutation } = trpc.reddit.createAutoReply.useMutation({
      onSuccess: () => {
        toast.success('Success')
      }
    })

    if (isPending) {
      return(
        <div>
          Fetching posts...
        </div>
      )
    }

    const handleClick = (postId: string, postContent: string, postUrl: string, postAuthor: string, postTitle: string) => {
        const input = {
            postId: postId,
            projectId: projectId,
            postContent: postContent,
            postUrl,
            postAuthor,
            postTitle
           };

          return mutate(input)
    }

    const onClickTest = () => {
      const input = {
        projectId: projectId,
        allKeywords
       };

       return autoReplyMutation(input)
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <h1 onClick={onClickTest}>Click here to test</h1>
    {subredditData && Array.isArray(subredditData) && subredditData.map((item, i) => (
        item.posts.map((post, j) => (
            <div key={post.url} className="dark:bg-neutral-800 bg-neutral-100 mt-6 rounded-md p-4 h-[320px] flex flex-col justify-between border">
                <h2 className="text-neutral-400 flex justify-end">{post.subreddit}</h2>
                <div>
                    <h3 className="text-2xl font-medium">
                        {post.title.length > 50 ? `${post.title.slice(0, 50)}...` : post.title}
                    </h3>
                </div>
                <span className="text-neutral-400 text-sm">
                    {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
                </span>

                <div className="flex items-center gap-x-3">
                    <Image src={'/sidebar/reddit-logo.svg'} alt="" width={15} height={15} />
                    <p className="text-sm font-medium">{post.author}</p>
                </div>

                <div className="mt-1 flex items-center justify-between">
                    <Hint side="top" sideOffset={10} description="Visit post">
                        <a target="_blank" href={post.url}>
                            <LinkIcon className="h-4 w-4" />
                        </a>
                    </Hint>
                    <div className="flex justify-end">
                     <Button disabled={isReplyPending || alreadyReplied?.some(reply => reply.postId === post.postId)}
                       className="text-white" onClick={() => handleClick(post.postId, post.content, post.url, post.author, post.title)}>
                        {alreadyReplied && alreadyReplied.some(reply => reply.postId === post.postId) ? 'Replied' : 'Reply'}
                     </Button>
                    </div>
                </div>
            </div>
        ))
    ))}
</div>

  )
}

export default Posts