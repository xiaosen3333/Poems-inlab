"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { visualElements } from "@/lib/data/visualElements"
import { loadConfigFromUrl, getConfig } from "@/lib/services/configService"
import { uiConstants as defaultUiConstants } from "@/lib/config/appConfig"

export interface CanvasElement {
  id: string;
  elementId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useCanvasElements(visualElementsConfig?: any) {
  // Active canvas number
  const [activeCanvas, setActiveCanvas] = useState<number>(1)
  
  // 配置相关状态
  const [uiConstants, setUiConstants] = useState(defaultUiConstants);
  
  // 使用 Next.js 的搜索参数
  const searchParams = useSearchParams();
  
  // 当URL参数变化时加载配置
  useEffect(() => {
    const configParam = searchParams?.get('config');
    console.log("URL config param in useCanvasElements:", configParam);
    
    // 根据URL参数决定加载哪个配置文件
    const configName = configParam && ['youcaihua', 'chunxiao', 'qingwa', 'niaomingjian'].includes(configParam)
      ? configParam
      : 'default';
    
    const loadedConfig = getConfig(configName);
    console.log("useCanvasElements - config loaded:", configName, loadedConfig);
    setUiConstants(loadedConfig.uiConstants);
  }, [searchParams]);
  
  // Canvas elements state - separate for each canvas
  const [canvasElements1, setCanvasElements1] = useState<CanvasElement[]>([])
  const [canvasElements2, setCanvasElements2] = useState<CanvasElement[]>([])
  const [canvasElements3, setCanvasElements3] = useState<CanvasElement[]>([])
  const [canvasElements4, setCanvasElements4] = useState<CanvasElement[]>([])
  
  // Track which elements have been used (dragged to canvas) - separate for each canvas
  const [usedElements1, setUsedElements1] = useState<number[]>([])
  const [usedElements2, setUsedElements2] = useState<number[]>([])
  const [usedElements3, setUsedElements3] = useState<number[]>([])
  const [usedElements4, setUsedElements4] = useState<number[]>([])
  
  // Current dragging element
  const [draggedElement, setDraggedElement] = useState<number | null>(null)
  
  // Selected canvas element for moving or deleting
  const [selectedCanvasElement, setSelectedCanvasElement] = useState<string | null>(null)
  
  // 使用传入的visualElements或者默认值
  const [localVisualElements, setLocalVisualElements] = useState(visualElementsConfig || visualElements);
  
  // 当visualElementsConfig变化或activeCanvas变化时更新
  useEffect(() => {
    if (visualElementsConfig) {
      console.log("Updating localVisualElements due to config change or canvas switch");
      setLocalVisualElements(visualElementsConfig);
    }
  }, [visualElementsConfig, activeCanvas]);
  
  // Helper function to check if a canvas has active visual elements defined
  const hasActiveVisualElements = useCallback((canvasNumber: number): boolean => {
    return (localVisualElements[canvasNumber] || []).length > 0
  }, [localVisualElements])
  
  // Helper to get the current canvas elements and setters based on active canvas
  const getCanvasData = useCallback(() => {
    switch (activeCanvas) {
      case 1:
        return {
          canvasElements: canvasElements1,
          setCanvasElements: setCanvasElements1,
          usedElements: usedElements1,
          setUsedElements: setUsedElements1
        }
      case 2:
        return {
          canvasElements: canvasElements2,
          setCanvasElements: setCanvasElements2,
          usedElements: usedElements2,
          setUsedElements: setUsedElements2
        }
      case 3:
        return {
          canvasElements: canvasElements3,
          setCanvasElements: setCanvasElements3,
          usedElements: usedElements3, 
          setUsedElements: setUsedElements3
        }
      case 4:
        return {
          canvasElements: canvasElements4,
          setCanvasElements: setCanvasElements4,
          usedElements: usedElements4,
          setUsedElements: setUsedElements4
        }
      default:
        return {
          canvasElements: canvasElements1,
          setCanvasElements: setCanvasElements1,
          usedElements: usedElements1,
          setUsedElements: setUsedElements1
        }
    }
  }, [
    activeCanvas, 
    canvasElements1, canvasElements2, canvasElements3, canvasElements4,
    usedElements1, usedElements2, usedElements3, usedElements4
  ])

  // Function to mark an element as used
  const markElementAsUsed = useCallback((elementId: number) => {
    const { usedElements, setUsedElements } = getCanvasData();
    if (!usedElements.includes(elementId)) {
      setUsedElements(prev => [...prev, elementId]);
    }
  }, [getCanvasData])

  // Function to add an element to the canvas
  const addElementToCanvas = useCallback((elementId: number, x?: number, y?: number) => {
    console.log("Adding element to canvas:", elementId, "to canvas:", activeCanvas);
    
    const { canvasElements, setCanvasElements } = getCanvasData();
    
    // Get the current canvas's elements and find the specific element
    const visualElementsForCanvas = localVisualElements[activeCanvas] || [];
    const elementData = visualElementsForCanvas.find(el => el.id === elementId);
    
    // Use the element's size from config or default to config values if not found
    const size = elementData?.size || { 
      width: uiConstants.canvasImage.defaultWidth, 
      height: uiConstants.canvasImage.defaultHeight 
    }
    
    // Get canvas dimensions
    const canvas = document.querySelector('.relative.flex-1.border.border-dashed')
    const rect = canvas?.getBoundingClientRect() || { width: 800, height: 600 }
    
    // If x and y not provided, place in center of canvas
    const posX = x ?? rect.width / 2
    const posY = y ?? rect.height / 2
    
    // Center the element at specified position or canvas center
    let centerX = posX - size.width/2
    let centerY = posY - size.height/2
    
    // Constrain to canvas boundaries
    centerX = Math.max(0, Math.min(rect.width - size.width, centerX))
    centerY = Math.max(0, Math.min(rect.height - size.height, centerY))
    
    const newElement = {
      id: `element-${Date.now()}`,
      elementId,
      x: centerX,
      y: centerY,
      width: size.width,
      height: size.height
    }
    
    setCanvasElements(prev => [...prev, newElement])
    
    // Mark this element as used so it disappears from the sidebar
    markElementAsUsed(elementId)
  }, [activeCanvas, getCanvasData, markElementAsUsed])

  // Function to handle element drag start
  const handleDragStart = useCallback((e: React.DragEvent, elementId: number) => {
    setDraggedElement(elementId)
    // Set drag image 
    const img = new Image()
    const element = document.querySelector(`[data-element-id="${elementId}"] img`)
    if (element) {
      img.src = (element as HTMLImageElement).src
    }
    e.dataTransfer.setDragImage(img, 40, 40)
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("text/plain", JSON.stringify({ elementId }))
  }, [])

  // Function to handle element drag end
  const handleDragEnd = useCallback(() => {
    // Add a small delay to ensure the drop event completes first
    setTimeout(() => {
      setDraggedElement(null)
      console.log("Drag ended, resetting draggedElement state")
    }, 50)
  }, [])

  // Function to remove element from canvas
  const removeCanvasElement = useCallback((elementId: string) => {
    const { canvasElements, setCanvasElements, usedElements, setUsedElements } = getCanvasData();
    
    // Get the element's original id before removing
    const element = canvasElements.find(el => el.id === elementId)
    if (element) {
      // Remove from usedElements to make it available again in sidebar
      setUsedElements(prev => prev.filter(id => id !== element.elementId))
      // Remove element from canvas
      setCanvasElements(prev => prev.filter(el => el.id !== elementId))
      setSelectedCanvasElement(null)
    }
  }, [getCanvasData])

  // Computed values for current active canvas
  const canvasElements = getCanvasData().canvasElements;
  const setCanvasElements = getCanvasData().setCanvasElements;  
  const usedElements = getCanvasData().usedElements;
  const setUsedElements = getCanvasData().setUsedElements;

  return {
    // Canvas data
    activeCanvas,
    setActiveCanvas,
    canvasElements,
    setCanvasElements,
    usedElements,
    setUsedElements,
    
    // Element interaction
    draggedElement,
    setDraggedElement,
    selectedCanvasElement,
    setSelectedCanvasElement,
    
    // Functions
    markElementAsUsed,
    addElementToCanvas,
    handleDragStart,
    handleDragEnd,
    removeCanvasElement,
    hasActiveVisualElements,
    
    // Export canvas elements for each canvas so they can be checked externally
    canvasElements1,
    canvasElements2,
    canvasElements3,
    canvasElements4
  }
}