// hooks/use-tokens.ts
import { getTokens } from '@/constants/tokens';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTokens() {
  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  return getTokens(scheme);
}
