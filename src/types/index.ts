/**
 * Application-wide shared types
 */

import type { NodeType } from '../core/graph/graph.types';
import EndPoint from '../assets/icons/endpoint.svg';
import Service from '../assets/icons/service.svg';
import Repository from '../assets/icons/repository.svg';
import Database from '../assets/icons/database.svg';

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
    icon: EndPoint,
    color: { bg: 'bg-sky-100', text: 'text-sky-600' },
  },
  {
    type: 'service',
    label: 'Service',
    icon: Service,
    color: { bg: 'bg-green-100', text: 'text-green-600' },
  },
  {
    type: 'repository',
    label: 'Repository',
    icon: Repository,
    color: { bg: 'bg-purple-100', text: 'text-purple-600' },
  },
  // Disabled
  // {
  //   type: 'model',
  //   label: 'Model',
  //   icon: '📋',
  //   color: { bg: 'bg-amber-100', text: 'text-amber-600' },
  // },
  {
    type: 'database',
    label: 'Database',
    icon: Database,
    color: { bg: 'bg-red-100', text: 'text-red-600' },
  },
];
