/**
 * Header Component
 *
 * Application header with logo, configuration selects, and action buttons.
 * Uses Ant Design Layout.Header with semantic markup.
 */

import {
  Layout,
  Row,
  Col,
  Image,
  Button,
  Space,
  Divider,
  Typography,
  Flex,
} from 'antd';
import Language from '@/assets/icons/language.svg';
import Play from '@/assets/icons/play.svg';
import BackArchLogo from '/logo/backarch-logo.svg';
import { useAppStore } from '@/store/app.store';
import { t, type Language as LanguageType } from '@/i18n/index.i18n';
import BASelect from '@/components/ui/select';
import {
  STACKS,
  getVersionsByStackId,
  ARCHITECTURES,
} from '@/core/stack/index.stack';
import '@/styles/header/header.css';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const selectedStack = useAppStore((s) => s.selectedStack);
  const selectedVersion = useAppStore((s) => s.selectedVersion);
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);
  const setStack = useAppStore((s) => s.setStack);
  const setVersion = useAppStore((s) => s.setVersion);
  const setArchitecture = useAppStore((s) => s.setArchitecture);

  const toggleLanguage = () => {
    const newLang: LanguageType = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  return (
    <AntHeader className='ba-header'>
      <Row justify='space-between' align='middle' className='ba-header__row'>
        {/* Logo */}
        <Col className='ba-header__logo-col'>
          <Image
            src={BackArchLogo}
            alt='BackArch Logo'
            preview={false}
            draggable={false}
            height={50}
          />
        </Col>

        {/* Configuration Selects */}
        <Col flex='auto' className='ba-header__config-col'>
          <Space size='middle' wrap>
            {/* Stack Select */}
            <Space
              size='small'
              align='center'
              className='ba-header__config-group'
            >
              <Text className='ba-header__config-label'>
                {t('header.stack.label')}
              </Text>
              <BASelect
                options={STACKS}
                placeholder={t('header.stack.placeholder')}
                value={selectedStack}
                onChange={setStack}
                getValue={(s) => s.id}
                getLabel={(s) => s.name}
                getDescription={(s) => s.description}
                getDocumentationUrl={(s) => s.documentationUrl}
                showPopover
              />
            </Space>

            <Divider orientation='vertical' className='ba-header__divider' />

            {/* Version Select */}
            <Space
              size='small'
              align='center'
              className='ba-header__config-group'
            >
              <Text className='ba-header__config-label'>
                {t('header.version.label')}
              </Text>
              <BASelect
                options={
                  selectedStack ? getVersionsByStackId(selectedStack) : []
                }
                placeholder={t('header.version.placeholder')}
                value={selectedVersion}
                onChange={setVersion}
                getValue={(v) => v.id}
                getLabel={(v) => v.version}
                getDescription={(v) => v.description}
                getDocumentationUrl={(v) => v.documentationUrl}
                showPopover
                disabled={!selectedStack}
              />
            </Space>

            <Divider orientation='vertical' className='ba-header__divider' />

            {/* Architecture Select */}
            <Space
              size='small'
              align='center'
              className='ba-header__config-group'
            >
              <Text className='ba-header__config-label'>
                {t('header.architecture.label')}
              </Text>
              <BASelect
                options={ARCHITECTURES}
                placeholder={t('header.architecture.placeholder')}
                value={selectedArchitecture}
                onChange={setArchitecture}
                getValue={(a) => a.id}
                getLabel={(a) => a.name}
                getDescription={(a) => a.description}
                getDocumentationUrl={(a) => a.documentationUrl}
                showPopover
                disabled={!selectedStack}
              />
            </Space>
          </Space>
        </Col>

        {/* Action Buttons */}
        <Col className='ba-header__actions-col'>
          <Space size='middle'>
            <Button
              onClick={toggleLanguage}
              className='ba-header__btn-language'
            >
              <Flex align='center' gap={4}>
                {language.toUpperCase()}
                <img
                  src={Language}
                  alt='Language'
                  width={18}
                  height={18}
                  draggable={false}
                />
              </Flex>
            </Button>
            <Button type='primary' disabled className='ba-header__btn-generate'>
              <Flex align='center' gap={4}>
                {t('header.generate')}
                <img
                  src={Play}
                  alt='Generate'
                  width={18}
                  height={18}
                  draggable={false}
                />
              </Flex>
            </Button>
          </Space>
        </Col>
      </Row>
    </AntHeader>
  );
};

export default Header;
