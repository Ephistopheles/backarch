/**
 * Spring Boot — Hexagonal architecture generator
 *
 * Folder layout:
 *   {basePackage}/
 *     domain/                        <- domain nodes
 *     application/port/in/           <- driving-port interfaces
 *     application/port/out/          <- driven-port interfaces
 *     infrastructure/adapter/in/     <- driving-adapter classes
 *     infrastructure/adapter/out/    <- driven-adapter classes
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

const buildDomainFile = (basePackage: string, node: BANode): ScaffoldFile => {
  const pkg = `${basePackage}.domain`;
  const className = toPascalCase(node.metadata?.className ?? node.label);
  const path = `src/main/java/${packageToPath(pkg)}/${className}.java`;
  const methods = node.metadata?.methods ?? [];
  const methodSrc = methods
    .map(
      (m) => `    public ${renderMethodSignature(m)} {
        // TODO: implement domain logic
        ${m.returnType === 'void' ? '' : `return ${defaultReturn(m.returnType)};`}
    }`,
    )
    .join('\n\n');
  const content = `package ${pkg};

public class ${className} {
${methodSrc ? '\n' + methodSrc + '\n' : ''}}
`;
  return { path, content };
};

const buildPortInterface = (
  basePackage: string,
  node: BANode,
  side: 'in' | 'out',
): ScaffoldFile => {
  const pkg = `${basePackage}.application.port.${side}`;
  const interfaceName = toPascalCase(
    node.metadata?.interfaceName ?? node.metadata?.className ?? node.label,
  );
  const path = `src/main/java/${packageToPath(pkg)}/${interfaceName}.java`;
  const methods = node.metadata?.methods ?? [];
  const methodSrc = methods
    .map((m) => `    ${renderMethodSignature(m)};`)
    .join('\n');
  const content = `package ${pkg};

public interface ${interfaceName} {
${methodSrc ? methodSrc + '\n' : ''}}
`;
  return { path, content };
};

const buildAdapterFile = (
  basePackage: string,
  node: BANode,
  side: 'in' | 'out',
): ScaffoldFile => {
  const pkg = `${basePackage}.infrastructure.adapter.${side}`;
  const className = toPascalCase(
    node.metadata?.className ?? `${node.label}Adapter`,
  );
  const path = `src/main/java/${packageToPath(pkg)}/${className}.java`;
  const adapterType = node.metadata?.adapterType ?? (side === 'in' ? 'http' : 'database');

  if (side === 'in' && adapterType === 'http') {
    const route = node.metadata?.path?.startsWith('/')
      ? node.metadata.path
      : `/${node.metadata?.path ?? toKebabCase(node.label)}`;
    const httpMethod = node.metadata?.httpMethod ?? 'GET';
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
    const responseType = primitiveToJava(node.metadata?.response?.type);
    return {
      path,
      content: `package ${pkg};

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${route}")
public class ${className} {

    @${annotation}
    public ${responseType === 'void' ? 'void' : responseType} handle() {
        // TODO: delegate to driving port
        ${responseType === 'void' ? '' : 'return null;'}
    }
}
`,
    };
  }

  // generic stereotype
  const annotation = side === 'in' ? '@org.springframework.stereotype.Component'
    : '@org.springframework.stereotype.Repository';
  return {
    path,
    content: `package ${pkg};

${annotation}
public class ${className} {
    // TODO: implement ${adapterType} adapter
}
`,
  };
};

export const generateHexagonalSpringBoot: ScaffoldGenerator = (config, graph: BAGraph) => {
  const basePackage = sanitizeBasePackage(config.basePackage);
  const rootDir = toKebabCase(config.projectName);
  const files: ScaffoldFile[] = [];

  files.push(buildPom(config, basePackage));
  files.push(buildApplicationProperties(config));
  files.push(buildApplicationClass(config, basePackage));
  files.push(buildReadme(config, 'Hexagonal'));
  files.push(buildGitignore());

  for (const node of graph.nodes) {
    switch (node.type) {
      case 'domain':
        files.push(buildDomainFile(basePackage, node));
        break;
      case 'driving-port':
        files.push(buildPortInterface(basePackage, node, 'in'));
        break;
      case 'driven-port':
        files.push(buildPortInterface(basePackage, node, 'out'));
        break;
      case 'driving-adapter':
        files.push(buildAdapterFile(basePackage, node, 'in'));
        break;
      case 'driven-adapter':
        files.push(buildAdapterFile(basePackage, node, 'out'));
        break;
      default:
        break;
    }
  }

  return { rootDir, files };
};
