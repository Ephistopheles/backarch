/**
 * Canvas — React Flow graph editor
 *
 * Always fills the center column. Protected from sidebar overflow by
 * the parent flex layout (min-width: 0 on center column).
 */

import { useCallback, useRef } from 'preact/hooks';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import { Typography, Flex, Empty } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

import { useAppStore } from '@/store/app.store';
import { t } from '@/i18n/index.i18n';
import BackArchNode from './backarch-node';

import '@xyflow/react/dist/style.css';
import '@/styles/canvas/canvas.css';

const { Text } = Typography;

const nodeTypes = { backarchNode: BackArchNode };

/* ------------------------------------------------------------------ */
/*  Empty-state overlay                                               */
/* ------------------------------------------------------------------ */

const EmptyCanvasOverlay = () => {
  const selectedStack = useAppStore((s) => s.selectedStack);
  const selectedVersion = useAppStore((s) => s.selectedVersion);
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);
  const nodeCount = useAppStore((s) => s.nodes.length);

  const configComplete = !!(selectedStack && selectedVersion && selectedArchitecture);

  if (configComplete && nodeCount > 0) return null;

  return (
    <div className='ba-canvas__overlay'>
      <Empty
        image={<AppstoreAddOutlined style={{ fontSize: 48, color: 'var(--ba-color-text-secondary)' }} />}
        description={
          <Flex vertical align='center' gap={4}>
            <Text strong className='ba-canvas__empty-title'>
              {configComplete
                ? t('canvas.emptyTitle')
                : t('canvas.configureFirst')}
            </Text>
            <Text type='secondary' className='ba-canvas__empty-hint'>
              {configComplete
                ? t('canvas.emptyHint')
                : t('canvas.configureHint')}
            </Text>
          </Flex>
        }
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Canvas                                                       */
/* ------------------------------------------------------------------ */

export default function Canvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  // ---- Store ----
  const nodes = useAppStore((s) => s.nodes);
  const edges = useAppStore((s) => s.edges);
  const addGraphNode = useAppStore((s) => s.addGraphNode);
  const connectGraphNodes = useAppStore((s) => s.connectGraphNodes);
  const disconnectGraphNodes = useAppStore((s) => s.disconnectGraphNodes);
  const updateNodePositions = useAppStore((s) => s.updateNodePositions);
  const selectNode = useAppStore((s) => s.selectNode);
  const selectedStack = useAppStore((s) => s.selectedStack);
  const selectedVersion = useAppStore((s) => s.selectedVersion);
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);

  const configComplete = !!(selectedStack && selectedVersion && selectedArchitecture);

  // ---- React Flow change handlers ----
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const positionChanges = changes
        .filter(
          (c): c is NodeChange & { type: 'position'; id: string; position: { x: number; y: number } } =>
            c.type === 'position' && 'position' in c && !!c.position
        )
        .map((c) => ({ id: c.id, position: c.position }));

      if (positionChanges.length) updateNodePositions(positionChanges);

      // Handle selection
      const selectionChange = changes.find((c) => c.type === 'select') as
        | (NodeChange & { type: 'select'; id: string; selected: boolean })
        | undefined;
      if (selectionChange) {
        selectNode(selectionChange.selected ? selectionChange.id : null);
      }

      // Handle removals
      const removals = changes.filter((c) => c.type === 'remove');
      removals.forEach((r) => {
        if ('id' in r) {
          const store = useAppStore.getState();
          store.removeGraphNode(r.id as string);
        }
      });
    },
    [updateNodePositions, selectNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((c) => {
        if (c.type === 'remove' && 'id' in c) {
          disconnectGraphNodes(c.id as string);
        }
      });
    },
    [disconnectGraphNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        connectGraphNodes(connection);
      }
    },
    [connectGraphNodes]
  );

  // ---- Drag & Drop ----
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (!configComplete || !e.dataTransfer) return;

      const nodeType = e.dataTransfer.getData('application/backarch-node');
      if (!nodeType) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addGraphNode(nodeType as any, position);
    },
    [addGraphNode, configComplete, screenToFlowPosition]
  );

  const onPaneClick = useCallback(() => selectNode(null), [selectNode]);

  return (
    <div className='ba-canvas' ref={wrapperRef}>
      <EmptyCanvasOverlay />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor='var(--ba-color-primary-light)'
          maskColor='rgba(245, 247, 250, 0.7)'
          style={{ borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}
