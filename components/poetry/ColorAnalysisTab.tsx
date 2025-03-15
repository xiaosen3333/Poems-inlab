"use client";

import { useState } from "react";
import { EmotionRadarChart } from "@/components/visualization/EmotionRadarChart";
import { EmotionColorWheel } from "@/components/visualization/EmotionColorWheel";

interface ColorAnalysisTabProps {
  className?: string;
}

const ColorAnalysisTab = ({ className }: ColorAnalysisTabProps) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Sync both components' analysis state
  const handleAutoAnalyze = () => {
    setShowAnalysis(true);
  };

  return (
    <div className={`${className} h-full overflow-y-auto`}>
      <h2 className="text-xl font-medium mb-6 text-center">
        Analysis of Color and Emotion
      </h2>

      {/* Emotion Radar Chart Section */}
      <div className="flex-1 mb-6 pl-10 pr-10">
        <EmotionRadarChart />
      </div>

      {/* Divider */}
      <div className="mx-auto w-full border-t border-dashed border-[#7067DC] mb-6"></div>

      {/* Color Wheel Section */}
      <div className="flex-1 mb-4">
        <EmotionColorWheel onAutoAnalyze={handleAutoAnalyze} />
      </div>
    </div>
  );
};

export { ColorAnalysisTab };
