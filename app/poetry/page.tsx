"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraphComponent,
  defaultSceneNodes,
  defaultSceneEdges,
} from "@/components/ui/graph";

// Import components
import { Header } from "@/components/layout/Header";
import { VisualElementsSidebar } from "@/components/visualization/VisualElementsSidebar";
import { MobileVisualElements } from "@/components/visualization/MobileVisualElements";
import { PoetryCanvas } from "@/components/visualization/PoetryCanvas";
import { PoemTab } from "@/components/poetry/PoemTab";
import { ChatInterface } from "@/components/poetry/ChatInterface";
import { ColorAnalysisTab } from "@/components/poetry/ColorAnalysisTab";

// Import data and hooks
import { useCanvasElements, CanvasElement } from "@/hooks/useCanvasElements";
import { quietNightPoem } from "@/lib/data/poems";
import { visualElements } from "@/lib/data/visualElements";

export default function PoetryPage() {
  const [activeTab, setActiveTab] = useState("poem");
  const [nodes, setNodes] = useState(defaultSceneNodes);
  const [edges, setEdges] = useState(defaultSceneEdges);
  const [isMoving, setIsMoving] = useState(false);
  const [markedKeywords, setMarkedKeywords] = useState(false);
  const [canvasCount] = useState(4);
  const [graphCanvasNumber, setGraphCanvasNumber] = useState(1);

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

                  <div className="flex items-center justify-center my-auto flex-1">
                    {/* Left navigation button - Fixed positioned outside of canvas */}
                    <button
                      onClick={prevGraphCanvas}
                      className="w-14 h-24 flex items-center justify-center"
                    >
                      <svg
                        width="35"
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

                    {/* Graph container with line title */}
                    <div className="relative w-full max-w-[calc(100%-80px)] sm:max-w-[calc(100%-100px)] h-[280px] sm:h-[320px] md:h-[380px]">
                      {/* Line title for the graph canvas */}
                      <div className="absolute top-3 left-5 text-sm font-medium text-gray-500 z-10">
                        Line {graphCanvasNumber}
                      </div>

                      {/* Graph content */}
                      <div className="w-full h-full relative bg-white rounded-2xl p-4">
                        {graphCanvasNumber === 1 && (
                          <GraphComponent
                            nodes={[
                              {
                                id: "moon",
                                x: 200,
                                y: 100,
                                label: "Moon",
                                color: "#86e1fc",
                              },
                              {
                                id: "moonlight",
                                x: 300,
                                y: 150,
                                label: "Moonlight",
                                color: "#86e1fc",
                              },
                              {
                                id: "bed",
                                x: 400,
                                y: 150,
                                label: "Bed",
                                color: "#86e1fc",
                              },
                              {
                                id: "inside1",
                                x: 350,
                                y: 200,
                                label: "Inside",
                                color: "#7b6cd9",
                              },
                              {
                                id: "room",
                                x: 400,
                                y: 250,
                                label: "Room",
                                color: "#86e1fc",
                              },
                              {
                                id: "inside2",
                                x: 300,
                                y: 200,
                                label: "Inside",
                                color: "#7b6cd9",
                              },
                              {
                                id: "near",
                                x: 250,
                                y: 250,
                                label: "Near",
                                color: "#7b6cd9",
                              },
                            ]}
                            edges={[
                              { id: "e1", source: "moon", target: "moonlight" },
                              { id: "e2", source: "moonlight", target: "bed" },
                              {
                                id: "e3",
                                source: "moonlight",
                                target: "inside1",
                              },
                              { id: "e4", source: "inside1", target: "room" },
                              {
                                id: "e5",
                                source: "moonlight",
                                target: "inside2",
                              },
                              { id: "e6", source: "inside2", target: "near" },
                            ]}
                            onNodeClick={() => {}}
                            onEdgeClick={() => {}}
                          />
                        )}

                        {graphCanvasNumber === 2 && (
                          <GraphComponent
                            nodes={[
                              {
                                id: "person",
                                x: 200,
                                y: 200,
                                label: "Person",
                                color: "#86e1fc",
                              },
                              {
                                id: "standing",
                                x: 250,
                                y: 250,
                                label: "Standing on",
                                color: "#7b6cd9",
                              },
                              {
                                id: "ground",
                                x: 300,
                                y: 300,
                                label: "Ground",
                                color: "#86e1fc",
                              },
                            ]}
                            edges={[
                              {
                                id: "e1",
                                source: "person",
                                target: "standing",
                              },
                              {
                                id: "e2",
                                source: "standing",
                                target: "ground",
                              },
                            ]}
                            onNodeClick={() => {}}
                            onEdgeClick={() => {}}
                          />
                        )}

                        {graphCanvasNumber === 3 && (
                          <GraphComponent
                            nodes={[
                              {
                                id: "frost",
                                x: 250,
                                y: 150,
                                label: "Frost",
                                color: "#86e1fc",
                              },
                              {
                                id: "wonder",
                                x: 200,
                                y: 250,
                                label: "Wonder",
                                color: "#7b6cd9",
                              },
                              {
                                id: "looking",
                                x: 300,
                                y: 250,
                                label: "Looking",
                                color: "#7b6cd9",
                              },
                            ]}
                            edges={[
                              { id: "e1", source: "wonder", target: "frost" },
                              { id: "e2", source: "looking", target: "frost" },
                            ]}
                            onNodeClick={() => {}}
                            onEdgeClick={() => {}}
                          />
                        )}

                        {graphCanvasNumber === 4 && (
                          <GraphComponent
                            nodes={[
                              {
                                id: "night",
                                x: 200,
                                y: 150,
                                label: "Night",
                                color: "#86e1fc",
                              },
                              {
                                id: "homesick",
                                x: 300,
                                y: 250,
                                label: "Homesick",
                                color: "#7b6cd9",
                              },
                              {
                                id: "bowing",
                                x: 200,
                                y: 300,
                                label: "Bowing",
                                color: "#7b6cd9",
                              },
                              {
                                id: "missing",
                                x: 350,
                                y: 350,
                                label: "Missing",
                                color: "#7b6cd9",
                              },
                              {
                                id: "hometown",
                                x: 450,
                                y: 350,
                                label: "Hometown",
                                color: "#86e1fc",
                              },
                            ]}
                            edges={[
                              { id: "e1", source: "homesick", target: "night" },
                              {
                                id: "e2",
                                source: "homesick",
                                target: "bowing",
                              },
                              {
                                id: "e3",
                                source: "homesick",
                                target: "missing",
                              },
                              {
                                id: "e4",
                                source: "missing",
                                target: "hometown",
                              },
                            ]}
                            onNodeClick={() => {}}
                            onEdgeClick={() => {}}
                          />
                        )}
                      </div>
                    </div>

                    {/* Right navigation button - Fixed positioned outside of canvas */}
                    <button
                      onClick={nextGraphCanvas}
                      className="w-14 h-24 flex items-center justify-center"
                    >
                      <svg
                        width="35"
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
                          className="rounded-full px-4 sm:px-6 py-1 sm:py-1.5 bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC] border-none text-xs shadow-md w-[100px] h-[20px]"
                          onClick={() => {
                            // Reset to default positions
                            setNodes(defaultSceneNodes);
                            setEdges(defaultSceneEdges);
                          }}
                        >
                          Generate Graph
                        </Button>
                      </div>
                      <div className="relative inline-block">
                        <Button
                          variant="outline"
                          className="rounded-full px-4 sm:px-6 py-1 sm:py-1.5 bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC] border-none text-xs shadow-md w-[50px] h-[20px]"
                        >
                          Move
                        </Button>
                      </div>
                    </div>
                    <div className="relative inline-block">
                      <Button
                        variant="outline"
                        className="rounded-full px-4 sm:px-6 py-1 sm:py-1.5 bg-white hover:bg-[#7067DC] hover:text-white text-[#7067DC] border-none text-xs shadow-md w-[120px] h-[20px]"
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
