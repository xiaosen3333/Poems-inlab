"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DraggableVisualElement } from "./DraggableVisualElement"
import { visualElements } from "@/lib/data/visualElements"

interface VisualElementsSidebarProps {
  usedElements: number[]
  draggedElement: number | null
  onDragStart: (e: React.DragEvent, elementId: number) => void
  onDragEnd: () => void
  onElementClick: (elementId: number) => void
}

export function VisualElementsSidebar({
  usedElements,
  draggedElement,
  onDragStart,
  onDragEnd,
  onElementClick
}: VisualElementsSidebarProps) {
  // State for the sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="hidden md:block w-0 absolute left-0 top-0 h-full">
      {/* Toggle button */}
      <button 
        className={`absolute ${sidebarOpen ? 'left-[95px]' : 'left-0'} top-1/2 transform -translate-y-1/2 z-30 bg-purple-500 text-white w-8 h-16 rounded-full flex items-center justify-center transition-all duration-300`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>
      
      {/* Sidebar content - Absolutely positioned to float over content */}
      <div 
        className={`absolute top-[200px] left-0 transition-all duration-300 bg-white rounded-lg p-3 shadow-md z-20 ${
          sidebarOpen ? 'opacity-100 w-[90px] translate-x-0' : 'opacity-0 w-[90px] -translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 items-center py-2">
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
      </div>
    </div>
  )
}