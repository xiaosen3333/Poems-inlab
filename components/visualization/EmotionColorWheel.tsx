"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { emotionColorWheelData, uiConstants } from "@/lib/config/appConfig";

interface EmotionColorWheelProps {
  className?: string;
  onAutoAnalyze?: () => void;
}

const EmotionColorWheel = ({
  className,
  onAutoAnalyze,
}: EmotionColorWheelProps) => {
  const [showExtensions, setShowExtensions] = useState(false);

  // Handle auto analyze click
  const handleAutoAnalyze = () => {
    setShowExtensions(true);
    if (onAutoAnalyze) onAutoAnalyze();
  };

  // Get the max bar length from configuration
  const maxBarLength = uiConstants.colorWheel.maxBarLength;

  return (
    <div className={cn("flex flex-row justify-between pr-8 pl-8", className)}>
      {/* Left side - legend */}
      <div className="flex flex-col justify-start">
        {/* Emotion color legend */}
        <div className="flex flex-col mb-6 px-4">
          {emotionColorWheelData.map(({ emotion, color }) => (
            <div key={emotion} className="flex items-center mb-1">
              <div
                className="mr-2 h-3 w-3"
                style={{
                  backgroundColor: color,
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)",
                }}
              />
              <span className="text-xs text-gray-700">{emotion}</span>
            </div>
          ))}
        </div>
        {/* Auto analyze button */}
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

      {/* Color wheel container - right side */}
      <div className="relative h-[180px] w-[180px]">
        {/* Color wheel image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/colorCircle.png"
            alt="Color Circle"
            width={160}
            height={160}
            className="rounded-full"
            priority
          />
        </div>

        {/* Color bars that appear after analysis */}
        {showExtensions && (
          <div className="absolute inset-0">
            {emotionColorWheelData.map(({ emotion, color, value, degree }) => {
              // Calculate bar length based on value percentage
              const barLength = (value / 100) * maxBarLength;
              // Calculate position based on angle
              const radians = (degree * Math.PI) / 180;
              const centerX = 90; // Center X coordinate (half of container width)
              const centerY = 90; // Center Y coordinate (half of container height)
              const radius = 80; // Radius of the color wheel (slightly smaller than container dimensions)

              // Calculate the bar's starting position at the edge of the wheel
              const startX = centerX + Math.cos(radians) * radius;
              const startY = centerY + Math.sin(radians) * radius;

              // Default bar width
              const barWidth = 14;

              // Calculate rotation for the bar to point outward from center
              const rotation = degree;

              return (
                <div
                  key={emotion}
                  className="absolute origin-left transition-all duration-500 ease-out"
                  style={{
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${barLength}px`,
                    height: `${barWidth}px`,
                    backgroundColor: color,
                    transform: `rotate(${rotation}deg) translateY(-${
                      barWidth / 2
                    }px)`,

                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    borderRadius: "2px",
                    zIndex: 5,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export { EmotionColorWheel };
