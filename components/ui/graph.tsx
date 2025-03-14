"use client"

import { useEffect, useRef } from 'react'
import { Graph, Node, Edge } from '@antv/x6'

interface SceneNode {
  id: string
  label: string
  type: 'entity' | 'relation'
  x: number
  y: number
}

interface SceneEdge {
  id: string
  source: string
  target: string
  label?: string
}

interface GraphComponentProps {
  nodes: SceneNode[]
  edges: SceneEdge[]
  onNodeClick?: (nodeId: string) => void
  onEdgeClick?: (edgeId: string) => void
}

export function GraphComponent({ 
  nodes = [], 
  edges = [], 
  onNodeClick, 
  onEdgeClick 
}: GraphComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize the graph
    const graph = new Graph({
      container: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee',
            thickness: 1,
          },
          {
            color: '#ddd',
            thickness: 1,
            factor: 4,
          },
        ],
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: true,
        createEdge() {
          return new Edge({
            attrs: {
              line: {
                stroke: '#a855f7',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          })
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              stroke: '#5F95FF',
              strokeWidth: 4,
            },
          },
        },
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
      interacting: {
        nodeMovable: true,
        edgeMovable: true,
      },
    })

    graphRef.current = graph

    // Clean up function
    return () => {
      graph.dispose()
    }
  }, [])

  // Add nodes and edges when they change
  useEffect(() => {
    const graph = graphRef.current
    if (!graph) return

    // Clear existing cells
    graph.clearCells()

    // Add nodes
    nodes.forEach((node) => {
      const cell = graph.addNode({
        id: node.id,
        x: node.x,
        y: node.y,
        width: 100,
        height: 40,
        attrs: {
          body: {
            fill: node.type === 'entity' ? '#dbeafe' : '#c084fc',
            stroke: node.type === 'entity' ? '#93c5fd' : '#a855f7',
            rx: 6,
            ry: 6,
          },
          label: {
            text: node.label,
            fill: node.type === 'entity' ? '#1e3a8a' : '#ffffff',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
          },
        },
      })

      if (onNodeClick) {
        cell.on('cell:click', () => onNodeClick(node.id))
      }
    })

    // Add edges
    edges.forEach((edge) => {
      const cell = graph.addEdge({
        id: edge.id,
        source: { cell: edge.source },
        target: { cell: edge.target },
        attrs: {
          line: {
            stroke: '#a855f7',
            strokeWidth: 2,
            targetMarker: {
              name: 'block',
              width: 12,
              height: 8,
            },
          },
        },
        labels: edge.label ? [
          {
            attrs: {
              text: {
                text: edge.label,
                fill: '#333',
                fontSize: 12,
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
              },
              rect: {
                fill: '#ffffff',
                stroke: '#a855f7',
                strokeWidth: 1,
                rx: 4,
                ry: 4,
                refWidth: '100%',
                refHeight: '100%',
                refX: 0,
                refY: 0,
              },
            },
            position: {
              distance: 0.5,
            },
          },
        ] : [],
      })

      if (onEdgeClick) {
        cell.on('cell:click', () => onEdgeClick(edge.id))
      }
    })

    // Center the content
    graph.centerContent()
  }, [nodes, edges, onNodeClick, onEdgeClick])

  return (
    <div ref={containerRef} className="w-full h-full border rounded-lg"></div>
  )
}

// Example data for the poem "In the Quiet Night"
export const defaultSceneNodes: SceneNode[] = [
  { id: 'moon', label: 'Moon', type: 'entity', x: 150, y: 50 },
  { id: 'moonlight', label: 'Moonlight', type: 'entity', x: 300, y: 100 },
  { id: 'bed', label: 'Bed', type: 'entity', x: 450, y: 100 },
  { id: 'inside', label: 'Inside', type: 'relation', x: 350, y: 175 },
  { id: 'room', label: 'Room', type: 'entity', x: 450, y: 250 },
  { id: 'near', label: 'Near', type: 'relation', x: 250, y: 175 },
  { id: 'person', label: 'Person', type: 'entity', x: 300, y: 250 },
  { id: 'standingOn', label: 'Standing on', type: 'relation', x: 250, y: 300 },
  { id: 'ground', label: 'Ground', type: 'entity', x: 300, y: 350 },
]

export const defaultSceneEdges: SceneEdge[] = [
  { id: 'e1', source: 'moon', target: 'moonlight' },
  { id: 'e2', source: 'moonlight', target: 'near' },
  { id: 'e3', source: 'bed', target: 'inside' },
  { id: 'e4', source: 'inside', target: 'room' },
  { id: 'e5', source: 'bed', target: 'near' },
  { id: 'e6', source: 'near', target: 'person' },
  { id: 'e7', source: 'person', target: 'standingOn' },
  { id: 'e8', source: 'standingOn', target: 'ground' },
]