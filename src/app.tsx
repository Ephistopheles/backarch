import { Layout, Flex } from 'antd';
import { ConfigProvider } from 'antd';
import { ReactFlowProvider } from '@xyflow/react';
import Header from '@/components/ux/header/header';
import Canvas from '@/components/ux/canvas/canvas';
import LeftSidebar from '@/components/ux/left-sidebar/left-sidebar';
import RightSidebar from '@/components/ux/right-sidebar/right-sidebar';
import Footer from '@/components/ux/footer/footer';
import GlobalTheme from './config/theme/global/global-theme';
import 'antd/dist/reset.css';
import '@/styles/index.css';

export function App() {
  return (
    <ConfigProvider theme={GlobalTheme}>
      <Layout className='ba-app'>
        <Header />
        <Layout className='ba-app__main'>
          <LeftSidebar />
          <Layout.Content>
            <Flex className='ba-app__canvas-wrapper'>
              <ReactFlowProvider>
                <Canvas />
              </ReactFlowProvider>
            </Flex>
          </Layout.Content>
          <RightSidebar />
        </Layout>
        <Footer />
      </Layout>
    </ConfigProvider>
  );
}
