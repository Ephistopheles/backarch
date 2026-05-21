/**
 * Shared scaffold helpers (naming, type mapping).
 */

import type { PrimitiveType } from '@/core/engine/types/graph/index.graph';

const SAFE_FALLBACK = 'Component';

const sanitizeWord = (word: string): string => word.replace(/[^a-zA-Z0-9]/g, '');

/** Convert any string into a valid PascalCase Java identifier. */
export const toPascalCase = (input: string | undefined): string => {
  if (!input) return SAFE_FALLBACK;
  const parts = input
    .split(/[^a-zA-Z0-9]+/)
    .map(sanitizeWord)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  const joined = parts.join('');
  if (!joined) return SAFE_FALLBACK;
  return /^[0-9]/.test(joined) ? `_${joined}` : joined;
};

/** Convert any string into a valid camelCase Java identifier. */
export const toCamelCase = (input: string | undefined): string => {
  const pascal = toPascalCase(input);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

/** kebab-case helper for artifact names */
export const toKebabCase = (input: string | undefined): string => {
  if (!input) return 'project';
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'project';
};

/** Validate base package; falls back to com.example.app when invalid */
export const sanitizeBasePackage = (basePackage: string | undefined): string => {
  const fallback = 'com.example.app';
  if (!basePackage) return fallback;
  const parts = basePackage
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())
    .filter(Boolean);
  if (parts.length === 0) return fallback;
  return parts.map((p) => (/^[0-9]/.test(p) ? `_${p}` : p)).join('.');
};

/** Convert dotted java package into a folder path */
export const packageToPath = (pkg: string): string => pkg.split('.').join('/');

/** Map BackArch primitive type to Java type */
export const primitiveToJava = (p: PrimitiveType | undefined): string => {
  switch (p) {
    case 'string':
      return 'String';
    case 'number':
      return 'Long';
    case 'boolean':
      return 'Boolean';
    case 'void':
      return 'void';
    default:
      return 'Object';
  }
};
