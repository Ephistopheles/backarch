/**
 * Validation rules module - Framework independent
 * Will contain architecture validation logic
 */

import type { ArchGraph } from '../graph/graph.types';

/** Validation severity levels */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/** A validation result with stable code (language-agnostic) */
export interface ValidationResult {
  id: string;
  severity: ValidationSeverity;
  code: string; // Stable code like "service_must_connect_repository" (use underscores, not dots)
  nodeId?: string;
}

/** Validates the architecture graph (placeholder) */
export function validateGraph(_graph: ArchGraph): ValidationResult[] {
  // TODO: Implement validation logic
  return [];
}
