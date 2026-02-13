/**
 * Custom node components for React Flow
 */

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ArchNodeData } from '../../core/graph/graph.types';
import { COMPONENT_BLOCKS } from '../../types';

/** Base architecture node component */
export const ArchitectureNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as ArchNodeData;
  const block = COMPONENT_BLOCKS.find((b) => b.type === nodeData.type);
  
  return (
    <div
      className={`
        bg-white border rounded-md p-4 w-50 shadow-sm
        ${selected ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200'}
        transition-all duration-150
      `}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3! h-3! bg-slate-400! border-2! border-white!"
      />
      
      {/* Node header */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-5 h-5 rounded flex items-center justify-center text-xs ${block?.color.bg} ${block?.color.text}`}
        >
          {block?.icon}
        </div>
        <span className="font-semibold text-sm text-slate-900 truncate">
          {nodeData.name}
        </span>
      </div>
      
      {/* Node content */}
      {nodeData.description && (
        <p className="text-xs text-slate-500 line-clamp-2">
          {nodeData.description}
        </p>
      )}
      
      {/* Type-specific info */}
      {nodeData.type === 'endpoint' && (
        <div className="mt-2 text-xs text-slate-400">
          {nodeData.method} {nodeData.path}
        </div>
      )}
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3! h-3! bg-slate-400! border-2! border-white!"
      />
    </div>
  );
});

ArchitectureNode.displayName = 'ArchitectureNode';
