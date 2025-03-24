"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DraggableVisualElement } from "./DraggableVisualElement"
import { visualElements as defaultVisualElements } from "@/lib/data/visualElements"
import { getConfig } from "@/lib/services/configService"

interface MobileVisualElementsProps {
  usedElements: number[]
  draggedElement: number | null
  onDragStart: (e: React.DragEvent, elementId: number) => void
  onDragEnd: () => void
  onElementClick: (elementId: number) => void
  allowDisplay?: boolean
  activeCanvas: number
}

export function MobileVisualElements({
  usedElements,
  draggedElement,
  onDragStart,
  onDragEnd,
  onElementClick,
  allowDisplay = false,
  activeCanvas
}: MobileVisualElementsProps) {
  const [visualElements, setVisualElements] = useState(defaultVisualElements);
  
  // 使用 Next.js 的搜索参数
  const searchParams = useSearchParams();
  
  // 当URL参数变化时加载配置
  useEffect(() => {
    const configParam = searchParams?.get('config');
    console.log("URL config param in MobileVisualElements:", configParam);
    
    // 根据URL参数决定加载哪个配置文件
    const configName = configParam && ['youcaihua', 'chunxiao', 'qingwa', 'niaomingjian'].includes(configParam)
      ? configParam
      : 'default';
    
    const loadedConfig = getConfig(configName);
    console.log("MobileVisualElements - config loaded:", configName);
    
    setVisualElements(loadedConfig.visualElements);
  }, [searchParams]);
  
  // Get elements for the current active canvas passed as prop
  const activeCanvasElements = visualElements[activeCanvas] || [];
  
  // Check if any elements are available to display
  const availableElements = activeCanvasElements.filter(element => !usedElements.includes(element.id))
  const hasAvailableElements = availableElements.length > 0 && allowDisplay
  
  // Don't render if no elements are available or not allowed to display
  if (!hasAvailableElements) {
    return null; // Don't render anything
  }
  
  return (
    <div className="md:hidden flex flex-col mb-2 px-2">
      <h3 className="text-base font-medium text-gray-700 w-full text-center mb-2">Symbols</h3>
      <div className="flex overflow-x-auto py-2 gap-3 pb-2">
        {availableElements.map((element) => (
          <div key={element.id} className="flex flex-col items-center gap-1 min-w-[70px]">
            <DraggableVisualElement
              element={element}
              isDragging={draggedElement === element.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={onElementClick}
            />
            <span className="text-[10px] text-gray-600 text-center">{element.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}