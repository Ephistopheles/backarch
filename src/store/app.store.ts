import { create } from 'zustand';
import { initI18n, setI18nLanguage, type Language } from '@/i18n/index.i18n';
import {
  getArchitectureById,
  getStackById,
  getVersionsByStackId,
} from '@/core/stack/index.stack';
import {
  createEmptyGraph,
  addNode as engineAddNode,
  addEdge as engineAddEdge,
  type BAGraph,
  type BANode,
  type BAEdge,
  type NodeType,
} from '@/core/engine';
import type { Node, Edge, Connection } from '@xyflow/react';

interface AppState {
  // Configuration
  selectedStack: string | null;
  selectedVersion: string | null;
  selectedArchitecture: string | null;

  // i18n
  language: Language;

  // Graph
  graph: BAGraph;
  nodes: Node[];
  edges: Edge[];

  // Actions - configuration
  setStack: (stackId: string | null) => void;
  setVersion: (versionId: string | null) => void;
  setArchitecture: (architectureId: string | null) => void;

  // Actions - i18n
  setLanguage: (lang: Language) => void;

  // Actions - graph
  initGraph: () => void;
  addGraphNode: (type: NodeType, position: { x: number; y: number }) => void;
  connectGraphNodes: (connection: Connection) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state - configuration
  selectedStack: null,
  selectedVersion: null,
  selectedArchitecture: null,

  // Initial state
  language: initI18n(),

  // Initial state - graph
  graph: createEmptyGraph(),
  nodes: [],
  edges: [],

  // Actions - configuration
  setStack: (stackId: string | null) => {
    if (!stackId) {
      set({
        selectedStack: null,
        selectedVersion: null,
      });
      return;
    }
    const stack = getStackById(stackId);
    if (stack) {
      set({
        selectedStack: stackId,
        selectedVersion: null,
      });
    }
  },
  setVersion: (versionId: string | null) => {
    if (!versionId) {
      set({ selectedVersion: null });
      return;
    }
    set((state) => {
      if (!state.selectedStack) return state;
      const versions = getVersionsByStackId(state.selectedStack);
      const version = versions.find((v) => v.id === versionId);
      if (version) {
        return { selectedVersion: versionId };
      }
      return state;
    });
  },
  setArchitecture: (architectureId: string | null) => {
    if (!architectureId) {
      set({ selectedArchitecture: null });
      return;
    }
    const architecture = getArchitectureById(architectureId);
    if (architecture) {
      set({ selectedArchitecture: architectureId });
    }
  },

  // i18n actions
  setLanguage: (lang: Language) => {
    setI18nLanguage(lang);
    set({ language: lang });
  },

  // Graph actions
  initGraph: () => {
    set({
      graph: createEmptyGraph(),
      nodes: [],
      edges: [],
    });
  },
  addGraphNode: (type, position) => {
    set((state) => {
      const newNode: BANode = {
        id: crypto.randomUUID(),
        type,
        label: type,
      };

      const newGraph = engineAddNode(state.graph, newNode);

      const flowNode: Node = {
        id: newNode.id,
        position,
        data: { label: newNode.label },
        type: 'default',
      };

      return {
        graph: newGraph,
        nodes: [...state.nodes, flowNode],
      };
    });
  },
  connectGraphNodes: (connection) => {
    if (!connection.source || !connection.target) return;

    set((state) => {
      const newEdge: BAEdge = {
        id: crypto.randomUUID(),
        source: connection.source,
        target: connection.target,
      };

      const newGraph = engineAddEdge(state.graph, newEdge);

      // Si no cambió el graph, significa que fue inválido
      if (newGraph === state.graph) {
        return state;
      }

      const flowEdge: Edge = {
        id: newEdge.id,
        source: newEdge.source,
        target: newEdge.target,
      };

      return {
        graph: newGraph,
        edges: [...state.edges, flowEdge],
      };
    });
  },
}));
