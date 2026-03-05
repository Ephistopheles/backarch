/**
 * Canvas Component - Graph Engine Core
 *
 * Visual representation of the internal graph engine.
 * Handles node rendering, edge connections, drag-and-drop,
 * and selection state.
 */

import { useCallback, useMemo } from 'preact/hooks';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAppStore, type FlowNodeData } from '@/store/app.store';
import type { NodeType } from '@/core/engine/types/graph/index.graph';
import BackArchNode from './backarch-node';
import { Typography, Empty, Flex } from 'antd';
import { t } from '@/i18n/index.i18n';

const { Text } = Typography;

/**
 * Custom node types registration
 */
const nodeTypes = {
  backarchNode: BackArchNode,
};

/**
 * Empty canvas overlay when no architecture is selected
 */
const EmptyCanvasOverlay = () => {
  useAppStore((s) => s.language);

  return (
    <Flex align='center' justify='center' className='ba-canvas__overlay'>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Flex vertical>
            <Text type='secondary' className='ba-canvas__empty-title'>
              {t('canvas.selectConfiguration')}
            </Text>
            <Text type='secondary' className='ba-canvas__empty-hint'>
              {t('canvas.configurationHint')}
            </Text>
          </Flex>
        }
      />
    </Flex>
  );
};

const Canvas = () => {
  const nodes = useAppStore((s) => s.nodes);
  const edges = useAppStore((s) => s.edges);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const addGraphNode = useAppStore((s) => s.addGraphNode);
  const connectGraphNodes = useAppStore((s) => s.connectGraphNodes);
  const disconnectGraphNodes = useAppStore((s) => s.disconnectGraphNodes);
  const selectNode = useAppStore((s) => s.selectNode);
  const removeGraphNode = useAppStore((s) => s.removeGraphNode);
  const isConfigComplete = useAppStore((s) => s.isConfigurationComplete());
  useAppStore((s) => s.language);

  const { screenToFlowPosition } = useReactFlow();

  /**
   * Update node selection state in the store
   */
  const nodesWithSelection = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
    }));
  }, [nodes, selectedNodeId]);

  /**
   * Handle node changes (position, selection, removal)
   */
  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const change of changes) {
        if (change.type === 'select') {
          if (change.selected) {
            selectNode(change.id);
          } else if (selectedNodeId === change.id) {
            selectNode(null);
          }
        }

        if (change.type === 'remove') {
          removeGraphNode(change.id);
        }
      }

      const hasPositionChanges = changes.some(
        (c) => c.type === 'position' && c.position
      );

      if (hasPositionChanges) {
        useAppStore.setState((state) => ({
          nodes: applyNodeChanges(changes, state.nodes) as Node<FlowNodeData>[],
        }));
      }
    },
    [selectedNodeId, selectNode, removeGraphNode]
  );

  /**
   * Handle edge changes (removal)
   */
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      for (const change of changes) {
        if (change.type === 'remove') {
          disconnectGraphNodes(change.id);
        }
      }

      useAppStore.setState((state) => ({
        edges: applyEdgeChanges(changes, state.edges),
      }));
    },
    [disconnectGraphNodes]
  );

  /**
   * Handle drag over for drop target indication
   */
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }, []);

  /**
   * Handle drop to create new nodes
   */
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!isConfigComplete || !event.dataTransfer) return;

      const type = event.dataTransfer.getData('application/backarch-node');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addGraphNode(type as NodeType, position);
    },
    [screenToFlowPosition, addGraphNode, isConfigComplete]
  );

  /**
   * Handle canvas click to deselect nodes
   */
  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <Flex className='ba-canvas'>
      {!isConfigComplete && <EmptyCanvasOverlay />}

      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={connectGraphNodes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        fitView
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={['Backspace', 'Delete']}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2, stroke: '#1890ff' },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color='#cbd5e1'
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as FlowNodeData;
            switch (data.nodeType) {
              case 'endpoint':
                return '#c6e8fe';
              case 'service':
                return '#cbfed8';
              case 'repository':
                return '#d7afff';
              case 'database':
                return '#ff9c9c';
              default:
                return '#e2e8f0';
            }
          }}
          maskColor='rgba(0, 0, 0, 0.1)'
        />
      </ReactFlow>
    </Flex>
  );
};

export default Canvas;
