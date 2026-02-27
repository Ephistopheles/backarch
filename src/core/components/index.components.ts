import EndPoint from '@/assets/icons/endpoint.svg';
import Service from '@/assets/icons/service.svg';
import Repository from '@/assets/icons/repository.svg';
import Database from '@/assets/icons/database.svg';
import type { NodeType } from '../engine/types/graph/index.graph';
import type { TranslationKey } from '@/i18n/index.i18n';

export interface ComponentBlock {
  type: NodeType;
  labelKey: TranslationKey;
  icon: string;
  bgColor: string;
}

export const COMPONENT_BLOCKS: ComponentBlock[] = [
  {
    type: 'endpoint',
    labelKey: 'leftsidebar.componentTypes.endpoint',
    icon: EndPoint,
    bgColor: '#c6e8feff',
  },
  {
    type: 'service',
    icon: Service,
    labelKey: 'leftsidebar.componentTypes.service',
    bgColor: '#cbfed8ff',
  },
  {
    type: 'repository',
    icon: Repository,
    labelKey: 'leftsidebar.componentTypes.repository',
    bgColor: '#d7afffff',
  },
  {
    type: 'database',
    icon: Database,
    labelKey: 'leftsidebar.componentTypes.database',
    bgColor: '#ff9c9cff',
  },
];
