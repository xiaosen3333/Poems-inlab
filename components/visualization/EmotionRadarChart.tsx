"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getConfig } from "@/lib/services/configService";
import { 
  RadarDataPoint, 
  radarChartInitialData as defaultRadarChartInitialData, 
  radarChartAnalysisData as defaultRadarChartAnalysisData, 
  radarChartPurpleColors as defaultRadarChartPurpleColors, 
  uiConstants as defaultUiConstants 
} from "@/lib/config/appConfig";


interface EmotionRadarChartProps {
  className?: string;
}

const EmotionRadarChart = ({ className }: EmotionRadarChartProps) => {
  const [radarChartInitialData, setRadarChartInitialData] = useState(defaultRadarChartInitialData);
  const [radarChartAnalysisData, setRadarChartAnalysisData] = useState(defaultRadarChartAnalysisData);
  const [radarChartPurpleColors, setRadarChartPurpleColors] = useState(defaultRadarChartPurpleColors);
  const [uiConstants, setUiConstants] = useState(defaultUiConstants);
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const configParam = searchParams?.get('config');
    console.log("URL config param in EmotionRadarChart:", configParam);
    
    const configName = configParam && ['youcaihua', 'chunxiao', 'qingwa', 'niaomingjian'].includes(configParam)
      ? configParam
      : 'default';
    
    const loadedConfig = getConfig(configName);
    console.log("EmotionRadarChart - config loaded:", configName);
    
    setRadarChartInitialData(loadedConfig.radarChartInitialData);
    setRadarChartAnalysisData(loadedConfig.radarChartAnalysisData);
    setRadarChartPurpleColors(loadedConfig.radarChartPurpleColors);
    setUiConstants(loadedConfig.uiConstants);
  }, [searchParams]);

  // SVG viewbox dimensions from config
  const svgWidth = uiConstants.radarChart.svgWidth;
  const svgHeight = uiConstants.radarChart.svgHeight;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = uiConstants.radarChart.radius;

  // SVG element ref for click handling
  const svgRef = useRef<SVGSVGElement>(null);

  const [data, setData] = useState<RadarDataPoint[]>(radarChartInitialData);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);

  // Generate radar grid with concentric circles using different purple background colors
  const generateRadarGrid = () => {
    const elements = [];
    const circleCount = uiConstants.radarChart.circleCount;

    // Different purple colors from config
    const purpleColors = radarChartPurpleColors;

    // Create concentric circles with different purple background colors (from outermost to innermost)
    for (let i = circleCount; i >= 1; i--) {
      const circleRadius = (radius * i) / circleCount;

      // Add circle with purple background - drawing from innermost to outermost
      elements.push(
        <circle
          key={`circle-fill-${i}`}
          cx={centerX}
          cy={centerY}
          r={circleRadius}
          fill={purpleColors[circleCount - i]}
          stroke="none"
        />
      );
    }

    // Add grid circles (just the outlines)
    for (let i = 1; i <= circleCount; i++) {
      const circleRadius = (radius * i) / circleCount;
      elements.push(
        <circle
          key={`circle-grid-${i}`}
          cx={centerX}
          cy={centerY}
          r={circleRadius}
          fill="none"
          stroke="#b6b0e4"
          strokeDasharray={i < circleCount ? "4 4" : "none"}
          strokeWidth={1}
        />
      );
    }

    // Add axis lines from center to each emotion point
    data.forEach((point, index) => {
      const coords = getCoordinates(point.angle, radius);
      elements.push(
        <line
          key={`axis-${index}`}
          x1={centerX}
          y1={centerY}
          x2={coords.x}
          y2={coords.y}
          stroke="#b6b0e4"
          strokeWidth={1}
        />
      );
    });

    return elements;
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

  // Handle mouse events for dragging nodes
  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
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
  };

  const handleMouseUp = () => {
    setActiveNodeIndex(null);
  };

  // Handle click on the chart (we're not using this anymore as we're using mouse events for dragging)
  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    // This is kept for compatibility but functionality moved to mouse events
  };

  // Toggle selection mode on/off
  const handleSelect = () => {
    setIsSelecting(!isSelecting);
    setShowAnalysis(false);
  };

  // Show auto analysis results
  const handleAutoAnalyze = () => {
    // Create a merged data object that preserves user modifications
    const newData = data.map((point, index) => ({
      ...point,
      analysisValue: radarChartAnalysisData[index].analysisValue
    }));
    setData(newData);
    setShowAnalysis(true);
    setIsSelecting(false);
  };

  return (
    <div className={cn("flex flex-row justify-between", className)}>
      <div className="flex flex-col justify-between">
        {/* Legend row - Positioned at top right per design */}
        <div className="flex justify-end mb-4">
          <div className="flex flex-col  gap-3">
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
              "rounded-full px-4 py-1 text-xs shadow-md h-[20px] w-[50px]",
              isSelecting
                ? "bg-[#7067DC] text-white border-none"
                : "bg-white text-[#7067DC] border-none hover:bg-[#7067DC] hover:text-white"
            )}
            onClick={handleSelect}
            disabled={showAnalysis}
          >
            Select
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC] border-none text-xs shadow-md h-[20px] w-[95px]"
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
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Radar Grid with different colored layers and axis lines */}
            {generateRadarGrid()}

            {/* Axis Labels */}
            {data.map((point, index) => {
              const coords = getCoordinates(point.angle, radius + 30);
              return (
                <text
                  key={`label-${index}`}
                  x={coords.x}
                  y={coords.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="25"
                  fontWeight="500"
                  fill="#444"
                >
                  {point.emotion}
                </text>
              );
            })}

            {/* User data (purple) polygon */}
            <polygon
              points={getUserPolygonPoints()}
              fill="none"
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
                <React.Fragment key={`user-node-container-${index}`}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={12}
                    fill="transparent"
                    stroke="transparent"
                    className={isSelecting ? "cursor-pointer" : ""}
                    onMouseDown={() => handleNodeMouseDown(index)}
                  />
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={8}
                    fill="white"
                    stroke="#7b6cd9"
                    strokeWidth={2}
                    pointerEvents="none"
                  />
                </React.Fragment>
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
                    r={8}
                    fill="#e8a87c"
                    stroke="#fff"
                    strokeWidth={2}
                    pointerEvents="none"
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
