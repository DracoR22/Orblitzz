'use client'

import { checkPlanKeywordsLimitClient, cn } from '@/lib/utils'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import KeywordItem from './keyword-item'
import { BotIcon, InfoIcon, UserIcon } from 'lucide-react'
import Hint from '../global/hint'
import { useEffect, useState } from 'react'
import { trpc } from "@/server/trpc/client"
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { KeywordType } from '@/lib/db/schema/keyword'
import { useActiveKeywords } from '@/hooks/states/use-keywords-available'
import { getUserSubscriptionPlan } from '@/lib/stripe/stripe'
import { Skeleton } from '../ui/skeleton'
import { RedditCampaignType } from '@/lib/db/schema/reddit'
import { getMonthlyReplies } from '@/server/actions/reddit-actions'
import { useAutoRedditReply } from '@/hooks/use-auto-reddit-reply'
import { isToday } from 'date-fns'

interface Props {
  columns: {
    id: string;
    title: string;
    isAdded: boolean;
  }[];
  projectId: string,
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>> 
  projectAutoReplyLimit:  Pick<RedditCampaignType, 'id' | 'title' | 'autoReply' | 'autoReplyLimit'>
  repliesCreatedThisMonth: Awaited<ReturnType<typeof getMonthlyReplies>>
  repliesCreatedToday: Awaited<ReturnType<typeof getMonthlyReplies>>
}

