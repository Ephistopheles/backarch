import type { ThemeConfig } from 'antd';

const GlobalTheme: ThemeConfig = {
  token: {
    /* === Brand === */
    colorPrimary: '#4F46E5',
    colorInfo: '#3B82F6',
    colorSuccess: '#22C55E',
    colorError: '#EF4444',
    colorWarning: '#F59E0B',

    /* === Background === */
    colorBgBase: '#F5F7FA',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#FAFAFA',

    /* === Text === */
    colorText: '#1F2937',
    colorTextSecondary: '#4B5563',
    colorTextTertiary: '#6B7280',

    /* === Border & Radius === */
    borderRadius: 10,
    borderRadiusSM: 6,
    borderRadiusLG: 12,
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',

    /* === Typography === */
    fontFamily:
      '"SpaceGrotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 12,
    fontSizeSM: 10,
    fontSizeLG: 14,

    /* === Spacing === */
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 20,
    paddingLG: 24,
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      headerPadding: '0 24px',
      headerHeight: 64,
      siderBg: '#FFFFFF',
      footerBg: '#FFFFFF',
      footerPadding: 0,
    },
    Card: {
      paddingLG: 12,
      borderRadiusLG: 8,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 36,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 36,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 36,
    },
    Form: {
      itemMarginBottom: 12,
      verticalLabelPadding: '0 0 4px',
    },
    Divider: {
      marginLG: 16,
    },
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
    Empty: {
      colorTextDescription: '#6B7280',
    },
  },
};

export default GlobalTheme;
