/**
 * Footer Component - Validation & Feedback Engine
 *
 * Displays real-time architectural validation results.
 * Shows errors, warnings, and info messages from the validation engine.
 * Clicking on an issue highlights the affected nodes on the canvas.
 */

import { Layout, Row, Col, Badge, List, Tag, Typography, Space, Empty, Image, Flex } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/app.store';
import { t } from '@/i18n/index.i18n';
import type { ValidationSeverity, ValidationItem } from '@/core/engine/validation/index.validation';
import type { TranslationKey } from '@/i18n/index.i18n';
import SearchIcon from '@/assets/icons/search.svg';
import ErrorIcon from '@/assets/icons/error.svg';
import WarningIcon from '@/assets/icons/warning.svg';
import InfoIcon from '@/assets/icons/info.svg';

const { Footer: AntdFooter } = Layout;
const { Text, Title } = Typography;

/**
 * Get icon for severity level
 */
const getSeverityIcon = (severity: ValidationSeverity) => {
  const icons: Record<ValidationSeverity, string> = {
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon,
  };
  return <Image src={icons[severity]} alt={severity} preview={false} width={18} height={18} />;
};

/**
 * Get tag for severity level
 */
const getSeverityTag = (severity: ValidationSeverity) => {
  const colors: Record<ValidationSeverity, string> = {
    error: 'error',
    warning: 'warning',
    info: 'processing',
  };
  return <Tag color={colors[severity]}>{severity.toUpperCase()}</Tag>;
};

/**
 * Map node types to their i18n keys
 */
const NODE_TYPE_KEYS: Record<string, TranslationKey> = {
  'endpoint': 'leftsidebar.componentTypes.endpoint',
  'service': 'leftsidebar.componentTypes.service',
  'repository': 'leftsidebar.componentTypes.repository',
  'database': 'leftsidebar.componentTypes.database',
  'driving-adapter': 'leftsidebar.componentTypes.drivingAdapter',
  'driving-port': 'leftsidebar.componentTypes.drivingPort',
  'domain': 'leftsidebar.componentTypes.domain',
  'driven-port': 'leftsidebar.componentTypes.drivenPort',
  'driven-adapter': 'leftsidebar.componentTypes.drivenAdapter',
};

/**
 * Translate a node type to the current language
 */
const translateNodeType = (nodeType: string): string => {
  const key = NODE_TYPE_KEYS[nodeType];
  return key ? t(key) : nodeType;
};

/**
 * Translate a target description (e.g., "service or repository")
 */
const translateTargetDescription = (description: string): string => {
  // Split by " or " and translate each part
  const parts = description.split(' or ');
  const translatedParts = parts.map((part) => translateNodeType(part.trim()));
  return translatedParts.join(` ${t('validation.or')} `);
};

/**
 * Get translated message for validation item
 */
const getTranslatedMessage = (item: ValidationItem): string => {
  const translatedParams = item.messageParams
    ? Object.fromEntries(
        Object.entries(item.messageParams).map(([key, value]) => {
          if (key === 'nodeType' || key === 'sourceType' || key === 'targetType') {
            return [key, translateNodeType(String(value))];
          }
          if (key === 'targetDescription') {
            return [key, translateTargetDescription(String(value))];
          }
          return [key, value];
        })
      )
    : undefined;

  return t(item.messageKey as TranslationKey, translatedParams);
};

/**
 * Empty state when no validations
 */
const EmptyValidations = () => {
  useAppStore((s) => s.language);
  const nodes = useAppStore((s) => s.nodes);

  if (nodes.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Text type='secondary'>{t('footer.emptyCanvas')}</Text>
        }
      />
    );
  }

  return (
    <Flex vertical align='center' justify='center' className='ba-footer__success'>
      <CheckCircleOutlined className='ba-footer__success-icon' />
      <Text className='ba-footer__success-text'>{t('footer.allGood')}</Text>
    </Flex>
  );
};

/**
 * Validation item component
 */
interface ValidationItemRowProps {
  item: ValidationItem;
  onSelect: (nodeIds: string[]) => void;
}

const ValidationItemRow = ({ item, onSelect }: ValidationItemRowProps) => {
  const handleClick = () => {
    if (item.affectedNodeIds.length > 0) {
      onSelect(item.affectedNodeIds);
    }
  };

  const severityClass = `ba-validation-item--${item.severity}`;
  const clickableClass = item.affectedNodeIds.length > 0 ? 'ba-validation-item--clickable' : '';

  return (
    <List.Item
      onClick={handleClick}
      className={`ba-validation-item ${severityClass} ${clickableClass}`}
    >
      <Row justify='space-between' align='middle' style={{ width: '100%' }}>
        <Col>
          <Space size='middle'>
            {getSeverityIcon(item.severity)}
            <Text className='ba-validation-item__message'>{getTranslatedMessage(item)}</Text>
          </Space>
        </Col>
        <Col>{getSeverityTag(item.severity)}</Col>
      </Row>
    </List.Item>
  );
};

const Footer = () => {
  useAppStore((s) => s.language);
  const validationResult = useAppStore((s) => s.validationResult);
  const selectNode = useAppStore((s) => s.selectNode);

  const handleSelectAffectedNodes = (nodeIds: string[]) => {
    if (nodeIds.length > 0) {
      selectNode(nodeIds[0]);
    }
  };

  const totalIssues = validationResult.errorCount + validationResult.warningCount;

  return (
    <AntdFooter className='ba-footer'>
      {/* Header */}
      <Flex className='ba-footer__header'>
        <Row justify='space-between' align='middle' style={{ width: '100%' }}>
          <Col>
            <Space size='middle'>
              <Image src={SearchIcon} alt='Validation' preview={false} width={18} height={18} />
              <Title level={5} className='ba-footer__title'>
                {t('footer.title')}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space size='middle'>
              {validationResult.errorCount > 0 && (
                <Badge count={validationResult.errorCount} color='red'>
                  <Text className='ba-footer__badge-text'>{t('footer.errors')}</Text>
                </Badge>
              )}
              {validationResult.warningCount > 0 && (
                <Badge count={validationResult.warningCount} color='orange'>
                  <Text className='ba-footer__badge-text'>{t('footer.warnings')}</Text>
                </Badge>
              )}
              {validationResult.infoCount > 0 && (
                <Badge count={validationResult.infoCount} color='blue'>
                  <Text className='ba-footer__badge-text'>{t('footer.info')}</Text>
                </Badge>
              )}
              {totalIssues === 0 && validationResult.infoCount === 0 && (
                <Text type='secondary'>{t('footer.noIssues')}</Text>
              )}
            </Space>
          </Col>
        </Row>
      </Flex>

      {/* Validation list */}
      <Flex
        vertical
        className={`ba-footer__content ${validationResult.items.length === 0 ? 'ba-footer__content--empty' : ''}`}
      >
        {validationResult.items.length > 0 ? (
          <List
            size='small'
            dataSource={validationResult.items}
            renderItem={(item) => (
              <ValidationItemRow item={item} onSelect={handleSelectAffectedNodes} />
            )}
          />
        ) : (
          <EmptyValidations />
        )}
      </Flex>
    </AntdFooter>
  );
};

export default Footer;
