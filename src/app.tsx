import { Layout } from 'antd';
import { ConfigProvider } from 'antd';
import { ReactFlowProvider } from '@xyflow/react';
import Header from '@/components/ux/header/header';
import Canvas from '@/components/ux/canvas/canvas';
import LeftSidebar from '@/components/ux/left-sidebar/left-sidebar';
import RightSidebar from '@/components/ux/right-sidebar/right-sidebar';
import Footer from '@/components/ux/footer/footer';
import GlobalTheme from './config/theme/global/global-theme';
import 'antd/dist/reset.css';

export function App() {
  return (
    <ConfigProvider theme={GlobalTheme}>
      <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Header />
        <Layout style={{ flex: 1, overflow: 'hidden' }}>
          <LeftSidebar />
          <Layout.Content
            style={{
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <ReactFlowProvider>
                <Canvas />
              </ReactFlowProvider>
            </div>
          </Layout.Content>
          <RightSidebar />
        </Layout>
        <Footer />
      </Layout>
    </ConfigProvider>
  );
}
