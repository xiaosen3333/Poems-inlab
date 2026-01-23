"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { CanvasElement as CanvasElementType } from "@/hooks/useCanvasElements"
import { VisualElement } from "@/lib/data/visualElements"

interface CanvasElementProps {
  element: CanvasElementType
  visualElement?: VisualElement
  isSelected: boolean
  onSelect: (id: string | number) => void
  onDelete: (id: string | number) => void
  onStartDrag: (
    e: React.MouseEvent, 
    id: string | number, 
    startX: number,
    startY: number,
    canvasRect: DOMRect
  ) => void
}

export function CanvasElement({
  element,
  visualElement,
  isSelected,
  onSelect,
  onDelete,
  onStartDrag
}: CanvasElementProps) {
  const ref = useRef<HTMLDivElement>(null)

  if (element.type === 'generated-image' && element.src) {
    return (
      <div
        ref={ref}
        className={`absolute cursor-move transition-all group ${
          isSelected ? 'z-10' : 'z-1'
        }`}
        style={{
          left: element.position ? `${element.position.x}px` : '0px',
          top: element.position ? `${element.position.y}px` : '0px',
          width: element.size ? `${element.size.width}px` : '600px',
          height: element.size ? `${element.size.height}px` : '600px',
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (typeof element.id === 'string' || typeof element.id === 'number') {
            onSelect(element.id)
          }
        }}
      >
        <div className="relative w-full h-full">
          <img 
            src={element.src} 
            alt="Generated image"
            className="w-full h-full object-contain pointer-events-none"
          />
          
          {/* Delete button overlay */}
          <div className={`absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all
            ${isSelected ? 'bg-opacity-20' : 'bg-opacity-0 group-hover:bg-opacity-10'}`}>
            {isSelected && (
              <button 
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation()
                  if (typeof element.id === 'string' || typeof element.id === 'number') {
                    onDelete(element.id)
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!visualElement) return null;

  return (
    <div
      ref={ref}
      className={`absolute cursor-move transition-all group ${
        isSelected ? 'z-10' : 'z-1'
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (typeof element.id === 'string' || typeof element.id === 'number') {
          onSelect(element.id)
        }
      }}
      onMouseDown={(e) => {
        // For dragging elements on the canvas
        e.stopPropagation()
        if (typeof element.id === 'string' || typeof element.id === 'number') {
          onSelect(element.id)
          
          // Get canvas dimensions
          const canvas = document.querySelector('.relative.flex-1.border.border-dashed')
          const rect = canvas?.getBoundingClientRect() || { width: 800, height: 600 }
          
          onStartDrag(e, element.id, element.x || 0, element.y || 0, rect as DOMRect)
        }
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={visualElement.src}
          alt={visualElement.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          quality={90}
          className="object-contain pointer-events-none"
          style={{ objectFit: "contain", objectPosition: "center" }}
          unoptimized={false}
        />
        
        {/* Delete button overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all
          ${isSelected ? 'bg-opacity-20' : 'bg-opacity-0 group-hover:bg-opacity-10'}`}>
          {isSelected && (
            <button 
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation()
                if (typeof element.id === 'string' || typeof element.id === 'number') {
                  onDelete(element.id)
                }
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}