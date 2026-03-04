/**
 * Application Store Module
 *
 * Central state management for BackArch using Zustand.
 * Manages configuration, graph state, validation, and UI state.
 */

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
  updateNode as engineUpdateNode,
  removeNode as engineRemoveNode,
  removeEdge as engineRemoveEdge,
  validateGraph,
  type BAGraph,
  type BANode,
  type BAEdge,
  type NodeType,
  type NodeMetadata,
  type ValidationResult,
} from '@/core/engine';
import { getNodeLayer } from '@/core/catalog/index.catalog';
import type { Node, Edge, Connection } from '@xyflow/react';

/**
 * Flow node data interface
 * Uses index signature for React Flow compatibility
 */
export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  nodeType: NodeType;
  layer?: string;
  metadata?: NodeMetadata;
}

interface AppState {
  // Configuration
  selectedStack: string | null;
  selectedVersion: string | null;
  selectedArchitecture: string | null;
  projectName: string;
  basePackage: string;

  // i18n
  language: Language;

  // Graph
  graph: BAGraph;
  nodes: Node<FlowNodeData>[];
  edges: Edge[];

  // UI State
  selectedNodeId: string | null;

  // Validation
  validationResult: ValidationResult;

  // Actions - configuration
  setStack: (stackId: string | null) => void;
  setVersion: (versionId: string | null) => void;
  setArchitecture: (architectureId: string | null) => void;
  setProjectName: (name: string) => void;
  setBasePackage: (pkg: string) => void;

  // Actions - i18n
  setLanguage: (lang: Language) => void;

  // Actions - graph
  initGraph: () => void;
  addGraphNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateGraphNode: (nodeId: string, updates: Partial<Omit<BANode, 'id'>>) => void;
  removeGraphNode: (nodeId: string) => void;
  connectGraphNodes: (connection: Connection) => void;
  disconnectGraphNodes: (edgeId: string) => void;
  updateNodePositions: (changes: { id: string; position: { x: number; y: number } }[]) => void;

  // Actions - UI
  selectNode: (nodeId: string | null) => void;

  // Selectors
  getSelectedNode: () => BANode | null;
  isConfigurationComplete: () => boolean;
}

/**
 * Run validation and return the result
 * @param graph - The graph to validate
 * @param architectureId - The selected architecture for context-aware validation
 */
const runValidation = (graph: BAGraph, architectureId: string | null): ValidationResult => {
  return validateGraph(graph, architectureId);
};

/**
 * Create a flow node from a BANode
 */
