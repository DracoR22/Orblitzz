'use client'

import { KeywordType } from "@/lib/db/schema/keyword"
import { Draggable } from "@hello-pangea/dnd"
import { BotIcon, UserIcon } from "lucide-react"

interface Props {
    keyword: Pick<KeywordType, 'id' | 'content' | 'order' | 'columnId' | 'originalColumnId'>
    index: number
}

const KeywordItem = ({ keyword, index }: Props) => {
  return (
    <Draggable draggableId={keyword.id!} index={index}>
       {(provided) => (
         <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
         className="truncate border-2 dark:border-transparent border-neutral-200 py-2 px-4 text-sm bg-white dark:bg-[#363636] rounded-md shadow-sm font-medium">
             <div className="flex items-center justify-between">
               {keyword.content}
               {keyword.originalColumnId === '2' && (
                <small className='bg-red-400/10 text-red-500 p-1 rounded-full'><BotIcon className='w-5 h-5'/></small>
               )}
                {keyword.originalColumnId === '3' && (
                <small className=' bg-green-400/10 text-green-500 p-1 rounded-full'><UserIcon className='w-5 h-5'/></small>
               )}
             </div>
         </div>
       )}
    </Draggable>
  )
}

export default KeywordItem