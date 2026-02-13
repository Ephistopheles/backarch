/**
 * Application-wide shared types
 */

import type { NodeType } from '../core/graph/graph.types';
import { t } from '../i18n';
import EndPoint from '../assets/icons/endpoint.svg';
import Service from '../assets/icons/service.svg';
import Repository from '../assets/icons/repository.svg';
import Database from '../assets/icons/database.svg';

/** Component block definition for sidebar */
export interface ComponentBlock {
  type: NodeType;
  labelKey: string; // Translation key
  icon: string;
  color: {
    bg: string;
    text: string;
  };
}

/** Get translated label for component type */
export function getComponentLabel(type: NodeType): string {
  return t(`componentTypes.${type}` as any);
}

/** Available component blocks */
export const COMPONENT_BLOCKS: ComponentBlock[] = [
  {
    type: 'endpoint',
    labelKey: 'componentTypes.endpoint',
    icon: EndPoint,
    color: { bg: 'bg-sky-100', text: 'text-sky-600' },
  },
  {
    type: 'service',
    labelKey: 'componentTypes.service',
    icon: Service,
    color: { bg: 'bg-green-100', text: 'text-green-600' },
  },
  {
    type: 'repository',
    labelKey: 'componentTypes.repository',
    icon: Repository,
    color: { bg: 'bg-purple-100', text: 'text-purple-600' },
  },
  // Disabled
  // {
  //   type: 'model',
  //   labelKey: 'componentTypes.model',
  //   icon: '📋',
  //   color: { bg: 'bg-amber-100', text: 'text-amber-600' },
  // },
  {
    type: 'database',
    labelKey: 'componentTypes.database',
    icon: Database,
    color: { bg: 'bg-red-100', text: 'text-red-600' },
  },
];
