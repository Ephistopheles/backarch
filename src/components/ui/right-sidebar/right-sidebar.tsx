import { Layout, Typography, Space, Descriptions, Tag, Empty } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/app.store';
import { t } from '@/i18n/index.i18n';

const { Sider: RightSider } = Layout;
const { Title, Text } = Typography;

const RightSidebar = () => {
  useAppStore((s) => s.language);

  // Mock data - in real app this would come from selected node
  const selectedNode = null; // Set to null to show empty state

  const mockNodeData = {
    type: 'endpoint',
    name: 'GetUserById',
    id: 'node-123',
    description: 'Retrieves user information by ID',
    method: 'GET',
    path: '/api/users/:id',
  };

  return (
    <RightSider
      width={280}
      style={{
        background: '#fff',
        borderLeft: '1px solid #e8e8e8',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          paddingBottom: '12px',
          borderBottom: '1px solid #e8e8e8',
          marginBottom: '16px',
        }}
      >
        <Title
          level={5}
          style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#999',
            letterSpacing: '0.5px',
          }}
        >
          {t('rightsidebar.title')}
        </Title>
      </div>

      {selectedNode ? (
        <div>
          {/* Node type badge */}
          <Space style={{ marginBottom: '16px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: '#e6f7ff',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              <ApiOutlined style={{ color: '#1890ff' }} />
            </div>
            <Text strong>Endpoint</Text>
          </Space>

          {/* Node details */}
          <Descriptions column={1} size='small' bordered>
            <Descriptions.Item
              label={
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  Name
                </Text>
              }
            >
              <Text>{mockNodeData.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  ID
                </Text>
              }
            >
              <Text code style={{ fontSize: '11px' }}>
                {mockNodeData.id}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  Description
                </Text>
              }
            >
              <Text style={{ fontSize: '13px' }}>
                {mockNodeData.description}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  Method
                </Text>
              }
            >
              <Tag color='green'>GET</Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  Path
                </Text>
              }
            >
              <Text code>{mockNodeData.path}</Text>
            </Descriptions.Item>
          </Descriptions>

          {/* Future editing notice */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: '#fafafa',
              borderRadius: '6px',
              border: '1px solid #e8e8e8',
            }}
          >
            <Text type='secondary' italic style={{ fontSize: '12px' }}>
              Editing capabilities coming soon...
            </Text>
          </div>
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type='secondary' style={{ fontSize: '13px' }}>
              {t('rightsidebar.helpText')}
            </Text>
          }
          style={{ marginTop: '60px' }}
        />
      )}
    </RightSider>
  );
};

export default RightSidebar;
