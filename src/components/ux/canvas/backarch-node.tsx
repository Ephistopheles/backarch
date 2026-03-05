/**
 * BackArch Custom Node Component
 *
 * Custom node for React Flow that displays architectural components
 * with visual indicators for node type, layer, and selection state.
 */

import { Handle, Position } from '@xyflow/react';
import { Typography, Image, Flex } from 'antd';
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

      {/* Metadata indicators */}
      {data.metadata?.httpMethod && (
        <Text className='ba-node__metadata'>
          {data.metadata.httpMethod} {data.metadata.path || '/'}
        </Text>
      )}

      {/* Output Handle - bottom */}
      <Handle type='source' position={Position.Bottom} className='ba-node__handle' />
    </Flex>
  );
}

export default BackArchNode;
