/**
 * Graph Engine Module
 *
 * Pure functions for manipulating the immutable graph structure.
 * All operations return a new graph without mutating the original.
 */

import type { BAEdge, BAGraph, BANode } from '../types/graph/index.graph';
import { canConnect } from '../validators/index.validators';

/**
 * Create an empty graph
 */
export const createEmptyGraph = (): BAGraph => ({
  nodes: [],
  edges: [],
});

/**
 * Add a node to the graph
 * @param graph - Current graph state
 * @param node - Node to add
 * @returns New graph with the node added
 */
export const addNode = (graph: BAGraph, node: BANode): BAGraph => {
  return {
    ...graph,
    nodes: [...graph.nodes, node],
  };
};

/**
 * Update an existing node in the graph
 * @param graph - Current graph state
 * @param nodeId - ID of the node to update
 * @param updates - Partial node updates to apply
 * @returns New graph with the node updated
 */
export const updateNode = (
  graph: BAGraph,
  nodeId: string,
  updates: Partial<Omit<BANode, 'id'>>
): BAGraph => {
  const nodeIndex = graph.nodes.findIndex((n) => n.id === nodeId);
  if (nodeIndex === -1) return graph;

  const updatedNodes = [...graph.nodes];
  updatedNodes[nodeIndex] = {
    ...updatedNodes[nodeIndex],
    ...updates,
  };

  return {
    ...graph,
    nodes: updatedNodes,
  };
};

/**
 * Remove a node and all its connected edges from the graph
 * @param graph - Current graph state
 * @param nodeId - ID of the node to remove
 * @returns New graph with the node and connected edges removed
 */
export const removeNode = (graph: BAGraph, nodeId: string): BAGraph => {
  return {
    nodes: graph.nodes.filter((n) => n.id !== nodeId),
    edges: graph.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    ),
  };
};

/**
 * Add an edge between two nodes
 * Validates the connection before adding
 * @param graph - Current graph state
 * @param edge - Edge to add
 * @returns New graph with the edge added, or same graph if invalid
 */
export const addEdge = (graph: BAGraph, edge: BAEdge): BAGraph => {
  const sourceNode = graph.nodes.find((n) => n.id === edge.source);
  const targetNode = graph.nodes.find((n) => n.id === edge.target);

  if (!sourceNode || !targetNode) {
    return graph;
  }

  if (!canConnect(sourceNode.type, targetNode.type)) {
    return graph;
  }
  return {
    ...graph,
    edges: [...graph.edges, edge],
  };
};

/**
 * Remove an edge from the graph
 * @param graph - Current graph state
 * @param edgeId - ID of the edge to remove
 * @returns New graph with the edge removed
 */
export const removeEdge = (graph: BAGraph, edgeId: string): BAGraph => {
  return {
    ...graph,
    edges: graph.edges.filter((e) => e.id !== edgeId),
  };
};
