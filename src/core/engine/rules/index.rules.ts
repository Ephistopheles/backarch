/**
 * Architecture-specific Connection Rules Module
 * 
 * Defines valid connections between node types per architecture.
 * Each architecture has its own set of rules that enforce
 * proper component relationships.
 */

import type { NodeType } from '../types/graph/index.graph';

/**
 * Connection rules mapping: source node type -> allowed target types
 */
export type ConnectionRules = {
  [K in NodeType]?: NodeType[];
};

/**
 * Architecture rules definition
 */
export interface ArchitectureRules {
  architectureId: string;
  connections: ConnectionRules;
}

/**
 * Layered Architecture Rules
 * 
 * Flow: Endpoint -> Service -> Repository -> Database
 * Enforces strict layer separation
 */
const LAYERED_RULES: ArchitectureRules = {
  architectureId: 'layered',
  connections: {
    endpoint: ['service'],
    service: ['repository', 'service'], // Services can call other services
    repository: ['database'],
    database: [],
  },
};

/**
 * Hexagonal Architecture Rules
 * 
 * Flow: Driving Adapter -> Driving Port -> Domain -> Driven Port -> Driven Adapter
 * 
 * - Driving (Primary) side: adapters that invoke the application
 * - Driven (Secondary) side: adapters that the application invokes
 * - Domain is completely isolated from infrastructure
 */
const HEXAGONAL_RULES: ArchitectureRules = {
  architectureId: 'hexagonal',
  connections: {
    'driving-adapter': ['driving-port'],
    'driving-port': ['domain'],
    'domain': ['domain', 'driven-port'], // Domain can reference other domain objects and use driven ports
    'driven-port': ['driven-adapter'],
    'driven-adapter': [],
  },
};

/**
 * All architecture rules registry
 */
const ARCHITECTURE_RULES: ArchitectureRules[] = [
  LAYERED_RULES,
  HEXAGONAL_RULES,
];

/**
 * Get connection rules for a specific architecture
 * @param architectureId - The architecture to get rules for
 * @returns Connection rules or empty object if not found
 */
export const getRulesByArchitecture = (
  architectureId: string | null
): ConnectionRules => {
  if (!architectureId) return {};
  
  const rules = ARCHITECTURE_RULES.find(
    (r) => r.architectureId === architectureId
  );
  
  return rules?.connections ?? {};
};

/**
 * Check if a connection is valid for an architecture
 * @param architectureId - The architecture context
 * @param source - Source node type
 * @param target - Target node type
 * @returns true if connection is allowed
 */
export const isValidConnection = (
  architectureId: string | null,
  source: NodeType,
  target: NodeType
): boolean => {
  const rules = getRulesByArchitecture(architectureId);
  return rules[source]?.includes(target) ?? false;
};

/**
 * Get allowed target types for a source node
 * @param architectureId - The architecture context
 * @param source - Source node type
 * @returns Array of allowed target types
 */
export const getAllowedTargets = (
  architectureId: string | null,
  source: NodeType
): NodeType[] => {
  const rules = getRulesByArchitecture(architectureId);
  return rules[source] ?? [];
};

/**
 * Legacy export for backward compatibility
 * @deprecated Use getRulesByArchitecture or isValidConnection instead
 */
export const connectionRules: ConnectionRules = LAYERED_RULES.connections;
