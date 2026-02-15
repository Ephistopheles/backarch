import { Layout, Typography, Space, Card, Image } from 'antd';
import EndPoint from '@/assets/icons/endpoint.svg';
import Service from '@/assets/icons/service.svg';
import Repository from '@/assets/icons/repository.svg';
import Database from '@/assets/icons/database.svg'; 

const { Sider: LeftSider } = Layout;
const { Title, Text } = Typography;

interface ComponentItemProps {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
}

const ComponentItem = ({ icon, label, bgColor }: ComponentItemProps) => {
  return (
    <Card
      size='small'
      hoverable
      style={{
        cursor: 'grab',
        marginBottom: '8px',
        borderRadius: '8px',
      }}
      draggable
    >
      <Space size='middle'>
        <div
          style={{
            width: '32px',
            height: '32px',
            background: bgColor,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          {icon}
        </div>
        <Text strong style={{ fontSize: '14px' }}>
          {label}
        </Text>
      </Space>
    </Card>
  );
};

const components = [
  {
    icon: EndPoint,
    label: 'Endpoint',
    bgColor: '#c6e8feff',
  },
  {
    icon: Service,
    label: 'Service',
    bgColor: '#cbfed8ff',
  },
  {
    icon: Repository,
    label: 'Repository',
    bgColor: '#d7afffff',
  },
  {
    icon: Database,
    label: 'Database',
    bgColor: '#ff9c9cff',
  },
];

const LeftSidebar = () => {
  return (
    <LeftSider
      width={240}
      style={{
        background: '#fafafa',
        borderRight: '1px solid #e8e8e8',
        padding: '16px 12px',
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
          Components
        </Title>
      </div>
      <div>
        {components.map((component, index) => (
          <ComponentItem
            key={index}
            icon={<Image src={component.icon} alt={component.label} preview={false} draggable={false} />}
            label={component.label}
            bgColor={component.bgColor}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          borderTop: '1px solid #e8e8e8',
        }}
      >
        <Text
          type='secondary'
          style={{ fontSize: '12px', textAlign: 'center', display: 'block' }}
        >
          Drag components to the canvas to design your backend architecture.
        </Text>
      </div>
    </LeftSider>
  );
};

export default LeftSidebar;
