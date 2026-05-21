/**
 * Right Sidebar — Node Inspector
 *
 * Desktop: Ant Design Layout.Sider.
 * Mobile / Tablet: Ant Design Drawer that opens on node selection.
 * Memoized sub-components, stable callbacks, granular Zustand selectors.
 */

import { useCallback, useMemo } from 'preact/hooks';
import {
  Layout,
  Drawer,
  Typography,
  Flex,
  Space,
  Image,
  Form,
  Input,
  Select,
  Button,
  Empty,
  Divider,
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { useAppStore } from '@/store/app.store';
import { getComponentDefinition } from '@/core/catalog/index.catalog';
import { t } from '@/i18n/index.i18n';
import type { BANode } from '@/core/engine/types/graph/index.graph';
import { HttpInspector } from './http-inspector';
import { StructuralInspector } from './structural-inspector';

import '@/styles/right-sidebar/right-sidebar.css';

const { Text } = Typography;
const { Sider } = Layout;

interface RightSidebarProps {
  isDesktop: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

type InspectorType = 'http' | 'structural' | 'database' | 'simple';

const getInspectorType = (node: BANode): InspectorType => {
  if (node.type === 'endpoint') return 'http';
  if (node.type === 'driving-adapter' && node.metadata?.adapterType === 'http') return 'http';
  if (['service', 'repository', 'driving-port', 'driven-port', 'domain'].includes(node.type)) return 'structural';
  if (node.type === 'database') return 'database';
  return 'simple';
};

/* ------------------------------------------------------------------ */
/*  Node type badge                                                   */
/* ------------------------------------------------------------------ */

const NodeTypeBadge = ({ node }: { node: BANode }) => {
  const definition = getComponentDefinition(node.type);
  if (!definition) return null;

  const iconStyle = useMemo(() => ({ background: definition.bgColor }), [definition.bgColor]);

  return (
    <Space size={10} className='ba-node-badge'>
      <Flex align='center' justify='center' className='ba-node-badge__icon-wrapper' style={iconStyle}>
        <Image src={definition.icon} alt={node.type} preview={false} width={18} height={18} />
      </Flex>
      <Flex vertical>
        <Text strong>{node.label}</Text>
        <Text type='secondary' className='ba-node-badge__label'>{node.type}</Text>
      </Flex>
    </Space>
  );
};

/* ------------------------------------------------------------------ */
/*  Common fields (label, adapter type for hex, etc.)                 */
/* ------------------------------------------------------------------ */

const CommonFields = ({
  node,
  onUpdate,
}: {
  node: BANode;
  onUpdate: (updates: Partial<Omit<BANode, 'id'>>) => void;
}) => {
  const handleLabelChange = useCallback(
    (e: any) => onUpdate({ label: (e.target as HTMLInputElement).value }),
    [onUpdate]
  );

  const handleDbTypeChange = useCallback(
    (val: string) => onUpdate({ metadata: { ...node.metadata, databaseType: val as any } }),
    [onUpdate, node.metadata]
  );

  const handleAdapterTypeChange = useCallback(
    (val: string) => onUpdate({ metadata: { ...node.metadata, adapterType: val as any } }),
    [onUpdate, node.metadata]
  );

  return (
    <Form layout='vertical' size='small'>
      <Form.Item label={t('inspector.label')}>
        <Input
          value={node.label}
          onChange={handleLabelChange}
        />
      </Form.Item>

      {node.type === 'database' && (
        <Form.Item label={t('inspector.database.type')}>
          <Select value={node.metadata?.databaseType || 'postgresql'} onChange={handleDbTypeChange}>
            <Select.Option value='postgresql'>PostgreSQL</Select.Option>
            <Select.Option value='mysql'>MySQL</Select.Option>
            <Select.Option value='mongodb'>MongoDB</Select.Option>
          </Select>
        </Form.Item>
      )}

      {(node.type === 'driving-adapter' || node.type === 'driven-adapter') && (
        <Form.Item label={t('inspector.adapter.type')}>
          <Select value={node.metadata?.adapterType || 'http'} onChange={handleAdapterTypeChange}>
            <Select.Option value='http'>HTTP</Select.Option>
            <Select.Option value='grpc'>gRPC</Select.Option>
            <Select.Option value='cli'>CLI</Select.Option>
            <Select.Option value='event'>Event</Select.Option>
            <Select.Option value='database'>Database</Select.Option>
            <Select.Option value='external-api'>External API</Select.Option>
            <Select.Option value='message-queue'>Message Queue</Select.Option>
          </Select>
        </Form.Item>
      )}

      <Form.Item label='ID'>
        <Text type='secondary' className='ba-form-item__id' copyable>{node.id}</Text>
      </Form.Item>
    </Form>
  );
};

/* ------------------------------------------------------------------ */
/*  Type-specific inspector dispatch                                  */
/* ------------------------------------------------------------------ */

const TypeSpecificInspector = ({
  node,
  onUpdate,
}: {
  node: BANode;
  onUpdate: (updates: Partial<Omit<BANode, 'id'>>) => void;
}) => {
  const type = getInspectorType(node);
  switch (type) {
    case 'http':
      return <HttpInspector node={node} onUpdate={onUpdate} />;
    case 'structural':
      return <StructuralInspector node={node} onUpdate={onUpdate} />;
    default:
      return null;
  }
};

/* ------------------------------------------------------------------ */
/*  Full inspector — granular Zustand selectors                       */
/* ------------------------------------------------------------------ */

const NodeInspector = () => {
  // Granular selectors: only subscribe to selectedNodeId and graph.nodes
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const graphNodes = useAppStore((s) => s.graph.nodes);
  const updateGraphNode = useAppStore((s) => s.updateGraphNode);
  const removeGraphNode = useAppStore((s) => s.removeGraphNode);
  const selectNode = useAppStore((s) => s.selectNode);

  // Derive selected node from stable references
  const selectedNode = useMemo(
    () => (selectedNodeId ? graphNodes.find((n) => n.id === selectedNodeId) ?? null : null),
    [selectedNodeId, graphNodes]
  );

  // Stable update callback — uses node id from closure, not full object
  const handleUpdate = useCallback(
    (updates: Partial<Omit<BANode, 'id'>>) => {
      if (selectedNodeId) updateGraphNode(selectedNodeId, updates);
    },
    [selectedNodeId, updateGraphNode]
  );

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      removeGraphNode(selectedNodeId);
      selectNode(null);
    }
  }, [selectedNodeId, removeGraphNode, selectNode]);

  if (!selectedNode) return <EmptyInspector />;

  return (
    <Flex vertical gap={0}>
      <NodeTypeBadge node={selectedNode} />
      <CommonFields node={selectedNode} onUpdate={handleUpdate} />
      <Divider style={{ margin: '12px 0' }} />
      <TypeSpecificInspector node={selectedNode} onUpdate={handleUpdate} />
      <Divider style={{ margin: '12px 0' }} />
      <Button danger block icon={<DeleteOutlined />} onClick={handleDelete} className='ba-delete-btn'>
        {t('inspector.delete')}
      </Button>
    </Flex>
  );
};

