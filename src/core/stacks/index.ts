/**
 * Technology stacks module - Framework independent
 * Defines available technology stacks and architectures
 */

/** A technology stack definition */
export interface Stack {
  id: string;
  name: string;
  versions: string[];
}

/** An architecture pattern definition */
export interface Architecture {
  id: string;
  name: string;
  description: string;
}

/** Available technology stacks */
export const STACKS: Stack[] = [
  {
    id: 'node',
    name: 'Node.js',
    versions: ['18.x', '20.x', '22.x'],
  },
  {
    id: 'spring',
    name: 'Spring Boot',
    versions: ['3.0', '3.1', '3.2'],
  },
  {
    id: 'dotnet',
    name: '.NET',
    versions: ['6.0', '7.0', '8.0'],
  },
  {
    id: 'python',
    name: 'Python/FastAPI',
    versions: ['3.10', '3.11', '3.12'],
  },
];

/** Available architecture patterns */
export const ARCHITECTURES: Architecture[] = [
  {
    id: 'layered',
    name: 'Layered',
    description: 'Traditional layered architecture (Controller → Service → Repository)',
  },
  {
    id: 'hexagonal',
    name: 'Hexagonal',
    description: 'Ports and adapters architecture',
  },
  {
    id: 'clean',
    name: 'Clean Architecture',
    description: 'Uncle Bob\'s clean architecture pattern',
  },
  {
    id: 'vertical-slice',
    name: 'Vertical Slice',
    description: 'Feature-based vertical slices',
  },
];

/** Gets a stack by ID */
export function getStack(id: string): Stack | undefined {
  return STACKS.find((s) => s.id === id);
}

/** Gets an architecture by ID */
export function getArchitecture(id: string): Architecture | undefined {
  return ARCHITECTURES.find((a) => a.id === id);
}
