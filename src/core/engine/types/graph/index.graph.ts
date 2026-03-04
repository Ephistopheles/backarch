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
 * 
 * Shared types (used across architectures):
 * - endpoint: HTTP entry points (REST APIs, Controllers)
 * - service: Business logic handlers
 * - repository: Data access layer
 * - database: External storage systems
 * 
 * Hexagonal architecture types:
 * - driving-adapter: Inbound adapters (HTTP, CLI, Events)
 * - driving-port: Inbound ports (use case interfaces)
 * - domain: Core domain/business logic
 * - driven-port: Outbound ports (repository interfaces)
 * - driven-adapter: Outbound adapters (DB, External APIs)
 */
export type NodeType = 
  // Shared/Layered types
  | 'endpoint' 
  | 'service' 
  | 'repository' 
  | 'database'
  // Hexagonal types
  | 'driving-adapter'
  | 'driving-port'
  | 'domain'
  | 'driven-port'
  | 'driven-adapter';

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

  // Hexagonal - Adapter specific
  adapterType?: 'http' | 'grpc' | 'cli' | 'event' | 'database' | 'external-api' | 'message-queue';
  
  // Hexagonal - Port specific
  portInterface?: string;
  
  // Hexagonal - Domain specific
  aggregateRoot?: boolean;
  domainEvents?: string[];

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
