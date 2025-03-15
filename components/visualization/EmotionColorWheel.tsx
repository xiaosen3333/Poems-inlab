"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmotionColorWheelProps {
  className?: string;
  onAutoAnalyze?: () => void;
}

const EmotionColorWheel = ({ className, onAutoAnalyze }: EmotionColorWheelProps) => {
  // Color definitions for emotions
  const emotionColors = [
    { emotion: "Joy", color: "#e8a87c" },
    { emotion: "Surprise", color: "#f8ef86" },
    { emotion: "No Emotion", color: "#c1f486" },
    { emotion: "Sadness", color: "#86b5f4" },
    { emotion: "Fear", color: "#c486f4" },
    { emotion: "Anger", color: "#f486a9" },
  ];

  // Handle auto analyze click
  const handleAutoAnalyze = () => {
    if (onAutoAnalyze) onAutoAnalyze();
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Emotion color legend - Placed on left */}
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-x-4 gap-y-2 mb-4">
        {emotionColors.map(({ emotion, color }) => (
          <div key={emotion} className="flex items-center">
            <div 
              className="mr-2 h-3 w-3 rounded" 
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-700">
              {emotion}
            </span>
          </div>
        ))}
      </div>

      {/* Color wheel container */}
      <div className="flex flex-col items-center">
        <div className="relative h-[150px] w-[150px] mx-auto overflow-hidden">
          <div className="absolute inset-[0] rounded-full border-2 border-white">
            {/* Joy sector */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(50% 50%, 100% 50%, 100% 0, 50% 0)",
                backgroundColor: "#e8a87c",
              }}
            />
            
            {/* Surprise sector */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(50% 50%, 50% 0, 0 0, 0 50%)",
                backgroundColor: "#f8ef86",
              }}
            />
            
            {/* No Emotion sector */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(50% 50%, 0 50%, 0 100%)",
                backgroundColor: "#c1f486",
              }}
            />
            
            {/* Sadness sector */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(50% 50%, 0 100%, 50% 100%)",
                backgroundColor: "#86b5f4",
              }}
            />
            
            {/* Fear sector */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(50% 50%, 50% 100%, 100% 100%)",
                backgroundColor: "#c486f4",
              }}
            />
            
            {/* Anger sector */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(50% 50%, 100% 100%, 100% 50%)",
                backgroundColor: "#f486a9",
              }}
            />

            {/* Pattern overlay */}
            <div className="absolute inset-0 mix-blend-overlay">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)",
                  mixBlendMode: "overlay",
                }}
              />
            </div>
            
            {/* Color tabs */}
            <div className="absolute top-1/4 right-0 w-5 h-10 bg-[#e8a87c] translate-x-1/2 rounded-r-sm" />
            <div className="absolute top-0 right-1/4 w-10 h-5 bg-[#f8ef86] -translate-y-1/2 rounded-t-sm" />
            <div className="absolute top-0 left-1/4 w-10 h-5 bg-[#c1f486] -translate-y-1/2 rounded-t-sm" />
            <div className="absolute top-1/4 left-0 w-5 h-10 bg-[#86b5f4] -translate-x-1/2 rounded-l-sm" />
            <div className="absolute bottom-1/4 left-0 w-5 h-10 bg-[#c486f4] -translate-x-1/2 rounded-l-sm" />
            <div className="absolute bottom-1/4 right-0 w-5 h-10 bg-[#f486a9] translate-x-1/2 rounded-r-sm" />
            
            {/* Inner white circle */}
            <div className="absolute inset-[30%] rounded-full bg-white border-2 border-white" />
          </div>
        </div>

        {/* Auto analyze button - Centered below the wheel */}
        <div className="mt-3 flex justify-center">
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC] border-none text-xs shadow-sm h-[28px] w-[105px]"
            onClick={handleAutoAnalyze}
          >
            Auto Analyze
          </Button>
        </div>
      </div>
    </div>
  );
};

export { EmotionColorWheel };