/**
 * Structural Inspector Component
 *
 * Interface for configuring structural code definitions (classes, interfaces, methods).
 * Used for services, repositories, ports, and domain components.
 * Only allows method signatures - no implementations.
 */

import { Form, Input, Button, Space, Card, Typography, Divider, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type {
  BANode,
  MethodSignature,
  MethodParameter,
  PrimitiveType,
} from '@/core/engine/types/graph/index.graph';
import { t } from '@/i18n/index.i18n';
import { PrimitiveTypeSelect } from './primitive-type-select';

const { Title, Text } = Typography;

interface StructuralInspectorProps {
  node: BANode;
  onUpdate: (updates: Partial<Omit<BANode, 'id'>>) => void;
}

/**
 * Generate unique IDs
 */
const generateMethodId = () => `method-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateParamId = () => `param-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Method parameter editor
 */
const ParameterEditor = ({
  parameter,
  onUpdate,
  onRemove,
}: {
  parameter: MethodParameter;
  onUpdate: (updates: Partial<MethodParameter>) => void;
  onRemove: () => void;
}) => (
  <Space size="small" style={{ width: '100%' }}>
    <Input
      placeholder={t('inspector.structural.paramName')}
      value={parameter.name}
      onChange={(e) => onUpdate({ name: (e.target as HTMLInputElement).value })}
      style={{ width: '120px' }}
      size="small"
    />
    <Text type="secondary">:</Text>
    <div style={{ width: '100px' }}>
      <PrimitiveTypeSelect
        value={parameter.type}
        onChange={(type: PrimitiveType) => onUpdate({ type })}
        size="small"
      />
    </div>
    <Button danger size="small" icon={<DeleteOutlined />} onClick={onRemove} />
  </Space>
);

/**
 * Method signature editor
 */
const MethodEditor = ({
  method,
  onUpdate,
  onRemove,
}: {
  method: MethodSignature;
  onUpdate: (updates: Partial<MethodSignature>) => void;
  onRemove: () => void;
}) => {
  const addParameter = () => {
    const newParam: MethodParameter = {
      id: generateParamId(),
      name: '',
      type: 'string',
    };
    onUpdate({ parameters: [...method.parameters, newParam] });
  };

  const updateParameter = (paramId: string, updates: Partial<MethodParameter>) => {
    onUpdate({
      parameters: method.parameters.map((p) => (p.id === paramId ? { ...p, ...updates } : p)),
    });
  };

  const removeParameter = (paramId: string) => {
    onUpdate({
      parameters: method.parameters.filter((p) => p.id !== paramId),
    });
  };

  // Generate method signature preview
  const generateSignature = () => {
    const params = method.parameters.map((p) => `${p.name || '_'}: ${p.type}`).join(', ');
    return `${method.name || 'methodName'}(${params}): ${method.returnType}`;
  };

  return (
    <Card size="small" className="ba-method-card">
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* Method signature preview */}
        <Card size="small" style={{ background: '#f5f5f5' }}>
          <Text code style={{ fontSize: '12px' }}>
            {generateSignature()}
          </Text>
        </Card>

        {/* Method name */}
        <Form.Item label={t('inspector.structural.methodName')} style={{ marginBottom: '8px' }}>
          <Input
            value={method.name}
            onChange={(e) => onUpdate({ name: (e.target as HTMLInputElement).value })}
            placeholder="createUser"
            size="small"
          />
        </Form.Item>

        {/* Parameters section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Text strong style={{ fontSize: '12px' }}>
              {t('inspector.structural.parameters')}
            </Text>
            <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addParameter}>
              {t('inspector.structural.addParameter')}
            </Button>
          </div>

          {method.parameters.length === 0 && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {t('inspector.structural.noParameters')}
            </Text>
          )}

          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {method.parameters.map((param) => (
              <ParameterEditor
                key={param.id}
                parameter={param}
                onUpdate={(updates) => updateParameter(param.id, updates)}
                onRemove={() => removeParameter(param.id)}
              />
            ))}
          </Space>
        </div>

        {/* Return type */}
        <Form.Item label={t('inspector.structural.returnType')} style={{ marginBottom: '8px' }}>
          <PrimitiveTypeSelect
            value={method.returnType}
            onChange={(returnType: PrimitiveType) => onUpdate({ returnType })}
            size="small"
          />
        </Form.Item>

        {/* Description */}
        <Form.Item label={t('inspector.structural.methodDescription')} style={{ marginBottom: '8px' }}>
          <Input.TextArea
            value={method.description || ''}
            onChange={(e) => onUpdate({ description: (e.target as HTMLTextAreaElement).value })}
            placeholder={t('inspector.structural.methodDescriptionPlaceholder')}
            rows={2}
            size="small"
          />
        </Form.Item>

        {/* Delete button */}
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={onRemove}
          block
        >
          {t('inspector.structural.deleteMethod')}
        </Button>
      </Space>
    </Card>
  );
};

