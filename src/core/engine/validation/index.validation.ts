/**
 * Validation Engine Module
 *
 * Provides real-time validation of the graph architecture.
 * Detects architectural violations, missing connections,
 * and provides actionable feedback to improve design quality.
 */

import type { BAGraph, BANode } from '../types/graph/index.graph';

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

/**
 * Validate that endpoints connect to services
 */
const validateEndpointConnections = (
  graph: BAGraph,
  node: BANode
): ValidationItem | null => {
  if (node.type !== 'endpoint') return null;

  if (!hasOutgoingConnection(graph, node.id)) {
    return {
      id: `endpoint-no-service-${node.id}`,
      severity: 'error',
      message: `Endpoint "${node.label}" must connect to a Service`,
      messageKey: 'validation.endpointMustConnectToService',
      affectedNodeIds: [node.id],
    };
  }

  return null;
};

/**
 * Validate that services connect to repositories
 */
const validateServiceConnections = (
  graph: BAGraph,
  node: BANode
): ValidationItem | null => {
  if (node.type !== 'service') return null;

  if (!hasOutgoingConnection(graph, node.id)) {
    return {
      id: `service-no-repository-${node.id}`,
      severity: 'warning',
      message: `Service "${node.label}" should connect to a Repository`,
      messageKey: 'validation.serviceShouldConnectToRepository',
      affectedNodeIds: [node.id],
    };
  }

  return null;
};

/**
 * Validate that repositories connect to databases
 */
const validateRepositoryConnections = (
  graph: BAGraph,
  node: BANode
): ValidationItem | null => {
  if (node.type !== 'repository') return null;

  if (!hasOutgoingConnection(graph, node.id)) {
    return {
      id: `repository-no-database-${node.id}`,
      severity: 'warning',
      message: `Repository "${node.label}" should connect to a Database`,
      messageKey: 'validation.repositoryShouldConnectToDatabase',
      affectedNodeIds: [node.id],
    };
  }

  return null;
};

/**
 * Validate that services have incoming connections
 */
const validateServiceHasIncoming = (
  graph: BAGraph,
  node: BANode
): ValidationItem | null => {
  if (node.type !== 'service') return null;

  if (!hasIncomingConnection(graph, node.id)) {
    return {
      id: `service-orphan-${node.id}`,
      severity: 'info',
      message: `Service "${node.label}" has no incoming connections`,
      messageKey: 'validation.serviceNoIncoming',
      affectedNodeIds: [node.id],
    };
  }

  return null;
};

/**
 * Validate that databases have incoming connections
 */
const validateDatabaseHasIncoming = (
  graph: BAGraph,
  node: BANode
): ValidationItem | null => {
  if (node.type !== 'database') return null;

  if (!hasIncomingConnection(graph, node.id)) {
    return {
      id: `database-orphan-${node.id}`,
      severity: 'warning',
      message: `Database "${node.label}" is not connected to any Repository`,
      messageKey: 'validation.databaseNotConnected',
      affectedNodeIds: [node.id],
    };
  }

  return null;
};

/**
 * Validate that endpoints don't connect directly to repositories
 * This would skip the service layer
 */
const validateLayerViolations = (graph: BAGraph): ValidationItem[] => {
  const violations: ValidationItem[] = [];

  for (const edge of graph.edges) {
    const sourceNode = graph.nodes.find((n) => n.id === edge.source);
    const targetNode = graph.nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) continue;

    // Endpoint directly to Repository (skipping Service)
    if (sourceNode.type === 'endpoint' && targetNode.type === 'repository') {
      violations.push({
        id: `layer-violation-${edge.id}`,
        severity: 'error',
        message: `Endpoint "${sourceNode.label}" should not connect directly to Repository "${targetNode.label}". Use a Service layer.`,
        messageKey: 'validation.endpointSkipsService',
        affectedNodeIds: [sourceNode.id, targetNode.id],
      });
    }

    // Endpoint directly to Database (skipping all layers)
    if (sourceNode.type === 'endpoint' && targetNode.type === 'database') {
      violations.push({
        id: `layer-violation-${edge.id}`,
        severity: 'error',
        message: `Endpoint "${sourceNode.label}" should not connect directly to Database "${targetNode.label}". Follow layered architecture.`,
        messageKey: 'validation.endpointToDatabase',
        affectedNodeIds: [sourceNode.id, targetNode.id],
      });
    }

    // Service directly to Database (skipping Repository)
    if (sourceNode.type === 'service' && targetNode.type === 'database') {
      violations.push({
        id: `layer-violation-${edge.id}`,
        severity: 'error',
        message: `Service "${sourceNode.label}" should not connect directly to Database "${targetNode.label}". Use a Repository layer.`,
        messageKey: 'validation.serviceSkipsRepository',
        affectedNodeIds: [sourceNode.id, targetNode.id],
      });
    }
  }

  return violations;
};

/**
 * Detect circular dependencies in the graph
 */
const detectCircularDependencies = (graph: BAGraph): ValidationItem[] => {
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

/**
 * Main validation function
 * Validates the entire graph and returns all issues found
 */
export const validateGraph = (graph: BAGraph): ValidationResult => {
  const items: ValidationItem[] = [];

  // Validate individual nodes
  for (const node of graph.nodes) {
    const validators = [
      validateEndpointConnections,
      validateServiceConnections,
      validateRepositoryConnections,
      validateServiceHasIncoming,
      validateDatabaseHasIncoming,
    ];

    for (const validator of validators) {
      const result = validator(graph, node);
      if (result) {
        items.push(result);
      }
    }
  }

  // Validate layer violations
  items.push(...validateLayerViolations(graph));

  // Detect circular dependencies
  items.push(...detectCircularDependencies(graph));

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
