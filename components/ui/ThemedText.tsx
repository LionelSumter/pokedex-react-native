// components/ui/ThemedText.tsx
import { fontMap } from '@/theme/fonts';
import type { TextProps } from 'react-native';
import { Text } from 'react-native';

type Weight = 'regular' | 'medium' | 'bold';

export function ThemedText({
  weight = 'regular',
  style,
  ...rest
}: TextProps & { weight?: Weight }) {
  return <Text {...rest} style={[{ fontFamily: fontMap[weight] }, style]} />;
}
