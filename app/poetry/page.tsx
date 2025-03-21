"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraphComponent } from "@/components/ui/graph";
import html2canvas from "html2canvas";

// Import components
import { Header } from "@/components/layout/Header";
import { VisualElementsSidebar } from "@/components/visualization/VisualElementsSidebar";
import { MobileVisualElements } from "@/components/visualization/MobileVisualElements";
import { PoetryCanvas } from "@/components/visualization/PoetryCanvas";
import { PoemTab } from "@/components/poetry/PoemTab";
import { ChatInterface } from "@/components/poetry/ChatInterface";
import { ColorAnalysisTab } from "@/components/poetry/ColorAnalysisTab";

// Import data and hooks
import { useCanvasElements } from "@/hooks/useCanvasElements";
import { quietNightPoem } from "@/lib/data/poems";
import { visualElements } from "@/lib/data/visualElements";
import {
  graphCanvasData,
  SceneNode,
  SceneEdge,
  uiConstants,
} from "@/lib/config/appConfig";

export default function PoetryPage() {
  const [activeTab, setActiveTab] = useState("poem");
  const [markedKeywords, setMarkedKeywords] = useState(false);
  const [canvasCount] = useState(4);
  const [graphCanvasNumber, setGraphCanvasNumber] = useState(1);
  const canvasRefs = useRef<(HTMLDivElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // Graph state management
  const [isMoving, setIsMoving] = useState(false);
  const [graphGenerated, setGraphGenerated] = useState(
    Array(canvasCount).fill(false)
  );
  const [symbolsGenerated, setSymbolsGenerated] = useState(
    Array(canvasCount).fill(false)
  );
  const [canvasStates, setCanvasStates] = useState<
    Array<{
      nodes: SceneNode[];
      edges: SceneEdge[];
    }>
  >(
    Array(canvasCount)
      .fill(null)
      .map(() => ({
        nodes: [],
        edges: [],
      }))
  );

  // Generate graph handler
  const handleGenerateGraph = () => {
    const updatedStates = [...canvasStates];
    // Type assertion to ensure the data matches SceneNode type
    const nodes = [
      ...graphCanvasData[graphCanvasNumber - 1].nodes,
    ] as SceneNode[];
    const edges = [
      ...graphCanvasData[graphCanvasNumber - 1].edges,
    ] as SceneEdge[];

    updatedStates[graphCanvasNumber - 1] = {
      nodes,
      edges,
    };

    setCanvasStates(updatedStates);

    // Mark current canvas as generated
    const updatedGenerated = [...graphGenerated];
    updatedGenerated[graphCanvasNumber - 1] = true;
    setGraphGenerated(updatedGenerated);
  };

  // Handle node movement updates
  const handleNodesMoved = (updatedNodes: SceneNode[]) => {
    const updatedStates = [...canvasStates];
    updatedStates[graphCanvasNumber - 1] = {
      ...updatedStates[graphCanvasNumber - 1],
      nodes: updatedNodes,
    };
    setCanvasStates(updatedStates);
  };

  // Toggle move mode
  const toggleMoveMode = () => {
    setIsMoving(!isMoving);
  };

  // Handle generate symbols
  const handleGenerateSymbols = () => {
    if (!graphGenerated[graphCanvasNumber - 1]) return;

    // 保存当前图表状态的备份
    const currentNodes = [
      ...(canvasStates[graphCanvasNumber - 1]?.nodes || []),
    ];
    const currentEdges = [
      ...(canvasStates[graphCanvasNumber - 1]?.edges || []),
    ];

    // Mark current canvas as symbols generated
    const updatedSymbolsGenerated = [...symbolsGenerated];
    updatedSymbolsGenerated[graphCanvasNumber - 1] = true;
    setSymbolsGenerated(updatedSymbolsGenerated);

    // 确保图表状态不受影响 - 在下一个渲染周期检查并恢复
    setTimeout(() => {
      // 检查图表状态是否改变
      const updatedStates = [...canvasStates];
      const currentState = updatedStates[graphCanvasNumber - 1];

      // 如果节点丢失，恢复它们
      if (currentState.nodes.length === 0 && currentNodes.length > 0) {
        console.log("Restoring graph nodes after symbols generation");
        updatedStates[graphCanvasNumber - 1] = {
          nodes: currentNodes,
          edges: currentEdges,
        };
        setCanvasStates(updatedStates);
      }
    }, 0);
  };

  const canvasElementsContext = useCanvasElements();
  const {
    activeCanvas,
    setActiveCanvas,
    canvasElements,
    setCanvasElements,
    usedElements,
    setUsedElements,
    draggedElement,
    setDraggedElement,
    selectedCanvasElement,
    setSelectedCanvasElement,
    markElementAsUsed,
    addElementToCanvas,
    handleDragStart,
    handleDragEnd,
    removeCanvasElement,
    hasActiveVisualElements,
  } = canvasElementsContext;

  // Handle left canvas navigation (poetry canvas)
  // 获取下一个有可用元素的画布索引
  const getNextAvailableCanvas = (current: number) => {
    // 如果只有1号画布有元素，直接返回1
    if (
      visualElements[1].length > 0 &&
      visualElements[2].length === 0 &&
      visualElements[3].length === 0 &&
      visualElements[4].length === 0
    ) {
      return 1;
    }

    let next = current;
    do {
      next = next < canvasCount ? next + 1 : 1;
      if (hasActiveVisualElements(next)) {
        return next;
      }
    } while (next !== current);
    return current;
  };

  // 获取前一个有可用元素的画布索引
  const getPrevAvailableCanvas = (current: number) => {
    // 如果只有1号画布有元素，直接返回1
    if (
      visualElements[1].length > 0 &&
      visualElements[2].length === 0 &&
      visualElements[3].length === 0 &&
      visualElements[4].length === 0
    ) {
      return 1;
    }

    let prev = current;
    do {
      prev = prev > 1 ? prev - 1 : canvasCount;
      if (hasActiveVisualElements(prev)) {
        return prev;
      }
    } while (prev !== current);
    return current;
  };

  const nextCanvas = () => {
    const newValue = getNextAvailableCanvas(activeCanvas);
    setActiveCanvas(newValue);
    if (activeTab === "graph") {
      setGraphCanvasNumber(newValue);
    }
  };

  const prevCanvas = () => {
    const newValue = getPrevAvailableCanvas(activeCanvas);
    setActiveCanvas(newValue);
    if (activeTab === "graph") {
      setGraphCanvasNumber(newValue);
    }
  };

  // Handle right canvas navigation (graph)
  const nextGraphCanvas = () => {
    const newValue = getNextAvailableCanvas(graphCanvasNumber);
    setGraphCanvasNumber(newValue);
    setActiveCanvas(newValue);
  };

  const prevGraphCanvas = () => {
    const newValue = getPrevAvailableCanvas(graphCanvasNumber);
    setGraphCanvasNumber(newValue);
    setActiveCanvas(newValue);
  };

  // Ensure proper rendering when switching canvases
  useEffect(() => {
    // Reset move mode when switching canvases
    setIsMoving(false);
  }, [graphCanvasNumber]);

  // Synchronize canvas numbers when tab changes to graph
  useEffect(() => {
    if (activeTab === "graph") {
      setGraphCanvasNumber(activeCanvas);
    }
  }, [activeTab, activeCanvas]);

  // 使用useRef避免循环更新
  const prevSymbolsRef = useRef(symbolsGenerated);

  // 更新ref值，避免闭包问题
  useEffect(() => {
    prevSymbolsRef.current = symbolsGenerated;
  }, [symbolsGenerated]);

  // 移除可能导致循环更新的useEffect
  // 我们将在canvas切换时手动同步symbolsGenerated状态

  // 下载当前画布为图片
  const downloadCanvasAsImage = async () => {
    const currentCanvasRef = canvasRefs.current[activeCanvas - 1];

    if (currentCanvasRef) {
      try {
        // 使用配置中定义的固定宽度和比例
        const targetWidth = uiConstants.canvasImage.downloadWidth;
        const originalRect = currentCanvasRef.getBoundingClientRect();
        const aspectRatio = originalRect.height / originalRect.width;
        const targetHeight = Math.round(targetWidth * aspectRatio); // 根据宽高比计算高度

        const canvas = await html2canvas(currentCanvasRef, {
          backgroundColor: "white",
          scale: uiConstants.canvasImage.downloadScale, // 使用配置的缩放因子
          logging: false,
          allowTaint: true,
          useCORS: true,
          width: originalRect.width, // 使用原始宽度
          height: originalRect.height, // 使用原始高度
        });

        // 创建新的画布来调整大小，保持比例
        const resizedCanvas = document.createElement("canvas");
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;
        const ctx = resizedCanvas.getContext("2d");

        if (ctx) {
          // 平滑绘制以保持质量
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.fillStyle = "white"; // 确保背景是白色
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
        }

        // 创建下载链接
        const image = resizedCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `poetry-canvas-${activeCanvas}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading canvas:", error);
      }
    }
  };

  // 下载所有画布为图片
  const downloadAllCanvases = async () => {
    // 保存当前活动的画布
    const currentActive = activeCanvas;

    // 依次遍历所有画布并下载
    for (let i = 1; i <= canvasCount; i++) {
      setActiveCanvas(i);
      // 添加延迟以确保画布已渲染
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvasRef = canvasRefs.current[i - 1];
      if (canvasRef) {
        try {
          // 使用配置中定义的固定宽度和比例
          const targetWidth = uiConstants.canvasImage.downloadWidth;
          const originalRect = canvasRef.getBoundingClientRect();
          const aspectRatio = originalRect.height / originalRect.width;
          const targetHeight = Math.round(targetWidth * aspectRatio); // 根据宽高比计算高度

          const canvas = await html2canvas(canvasRef, {
            backgroundColor: "white",
            scale: uiConstants.canvasImage.downloadScale, // 使用配置的缩放因子
            logging: false,
            allowTaint: true,
            useCORS: true,
            width: originalRect.width, // 使用原始宽度
            height: originalRect.height, // 使用原始高度
          });

          // 创建新的画布来调整大小，保持比例
          const resizedCanvas = document.createElement("canvas");
          resizedCanvas.width = targetWidth;
          resizedCanvas.height = targetHeight;
          const ctx = resizedCanvas.getContext("2d");

          if (ctx) {
            // 平滑绘制以保持质量
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.fillStyle = "white"; // 确保背景是白色
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
          }

          // 创建下载链接
          const image = resizedCanvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = `poetry-canvas-${i}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // 添加短暂延迟，防止浏览器下载行为冲突
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Error downloading canvas ${i}:`, error);
        }
      }
    }

    // 恢复原来的活动画布
    setActiveCanvas(currentActive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      <Header />

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_minmax(425px,1fr)] gap-4 sm:gap-7 items-stretch">
          {/* Left Sidebar - Visual Elements with Toggle */}
          <div className="md:block ">
            <VisualElementsSidebar
              usedElements={usedElements}
              draggedElement={draggedElement}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onElementClick={addElementToCanvas}
              allowExpand={symbolsGenerated[activeCanvas - 1]}
            />
          </div>

          {/* Mobile Visual Elements Horizontal Scroll */}
          <MobileVisualElements
            usedElements={usedElements}
            draggedElement={draggedElement}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onElementClick={addElementToCanvas}
            allowDisplay={symbolsGenerated[activeCanvas - 1]}
          />

          {/* Middle Panel - Canvas Area */}
          <div className="relative flex flex-col w-[680px] h-[680px] gap-4">
            <Card className="p-2 sm:p-2 rounded-3xl shadow-sm bg-white overflow-hidden flex-1 w-full h-full">
              <div className="relative flex flex-row justify-center items-center h-full">
                {/* Canvas Title - Only show in Graph tab - Commented out for now */}
                {/* {activeTab === "graph" && (
                  <div className="absolute top-3 left-5 text-sm font-medium text-gray-500 z-10">
                    Line {activeCanvas}
                  </div>
                )} */}

                {/* Left navigation arrow - Display regardless of tab */}
                <button
                  onClick={prevCanvas}
                  disabled={
                    // 如果只有1号画布有元素，或者当前已经是第1个画布，则禁用
                    (visualElements[1].length > 0 &&
                      visualElements[2].length === 0 &&
                      visualElements[3].length === 0 &&
                      visualElements[4].length === 0) ||
                    activeCanvas === 1
                  }
                  className={`relative left-2 z-10 h-24 flex items-center justify-center ${
                    (visualElements[1].length > 0 &&
                      visualElements[2].length === 0 &&
                      visualElements[3].length === 0 &&
                      visualElements[4].length === 0) ||
                    activeCanvas === 1
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <svg
                    width="20"
                    height="35"
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 1L1 9L4 17"
                      stroke={
                        (visualElements[1].length > 0 &&
                          visualElements[2].length === 0 &&
                          visualElements[3].length === 0 &&
                          visualElements[4].length === 0) ||
                        activeCanvas === 1
                          ? "#ccc"
                          : "#666"
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Always show the poetry canvas regardless of active tab */}
                <div
                  ref={(el) => {
                    canvasRefs.current[activeCanvas - 1] = el;
                  }}
                  className="w-full h-full"
                >
                  <PoetryCanvas
                    canvasElements={canvasElements}
                    setCanvasElements={setCanvasElements}
                    draggedElement={draggedElement}
                    selectedCanvasElement={selectedCanvasElement}
                    setSelectedCanvasElement={setSelectedCanvasElement}
                    addElementToCanvas={addElementToCanvas}
                    removeCanvasElement={removeCanvasElement}
                    visualElements={visualElements[activeCanvas] || []}
                    onDragEnd={handleDragEnd}
                  />
                </div>

                {/* Right navigation arrow - Display regardless of tab */}
                <button
                  onClick={nextCanvas}
                  disabled={
                    // 如果只有1号画布有元素，或者当前已经是最后一个画布，则禁用
                    (visualElements[1].length > 0 &&
                      visualElements[2].length === 0 &&
                      visualElements[3].length === 0 &&
                      visualElements[4].length === 0) ||
                    activeCanvas === canvasCount
                  }
                  className={`relative right-2 z-10 h-24 flex items-center justify-center ${
                    (visualElements[1].length > 0 &&
                      visualElements[2].length === 0 &&
                      visualElements[3].length === 0 &&
                      visualElements[4].length === 0) ||
                    activeCanvas === canvasCount
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <svg
                    width="20"
                    height="35"
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 1L9 9L6 17"
                      stroke={
                        (visualElements[1].length > 0 &&
                          visualElements[2].length === 0 &&
                          visualElements[3].length === 0 &&
                          visualElements[4].length === 0) ||
                        activeCanvas === canvasCount
                          ? "#ccc"
                          : "#666"
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </Card>

            <div className="flex justify-center">
              <Button
                className="bg-[#FFFFFF] h-[42px] w-full hover:bg-[#6058c8] hover:text-white text-black rounded-full px-6 text-base sm:text-lg font-medium shadow-sm"
                onClick={downloadAllCanvases}
              >
                Poetry Visualization
              </Button>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="relative flex flex-col w-full h-[680px]">
            <Card className="p-2 sm:p-2 rounded-3xl shadow-sm bg-white overflow-hidden mb-4 h-full">
              <div className="flex-1 h-full relative flex flex-col">
                {/* Poem Tab */}
                <div
                  className={`${
                    activeTab === "poem" ? "block" : "hidden"
                  } h-full`}
                >
                  <div className="h-full flex flex-col justify-center">
                    <PoemTab
                      poem={quietNightPoem}
                      markedKeywords={markedKeywords}
                      toggleKeywords={() => setMarkedKeywords(!markedKeywords)}
                    />
                  </div>
                </div>

                {/* Graph Tab */}
                <div
                  className={`${
                    activeTab === "graph" ? "block" : "hidden"
                  } h-full flex flex-col`}
                >
                  <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-center">
                    Scene Graph
                  </h2>

                  <div className="w-full flex items-center justify-center my-auto flex-1">
                    {/* Left navigation button - Fixed positioned outside of canvas */}
                    <button
                      onClick={prevGraphCanvas}
                      disabled={
                        // 如果只有1号画布有元素，或者当前已经是第1个画布，则禁用
                        (visualElements[1].length > 0 &&
                          visualElements[2].length === 0 &&
                          visualElements[3].length === 0 &&
                          visualElements[4].length === 0) ||
                        graphCanvasNumber === 1
                      }
                      className={`w-10 h-24 flex items-center justify-center relative top-5 ${
                        (visualElements[1].length > 0 &&
                          visualElements[2].length === 0 &&
                          visualElements[3].length === 0 &&
                          visualElements[4].length === 0) ||
                        graphCanvasNumber === 1
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <svg
                        width="25"
                        height="35"
                        viewBox="0 0 10 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 1L1 9L4 17"
                          stroke={
                            (visualElements[1].length > 0 &&
                              visualElements[2].length === 0 &&
                              visualElements[3].length === 0 &&
                              visualElements[4].length === 0) ||
                            graphCanvasNumber === 1
                              ? "#ccc"
                              : "#666"
                          }
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Graph container with line title - 增加高度 */}
                    <div className="relative w-full max-w-[calc(100%-80px)] sm:max-w-[calc(100%-100px)] h-[380px] sm:h-[380px] md:h-[380px]">
                      {/* Line title for the graph canvas */}
                      <div className="absolute top-3 left-5 text-sm font-medium text-gray-500 z-10">
                        Line {graphCanvasNumber}
                      </div>

                      {/* Graph content - 增加高度和减少内边距 */}
                      <div className="w-full h-[380px] relative bg-white rounded-2xl overflow-hidden">
                        {/* 增加渲染区域尺寸 */}
                        <div className="w-full h-full relative mx-auto my-auto">
                          {/* Use the same key to prevent component recreation when only props change */}
                          <GraphComponent
                            key={`graph-canvas-${graphCanvasNumber}`}
                            nodes={
                              canvasStates[graphCanvasNumber - 1]?.nodes || []
                            }
                            edges={
                              canvasStates[graphCanvasNumber - 1]?.edges || []
                            }
                            onNodeClick={() => {}}
                            onEdgeClick={() => {}}
                            isMovable={
                              isMoving && graphGenerated[graphCanvasNumber - 1]
                            }
                            onNodesMoved={handleNodesMoved}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right navigation button - Fixed positioned outside of canvas */}
                    <button
                      onClick={nextGraphCanvas}
                      disabled={
                        // 如果只有1号画布有元素，或者当前已经是最后一个画布，则禁用
                        (visualElements[1].length > 0 &&
                          visualElements[2].length === 0 &&
                          visualElements[3].length === 0 &&
                          visualElements[4].length === 0) ||
                        graphCanvasNumber === canvasCount
                      }
                      className={`w-10 h-24 flex items-center justify-center relative top-5 ${
                        (visualElements[1].length > 0 &&
                          visualElements[2].length === 0 &&
                          visualElements[3].length === 0 &&
                          visualElements[4].length === 0) ||
                        graphCanvasNumber === canvasCount
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <svg
                        width="25"
                        height="35"
                        viewBox="0 0 10 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 1L9 9L6 17"
                          stroke={
                            (visualElements[1].length > 0 &&
                              visualElements[2].length === 0 &&
                              visualElements[3].length === 0 &&
                              visualElements[4].length === 0) ||
                            graphCanvasNumber === canvasCount
                              ? "#ccc"
                              : "#666"
                          }
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col justify-center items-center gap-4 sm:gap-5 mb-4 mt-4">
                    <div className="flex flex-row gap-4">
                      <div className="relative inline-block ">
                        <Button
                          variant="outline"
                          className={`rounded-full px-4 sm:px-6 py-1 sm:py-1.5 
                            ${
                              graphGenerated[graphCanvasNumber - 1]
                                ? "bg-white text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC]"
                            } 
                            border-none text-xs shadow-md w-[100px] h-[20px]`}
                          onClick={handleGenerateGraph}
                          disabled={graphGenerated[graphCanvasNumber - 1]}
                        >
                          Generate Graph
                        </Button>
                      </div>
                      <div className="relative inline-block">
                        <Button
                          variant="outline"
                          className={`rounded-full px-4 sm:px-6 py-1 sm:py-1.5 
                            ${
                              !graphGenerated[graphCanvasNumber - 1]
                                ? "bg-white text-gray-400 cursor-not-allowed"
                                : isMoving
                                ? "bg-[#7067DC] text-white"
                                : "bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC]"
                            } 
                            border-none text-xs shadow-md w-[50px] h-[20px]`}
                          onClick={toggleMoveMode}
                          disabled={!graphGenerated[graphCanvasNumber - 1]}
                        >
                          Move
                        </Button>
                      </div>
                    </div>
                    <div className="relative inline-block">
                      <Button
                        variant="outline"
                        className={`rounded-full px-4 sm:px-6 py-1 sm:py-1.5 
                          ${
                            !graphGenerated[graphCanvasNumber - 1] ||
                            symbolsGenerated[graphCanvasNumber - 1]
                              ? "bg-white text-gray-400 cursor-not-allowed"
                              : "bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC]"
                          } 
                          border-none text-xs shadow-md w-[120px] h-[20px]`}
                        onClick={handleGenerateSymbols}
                        disabled={
                          !graphGenerated[graphCanvasNumber - 1] ||
                          symbolsGenerated[graphCanvasNumber - 1]
                        }
                      >
                        Generate Symbols
                      </Button>
                    </div>
                  </div>
                </div>

                {/* QA Tab Content */}
                <div
                  className={`${
                    activeTab === "qa" ? "block" : "hidden"
                  } h-full flex flex-col px-3 sm:px-5`}
                >
                  <h2 className="text-lg sm:text-xl font-medium mb-5 sm:mb-6 text-center">
                    Poetic Doubt-solving Station
                  </h2>

                  {/* Integrate the new ChatInterface component */}
                  <div className="flex-1 overflow-hidden">
                    <ChatInterface poem={quietNightPoem} />
                  </div>
                </div>

                {/* Color Analysis Tab */}
                <div
                  className={`${
                    activeTab === "color" ? "block" : "hidden"
                  } h-full flex flex-col`}
                >
                  <ColorAnalysisTab className="h-full" />
                </div>
              </div>
            </Card>

            <div className="h-[45px] flex items-center justify-between py-1 px-2 bg-gray-50 rounded-full overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 sm:gap-4 justify-between w-full text-sm sm:text-base">
                <div
                  onClick={() => setActiveTab("poem")}
                  className={`flex-1 text-center  cursor-pointer py-2 px-3 sm:px-4 text-gray-600 ${
                    activeTab === "poem" ? "font-bold" : ""
                  }`}
                >
                  Poem
                </div>
                <div
                  onClick={() => setActiveTab("graph")}
                  className={`flex-1 text-center cursor-pointer py-2 px-3 sm:px-4 text-gray-600 ${
                    activeTab === "graph" ? "font-bold" : ""
                  }`}
                >
                  Graph
                </div>
                <div
                  onClick={() => setActiveTab("qa")}
                  className={`flex-1 text-center cursor-pointer py-2 px-3 sm:px-4 text-gray-600 ${
                    activeTab === "qa" ? "font-bold" : ""
                  }`}
                >
                  Q&A
                </div>
                <div
                  onClick={() => setActiveTab("color")}
                  className={`flex-1 text-center cursor-pointer py-2 px-3 sm:px-4 text-gray-600 ${
                    activeTab === "color" ? "font-bold" : ""
                  }`}
                >
                  Color
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
