'use client'

import { Draggable } from "@hello-pangea/dnd"

interface Props {
    keyword: any
    index: number
}

const KeywordItem = ({ keyword, index }: Props) => {
  return (
    <Draggable draggableId={keyword.id} index={index}>
       {(provided) => (
         <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
         className="truncate border-2 border-transparent py-2 px-4 text-sm bg-white dark:bg-blue-300/20 rounded-md shadow-sm font-medium">
             {keyword.content}
         </div>
       )}
    </Draggable>
  )
}

export default KeywordItem