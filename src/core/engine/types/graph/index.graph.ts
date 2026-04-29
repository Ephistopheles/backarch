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
 * Primitive types allowed in method signatures and HTTP configurations
 */
export type PrimitiveType = 'string' | 'number' | 'boolean' | 'void';

/**
 * HTTP parameter definition (query or path parameter)
 */
export interface HttpParameter {
  id: string;
  name: string;
  type: PrimitiveType;
  required: boolean;
  description?: string;
}

/**
 * HTTP request body definition
 */
export interface HttpRequestBody {
  type: PrimitiveType;
  description?: string;
}

/**
 * HTTP response definition
 */
export interface HttpResponse {
  type: PrimitiveType;
  description?: string;
}

/**
 * Method parameter definition for structural components
 */
export interface MethodParameter {
  id: string;
  name: string;
  type: PrimitiveType;
}

/**
 * Method signature definition
 * Only signatures - no implementations
 */
export interface MethodSignature {
  id: string;
  name: string;
  parameters: MethodParameter[];
  returnType: PrimitiveType;
  description?: string;
}

/**
 * Node metadata for architecture-specific configurations
 */
export interface NodeMetadata {
  // === HTTP Endpoint Configuration (Postman-like) ===
  // Used by: endpoint, driving-adapter (when adapterType is 'http')
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path?: string;
  queryParams?: HttpParameter[];
  pathParams?: HttpParameter[];
  requestBody?: HttpRequestBody;
  response?: HttpResponse;

  // === Structural Code Configuration (Class/Interface) ===
  // Used by: service, repository, driving-port, driven-port, domain
  className?: string;
  interfaceName?: string;
  methods?: MethodSignature[];

  // Repository-specific
  entityType?: string;

  // Database-specific
  databaseType?: 'postgresql' | 'mysql' | 'mongodb';

  // Hexagonal - Adapter specific
  adapterType?: 'http' | 'grpc' | 'cli' | 'event' | 'database' | 'external-api' | 'message-queue';
  
  // Hexagonal - Port specific (legacy - use interfaceName instead)
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
