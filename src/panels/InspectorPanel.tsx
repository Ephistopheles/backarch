/**
 * Inspector Panel
 * Shows details and configuration for the selected node
 */

import { useAppStore } from '../store/app.store';
import { COMPONENT_BLOCKS, getComponentLabel } from '../types';
import { t } from '../i18n';

export function InspectorPanel() {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const graph = useAppStore((s) => s.graph);
  // Force re-render on language change
  useAppStore((s) => s.language);

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
          {t("inspector.title")}
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
                <img src={block?.icon} alt={block ? getComponentLabel(block.type) : ''} className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {block ? getComponentLabel(block.type) : ''}
              </span>
            </div>

            {/* Node info */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t("inspector.name")}
                </label>
                <div className="text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                  {selectedNode.data.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t("inspector.id")}
                </label>
                <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200 truncate">
                  {selectedNode.id}
                </div>
              </div>

              {selectedNode.data.description && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {t("inspector.description")}
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
                      {t("inspector.method")}
                    </label>
                    <div className="text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                      {selectedNode.data.method}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      {t("inspector.path")}
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
                    {t("inspector.engine")}
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
                {t("inspector.editingComingSoon")}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-400 text-center whitespace-pre-line">
              {t("inspector.selectNode")}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
