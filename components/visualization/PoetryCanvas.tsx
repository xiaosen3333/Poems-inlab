"use client";

import { useCallback } from "react";
import { CanvasElement } from "./CanvasElement";
import { CanvasElement as CanvasElementType } from "@/hooks/useCanvasElements";
import { VisualElement } from "@/lib/data/visualElements";

interface PoetryCanvasProps {
  canvasElements: CanvasElementType[];
  setCanvasElements: React.Dispatch<React.SetStateAction<CanvasElementType[]>>;
  draggedElement: number | null;
  selectedCanvasElement: string | null;
  setSelectedCanvasElement: (id: string | null) => void;
  addElementToCanvas: (elementId: number, x: number, y: number) => void;
  removeCanvasElement: (id: string) => void;
  visualElements: VisualElement[];
  onDragEnd?: () => void;
}

export function PoetryCanvas({
  canvasElements,
  setCanvasElements,
  draggedElement,
  selectedCanvasElement,
  setSelectedCanvasElement,
  addElementToCanvas,
  removeCanvasElement,
  visualElements,
  onDragEnd,
}: PoetryCanvasProps) {
  // Handle canvas mouse movement
  const handleCanvasElementDrag = useCallback(
    (
      e: React.MouseEvent,
      elementId: string,
      startElementX: number,
      startElementY: number,
      canvasRect: DOMRect
    ) => {
      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        setCanvasElements((prev) =>
          prev.map((el) =>
            el.id === elementId
              ? {
                  ...el,
                  // Ensure elements stay completely within the canvas boundaries
                  x: Math.max(
                    0,
                    Math.min(canvasRect.width - el.width, startElementX + dx)
                  ),
                  y: Math.max(
                    0,
                    Math.min(canvasRect.height - el.height, startElementY + dy)
                  ),
                }
              : el
          )
        );
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [setCanvasElements]
  );

  return (
    <div
      className="relative flex-1 border border-dashed border-blue-200 rounded-2xl bg-white overflow-visible min-h-[440px] sm:min-h-[490px] md:min-h-[520px] h-full w-full"
      style={{
        aspectRatio: "1/1",
        width: "602px",
        height: "602px",
        margin: "0 auto",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        // Use a more subtle highlight effect
        e.currentTarget.classList.add("bg-blue-50");
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-blue-50");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-blue-50");
        console.log("Drop event triggered");

        try {
          // Get drop coordinates relative to the canvas
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Handle both dragged elements and direct drops
          if (draggedElement) {
            // If we're tracking a dragged element
            addElementToCanvas(draggedElement, x, y);

            // Force end of drag immediately after drop
            if (onDragEnd) {
              onDragEnd();
            }
          } else {
            // Try to get data from the drop event
            const dataString = e.dataTransfer.getData("text/plain");
            console.log("Drop data:", dataString);

            if (dataString) {
              try {
                const data = JSON.parse(dataString);
                if (data && data.elementId) {
                  addElementToCanvas(data.elementId, x, y);
                }
              } catch (parseError) {
                console.error("Error parsing drag data:", parseError);
              }
            }
          }
        } catch (error) {
          console.error("Error processing drop:", error);
        }
      }}
      onClick={() => {
        // Deselect when clicking on the canvas background
        setSelectedCanvasElement(null);
      }}
    >
      {/* Background instruction text */}
      {canvasElements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
          <div className="text-center text-[#7067DC]/50">
            <p className="text-xl sm:text-2xl font-light">No Image Generated</p>
          </div>
        </div>
      )}

      {/* Render canvas elements */}
      {canvasElements.length > 0 && (
        <div className="absolute inset-0 overflow-visible">
          {canvasElements.map((element) => {
            if (element.type === 'generated-image') {
              return (
                <CanvasElement
                  key={element.id}
                  element={element}
                  isSelected={selectedCanvasElement === element.id}
                  onSelect={setSelectedCanvasElement}
                  onDelete={removeCanvasElement}
                  onStartDrag={handleCanvasElementDrag}
                />
              );
            }
            
            const visualElement = visualElements.find(
              (ve) => ve.id === element.elementId
            );
            if (!visualElement) {
              console.log("Could not find visual element:", element.elementId);
              return null;
            }

            return (
              <CanvasElement
                key={element.id}
                element={element}
                visualElement={visualElement}
                isSelected={selectedCanvasElement === element.id}
                onSelect={setSelectedCanvasElement}
                onDelete={removeCanvasElement}
                onStartDrag={handleCanvasElementDrag}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
