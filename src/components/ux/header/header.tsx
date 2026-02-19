import { Layout, Row, Col, Image, Button, Space, Divider } from 'antd';
import Language from '@/assets/icons/language.svg';
import Play from '@/assets/icons/play.svg';
import BackArchLogo from '/logo/backarch-logo.svg';
import { useAppStore } from '@/store/app.store';
import { t, type Language as LanguageType } from '@/i18n/index.i18n';
import SelectBA from '@/components/ui/select';
import { STACKS, VERSIONS, ARCHITECTURES } from '@/core/stack/stack';

const { Header: AntHeader } = Layout;

const Header = () => {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const toggleLanguage = () => {
    const newLang: LanguageType = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  return (
    <AntHeader style={{ borderBottom: '1px solid #e8e8e8' }}>
      <Row justify='space-between' align='middle'>
        <Col>
          <Image
            src={BackArchLogo}
            alt='BackArch Logo'
            preview={false}
            draggable={false}
            height={50}
          />
        </Col>
        <Col>
          <Space size='middle'>
            <Space size='small' align='center'>
              <span>{t('header.stack.label')}</span>
              <SelectBA
                options={STACKS}
                placeholder={t('header.stack.placeholder')}
                getValue={(s) => s.id}
                getLabel={(s) => s.name}
                getDescription={(s) => s.description}
                getDocumentationUrl={(s) => s.documentationUrl}
                showPopover
              />
            </Space>
            <Divider
              orientation='vertical'
              style={{ height: '24px', margin: '0 8px' }}
            />
            <Space size='small' align='center'>
              <span>{t('header.version.label')}</span>
              <SelectBA
                options={VERSIONS}
                placeholder={t('header.version.placeholder')}
                getValue={(v) => v.id}
                getLabel={(v) => v.version}
                getDescription={(v) => v.description}
                getDocumentationUrl={(v) => v.documentationUrl}
                showPopover
              />
            </Space>
            <Divider
              orientation='vertical'
              style={{ height: '24px', margin: '0 8px' }}
            />
            <Space size='small' align='center'>
              <span>{t('header.architecture.label')}</span>
              <SelectBA
                options={ARCHITECTURES}
                placeholder={t('header.architecture.placeholder')}
                getValue={(a) => a.id}
                getLabel={(a) => a.name}
                getDescription={(a) => a.description}
                getDocumentationUrl={(a) => a.documentationUrl}
                showPopover
              />
            </Space>
          </Space>
        </Col>
        <Col>
          <Space size='middle'>
            <Button onClick={toggleLanguage}>
              {language.toUpperCase()}
              <img
                src={Language}
                alt='Language'
                width={18}
                height={18}
                draggable={false}
              />
            </Button>
            <Button type='primary' disabled>
              {t('header.generate')}
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
