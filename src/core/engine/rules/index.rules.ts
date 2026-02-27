import type { NodeType } from '../types/graph/index.graph';

export type ConnectionRules = {
  [k in NodeType]: NodeType[];
};

export const connectionRules: ConnectionRules = {
  endpoint: ['service'],
  service: ['repository'],
  repository: ['database'],
  database: [],
};
