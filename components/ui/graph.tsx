"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Graph, Edge } from "@antv/x6";
import { SceneNode, SceneEdge, uiConstants as defaultUiConstants } from "@/lib/config/appConfig";
import { getConfig } from "@/lib/services/configService";

interface GraphComponentProps {
  nodes: SceneNode[];
  edges: SceneEdge[];
  onNodeClick?: (id: string) => void;
  onEdgeClick?: (id: string) => void;
  isMovable?: boolean;
  onNodesMoved?: (nodes: SceneNode[]) => void;
}

export function GraphComponent({
  nodes = [],
  edges = [],
  onNodeClick,
  onEdgeClick,
  isMovable = false,
  onNodesMoved,
}: GraphComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const nodesRef = useRef<SceneNode[]>(nodes);
  
  const [uiConstants, setUiConstants] = useState(defaultUiConstants);
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const configParam = searchParams?.get('config');
    console.log("URL config param in Graph:", configParam);
    
    const configName = configParam && ['youcaihua', 'chunxiao', 'qingwa', 'niaomingjian'].includes(configParam)
      ? configParam
      : 'default';
    
    const loadedConfig = getConfig(configName);
    console.log("Graph - config loaded:", configName);
    
    setUiConstants(loadedConfig.uiConstants);
  }, [searchParams]);

  // Update the ref when nodes prop changes
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Calculate fixed dimensions - important for consistent rendering
    const containerWidth = containerRef.current.clientWidth || 500;
    const containerHeight = containerRef.current.clientHeight || 300;

    // Initialize the graph
    const graph = new Graph({
      container: containerRef.current,
      width: containerWidth,
      height: containerHeight,
      grid: {
        visible: true,
        type: "doubleMesh",
        size: 20, // Fixed grid size for consistency
        args: [
          {
            color: "#eee",
            thickness: 1,
          },
          {
            color: "#ddd",
            thickness: 1,
            factor: 4,
          },
        ],
      },
      connecting: {
        router: "normal",
        connector: {
          name: "rounded",
          args: {
            radius: 8,
          },
        },
        allowBlank: false,
        snap: true,
        createEdge() {
          return new Edge({
            attrs: {
              line: {
                stroke: "#a855f7",
                strokeWidth: 2,
                targetMarker: {
                  name: "block",
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          });
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: "stroke",
          args: {
            attrs: {
              stroke: "#5F95FF",
              strokeWidth: 4,
            },
          },
        },
      },
      mousewheel: {
        enabled: false, // Disable mousewheel zooming for fixed scale
      },
      interacting: {
        nodeMovable: isMovable, // Only allow node movement when isMovable is true
        edgeMovable: false,
      },
      // Prevent panning
      panning: {
        enabled: false,
      },
      // Ensure content stays in view
      translating: {
        restrict: true,
      },
    });

    graphRef.current = graph;

    // Set up node movement handler
    if (isMovable && onNodesMoved) {
      graph.on("node:moved", (args) => {
        const { node } = args;
        const id = node.id as string;
        const position = node.getPosition();

        // Update the node position in our data
        const updatedNodes = nodesRef.current.map((n) => {
          if (n.id === id) {
            return { ...n, x: position.x, y: position.y };
          }
          return n;
        });

        // Call the callback with updated node positions
        nodesRef.current = updatedNodes;
        onNodesMoved(updatedNodes);
      });
    }

    // Clean up function
    return () => {
      graph.dispose();
    };
  }, [isMovable, onNodesMoved]);

  // Add nodes and edges when they change
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    // Clear existing cells
    graph.clearCells();

    // Get constants from appConfig
    const {
      nodeWidth,
      nodeHeight,
      entityFill,
      entityStroke,
      relationFill,
      relationStroke,
      modifierFill,
      modifierStroke,
      modifierText,
      borderRadius,
    } = uiConstants.graph;

    // Add nodes
    nodes.forEach((node) => {
      // Determine fill, stroke, and text color based on node type
      let fillColor, strokeColor, textColor;

      if (node.type === "entity") {
        fillColor = entityFill;
        strokeColor = entityStroke;
        textColor = "#7067DD";
      } else if (node.type === "relation") {
        fillColor = relationFill;
        strokeColor = relationStroke;
        textColor = "#9AE3EB";
      } else if (node.type === "modifier") {
        fillColor = modifierFill;
        strokeColor = modifierStroke;
        textColor = modifierText;
      }

      const chineseCharCount = (node.label.match(/[\u4e00-\u9fa5]/g) || [])
        .length;
      const otherCharCount = node.label.length - chineseCharCount;
      const estimatedWidth = Math.max(
        nodeWidth,
        chineseCharCount * 18 + otherCharCount * 9 + 20
      );

      const cell = graph.addNode({
        id: node.id,
        x: node.x,
        y: node.y,
        width: estimatedWidth,
        height: nodeHeight,
        attrs: {
          body: {
            fill: fillColor,
            stroke: strokeColor,
            rx: borderRadius,
            ry: borderRadius,
          },
          label: {
            text: node.label,
            fill: textColor,
            fontSize: 16,
            fontFamily: "Arial, sans-serif",
          },
        },
      });

      if (onNodeClick) {
        cell.on("cell:click", () => onNodeClick(node.id));
      }
    });

    // Add edges
    edges.forEach((edge) => {
      const cell = graph.addEdge({
        id: edge.id,
        source: { cell: edge.source },
        target: { cell: edge.target },
        attrs: {
          line: {
            stroke: uiConstants.graph.edgeStroke,
            strokeWidth: 2,
            targetMarker: {
              name: "block",
              width: 12,
              height: 8,
            },
          },
        },
        labels: edge.label
          ? [
              {
                attrs: {
                  text: {
                    text: edge.label,
                    fill: "#333",
                    fontSize: 12,
                    textAnchor: "middle",
                    textVerticalAnchor: "middle",
                  },
                  rect: {
                    fill: "#ffffff",
                    stroke: "#a855f7",
                    strokeWidth: 1,
                    rx: 4,
                    ry: 4,
                    refWidth: "100%",
                    refHeight: "100%",
                    refX: 0,
                    refY: 0,
                  },
                },
                position: {
                  distance: 0.5,
                },
              },
            ]
          : [],
      });

      if (onEdgeClick) {
        cell.on("cell:click", () => onEdgeClick(edge.id));
      }
    });

    if (nodes.length > 0) {
      try {

        graph.centerContent({
          padding: 50,
        });

        graph.zoomTo(0.8);

        const width = graph.options.width as number;
        const height = graph.options.height as number;

        graph.translate(width / 8, height / 8);
      } catch (e) {
        console.log("Using fallback positioning.");

        graph.zoomTo(0.7);

        const width = graph.options.width as number;
        const height = graph.options.height as number;

        graph.translate(width / 6, height / 6);
      }
    } else {
      graph.zoomTo(0.9);
      graph.translate(
        (graph.options.width as number) / 4,
        (graph.options.height as number) / 4
      );
    }
  }, [nodes, edges, onNodeClick, onEdgeClick]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full border rounded-lg overflow-hidden"
    ></div>
  );
}
