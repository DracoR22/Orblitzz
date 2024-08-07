'use client'

import { checkPlanKeywordsLimitClient, cn } from '@/lib/utils'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import KeywordItem from './keyword-item'
import { BotIcon, BriefcaseIcon, FlagIcon, InfoIcon, PlayIcon, PlusIcon, UserIcon } from 'lucide-react'
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
import { Button } from '../ui/button'
import { useUpdatePlanModal } from '@/hooks/modals/use-update-plan-modal'
import { useSearchParams } from 'next/navigation'
import WelcomeModal from '../modals/welcome-modal'
import CreateManualKeywordModal from '../modals/create-manual-keyword-modal'

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

  const { onOpen: onOpenUpgrade } = useUpdatePlanModal()

  const searchParams = useSearchParams()
  const isNewUser = searchParams.get('welcome')

  const { setActiveKeywords } = useActiveKeywords()

  const columnIds = data && data.allKeywords.map(keyword => keyword.columnId);
  const filterKeywords = data && data.allKeywords.filter(keyword => keyword.columnId === "1");
  
  const keywordsUpdatedToday = data && data.allKeywords.filter(keyword => isToday(keyword.updatedAt as string))
  
  const { isAddedKeywordPossible } = checkPlanKeywordsLimitClient({ activeKeywords: columnIds?.filter((columnId) => columnId === '1') as string[], planName: subscriptionPlan.name as string})
  const { handleAutoReply } = useAutoRedditReply({ repliesCreatedThisMonth, allKeywords: data?.allKeywords.filter((d) => d.columnId === "1").map((d) => d.content) as string[], subscriptionPlan, projectAutoReplyLimit, repliesCreatedToday, projectId })

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
 
    onSuccess: ({ updatedKeyword }) => {
      //  console.log(updatedKeyword)
       if (updatedKeyword.columnId === '1') {
        handleAutoReply()
       } 
    }
   })
 
   useEffect(() => {
    if (data) {
      setOrderedData(data.allKeywords)
      // setTodayUpdatedKeywords(keywordsUpdatedToday?.length)
    }
  }, [data]);

  

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
  
    if (!destination) return;
  
    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
  
    // Return if user has reached its keyword limit
    if (destination.droppableId === '1' && !isAddedKeywordPossible) return;

    // if (destination.droppableId === '2' && source.droppableId === '3') return

    // if (destination.droppableId === '3' && source.droppableId === '2') return

    
  
    if (type === 'keyword') {
      let newOrderedData = [...orderedData];
  
      // Source and destination keyword
      let sourceColumn = newOrderedData.filter(keyword => keyword.columnId === source.droppableId);
      let destColumn = newOrderedData.filter(keyword => keyword.columnId === destination.droppableId);
  
      if (!sourceColumn || !destColumn) return;
  
      // Moving the keyword in the same column
      if (source.droppableId === destination.droppableId) {
        const reorderedKeywords = reorder(sourceColumn, source.index, destination.index);

        // Combine reorderedKeywords and newOrderedData
        const updatedOrderedData = [...reorderedKeywords, ...newOrderedData];

        // Create a set of unique keywords based on their id
        const uniqueKeywords = Array.from(new Set(updatedOrderedData.map(keyword => keyword.id))).map(id => updatedOrderedData.find(keyword => keyword.id === id));

        setOrderedData(uniqueKeywords);
  
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
        // const updatedColumns = [...sourceColumn, ...destColumn];
      
        // Sort the combined array based on order
       const sorted = newOrderedData.sort((a, b) => a.order - b.order);
      
        setOrderedData(sorted);

         // Trigger backend
         updateKeywordMutation({ projectId, items: destColumn })

         // Update keywords global state
         setActiveKeywords(orderedData.filter((o: any) => o.columnId === "1").map((o: any) => o.createdAt) as string[])

      // Trigger backend update if necessary
      // updateKeywordMutation({ projectId, items: newOrderedData });
      }
    }
  };
  


   if (orderedData === null) {
    return (
      <div>
        <Skeleton className='flex w-[1100px] h-[1000px] p-4 rounded-md'/>
      </div>
    )
  }

  return (
    <>
    {isNewUser && <WelcomeModal/>}
    <DragDropContext onDragEnd={onDragEnd}>
      {/* {todayUpdatedKeywords ? todayUpdatedKeywords : 0} */}
        <div className="flex w-[1100px] h-fit border p-4 rounded-md">
        {columns.map((column) => {
          const columnKeywords = orderedData.filter((keyword:  Pick<KeywordType, 'id' | 'content' | 'order' | 'columnId'>) => keyword.columnId === column.id);
          return (
          <div key={column.id} className="flex-1">
          <div className='flex items-center gap-x-4 ml-4'>
            <div className={cn("w-4 h-4 mb-2 rounded-full", column.id === '1' && 'bg-blue-500', column.id === '2' && 'bg-red-500 ', column.id === '3' && 'bg-green-500 ')}/>
             <h2 className=" font-bold mb-2">{column.title}</h2>
              {column.id === '1' && (
                <div className='flex items-center gap-x-6'>
                  <small className='mb-3 bg-blue-400/10 text-blue-500 p-2 rounded-full'><BriefcaseIcon className='w-5 h-5'/></small>
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

             {column.id === '3' && (
                <div className='flex items-center gap-x-2'>
                  <small className='mb-3 bg-green-400/10 text-green-500 p-2 rounded-full'><UserIcon className='w-5 h-5'/></small>
                 {subscriptionPlan.name === 'Free' ? (
                  <Button onClick={onOpenUpgrade} variant={'outline'} size={'sm'} className='bg-transparent mb-2 ml-3 hover:bg-neutral-700'>
                  <PlusIcon/>
                 </Button>
                 ) : (
                  <CreateManualKeywordModal subscriptionPlan={subscriptionPlan} orderedData={orderedData} setOrderedData={setOrderedData}/>
                 )}
                </div>
              )}
          </div>
            <div className='border-t w-full'/>
             <div className={cn('', column.id === '1' && 'border-r h-[480px]', column.id=== '2' && 'border-r  h-[480px]')}>
               <Droppable droppableId={column.id} type='keyword' direction='vertical'>
                  {(provided) => (
                    <ol ref={provided.innerRef} {...provided.droppableProps}
                    className={cn(`px-4 py-0.5 flex flex-col gap-y-2`, 
                    columnKeywords && columnKeywords.length > 0 ? 'mt-2' : 'mt-0',
                    )}>
                       {columnKeywords.map((keyword:  Pick<KeywordType, 'id' | 'content' | 'order' | 'columnId' | 'originalColumnId'>, index: number) => (
                         <KeywordItem key={keyword.id} index={index} keyword={keyword}/>
                       ))}
                      {/* Conditionally render message if there are no keywords in column 3 */}
                     {column.id === '3' && columnKeywords.length === 0 && (
                         <div className="flex items-center justify-center flex-col mt-10">
                         <div className="opacity-100">
                            <FlagIcon className="text-muted-foreground w-[80px] h-[80px]"/>
                         </div>  
                         {subscriptionPlan.name === 'Free' ? (
                            <Button onClick={onOpenUpgrade}
                            variant={'outline'} className='bg-transparent mb-2 ml-3 hover:bg-neutral-700 mt-3'>
                              Create your own Keyword <PlusIcon className='ml-2'/>
                            </Button>
                         ) : (
                          <CreateManualKeywordModal subscriptionPlan={subscriptionPlan} orderedData={orderedData} setOrderedData={setOrderedData} secondary/>
                         )}
                      </div>
                       )}
                       {provided.placeholder}
                    </ol>
                  )}
               </Droppable>
             </div>
          </div>
         )})}
      </div>
    </DragDropContext>
    </>
  )
}

export default KeywordsContainer