/**
 * Primitive Type Select Component
 *
 * Shared component for selecting primitive types across inspectors.
 */

import { Select } from 'antd';
import type { PrimitiveType } from '@/core/engine/types/graph/index.graph';

interface PrimitiveTypeSelectProps {
  value?: PrimitiveType;
  onChange: (value: PrimitiveType) => void;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

export const PrimitiveTypeSelect = ({
  value,
  onChange,
  size = 'middle',
  style,
}: PrimitiveTypeSelectProps) => {
  const types: PrimitiveType[] = ['string', 'number', 'boolean', 'void'];

  return (
    <Select
      value={value || 'string'}
      onChange={onChange}
      size={size}
      style={{ width: '100%', ...style }}
    >
      {types.map((type) => (
        <Select.Option key={type} value={type}>
          {type}
        </Select.Option>
      ))}
    </Select>
  );
};
