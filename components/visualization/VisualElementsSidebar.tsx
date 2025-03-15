"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DraggableVisualElement } from "./DraggableVisualElement";
import { visualElements } from "@/lib/data/visualElements";

interface VisualElementsSidebarProps {
  usedElements: number[];
  draggedElement: number | null;
  onDragStart: (e: React.DragEvent, elementId: number) => void;
  onDragEnd: () => void;
  onElementClick: (elementId: number) => void;
}

export function VisualElementsSidebar({
  usedElements,
  draggedElement,
  onDragStart,
  onDragEnd,
  onElementClick,
}: VisualElementsSidebarProps) {
  // State for the sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if any elements are available to display
  const availableElements = visualElements.filter(
    (element) => !usedElements.includes(element.id)
  );
  const hasAvailableElements = availableElements.length > 0;

  // Effect to auto-close sidebar when no elements are available
  // Use a ref to track the last manual state change
  const manualToggleRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto toggle logic
  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only apply auto-logic if not recently manually toggled
    if (!manualToggleRef.current) {
      if (!hasAvailableElements && sidebarOpen) {
        // Auto close when no elements
        setSidebarOpen(false);
        console.log("Auto-closing sidebar - no elements");
      } else if (
        hasAvailableElements &&
        !sidebarOpen &&
        usedElements.length < visualElements.length
      ) {
        // Auto open when elements become available again
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
  }, [hasAvailableElements, sidebarOpen, usedElements.length]);

  return (
    <div className="hidden md:block w-0 absolute left-0 top-0 h-full">
      {/* Toggle button */}
      <button
        className={`absolute ${
          sidebarOpen ? "left-[100px]" : "left-0"
        } top-1/2 transform -translate-y-1/2 z-30 
        ${
          sidebarOpen
            ? "bg-[#7067DC] text-white"
            : hasAvailableElements
            ? "bg-white text-gray-400 border border-gray-200"
            : "bg-white text-gray-300 border border-gray-200 opacity-70"
        } 
        w-10 h-[150px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg 
        ${!sidebarOpen && hasAvailableElements && "hover:text-[#7067DC]"}`}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Button clicked, current state:", sidebarOpen);

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
        {sidebarOpen ? (
          <ChevronLeft className="h-6 w-6" />
        ) : (
          <ChevronRight className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar content - Absolutely positioned to float over content */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-300 bg-white rounded-2xl p-4 shadow-lg z-20 border border-gray-100 ${
          sidebarOpen && hasAvailableElements
            ? "opacity-100 w-[100px] translate-x-0"
            : "opacity-0 w-[100px] -translate-x-full pointer-events-none"
        }`}
      >
        {hasAvailableElements && (
          <div className="flex flex-col gap-3 items-center py-1">
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
        )}
      </div>
    </div>
  );
}
