/**
 * BackArch Custom Node Component
 *
 * Custom node for React Flow that displays architectural components
 * with visual indicators for node type, layer, selection state,
 * and configured metadata (HTTP methods, class names, etc.).
 */

import { Handle, Position } from '@xyflow/react';
import { Typography, Image, Flex, Tag, Space } from 'antd';
import type { NodeType, NodeMetadata } from '@/core/engine/types/graph/index.graph';
import { getComponentDefinition } from '@/core/catalog/index.catalog';

const { Text } = Typography;

/**
 * Node data interface matching store definition
 */
interface BackArchNodeData extends Record<string, unknown> {
  label: string;
  nodeType: NodeType;
  layer?: string;
  metadata?: NodeMetadata;
}

/**
 * Custom node props
 */
interface BackArchNodeProps {
  data: BackArchNodeData;
  selected?: boolean;
}

/**
 * Get HTTP method tag color
 */
const getMethodColor = (method?: string) => {
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

/**
 * Render metadata information for HTTP endpoints
 */
const HttpMetadata = ({ metadata }: { metadata?: NodeMetadata }) => {
  if (!metadata?.httpMethod && !metadata?.path) return null;

  return (
    <Flex vertical className='ba-node__metadata' gap={2}>
      <Space size={4}>
        {metadata.httpMethod && (
          <Tag color={getMethodColor(metadata.httpMethod)} style={{ margin: 0, fontSize: '10px' }}>
            {metadata.httpMethod}
          </Tag>
        )}
        <Text className='ba-node__path' style={{ fontSize: '11px' }}>
          {metadata.path || '/'}
        </Text>
      </Space>
      {metadata.queryParams && metadata.queryParams.length > 0 && (
        <Text type='secondary' style={{ fontSize: '9px' }}>
          {metadata.queryParams.length} query param{metadata.queryParams.length > 1 ? 's' : ''}
        </Text>
      )}
    </Flex>
  );
};

/**
 * Render metadata information for structural components
 */
const StructuralMetadata = ({ metadata }: { metadata?: NodeMetadata }) => {
  const className = metadata?.className || metadata?.interfaceName;
  const methods = metadata?.methods || [];

  if (!className && methods.length === 0) return null;

  return (
    <Flex vertical className='ba-node__metadata' gap={2}>
      {className && (
        <Text code style={{ fontSize: '10px' }}>
          {className}
        </Text>
      )}
      {methods.length > 0 && (
        <Text type='secondary' style={{ fontSize: '9px' }}>
          {methods.length} method{methods.length > 1 ? 's' : ''}
        </Text>
      )}
    </Flex>
  );
};

/**
 * Render appropriate metadata based on node type
 */
const NodeMetadataDisplay = ({ nodeType, metadata }: { nodeType: NodeType; metadata?: NodeMetadata }) => {
  // HTTP paradigm nodes
  if (nodeType === 'endpoint' || (nodeType === 'driving-adapter' && metadata?.adapterType === 'http')) {
    return <HttpMetadata metadata={metadata} />;
  }

  // Structural paradigm nodes
  if (['service', 'repository', 'driving-port', 'driven-port', 'domain'].includes(nodeType)) {
    return <StructuralMetadata metadata={metadata} />;
  }

  // Database nodes
  if (nodeType === 'database' && metadata?.databaseType) {
    return (
      <div className='ba-node__metadata'>
        <Tag color='volcano' style={{ margin: 0, fontSize: '9px' }}>
          {metadata.databaseType}
        </Tag>
      </div>
    );
  }

  return null;
};

/**
 * Custom node component for BackArch
 */
function BackArchNode({ data, selected }: BackArchNodeProps) {
  const definition = getComponentDefinition(data.nodeType);

  if (!definition) return null;

  return (
    <Flex vertical className={`ba-node ${selected ? 'ba-node--selected' : ''}`}>
      {/* Input Handle - top */}
      <Handle type='target' position={Position.Top} className='ba-node__handle' />

      {/* Node content */}
      <Flex align='center' className='ba-node__content'>
        <Flex
          align='center'
          justify='center'
          className='ba-node__icon-wrapper'
          style={{ background: definition.bgColor }}
        >
          <Image
            src={definition.icon}
            alt={data.nodeType}
            preview={false}
            width={18}
            height={18}
          />
        </Flex>

        <Flex vertical className='ba-node__info'>
          <Text strong className='ba-node__label'>
            {data.label}
          </Text>
          <Text type='secondary' className='ba-node__type'>
            {data.nodeType}
          </Text>
        </Flex>
      </Flex>

      {/* Metadata display */}
      <NodeMetadataDisplay nodeType={data.nodeType} metadata={data.metadata} />

      {/* Output Handle - bottom */}
      <Handle type='source' position={Position.Bottom} className='ba-node__handle' />
    </Flex>
  );
}

export default BackArchNode;
