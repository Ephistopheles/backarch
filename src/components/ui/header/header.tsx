import { Layout, Row, Col, Image, Select, Button, Space, Divider } from 'antd';
import Language from '@/assets/icons/language.svg';
import Play from '@/assets/icons/play.svg';
import BackArchLogo from '/logo/backarch-logo.svg';

const { Header: AntHeader } = Layout;

const stackOptions = [
  { value: 'springboot', label: 'Spring Boot' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'django', label: 'Django' },
];

const versionOptions = [
  { value: '3.0', label: '3.0' },
  { value: '2.7', label: '2.7' },
];

const architectureOptions = [
  { value: 'layered', label: 'Layered' },
  { value: 'hexagonal', label: 'Hexagonal' },
  { value: 'clean', label: 'Clean Architecture' },
];

const Header = () => {
  return (
    <AntHeader style={{ borderBottom: '1px solid #e8e8e8' }}>
      <Row justify='space-between' align='middle'>
        {/* Logo */}
        <Col>
          <Image
            src={BackArchLogo}
            alt='BackArch Logo'
            preview={false}
            draggable={false}
            height={50}
          />
        </Col>

        {/* Center: Configuration selectors */}
        <Col>
          <Space size='middle'>
            <Space size='small' align='center'>
              <span>Stack:</span>
              <Select
                style={{ minWidth: 120 }}
                placeholder='Select stack'
                options={stackOptions}
              />
            </Space>
            <Divider
              orientation='vertical'
              style={{ height: '24px', margin: '0 8px' }}
            />

            <Space size='small' align='center'>
              <span>Version:</span>
              <Select
                style={{ minWidth: 100 }}
                placeholder='Select version'
                options={versionOptions}
              />
            </Space>

            <Divider
              orientation='vertical'
              style={{ height: '24px', margin: '0 8px' }}
            />

            <Space size='small' align='center'>
              <span>Architecture:</span>
              <Select
                style={{ minWidth: 150 }}
                placeholder='Select architecture'
                options={architectureOptions}
              />
            </Space>
          </Space>
        </Col>

        {/* Right: Actions */}
        <Col>
          <Space size='middle'>
            <Button>
              {true ? 'EN' : 'ES'}
              <img
                src={Language}
                alt='Language'
                width={18}
                height={18}
                draggable={false}
              />
            </Button>
            <Button type='primary' disabled>
              GENERATE
              <img
                src={Play}
                alt='Generate'
                width={18}
                height={18}
                draggable={false}
              />
            </Button>
          </Space>
        </Col>
      </Row>
    </AntHeader>
  );
};

export default Header;
