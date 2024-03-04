import { cn } from "@/lib/utils"

interface HeadingProps {
    title: string
    description: string
    item?: string | undefined
}

const Heading = ({ title, description, item }: HeadingProps) => {
  return (
    <div>
        <div className="flex items-center">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {item && (
          <small className={cn('ml-4 bg-green-400/20 text-green-500 p-1 font-medium rounded-md')}>
            {item}
          </small>
        )}
        </div>
        <p className="text-sm mt-3 text-muted-foreground dark:text-neutral-400">{description}</p>
    </div>
  )
}

export default Heading