/**
 * Main Canvas Component
 * Wraps React Flow with necessary configuration
 * Business logic is delegated to the store
 */

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAppStore } from '../store/app.store';
import { nodeTypes } from './nodes';
import type { ArchNodeData } from '../core/graph/graph.types';

/** Converts store nodes to React Flow nodes */
function toFlowNodes(storeNodes: ReturnType<typeof useAppStore.getState>['graph']['nodes']): Node[] {
  return storeNodes.map((node) => ({
    id: node.id,
    type: 'archNode',
    position: node.position,
    data: node.data as unknown as Record<string, unknown>,
    selected: false,
  }));
}

/** Converts store edges to React Flow edges */
function toFlowEdges(storeEdges: ReturnType<typeof useAppStore.getState>['graph']['edges']): Edge[] {
  return storeEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
  }));
}

export function Canvas() {
  const graph = useAppStore((s) => s.graph);
  const selectNode = useAppStore((s) => s.selectNode);
  const storeAddEdge = useAppStore((s) => s.addEdge);
  const storeUpdateNodePosition = useAppStore((s) => s.updateNodePosition);

  // Convert store state to React Flow format
  const initialNodes = useMemo(() => toFlowNodes(graph.nodes), [graph.nodes]);
  const initialEdges = useMemo(() => toFlowEdges(graph.edges), [graph.edges]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        storeAddEdge(connection.source, connection.target);
        setEdges((eds) => addEdge({ ...connection, type: 'smoothstep' }, eds));
      }
    },
    [storeAddEdge, setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // Handle canvas click (deselect)
  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  // Handle node drag end - sync position to store
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      storeUpdateNodePosition(node.id, node.position);
    },
    [storeUpdateNodePosition]
  );

  // Handle drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/backarch-node');
      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      useAppStore.getState().addNode(type as ArchNodeData['type'], position);
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        className="bg-slate-50"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#cbd5e1"
        />
        <Controls className="bg-white! border-slate-200! shadow-sm!" />
        <MiniMap
          className="bg-white! border-slate-200!"
          nodeColor="#e2e8f0"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
