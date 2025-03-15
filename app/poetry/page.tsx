"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraphComponent } from "@/components/ui/graph";

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
import { graphCanvasData, SceneNode, SceneEdge } from "@/lib/config/appConfig";

export default function PoetryPage() {
  const [activeTab, setActiveTab] = useState("poem");
  const [markedKeywords, setMarkedKeywords] = useState(false);
  const [canvasCount] = useState(4);
  const [graphCanvasNumber, setGraphCanvasNumber] = useState(1);

  // Graph state management
  const [isMoving, setIsMoving] = useState(false);
  const [graphGenerated, setGraphGenerated] = useState(
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
  } = canvasElementsContext;

  // Handle left canvas navigation (poetry canvas)
  const nextCanvas = () => {
    setActiveCanvas((prev) => (prev < canvasCount ? prev + 1 : 1));
  };

  const prevCanvas = () => {
    setActiveCanvas((prev) => (prev > 1 ? prev - 1 : canvasCount));
  };

  // Handle right canvas navigation (graph)
  const nextGraphCanvas = () => {
    setGraphCanvasNumber((prev) => (prev < canvasCount ? prev + 1 : 1));
  };

  const prevGraphCanvas = () => {
    setGraphCanvasNumber((prev) => (prev > 1 ? prev - 1 : canvasCount));
  };

  // Ensure proper rendering when switching canvases
  useEffect(() => {
    // Reset move mode when switching canvases
    setIsMoving(false);
  }, [graphCanvasNumber]);

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
            />
          </div>

          {/* Mobile Visual Elements Horizontal Scroll */}
          <MobileVisualElements
            usedElements={usedElements}
            draggedElement={draggedElement}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onElementClick={addElementToCanvas}
          />

          {/* Middle Panel - Canvas Area */}
          <div className="relative flex flex-col w-[700px] h-[620px] gap-4 -left-10">
            <Card className="p-3 sm:p-4 rounded-3xl shadow-sm bg-white overflow-hidden flex-1 w-full h-full">
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
                  className="left-7 top-1/2  z-10  h-24 flex items-center justify-center"
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
                      stroke="#666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Always show the poetry canvas regardless of active tab */}
                <PoetryCanvas
                  canvasElements={canvasElements}
                  setCanvasElements={setCanvasElements}
                  draggedElement={draggedElement}
                  selectedCanvasElement={selectedCanvasElement}
                  setSelectedCanvasElement={setSelectedCanvasElement}
                  addElementToCanvas={addElementToCanvas}
                  removeCanvasElement={removeCanvasElement}
                  visualElements={visualElements}
                  onDragEnd={handleDragEnd}
                />

                {/* Right navigation arrow - Display regardless of tab */}
                <button
                  onClick={nextCanvas}
                  className=" -right-7 top-1/2 z-10 h-24 flex items-center justify-center"
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
                      stroke="#666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </Card>

            <div className="flex justify-center">
              <Button className="bg-[#FFFFFF] h-[42px] w-full hover:bg-[#6058c8] hover:text-white text-black rounded-full px-6 text-base sm:text-lg font-medium shadow-sm">
                Poetry Visualization
              </Button>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="relative flex flex-col w-[560px] h-[620px] -left-10">
            <Card className="p-3 sm:p-4 rounded-3xl shadow-sm bg-white overflow-hidden mb-4 h-full">
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
                      className="w-10 h-24 flex items-center justify-center relative top-5"
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
                          stroke="#666"
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
                      className="w-10 h-24 flex items-center justify-center relative top-5"
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
                          stroke="#666"
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
                            !graphGenerated[graphCanvasNumber - 1]
                              ? "bg-white text-gray-400 cursor-not-allowed"
                              : "bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC]"
                          } 
                          border-none text-xs shadow-md w-[120px] h-[20px]`}
                        disabled={!graphGenerated[graphCanvasNumber - 1]}
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

            <div className="h-[42px] flex items-center justify-between py-1 px-2 bg-gray-50 rounded-full overflow-hidden shadow-sm">
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