function reorder<T>(column: T[], startIndex: number, endIndex: number) {
  const result = Array.from(column)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const KeywordsContainer = ({ columns, projectId, subscriptionPlan, projectAutoReplyLimit, repliesCreatedThisMonth, repliesCreatedToday }: Props) => {

  const [orderedData, setOrderedData] = useState<any>(null)
  // const [todayUpdatedKeywords, setTodayUpdatedKeywords] = useState<number | undefined>(0)

  const { data } = trpc.keyword.getAllKeywords.useQuery({ projectId })

  const { setActiveKeywords } = useActiveKeywords()

  const columnIds = data && data.allKeywords.map(keyword => keyword.columnId);
  const filterKeywords = data && data.allKeywords.filter(keyword => keyword.columnId === "1");
  
  const keywordsUpdatedToday = data && data.allKeywords.filter(keyword => isToday(keyword.updatedAt as string))
  
  const { isAddedKeywordPossible } = checkPlanKeywordsLimitClient({ activeKeywords: columnIds?.filter((columnId) => columnId === '1') as string[], planName: subscriptionPlan.name as string})

   const { mutate: updateKeywordMutation } = trpc.keyword.updateKeywordOrder.useMutation({
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        return toast.error('Please Login to do this action')
      }

      if (err instanceof ZodError) {
        return toast.error(err.issues[0].message)
      }

     toast.error('Something went wrong while updating keywords. Please try again later.')
     console.log(err)
    },
    // YOU CAN REMOVE THE CONDITIONAL AND IT WILL STILL WORK
    onSuccess: ({ updatedKeyword }) => {
       console.log(updatedKeyword)
      //  if (updatedKeyword.columnId === '1') {
      //   addKeyword(updatedKeyword.columnId)
      //  } else {
      //   setActiveKeywords(columnIds?.filter((columnId) => columnId === '1') as string[])
      //  }
    }
   })
 
   useEffect(() => {
    if (data) {
      setOrderedData(data.allKeywords)
      // setTodayUpdatedKeywords(keywordsUpdatedToday?.length)
    }
  }, [data]);

  const { handleAutoReply } = useAutoRedditReply({ repliesCreatedThisMonth, allKeywords: data?.allKeywords.filter((d) => d.columnId === "1").map((d) => d.content) as string[], subscriptionPlan, projectAutoReplyLimit, repliesCreatedToday, projectId })
  

   const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (!destination) return

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    // Return if user has reached its keyword limit
    if (destination.droppableId === '1' && !isAddedKeywordPossible) return

    if (type === 'keyword') {
       let newOrderedData = [...orderedData]

       // Source and destination keyword
       let sourceColumn = newOrderedData.filter(keyword => keyword.columnId === source.droppableId)
       let destColumn = newOrderedData.filter(keyword => keyword.columnId === destination.droppableId)

       if (!sourceColumn || !destColumn) return

       // Moving the keyword in the same column
       if (source.droppableId === destination.droppableId) {
        const reorderedKeywords = reorder(sourceColumn, source.index, destination.index);

        // Combine reorderedKeywords and newOrderedData
        const updatedOrderedData = [...reorderedKeywords, ...newOrderedData];

        // Create a set of unique keywords based on their id
        const uniqueKeywords = Array.from(new Set(updatedOrderedData.map(keyword => keyword.id))).map(id => updatedOrderedData.find(keyword => keyword.id === id));

        setOrderedData(uniqueKeywords);

        // Trigger Backend
        // updateKeywordMutation({ projectId, items: reorderedKeywords })

       } else { // User moves keyword to another column
        const [movedKeyword] = sourceColumn.splice(source.index, 1);
      
        // Assign the new ColumnId to the keyword
        movedKeyword.columnId = destination.droppableId;
      
        // Update order for the source column
        sourceColumn.forEach((keyword: any, idx) => {
          keyword.order = idx;
        });
      
        // Update order for the destination column
        destColumn.splice(destination.index, 0, movedKeyword);
        destColumn.forEach((keyword, idx) => {
          keyword.order = idx;
        });
      
        // Concatenate the updated source and destination columns
        const updatedColumns = [...sourceColumn, ...destColumn];
      
        // Sort the combined array based on order
        updatedColumns.sort((a, b) => a.order - b.order);
      
        setOrderedData(updatedColumns);

         // Trigger backend
         updateKeywordMutation({ projectId, items: destColumn })

         // Update keywords global state
         setActiveKeywords(orderedData.filter((o: any) => o.columnId === "1").map((o: any) => o.createdAt) as string[])
        //  setTodayUpdatedKeywords((prevCount: any) => prevCount + 1);

      }
    }

    if (destination.droppableId === "1") {
      // console.log("calling auto reply function")
     handleAutoReply()
    }
   }

   if (orderedData === null) {
    return (
      <div>
        <Skeleton className='flex w-[700px] h-[1000px] p-4 rounded-md'/>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* {todayUpdatedKeywords ? todayUpdatedKeywords : 0} */}
        <div className="flex w-[700px] h-fit border p-4 rounded-md">
        {columns.map((column) => {
          const columnKeywords = orderedData.filter((keyword:  Pick<KeywordType, 'id' | 'content' | 'order' | 'columnId'>) => keyword.columnId === column.id);
          return (
          <div key={column.id} className="flex-1">
          <div className='flex items-center gap-x-4 ml-4'>
            <div className={cn("w-4 h-4 mb-2 rounded-full", column.id === '1' ? 'bg-blue-500' : 'bg-red-500 ')}/>
             <h2 className=" font-bold mb-2">{column.title}</h2>
              {column.id === '1' && (
                <div className='flex items-center gap-x-6'>
                  <small className='mb-3 bg-blue-400/10 text-blue-500 p-2 rounded-full'><UserIcon className='w-5 h-5'/></small>
                  <Hint description='Drag and drop the generated keywords here to add them to your project.'>
                  <InfoIcon className='h-4 w-4 text-muted-foreground dark:text-neutral-400 mb-6'/>
                </Hint>
                </div>
              )}

              {column.id === '2' && (
                <div className='flex items-center gap-x-6'>
                  <small className='mb-3 bg-red-400/10 text-red-500 p-2 rounded-full'><BotIcon className='w-5 h-5'/></small>
                 <Hint description='These are some AI generated keywords that might fit your project description'>
                  <InfoIcon className='h-4 w-4 text-muted-foreground dark:text-neutral-400 mb-6'/>
                 </Hint>
                </div>
              )}
          </div>
            <div className='border-t w-full'/>
             <div className={cn('', column.id === '1' && 'border-r h-[480px]')}>
               <Droppable droppableId={column.id} type='keyword' direction='vertical'>
                  {(provided) => (
                    <ol ref={provided.innerRef} {...provided.droppableProps}
                    className={cn(`px-4 py-0.5 flex flex-col gap-y-2`, 
                    columnKeywords && columnKeywords.length > 0 ? 'mt-2' : 'mt-0',
                    )}>
                       {columnKeywords.map((keyword:  Pick<KeywordType, 'id' | 'content' | 'order' | 'columnId'>, index: number) => (
                         <KeywordItem key={keyword.id} index={index} keyword={keyword}/>
                       ))}
                       {provided.placeholder}
                    </ol>
                  )}
               </Droppable>
             </div>
          </div>
         )})}
      </div>
    </DragDropContext>
  )
}

export default KeywordsContainer