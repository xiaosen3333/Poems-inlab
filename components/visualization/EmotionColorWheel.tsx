"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getConfig } from "@/lib/services/configService";
import { 
  emotionColorWheelData as defaultEmotionColorWheelData,
  emotionColorWheelLegend as defaultEmotionColorWheelLegend,
  uiConstants as defaultUiConstants
} from "@/lib/config/appConfig";

interface EmotionColorWheelProps {
  className?: string;
  onAutoAnalyze?: () => void;
}

const EmotionColorWheel = ({
  className,
  onAutoAnalyze,
}: EmotionColorWheelProps) => {
  const [showExtensions, setShowExtensions] = useState(false);
  
  // 配置相关状态
  const [emotionColorWheelData, setEmotionColorWheelData] = useState(defaultEmotionColorWheelData);
  const [emotionColorWheelLegend, setEmotionColorWheelLegend] = useState(defaultEmotionColorWheelLegend);
  const [uiConstants, setUiConstants] = useState(defaultUiConstants);
  
  // 使用 Next.js 的搜索参数
  const searchParams = useSearchParams();
  
  // 当URL参数变化时加载配置
  useEffect(() => {
    const configParam = searchParams?.get('config');
    console.log("URL config param in EmotionColorWheel:", configParam);
    
    // 根据URL参数决定加载哪个配置文件
    const configName = configParam && ['youcaihua', 'chunxiao', 'qingwa', 'niaomingjian'].includes(configParam)
      ? configParam
      : 'default';
    
    const loadedConfig = getConfig(configName);
    console.log("EmotionColorWheel - config loaded:", configName);
    
    setEmotionColorWheelData(loadedConfig.emotionColorWheelData);
    setEmotionColorWheelLegend(loadedConfig.emotionColorWheelLegend);
    setUiConstants(loadedConfig.uiConstants);
  }, [searchParams]);

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
          {emotionColorWheelLegend.map((item, index) => {
            // Skip empty items or items without emotion
            if (!item.emotion && !item.color) return null;
            
            return (
              <div 
                key={item.emotion || `empty-${index}`} 
                className="flex items-center mb-1"
              >
                <div
                  className="mr-2 h-3 w-3"
                  style={{
                    backgroundColor: item.color,
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)",
                  }}
                />
                <span className="text-xs text-gray-700">{item.emotion}</span>
              </div>
            );
          })}
        </div>
        {/* Auto analyze button */}
        <div className="mt-3 flex justify-center">
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC] border-none text-xs shadow-md h-[20px] w-[95px]"
            onClick={handleAutoAnalyze}
          >
            Auto Analyze
          </Button>
        </div>
      </div>

      {/* Color wheel container - right side */}
      <div className="relative h-[180px] w-[180px]">
        {/* Color wheel image */}
        <div className="absolute top-3.5 right-0.5 inset-0 flex items-center justify-center rotate-[-3deg]">
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
              const radius = 84; // Radius of the color wheel (slightly smaller than container dimensions)

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
                  className="absolute origin-left transition-all duration-500 ease-out "
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
                    // borderRadius: "2px",
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
