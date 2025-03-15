"use client"

import Image from "next/image"
import { VisualElement } from "@/lib/data/visualElements"

interface DraggableVisualElementProps {
  element: VisualElement
  isDragging: boolean
  onDragStart: (e: React.DragEvent, elementId: number) => void
  onDragEnd: () => void
  onClick: (elementId: number) => void
}

export function DraggableVisualElement({
  element,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick
}: DraggableVisualElementProps) {
  const handleDragStart = (e: React.DragEvent) => {
    // Set drag data with element ID
    e.dataTransfer.setData("text/plain", JSON.stringify({ elementId: element.id }));
    
    // Set drag effect to copy
    e.dataTransfer.effectAllowed = "copy";
    
    // Call parent component's drag start handler
    onDragStart(e, element.id);
  };
  
  return (
    <div 
      key={element.id}
      data-element-id={element.id}
      className={`relative w-16 h-16 cursor-grab transition-all group active:cursor-grabbing hover:shadow-lg hover:scale-105 rounded-md ${
        isDragging ? 'opacity-50' : ''
      }`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={() => {
        // Call parent component's drag end handler
        onDragEnd();
      }}
      onClick={() => onClick(element.id)}
    >
      <Image
        src={element.src}
        alt={element.alt}
        fill
        className="object-contain p-1 pointer-events-none rounded-md"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all pointer-events-none">
        <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 text-center px-1">{element.title}</span>
      </div>
    </div>
  )
}