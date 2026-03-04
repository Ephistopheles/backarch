/**
 * Left Sidebar Component
 *
 * Displays the component catalog based on the selected architecture.
 * Components can be dragged onto the canvas to create nodes.
 * The catalog dynamically updates when the architecture changes.
 */

import { Layout, Typography, Space, Card, Image, Empty } from 'antd';
import { useAppStore } from '@/store/app.store';
import { t, type TranslationKey } from '@/i18n/index.i18n';
import type { NodeType } from '@/core/engine/types/graph/index.graph';
import { getCatalogByArchitecture, type CatalogComponent } from '@/core/catalog/index.catalog';

const { Sider: LeftSider } = Layout;
const { Title, Text } = Typography;

interface ComponentItemProps {
  type: NodeType;
  labelKey: TranslationKey;
  icon: string;
  bgColor: string;
  disabled?: boolean;
}

/**
 * Individual draggable component item
 */
const ComponentItem = ({
  type,
  labelKey,
  icon,
  bgColor,
  disabled = false,
}: ComponentItemProps) => {
  const onDragStart = (event: DragEvent) => {
    if (disabled || !event.dataTransfer) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData('application/backarch-node', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card
      size='small'
      hoverable={!disabled}
      style={{
        cursor: disabled ? 'not-allowed' : 'grab',
        marginBottom: '8px',
        borderRadius: '8px',
        opacity: disabled ? 0.5 : 1,
      }}
      draggable={!disabled}
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
          <Image
            src={icon}
            alt={String(labelKey)}
            preview={false}
            draggable={false}
            width={20}
            height={20}
          />
        </div>
        <Text strong style={{ fontSize: '14px' }}>
          {t(labelKey)}
        </Text>
      </Space>
    </Card>
  );
};

/**
 * Empty state when no architecture is selected
 */
const EmptyCatalog = () => {
  // Subscribe to language for reactivity
  useAppStore((s) => s.language);

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Text type='secondary' style={{ fontSize: '13px' }}>
          {t('leftsidebar.selectArchitecture')}
        </Text>
      }
      style={{ marginTop: '60px' }}
    />
  );
};

/**
 * Component catalog list
 */
const CatalogList = ({ components }: { components: CatalogComponent[] }) => {
  return (
    <div>
      {components.map((component) => (
        <ComponentItem
          key={component.type}
          type={component.type}
          labelKey={component.labelKey}
          icon={component.icon}
          bgColor={component.bgColor}
        />
      ))}
    </div>
  );
};

const LeftSidebar = () => {
  // Subscribe to language and architecture for reactivity
  useAppStore((s) => s.language);
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);
  const isConfigComplete = useAppStore((s) => s.isConfigurationComplete());

  // Get catalog components based on selected architecture
  const catalogComponents = getCatalogByArchitecture(selectedArchitecture);
  const hasCatalog = catalogComponents.length > 0 && isConfigComplete;

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

      {hasCatalog ? (
        <CatalogList components={catalogComponents} />
      ) : (
        <EmptyCatalog />
      )}

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
          {hasCatalog ? t('leftsidebar.helpText') : t('leftsidebar.configHelpText')}
        </Text>
      </div>
    </LeftSider>
  );
};

export default LeftSidebar;
