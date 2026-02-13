/**
 * Application Store using Zustand
 * Central state management for BackArch
 */

import { create } from 'zustand';
import type { ArchGraph, ArchNode, ArchEdge, NodeType, Position } from '../core/graph/graph.types';
import type { ValidationResult } from '../core/rules';
import { createEmptyGraph, createNode, addNode, removeNode, addEdge, removeEdge, updateNodePosition } from '../core/graph/graph';
import { STACKS, ARCHITECTURES } from '../core/stacks';

interface AppState {
  // Configuration
  selectedStack: string;
  selectedVersion: string;
  selectedArchitecture: string;
  
  // Graph state
  graph: ArchGraph;
  selectedNodeId: string | null;
  
  // Validations
  validations: ValidationResult[];
  
  // Actions - Configuration
  setStack: (stackId: string) => void;
  setVersion: (version: string) => void;
  setArchitecture: (archId: string) => void;
  
  // Actions - Graph manipulation
  addNode: (type: NodeType, position?: Position) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (source: string, target: string) => void;
  removeEdge: (edgeId: string) => void;
  updateNodePosition: (nodeId: string, position: Position) => void;
  selectNode: (nodeId: string | null) => void;
  
  // Actions - Sync with React Flow
  setNodes: (nodes: ArchNode[]) => void;
  setEdges: (edges: ArchEdge[]) => void;
  
  // Actions - Validations
  setValidations: (validations: ValidationResult[]) => void;
  clearValidations: () => void;
}

const defaultStack = STACKS[0];
const defaultArchitecture = ARCHITECTURES[0];

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedStack: defaultStack.id,
  selectedVersion: defaultStack.versions[0],
  selectedArchitecture: defaultArchitecture.id,
  graph: createEmptyGraph(),
  selectedNodeId: null,
  validations: [],

  // Configuration actions
  setStack: (stackId) => {
    const stack = STACKS.find((s) => s.id === stackId);
    if (stack) {
      set({
        selectedStack: stackId,
        selectedVersion: stack.versions[0],
      });
    }
  },

  setVersion: (version) => set({ selectedVersion: version }),

  setArchitecture: (archId) => set({ selectedArchitecture: archId }),

  // Graph manipulation actions
  addNode: (type, position = { x: 200, y: 200 }) => {
    const node = createNode(type, `New ${type}`, position);
    set((state) => ({
      graph: addNode(state.graph, node),
      selectedNodeId: node.id,
    }));
  },

  removeNode: (nodeId) => {
    set((state) => ({
      graph: removeNode(state.graph, nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  addEdge: (source, target) => {
    const edge: ArchEdge = {
      id: `edge-${source}-${target}`,
      source,
      target,
    };
    set((state) => ({
      graph: addEdge(state.graph, edge),
    }));
  },

  removeEdge: (edgeId) => {
    set((state) => ({
      graph: removeEdge(state.graph, edgeId),
    }));
  },

  updateNodePosition: (nodeId, position) => {
    set((state) => ({
      graph: updateNodePosition(state.graph, nodeId, position),
    }));
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  // Sync with React Flow
  setNodes: (nodes) => {
    set((state) => ({
      graph: { ...state.graph, nodes },
    }));
  },

  setEdges: (edges) => {
    set((state) => ({
      graph: { ...state.graph, edges },
    }));
  },

  // Validation actions
  setValidations: (validations) => set({ validations }),
  clearValidations: () => set({ validations: [] }),
}));

// Selector hooks for common use cases
export const useGraph = () => useAppStore((s) => s.graph);
export const useSelectedNodeId = () => useAppStore((s) => s.selectedNodeId);
export const useValidations = () => useAppStore((s) => s.validations);
export const useConfiguration = () =>
  useAppStore((s) => ({
    stack: s.selectedStack,
    version: s.selectedVersion,
    architecture: s.selectedArchitecture,
  }));
