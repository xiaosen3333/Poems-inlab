"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraphComponent, defaultSceneNodes, defaultSceneEdges } from "@/components/ui/graph"

// Import components
import { Header } from "@/components/layout/Header"
import { VisualElementsSidebar } from "@/components/visualization/VisualElementsSidebar"
import { MobileVisualElements } from "@/components/visualization/MobileVisualElements"
import { PoetryCanvas } from "@/components/visualization/PoetryCanvas"
import { PoemTab } from "@/components/poetry/PoemTab"

// Import data and hooks
import { useCanvasElements, CanvasElement } from "@/hooks/useCanvasElements"
import { quietNightPoem } from "@/lib/data/poems"
import { visualElements } from "@/lib/data/visualElements"

export default function PoetryPage() {
  const [activeTab, setActiveTab] = useState("poem")
  const [nodes, setNodes] = useState(defaultSceneNodes)
  const [edges, setEdges] = useState(defaultSceneEdges)
  const [isMoving, setIsMoving] = useState(false)
  const [markedKeywords, setMarkedKeywords] = useState(false)
  const [canvasCount] = useState(4)
  const [graphCanvasNumber, setGraphCanvasNumber] = useState(1)
  
  const canvasElementsContext = useCanvasElements()
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
    removeCanvasElement
  } = canvasElementsContext
  
  // Handle left canvas navigation (poetry canvas)
  const nextCanvas = () => {
    setActiveCanvas(prev => prev < canvasCount ? prev + 1 : 1)
  }
  
  const prevCanvas = () => {
    setActiveCanvas(prev => prev > 1 ? prev - 1 : canvasCount)
  }
  
  // Handle right canvas navigation (graph)
  const nextGraphCanvas = () => {
    setGraphCanvasNumber(prev => prev < canvasCount ? prev + 1 : 1)
  }
  
  const prevGraphCanvas = () => {
    setGraphCanvasNumber(prev => prev > 1 ? prev - 1 : canvasCount)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      <Header />

      <main className="container mx-auto px-3 sm:px-5 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_minmax(425px,1fr)] gap-4 sm:gap-7">
          {/* Left Sidebar - Visual Elements with Toggle */}
          <div className="md:block relative">
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
          <div className="relative flex flex-col">
            <Card className="p-5 sm:p-7 rounded-3xl shadow-sm bg-white overflow-hidden flex-1 w-full">
              <div className="relative h-full">
                {/* Canvas Title - Only show in Graph tab - Commented out for now */}
                {/* {activeTab === "graph" && (
                  <div className="absolute top-3 left-5 text-sm font-medium text-gray-500 z-10">
                    Line {activeCanvas}
                  </div>
                )} */}
                
                {/* Left navigation arrow - Display regardless of tab */}
                <button 
                  onClick={prevCanvas}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white w-10 h-16 sm:w-12 sm:h-20 rounded-full shadow-md flex items-center justify-center z-10 hover:bg-gray-50 transition-colors"
                >
                  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 1L1 9L9 17" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                />
                
                {/* Right navigation arrow - Display regardless of tab */}
                <button 
                  onClick={nextCanvas}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white w-10 h-16 sm:w-12 sm:h-20 rounded-full shadow-md flex items-center justify-center z-10 hover:bg-gray-50 transition-colors"
                >
                  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L9 9L1 17" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </Card>
            
            <div className="mt-4 mx-auto w-full bg-[#7067DC] text-white rounded-full py-2 px-4 text-center shadow-sm">
              <h2 className="text-base sm:text-lg font-medium">Poetry Visualization</h2>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="flex flex-col w-full">
            <Card className="p-5 sm:p-7 rounded-3xl shadow-sm bg-white overflow-hidden mb-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-medium text-purple-600">Poetry Showcase</h2>
              </div>
              
              <div className="flex-1 h-[500px] sm:h-[550px] md:h-[600px] relative">
                {/* Poem Tab */}
                <div className={`${activeTab === "poem" ? "block" : "hidden"} h-full`}>
                  <div className="h-full flex flex-col justify-center">
                    <PoemTab 
                      poem={quietNightPoem} 
                      markedKeywords={markedKeywords}
                      toggleKeywords={() => setMarkedKeywords(!markedKeywords)}
                    />
                  </div>
                </div>

                {/* Graph Tab */}
                <div className={`${activeTab === "graph" ? "block" : "hidden"} h-full flex flex-col`}>
                    <h2 className="text-lg sm:text-xl font-medium mb-5 sm:mb-6 text-center">Scene Graph</h2>
                    
                    <div className="flex items-center justify-center mb-6 sm:mb-8 flex-1">
                      {/* Left navigation button - Fixed positioned outside of canvas */}
                      <button 
                        onClick={prevGraphCanvas}
                        className="bg-white w-10 h-16 sm:w-12 sm:h-20 rounded-full shadow-md flex items-center justify-center z-10 hover:bg-gray-50 transition-colors mr-3 sm:mr-4"
                      >
                        <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 1L1 9L9 17" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                                { id: 'moon', x: 200, y: 100, label: 'Moon', color: '#86e1fc' },
                                { id: 'moonlight', x: 300, y: 150, label: 'Moonlight', color: '#86e1fc' },
                                { id: 'bed', x: 400, y: 150, label: 'Bed', color: '#86e1fc' },
                                { id: 'inside1', x: 350, y: 200, label: 'Inside', color: '#7b6cd9' },
                                { id: 'room', x: 400, y: 250, label: 'Room', color: '#86e1fc' },
                                { id: 'inside2', x: 300, y: 200, label: 'Inside', color: '#7b6cd9' },
                                { id: 'near', x: 250, y: 250, label: 'Near', color: '#7b6cd9' },
                              ]} 
                              edges={[
                                { id: 'e1', source: 'moon', target: 'moonlight' },
                                { id: 'e2', source: 'moonlight', target: 'bed' },
                                { id: 'e3', source: 'moonlight', target: 'inside1' },
                                { id: 'e4', source: 'inside1', target: 'room' },
                                { id: 'e5', source: 'moonlight', target: 'inside2' },
                                { id: 'e6', source: 'inside2', target: 'near' },
                              ]}
                              onNodeClick={() => {}}
                              onEdgeClick={() => {}}
                            />
                          )}
                          
                          {graphCanvasNumber === 2 && (
                            <GraphComponent 
                              nodes={[
                                { id: 'person', x: 200, y: 200, label: 'Person', color: '#86e1fc' },
                                { id: 'standing', x: 250, y: 250, label: 'Standing on', color: '#7b6cd9' },
                                { id: 'ground', x: 300, y: 300, label: 'Ground', color: '#86e1fc' },
                              ]} 
                              edges={[
                                { id: 'e1', source: 'person', target: 'standing' },
                                { id: 'e2', source: 'standing', target: 'ground' },
                              ]}
                              onNodeClick={() => {}}
                              onEdgeClick={() => {}}
                            />
                          )}
                          
                          {graphCanvasNumber === 3 && (
                            <GraphComponent 
                              nodes={[
                                { id: 'frost', x: 250, y: 150, label: 'Frost', color: '#86e1fc' },
                                { id: 'wonder', x: 200, y: 250, label: 'Wonder', color: '#7b6cd9' },
                                { id: 'looking', x: 300, y: 250, label: 'Looking', color: '#7b6cd9' },
                              ]} 
                              edges={[
                                { id: 'e1', source: 'wonder', target: 'frost' },
                                { id: 'e2', source: 'looking', target: 'frost' },
                              ]}
                              onNodeClick={() => {}}
                              onEdgeClick={() => {}}
                            />
                          )}
                          
                          {graphCanvasNumber === 4 && (
                            <GraphComponent 
                              nodes={[
                                { id: 'night', x: 200, y: 150, label: 'Night', color: '#86e1fc' },
                                { id: 'homesick', x: 300, y: 250, label: 'Homesick', color: '#7b6cd9' },
                                { id: 'bowing', x: 200, y: 300, label: 'Bowing', color: '#7b6cd9' },
                                { id: 'missing', x: 350, y: 350, label: 'Missing', color: '#7b6cd9' },
                                { id: 'hometown', x: 450, y: 350, label: 'Hometown', color: '#86e1fc' },
                              ]} 
                              edges={[
                                { id: 'e1', source: 'homesick', target: 'night' },
                                { id: 'e2', source: 'homesick', target: 'bowing' },
                                { id: 'e3', source: 'homesick', target: 'missing' },
                                { id: 'e4', source: 'missing', target: 'hometown' },
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
                        className="bg-white w-10 h-16 sm:w-12 sm:h-20 rounded-full shadow-md flex items-center justify-center z-10 hover:bg-gray-50 transition-colors ml-3 sm:ml-4"
                      >
                        <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L9 9L1 17" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex justify-center items-center gap-2 sm:gap-3 mt-auto">
                      <Button 
                        className="rounded-full bg-[#7067DC] hover:bg-[#5b54c0] text-white text-xs px-4 py-1 w-auto shadow-sm"
                        onClick={() => {
                          // Reset to default positions
                          setNodes(defaultSceneNodes);
                          setEdges(defaultSceneEdges);
                        }}
                      >
                        Generate Graph
                      </Button>
                      <Button 
                        className="rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs px-4 py-1 w-auto shadow-sm"
                      >
                        Move
                      </Button>
                    </div>
                    
                    <div className="text-xs sm:text-sm text-gray-500 italic mt-3 mb-2">
                      Click on nodes to move them
                    </div>
                </div>

                {/* QA Tab Content */}
                <div className={`${activeTab === "qa" ? "block" : "hidden"} h-full flex flex-col`}>
                    <h2 className="text-lg sm:text-xl font-medium mb-5 sm:mb-6 text-center">Poetic Doubt-solving Station</h2>
                    <div className="mb-6 sm:mb-8 w-full flex-1">
                      <div className="text-sm sm:text-base mb-3 sm:mb-4">What can I help you with?</div>

                      <div className="bg-purple-100 p-3 sm:p-4 rounded-xl mb-4 sm:mb-5 text-xs sm:text-sm max-w-[90%] sm:max-w-[80%] ml-auto">
                        Who is the author of this poem, and what is its historical background of the era?
                      </div>

                      <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                        <p>
                          The <strong>author</strong> of <em>In The Quiet Night</em> is Li Bai, who lived in the Tang
                          Dynasty.
                        </p>
                        <p>
                          {quietNightPoem.background}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3 mb-6 sm:mb-8 w-full">
                      <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full px-3 sm:px-4 text-xs shadow-sm">
                        <span className="flex items-center gap-1">
                          <span className="bg-gray-100 w-4 h-4 rounded-full flex items-center justify-center mr-1">ⓘ</span>
                          Background
                        </span>
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full px-3 sm:px-4 text-xs shadow-sm">
                        <span className="flex items-center gap-1">
                          <span className="bg-gray-100 w-4 h-4 rounded-full flex items-center justify-center mr-1">T</span>
                          Techniques
                        </span>
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full px-3 sm:px-4 text-xs shadow-sm">
                        <span className="flex items-center gap-1">
                          <span className="bg-gray-100 w-4 h-4 rounded-full flex items-center justify-center mr-1">-</span>
                          Theme
                        </span>
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full px-3 sm:px-4 text-xs shadow-sm">
                        <span className="flex items-center gap-1">
                          <span className="bg-gray-100 w-4 h-4 rounded-full flex items-center justify-center mr-1">+</span>
                          More
                        </span>
                      </Button>
                    </div>
                    
                    <div className="w-full max-w-md mx-auto mt-auto mb-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Type Your Query Here"
                          className="w-full p-2 sm:p-3 pr-10 sm:pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#7067DC] focus:border-transparent text-xs sm:text-sm shadow-sm"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-50 rounded-full p-1.5 hover:bg-gray-100">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 20L20 12L12 4"
                              stroke="#9CA3AF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                </div>

                {/* Color Analysis Tab */}
                <div className={`${activeTab === "color" ? "block" : "hidden"} h-full flex flex-col`}>
                    <h2 className="text-lg sm:text-xl font-medium mb-5 sm:mb-6 text-center">Analysis of Color and Emotion</h2>

                    {/* Emotion Radar Chart Section */}
                    <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4 flex-1">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start">
                        <div className="mb-3 sm:mb-0 sm:mr-6 mt-0 sm:mt-3 space-y-2 sm:space-y-3 flex sm:block gap-5 sm:gap-0">
                          <div className="flex items-center">
                            <div className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 rounded bg-[#7b6cd9]"></div>
                            <span className="text-xs sm:text-sm text-gray-700">User Selected</span>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 rounded bg-[#e8a87c]"></div>
                            <span className="text-xs sm:text-sm text-gray-700">Auto Analyzed</span>
                          </div>
                        </div>

                        <div className="flex-1 relative">
                          {/* Create a static version of the radar chart */}
                          <div className="relative h-[150px] w-[150px] sm:h-[180px] sm:w-[180px] md:h-[200px] md:w-[200px] mx-auto">
                            {/* Radar grid */}
                            <div className="absolute inset-0 rounded-full border border-[#d8d4f2]"></div>
                            <div className="absolute inset-[20%] rounded-full border border-[#d8d4f2] border-dashed"></div>
                            <div className="absolute inset-[40%] rounded-full border border-[#d8d4f2] border-dashed"></div>
                            <div className="absolute inset-[60%] rounded-full border border-[#d8d4f2] border-dashed"></div>
                            <div className="absolute inset-[80%] rounded-full border border-[#d8d4f2] border-dashed"></div>

                            {/* Radar axis lines */}
                            <div className="absolute inset-0">
                              <div className="absolute top-1/2 left-1/2 h-full w-[1px] -translate-x-1/2 -translate-y-1/2 bg-[#d8d4f2]"></div>
                              <div className="absolute top-1/2 left-1/2 h-[1px] w-full -translate-x-1/2 -translate-y-1/2 bg-[#d8d4f2]"></div>
                              <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rotate-45">
                                <div className="absolute top-1/2 left-1/2 h-full w-[1px] -translate-x-1/2 -translate-y-1/2 bg-[#d8d4f2]"></div>
                              </div>
                              <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 -rotate-45">
                                <div className="absolute top-1/2 left-1/2 h-full w-[1px] -translate-x-1/2 -translate-y-1/2 bg-[#d8d4f2]"></div>
                              </div>
                            </div>

                            {/* Emotion Labels */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium">
                              Surprise
                            </div>
                            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium">Joy</div>
                            <div className="absolute bottom-0 right-1/4 text-xs sm:text-sm font-medium">
                              Anger
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs sm:text-sm font-medium">
                              Sadness
                            </div>
                            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium">Fear</div>

                            {/* User data (blue) */}
                            <svg className="absolute inset-0" viewBox="0 0 250 250">
                              <polygon 
                                points="125,30 175,125 150,200 100,200 75,125" 
                                fill="rgba(123, 108, 217, 0.2)" 
                                stroke="#7b6cd9" 
                                strokeWidth="2" 
                              />
                              <circle cx="125" cy="30" r="5" fill="#7b6cd9" />
                              <circle cx="175" cy="125" r="5" fill="#7b6cd9" />
                              <circle cx="150" cy="200" r="5" fill="#7b6cd9" />
                              <circle cx="100" cy="200" r="5" fill="#7b6cd9" />
                              <circle cx="75" cy="125" r="5" fill="#7b6cd9" />
                            </svg>

                            {/* Auto analyzed data (orange) */}
                            <svg className="absolute inset-0" viewBox="0 0 250 250">
                              <polygon 
                                points="125,50 190,125 160,190 90,190 60,125" 
                                fill="none" 
                                stroke="#e8a87c" 
                                strokeWidth="2" 
                                strokeDasharray="5,5" 
                              />
                              <circle cx="125" cy="50" r="5" fill="#e8a87c" />
                              <circle cx="190" cy="125" r="5" fill="#e8a87c" />
                              <circle cx="160" cy="190" r="5" fill="#e8a87c" />
                              <circle cx="90" cy="190" r="5" fill="#e8a87c" />
                              <circle cx="60" cy="125" r="5" fill="#e8a87c" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4 justify-center mt-5">
                        <Button className="rounded-full bg-[#7067DC] hover:bg-[#5b54c0] text-white px-4 py-1 text-xs sm:text-sm shadow-sm">
                          Select
                        </Button>
                        <Button className="rounded-full bg-[#7067DC] hover:bg-[#5b54c0] text-white px-4 py-1 text-xs sm:text-sm shadow-sm">
                          Auto Analyze
                        </Button>
                      </div>
                    </div>

                    <div className="my-4 sm:my-5 border-t border-dashed border-[#7067DC]"></div>

                    {/* Color wheel section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start mt-4 sm:mt-5 mb-4">
                      <div className="mb-4 sm:mb-0 sm:mr-6 space-y-2 sm:space-y-3 grid grid-cols-3 sm:block gap-2 sm:gap-0">
                        <div className="flex items-center">
                          <div className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 rounded bg-[#e8a87c]"></div>
                          <span className="text-xs sm:text-sm text-gray-700">Joy</span>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 rounded bg-[#f8ef86]"></div>
                          <span className="text-xs sm:text-sm text-gray-700">Surprise</span>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 rounded bg-[#c1f486]"></div>
                          <span className="text-xs sm:text-sm text-gray-700">No Emotion</span>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 rounded bg-[#86b5f4]"></div>
                          <span className="text-xs sm:text-sm text-gray-700">Sadness</span>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 rounded bg-[#c486f4]"></div>
                          <span className="text-xs sm:text-sm text-gray-700">Fear</span>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 rounded bg-[#f486a9]"></div>
                          <span className="text-xs sm:text-sm text-gray-700">Anger</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        {/* Static color wheel */}
                        <div className="relative h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] md:h-[180px] md:w-[180px] mx-auto overflow-hidden">
                          <div className="absolute inset-[0] rounded-full border-2 border-white">
                            <div className="absolute inset-0 bg-[#e8a87c]" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }}></div>
                            <div className="absolute inset-0 bg-[#f8ef86]" style={{ clipPath: 'polygon(50% 50%, 50% 0, 0 0, 0 50%)' }}></div>
                            <div className="absolute inset-0 bg-[#c1f486]" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 100%)' }}></div>
                            <div className="absolute inset-0 bg-[#86b5f4]" style={{ clipPath: 'polygon(50% 50%, 0 100%, 50% 100%)' }}></div>
                            <div className="absolute inset-0 bg-[#c486f4]" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%)' }}></div>
                            <div className="absolute inset-0 bg-[#f486a9]" style={{ clipPath: 'polygon(50% 50%, 100% 100%, 100% 50%)' }}></div>
                          
                            {/* Pattern overlay */}
                            <div className="absolute inset-0 mix-blend-overlay">
                              <div className="absolute inset-0" style={{ 
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)',
                                mixBlendMode: 'overlay'
                              }}></div>
                            </div>
                          </div>
                          
                          {/* Color tabs */}
                          <div className="absolute top-1/4 right-0 w-5 sm:w-7 h-10 sm:h-12 bg-[#e8a87c] translate-x-1/2 rounded-r-sm"></div>
                          <div className="absolute top-0 right-1/4 w-10 sm:w-12 h-5 sm:h-7 bg-[#f8ef86] -translate-y-1/2 rounded-t-sm"></div>
                          <div className="absolute top-0 left-1/4 w-10 sm:w-12 h-5 sm:h-7 bg-[#c1f486] -translate-y-1/2 rounded-t-sm"></div>
                          <div className="absolute top-1/4 left-0 w-5 sm:w-7 h-10 sm:h-12 bg-[#86b5f4] -translate-x-1/2 rounded-l-sm"></div>
                          <div className="absolute bottom-1/4 left-0 w-5 sm:w-7 h-10 sm:h-12 bg-[#c486f4] -translate-x-1/2 rounded-l-sm"></div>
                          <div className="absolute bottom-1/4 right-0 w-5 sm:w-7 h-10 sm:h-12 bg-[#f486a9] translate-x-1/2 rounded-r-sm"></div>
                          
                          {/* Inner white circle */}
                          <div className="absolute inset-[30%] rounded-full bg-white border-2 border-white"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5 flex justify-center">
                      <Button className="rounded-full bg-[#7067DC] hover:bg-[#5b54c0] text-white px-4 py-1 text-xs sm:text-sm shadow-sm">
                        Auto Analyze
                      </Button>
                    </div>
                </div>
              </div>
            </Card>
            
            <Tabs defaultValue="poem" onValueChange={setActiveTab} className="mx-auto w-full">
              <TabsList className="bg-gray-50 rounded-full grid grid-cols-4 w-full overflow-hidden text-xs sm:text-sm p-1 shadow-sm">
                <TabsTrigger value="poem" className={`rounded-full p-2 sm:p-2.5 ${activeTab === "poem" ? "bg-white text-[#7067DC] font-medium shadow-sm" : "text-gray-600"}`}>Poem</TabsTrigger>
                <TabsTrigger value="graph" className={`rounded-full p-2 sm:p-2.5 ${activeTab === "graph" ? "bg-white text-[#7067DC] font-medium shadow-sm" : "text-gray-600"}`}>Graph</TabsTrigger>
                <TabsTrigger value="qa" className={`rounded-full p-2 sm:p-2.5 ${activeTab === "qa" ? "bg-white text-[#7067DC] font-medium shadow-sm" : "text-gray-600"}`}>Q&A</TabsTrigger>
                <TabsTrigger value="color" className={`rounded-full p-2 sm:p-2.5 ${activeTab === "color" ? "bg-white text-[#7067DC] font-medium shadow-sm" : "text-gray-600"}`}>Color</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}