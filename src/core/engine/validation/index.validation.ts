/**
 * Validation Engine Module
 *
 * Provides real-time validation of the graph architecture.
 * Detects architectural violations, missing connections,
 * and provides actionable feedback to improve design quality.
 * 
 * Supports multiple architectures with dynamic validation rules.
 */

import type { BAGraph, BANode, NodeType } from '../types/graph/index.graph';
import { isValidConnection, getAllowedTargets } from '../rules/index.rules';

/**
 * Validation severity levels
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Validation result item
 */
export interface ValidationItem {
  id: string;
  severity: ValidationSeverity;
  message: string;
  messageKey: string;
  messageParams?: Record<string, string | number>;
  affectedNodeIds: string[];
}

/**
 * Validation result containing all issues found
 */
export interface ValidationResult {
  items: ValidationItem[];
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
}

/**
 * Node validator function signature
 */
type NodeValidator = (
  graph: BAGraph,
  node: BANode,
  architectureId: string
) => ValidationItem | null;

/**
 * Graph validator function signature
 */
type GraphValidator = (
  graph: BAGraph,
  architectureId: string
) => ValidationItem[];

/**
 * Architecture-specific validation configuration
 */
interface ArchitectureValidationConfig {
  architectureId: string;
  /** Node types that MUST have outgoing connections */
  requiresOutgoing: NodeType[];
  /** Node types that SHOULD have outgoing connections (warning) */
  suggestsOutgoing: NodeType[];
  /** Node types that SHOULD have incoming connections (warning) */
  suggestsIncoming: NodeType[];
  /** Entry point node types (don't need incoming) */
  entryPoints: NodeType[];
  /** Terminal node types (don't need outgoing) */
  terminals: NodeType[];
}

/**
 * Layered Architecture Validation Config
 */
const LAYERED_VALIDATION: ArchitectureValidationConfig = {
  architectureId: 'layered',
  requiresOutgoing: ['endpoint'],
  suggestsOutgoing: ['service', 'repository'],
  suggestsIncoming: ['service', 'database'],
  entryPoints: ['endpoint'],
  terminals: ['database'],
};

/**
 * Hexagonal Architecture Validation Config
 */
const HEXAGONAL_VALIDATION: ArchitectureValidationConfig = {
  architectureId: 'hexagonal',
  requiresOutgoing: ['driving-adapter', 'driving-port'],
  suggestsOutgoing: ['domain', 'driven-port'],
  suggestsIncoming: ['driving-port', 'domain', 'driven-port', 'driven-adapter'],
  entryPoints: ['driving-adapter'],
  terminals: ['driven-adapter'],
};

/**
 * All validation configurations
 */
const VALIDATION_CONFIGS: ArchitectureValidationConfig[] = [
  LAYERED_VALIDATION,
  HEXAGONAL_VALIDATION,
];

/**
 * Get validation config for an architecture
 */
const getValidationConfig = (
  architectureId: string
): ArchitectureValidationConfig | null => {
  return VALIDATION_CONFIGS.find((c) => c.architectureId === architectureId) ?? null;
};

/**
 * Check if a node has outgoing connections
 */
const hasOutgoingConnection = (graph: BAGraph, nodeId: string): boolean => {
  return graph.edges.some((edge) => edge.source === nodeId);
};

/**
 * Check if a node has incoming connections
 */
const hasIncomingConnection = (graph: BAGraph, nodeId: string): boolean => {
  return graph.edges.some((edge) => edge.target === nodeId);
};

// ============================================================================
// Dynamic Validators (Architecture-agnostic)
// ============================================================================

/**
 * Validate nodes that REQUIRE outgoing connections
 */
const validateRequiredOutgoing: NodeValidator = (
  graph,
  node,
  architectureId
): ValidationItem | null => {
  const config = getValidationConfig(architectureId);
  if (!config || !config.requiresOutgoing.includes(node.type)) return null;

  if (!hasOutgoingConnection(graph, node.id)) {
    const allowedTargets = getAllowedTargets(architectureId, node.type);
    const targetDescription = allowedTargets.length > 0 
      ? allowedTargets.join(' or ') 
      : 'another component';
    
    return {
      id: `required-outgoing-${node.id}`,
      severity: 'error',
      message: `${node.type} "${node.label}" must connect to ${targetDescription}`,
      messageKey: 'validation.requiredOutgoingConnection',
      messageParams: {
        nodeType: node.type,
        nodeLabel: node.label,
        targetDescription,
      },
      affectedNodeIds: [node.id],
    };
  }

  return null;
};

/**
 * Validate nodes that SHOULD have outgoing connections
 */
