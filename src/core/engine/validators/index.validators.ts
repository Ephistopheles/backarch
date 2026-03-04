/**
 * Validators Module
 * 
 * Provides connection validation functions for the graph engine.
 * Supports architecture-aware validation.
 */

import { connectionRules, isValidConnection as rulesValidation } from '../rules/index.rules';
import type { NodeType } from '../types/graph/index.graph';

/**
 * Check if two node types can be connected
 * Uses architecture-aware rules when architectureId is provided
 * Falls back to layered architecture rules for backward compatibility
 * 
 * @param source - Source node type
 * @param target - Target node type
 * @param architectureId - Optional architecture context
 * @returns true if connection is allowed
 */
export const canConnect = (
  source: NodeType, 
  target: NodeType,
  architectureId?: string | null
): boolean => {
  // Use architecture-aware validation when architectureId is provided
  if (architectureId) {
    return rulesValidation(architectureId, source, target);
  }
  
  // Legacy fallback: use layered architecture rules
  return connectionRules[source]?.includes(target) ?? false;
};
