/**
 * Left Sidebar — Component Catalog
 *
 * Desktop: Ant Design Layout.Sider.
 * Mobile / Tablet: Ant Design Drawer.
 * Content uses Flex, Space, Card for structure.
 */

import { useCallback, useMemo } from 'preact/hooks';
import { Layout, Drawer, Card, Typography, Image, Flex, Space, Empty } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

import { useAppStore } from '@/store/app.store';
import { getCatalogByArchitecture, type CatalogComponent } from '@/core/catalog/index.catalog';
import { t } from '@/i18n/index.i18n';

import '@/styles/left-sidebar/left-sidebar.css';

const { Text } = Typography;
const { Sider } = Layout;

interface LeftSidebarProps {
  isDesktop: boolean;
}

/* ------------------------------------------------------------------ */
/*  Draggable component card                                          */
/* ------------------------------------------------------------------ */

const ComponentItem = ({
  component,
  disabled,
}: {
  component: CatalogComponent;
  disabled: boolean;
}) => {
  const handleDragStart = useCallback(
    (e: DragEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      e.dataTransfer?.setData('application/backarch-node', component.type);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    },
    [component.type, disabled]
  );

  const iconStyle = useMemo(() => ({ background: component.bgColor }), [component.bgColor]);

  return (
    <Card
      size='small'
      className={`ba-component-item ${disabled ? 'ba-component-item--disabled' : 'ba-component-item--draggable'}`}
      draggable={!disabled}
      onDragStart={handleDragStart as any}
      hoverable={!disabled}
    >
      <Space size={10}>
        <Flex
          align='center'
          justify='center'
          className='ba-component-item__icon-wrapper'
          style={iconStyle}
        >
          <Image src={component.icon} alt={component.type} preview={false} width={16} height={16} />
        </Flex>
        <Text className='ba-component-item__label'>{t(component.labelKey)}</Text>
      </Space>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/*  Sidebar inner content (shared between Sider & Drawer)             */
/* ------------------------------------------------------------------ */

const SidebarContent = () => {
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);
  const selectedStack = useAppStore((s) => s.selectedStack);
  const selectedVersion = useAppStore((s) => s.selectedVersion);

  const configComplete = !!(selectedStack && selectedVersion && selectedArchitecture);

  const components: CatalogComponent[] = useMemo(
    () => (selectedArchitecture ? getCatalogByArchitecture(selectedArchitecture) : []),
    [selectedArchitecture]
  );

  return (
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Flex align='center' gap={6} className='ba-left-sidebar__header'>
        <AppstoreOutlined style={{ fontSize: 13, color: 'var(--ba-color-text-secondary)' }} />
        <Text className='ba-left-sidebar__title'>{t('leftsidebar.title')}</Text>
      </Flex>

      {/* Body — scrollable */}
      <Flex vertical className='ba-left-sidebar__body ba-scrollable' style={{ flex: 1, overflowY: 'auto' }}>
        {components.length === 0 ? (
          <Empty
            className='ba-empty-catalog'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type='secondary' className='ba-empty-catalog__text'>
                {t('leftsidebar.emptyMessage')}
              </Text>
            }
          />
        ) : (
          components.map((comp) => (
            <ComponentItem key={comp.type} component={comp} disabled={!configComplete} />
          ))
        )}
      </Flex>

      {/* Footer hint */}
      {configComplete && components.length > 0 && (
        <Flex justify='center' className='ba-left-sidebar__footer'>
          <Text type='secondary' className='ba-left-sidebar__help-text'>
            {t('leftsidebar.dragHint')}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

/* ------------------------------------------------------------------ */
/*  Exported wrapper                                                  */
/* ------------------------------------------------------------------ */

const SIDER_STYLE = { overflow: 'hidden' };
const DRAWER_BODY_STYLE = { body: { padding: 0 } };

export default function LeftSidebar({ isDesktop }: LeftSidebarProps) {
  const open = useAppStore((s) => s.leftDrawerOpen);
  const setOpen = useAppStore((s) => s.setLeftDrawerOpen);

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  if (isDesktop) {
    return (
      <Sider width={240} theme='light' className='ba-left-sider' style={SIDER_STYLE}>
        <SidebarContent />
      </Sider>
    );
  }

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      placement='left'
      width={260}
      styles={DRAWER_BODY_STYLE}
      destroyOnClose={false}
    >
      <SidebarContent />
    </Drawer>
  );
}
