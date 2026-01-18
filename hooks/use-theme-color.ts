/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { getTokens } from '@/constants/tokens';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeScheme = 'light' | 'dark';

/**
 * Deze keys matchen wat je template/components (ThemedView/Parallax) verwachten.
 * Dus: 'background' en 'text' zijn weer toegestaan.
 */
type ThemeColorName =
  | 'text'
  | 'background'
  | 'tint'
  | 'icon'
  | 'tabIconDefault'
  | 'tabIconSelected'
  | 'card';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName
) {
  const theme = (useColorScheme() ?? 'light') as ThemeScheme;

  // 1) props overrulen altijd
  const override = props[theme];
  if (override) return override;

  // 2) map naar jouw tokens
  const t = getTokens(theme);

  switch (colorName) {
    case 'background':
      return t.color.surface.background;

    case 'card':
      return t.color.surface.card;

    case 'text':
      return t.color.text.primary;

    case 'tint':
      return t.color.primary.purple;

    case 'icon':
      return t.color.icon.muted;

    case 'tabIconDefault':
      return t.color.text.muted;

    case 'tabIconSelected':
      return t.color.primary.purple;

    default:
      // should never happen, but safe fallback
      return t.color.text.primary;
  }
}
