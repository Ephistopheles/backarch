/**
 * Header
 *
 * Top bar using Ant Design Flex, Space, Row, Col for layout.
 * Memoized sub-components and callbacks to prevent unnecessary rerenders.
 */

import { useState, useCallback, useMemo } from 'preact/hooks';
import {
  Row,
  Col,
  Button,
  Divider,
  Tooltip,
  Popover,
  Form,
  Input,
  Space,
  Flex,
  Image,
  Typography,
  message,
} from 'antd';
import {
  SettingOutlined,
  DownloadOutlined,
  MenuOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

import BASelect from '@/components/ui/select';
import { useAppStore } from '@/store/app.store';
import {
  STACKS,
  ARCHITECTURES,
  getVersionsByStackId,
} from '@/core/stack/index.stack';
import { t } from '@/i18n/index.i18n';
import { generateAndDownload } from '@/core/scaffold/index.scaffold';
import '@/styles/header/header.css';

const { Text } = Typography;

interface HeaderProps {
  isDesktop: boolean;
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Project Settings Popover (memoized)                */
/* ------------------------------------------------------------------ */

const ProjectSettingsContent = () => {
  const projectName = useAppStore((s) => s.projectName);
  const basePackage = useAppStore((s) => s.basePackage);
  const setProjectName = useAppStore((s) => s.setProjectName);
  const setBasePackage = useAppStore((s) => s.setBasePackage);

  return (
    <Form layout='vertical' size='small' className='ba-header__settings-form'>
      <Form.Item label={t('header.settings.projectName')}>
        <Input
          value={projectName}
          onChange={(e) => setProjectName((e.target as HTMLInputElement).value)}
          placeholder={t('header.settings.projectNamePlaceholder')}
        />
      </Form.Item>
      <Form.Item label={t('header.settings.basePackage')}>
        <Input
          value={basePackage}
          onChange={(e) => setBasePackage((e.target as HTMLInputElement).value)}
          placeholder={t('header.settings.basePackagePlaceholder')}
        />
      </Form.Item>
    </Form>
  );
};

/* ------------------------------------------------------------------ */
/*  Config selects — extracted with own granular selectors             */
/* ------------------------------------------------------------------ */

const ConfigSelects = () => {
  const selectedStack = useAppStore((s) => s.selectedStack);
  const selectedVersion = useAppStore((s) => s.selectedVersion);
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);
  const setStack = useAppStore((s) => s.setStack);
  const setVersion = useAppStore((s) => s.setVersion);
  const setArchitecture = useAppStore((s) => s.setArchitecture);

  const versions = useMemo(
    () => (selectedStack ? getVersionsByStackId(selectedStack) : []),
    [selectedStack]
  );

  return (
    <Flex align='center' gap={12} wrap='wrap' className='ba-header__config'>
      <Space size={6}>
        <Text className='ba-header__config-label'>{t('header.stack.label')}</Text>
        <BASelect
          options={STACKS}
          value={selectedStack}
          onChange={(v) => setStack(v ?? null)}
          getValue={(s) => s.id}
          getLabel={(s) => s.name}
          getDescription={(s) => t(`stacks.${s.description}.description` as any)}
          getDocumentationUrl={(s) => s.documentationUrl}
          showPopover
          placeholder={t('header.stack.placeholder')}
        />
      </Space>

      <Divider type='vertical' className='ba-header__config-divider' />

      <Space size={6}>
        <Text className='ba-header__config-label'>{t('header.version.label')}</Text>
        <BASelect
          options={versions}
          value={selectedVersion}
          onChange={(v) => setVersion(v ?? null)}
          getValue={(v) => v.id}
          getLabel={(v) => v.version}
          getDescription={(v) => t(`versions.${v.description}.description` as any)}
          getDocumentationUrl={(v) => v.documentationUrl}
          showPopover
          placeholder={t('header.version.placeholder')}
          disabled={!selectedStack}
        />
      </Space>

      <Divider type='vertical' className='ba-header__config-divider' />

      <Space size={6}>
        <Text className='ba-header__config-label'>{t('header.architecture.label')}</Text>
        <BASelect
          options={ARCHITECTURES}
          value={selectedArchitecture}
          onChange={(v) => setArchitecture(v ?? null)}
          getValue={(a) => a.id}
          getLabel={(a) => a.name}
          getDescription={(a) => t(`architectures.${a.description}.description` as any)}
          getDocumentationUrl={(a) => a.documentationUrl}
          showPopover
          placeholder={t('header.architecture.placeholder')}
          disabled={!selectedVersion}
        />
      </Space>
    </Flex>
  );
};

/* ------------------------------------------------------------------ */
/*  Action buttons — extracted with own granular selectors             */
/* ------------------------------------------------------------------ */

const ActionButtons = ({ isDesktop }: { isDesktop: boolean }) => {
  const [generating, setGenerating] = useState(false);

  // Granular selectors — only subscribe to what's needed for generate logic
  const selectedStack = useAppStore((s) => s.selectedStack);
  const selectedVersion = useAppStore((s) => s.selectedVersion);
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);
  const projectName = useAppStore((s) => s.projectName);
  const basePackage = useAppStore((s) => s.basePackage);
  const graphNodeCount = useAppStore((s) => s.graph.nodes.length);
  const errorCount = useAppStore((s) => s.validationResult.errorCount);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const configComplete = !!(selectedStack && selectedVersion && selectedArchitecture);
  const canGenerate =
    configComplete &&
    projectName.trim() !== '' &&
    basePackage.trim() !== '' &&
    graphNodeCount > 0 &&
    !errorCount;

  const generateTooltip = useMemo(() => {
    if (!configComplete || !projectName.trim() || !basePackage.trim())
      return t('generate.missingConfig');
    if (errorCount) return t('generate.hasErrors');
    if (graphNodeCount === 0) return t('generate.emptyGraph');
    return '';
  }, [configComplete, projectName, basePackage, errorCount, graphNodeCount]);

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || generating) return;
    setGenerating(true);
    try {
      const state = useAppStore.getState();
      await generateAndDownload({
        stackId: state.selectedStack!,
        versionId: state.selectedVersion!,
        architectureId: state.selectedArchitecture!,
        projectName: state.projectName.trim(),
        basePackage: state.basePackage.trim(),
      }, state.graph);
      message.success(t('generate.success'));
    } catch {
      message.error(t('generate.failed'));
    } finally {
      setGenerating(false);
    }
  }, [canGenerate, generating]);

  const toggleLanguage = useCallback(
    () => setLanguage(language === 'en' ? 'es' : 'en'),
    [language, setLanguage]
  );

  return (
    <Space size={8} className='ba-header__actions'>
      <Popover
        content={<ProjectSettingsContent />}
        title={t('header.settings.title')}
        trigger='click'
        placement='bottomRight'
        overlayClassName='ba-header__settings-popover'
      >
        <Button icon={<SettingOutlined />} size='small' type='text'>
          {isDesktop ? t('header.settings.label') : null}
        </Button>
      </Popover>

      <Button icon={<GlobalOutlined />} size='small' type='text' onClick={toggleLanguage}>
        {language.toUpperCase()}
      </Button>

      <Tooltip title={generateTooltip} placement='bottomRight'>
        <Button
          type='primary'
          icon={<DownloadOutlined />}
          size='small'
          disabled={!canGenerate}
          loading={generating}
          onClick={handleGenerate}
        >
          {isDesktop ? t('header.generate') : null}
        </Button>
      </Tooltip>
    </Space>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Header                                                       */
/* ------------------------------------------------------------------ */

export default function Header({ isDesktop }: HeaderProps) {
  const setLeftDrawerOpen = useAppStore((s) => s.setLeftDrawerOpen);

  const handleMenuClick = useCallback(
    () => setLeftDrawerOpen(true),
    [setLeftDrawerOpen]
  );

  return (
    <Flex vertical className='ba-header'>
      {/* Primary row: brand | config (desktop) | actions */}
      <Row align='middle' justify='space-between' wrap={false} style={{ height: 56, padding: '0 16px' }}>
        <Col flex='none'>
          <Space size={8} align='center'>
            {!isDesktop && (
              <Button
                icon={<MenuOutlined />}
                type='text'
                size='small'
                onClick={handleMenuClick}
              />
            )}
            <Image
              src='/logo/backarch-logo.svg'
              alt='BackArch'
              width={200}
              height={200}
              preview={false}
              draggable={false}
            />
            {/* <Text strong className='ba-header__brand-name'>BackArch</Text> */}
          </Space>
        </Col>

        {isDesktop && (
          <Col flex='auto' style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <ConfigSelects />
          </Col>
        )}

        <Col flex='none'>
          <ActionButtons isDesktop={isDesktop} />
        </Col>
      </Row>

      {/* Secondary row for config on tablet/mobile */}
      {!isDesktop && (
        <Flex style={{ padding: '8px 16px 10px', borderTop: '1px solid var(--ba-color-border-light)' }}>
          <ConfigSelects />
        </Flex>
      )}
    </Flex>
  );
}
