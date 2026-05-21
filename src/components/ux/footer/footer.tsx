/**
 * Footer — Validation & Feedback panel
 *
 * Shows validation items grouped by severity.
 * Uses Ant Design Flex, Space, Badge, Tag for layout.
 * Granular Zustand selectors to prevent unnecessary rerenders.
 */

import { useCallback } from 'preact/hooks';
import { Typography, Space, Badge, Flex, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import { useAppStore } from '@/store/app.store';
import { t } from '@/i18n/index.i18n';
import type { ValidationItem, ValidationSeverity } from '@/core/engine/validation/index.validation';

import '@/styles/footer/footer.css';

const { Text } = Typography;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const severityIcon: Record<ValidationSeverity, preact.JSX.Element> = {
  error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
  warning: <WarningOutlined style={{ color: '#faad14' }} />,
  info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
};

const getTranslatedMessage = (item: ValidationItem): string => {
  if (!item.messageKey) return item.message;

  const raw = t(item.messageKey as any);
  if (!item.messageParams) return raw;

  return Object.entries(item.messageParams).reduce(
    (msg, [key, value]) => msg.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value)),
    raw
  );
};

/* ------------------------------------------------------------------ */
/*  Validation row                                                    */
/* ------------------------------------------------------------------ */

const ValidationItemRow = ({ item }: { item: ValidationItem }) => {
  const selectNode = useAppStore((s) => s.selectNode);

  const handleClick = useCallback(() => {
    if (item.affectedNodeIds.length > 0) selectNode(item.affectedNodeIds[0]);
  }, [item.affectedNodeIds, selectNode]);

  const hasAffected = item.affectedNodeIds.length > 0;

  return (
    <Flex
      align='center'
      gap={8}
      className={`ba-validation-item ba-validation-item--${item.severity} ${hasAffected ? 'ba-validation-item--clickable' : ''}`}
      onClick={handleClick}
    >
      {severityIcon[item.severity]}
      <Text className='ba-validation-item__message'>{getTranslatedMessage(item)}</Text>
    </Flex>
  );
};

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const items = useAppStore((s) => s.validationResult.items);
  const errorCount = useAppStore((s) => s.validationResult.errorCount);
  const warningCount = useAppStore((s) => s.validationResult.warningCount);
  const infoCount = useAppStore((s) => s.validationResult.infoCount);
  const nodeCount = useAppStore((s) => s.nodes.length);

  const isEmpty = nodeCount === 0;
  const hasItems = items.length > 0;

  return (
    <Flex vertical className='ba-footer'>
      {/* Header row */}
      <Flex align='center' justify='space-between' wrap='wrap' gap={8} className='ba-footer__header'>
        <Text strong className='ba-footer__title' style={{ fontSize: 12 }}>
          {t('footer.title')}
        </Text>
        <Space size={12}>
          {errorCount > 0 && (
            <Space size={4}>
              <Badge status='error' />
              <Text className='ba-footer__badge-text' style={{ fontSize: 12 }}>
                {errorCount} {t('footer.errors')}
              </Text>
            </Space>
          )}
          {warningCount > 0 && (
            <Space size={4}>
              <Badge status='warning' />
              <Text className='ba-footer__badge-text' style={{ fontSize: 12 }}>
                {warningCount} {t('footer.warnings')}
              </Text>
            </Space>
          )}
          {infoCount > 0 && (
            <Space size={4}>
              <Badge status='processing' />
              <Text className='ba-footer__badge-text' style={{ fontSize: 12 }}>
                {infoCount} {t('footer.info')}
              </Text>
            </Space>
          )}
          {!hasItems && !isEmpty && (
            <Tag color='success' icon={<CheckCircleOutlined />}>
              {t('footer.allGood')}
            </Tag>
          )}
        </Space>
      </Flex>

      {/* Items or empty state */}
      <Flex
        vertical
        className={`ba-footer__content ba-scrollable ${!hasItems ? 'ba-footer__content--empty' : ''}`}
      >
        {isEmpty ? (
          <Text type='secondary' style={{ fontSize: 12 }}>
            {t('footer.emptyCanvas')}
          </Text>
        ) : hasItems ? (
          items.map((item) => <ValidationItemRow key={item.id} item={item} />)
        ) : (
          <Flex align='center' justify='center' gap={6} className='ba-footer__success'>
            <CheckCircleOutlined className='ba-footer__success-icon' />
            <Text className='ba-footer__success-text'>{t('footer.allGood')}</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
