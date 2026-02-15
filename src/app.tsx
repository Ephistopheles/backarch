import { Layout, Typography } from 'antd';
import { ConfigProvider } from 'antd';
import Header from '@/components/ui/header/header';
import LeftSidebar from '@/components/ui/left-sidebar/left-sidebar';
import RightSidebar from '@/components/ui/right-sidebar/right-sidebar';
import Footer from '@/components/ui/footer/footer';
import GlobalTheme from './config/theme/global/global-theme';
import 'antd/dist/reset.css';

const { Text } = Typography;

export function App() {
  return (
    <ConfigProvider theme={GlobalTheme}>
      <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Header />
        <Layout style={{ flex: 1, overflow: 'hidden' }}>
          <LeftSidebar />
          <Layout.Content style={{ 
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{ 
              textAlign: 'center',
              padding: '40px',
              background: '#fff',
              borderRadius: '8px',
              border: '2px dashed #d9d9d9'
            }}>
              <Text type='secondary' style={{ fontSize: '16px' }}>
                Main Canvas Area
              </Text>
              <br />
              <Text type='secondary' style={{ fontSize: '13px' }}>
                (React Flow canvas will go here)
              </Text>
            </div>
          </Layout.Content>
          <RightSidebar />
        </Layout>
        <Footer />
      </Layout>
    </ConfigProvider>
  );
}
