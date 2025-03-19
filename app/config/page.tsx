"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Download, FileJson, UploadCloud } from "lucide-react";
import { Graph } from "@antv/x6";
import * as appConfig from "@/lib/config/appConfig";
import ConfigGraphEditor from "@/components/config/ConfigGraphEditor";
import ColorPicker from "@/components/config/ColorPicker";

// ImgBB API Key
const IMGBB_API_KEY = "7310033e928db829771cad56fc098222";
const IMGBB_EXPIRATION = "15552000"; // in seconds (180 days)

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState("visual-elements");
  const [config, setConfig] = useState<any>(null);
  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load the appConfig when component mounts
  useEffect(() => {
    const initialConfig = {
      visualElements: JSON.parse(JSON.stringify(appConfig.visualElements)),
      emotionColorWheelLegend: JSON.parse(JSON.stringify(appConfig.emotionColorWheelLegend)),
      emotionColorWheelData: JSON.parse(JSON.stringify(appConfig.emotionColorWheelData)),
      radarChartInitialData: JSON.parse(JSON.stringify(appConfig.radarChartInitialData)),
      radarChartAnalysisData: JSON.parse(JSON.stringify(appConfig.radarChartAnalysisData)),
      radarChartPurpleColors: JSON.parse(JSON.stringify(appConfig.radarChartPurpleColors)),
      keywordsMap: JSON.parse(JSON.stringify(appConfig.keywordsMap)),
      quietNightPoem: JSON.parse(JSON.stringify(appConfig.quietNightPoem)),
      predefinedQuestions: JSON.parse(JSON.stringify(appConfig.predefinedQuestions)),
      graphCanvasData: JSON.parse(JSON.stringify(appConfig.graphCanvasData)),
      uiConstants: JSON.parse(JSON.stringify(appConfig.uiConstants)),
    };
    setConfig(initialConfig);
  }, []);

  // Upload image to ImgBB
  const uploadImage = async (file: File): Promise<string> => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?expiration=${IMGBB_EXPIRATION}&key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
        setIsLoading(false);
        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload image: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return "";
    }
  };

  // Generate config file content
  const generateConfigFile = useCallback(() => {
    if (!config) return "";

    let fileContent = `/**
 * Application Configuration
 * 
 * This file contains centralized configuration for the Poem Studio application.
 * All hardcoded data is extracted here to make it easier to maintain and update.
 */

// ========== VISUALIZATION ELEMENTS CONFIG ==========

/**
 * Visual elements interface
 */
export interface VisualElement {
  id: number;
  src: string;
  title: string;
  size: {
    width: number;
    height: number;
  };
}

/**
 * Visual elements for each canvas
 */
export const visualElements: { [key: number]: VisualElement[] } = ${JSON.stringify(config.visualElements, null, 2)};

// ========== EMOTION ANALYSIS CONFIG ==========

/**
 * Emotion color wheel data configuration
 */
export const emotionColorWheelLegend = ${JSON.stringify(config.emotionColorWheelLegend, null, 2)};

export const emotionColorWheelData = ${JSON.stringify(config.emotionColorWheelData, null, 2)};

/**
 * Interface for radar chart data points
 */
export interface RadarDataPoint {
  emotion: string;
  angle: number;
  userValue: number;
  analysisValue?: number;
}

/**
 * Initial data for the radar chart
 */
export const radarChartInitialData: RadarDataPoint[] = ${JSON.stringify(config.radarChartInitialData, null, 2)};

/**
 * Analysis data for the radar chart
 */
export const radarChartAnalysisData: RadarDataPoint[] = ${JSON.stringify(config.radarChartAnalysisData, null, 2)};

/**
 * Purple colors for radar chart background layers
 */
export const radarChartPurpleColors = ${JSON.stringify(config.radarChartPurpleColors, null, 2)};

// ========== POEM DATA CONFIG ==========

/**
 * Interface for poem keyword mapping
 */
export interface PoemKeyword {
  [key: string]: string;
}

/**
 * Interface for poem data structure
 */
export interface PoemData {
  title: {
    original: string;
    translated: string;
  };
  author: {
    name: string;
    dynasty: string;
  };
  verses: {
    original: string;
    translated: string;
    keywords?: {
      original: string;
      translated: string;
    }[];
  }[];
  background?: string;
}

/**
 * Keywords to highlight in the poem
 */
export const keywordsMap: PoemKeyword = ${JSON.stringify(config.keywordsMap, null, 2)};

/**
 * Li Bai's "Quiet Night Thoughts" poem
 */
export const quietNightPoem: PoemData = ${JSON.stringify(config.quietNightPoem, null, 2)};

// ========== AI CHAT CONFIG ==========

/**
 * Interface for API message
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Interface for predefined question
 */
export interface PredefinedQuestion {
  id: string;
  label: string;
  icon: string;
  question: string;
}

/**
 * Predefined questions for poetry analysis
 */
export const predefinedQuestions: PredefinedQuestion[] = ${JSON.stringify(config.predefinedQuestions, null, 2)};

// ========== GRAPH VISUALIZATION CONFIG ==========

/**
 * Node type definition
 */
export type NodeType = 'entity' | 'relation';

/**
 * Node interfaces for graph visualization
 */
export interface SceneNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
}

/**
 * Edge interface for graph visualization
 */
export interface SceneEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/**
 * Graph data for each canvas (1-4)
 */
export const graphCanvasData = ${JSON.stringify(config.graphCanvasData, null, 2)};

// ========== UI CONSTANTS ==========

/**
 * UI constant values
 */
export const uiConstants = ${JSON.stringify(config.uiConstants, null, 2)};`;

    return fileContent;
  }, [config]);

  // Download the config file
  const downloadConfigFile = () => {
    const content = generateConfigFile();
    setFileContent(content);
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appConfig.ts";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Configuration file downloaded successfully",
    });
  };

  if (!config) {
    return <div className="flex items-center justify-center min-h-screen">Loading configuration...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Configuration Editor</h1>
      <div className="flex justify-between mb-6">
        <Button onClick={downloadConfigFile} variant="default" className="flex items-center gap-2">
          <Download size={16} />
          Download Config
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FileJson size={16} />
              View Generated Code
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-3xl max-h-[80vh]">
            <AlertDialogHeader>
              <AlertDialogTitle>Generated Configuration Code</AlertDialogTitle>
              <AlertDialogDescription>
                This is the TypeScript code that will be downloaded.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ScrollArea className="h-[50vh] border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <pre className="whitespace-pre-wrap text-sm">{generateConfigFile()}</pre>
            </ScrollArea>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction onClick={downloadConfigFile}>Download</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="visual-elements">Visual Elements</TabsTrigger>
          <TabsTrigger value="emotion-analysis">Emotion Analysis</TabsTrigger>
          <TabsTrigger value="poem-data">Poem Data</TabsTrigger>
          <TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
          <TabsTrigger value="graph-config">Graph Visualization</TabsTrigger>
          <TabsTrigger value="ui-constants">UI Constants</TabsTrigger>
          <TabsTrigger value="file-preview">File Preview</TabsTrigger>
        </TabsList>

        {/* Visual Elements Tab */}
        <TabsContent value="visual-elements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Elements Configuration</CardTitle>
              <CardDescription>Manage visual elements for each canvas</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="1" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="1">Canvas 1</TabsTrigger>
                  <TabsTrigger value="2">Canvas 2</TabsTrigger>
                  <TabsTrigger value="3">Canvas 3</TabsTrigger>
                  <TabsTrigger value="4">Canvas 4</TabsTrigger>
                </TabsList>

                {Object.keys(config.visualElements).map((canvasId) => (
                  <TabsContent key={canvasId} value={canvasId} className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={() => {
                          const newElements = [...config.visualElements[Number(canvasId)]];
                          const newId = Math.max(...newElements.map((e) => e.id), 0) + 1;
                          newElements.push({
                            id: newId,
                            src: "/placeholder.svg",
                            title: `New Element ${newId}`,
                            size: { width: 100, height: 100 },
                          });
                          
                          setConfig({
                            ...config,
                            visualElements: {
                              ...config.visualElements,
                              [Number(canvasId)]: newElements,
                            },
                          });
                        }}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add Element
                      </Button>
                    </div>

                    {config.visualElements[Number(canvasId)].map((element, idx) => (
                      <Card key={idx} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Element {element.id}</CardTitle>
                            <Button
                              onClick={() => {
                                const newElements = config.visualElements[Number(canvasId)].filter(
                                  (_, i) => i !== idx
                                );
                                setConfig({
                                  ...config,
                                  visualElements: {
                                    ...config.visualElements,
                                    [Number(canvasId)]: newElements,
                                  },
                                });
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-[1fr_2fr] gap-4 items-start">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor={`visual-element-${canvasId}-${idx}-title`}>Title</Label>
                                <Input
                                  id={`visual-element-${canvasId}-${idx}-title`}
                                  value={element.title}
                                  onChange={(e) => {
                                    const newElements = [...config.visualElements[Number(canvasId)]];
                                    newElements[idx] = {
                                      ...newElements[idx],
                                      title: e.target.value,
                                    };
                                    setConfig({
                                      ...config,
                                      visualElements: {
                                        ...config.visualElements,
                                        [Number(canvasId)]: newElements,
                                      },
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`visual-element-${canvasId}-${idx}-width`}>Width</Label>
                                <Input
                                  id={`visual-element-${canvasId}-${idx}-width`}
                                  type="number"
                                  value={element.size.width}
                                  onChange={(e) => {
                                    const newElements = [...config.visualElements[Number(canvasId)]];
                                    newElements[idx] = {
                                      ...newElements[idx],
                                      size: {
                                        ...newElements[idx].size,
                                        width: parseInt(e.target.value, 10) || 0,
                                      },
                                    };
                                    setConfig({
                                      ...config,
                                      visualElements: {
                                        ...config.visualElements,
                                        [Number(canvasId)]: newElements,
                                      },
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`visual-element-${canvasId}-${idx}-height`}>Height</Label>
                                <Input
                                  id={`visual-element-${canvasId}-${idx}-height`}
                                  type="number"
                                  value={element.size.height}
                                  onChange={(e) => {
                                    const newElements = [...config.visualElements[Number(canvasId)]];
                                    newElements[idx] = {
                                      ...newElements[idx],
                                      size: {
                                        ...newElements[idx].size,
                                        height: parseInt(e.target.value, 10) || 0,
                                      },
                                    };
                                    setConfig({
                                      ...config,
                                      visualElements: {
                                        ...config.visualElements,
                                        [Number(canvasId)]: newElements,
                                      },
                                    });
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Image Upload</Label>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    id={`visual-element-${canvasId}-${idx}-image`}
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const url = await uploadImage(file);
                                        if (url) {
                                          const newElements = [...config.visualElements[Number(canvasId)]];
                                          newElements[idx] = {
                                            ...newElements[idx],
                                            src: url,
                                          };
                                          setConfig({
                                            ...config,
                                            visualElements: {
                                              ...config.visualElements,
                                              [Number(canvasId)]: newElements,
                                            },
                                          });
                                        }
                                      }
                                    }}
                                    className="max-w-sm"
                                  />
                                  <Button variant="secondary" disabled={isLoading} size="sm">
                                    {isLoading ? "Uploading..." : <UploadCloud size={16} />}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="border rounded p-4 flex items-center justify-center overflow-hidden">
                              <div className="text-center">
                                <img
                                  src={element.src}
                                  alt={element.title}
                                  className="max-h-32 mx-auto object-contain mb-2"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                  }}
                                />
                                <div className="text-sm text-gray-500 break-all">
                                  {element.src}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emotion Analysis Tab */}
        <TabsContent value="emotion-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotion Color Wheel Configuration</CardTitle>
              <CardDescription>Configure the emotion color wheel legend and data</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="wheel-data" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="wheel-data">Wheel Data</TabsTrigger>
                  <TabsTrigger value="legend">Emotion Legend</TabsTrigger>
                  <TabsTrigger value="radar-chart">Radar Chart</TabsTrigger>
                </TabsList>

                {/* Wheel Data Tab */}
                <TabsContent value="wheel-data" className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => {
                        const newData = [...config.emotionColorWheelData, {
                          emotion: "New Emotion",
                          color: "#cccccc",
                          value: 20,
                          degree: 0,
                        }];
                        setConfig({
                          ...config,
                          emotionColorWheelData: newData,
                        });
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Emotion
                    </Button>
                  </div>

                  {config.emotionColorWheelData.map((item, idx) => (
                    <Card key={idx} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{item.emotion}</CardTitle>
                          <Button
                            onClick={() => {
                              const newData = config.emotionColorWheelData.filter((_, i) => i !== idx);
                              setConfig({
                                ...config,
                                emotionColorWheelData: newData,
                              });
                            }}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`emotion-legend-${idx}-name`}>Emotion Name</Label>
                          <Input
                            id={`emotion-legend-${idx}-name`}
                            value={item.emotion}
                            onChange={(e) => {
                              const newLegend = [...config.emotionColorWheelLegend];
                              newLegend[idx] = { ...newLegend[idx], emotion: e.target.value };
                              setConfig({ ...config, emotionColorWheelLegend: newLegend });
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`emotion-legend-${idx}-color`}>Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`emotion-legend-${idx}-color`}
                              value={item.color}
                              onChange={(e) => {
                                const newLegend = [...config.emotionColorWheelLegend];
                                newLegend[idx] = { ...newLegend[idx], color: e.target.value };
                                setConfig({ ...config, emotionColorWheelLegend: newLegend });
                              }}
                            />
                            <div
                              className="w-10 h-10 rounded border"
                              style={{ backgroundColor: item.color }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`emotion-legend-${idx}-value`}>Value</Label>
                          <Input
                            id={`emotion-legend-${idx}-value`}
                            type="number"
                            value={item.value}
                            onChange={(e) => {
                              const newLegend = [...config.emotionColorWheelLegend];
                              newLegend[idx] = { ...newLegend[idx], value: parseInt(e.target.value, 10) || 0 };
                              setConfig({ ...config, emotionColorWheelLegend: newLegend });
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`emotion-legend-${idx}-degree`}>Degree</Label>
                          <Input
                            id={`emotion-legend-${idx}-degree`}
                            type="number"
                            value={item.degree}
                            onChange={(e) => {
                              const newLegend = [...config.emotionColorWheelLegend];
                              newLegend[idx] = { ...newLegend[idx], degree: parseInt(e.target.value, 10) || 0 };
                              setConfig({ ...config, emotionColorWheelLegend: newLegend });
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Wheel Data Tab */}
                <TabsContent value="wheel-data" className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => {
                        const newData = [...config.emotionColorWheelData, {
                          emotion: "New Emotion",
                          color: "#cccccc",
                          value: 20,
                          degree: 0,
                        }];
                        setConfig({
                          ...config,
                          emotionColorWheelData: newData,
                        });
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Emotion
                    </Button>
                  </div>

                  <ScrollArea className="h-[600px]">
                    {config.emotionColorWheelData.map((item, idx) => (
                      <Card key={idx} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{item.emotion}</CardTitle>
                            <Button
                              onClick={() => {
                                const newData = config.emotionColorWheelData.filter((_, i) => i !== idx);
                                setConfig({
                                  ...config,
                                  emotionColorWheelData: newData,
                                });
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`emotion-data-${idx}-name`}>Emotion Name</Label>
                            <Input
                              id={`emotion-data-${idx}-name`}
                              value={item.emotion}
                              onChange={(e) => {
                                const newData = [...config.emotionColorWheelData];
                                newData[idx] = { ...newData[idx], emotion: e.target.value };
                                setConfig({ ...config, emotionColorWheelData: newData });
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`emotion-data-${idx}-color`}>Color</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`emotion-data-${idx}-color`}
                                value={item.color}
                                onChange={(e) => {
                                  const newData = [...config.emotionColorWheelData];
                                  newData[idx] = { ...newData[idx], color: e.target.value };
                                  setConfig({ ...config, emotionColorWheelData: newData });
                                }}
                              />
                              <div
                                className="w-10 h-10 rounded border"
                                style={{ backgroundColor: item.color }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`emotion-data-${idx}-value`}>Value</Label>
                            <Input
                              id={`emotion-data-${idx}-value`}
                              type="number"
                              value={item.value}
                              onChange={(e) => {
                                const newData = [...config.emotionColorWheelData];
                                newData[idx] = { ...newData[idx], value: parseInt(e.target.value, 10) || 0 };
                                setConfig({ ...config, emotionColorWheelData: newData });
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`emotion-data-${idx}-degree`}>Degree</Label>
                            <Input
                              id={`emotion-data-${idx}-degree`}
                              type="number"
                              value={item.degree}
                              onChange={(e) => {
                                const newData = [...config.emotionColorWheelData];
                                newData[idx] = { ...newData[idx], degree: parseInt(e.target.value, 10) || 0 };
                                setConfig({ ...config, emotionColorWheelData: newData });
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </ScrollArea>
                </TabsContent>

                {/* Radar Chart Tab */}
                <TabsContent value="radar-chart" className="space-y-6">
                  {/* Initial Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Radar Chart Initial Data</CardTitle>
                      <CardDescription>Configure the initial data for the radar chart</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {config.radarChartInitialData.map((item, idx) => (
                          <div key={idx} className="grid grid-cols-3 gap-4 items-center">
                            <div>
                              <Label htmlFor={`radar-initial-${idx}-emotion`}>Emotion</Label>
                              <Input
                                id={`radar-initial-${idx}-emotion`}
                                value={item.emotion}
                                onChange={(e) => {
                                  const newData = [...config.radarChartInitialData];
                                  newData[idx] = { ...newData[idx], emotion: e.target.value };
                                  setConfig({ ...config, radarChartInitialData: newData });
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`radar-initial-${idx}-angle`}>Angle</Label>
                              <Input
                                id={`radar-initial-${idx}-angle`}
                                type="number"
                                value={item.angle}
                                onChange={(e) => {
                                  const newData = [...config.radarChartInitialData];
                                  newData[idx] = { ...newData[idx], angle: parseInt(e.target.value, 10) || 0 };
                                  setConfig({ ...config, radarChartInitialData: newData });
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`radar-initial-${idx}-value`}>User Value</Label>
                              <Input
                                id={`radar-initial-${idx}-value`}
                                type="number"
                                value={item.userValue}
                                onChange={(e) => {
                                  const newData = [...config.radarChartInitialData];
                                  newData[idx] = { ...newData[idx], userValue: parseInt(e.target.value, 10) || 0 };
                                  setConfig({ ...config, radarChartInitialData: newData });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analysis Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Radar Chart Analysis Data</CardTitle>
                      <CardDescription>Configure the analysis data for the radar chart</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {config.radarChartAnalysisData.map((item, idx) => (
                          <div key={idx} className="grid grid-cols-4 gap-4 items-center">
                            <div>
                              <Label htmlFor={`radar-analysis-${idx}-emotion`}>Emotion</Label>
                              <Input
                                id={`radar-analysis-${idx}-emotion`}
                                value={item.emotion}
                                onChange={(e) => {
                                  const newData = [...config.radarChartAnalysisData];
                                  newData[idx] = { ...newData[idx], emotion: e.target.value };
                                  setConfig({ ...config, radarChartAnalysisData: newData });
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`radar-analysis-${idx}-angle`}>Angle</Label>
                              <Input
                                id={`radar-analysis-${idx}-angle`}
                                type="number"
                                value={item.angle}
                                onChange={(e) => {
                                  const newData = [...config.radarChartAnalysisData];
                                  newData[idx] = { ...newData[idx], angle: parseInt(e.target.value, 10) || 0 };
                                  setConfig({ ...config, radarChartAnalysisData: newData });
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`radar-analysis-${idx}-user-value`}>User Value</Label>
                              <Input
                                id={`radar-analysis-${idx}-user-value`}
                                type="number"
                                value={item.userValue}
                                onChange={(e) => {
                                  const newData = [...config.radarChartAnalysisData];
                                  newData[idx] = { ...newData[idx], userValue: parseInt(e.target.value, 10) || 0 };
                                  setConfig({ ...config, radarChartAnalysisData: newData });
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`radar-analysis-${idx}-analysis-value`}>Analysis Value</Label>
                              <Input
                                id={`radar-analysis-${idx}-analysis-value`}
                                type="number"
                                value={item.analysisValue}
                                onChange={(e) => {
                                  const newData = [...config.radarChartAnalysisData];
                                  newData[idx] = { ...newData[idx], analysisValue: parseInt(e.target.value, 10) || 0 };
                                  setConfig({ ...config, radarChartAnalysisData: newData });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Purple Colors */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Radar Chart Background Colors</CardTitle>
                      <CardDescription>Configure the purple background colors for the radar chart</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {config.radarChartPurpleColors.map((color, idx) => (
                          <div key={idx} className="flex items-center space-x-4">
                            <div className="flex-1">
                              <Input
                                id={`radar-color-${idx}`}
                                value={color}
                                onChange={(e) => {
                                  const newColors = [...config.radarChartPurpleColors];
                                  newColors[idx] = e.target.value;
                                  setConfig({ ...config, radarChartPurpleColors: newColors });
                                }}
                              />
                            </div>
                            <div
                              className="w-10 h-10 rounded border"
                              style={{ backgroundColor: color }}
                            ></div>
                            <Button
                              onClick={() => {
                                const newColors = config.radarChartPurpleColors.filter((_, i) => i !== idx);
                                setConfig({
                                  ...config,
                                  radarChartPurpleColors: newColors,
                                });
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            const newColors = [...config.radarChartPurpleColors, "#f2f0ff"];
                            setConfig({
                              ...config,
                              radarChartPurpleColors: newColors,
                            });
                          }}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Add Color
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Poem Data Tab */}
        <TabsContent value="poem-data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Poem Data Configuration</CardTitle>
              <CardDescription>Configure poem data and keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="poem" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="poem">Poem Data</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                </TabsList>

                {/* Poem Data Tab */}
                <TabsContent value="poem" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Poem Title</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="poem-title-original">Original Title</Label>
                        <Input
                          id="poem-title-original"
                          value={config.quietNightPoem.title.original}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              quietNightPoem: {
                                ...config.quietNightPoem,
                                title: {
                                  ...config.quietNightPoem.title,
                                  original: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="poem-title-translated">Translated Title</Label>
                        <Input
                          id="poem-title-translated"
                          value={config.quietNightPoem.title.translated}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              quietNightPoem: {
                                ...config.quietNightPoem,
                                title: {
                                  ...config.quietNightPoem.title,
                                  translated: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Poem Author</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="poem-author-name">Author Name</Label>
                        <Input
                          id="poem-author-name"
                          value={config.quietNightPoem.author.name}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              quietNightPoem: {
                                ...config.quietNightPoem,
                                author: {
                                  ...config.quietNightPoem.author,
                                  name: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="poem-author-dynasty">Dynasty</Label>
                        <Input
                          id="poem-author-dynasty"
                          value={config.quietNightPoem.author.dynasty}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              quietNightPoem: {
                                ...config.quietNightPoem,
                                author: {
                                  ...config.quietNightPoem.author,
                                  dynasty: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Poem Verses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {config.quietNightPoem.verses.map((verse, idx) => (
                        <Card key={idx} className="mb-4">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">Verse {idx + 1}</CardTitle>
                              <Button
                                onClick={() => {
                                  const newVerses = config.quietNightPoem.verses.filter((_, i) => i !== idx);
                                  setConfig({
                                    ...config,
                                    quietNightPoem: {
                                      ...config.quietNightPoem,
                                      verses: newVerses,
                                    },
                                  });
                                }}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor={`verse-${idx}-original`}>Original</Label>
                              <Input
                                id={`verse-${idx}-original`}
                                value={verse.original}
                                onChange={(e) => {
                                  const newVerses = [...config.quietNightPoem.verses];
                                  newVerses[idx] = {
                                    ...newVerses[idx],
                                    original: e.target.value,
                                  };
                                  setConfig({
                                    ...config,
                                    quietNightPoem: {
                                      ...config.quietNightPoem,
                                      verses: newVerses,
                                    },
                                  });
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`verse-${idx}-translated`}>Translated</Label>
                              <Input
                                id={`verse-${idx}-translated`}
                                value={verse.translated}
                                onChange={(e) => {
                                  const newVerses = [...config.quietNightPoem.verses];
                                  newVerses[idx] = {
                                    ...newVerses[idx],
                                    translated: e.target.value,
                                  };
                                  setConfig({
                                    ...config,
                                    quietNightPoem: {
                                      ...config.quietNightPoem,
                                      verses: newVerses,
                                    },
                                  });
                                }}
                              />
                            </div>
                            <div>
                              <Label>Keywords</Label>
                              {verse.keywords?.map((keyword, keywordIdx) => (
                                <div key={keywordIdx} className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2">
                                  <Input
                                    value={keyword.original}
                                    onChange={(e) => {
                                      const newVerses = [...config.quietNightPoem.verses];
                                      const newKeywords = [...(newVerses[idx].keywords || [])];
                                      newKeywords[keywordIdx] = {
                                        ...newKeywords[keywordIdx],
                                        original: e.target.value,
                                      };
                                      newVerses[idx] = {
                                        ...newVerses[idx],
                                        keywords: newKeywords,
                                      };
                                      setConfig({
                                        ...config,
                                        quietNightPoem: {
                                          ...config.quietNightPoem,
                                          verses: newVerses,
                                        },
                                      });
                                    }}
                                    placeholder="Original keyword"
                                  />
                                  <Input
                                    value={keyword.translated}
                                    onChange={(e) => {
                                      const newVerses = [...config.quietNightPoem.verses];
                                      const newKeywords = [...(newVerses[idx].keywords || [])];
                                      newKeywords[keywordIdx] = {
                                        ...newKeywords[keywordIdx],
                                        translated: e.target.value,
                                      };
                                      newVerses[idx] = {
                                        ...newVerses[idx],
                                        keywords: newKeywords,
                                      };
                                      setConfig({
                                        ...config,
                                        quietNightPoem: {
                                          ...config.quietNightPoem,
                                          verses: newVerses,
                                        },
                                      });
                                    }}
                                    placeholder="Translated keyword"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const newVerses = [...config.quietNightPoem.verses];
                                      const newKeywords = (newVerses[idx].keywords || []).filter(
                                        (_, i) => i !== keywordIdx
                                      );
                                      newVerses[idx] = {
                                        ...newVerses[idx],
                                        keywords: newKeywords,
                                      };
                                      setConfig({
                                        ...config,
                                        quietNightPoem: {
                                          ...config.quietNightPoem,
                                          verses: newVerses,
                                        },
                                      });
                                    }}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const newVerses = [...config.quietNightPoem.verses];
                                  const newKeywords = [...(newVerses[idx].keywords || []), { original: "", translated: "" }];
                                  newVerses[idx] = {
                                    ...newVerses[idx],
                                    keywords: newKeywords,
                                  };
                                  setConfig({
                                    ...config,
                                    quietNightPoem: {
                                      ...config.quietNightPoem,
                                      verses: newVerses,
                                    },
                                  });
                                }}
                              >
                                <Plus size={16} className="mr-2" /> Add Keyword
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newVerses = [...config.quietNightPoem.verses, {
                            original: "",
                            translated: "",
                            keywords: [],
                          }];
                          setConfig({
                            ...config,
                            quietNightPoem: {
                              ...config.quietNightPoem,
                              verses: newVerses,
                            },
                          });
                        }}
                      >
                        <Plus size={16} className="mr-2" /> Add Verse
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Poem Background</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        id="poem-background"
                        value={config.quietNightPoem.background || ""}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            quietNightPoem: {
                              ...config.quietNightPoem,
                              background: e.target.value,
                            },
                          });
                        }}
                        className="min-h-32"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Keywords Tab */}
                <TabsContent value="keywords" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Keywords Mapping</CardTitle>
                      <CardDescription>Configure the keywords to highlight in the poem</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(config.keywordsMap).map(([key, value], idx) => (
                          <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center">
                            <Input
                              value={key}
                              onChange={(e) => {
                                const newKeywordsMap = { ...config.keywordsMap };
                                const val = newKeywordsMap[key];
                                delete newKeywordsMap[key];
                                newKeywordsMap[e.target.value] = val;
                                setConfig({ ...config, keywordsMap: newKeywordsMap });
                              }}
                              placeholder="Original keyword"
                            />
                            <Input
                              value={value as string}
                              onChange={(e) => {
                                const newKeywordsMap = { ...config.keywordsMap };
                                newKeywordsMap[key] = e.target.value;
                                setConfig({ ...config, keywordsMap: newKeywordsMap });
                              }}
                              placeholder="Translated keyword"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newKeywordsMap = { ...config.keywordsMap };
                                delete newKeywordsMap[key];
                                setConfig({ ...config, keywordsMap: newKeywordsMap });
                              }}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newKeywordsMap = { ...config.keywordsMap, "": "" };
                            setConfig({ ...config, keywordsMap: newKeywordsMap });
                          }}
                        >
                          <Plus size={16} className="mr-2" /> Add Keyword
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="ai-chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predefined Questions</CardTitle>
              <CardDescription>Configure predefined questions for the AI chat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.predefinedQuestions.map((question, idx) => (
                  <Card key={idx} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{question.label}</CardTitle>
                        <Button
                          onClick={() => {
                            const newQuestions = config.predefinedQuestions.filter((_, i) => i !== idx);
                            setConfig({
                              ...config,
                              predefinedQuestions: newQuestions,
                            });
                          }}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`question-${idx}-id`}>ID</Label>
                        <Input
                          id={`question-${idx}-id`}
                          value={question.id}
                          onChange={(e) => {
                            const newQuestions = [...config.predefinedQuestions];
                            newQuestions[idx] = { ...newQuestions[idx], id: e.target.value };
                            setConfig({ ...config, predefinedQuestions: newQuestions });
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`question-${idx}-label`}>Label</Label>
                        <Input
                          id={`question-${idx}-label`}
                          value={question.label}
                          onChange={(e) => {
                            const newQuestions = [...config.predefinedQuestions];
                            newQuestions[idx] = { ...newQuestions[idx], label: e.target.value };
                            setConfig({ ...config, predefinedQuestions: newQuestions });
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`question-${idx}-icon`}>Icon Path</Label>
                        <Input
                          id={`question-${idx}-icon`}
                          value={question.icon}
                          onChange={(e) => {
                            const newQuestions = [...config.predefinedQuestions];
                            newQuestions[idx] = { ...newQuestions[idx], icon: e.target.value };
                            setConfig({ ...config, predefinedQuestions: newQuestions });
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor={`question-${idx}-question`}>Question</Label>
                        <Textarea
                          id={`question-${idx}-question`}
                          value={question.question}
                          onChange={(e) => {
                            const newQuestions = [...config.predefinedQuestions];
                            newQuestions[idx] = { ...newQuestions[idx], question: e.target.value };
                            setConfig({ ...config, predefinedQuestions: newQuestions });
                          }}
                          className="min-h-20"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    const newQuestions = [...config.predefinedQuestions, {
                      id: `question-${config.predefinedQuestions.length + 1}`,
                      label: "New Question",
                      icon: "/button1.png",
                      question: "What would you like to know about this poem?",
                    }];
                    setConfig({
                      ...config,
                      predefinedQuestions: newQuestions,
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Graph Visualization Tab */}
        <TabsContent value="graph-config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Graph Visualization Configuration</CardTitle>
              <CardDescription>Configure the graph data for each canvas</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="1" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="1">Canvas 1</TabsTrigger>
                  <TabsTrigger value="2">Canvas 2</TabsTrigger>
                  <TabsTrigger value="3">Canvas 3</TabsTrigger>
                  <TabsTrigger value="4">Canvas 4</TabsTrigger>
                </TabsList>

                {[0, 1, 2, 3].map((canvasIdx) => (
                  <TabsContent key={canvasIdx} value={(canvasIdx + 1).toString()} className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Graph Configuration for Canvas {canvasIdx + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <ConfigGraphEditor
                            graphData={config.graphCanvasData[canvasIdx]}
                            uiConstants={config.uiConstants.graph}
                            onChange={(newData) => {
                              const newGraphData = [...config.graphCanvasData];
                              newGraphData[canvasIdx] = newData;
                              setConfig({
                                ...config,
                                graphCanvasData: newGraphData,
                              });
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UI Constants Tab */}
        <TabsContent value="ui-constants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>UI Constants</CardTitle>
              <CardDescription>Configure UI constant values</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="color-wheel" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="color-wheel">Color Wheel</TabsTrigger>
                  <TabsTrigger value="radar-chart">Radar Chart</TabsTrigger>
                  <TabsTrigger value="graph">Graph</TabsTrigger>
                  <TabsTrigger value="canvas-image">Canvas Image</TabsTrigger>
                </TabsList>

                {/* Color Wheel Tab */}
                <TabsContent value="color-wheel" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="color-wheel-max-bar-length">Max Bar Length (px)</Label>
                      <Input
                        id="color-wheel-max-bar-length"
                        type="number"
                        value={config.uiConstants.colorWheel.maxBarLength}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              colorWheel: {
                                ...config.uiConstants.colorWheel,
                                maxBarLength: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Radar Chart Tab */}
                <TabsContent value="radar-chart" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="radar-chart-svg-width">SVG Width</Label>
                      <Input
                        id="radar-chart-svg-width"
                        type="number"
                        value={config.uiConstants.radarChart.svgWidth}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              radarChart: {
                                ...config.uiConstants.radarChart,
                                svgWidth: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="radar-chart-svg-height">SVG Height</Label>
                      <Input
                        id="radar-chart-svg-height"
                        type="number"
                        value={config.uiConstants.radarChart.svgHeight}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              radarChart: {
                                ...config.uiConstants.radarChart,
                                svgHeight: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="radar-chart-radius">Radius</Label>
                      <Input
                        id="radar-chart-radius"
                        type="number"
                        value={config.uiConstants.radarChart.radius}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              radarChart: {
                                ...config.uiConstants.radarChart,
                                radius: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="radar-chart-circle-count">Circle Count</Label>
                      <Input
                        id="radar-chart-circle-count"
                        type="number"
                        value={config.uiConstants.radarChart.circleCount}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              radarChart: {
                                ...config.uiConstants.radarChart,
                                circleCount: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Graph Tab */}
                <TabsContent value="graph" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="graph-node-width">Node Width</Label>
                      <Input
                        id="graph-node-width"
                        type="number"
                        value={config.uiConstants.graph.nodeWidth}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              graph: {
                                ...config.uiConstants.graph,
                                nodeWidth: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="graph-node-height">Node Height</Label>
                      <Input
                        id="graph-node-height"
                        type="number"
                        value={config.uiConstants.graph.nodeHeight}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              graph: {
                                ...config.uiConstants.graph,
                                nodeHeight: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="graph-entity-fill">Entity Fill</Label>
                      <div className="flex gap-2">
                        <Input
                          id="graph-entity-fill"
                          value={config.uiConstants.graph.entityFill}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              uiConstants: {
                                ...config.uiConstants,
                                graph: {
                                  ...config.uiConstants.graph,
                                  entityFill: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: config.uiConstants.graph.entityFill }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="graph-entity-stroke">Entity Stroke</Label>
                      <div className="flex gap-2">
                        <Input
                          id="graph-entity-stroke"
                          value={config.uiConstants.graph.entityStroke}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              uiConstants: {
                                ...config.uiConstants,
                                graph: {
                                  ...config.uiConstants.graph,
                                  entityStroke: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: config.uiConstants.graph.entityStroke }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="graph-relation-fill">Relation Fill</Label>
                      <div className="flex gap-2">
                        <Input
                          id="graph-relation-fill"
                          value={config.uiConstants.graph.relationFill}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              uiConstants: {
                                ...config.uiConstants,
                                graph: {
                                  ...config.uiConstants.graph,
                                  relationFill: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: config.uiConstants.graph.relationFill }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="graph-relation-stroke">Relation Stroke</Label>
                      <div className="flex gap-2">
                        <Input
                          id="graph-relation-stroke"
                          value={config.uiConstants.graph.relationStroke}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              uiConstants: {
                                ...config.uiConstants,
                                graph: {
                                  ...config.uiConstants.graph,
                                  relationStroke: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: config.uiConstants.graph.relationStroke }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="graph-modifier-fill">Modifier Fill</Label>
                      <div className="flex gap-2">
                        <Input
                          id="graph-modifier-fill"
                          value={config.uiConstants.graph.modifierFill || '#C9D6E9'}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              uiConstants: {
                                ...config.uiConstants,
                                graph: {
                                  ...config.uiConstants.graph,
                                  modifierFill: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: config.uiConstants.graph.modifierFill || '#C9D6E9' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="graph-modifier-stroke">Modifier Stroke</Label>
                      <div className="flex gap-2">
                        <Input
                          id="graph-modifier-stroke"
                          value={config.uiConstants.graph.modifierStroke || '#C9D6E9'}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              uiConstants: {
                                ...config.uiConstants,
                                graph: {
                                  ...config.uiConstants.graph,
                                  modifierStroke: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: config.uiConstants.graph.modifierStroke || '#C9D6E9' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="graph-modifier-text">Modifier Text</Label>
                      <div className="flex gap-2">
                        <Input
                          id="graph-modifier-text"
                          value={config.uiConstants.graph.modifierText || '#66668A'}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              uiConstants: {
                                ...config.uiConstants,
                                graph: {
                                  ...config.uiConstants.graph,
                                  modifierText: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: config.uiConstants.graph.modifierText || '#66668A' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="graph-edge-stroke">Edge Stroke</Label>
                      <div className="flex gap-2">
                        <Input
                          id="graph-edge-stroke"
                          value={config.uiConstants.graph.edgeStroke}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              uiConstants: {
                                ...config.uiConstants,
                                graph: {
                                  ...config.uiConstants.graph,
                                  edgeStroke: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: config.uiConstants.graph.edgeStroke }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="graph-border-radius">Border Radius</Label>
                      <Input
                        id="graph-border-radius"
                        type="number"
                        value={config.uiConstants.graph.borderRadius}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              graph: {
                                ...config.uiConstants.graph,
                                borderRadius: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Canvas Image Tab */}
                <TabsContent value="canvas-image" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="canvas-image-default-width">Default Width</Label>
                      <Input
                        id="canvas-image-default-width"
                        type="number"
                        value={config.uiConstants.canvasImage.defaultWidth}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              canvasImage: {
                                ...config.uiConstants.canvasImage,
                                defaultWidth: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="canvas-image-default-height">Default Height</Label>
                      <Input
                        id="canvas-image-default-height"
                        type="number"
                        value={config.uiConstants.canvasImage.defaultHeight}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              canvasImage: {
                                ...config.uiConstants.canvasImage,
                                defaultHeight: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="canvas-image-max-width">Max Width</Label>
                      <Input
                        id="canvas-image-max-width"
                        type="number"
                        value={config.uiConstants.canvasImage.maxWidth}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              canvasImage: {
                                ...config.uiConstants.canvasImage,
                                maxWidth: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="canvas-image-max-height">Max Height</Label>
                      <Input
                        id="canvas-image-max-height"
                        type="number"
                        value={config.uiConstants.canvasImage.maxHeight}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              canvasImage: {
                                ...config.uiConstants.canvasImage,
                                maxHeight: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="canvas-image-download-width">Download Width</Label>
                      <Input
                        id="canvas-image-download-width"
                        type="number"
                        value={config.uiConstants.canvasImage.downloadWidth}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              canvasImage: {
                                ...config.uiConstants.canvasImage,
                                downloadWidth: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="canvas-image-download-quality">Download Quality</Label>
                      <Input
                        id="canvas-image-download-quality"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.uiConstants.canvasImage.downloadQuality}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              canvasImage: {
                                ...config.uiConstants.canvasImage,
                                downloadQuality: parseFloat(e.target.value) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="canvas-image-download-scale">Download Scale</Label>
                      <Input
                        id="canvas-image-download-scale"
                        type="number"
                        value={config.uiConstants.canvasImage.downloadScale}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            uiConstants: {
                              ...config.uiConstants,
                              canvasImage: {
                                ...config.uiConstants.canvasImage,
                                downloadScale: parseInt(e.target.value, 10) || 0,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Preview Tab */}
        <TabsContent value="file-preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Configuration File</CardTitle>
              <CardDescription>Preview of the generated appConfig.ts file</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                <pre className="whitespace-pre-wrap text-sm">{generateConfigFile()}</pre>
              </ScrollArea>
              <div className="flex justify-end mt-4">
                <Button onClick={downloadConfigFile} variant="default" className="flex items-center gap-2">
                  <Download size={16} />
                  Download Config
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}