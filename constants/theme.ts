// constants/theme.ts
import { getTokens } from '@/constants/tokens';

export const Colors = {
  light: {
    text: getTokens('light').color.text.primary,
    background: getTokens('light').color.surface.background,
    tint: getTokens('light').color.primary.purple,
    icon: getTokens('light').color.icon.muted,
    tabIconDefault: getTokens('light').color.text.muted,
    tabIconSelected: getTokens('light').color.primary.purple,
    card: getTokens('light').color.surface.card,
  },
  dark: {
    text: getTokens('dark').color.text.primary,
    background: getTokens('dark').color.surface.background,
    tint: getTokens('dark').color.primary.purple,
    icon: getTokens('dark').color.icon.muted,
    tabIconDefault: getTokens('dark').color.text.muted,
    tabIconSelected: getTokens('dark').color.primary.purple,
    card: getTokens('dark').color.surface.card,
  },
};

export { getTokens };

