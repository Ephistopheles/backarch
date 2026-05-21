/**
 * Scaffold Engine — Public API
 *
 * Resolves the correct generator for a given (stack, architecture) tuple
 * and produces a downloadable ZIP archive.
 *
 * The engine is intentionally extensible: register new generators in
 * GENERATORS to support more stacks/architectures.
 */

import JSZip from 'jszip';
import type { BAGraph } from '@/core/engine/types/graph/index.graph';
import type {
  ScaffoldConfig,
  ScaffoldGenerator,
  ScaffoldResult,
} from './types';
import { generateLayeredSpringBoot } from './templates/spring-boot/layered';
import { generateHexagonalSpringBoot } from './templates/spring-boot/hexagonal';

interface GeneratorRegistration {
  stackId: string;
  architectureId: string;
  generator: ScaffoldGenerator;
}

const GENERATORS: GeneratorRegistration[] = [
  {
    stackId: 'spring-boot',
    architectureId: 'layered',
    generator: generateLayeredSpringBoot,
  },
  {
    stackId: 'spring-boot',
    architectureId: 'hexagonal',
    generator: generateHexagonalSpringBoot,
  },
];

/** Find a generator for a given stack + architecture combination */
export const resolveGenerator = (
  stackId: string,
  architectureId: string,
): ScaffoldGenerator | null => {
  const reg = GENERATORS.find(
    (g) => g.stackId === stackId && g.architectureId === architectureId,
  );
  return reg?.generator ?? null;
};

/** Generate the in-memory scaffold representation */
export const generateScaffold = (
  config: ScaffoldConfig,
  graph: BAGraph,
): ScaffoldResult | null => {
  const generator = resolveGenerator(config.stackId, config.architectureId);
  if (!generator) return null;
  return generator(config, graph);
};

/** Build a ZIP blob from a scaffold result */
export const buildScaffoldZip = async (
  result: ScaffoldResult,
): Promise<Blob> => {
  const zip = new JSZip();
  const root = zip.folder(result.rootDir);
  if (!root) throw new Error('Failed to initialize ZIP root folder');

  for (const file of result.files) {
    root.file(file.path, file.content);
  }

  return zip.generateAsync({ type: 'blob' });
};

/** Trigger a browser download for a generated blob */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so Safari has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Convenience: generate + zip + download */
export const generateAndDownload = async (
  config: ScaffoldConfig,
  graph: BAGraph,
): Promise<boolean> => {
  const result = generateScaffold(config, graph);
  if (!result) return false;
  const blob = await buildScaffoldZip(result);
  downloadBlob(blob, `${result.rootDir}.zip`);
  return true;
};

export type { ScaffoldConfig, ScaffoldResult, ScaffoldFile, ScaffoldGenerator } from './types';
