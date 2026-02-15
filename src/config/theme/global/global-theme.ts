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
    colorBgLayout: '#F5F7FA',

    /* === Text === */
    colorText: '#1F2937',
    colorTextSecondary: '#4B5563',
    colorTextTertiary: '#6B7280',

    /* === Border & Radius === */
    borderRadius: 10,
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',

    /* === Typography === */
    fontFamily:
      '"SpaceGrotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      siderBg: '#FFFFFF',
    },
  },
};

export default GlobalTheme;
