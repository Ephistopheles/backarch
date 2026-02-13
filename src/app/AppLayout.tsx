/**
 * Main Application Layout
 * Orchestrates all panels and canvas
 */

import { ReactFlowProvider } from '@xyflow/react';
import { Header } from '../components/header';
import { ComponentSidebar } from '../components/sidebar';
import { Canvas } from '../canvas';
import { InspectorPanel } from '../panels';
import { ValidationPanel } from '../panels';

export function AppLayout() {
  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-white">
        {/* Top bar */}
        <Header />

        {/* Main workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Components */}
          <ComponentSidebar />

          {/* Center - Canvas + Validation */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* React Flow Canvas */}
            <Canvas />

            {/* Bottom validation panel */}
            <ValidationPanel />
          </main>

          {/* Right sidebar - Inspector */}
          <InspectorPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
