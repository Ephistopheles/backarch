/**
 * Footer Component - Validation & Feedback Engine
 *
 * Displays real-time architectural validation results.
 * Shows errors, warnings, and info messages from the validation engine.
 * Clicking on an issue highlights the affected nodes on the canvas.
 */

import { Layout, Row, Col, Badge, List, Tag, Typography, Space, Empty, Image } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/app.store';
import { t } from '@/i18n/index.i18n';
import type { ValidationSeverity, ValidationItem } from '@/core/engine/validation/index.validation';
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
  switch (severity) {
    case 'error':
      return <Image src={ErrorIcon} alt='error' preview={false} width={18} height={18} />;
    case 'warning':
      return <Image src={WarningIcon} alt='warning' preview={false} width={18} height={18} />;
    case 'info':
      return <Image src={InfoIcon} alt='info' preview={false} width={18} height={18} />;
  }
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
 * Get background color for severity
 */
const getSeverityBackground = (severity: ValidationSeverity): string => {
  switch (severity) {
    case 'error':
      return '#fff1f0';
    case 'warning':
      return '#fffbe6';
    case 'info':
      return '#e6f7ff';
  }
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
          <Text type='secondary' style={{ fontSize: '13px' }}>
            {t('footer.emptyCanvas')}
          </Text>
        }
        style={{ margin: '20px 0' }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#52c41a',
      }}
    >
      <CheckCircleOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
      <Text style={{ color: '#52c41a', fontWeight: 500 }}>
        {t('footer.allGood')}
      </Text>
    </div>
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

  return (
    <List.Item
      onClick={handleClick}
      style={{
        padding: '10px 20px',
        borderBottom: '1px solid #f0f0f0',
        cursor: item.affectedNodeIds.length > 0 ? 'pointer' : 'default',
        background: getSeverityBackground(item.severity),
        transition: 'background 0.3s',
      }}
    >
      <Space
        size='middle'
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <Space size='middle'>
          {getSeverityIcon(item.severity)}
          <Text style={{ fontSize: '13px' }}>{item.message}</Text>
        </Space>
        {getSeverityTag(item.severity)}
      </Space>
    </List.Item>
  );
};

const Footer = () => {
  useAppStore((s) => s.language);
  const validationResult = useAppStore((s) => s.validationResult);
  const selectNode = useAppStore((s) => s.selectNode);

  const handleSelectAffectedNodes = (nodeIds: string[]) => {
    // Select the first affected node to show it in the inspector
    if (nodeIds.length > 0) {
      selectNode(nodeIds[0]);
    }
  };

  const totalIssues = validationResult.errorCount + validationResult.warningCount;

  return (
    <AntdFooter
      style={{
        background: '#fff',
        padding: 0,
        borderTop: '1px solid #e8e8e8',
        height: '180px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid #e8e8e8',
          background: '#fafafa',
        }}
      >
        <Row justify='space-between' align='middle'>
          <Col>
            <Space size='middle'>
              <Image
                src={SearchIcon}
                alt='Validation'
                preview={false}
                width={18}
                height={18}
              />
              <Title
                level={5}
                style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}
              >
                {t('footer.title')}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space size='middle'>
              {validationResult.errorCount > 0 && (
                <Badge count={validationResult.errorCount} color='red'>
                  <Text style={{ fontSize: '12px', marginRight: '4px' }}>
                    {t('footer.errors')}
                  </Text>
                </Badge>
              )}
              {validationResult.warningCount > 0 && (
                <Badge count={validationResult.warningCount} color='orange'>
                  <Text style={{ fontSize: '12px', marginRight: '4px' }}>
                    {t('footer.warnings')}
                  </Text>
                </Badge>
              )}
              {validationResult.infoCount > 0 && (
                <Badge count={validationResult.infoCount} color='blue'>
                  <Text style={{ fontSize: '12px', marginRight: '4px' }}>
                    {t('footer.info')}
                  </Text>
                </Badge>
              )}
              {totalIssues === 0 && validationResult.infoCount === 0 && (
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  {t('footer.noIssues')}
                </Text>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      {/* Validation list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: validationResult.items.length > 0 ? '0' : '8px 0',
        }}
      >
        {validationResult.items.length > 0 ? (
          <List
            size='small'
            dataSource={validationResult.items}
            renderItem={(item) => (
              <ValidationItemRow
                item={item}
                onSelect={handleSelectAffectedNodes}
              />
            )}
          />
        ) : (
          <EmptyValidations />
        )}
      </div>
    </AntdFooter>
  );
};

export default Footer;
