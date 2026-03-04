/**
 * BackArch Custom Node Component
 *
 * Custom node for React Flow that displays architectural components
 * with visual indicators for node type, layer, and selection state.
 */

import { Handle, Position } from '@xyflow/react';
import { Typography, Image } from 'antd';
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
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: '#fff',
        border: selected ? '2px solid #1890ff' : '1px solid #e8e8e8',
        boxShadow: selected
          ? '0 4px 12px rgba(24, 144, 255, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: '140px',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Input Handle - top */}
      <Handle
        type='target'
        position={Position.Top}
        style={{
          background: '#1890ff',
          width: '10px',
          height: '10px',
          border: '2px solid #fff',
        }}
      />

      {/* Node content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            background: definition.bgColor,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Image
            src={definition.icon}
            alt={data.nodeType}
            preview={false}
            width={18}
            height={18}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <Text
            strong
            style={{
              display: 'block',
              fontSize: '13px',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.label}
          </Text>
          <Text
            type='secondary'
            style={{
              display: 'block',
              fontSize: '11px',
              textTransform: 'capitalize',
            }}
          >
            {data.nodeType}
          </Text>
        </div>
      </div>

      {/* Metadata indicators */}
      {data.metadata?.httpMethod && (
        <div
          style={{
            marginTop: '8px',
            padding: '2px 6px',
            background: '#f0f0f0',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#666',
          }}
        >
          {data.metadata.httpMethod} {data.metadata.path || '/'}
        </div>
      )}

      {/* Output Handle - bottom */}
      <Handle
        type='source'
        position={Position.Bottom}
        style={{
          background: '#1890ff',
          width: '10px',
          height: '10px',
          border: '2px solid #fff',
        }}
      />
    </div>
  );
}

export default BackArchNode;
