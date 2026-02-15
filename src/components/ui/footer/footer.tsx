import { Layout, Row, Col, Badge, List, Tag, Typography, Space } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Footer: AntdFooter } = Layout;
const { Text, Title } = Typography;

type ValidationSeverity = 'error' | 'warning' | 'info';

interface ValidationItem {
  id: string;
  severity: ValidationSeverity;
  message: string;
}

const getSeverityIcon = (severity: ValidationSeverity) => {
  switch (severity) {
    case 'error':
      return <ExclamationCircleOutlined style={{ fontSize: '18px', color: '#ff4d4f' }} />;
    case 'warning':
      return <WarningOutlined style={{ fontSize: '18px', color: '#faad14' }} />;
    case 'info':
      return <InfoCircleOutlined style={{ fontSize: '18px', color: '#1890ff' }} />;
  }
};

const getSeverityTag = (severity: ValidationSeverity) => {
  const colors = {
    error: 'error',
    warning: 'warning',
    info: 'processing'
  };
  return <Tag color={colors[severity]}>{severity.toUpperCase()}</Tag>;
};

const mockValidations: ValidationItem[] = [
  {
    id: '1',
    severity: 'warning',
    message: 'Service must connect to a repository'
  },
  {
    id: '2',
    severity: 'info',
    message: 'Consider adding caching to this endpoint'
  },
  {
    id: '3',
    severity: 'error',
    message: 'Endpoint missing HTTP method'
  },
  {
    id: '4',
    severity: 'error',
    message: 'Endpoint missing HTTP method'
  }
];

const Footer = () => {
  const issueCount = mockValidations.filter(v => v.severity !== 'info').length;

  return (
    <AntdFooter style={{ 
      background: '#fff',
      padding: 0,
      borderTop: '1px solid #e8e8e8',
      height: '180px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '12px 20px',
        borderBottom: '1px solid #e8e8e8',
        background: '#fafafa'
      }}>
        <Row justify='space-between' align='middle'>
          <Col>
            <Space size='middle'>
              <SearchOutlined style={{ fontSize: '18px', color: '#666' }} />
              <Title level={5} style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
                Validation & Feedback
              </Title>
            </Space>
          </Col>
          <Col>
            <Badge 
              count={issueCount} 
              showZero
            >
              <Text style={{ 
                fontSize: '12px',
                marginRight: '8px'
              }}>
                Issues Found
              </Text>
            </Badge>
          </Col>
        </Row>
      </div>

      {/* Validation list */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '8px 0'
      }}>
        <List
          size='small'
          dataSource={mockValidations}
          renderItem={(item) => (
            <List.Item
              style={{ 
                padding: '10px 20px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                background: item.severity === 'error' ? '#fff1f0' : 
                           item.severity === 'warning' ? '#fffbe6' : 'transparent',
                transition: 'background 0.3s'
              }}
              className='validation-item'
            >
              <Space size='middle' style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space size='middle'>
                  {getSeverityIcon(item.severity)}
                  <Text style={{ fontSize: '13px' }}>{item.message}</Text>
                </Space>
                {getSeverityTag(item.severity)}
              </Space>
            </List.Item>
          )}
        />
      </div>
    </AntdFooter>
  );
};

export default Footer;
