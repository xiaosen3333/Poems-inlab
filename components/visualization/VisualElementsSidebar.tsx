"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DraggableVisualElement } from "./DraggableVisualElement";
import { visualElements as defaultVisualElements } from "@/lib/data/visualElements";
import { getConfig } from "@/lib/services/configService";

interface VisualElementsSidebarProps {
  usedElements: number[];
  draggedElement: number | null;
  onDragStart: (e: React.DragEvent, elementId: number) => void;
  onDragEnd: () => void;
  onElementClick: (elementId: number) => void;
  allowExpand?: boolean;
  activeCanvas: number;
}

export function VisualElementsSidebar({
  usedElements,
  draggedElement,
  onDragStart,
  onDragEnd,
  onElementClick,
  allowExpand = false,
  activeCanvas,
}: VisualElementsSidebarProps) {
  // State for the sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visualElements, setVisualElements] = useState(defaultVisualElements);
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const configParam = searchParams?.get('config');
    console.log("URL config param in VisualElementsSidebar:", configParam);
    
    const configName = configParam && ['youcaihua', 'chunxiao', 'qingwa', 'niaomingjian'].includes(configParam)
      ? configParam
      : 'default';
    
    const loadedConfig = getConfig(configName);
    console.log("VisualElementsSidebar - config loaded:", configName);
    
    setVisualElements(loadedConfig.visualElements);
  }, [searchParams]);

  // Use the active canvas passed as a prop to get the correct visual elements
  const activeCanvasElements = visualElements[activeCanvas] || [];
  
  // Check if any elements are available to display
  const availableElements = activeCanvasElements.filter(
    (element) => !usedElements.includes(element.id)
  );
  
  // Elements are only considered available if they exist AND allowExpand is true
  const hasAvailableElements = availableElements.length > 0 && allowExpand;

  // Effect to auto-close sidebar when no elements are available
  // Use a ref to track the last manual state change
  const manualToggleRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousOpenStateRef = useRef(sidebarOpen);

  // Effect to auto-collapse sidebar when dragging an element
  useEffect(() => {
    // Only handle state changes when draggedElement changes
    if (draggedElement !== null) {
      // When starting to drag, save current state and collapse
      previousOpenStateRef.current = sidebarOpen;
      setSidebarOpen(false);
      console.log("Collapsing sidebar while dragging, saved state:", previousOpenStateRef.current);
    } else if (previousOpenStateRef.current === true) {
      // When drag ends and sidebar was previously open, expand it again
      console.log("Expanding sidebar after drag completed");
      setTimeout(() => {
        setSidebarOpen(true);
        // Reset the flag after restoring
        previousOpenStateRef.current = false;
      }, 100);
    }
  }, [draggedElement]);

  // Auto toggle logic for elements availability
  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Skip this logic during drag operations
    if (draggedElement !== null) {
      return;
    }

    // Only apply auto-logic if not recently manually toggled
    if (!manualToggleRef.current) {
      // Auto close if no elements available and sidebar is open
      if (!hasAvailableElements && sidebarOpen) {
        setSidebarOpen(false);
        console.log("Auto-closing sidebar - no elements");
      } 
      // Auto open if elements become available and sidebar is closed (not during drag)
      else if (
        hasAvailableElements && 
        !sidebarOpen && 
        !previousOpenStateRef.current && // Don't conflict with drag restore logic
        usedElements.length < activeCanvasElements.length
      ) {
        setSidebarOpen(true);
        console.log("Auto-opening sidebar - elements available");
      }
    } else {
      // Reset the manual toggle flag after some time
      timeoutRef.current = setTimeout(() => {
        manualToggleRef.current = false;
      }, 1000);
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasAvailableElements, sidebarOpen, usedElements.length, draggedElement, previousOpenStateRef.current]);

  return (
    <div className="hidden md:block w-0 absolute left-0 top-0 h-full">
      {/* Toggle button */}
      <button
        className={`absolute ${
          sidebarOpen ? "left-[130px]" : "left-0"
        } top-1/2 transform -translate-y-1/2 z-30 
        ${
          sidebarOpen
            ? "bg-[#7067DC] text-white"
            : hasAvailableElements
            ? "bg-white text-black-400 border border-gray-200"
            : "bg-white text-gray-300 border border-gray-200 opacity-70"
        } 
        w-8 h-[150px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg 
        ${!sidebarOpen && hasAvailableElements && "hover:text-[#7067DC]"}`}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Button clicked, current state:", sidebarOpen);

          // Reset the previousOpenStateRef when manually toggling
          previousOpenStateRef.current = false;
          
          // Always allow toggling when sidebar is open (closing)
          // Only allow opening if there are available elements
          if (sidebarOpen || hasAvailableElements) {
            // Set manual toggle flag to prevent auto-toggling immediately
            manualToggleRef.current = true;
            const newState = !sidebarOpen;
            setSidebarOpen(newState);
            console.log("Manual toggling to:", newState);
          }
        }}
      >
        <div className="flex items-center justify-center">
          {sidebarOpen ? (
            <svg
              width="20"
              height="35"
              viewBox="0 0 10 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative left-1"
            >
              <path
                d="M4 1L1 9L4 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="35"
              viewBox="0 0 10 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative right-1"
              style={{ transform: "scaleX(-1)" }}
            >
              <path
                d="M4 1L1 9L4 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </button>

      {/* Sidebar content - Absolutely positioned to float over content */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-300 bg-white rounded-2xl p-4 shadow-lg z-20 border border-gray-100 ${
          sidebarOpen && hasAvailableElements
            ? "opacity-100 w-[130px] translate-x-0"
            : "opacity-0 w-[130px] -translate-x-full pointer-events-none"
        }`}
      >
        {hasAvailableElements && (
          <div className="flex flex-col gap-4 items-center py-1">
            {/* Title at the top */}
            <h3 className="text-base font-medium text-gray-700 w-full text-center border-b pb-2 mb-1">Symbols</h3>
            
            {availableElements.map((element) => (
              <div key={element.id} className="flex flex-col items-center gap-1">
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
        )}
      </div>
    </div>
  );
}
