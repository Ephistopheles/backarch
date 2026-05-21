/**
 * Spring Boot — Layered architecture generator
 *
 * Folder layout:
 *   {basePackage}/
 *     controller/   <- endpoint nodes
 *     service/      <- service nodes
 *     repository/   <- repository nodes
 *     entity/       <- entities derived from repository metadata
 */

import type { BAGraph, BANode, MethodSignature } from '@/core/engine/types/graph/index.graph';
import type { ScaffoldFile, ScaffoldGenerator } from '../../types';
import {
  packageToPath,
  primitiveToJava,
  sanitizeBasePackage,
  toCamelCase,
  toKebabCase,
  toPascalCase,
} from '../../utils';
import {
  buildApplicationClass,
  buildApplicationProperties,
  buildGitignore,
  buildPom,
  buildReadme,
} from './common';

const renderMethodSignature = (m: MethodSignature): string => {
  const params = m.parameters
    .map((p) => `${primitiveToJava(p.type)} ${toCamelCase(p.name) || 'arg'}`)
    .join(', ');
  const ret = primitiveToJava(m.returnType);
  const name = toCamelCase(m.name) || 'execute';
  return `${ret} ${name}(${params})`;
};

const buildEndpointFile = (
  basePackage: string,
  node: BANode,
): ScaffoldFile => {
  const pkg = `${basePackage}.controller`;
  const className = toPascalCase(
    node.metadata?.className ?? `${node.label}Controller`,
  );
  const path = `src/main/java/${packageToPath(pkg)}/${className}.java`;
  const httpMethod = node.metadata?.httpMethod ?? 'GET';
  const route = node.metadata?.path?.startsWith('/')
    ? node.metadata.path
    : `/${node.metadata?.path ?? toKebabCase(node.label)}`;
  const responseType = primitiveToJava(node.metadata?.response?.type);
  const annotation =
    httpMethod === 'GET'
      ? 'GetMapping'
      : httpMethod === 'POST'
        ? 'PostMapping'
        : httpMethod === 'PUT'
          ? 'PutMapping'
          : httpMethod === 'DELETE'
            ? 'DeleteMapping'
            : 'PatchMapping';

  const content = `package ${pkg};

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${route}")
public class ${className} {

    @${annotation}
    public ${responseType === 'void' ? 'void' : responseType} handle() {
        // TODO: implement endpoint logic
        ${responseType === 'void' ? '' : 'return null;'}
    }
}
`;
  return { path, content };
};

const buildServiceFile = (
  basePackage: string,
  node: BANode,
): ScaffoldFile => {
  const pkg = `${basePackage}.service`;
  const className = toPascalCase(
    node.metadata?.className ?? `${node.label}Service`,
  );
  const path = `src/main/java/${packageToPath(pkg)}/${className}.java`;
  const methods = node.metadata?.methods ?? [];
  const methodSrc = methods
    .map(
      (m) => `    public ${renderMethodSignature(m)} {
        // TODO: implement
        ${m.returnType === 'void' ? '' : `return ${defaultReturn(m.returnType)};`}
    }`,
    )
    .join('\n\n');

  const content = `package ${pkg};

import org.springframework.stereotype.Service;

@Service
public class ${className} {
${methodSrc ? '\n' + methodSrc + '\n' : ''}}
`;
  return { path, content };
};

const buildRepositoryFile = (
  basePackage: string,
  node: BANode,
): ScaffoldFile => {
  const pkg = `${basePackage}.repository`;
  const interfaceName = toPascalCase(
    node.metadata?.className ?? `${node.label}Repository`,
  );
  const entityName = toPascalCase(node.metadata?.entityType ?? node.label);
  const path = `src/main/java/${packageToPath(pkg)}/${interfaceName}.java`;
  const content = `package ${pkg};

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ${basePackage}.entity.${entityName};

@Repository
public interface ${interfaceName} extends JpaRepository<${entityName}, Long> {
}
`;
  return { path, content };
};

const buildEntityFile = (
  basePackage: string,
  entityName: string,
): ScaffoldFile => {
  const pkg = `${basePackage}.entity`;
  const className = toPascalCase(entityName);
  const path = `src/main/java/${packageToPath(pkg)}/${className}.java`;
  const content = `package ${pkg};

import jakarta.persistence.*;

@Entity
@Table(name = "${className.toLowerCase()}")
public class ${className} {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
`;
  return { path, content };
};

const defaultReturn = (t: string): string => {
  switch (t) {
    case 'string':
      return '""';
    case 'number':
      return '0L';
    case 'boolean':
      return 'false';
    default:
      return 'null';
  }
};

export const generateLayeredSpringBoot: ScaffoldGenerator = (config, graph: BAGraph) => {
  const basePackage = sanitizeBasePackage(config.basePackage);
  const rootDir = toKebabCase(config.projectName);
  const files: ScaffoldFile[] = [];

  files.push(buildPom(config, basePackage));
  files.push(buildApplicationProperties(config));
  files.push(buildApplicationClass(config, basePackage));
  files.push(buildReadme(config, 'Layered'));
  files.push(buildGitignore());

  // Track generated entities to avoid duplicates
  const entityNames = new Set<string>();

  for (const node of graph.nodes) {
    switch (node.type) {
      case 'endpoint':
        files.push(buildEndpointFile(basePackage, node));
        break;
      case 'service':
        files.push(buildServiceFile(basePackage, node));
        break;
      case 'repository': {
        files.push(buildRepositoryFile(basePackage, node));
        const entityName = toPascalCase(
          node.metadata?.entityType ?? node.label,
        );
        if (!entityNames.has(entityName)) {
          entityNames.add(entityName);
          files.push(buildEntityFile(basePackage, entityName));
        }
        break;
      }
      // database nodes are represented in application.properties only (basic MVP)
      default:
        break;
    }
  }

  return { rootDir, files };
};
