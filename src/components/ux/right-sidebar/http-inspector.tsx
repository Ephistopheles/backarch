/**
 * HTTP Inspector Component
 *
 * Postman-like interface for configuring HTTP endpoints.
 * Supports HTTP methods, paths, query/path parameters, request body, and response.
 */

import { Form, Select, Input, Button, Space, Tag, Card, Typography, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { BANode, HttpParameter } from '@/core/engine/types/graph/index.graph';
import { t } from '@/i18n/index.i18n';
import { PrimitiveTypeSelect } from './primitive-type-select';

const { Title, Text } = Typography;

interface HttpInspectorProps {
  node: BANode;
  onUpdate: (updates: Partial<Omit<BANode, 'id'>>) => void;
}

/**
 * Generate unique ID for parameters
 */
const generateParamId = () => `param-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * HTTP Method selector with colored tags
 */
const HttpMethodSelector = ({
  value,
  onChange,
}: {
  value?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  onChange: (value: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') => void;
}) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'green';
      case 'POST':
        return 'blue';
      case 'PUT':
        return 'orange';
      case 'DELETE':
        return 'red';
      case 'PATCH':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <Select value={value || 'GET'} onChange={onChange} style={{ width: '100%' }}>
      {methods.map((method) => (
        <Select.Option key={method} value={method}>
          <Tag color={getMethodColor(method)}>{method}</Tag>
        </Select.Option>
      ))}
    </Select>
  );
};

/**
 * Parameter list editor (for query and path params)
 */
const ParameterListEditor = ({
  title,
  parameters,
  onChange,
}: {
  title: string;
  parameters: HttpParameter[];
  onChange: (params: HttpParameter[]) => void;
}) => {
  const addParameter = () => {
    const newParam: HttpParameter = {
      id: generateParamId(),
      name: '',
      type: 'string',
      required: true,
    };
    onChange([...parameters, newParam]);
  };

  const updateParameter = (id: string, updates: Partial<HttpParameter>) => {
    onChange(
      parameters.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeParameter = (id: string) => {
    onChange(parameters.filter((p) => p.id !== id));
  };

  return (
    <div className="ba-param-list">
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>{title}</Text>
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            onClick={addParameter}
          >
            {t('inspector.http.addParameter')}
          </Button>
        </div>

        {parameters.length === 0 && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {t('inspector.http.noParameters')}
          </Text>
        )}

        {parameters.map((param) => (
          <Card key={param.id} size="small" className="ba-param-card">
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Space style={{ width: '100%' }}>
                <Input
                  placeholder={t('inspector.http.parameterName')}
                  value={param.name}
                  onChange={(e) => updateParameter(param.id, { name: (e.target as HTMLInputElement).value })}
                  style={{ width: '120px' }}
                />
                <PrimitiveTypeSelect
                  value={param.type}
                  onChange={(type) => updateParameter(param.id, { type })}
                />
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeParameter(param.id)}
                />
              </Space>

              <Space>
                <Select
                  value={param.required ? 'required' : 'optional'}
                  onChange={(val) => updateParameter(param.id, { required: val === 'required' })}
                  size="small"
                  style={{ width: '100px' }}
                >
                  <Select.Option value="required">
                    <Tag color="red">{t('inspector.http.required')}</Tag>
                  </Select.Option>
                  <Select.Option value="optional">
                    <Tag>{t('inspector.http.optional')}</Tag>
                  </Select.Option>
                </Select>
              </Space>

              <Input.TextArea
                placeholder={t('inspector.http.parameterDescription')}
                value={param.description || ''}
                onChange={(e) => updateParameter(param.id, { description: (e.target as HTMLTextAreaElement).value })}
                rows={1}
                size="small"
              />
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  );
};

/**
 * Main HTTP Inspector component
 */
export const HttpInspector = ({ node, onUpdate }: HttpInspectorProps) => {
  const metadata = node.metadata || {};

  const updateMetadata = (updates: Partial<typeof metadata>) => {
    onUpdate({ metadata: { ...metadata, ...updates } });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <div>
        <Title level={5} style={{ margin: 0 }}>
          {t('inspector.http.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('inspector.http.description')}
        </Text>
      </div>

      {/* HTTP Method & Path */}
      <Form layout="vertical" size="small">
        <Form.Item label={t('inspector.http.httpMethod')}>
          <HttpMethodSelector
            value={metadata.httpMethod}
            onChange={(method) => updateMetadata({ httpMethod: method })}
          />
        </Form.Item>

        <Form.Item label={t('inspector.http.path')}>
          <Input
            value={metadata.path || ''}
            onChange={(e) => updateMetadata({ path: (e.target as HTMLInputElement).value })}
            placeholder="/users/{id}"
            addonBefore="/"
          />
        </Form.Item>
      </Form>

      <Divider style={{ margin: '8px 0' }} />

      {/* Query Parameters */}
      <ParameterListEditor
        title={t('inspector.http.queryParameters')}
        parameters={metadata.queryParams || []}
        onChange={(queryParams) => updateMetadata({ queryParams })}
      />

      <Divider style={{ margin: '8px 0' }} />

      {/* Path Parameters */}
      <ParameterListEditor
        title={t('inspector.http.pathParameters')}
        parameters={metadata.pathParams || []}
        onChange={(pathParams) => updateMetadata({ pathParams })}
      />

      <Divider style={{ margin: '8px 0' }} />

      {/* Request Body */}
      <div>
        <Text strong>{t('inspector.http.requestBody')}</Text>
        <Form layout="vertical" size="small" style={{ marginTop: '8px' }}>
          <Form.Item label={t('inspector.http.bodyType')}>
            <PrimitiveTypeSelect
              value={metadata.requestBody?.type}
              onChange={(type) => updateMetadata({ requestBody: { ...metadata.requestBody, type } })}
            />
          </Form.Item>
          <Form.Item label={t('inspector.http.bodyDescription')}>
            <Input.TextArea
              value={metadata.requestBody?.description || ''}
              onChange={(e) =>
                updateMetadata({
                  requestBody: { type: metadata.requestBody?.type || 'string', description: (e.target as HTMLTextAreaElement).value },
                })
              }
              rows={2}
              placeholder={t('inspector.http.bodyDescriptionPlaceholder')}
            />
          </Form.Item>
        </Form>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* Response */}
      <div>
        <Text strong>{t('inspector.http.response')}</Text>
        <Form layout="vertical" size="small" style={{ marginTop: '8px' }}>
          <Form.Item label={t('inspector.http.responseType')}>
            <PrimitiveTypeSelect
              value={metadata.response?.type}
              onChange={(type) => updateMetadata({ response: { ...metadata.response, type } })}
            />
          </Form.Item>
          <Form.Item label={t('inspector.http.responseDescription')}>
            <Input.TextArea
              value={metadata.response?.description || ''}
              onChange={(e) =>
                updateMetadata({
                  response: { type: metadata.response?.type || 'string', description: (e.target as HTMLTextAreaElement).value },
                })
              }
              rows={2}
              placeholder={t('inspector.http.responseDescriptionPlaceholder')}
            />
          </Form.Item>
        </Form>
      </div>
    </Space>
  );
};
