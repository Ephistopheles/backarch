import type { BAEdge, BAGraph, BANode } from '../types/graph/index.graph';
import { canConnect } from '../validators/index.validators';

export const createEmptyGraph = (): BAGraph => ({
  nodes: [],
  edges: [],
});

export const addNode = (graph: BAGraph, node: BANode): BAGraph => {
  return {
    ...graph,
    nodes: [...graph.nodes, node],
  };
};

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
