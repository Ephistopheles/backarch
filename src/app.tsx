/**
 * App Shell
 *
 * Root layout using Ant Design Layout components as the primary structure.
 * Layout > Layout.Header + Layout(Sider+Content+Sider) + Layout.Footer
 * On screens < lg the sidebars become Ant Design Drawers.
 */

import { useMemo } from 'preact/hooks';
import { ReactFlowProvider } from '@xyflow/react';
import { ConfigProvider, Layout, Grid } from 'antd';

import GlobalTheme from '@/config/theme/global/global-theme';
import Header from '@/components/ux/header/header';
import LeftSidebar from '@/components/ux/left-sidebar/left-sidebar';
import RightSidebar from '@/components/ux/right-sidebar/right-sidebar';
import Canvas from '@/components/ux/canvas/canvas';
import Footer from '@/components/ux/footer/footer';

import '@/styles/app/app.css';

const { useBreakpoint } = Grid;

export default function App() {
  const screens = useBreakpoint();
  const isDesktop = !!screens.lg;

  // Stable style objects — avoid inline object recreation
  const bodyLayoutStyle = useMemo(() => ({ flex: 1, minHeight: 0, overflow: 'hidden' as const }), []);
  const contentStyle = useMemo(() => ({ overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, minWidth: 0 }), []);

  return (
    <ConfigProvider theme={GlobalTheme}>
      <Layout className='ba-app'>
        <Layout.Header className='ba-header-wrapper'>
          <Header isDesktop={isDesktop} />
        </Layout.Header>

        <Layout style={bodyLayoutStyle} hasSider>
          <LeftSidebar isDesktop={isDesktop} />

          <Layout.Content style={contentStyle}>
            <ReactFlowProvider>
              <Canvas />
            </ReactFlowProvider>
          </Layout.Content>

          <RightSidebar isDesktop={isDesktop} />
        </Layout>

        <Layout.Footer className='ba-footer-wrapper'>
          <Footer />
        </Layout.Footer>
      </Layout>
    </ConfigProvider>
  );
}
