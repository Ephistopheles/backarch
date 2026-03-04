export { createEmptyGraph, addNode, addEdge, updateNode, removeNode, removeEdge } from './graph/index.graph';
export { canConnect } from './validators/index.validators';
export { validateGraph } from './validation/index.validation';
export { 
  getRulesByArchitecture, 
  isValidConnection, 
  getAllowedTargets 
} from './rules/index.rules';
export type {
  BAEdge,
  BAGraph,
  BANode,
  NodeType,
  NodeMetadata,
} from './types/graph/index.graph';
export type {
  ValidationItem,
  ValidationResult,
  ValidationSeverity,
} from './validation/index.validation';
export type {
  ConnectionRules,
  ArchitectureRules,
} from './rules/index.rules';
