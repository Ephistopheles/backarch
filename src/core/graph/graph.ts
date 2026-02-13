/**
 * Core graph operations - Framework independent
 * Pure functions for manipulating architecture graphs
 */

import type { ArchGraph, ArchNode, ArchEdge, ArchNodeData, Position, NodeType } from './graph.types';

/** Creates an empty graph */
export function createEmptyGraph(): ArchGraph {
  return {
    nodes: [],
    edges: [],
  };
}

/** Generates a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Creates a new node with default position */
export function createNode(
  type: NodeType,
  name: string,
  position: Position = { x: 100, y: 100 }
): ArchNode {
  const id = generateId();
  
  const baseData = {
    id,
    type,
    name,
    description: '',
  };

  let data: ArchNodeData;

  switch (type) {
    case 'endpoint':
      data = { ...baseData, type: 'endpoint', method: 'GET', path: `/${name.toLowerCase()}` };
      break;
    case 'service':
      data = { ...baseData, type: 'service', methods: [] };
      break;
    case 'repository':
      data = { ...baseData, type: 'repository', entity: '' };
      break;
    case 'model':
      data = { ...baseData, type: 'model', fields: [] };
      break;
    case 'database':
      data = { ...baseData, type: 'database', engine: 'PostgreSQL' };
      break;
  }

  return {
    id,
    data,
    position,
  };
}

/** Creates an edge between two nodes */
export function createEdge(source: string, target: string, label?: string): ArchEdge {
  return {
    id: `edge-${source}-${target}`,
    source,
    target,
    label,
  };
}

/** Adds a node to the graph */
export function addNode(graph: ArchGraph, node: ArchNode): ArchGraph {
  return {
    ...graph,
    nodes: [...graph.nodes, node],
  };
}

/** Removes a node and its connected edges from the graph */
export function removeNode(graph: ArchGraph, nodeId: string): ArchGraph {
  return {
    nodes: graph.nodes.filter((n) => n.id !== nodeId),
    edges: graph.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
  };
}

/** Adds an edge to the graph */
export function addEdge(graph: ArchGraph, edge: ArchEdge): ArchGraph {
  // Prevent duplicate edges
  const exists = graph.edges.some(
    (e) => e.source === edge.source && e.target === edge.target
  );
  if (exists) return graph;

  return {
    ...graph,
    edges: [...graph.edges, edge],
  };
}

/** Removes an edge from the graph */
export function removeEdge(graph: ArchGraph, edgeId: string): ArchGraph {
  return {
    ...graph,
    edges: graph.edges.filter((e) => e.id !== edgeId),
  };
}

/** Updates a node's data */
export function updateNode(
  graph: ArchGraph,
  nodeId: string,
  updates: Partial<ArchNodeData>
): ArchGraph {
  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...updates } as ArchNodeData }
        : node
    ),
  };
}

/** Updates a node's position */
export function updateNodePosition(
  graph: ArchGraph,
  nodeId: string,
  position: Position
): ArchGraph {
  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      node.id === nodeId ? { ...node, position } : node
    ),
  };
}

/** Gets a node by ID */
export function getNode(graph: ArchGraph, nodeId: string): ArchNode | undefined {
  return graph.nodes.find((n) => n.id === nodeId);
}

/** Gets all edges connected to a node */
export function getNodeEdges(graph: ArchGraph, nodeId: string): ArchEdge[] {
  return graph.edges.filter((e) => e.source === nodeId || e.target === nodeId);
}
