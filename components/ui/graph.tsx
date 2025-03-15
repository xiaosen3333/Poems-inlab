"use client";

import { useEffect, useRef } from "react";
import { Graph, Edge } from "@antv/x6";
import { SceneNode, SceneEdge, uiConstants } from "@/lib/config/appConfig";

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
        router: "manhattan",
        connector: {
          name: "rounded",
          args: {
            radius: 8,
          },
        },
        anchor: "center",
        connectionPoint: "anchor",
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
      // Fixed size for consistent rendering
      resizing: {
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
      borderRadius,
    } = uiConstants.graph;

    // Add nodes
    nodes.forEach((node) => {
      const cell = graph.addNode({
        id: node.id,
        x: node.x,
        y: node.y,
        width: nodeWidth,
        height: nodeHeight,
        attrs: {
          body: {
            fill: node.type === "entity" ? entityFill : relationFill,
            stroke: node.type === "entity" ? entityStroke : relationStroke,
            rx: borderRadius,
            ry: borderRadius,
          },
          label: {
            text: node.label,
            fill: node.type === "entity" ? "#444444" : "#ffffff",
            fontSize: 12,
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

    // 完全重写渲染逻辑，确保节点始终在视图内
    if (nodes.length > 0) {
      try {
        // 在更大的画布上，我们可以使用更合适的缩放比例
        
        // 首先居中内容
        graph.centerContent({
          padding: 50  // 合理的边距
        });
        
        // 使用更适合的缩放比例
        graph.zoomTo(0.8);  // 增大缩放比例，使节点更大
        
        // 获取容器尺寸
        const width = graph.options.width as number;
        const height = graph.options.height as number;
        
        // 应用一个小的偏移来确保居中效果
        graph.translate(width / 8, height / 8);
      } catch (e) {
        // 如果上述方法失败，使用最保守的备用方法
        console.log("使用备用定位方法");

        // 使用更大的缩放比例，适合大画布
        graph.zoomTo(0.7);

        // 手动设置平移，确保内容居中
        const width = graph.options.width as number;
        const height = graph.options.height as number;

        graph.translate(width / 6, height / 6);
      }
    } else {
      // 无节点时，设置更好的初始视图
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