const createFlowNode = (
  node: BANode,
  position: { x: number; y: number }
): Node<FlowNodeData> => ({
  id: node.id,
  position,
  type: 'backarchNode',
  data: {
    label: node.label,
    nodeType: node.type,
    layer: node.layer,
    metadata: node.metadata,
  },
});

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state - configuration
  selectedStack: null,
  selectedVersion: null,
  selectedArchitecture: null,
  projectName: '',
  basePackage: '',

  // Initial state - i18n
  language: initI18n(),

  // Initial state - graph
  graph: createEmptyGraph(),
  nodes: [],
  edges: [],

  // Initial state - UI
  selectedNodeId: null,

  // Initial state - validation
  validationResult: {
    items: [],
    isValid: true,
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
  },

  // Actions - configuration
  setStack: (stackId: string | null) => {
    if (!stackId) {
      set({
        selectedStack: null,
        selectedVersion: null,
        selectedArchitecture: null,
        graph: createEmptyGraph(),
        nodes: [],
        edges: [],
        selectedNodeId: null,
        validationResult: {
          items: [],
          isValid: true,
          errorCount: 0,
          warningCount: 0,
          infoCount: 0,
        },
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
      set({
        selectedArchitecture: null,
        graph: createEmptyGraph(),
        nodes: [],
        edges: [],
        selectedNodeId: null,
        validationResult: {
          items: [],
          isValid: true,
          errorCount: 0,
          warningCount: 0,
          infoCount: 0,
        },
      });
      return;
    }
    const architecture = getArchitectureById(architectureId);
    if (architecture) {
      set({
        selectedArchitecture: architectureId,
        graph: createEmptyGraph(),
        nodes: [],
        edges: [],
        selectedNodeId: null,
        validationResult: {
          items: [],
          isValid: true,
          errorCount: 0,
          warningCount: 0,
          infoCount: 0,
        },
      });
    }
  },

  setProjectName: (name: string) => {
    set({ projectName: name });
  },

  setBasePackage: (pkg: string) => {
    set({ basePackage: pkg });
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
      selectedNodeId: null,
      validationResult: {
        items: [],
        isValid: true,
        errorCount: 0,
        warningCount: 0,
        infoCount: 0,
      },
    });
  },

  addGraphNode: (type, position) => {
    const state = get();

    // Get layer for this node type based on architecture
    const layer = getNodeLayer(state.selectedArchitecture, type) ?? undefined;

    // Create node with default label
    const labelCount = state.graph.nodes.filter((n) => n.type === type).length + 1;
    const defaultLabel = `${type.charAt(0).toUpperCase() + type.slice(1)} ${labelCount}`;

    const newNode: BANode = {
      id: crypto.randomUUID(),
      type,
      label: defaultLabel,
      layer,
      metadata: {},
    };

    const newGraph = engineAddNode(state.graph, newNode);
    const flowNode = createFlowNode(newNode, position);
    const validationResult = runValidation(newGraph, state.selectedArchitecture);

    set({
      graph: newGraph,
      nodes: [...state.nodes, flowNode],
      validationResult,
    });
  },

  updateGraphNode: (nodeId, updates) => {
    const state = get();
    const newGraph = engineUpdateNode(state.graph, nodeId, updates);

    if (newGraph === state.graph) return;

    // Update flow nodes
    const updatedNodes = state.nodes.map((node) => {
      if (node.id !== nodeId) return node;

      return {
        ...node,
        data: {
          ...node.data,
          label: updates.label ?? node.data.label,
          metadata: updates.metadata ?? node.data.metadata,
        },
      };
    });

    const validationResult = runValidation(newGraph, state.selectedArchitecture);

    set({
      graph: newGraph,
      nodes: updatedNodes,
      validationResult,
    });
  },

  removeGraphNode: (nodeId) => {
    const state = get();
    const newGraph = engineRemoveNode(state.graph, nodeId);

    // Remove flow node and connected edges
    const updatedNodes = state.nodes.filter((n) => n.id !== nodeId);
    const updatedEdges = state.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );

    const validationResult = runValidation(newGraph, state.selectedArchitecture);

    set({
      graph: newGraph,
      nodes: updatedNodes,
      edges: updatedEdges,
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      validationResult,
    });
  },

  connectGraphNodes: (connection) => {
    if (!connection.source || !connection.target) return;

    const state = get();

    const newEdge: BAEdge = {
      id: crypto.randomUUID(),
      source: connection.source,
      target: connection.target,
    };

    const newGraph = engineAddEdge(state.graph, newEdge, state.selectedArchitecture);

    // If graph didn't change, the connection was invalid
    if (newGraph === state.graph) {
      return;
    }

    const flowEdge: Edge = {
      id: newEdge.id,
      source: newEdge.source,
      target: newEdge.target,
      animated: true,
      style: { strokeWidth: 2 },
    };

    const validationResult = runValidation(newGraph, state.selectedArchitecture);

    set({
      graph: newGraph,
      edges: [...state.edges, flowEdge],
      validationResult,
    });
  },

  disconnectGraphNodes: (edgeId) => {
    const state = get();
    const newGraph = engineRemoveEdge(state.graph, edgeId);
    const updatedEdges = state.edges.filter((e) => e.id !== edgeId);
    const validationResult = runValidation(newGraph, state.selectedArchitecture);

    set({
      graph: newGraph,
      edges: updatedEdges,
      validationResult,
    });
  },

  updateNodePositions: (changes) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        const change = changes.find((c) => c.id === node.id);
        if (change) {
          return {
            ...node,
            position: change.position,
          };
        }
        return node;
      }),
    }));
  },

  // UI actions
  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  // Selectors
  getSelectedNode: () => {
    const state = get();
    if (!state.selectedNodeId) return null;
    return state.graph.nodes.find((n) => n.id === state.selectedNodeId) ?? null;
  },

  isConfigurationComplete: () => {
    const state = get();
    return !!(
      state.selectedStack &&
      state.selectedVersion &&
      state.selectedArchitecture
    );
  },
}));