/**
 * Main Structural Inspector component
 */
export const StructuralInspector = ({ node, onUpdate }: StructuralInspectorProps) => {
  const metadata = node.metadata || {};
  const methods = metadata.methods || [];

  const updateMetadata = (updates: Partial<typeof metadata>) => {
    onUpdate({ metadata: { ...metadata, ...updates } });
  };

  const addMethod = () => {
    const newMethod: MethodSignature = {
      id: generateMethodId(),
      name: '',
      parameters: [],
      returnType: 'void',
    };
    updateMetadata({ methods: [...methods, newMethod] });
  };

  const updateMethod = (methodId: string, updates: Partial<MethodSignature>) => {
    updateMetadata({
      methods: methods.map((m) => (m.id === methodId ? { ...m, ...updates } : m)),
    });
  };

  const removeMethod = (methodId: string) => {
    updateMetadata({
      methods: methods.filter((m) => m.id !== methodId),
    });
  };

  // Determine if we should show class or interface name
  const isInterface = ['driving-port', 'driven-port'].includes(node.type);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <div>
        <Title level={5} style={{ margin: 0 }}>
          {t('inspector.structural.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('inspector.structural.description')}
        </Text>
      </div>

      {/* Class/Interface Name */}
      <Form layout="vertical" size="small">
        <Form.Item
          label={
            isInterface
              ? t('inspector.structural.interfaceName')
              : t('inspector.structural.className')
          }
        >
          <Input
            value={isInterface ? metadata.interfaceName : metadata.className}
            onChange={(e) =>
              updateMetadata(
                isInterface ? { interfaceName: (e.target as HTMLInputElement).value } : { className: (e.target as HTMLInputElement).value }
              )
            }
            placeholder={isInterface ? 'IUserService' : 'UserService'}
          />
        </Form.Item>
      </Form>

      <Divider style={{ margin: '8px 0' }} />

      {/* Methods Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Space>
            <Text strong>{t('inspector.structural.methods')}</Text>
            <Tag color="blue">{methods.length}</Tag>
          </Space>
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={addMethod}>
            {t('inspector.structural.addMethod')}
          </Button>
        </div>

        {methods.length === 0 && (
          <Card size="small" style={{ background: '#fafafa', textAlign: 'center' }}>
            <Text type="secondary">{t('inspector.structural.noMethods')}</Text>
          </Card>
        )}

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {methods.map((method) => (
            <MethodEditor
              key={method.id}
              method={method}
              onUpdate={(updates) => updateMethod(method.id, updates)}
              onRemove={() => removeMethod(method.id)}
            />
          ))}
        </Space>
      </div>

      {/* Note about implementations */}
      <Card size="small" style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '12px', color: '#0050b3' }}>
            💡 {t('inspector.structural.noteTitle')}
          </Text>
          <Text style={{ fontSize: '11px', color: '#0050b3' }}>
            {t('inspector.structural.noteDescription')}
          </Text>
        </Space>
      </Card>
    </Space>
  );
};
