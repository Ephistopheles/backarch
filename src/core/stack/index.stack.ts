interface Version {
  id: string;
  version: string;
  description: string;
  documentationUrl: string;
}

export interface Stack {
  id: string;
  name: string;
  description: string;
  documentationUrl: string;
  versions: Version[];
}

export interface Architecture {
  id: string;
  name: string;
  description: string;
  documentationUrl: string;
}

export const STACKS: Stack[] = [
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    description: 'spring_boot',
    documentationUrl: 'https://spring.io/projects/spring-boot',
    versions: [
      {
        id: 'spring-boot-4.0.2',
        version: '4.0.2',
        description: 'spring_boot_4_0_2',
        documentationUrl: 'https://docs.spring.io/spring-boot/4.0.2/index.html',
      },
    ],
  },
];

export const ARCHITECTURES: Architecture[] = [
  {
    id: 'layered',
    name: 'Layered Architecture',
    description: 'layered',
    documentationUrl:
      'https://dev.to/yasmine_ddec94f4d4/understanding-the-layered-architecture-pattern-a-comprehensive-guide-1e2j',
  },
  {
    id: 'hexagonal',
    name: 'Hexagonal Architecture',
    description: 'hexagonal',
    documentationUrl:
      'https://lo0o0p.medium.com/my-flavour-of-hexagonal-architecture-ef3f0fb2c92c',
  },
];

export const getStackById = (id: string): Stack | undefined => {
  return STACKS.find((stack) => stack.id === id);
};

export const getVersionsByStackId = (stackId: string): Version[] => {
  return getStackById(stackId)?.versions ?? [];
};

export const getArchitectureById = (id: string): Architecture | undefined => {
  return ARCHITECTURES.find((architecture) => architecture.id === id);
};
