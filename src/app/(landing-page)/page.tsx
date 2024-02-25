'use client'

import { trpc } from "@/trpc/client"

const HomePage = () => {

    const { data: subredditData, isPending } = trpc.reddit.getSubredditsAndPosts.useQuery()

    if (isPending) {
      return(
        <div>
          Fetching posts...
        </div>
      )
    }

  return (
    <div>
      {subredditData && Array.isArray(subredditData) && subredditData.map((item, i) => (
        <div key={i}>
           <h2 className="text-2xl">{item.subreddit}</h2>
           {item.posts.map((post) => (
        <div key={post.postId}>
          {post.postId} - {post.title}
          <span className="text-neutral-400">{post.content}</span>
          <p>Author: {post.author}</p>
          <p>Link: {post.url}</p>
        </div>
      ))}
        </div>
      ))}
    </div>
  )
}

export default HomePage