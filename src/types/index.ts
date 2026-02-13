/**
 * Application-wide shared types
 */

import type { NodeType } from '../core/graph/graph.types';

/** Component block definition for sidebar */
export interface ComponentBlock {
  type: NodeType;
  label: string;
  icon: string;
  color: {
    bg: string;
    text: string;
  };
}

/** Available component blocks */
export const COMPONENT_BLOCKS: ComponentBlock[] = [
  {
    type: 'endpoint',
    label: 'Endpoint',
    icon: '🌐',
    color: { bg: 'bg-sky-100', text: 'text-sky-600' },
  },
  {
    type: 'service',
    label: 'Service',
    icon: '⚙️',
    color: { bg: 'bg-green-100', text: 'text-green-600' },
  },
  {
    type: 'repository',
    label: 'Repository',
    icon: '📦',
    color: { bg: 'bg-purple-100', text: 'text-purple-600' },
  },
  {
    type: 'model',
    label: 'Model',
    icon: '📋',
    color: { bg: 'bg-amber-100', text: 'text-amber-600' },
  },
  {
    type: 'database',
    label: 'Database',
    icon: '🗄️',
    color: { bg: 'bg-red-100', text: 'text-red-600' },
  },
];