const EmptyInspector = () => (
  <Empty
    className='ba-empty-inspector'
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      <Text type='secondary' className='ba-empty-inspector__text'>
        {t('inspector.emptyMessage')}
      </Text>
    }
  />
);

/* ------------------------------------------------------------------ */
/*  Panel content wrapper                                             */
/* ------------------------------------------------------------------ */

const SidebarContent = () => (
  <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
    <Flex align='center' gap={6} className='ba-right-sidebar__header'>
      <EyeOutlined style={{ fontSize: 13, color: 'var(--ba-color-text-secondary)' }} />
      <Text className='ba-right-sidebar__title'>{t('inspector.title')}</Text>
    </Flex>
    <Flex vertical className='ba-right-sidebar__body ba-scrollable' style={{ flex: 1, overflowY: 'auto' }}>
      <NodeInspector />
    </Flex>
  </Flex>
);

/* ------------------------------------------------------------------ */
/*  Exported wrapper                                                  */
/* ------------------------------------------------------------------ */

const SIDER_STYLE = { overflow: 'hidden' };
const DRAWER_BODY_STYLE = { body: { padding: 0 } };

export default function RightSidebar({ isDesktop }: RightSidebarProps) {
  const open = useAppStore((s) => s.rightDrawerOpen);
  const setOpen = useAppStore((s) => s.setRightDrawerOpen);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);

  const drawerOpen = open || !!selectedNodeId;

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  if (isDesktop) {
    return (
      <Sider width={280} theme='light' className='ba-right-sider' style={SIDER_STYLE}>
        <SidebarContent />
      </Sider>
    );
  }

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      placement='right'
      width={300}
      styles={DRAWER_BODY_STYLE}
      destroyOnClose={false}
    >
      <SidebarContent />
    </Drawer>
  );
}
