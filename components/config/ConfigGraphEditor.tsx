"use client";

import { useEffect, useRef, useState } from 'react';
import { Graph, Node, Edge, Shape } from '@antv/x6';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SceneNode, SceneEdge, NodeType } from "@/lib/config/appConfig";

interface ConfigGraphEditorProps {
  graphData: {
    nodes: SceneNode[];
    edges: SceneEdge[];
  };
  uiConstants: {
    nodeWidth: number;
    nodeHeight: number;
    entityFill: string;
    entityStroke: string;
    relationFill: string;
    relationStroke: string;
    edgeStroke: string;
    borderRadius: number;
  };
  onChange: (data: { nodes: SceneNode[]; edges: SceneEdge[] }) => void;
}

export default function ConfigGraphEditor({ graphData, uiConstants, onChange }: ConfigGraphEditorProps) {
  const graphRef = useRef<HTMLDivElement>(null);
  const graphInstance = useRef<Graph | null>(null);
  const [nodes, setNodes] = useState<SceneNode[]>(graphData.nodes);
  const [edges, setEdges] = useState<SceneEdge[]>(graphData.edges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  // Initialize the graph
  useEffect(() => {
    if (!graphRef.current) return;

    // Create the graph
    const graph = new Graph({
      container: graphRef.current,
      width: 500,
      height: 400,
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
        router: 'normal',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
      },
      interacting: {
        nodeMovable: true,
      },
    });

    graphInstance.current = graph;

    // Register node shapes
    graph.use(
      new Shape.Rect({
        width: uiConstants.nodeWidth,
        height: uiConstants.nodeHeight,
        attrs: {
          body: {
            rx: uiConstants.borderRadius,
            ry: uiConstants.borderRadius,
            stroke: '#000',
            strokeWidth: 1,
            fill: '#fff',
          },
          label: {
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            fill: '#000',
          },
        },
      }),
    );

    // Add event listeners
    graph.on('node:click', ({ node }) => {
      setSelectedNode(node.id);
      setSelectedEdge(null);
    });

    graph.on('edge:click', ({ edge }) => {
      setSelectedNode(null);
      setSelectedEdge(edge.id);
    });

    graph.on('blank:click', () => {
      setSelectedNode(null);
      setSelectedEdge(null);
    });

    graph.on('node:moved', ({ node }) => {
      const nodeId = node.id;
      const position = node.getPosition();
      
      setNodes((prev) => {
        const updated = prev.map(n => {
          if (n.id === nodeId) {
            return { ...n, x: position.x, y: position.y };
          }
          return n;
        });
        onChange({ nodes: updated, edges });
        return updated;
      });
    });

    return () => {
      graph.dispose();
    };
  }, []);

  // Update graph when data changes
  useEffect(() => {
    const graph = graphInstance.current;
    if (!graph) return;

    // Clear the graph
    graph.clearCells();

    // Add nodes
    nodes.forEach((node) => {
      const fillColor = node.type === 'entity' ? uiConstants.entityFill : uiConstants.relationFill;
      const strokeColor = node.type === 'entity' ? uiConstants.entityStroke : uiConstants.relationStroke;

      graph.addNode({
        id: node.id,
        x: node.x,
        y: node.y,
        width: uiConstants.nodeWidth,
        height: uiConstants.nodeHeight,
        label: node.label,
        attrs: {
          body: {
            fill: fillColor,
            stroke: strokeColor,
          }
        },
      });
    });

    // Add edges
    edges.forEach((edge) => {
      graph.addEdge({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        attrs: {
          line: {
            stroke: uiConstants.edgeStroke,
            strokeWidth: 1,
          },
        },
      });
    });
  }, [nodes, edges, uiConstants]);

  // Add a new node
  const addNode = () => {
    const newId = `node-${Date.now()}`;
    const newNode: SceneNode = {
      id: newId,
      label: "New Node",
      type: "entity",
      x: 100,
      y: 100,
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    onChange({ nodes: updatedNodes, edges });
    setSelectedNode(newId);
  };

  // Add a new edge
  const addEdge = () => {
    if (nodes.length < 2) {
      alert('You need at least two nodes to create an edge');
      return;
    }

    const newId = `edge-${Date.now()}`;
    const newEdge: SceneEdge = {
      id: newId,
      source: nodes[0].id,
      target: nodes[1].id,
    };

    const updatedEdges = [...edges, newEdge];
    setEdges(updatedEdges);
    onChange({ nodes, edges: updatedEdges });
    setSelectedEdge(newId);
  };

  // Delete selected node
  const deleteNode = () => {
    if (!selectedNode) return;

    // Delete node
    const updatedNodes = nodes.filter((n) => n.id !== selectedNode);
    
    // Delete connected edges
    const updatedEdges = edges.filter(
      (e) => e.source !== selectedNode && e.target !== selectedNode
    );

    setNodes(updatedNodes);
    setEdges(updatedEdges);
    onChange({ nodes: updatedNodes, edges: updatedEdges });
    setSelectedNode(null);
  };

  // Delete selected edge
  const deleteEdge = () => {
    if (!selectedEdge) return;

    const updatedEdges = edges.filter((e) => e.id !== selectedEdge);
    setEdges(updatedEdges);
    onChange({ nodes, edges: updatedEdges });
    setSelectedEdge(null);
  };

  // Update node property
  const updateNode = (id: string, key: keyof SceneNode, value: string | number | NodeType) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        return { ...node, [key]: value };
      }
      return node;
    });

    setNodes(updatedNodes);
    onChange({ nodes: updatedNodes, edges });

    // Update the node in the graph if needed
    const graph = graphInstance.current;
    if (graph) {
      const node = graph.getCellById(id) as Node;
      if (node) {
        if (key === 'label') {
          node.setLabel(value as string);
        } else if (key === 'type') {
          const fillColor = value === 'entity' ? uiConstants.entityFill : uiConstants.relationFill;
          const strokeColor = value === 'entity' ? uiConstants.entityStroke : uiConstants.relationStroke;
          node.setAttrByPath('body/fill', fillColor);
          node.setAttrByPath('body/stroke', strokeColor);
        }
      }
    }
  };

  // Update edge property
  const updateEdge = (id: string, key: keyof SceneEdge, value: string) => {
    const updatedEdges = edges.map((edge) => {
      if (edge.id === id) {
        return { ...edge, [key]: value };
      }
      return edge;
    });

    setEdges(updatedEdges);
    onChange({ nodes, edges: updatedEdges });

    // Update the edge in the graph if needed
    const graph = graphInstance.current;
    if (graph && key === 'label') {
      const edge = graph.getCellById(id) as Edge;
      if (edge) {
        edge.setLabels(value);
      }
    }
  };

  return (
    <div className="grid grid-cols-[1fr_300px] gap-4">
      <div>
        <div 
          ref={graphRef} 
          className="border rounded-md bg-white" 
          style={{ height: '400px', width: '100%' }}
        />
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={addNode}>
            <Plus size={16} className="mr-2" /> Add Node
          </Button>
          <Button variant="outline" onClick={addEdge}>
            <Plus size={16} className="mr-2" /> Add Edge
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {selectedNode && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Edit Node</h3>
                <Button variant="destructive" size="sm" onClick={deleteNode}>
                  <Trash size={16} />
                </Button>
              </div>
              
              {nodes.find(n => n.id === selectedNode) && (
                <>
                  <div>
                    <Label htmlFor="node-id">ID</Label>
                    <Input
                      id="node-id"
                      value={nodes.find(n => n.id === selectedNode)?.id || ''}
                      onChange={(e) => updateNode(selectedNode, 'id', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="node-label">Label</Label>
                    <Input
                      id="node-label"
                      value={nodes.find(n => n.id === selectedNode)?.label || ''}
                      onChange={(e) => updateNode(selectedNode, 'label', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="node-type">Type</Label>
                    <Select
                      value={nodes.find(n => n.id === selectedNode)?.type || 'entity'}
                      onValueChange={(value) => updateNode(selectedNode, 'type', value as NodeType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select node type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entity">Entity</SelectItem>
                        <SelectItem value="relation">Relation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="node-x">X Position</Label>
                    <Input
                      id="node-x"
                      type="number"
                      value={nodes.find(n => n.id === selectedNode)?.x || 0}
                      onChange={(e) => updateNode(selectedNode, 'x', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="node-y">Y Position</Label>
                    <Input
                      id="node-y"
                      type="number"
                      value={nodes.find(n => n.id === selectedNode)?.y || 0}
                      onChange={(e) => updateNode(selectedNode, 'y', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {selectedEdge && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Edit Edge</h3>
                <Button variant="destructive" size="sm" onClick={deleteEdge}>
                  <Trash size={16} />
                </Button>
              </div>
              
              {edges.find(e => e.id === selectedEdge) && (
                <>
                  <div>
                    <Label htmlFor="edge-id">ID</Label>
                    <Input
                      id="edge-id"
                      value={edges.find(e => e.id === selectedEdge)?.id || ''}
                      onChange={(e) => updateEdge(selectedEdge, 'id', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edge-source">Source</Label>
                    <Select
                      value={edges.find(e => e.id === selectedEdge)?.source || ''}
                      onValueChange={(value) => updateEdge(selectedEdge, 'source', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label} ({node.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edge-target">Target</Label>
                    <Select
                      value={edges.find(e => e.id === selectedEdge)?.target || ''}
                      onValueChange={(value) => updateEdge(selectedEdge, 'target', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label} ({node.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edge-label">Label (optional)</Label>
                    <Input
                      id="edge-label"
                      value={edges.find(e => e.id === selectedEdge)?.label || ''}
                      onChange={(e) => updateEdge(selectedEdge, 'label', e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {!selectedNode && !selectedEdge && (
          <div className="border rounded-md p-6 text-center text-gray-500">
            Select a node or edge to edit its properties
          </div>
        )}
      </div>
    </div>
  );
}