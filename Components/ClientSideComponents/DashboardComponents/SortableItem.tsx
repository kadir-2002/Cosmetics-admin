import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LuGrip } from "react-icons/lu";


const SortableItem = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={`relative  ${isDragging ? 'opacity-50' : ''}`}>
      <div className="absolute top-4 left-3 md:top-4 md:left-2 cursor-move z-10 touch-none" {...listeners}>
        <LuGrip size={24} className="text-white" />
      </div>
      {children}
    </div>
  )
}

export default SortableItem

