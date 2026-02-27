import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAppStore } from '@/store/app.store';

const Canvas = () => {
  
  const nodes = useAppStore((s) => s.nodes);
  const edges = useAppStore((s) => s.edges);
  const addGraphNode = useAppStore((s) => s.addGraphNode);
  const connectGraphNodes = useAppStore((s) => s.connectGraphNodes);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();

  const type = event.dataTransfer.getData('application/backarch-node');
  if (!type) return;

  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  addGraphNode(type as any, position);
};

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={connectGraphNodes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color='#cbd5e1'
        />
        <Controls />
        <MiniMap nodeColor='#e2e8f0' maskColor='rgba(0, 0, 0, 0.1)' />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
