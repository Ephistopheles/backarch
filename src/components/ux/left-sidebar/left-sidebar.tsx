/**
 * Left Sidebar Component
 *
 * Displays the component catalog based on the selected architecture.
 * Components can be dragged onto the canvas to create nodes.
 * The catalog dynamically updates when the architecture changes.
 */

import { Layout, Typography, Space, Card, Image, Empty, Flex } from 'antd';
import { useAppStore } from '@/store/app.store';
import { t, type TranslationKey } from '@/i18n/index.i18n';
import type { NodeType } from '@/core/engine/types/graph/index.graph';
import {
  getCatalogByArchitecture,
  type CatalogComponent,
} from '@/core/catalog/index.catalog';

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
      className={`ba-component-item ${disabled ? 'ba-component-item--disabled' : 'ba-component-item--draggable'}`}
      draggable={!disabled}
      onDragStart={onDragStart}
    >
      <Space size='middle'>
        <Flex
          align='center'
          justify='center'
          className='ba-component-item__icon-wrapper'
          style={{ background: bgColor }}
        >
          <Image
            src={icon}
            alt={String(labelKey)}
            preview={false}
            draggable={false}
            width={20}
            height={20}
          />
        </Flex>
        <Text strong className='ba-component-item__label'>
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
  useAppStore((s) => s.language);

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Text type='secondary' className='ba-empty-catalog__text'>
          {t('leftsidebar.selectConfiguration')}
        </Text>
      }
      className='ba-empty-catalog'
    />
  );
};

/**
 * Component catalog list
 */
const CatalogList = ({ components }: { components: CatalogComponent[] }) => (
  <Flex vertical>
    {components.map((component) => (
      <ComponentItem
        key={component.type}
        type={component.type}
        labelKey={component.labelKey}
        icon={component.icon}
        bgColor={component.bgColor}
      />
    ))}
  </Flex>
);

const LeftSidebar = () => {
  useAppStore((s) => s.language);
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);
  const isConfigComplete = useAppStore((s) => s.isConfigurationComplete());

  const catalogComponents = getCatalogByArchitecture(selectedArchitecture);
  const hasCatalog = catalogComponents.length > 0 && isConfigComplete;

  return (
    <LeftSider width={240} className='ba-left-sidebar'>
      <Flex vertical className='ba-left-sidebar__header'>
        <Title level={5} className='ba-left-sidebar__title'>
          {t('leftsidebar.title')}
        </Title>
      </Flex>

      {hasCatalog ? (
        <CatalogList components={catalogComponents} />
      ) : (
        <EmptyCatalog />
      )}

      <Flex vertical className='ba-left-sidebar__footer'>
        <Text type='secondary' className='ba-left-sidebar__help-text'>
          {hasCatalog ? t('leftsidebar.helpText') : ''}
        </Text>
      </Flex>
    </LeftSider>
  );
};

export default LeftSidebar;
