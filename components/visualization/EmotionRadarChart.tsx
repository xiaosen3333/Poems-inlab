"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataPoint {
  emotion: string;
  angle: number;
  userValue: number;
  analysisValue?: number;
}

interface EmotionRadarChartProps {
  className?: string;
}

const EmotionRadarChart = ({ className }: EmotionRadarChartProps) => {
  // SVG viewbox dimensions
  const svgWidth = 500;
  const svgHeight = 500;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = 180;

  // SVG element ref for click handling
  const svgRef = useRef<SVGSVGElement>(null);

  // Initial data for the radar chart - starting with all points at full
  const initialData: DataPoint[] = [
    { emotion: "Surprise", angle: -90, userValue: 100 }, // Top (12 o'clock)
    { emotion: "Joy", angle: -18, userValue: 100 }, // Top right
    { emotion: "Anger", angle: 54, userValue: 100 }, // Bottom right
    { emotion: "Sadness", angle: 126, userValue: 100 }, // Bottom left
    { emotion: "Fear", angle: 198, userValue: 100 }, // Top left
  ];

  // Analysis data that will be shown after "Auto Analyze"
  const analysisData: DataPoint[] = [
    { emotion: "Surprise", angle: -90, userValue: 100, analysisValue: 65 },
    { emotion: "Joy", angle: -18, userValue: 100, analysisValue: 90 },
    { emotion: "Anger", angle: 54, userValue: 100, analysisValue: 70 },
    { emotion: "Sadness", angle: 126, userValue: 100, analysisValue: 85 },
    { emotion: "Fear", angle: 198, userValue: 100, analysisValue: 60 },
  ];

  const [data, setData] = useState<DataPoint[]>(initialData);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);

  // Generate concentric circles for the radar grid
  const generateCircles = () => {
    const circles = [];
    const circleCount = 4; // Number of concentric circles

    for (let i = 1; i <= circleCount; i++) {
      const circleRadius = (radius * i) / circleCount;
      circles.push(
        <circle
          key={`circle-${i}`}
          cx={centerX}
          cy={centerY}
          r={circleRadius}
          fill="none"
          stroke="#d8d4f2"
          strokeDasharray={i < circleCount ? "4 4" : "none"}
          strokeWidth={i === circleCount ? 1 : 0.75}
        />
      );
    }

    return circles;
  };

  // Calculate coordinates from angle and distance
  const getCoordinates = (angle: number, distance: number) => {
    // Convert angle to radians
    const radians = (angle * Math.PI) / 180;
    // Calculate x and y coordinates
    const x = centerX + Math.cos(radians) * distance;
    const y = centerY + Math.sin(radians) * distance;

    return { x, y };
  };

  // Generate points for the user data polygon
  const getUserPolygonPoints = () => {
    return data
      .map((point) => {
        const coords = getCoordinates(
          point.angle,
          (point.userValue / 100) * radius
        );
        return `${coords.x},${coords.y}`;
      })
      .join(" ");
  };

  // Generate points for the analysis data polygon
  const getAnalysisPolygonPoints = () => {
    return data
      .map((point) => {
        if (!point.analysisValue) return "";
        const coords = getCoordinates(
          point.angle,
          (point.analysisValue / 100) * radius
        );
        return `${coords.x},${coords.y}`;
      })
      .join(" ");
  };

  // Handler for node mousedown - identifies which node is being dragged
  const handleNodeMouseDown = (index: number) => {
    if (!isSelecting) return;
    setActiveNodeIndex(index);
  };

  // Calculate distance from center as a percentage (0-100)
  const calculateDistancePercent = (x: number, y: number) => {
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    return Math.min(
      100,
      Math.max(0, Math.round((distanceFromCenter / radius) * 100))
    );
  };

  // Handle click on a node
  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    if (!isSelecting || activeNodeIndex === null) return;

    // Get SVG element and its bounding box
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    // Calculate position in SVG coordinates
    const x = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const y = ((e.clientY - rect.top) / rect.height) * svgHeight;

    // Calculate distance from center as a percentage (0-100)
    const valuePercent = calculateDistancePercent(x, y);

    // Update the data
    const newData = [...data];
    newData[activeNodeIndex] = {
      ...newData[activeNodeIndex],
      userValue: valuePercent,
    };

    setData(newData);
    setActiveNodeIndex(null);
  };

  // Toggle selection mode on/off
  const handleSelect = () => {
    setIsSelecting(!isSelecting);
    setShowAnalysis(false);
  };

  // Show auto analysis results
  const handleAutoAnalyze = () => {
    setData(analysisData);
    setShowAnalysis(true);
    setIsSelecting(false);
  };

  return (
    <div className={cn("flex flex-row justify-between", className)}>
      <div className="flex flex-col justify-between">
        {/* Legend row - Positioned at top right per design */}
        <div className="flex  justify-end mb-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded bg-[#7b6cd9]"></div>
              <span className="text-xs text-gray-700">User Selected</span>
            </div>
            {showAnalysis && (
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded bg-[#e8a87c]"></div>
                <span className="text-xs text-gray-700">Auto Analyzed</span>
              </div>
            )}
          </div>
        </div>
        {/* Buttons - Per design positioned below the chart with specific spacing */}
        <div className="flex flex-col justify-center gap-3 mt-2">
          <Button
            variant="outline"
            className={cn(
              "rounded-full px-4 py-1 text-xs shadow-sm h-[28px] w-[70px]",
              isSelecting
                ? "bg-[#7067DC] text-white border-none"
                : "bg-white text-[#7067DC] border-none hover:bg-[#7067DC] hover:text-white"
            )}
            onClick={handleSelect}
          >
            Select
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC] border-none text-xs shadow-sm h-[28px] w-[105px]"
            onClick={handleAutoAnalyze}
          >
            Auto Analyze
          </Button>
        </div>
      </div>
      {/* Chart and buttons layout */}
      <div className="flex flex-col">
        {/* Radar chart - Center aligned */}
        <div className="relative w-full max-w-[220px] h-[220px] mx-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full"
            onClick={handleClick}
          >
            {/* Radar Grid - Concentric circles */}
            {generateCircles()}

            {/* Radar Grid - Axis lines */}
            {data.map((point, index) => {
              const coords = getCoordinates(point.angle, radius);
              return (
                <line
                  key={`axis-${index}`}
                  x1={centerX}
                  y1={centerY}
                  x2={coords.x}
                  y2={coords.y}
                  stroke="#d8d4f2"
                  strokeWidth={1}
                />
              );
            })}

            {/* Axis Labels */}
            {data.map((point, index) => {
              const coords = getCoordinates(point.angle, radius + 25);
              return (
                <text
                  key={`label-${index}`}
                  x={coords.x}
                  y={coords.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#666"
                >
                  {point.emotion}
                </text>
              );
            })}

            {/* User data (purple) polygon */}
            <polygon
              points={getUserPolygonPoints()}
              fill="rgba(123, 108, 217, 0.2)"
              stroke="#7b6cd9"
              strokeWidth={2}
            />

            {/* Analysis data (orange) polygon - only shown after auto analyze */}
            {showAnalysis && (
              <polygon
                points={getAnalysisPolygonPoints()}
                fill="none"
                stroke="#e8a87c"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            )}

            {/* User data (purple) nodes */}
            {data.map((point, index) => {
              const coords = getCoordinates(
                point.angle,
                (point.userValue / 100) * radius
              );
              return (
                <circle
                  key={`user-node-${index}`}
                  cx={coords.x}
                  cy={coords.y}
                  r={5}
                  fill="#7b6cd9"
                  stroke="#fff"
                  strokeWidth={2}
                  className={isSelecting ? "cursor-pointer" : ""}
                  onMouseDown={() => handleNodeMouseDown(index)}
                />
              );
            })}

            {/* Analysis data (orange) nodes - only shown after auto analyze */}
            {showAnalysis &&
              data.map((point, index) => {
                if (!point.analysisValue) return null;
                const coords = getCoordinates(
                  point.angle,
                  (point.analysisValue / 100) * radius
                );
                return (
                  <circle
                    key={`analysis-node-${index}`}
                    cx={coords.x}
                    cy={coords.y}
                    r={5}
                    fill="#e8a87c"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export { EmotionRadarChart };
