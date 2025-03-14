"use client"

import { DraggableVisualElement } from "./DraggableVisualElement"
import { visualElements } from "@/lib/data/visualElements"

interface MobileVisualElementsProps {
  usedElements: number[]
  draggedElement: number | null
  onDragStart: (e: React.DragEvent, elementId: number) => void
  onDragEnd: () => void
  onElementClick: (elementId: number) => void
}

export function MobileVisualElements({
  usedElements,
  draggedElement,
  onDragStart,
  onDragEnd,
  onElementClick
}: MobileVisualElementsProps) {
  return (
    <div className="md:hidden flex overflow-x-auto py-2 gap-3 mb-3 pb-3">
      {visualElements.map((element) => (
        // Only show elements that haven't been used yet
        !usedElements.includes(element.id) && (
          <DraggableVisualElement
            key={element.id}
            element={element}
            isDragging={draggedElement === element.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onElementClick}
          />
        )
      ))}
    </div>
  )
}