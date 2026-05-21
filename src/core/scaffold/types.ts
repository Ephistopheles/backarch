/**
 * Scaffold generation types
 */

import type { BAGraph } from '@/core/engine/types/graph/index.graph';

/**
 * Project-level configuration for generation
 */
export interface ScaffoldConfig {
  stackId: string;
  versionId: string;
  architectureId: string;
  projectName: string;
  basePackage: string;
}

/**
 * Generated file representation. Path is project-relative.
 */
export interface ScaffoldFile {
  path: string;
  content: string;
}

/**
 * Result of running a scaffold generator
 */
export interface ScaffoldResult {
  rootDir: string;
  files: ScaffoldFile[];
}

/**
 * Generator function signature: a stack+architecture pair implements one
 */
export type ScaffoldGenerator = (
  config: ScaffoldConfig,
  graph: BAGraph,
) => ScaffoldResult;

/**
 * Generator registry key
 */
export interface GeneratorKey {
  stackId: string;
  architectureId: string;
}
