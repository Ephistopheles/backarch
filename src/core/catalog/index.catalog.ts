/**
 * Catalog Module
 *
 * Defines which component types are available for each architecture style.
 * The catalog dynamically changes based on the selected architecture,
 * enabling the left sidebar to show only valid components.
 */

import type { NodeType } from '@/core/engine/types/graph/index.graph';
import type { TranslationKey } from '@/i18n/index.i18n';

// Layered Architecture Icons
import EndPoint from '@/assets/icons/endpoint.svg';
import Service from '@/assets/icons/service.svg';
import Repository from '@/assets/icons/repository.svg';
import Database from '@/assets/icons/database.svg';

// Hexagonal Architecture Icons
import DrivingAdapter from '@/assets/icons/driving-adapter.svg';
import DrivingPort from '@/assets/icons/driving-port.svg';
import Domain from '@/assets/icons/domain.svg';
import DrivenPort from '@/assets/icons/driven-port.svg';
import DrivenAdapter from '@/assets/icons/driven-adapter.svg';

/**
 * Component definition for the visual catalog
 */
export interface CatalogComponent {
  type: NodeType;
  labelKey: TranslationKey;
  icon: string;
  bgColor: string;
  layer: string;
}

/**
 * Architecture catalog mapping
 * Defines which components are available per architecture
 */
export interface ArchitectureCatalog {
  architectureId: string;
  components: CatalogComponent[];
}

/**
 * Base component definitions with visual properties
 * Organized by architecture for clarity
 */

// Layered Architecture Components
const LAYERED_COMPONENTS: Record<string, Omit<CatalogComponent, 'layer'>> = {
  endpoint: {
    type: 'endpoint',
    labelKey: 'leftsidebar.componentTypes.endpoint',
    icon: EndPoint,
    bgColor: '#c6e8feff',
  },
  service: {
    type: 'service',
    labelKey: 'leftsidebar.componentTypes.service',
    icon: Service,
    bgColor: '#cbfed8ff',
  },
  repository: {
    type: 'repository',
    labelKey: 'leftsidebar.componentTypes.repository',
    icon: Repository,
    bgColor: '#d7afffff',
  },
  database: {
    type: 'database',
    labelKey: 'leftsidebar.componentTypes.database',
    icon: Database,
    bgColor: '#ff9c9cff',
  },
};

// Hexagonal Architecture Components
const HEXAGONAL_COMPONENTS: Record<string, Omit<CatalogComponent, 'layer'>> = {
  'driving-adapter': {
    type: 'driving-adapter',
    labelKey: 'leftsidebar.componentTypes.drivingAdapter',
    icon: DrivingAdapter,
    bgColor: '#fdffb5ff',
  },
  'driving-port': {
    type: 'driving-port',
    labelKey: 'leftsidebar.componentTypes.drivingPort',
    icon: DrivingPort,
    bgColor: '#c6e8feff',
  },
  domain: {
    type: 'domain',
    labelKey: 'leftsidebar.componentTypes.domain',
    icon: Domain,
    bgColor: '#cbfed8ff',
  },
  'driven-port': {
    type: 'driven-port',
    labelKey: 'leftsidebar.componentTypes.drivenPort',
    icon: DrivenPort,
    bgColor: '#d7afffff',
  },
  'driven-adapter': {
    type: 'driven-adapter',
    labelKey: 'leftsidebar.componentTypes.drivenAdapter',
    icon: DrivenAdapter,
    bgColor: '#ff9c9cff',
  },
};

/**
 * Combined component definitions for backward compatibility
 */
const COMPONENT_DEFINITIONS: Record<
  NodeType,
  Omit<CatalogComponent, 'layer'>
> = {
  ...LAYERED_COMPONENTS,
  ...HEXAGONAL_COMPONENTS,
} as Record<NodeType, Omit<CatalogComponent, 'layer'>>;

/**
 * Catalog definitions per architecture
 *
 * Layered Architecture:
 * - Presentation Layer: Endpoints (Controllers/REST APIs)
 * - Business Layer: Services (Business Logic)
 * - Data Access Layer: Repositories (Data Access)
 * - Infrastructure: Database (External Storage)
 *
 * Hexagonal Architecture:
 * - Driving Side: Adapters and Ports that invoke the application
 * - Core: Domain logic, completely isolated
 * - Driven Side: Ports and Adapters that the application invokes
 */
const ARCHITECTURE_CATALOGS: ArchitectureCatalog[] = [
  {
    architectureId: 'layered',
    components: [
      { ...LAYERED_COMPONENTS.endpoint, layer: 'presentation' },
      { ...LAYERED_COMPONENTS.service, layer: 'business' },
      { ...LAYERED_COMPONENTS.repository, layer: 'data-access' },
      { ...LAYERED_COMPONENTS.database, layer: 'infrastructure' },
    ],
  },
  {
    architectureId: 'hexagonal',
    components: [
      { ...HEXAGONAL_COMPONENTS['driving-adapter'], layer: 'driving' },
      { ...HEXAGONAL_COMPONENTS['driving-port'], layer: 'driving' },
      { ...HEXAGONAL_COMPONENTS['domain'], layer: 'core' },
      { ...HEXAGONAL_COMPONENTS['driven-port'], layer: 'driven' },
      { ...HEXAGONAL_COMPONENTS['driven-adapter'], layer: 'driven' },
    ],
  },
];

/**
 * Get catalog components for a specific architecture
 * @param architectureId - The architecture to get components for
 * @returns Array of available components for the architecture
 */
export const getCatalogByArchitecture = (
  architectureId: string | null,
): CatalogComponent[] => {
  if (!architectureId) return [];

  const catalog = ARCHITECTURE_CATALOGS.find(
    (c) => c.architectureId === architectureId,
  );

  return catalog?.components ?? [];
};

/**
 * Check if a node type is valid for an architecture
 * @param architectureId - The architecture to check against
 * @param nodeType - The node type to validate
 */
export const isValidNodeType = (
  architectureId: string | null,
  nodeType: NodeType,
): boolean => {
  const catalog = getCatalogByArchitecture(architectureId);
  return catalog.some((c) => c.type === nodeType);
};

/**
 * Get the layer for a node type in an architecture
 * @param architectureId - The architecture
 * @param nodeType - The node type
 */
export const getNodeLayer = (
  architectureId: string | null,
  nodeType: NodeType,
): string | null => {
  const catalog = getCatalogByArchitecture(architectureId);
  const component = catalog.find((c) => c.type === nodeType);
  return component?.layer ?? null;
};

/**
 * Get component definition by type
 */
export const getComponentDefinition = (
  nodeType: NodeType,
): Omit<CatalogComponent, 'layer'> | undefined => {
  return COMPONENT_DEFINITIONS[nodeType];
};

/**
 * Get all available architectures from the catalog
 */
export const getAvailableArchitectures = (): string[] => {
  return ARCHITECTURE_CATALOGS.map((c) => c.architectureId);
};
