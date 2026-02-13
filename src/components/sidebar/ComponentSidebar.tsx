/**
 * Component Sidebar
 * Displays draggable component blocks
 */

import { COMPONENT_BLOCKS } from '../../types';
import type { NodeType } from '../../core/graph/graph.types';

interface ComponentItemProps {
  type: NodeType;
  label: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

function ComponentItem({ type, label, icon, bgColor, textColor }: ComponentItemProps) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/backarch-node', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="
        flex items-center gap-3 px-3 py-2.5
        bg-white border border-slate-200 rounded-md
        cursor-grab active:cursor-grabbing
        hover:border-slate-300 hover:shadow-sm
        transition-all duration-150
      "
    >
      <div
        className={`w-6 h-6 rounded flex items-center justify-center text-sm ${bgColor} ${textColor}`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
}

export function ComponentSidebar() {
  return (
    <aside className="w-[240px] bg-slate-50 border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Components
        </h2>
      </div>

      {/* Component list */}
      <div className="p-3 space-y-2 overflow-y-auto flex-1">
        {COMPONENT_BLOCKS.map((block) => (
          <ComponentItem
            key={block.type}
            type={block.type}
            label={block.label}
            icon={block.icon}
            bgColor={block.color.bg}
            textColor={block.color.text}
          />
        ))}
      </div>

      {/* Help text */}
      <div className="p-3 border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center">
          Drag components onto the canvas
        </p>
      </div>
    </aside>
  );
}
