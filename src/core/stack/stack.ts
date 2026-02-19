export interface Stack {
  id: string;
  name: string;
  description: string;
  documentationUrl: string;
}

export interface Version {
  id: string;
  version: string;
  description: string;
  documentationUrl: string;
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
    description:
      'A Java-based framework for building web applications and microservices.',
    documentationUrl: 'https://spring.io/projects/spring-boot',
  },
];

export const VERSIONS: Version[] = [
  {
    id: 'spring-boot-4.0.2',
    version: '4.0.2',
    description: 'Spring Boot version 4.0.2 with enhanced performance and new features for building production-ready applications.',
    documentationUrl: 'https://docs.spring.io/spring-boot/4.0.2/index.html',
  },
];

export const ARCHITECTURES: Architecture[] = [
  {
    id: 'layered',
    name: 'Layered Architecture',
    description:
      'A traditional architectural style that organizes code into layers (e.g., presentation, business logic, data access).',
    documentationUrl: 'https://dev.to/yasmine_ddec94f4d4/understanding-the-layered-architecture-pattern-a-comprehensive-guide-1e2j',
  },
];
