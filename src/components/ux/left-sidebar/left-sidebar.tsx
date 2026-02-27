import { Layout, Typography, Space, Card, Image } from 'antd';
import { useAppStore } from '@/store/app.store';
import { t, type TranslationKey } from '@/i18n/index.i18n';
import type { NodeType } from '@/core/engine/types/graph/index.graph';
import { COMPONENT_BLOCKS } from '@/core/components/index.components';

const { Sider: LeftSider } = Layout;
const { Title, Text } = Typography;

interface ComponentItemProps {
  type: NodeType;
  labelKey: TranslationKey;
  icon: React.ReactNode;
  bgColor: string;
}

const ComponentItem = ({ type, labelKey, icon, bgColor }: ComponentItemProps) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/backarch-node', type);
    event.dataTransfer.effectAllowed = 'move';
  };

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
      onDragStart={onDragStart}
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
          {t(labelKey)}
        </Text>
      </Space>
    </Card>
  );
};

const LeftSidebar = () => {
  useAppStore((s) => s.language);

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
          {t('leftsidebar.title')}
        </Title>
      </div>
      <div>
        {COMPONENT_BLOCKS.map((component) => (
          <ComponentItem
            key={component.type}
            type={component.type}
            labelKey={component.labelKey}
            icon={
              <Image
                src={component.icon}
                alt={component.labelKey}
                preview={false}
                draggable={false}
              />
            }
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
          {t('leftsidebar.helpText')}
        </Text>
      </div>
    </LeftSider>
  );
};

export default LeftSidebar;
