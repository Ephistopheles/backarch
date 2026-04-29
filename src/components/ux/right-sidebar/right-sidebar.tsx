/**
 * Right Sidebar Component - Node Inspector
 *
 * Architecture-aware inspector that adapts to the selected node type.
 * Displays HTTP configuration (Postman-like) for endpoints and adapters,
 * or structural configuration (class/interface definitions) for services and repositories.
 */

import {
  Layout,
  Typography,
  Space,
  Empty,
  Input,
  Select,
  Form,
  Tag,
  Button,
  Divider,
  Image,
  Flex,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/app.store';
import { t } from '@/i18n/index.i18n';
import type { BANode, NodeType } from '@/core/engine/types/graph/index.graph';
import { getComponentDefinition } from '@/core/catalog/index.catalog';
import { HttpInspector } from './http-inspector';
import { StructuralInspector } from './structural-inspector';

const { Sider: RightSider } = Layout;
const { Title, Text } = Typography;

/**
 * Node type badge with icon
 */
const NodeTypeBadge = ({ type }: { type: NodeType }) => {
  const definition = getComponentDefinition(type);

  if (!definition) return null;

  return (
    <Space className='ba-node-badge'>
      <Flex
        align='center'
        justify='center'
        className='ba-node-badge__icon-wrapper'
        style={{ background: definition.bgColor }}
      >
        <Image
          src={definition.icon}
          alt={type}
          preview={false}
          width={18}
          height={18}
        />
      </Flex>
      <Text strong className='ba-node-badge__label'>
        {t(definition.labelKey)}
      </Text>
    </Space>
  );
};

/**
 * Common node fields (name, description, metadata)
 */
interface CommonFieldsProps {
  node: BANode;
  onUpdate: (updates: Partial<Omit<BANode, 'id'>>) => void;
}

const CommonFields = ({ node, onUpdate }: CommonFieldsProps) => (
  <>
    <Form.Item label={t('rightsidebar.fields.name')}>
      <Input
        value={node.label}
        onChange={(e) => onUpdate({ label: (e.target as HTMLInputElement).value })}
        placeholder={t('rightsidebar.fields.namePlaceholder')}
      />
    </Form.Item>

    <Form.Item label={t('rightsidebar.fields.description')}>
      <Input.TextArea
        value={node.metadata?.description ?? ''}
        onChange={(e) =>
          onUpdate({
            metadata: { ...node.metadata, description: (e.target as HTMLTextAreaElement).value },
          })
        }
        placeholder={t('rightsidebar.fields.descriptionPlaceholder')}
        rows={2}
      />
    </Form.Item>

    <Form.Item label={t('rightsidebar.fields.id')}>
      <Text code copyable className='ba-form-item__id'>
        {node.id}
      </Text>
    </Form.Item>

    {node.layer && (
      <Form.Item label={t('rightsidebar.fields.layer')}>
        <Tag color='blue'>{node.layer}</Tag>
      </Form.Item>
    )}
  </>
);

/**
 * Determine which inspector paradigm to use for a node type
 */
const getInspectorType = (node: BANode): 'http' | 'structural' | 'database' | 'simple' => {
  // HTTP paradigm: endpoints and HTTP adapters
  if (node.type === 'endpoint') return 'http';
  if (node.type === 'driving-adapter' && node.metadata?.adapterType === 'http') return 'http';

  // Structural paradigm: services, repositories, ports, domain
  if (
    ['service', 'repository', 'driving-port', 'driven-port', 'domain'].includes(node.type)
  ) {
    return 'structural';
  }

  // Database: simple configuration
  if (node.type === 'database') return 'database';

  // Other adapters: simple configuration
  return 'simple';
};

/**
 * Database-specific fields
 */
const DatabaseFields = ({ node, onUpdate }: CommonFieldsProps) => {
  const databaseTypes = ['postgresql', 'mysql', 'mongodb'] as const;

  return (
    <Form.Item label={t('rightsidebar.fields.databaseType')}>
      <Select
        value={node.metadata?.databaseType ?? 'postgresql'}
        onChange={(value) =>
          onUpdate({
            metadata: { ...node.metadata, databaseType: value },
          })
        }
      >
        {databaseTypes.map((dbType) => (
          <Select.Option key={dbType} value={dbType}>
            {dbType.charAt(0).toUpperCase() + dbType.slice(1)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

/**
 * Simple adapter fields (for non-HTTP adapters)
 */
const AdapterFields = ({ node, onUpdate }: CommonFieldsProps) => {
  const adapterTypes = ['grpc', 'cli', 'event', 'database', 'external-api', 'message-queue'] as const;

  return (
    <Form.Item label={t('rightsidebar.fields.adapterType')}>
      <Select
        value={node.metadata?.adapterType ?? 'database'}
        onChange={(value) =>
          onUpdate({
            metadata: { ...node.metadata, adapterType: value },
          })
        }
      >
        {adapterTypes.map((type) => (
          <Select.Option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

/**
 * Type-specific inspector based on node type
 */
const TypeSpecificInspector = ({ node, onUpdate }: CommonFieldsProps) => {
  const inspectorType = getInspectorType(node);

  switch (inspectorType) {
    case 'http':
      return <HttpInspector node={node} onUpdate={onUpdate} />;
    case 'structural':
      return <StructuralInspector node={node} onUpdate={onUpdate} />;
    case 'database':
      return <DatabaseFields node={node} onUpdate={onUpdate} />;
    case 'simple':
      return node.type === 'driven-adapter' ? <AdapterFields node={node} onUpdate={onUpdate} /> : null;
    default:
      return null;
  }
};

/**
 * Empty state when no node is selected
 */
const EmptyInspector = () => {
  useAppStore((s) => s.language);

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Text type='secondary' className='ba-empty-inspector__text'>
          {t('rightsidebar.helpText')}
        </Text>
      }
      className='ba-empty-inspector'
    />
  );
};

/**
 * Node inspector panel
 */
const NodeInspector = ({ node }: { node: BANode }) => {
  const updateGraphNode = useAppStore((s) => s.updateGraphNode);
  const removeGraphNode = useAppStore((s) => s.removeGraphNode);
  const selectNode = useAppStore((s) => s.selectNode);
  useAppStore((s) => s.language);

  const handleUpdate = (updates: Partial<Omit<BANode, 'id'>>) => {
    updateGraphNode(node.id, updates);
  };

  const handleDelete = () => {
    removeGraphNode(node.id);
    selectNode(null);
  };

  return (
    <Flex vertical>
      <NodeTypeBadge type={node.type} />

      <Form layout='vertical' size='small'>
        <CommonFields node={node} onUpdate={handleUpdate} />
      </Form>

      <Divider />

      {/* Type-specific inspector (HTTP or Structural) */}
      <TypeSpecificInspector node={node} onUpdate={handleUpdate} />

      <Divider />

      <Button
        danger
        block
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        className='ba-delete-btn'
      >
        {t('rightsidebar.deleteNode')}
      </Button>
    </Flex>
  );
};

const RightSidebar = () => {
  useAppStore((s) => s.language);
  const selectedNode = useAppStore((s) => s.getSelectedNode());

  return (
    <RightSider width={280} className='ba-right-sidebar'>
      <Flex vertical className='ba-right-sidebar__header'>
        <Title level={5} className='ba-right-sidebar__title'>
          {t('rightsidebar.title')}
        </Title>
      </Flex>

      {selectedNode ? <NodeInspector node={selectedNode} /> : <EmptyInspector />}
    </RightSider>
  );
};

export default RightSidebar;
