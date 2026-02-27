type NodeId = string;
type EdgeId = string;

export type NodeType = 'endpoint' | 'service' | 'repository' | 'database';

export interface BANode {
  id: NodeId;
  type: NodeType;
  label: string;
}

export interface BAEdge {
  id: EdgeId;
  source: NodeId;
  target: NodeId;
}

export interface BAGraph {
  nodes: BANode[];
  edges: BAEdge[];
}
