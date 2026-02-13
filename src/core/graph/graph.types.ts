/**
 * Core graph types - Framework independent
 * These types represent the domain model for backend architecture diagrams
 */

/** Supported node types in the architecture */
export type NodeType = 'endpoint' | 'service' | 'repository' | 'model' | 'database';

/** HTTP methods for endpoint nodes */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Base configuration shared by all nodes */
export interface BaseNodeData {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
}

/** Endpoint node configuration */
export interface EndpointNodeData extends BaseNodeData {
  type: 'endpoint';
  method: HttpMethod;
  path: string;
  auth?: string;
}

/** Service node configuration */
export interface ServiceNodeData extends BaseNodeData {
  type: 'service';
  methods?: string[];
}

/** Repository node configuration */
export interface RepositoryNodeData extends BaseNodeData {
  type: 'repository';
  entity?: string;
}

/** Model node configuration */
export interface ModelNodeData extends BaseNodeData {
  type: 'model';
  fields?: Array<{ name: string; type: string }>;
}

/** Database node configuration */
export interface DatabaseNodeData extends BaseNodeData {
  type: 'database';
  engine?: string;
  connectionString?: string;
}

/** Union type for all node data variants */
export type ArchNodeData =
  | EndpointNodeData
  | ServiceNodeData
  | RepositoryNodeData
  | ModelNodeData
  | DatabaseNodeData;

/** Position on the canvas */
export interface Position {
  x: number;
  y: number;
}

/** A node in the architecture graph */
export interface ArchNode {
  id: string;
  data: ArchNodeData;
  position: Position;
}

/** Connection between two nodes */
export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/** Complete architecture graph */
export interface ArchGraph {
  nodes: ArchNode[];
  edges: ArchEdge[];
}
