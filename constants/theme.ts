// constants/theme.ts
import { tokens } from '@/constants/tokens';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: tokens.color.text.primary,
    background: tokens.color.surface.background,
    tint: tokens.color.primary.purple,
    icon: tokens.color.icon.muted,
    tabIconDefault: tokens.color.text.muted,
    tabIconSelected: tokens.color.primary.purple,
    card: tokens.color.surface.card,
  },
  dark: {
    text: tokens.color.text.primary,
    background: tokens.color.surface.background,
    tint: tokens.color.primary.purple,
    icon: tokens.color.icon.muted,
    tabIconDefault: tokens.color.text.muted,
    tabIconSelected: tokens.color.primary.purple,
    card: tokens.color.surface.card,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export { tokens };

