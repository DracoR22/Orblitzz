'use client'

import { KeywordType } from "@/lib/db/schema/keyword"
import { Draggable } from "@hello-pangea/dnd"

interface Props {
    keyword: Pick<KeywordType, 'id' | 'content' | 'order' | 'columnId'>
    index: number
}

const KeywordItem = ({ keyword, index }: Props) => {
  return (
    <Draggable draggableId={keyword.id!} index={index}>
       {(provided) => (
         <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
         className="truncate border-2 dark:border-transparent border-neutral-200 py-2 px-4 text-sm bg-white dark:bg-[#363636] rounded-md shadow-sm font-medium">
             {keyword.content}
         </div>
       )}
    </Draggable>
  )
}

export default KeywordItem