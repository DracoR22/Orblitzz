'use client'

import { cn } from '@/lib/utils'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import KeywordItem from './keyword-item'
import { InfoIcon } from 'lucide-react'
import Hint from '../global/hint'
import { useState } from 'react'
import { KeywordType } from '@/lib/db/schema/keyword'

interface Props {
  columns: any
  keywords: any
}

function reorder<T>(column: T[], startIndex: number, endIndex: number) {
  const result = Array.from(column)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const KeywordsContainer = ({ columns, keywords }: Props) => {

  const [orderedData, setOrderedData] = useState(keywords)

   const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (!destination) return

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (type === 'keyword') {
       let newOrderedData = [...orderedData]

       // Source and destination keyword
       const sourceColumn = newOrderedData.find(keyword => keyword.columnId === source.droppableId)
       
       const destColumn = newOrderedData.find(keyword => keyword.columnId === destination.droppableId)

       if (!sourceColumn || !destColumn) return

       // Check if keywords exists on the source keyword
       if (!sourceColumn.keywords) {
        sourceColumn.keywords = []
       }

       // Check if keywords exists on the destkeyword
       if (!destColumn.keywords) {
        destColumn.keywords = []
       }

       // Moving the keyword in the same column
       if (source.droppableId === destination.droppableId) {
        const reorderedKeywords = reorder(sourceColumn.keywords, source.index, destination.index)

        reorderedKeywords.forEach((keyword: any, idx) => {
          keyword.order = idx
        })

        sourceColumn.keywords = reorderedKeywords

        setOrderedData(newOrderedData)

        // Trigger Backend
       }
    }
   }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-[700px] h-[400px]">
        {columns.map((column: any) => {
          const columnKeywords = keywords.filter((keyword: any) => keyword.columnId === column.id);
          return (
          <div key={column.id} className="flex-1">
          <div className='flex items-center gap-x-4'>
            <div className={cn("w-4 h-4 mb-2 rounded-full", column.id === '1' ? 'bg-blue-500' : 'bg-red-500 ')}/>
             <h2 className="text-lg font-bold mb-2">{column.title}</h2>
              {column.id === '1' && (
                <Hint description='Drag and drop the generated keywords here to add them to your project.'>
                  <InfoIcon className='h-4 w-4 text-muted-foreground dark:text-neutral-400 mb-6'/>
                </Hint>
              )}

              {column.id === '2' && (
                <Hint description='These are some AI generated keywords that might fit your project description'>
                  <InfoIcon className='h-4 w-4 text-muted-foreground dark:text-neutral-400 mb-6'/>
                </Hint>
              )}
          </div>
            <div className='border-t w-full'/>
             <div>
               <Droppable droppableId={column.id} type='keyword'>
                  {(provided) => (
                    <ol ref={provided.innerRef} {...provided.droppableProps}
                    className={cn(` px-4 py-0.5 flex flex-col gap-y-2`, 
                    columnKeywords && columnKeywords.length > 0 ? 'mt-2' : 'mt-0')}>
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