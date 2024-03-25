import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md dark:bg-[#262626] bg-[#f6f6f6]", className)}
      {...props}
    />
  )
}

export { Skeleton }
