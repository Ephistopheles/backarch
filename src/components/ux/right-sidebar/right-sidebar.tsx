/**
 * Right Sidebar Component - Node Inspector
 *
 * Displays and allows editing of the selected node's properties.
 * Shows different fields based on the node type.
 * Changes trigger graph updates and validation.
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
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/app.store';
import { t } from '@/i18n/index.i18n';
import type { BANode, NodeType } from '@/core/engine/types/graph/index.graph';
import { getComponentDefinition } from '@/core/catalog/index.catalog';

const { Sider: RightSider } = Layout;
const { Title, Text } = Typography;

/**
 * Node type badge with icon
 */
const NodeTypeBadge = ({ type }: { type: NodeType }) => {
  const definition = getComponentDefinition(type);

  if (!definition) return null;

  return (
    <Space style={{ marginBottom: '16px' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          background: definition.bgColor,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={definition.icon}
          alt={type}
          preview={false}
          width={18}
          height={18}
          style={{ display: 'block' }}
        />
      </div>
      <Text strong style={{ textTransform: 'capitalize' }}>
        {t(definition.labelKey)}
      </Text>
    </Space>
  );
};

/**
 * Common node fields (label, description)
 */
interface CommonFieldsProps {
  node: BANode;
  onUpdate: (updates: Partial<Omit<BANode, 'id'>>) => void;
}

const CommonFields = ({ node, onUpdate }: CommonFieldsProps) => {
  return (
    <>
      <Form.Item label={t('rightsidebar.fields.name')} style={{ marginBottom: 12 }}>
        <Input
          value={node.label}
          onChange={(e) => onUpdate({ label: (e.target as HTMLInputElement).value })}
          placeholder={t('rightsidebar.fields.namePlaceholder')}
        />
      </Form.Item>

      <Form.Item label={t('rightsidebar.fields.description')} style={{ marginBottom: 12 }}>
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

      <Form.Item label={t('rightsidebar.fields.id')} style={{ marginBottom: 12 }}>
        <Text code copyable style={{ fontSize: '11px' }}>
          {node.id}
        </Text>
      </Form.Item>

      {node.layer && (
        <Form.Item label={t('rightsidebar.fields.layer')} style={{ marginBottom: 12 }}>
          <Tag color='blue'>{node.layer}</Tag>
        </Form.Item>
      )}
    </>
  );
};

/**
 * Endpoint-specific fields
 */
const EndpointFields = ({ node, onUpdate }: CommonFieldsProps) => {
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

  return (
    <>
      <Form.Item label={t('rightsidebar.fields.httpMethod')} style={{ marginBottom: 12 }}>
        <Select
          value={node.metadata?.httpMethod ?? 'GET'}
          onChange={(value) =>
            onUpdate({
              metadata: { ...node.metadata, httpMethod: value },
            })
          }
          style={{ width: '100%' }}
        >
          {httpMethods.map((method) => (
            <Select.Option key={method} value={method}>
              <Tag
                color={
                  method === 'GET'
                    ? 'green'
                    : method === 'POST'
                      ? 'blue'
                      : method === 'PUT'
                        ? 'orange'
                        : method === 'DELETE'
                          ? 'red'
                          : 'purple'
                }
              >
                {method}
              </Tag>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t('rightsidebar.fields.path')} style={{ marginBottom: 12 }}>
        <Input
          value={node.metadata?.path ?? ''}
          onChange={(e) =>
            onUpdate({
              metadata: { ...node.metadata, path: (e.target as HTMLInputElement).value },
            })
          }
          placeholder='/api/example'
          addonBefore='/'
        />
      </Form.Item>
    </>
  );
};

/**
 * Service-specific fields
 */
const ServiceFields = ({ node, onUpdate }: CommonFieldsProps) => {
  return (
    <Form.Item label={t('rightsidebar.fields.className')} style={{ marginBottom: 12 }}>
      <Input
        value={node.metadata?.className ?? ''}
        onChange={(e) =>
          onUpdate({
            metadata: { ...node.metadata, className: (e.target as HTMLInputElement).value },
          })
        }
        placeholder='UserService'
      />
    </Form.Item>
  );
};

/**
 * Repository-specific fields
 */
const RepositoryFields = ({ node, onUpdate }: CommonFieldsProps) => {
  return (
    <Form.Item label={t('rightsidebar.fields.entityType')} style={{ marginBottom: 12 }}>
      <Input
        value={node.metadata?.entityType ?? ''}
        onChange={(e) =>
          onUpdate({
            metadata: { ...node.metadata, entityType: (e.target as HTMLInputElement).value },
          })
        }
        placeholder='User'
      />
    </Form.Item>
  );
};

/**
 * Database-specific fields
 */
const DatabaseFields = ({ node, onUpdate }: CommonFieldsProps) => {
  const databaseTypes = ['postgresql', 'mysql', 'mongodb'] as const;

  return (
    <Form.Item label={t('rightsidebar.fields.databaseType')} style={{ marginBottom: 12 }}>
      <Select
        value={node.metadata?.databaseType ?? 'postgresql'}
        onChange={(value) =>
          onUpdate({
            metadata: { ...node.metadata, databaseType: value },
          })
        }
        style={{ width: '100%' }}
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
 * Type-specific fields based on node type
 */
const TypeSpecificFields = ({ node, onUpdate }: CommonFieldsProps) => {
  switch (node.type) {
    case 'endpoint':
      return <EndpointFields node={node} onUpdate={onUpdate} />;
    case 'service':
      return <ServiceFields node={node} onUpdate={onUpdate} />;
    case 'repository':
      return <RepositoryFields node={node} onUpdate={onUpdate} />;
    case 'database':
      return <DatabaseFields node={node} onUpdate={onUpdate} />;
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
        <Text type='secondary' style={{ fontSize: '13px' }}>
          {t('rightsidebar.helpText')}
        </Text>
      }
      style={{ marginTop: '60px' }}
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
    <div>
      <NodeTypeBadge type={node.type} />

      <Form layout='vertical' size='small'>
        <CommonFields node={node} onUpdate={handleUpdate} />

        <Divider style={{ margin: '16px 0' }} />

        <Title level={5} style={{ fontSize: '12px', marginBottom: '12px', color: '#666' }}>
          {t('rightsidebar.typeSpecificTitle')}
        </Title>

        <TypeSpecificFields node={node} onUpdate={handleUpdate} />
      </Form>

      <Divider style={{ margin: '16px 0' }} />

      <Button
        danger
        block
        icon={<DeleteOutlined />}
        onClick={handleDelete}
      >
        {t('rightsidebar.deleteNode')}
      </Button>
    </div>
  );
};

const RightSidebar = () => {
  useAppStore((s) => s.language);
  const selectedNode = useAppStore((s) => s.getSelectedNode());

  return (
    <RightSider
      width={280}
      style={{
        background: '#fff',
        borderLeft: '1px solid #e8e8e8',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          paddingBottom: '12px',
          borderBottom: '1px solid #e8e8e8',
          marginBottom: '16px',
        }}
      >
        <Title
          level={5}
          style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#999',
            letterSpacing: '0.5px',
          }}
        >
          {t('rightsidebar.title')}
        </Title>
      </div>

      {selectedNode ? (
        <NodeInspector node={selectedNode} />
      ) : (
        <EmptyInspector />
      )}
    </RightSider>
  );
};

export default RightSidebar;
