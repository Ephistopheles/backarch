import { connectionRules } from '../rules/index.rules';
import type { NodeType } from '../types/graph/index.graph';

export const canConnect = (source: NodeType, target: NodeType): boolean => {
  return connectionRules[source].includes(target);
};