const validateSuggestedOutgoing: NodeValidator = (
  graph,
  node,
  architectureId
): ValidationItem | null => {
  const config = getValidationConfig(architectureId);
  if (!config || !config.suggestsOutgoing.includes(node.type)) return null;
  if (config.terminals.includes(node.type)) return null; // Terminal nodes don't need outgoing

  if (!hasOutgoingConnection(graph, node.id)) {
    const allowedTargets = getAllowedTargets(architectureId, node.type);
    const targetDescription = allowedTargets.length > 0 
      ? allowedTargets.join(' or ') 
      : 'another component';
    
    return {
      id: `suggested-outgoing-${node.id}`,
      severity: 'warning',
      message: `${node.type} "${node.label}" should connect to ${targetDescription}`,
      messageKey: 'validation.suggestedOutgoingConnection',
      messageParams: {
        nodeType: node.type,
        nodeLabel: node.label,
        targetDescription,
      },
      affectedNodeIds: [node.id],
    };
  }

  return null;
};

/**
 * Validate nodes that SHOULD have incoming connections
 */
const validateSuggestedIncoming: NodeValidator = (
  graph,
  node,
  architectureId
): ValidationItem | null => {
  const config = getValidationConfig(architectureId);
  if (!config || !config.suggestsIncoming.includes(node.type)) return null;
  if (config.entryPoints.includes(node.type)) return null; // Entry points don't need incoming

  if (!hasIncomingConnection(graph, node.id)) {
    return {
      id: `orphan-${node.id}`,
      severity: 'info',
      message: `${node.type} "${node.label}" has no incoming connections`,
      messageKey: 'validation.noIncomingConnection',
      messageParams: {
        nodeType: node.type,
        nodeLabel: node.label,
      },
      affectedNodeIds: [node.id],
    };
  }

  return null;
};

/**
 * Validate connections based on architecture rules
 * Checks if each edge is valid according to the architecture's connection rules
 */
const validateConnectionRules: GraphValidator = (
  graph,
  architectureId
): ValidationItem[] => {
  const violations: ValidationItem[] = [];

  for (const edge of graph.edges) {
    const sourceNode = graph.nodes.find((n) => n.id === edge.source);
    const targetNode = graph.nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) continue;

    if (!isValidConnection(architectureId, sourceNode.type, targetNode.type)) {
      violations.push({
        id: `invalid-connection-${edge.id}`,
        severity: 'error',
        message: `${sourceNode.type} "${sourceNode.label}" cannot connect to ${targetNode.type} "${targetNode.label}"`,
        messageKey: 'validation.invalidConnection',
        messageParams: {
          sourceType: sourceNode.type,
          sourceLabel: sourceNode.label,
          targetType: targetNode.type,
          targetLabel: targetNode.label,
        },
        affectedNodeIds: [sourceNode.id, targetNode.id],
      });
    }
  }

  return violations;
};

/**
 * Detect circular dependencies in the graph
 * This is architecture-agnostic
 */
const detectCircularDependencies: GraphValidator = (graph): ValidationItem[] => {
  const violations: ValidationItem[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cyclePath: string[] = [];

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    cyclePath.push(nodeId);

    const outgoingEdges = graph.edges.filter((e) => e.source === nodeId);

    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        if (dfs(edge.target)) {
          return true;
        }
      } else if (recursionStack.has(edge.target)) {
        // Found cycle
        const cycleStart = cyclePath.indexOf(edge.target);
        const cycle = cyclePath.slice(cycleStart);
        cycle.push(edge.target);

        const cycleNodes = cycle.map((id) => {
          const node = graph.nodes.find((n) => n.id === id);
          return node?.label || id;
        });

        violations.push({
          id: `circular-dep-${cycle.join('-')}`,
          severity: 'error',
          message: `Circular dependency detected: ${cycleNodes.join(' → ')}`,
          messageKey: 'validation.circularDependency',
          messageParams: {
            cyclePath: cycleNodes.join(' → '),
          },
          affectedNodeIds: cycle.slice(0, -1),
        });

        return true;
      }
    }

    cyclePath.pop();
    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  return violations;
};

// ============================================================================
// Main Validation Entry Point
// ============================================================================

/**
 * Main validation function
 * Validates the entire graph based on the selected architecture
 * 
 * @param graph - The graph to validate
 * @param architectureId - The architecture context (optional for legacy support)
 * @returns Validation results with all issues found
 */
export const validateGraph = (
  graph: BAGraph,
  architectureId: string | null = 'layered'
): ValidationResult => {
  const items: ValidationItem[] = [];
  const archId = architectureId ?? 'layered';

  // Node validators
  const nodeValidators: NodeValidator[] = [
    validateRequiredOutgoing,
    validateSuggestedOutgoing,
    validateSuggestedIncoming,
  ];

  // Validate individual nodes
  for (const node of graph.nodes) {
    for (const validator of nodeValidators) {
      const result = validator(graph, node, archId);
      if (result) {
        items.push(result);
      }
    }
  }

  // Graph-level validators
  const graphValidators: GraphValidator[] = [
    validateConnectionRules,
    detectCircularDependencies,
  ];

  for (const validator of graphValidators) {
    items.push(...validator(graph, archId));
  }

  // Calculate counts
  const errorCount = items.filter((i) => i.severity === 'error').length;
  const warningCount = items.filter((i) => i.severity === 'warning').length;
  const infoCount = items.filter((i) => i.severity === 'info').length;

  return {
    items,
    isValid: errorCount === 0,
    errorCount,
    warningCount,
    infoCount,
  };
};
