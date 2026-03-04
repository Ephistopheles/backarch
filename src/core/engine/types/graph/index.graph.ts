/**
 * Graph Types Module
 *
 * Core type definitions for the BackArch graph engine.
 * Defines nodes, edges, and the immutable graph structure.
 */

type NodeId = string;
type EdgeId = string;

/**
 * Available node types in BackArch
 * These represent architectural components that can be placed on the canvas
 */
export type NodeType = 'endpoint' | 'service' | 'repository' | 'database';

/**
 * Node metadata for architecture-specific configurations
 */
export interface NodeMetadata {
  // Endpoint-specific
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path?: string;

  // Service-specific
  className?: string;

  // Repository-specific
  entityType?: string;

  // Database-specific
  databaseType?: 'postgresql' | 'mysql' | 'mongodb';

  // Generic
  description?: string;
}

/**
 * BackArch Node representation
 * Represents an architectural component in the graph
 */
export interface BANode {
  id: NodeId;
  type: NodeType;
  label: string;
  layer?: string;
  metadata?: NodeMetadata;
}

/**
 * BackArch Edge representation
 * Represents a valid connection between two nodes
 */
export interface BAEdge {
  id: EdgeId;
  source: NodeId;
  target: NodeId;
}

/**
 * BackArch Graph
 * Immutable graph structure containing all nodes and edges
 */
export interface BAGraph {
  nodes: BANode[];
  edges: BAEdge[];
}
