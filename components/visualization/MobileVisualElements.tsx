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
  // Check if any elements are available to display
  const availableElements = visualElements.filter(element => !usedElements.includes(element.id))
  const hasAvailableElements = availableElements.length > 0
  
  // Don't render if no elements are available
  if (!hasAvailableElements) {
    return null; // Don't render anything
  }
  
  return (
    <div className="md:hidden flex overflow-x-auto py-2 gap-2 mb-2 pb-2 px-2">
      {availableElements.map((element) => (
        <DraggableVisualElement
          key={element.id}
          element={element}
          isDragging={draggedElement === element.id}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onClick={onElementClick}
        />
      ))}
    </div>
  )
}