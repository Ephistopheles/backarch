/**
 * Inspector Panel
 * Shows details and configuration for the selected node
 */

import { useAppStore } from '../store/app.store';
import { COMPONENT_BLOCKS } from '../types';

export function InspectorPanel() {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const graph = useAppStore((s) => s.graph);

  const selectedNode = selectedNodeId
    ? graph.nodes.find((n) => n.id === selectedNodeId)
    : null;

  const block = selectedNode
    ? COMPONENT_BLOCKS.find((b) => b.type === selectedNode.data.type)
    : null;

  return (
    <aside className="w-70 bg-white border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Inspector
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedNode ? (
          <div className="space-y-4">
            {/* Node type badge */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded flex items-center justify-center ${block?.color.bg}`}
              >
                <img src={block?.icon} alt={block?.label} className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {block?.label}
              </span>
            </div>

            {/* Node info */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Name
                </label>
                <div className="text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                  {selectedNode.data.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  ID
                </label>
                <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200 truncate">
                  {selectedNode.id}
                </div>
              </div>

              {selectedNode.data.description && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Description
                  </label>
                  <div className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                    {selectedNode.data.description}
                  </div>
                </div>
              )}

              {/* Type-specific fields */}
              {selectedNode.data.type === 'endpoint' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Method
                    </label>
                    <div className="text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                      {selectedNode.data.method}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Path
                    </label>
                    <div className="text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200 font-mono">
                      {selectedNode.data.path}
                    </div>
                  </div>
                </>
              )}

              {selectedNode.data.type === 'database' && selectedNode.data.engine && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Engine
                  </label>
                  <div className="text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                    {selectedNode.data.engine}
                  </div>
                </div>
              )}
            </div>

            {/* Placeholder for future editing */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 italic">
                Editing capabilities coming soon...
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-400 text-center">
              Select a node to<br />view its properties
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
