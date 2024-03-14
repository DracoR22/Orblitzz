'use client'

import { cn } from '@/lib/utils'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import KeywordItem from './keyword-item'
import { BotIcon, InfoIcon, UserIcon } from 'lucide-react'
import Hint from '../global/hint'
import { useState } from 'react'
import { trpc } from "@/server/trpc/client"
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface Props {
  columns: any
  keywords: any
  projectId: string
}

function reorder<T>(column: T[], startIndex: number, endIndex: number) {
  const result = Array.from(column)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const KeywordsContainer = ({ columns, keywords, projectId }: Props) => {

  const [orderedData, setOrderedData] = useState(keywords)

  const router = useRouter()

   const { mutate: updateKeywordMutation } = trpc.keyword.updateKeywordOrder.useMutation({
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        return toast.error('Please Login to do this action')
      }

      if (err instanceof ZodError) {
        return toast.error(err.issues[0].message)
      }

     toast.error('Something went wrong while generating keywords. Please try again later.')
    },
    onSuccess: () => {
     
    }
   })

   const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (!destination) return

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

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
      }
    }
   }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-[700px] h-[400px] dark:bg-[#242424] bg-[#f6f6f6] p-4 rounded-md">
        {columns.map((column: any) => {
          const columnKeywords = orderedData.filter((keyword: any) => keyword.columnId === column.id);
          return (
          <div key={column.id} className="flex-1">
          <div className='flex items-center gap-x-4'>
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
             <div className={cn('', column.id === '1' && 'border-r h-[300px]')}>
               <Droppable droppableId={column.id} type='keyword' direction='vertical'>
                  {(provided) => (
                    <ol ref={provided.innerRef} {...provided.droppableProps}
                    className={cn(`px-4 py-0.5 flex flex-col gap-y-2`, 
                    columnKeywords && columnKeywords.length > 0 ? 'mt-2' : 'mt-0',
                    )}>
                       {columnKeywords.map((keyword: any, index: number) => (
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