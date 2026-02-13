/**
 * Code generator module - Framework independent
 * Will contain project template generation logic
 */

import type { ArchGraph } from '../graph/graph.types';

/** Generation options */
export interface GeneratorOptions {
  stack: string;
  architecture: string;
  outputPath?: string;
}

/** Generates project code from architecture graph (placeholder) */
export function generateProject(
  _graph: ArchGraph,
  _options: GeneratorOptions
): void {
  // TODO: Implement generation logic
  throw new Error('Generation not implemented yet');
}
