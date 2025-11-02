// components/ui/Themed.tsx
import { darkColors, lightColors } from '@/theme/colors';
import {
    Text as RNText,
    TextProps as RNTextProps,
    View as RNView,
    ViewProps as RNViewProps,
    StyleSheet,
    useColorScheme,
} from 'react-native';

type FontWeightName = 'regular' | 'medium' | 'bold';
const rubikFor: Record<FontWeightName, string> = {
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  bold: 'Rubik_700Bold',
};

export function useThemeColors() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  return { scheme: scheme ?? 'light', colors };
}

/** Themed View */
export function View({ style, ...rest }: RNViewProps) {
  const { colors } = useThemeColors();
  return <RNView style={[{ backgroundColor: 'transparent' }, style]} {...rest} />;
}

/** Themed Text with Rubik font by default */
type TextProps = RNTextProps & { weight?: FontWeightName; color?: string };
export function Text({ style, weight = 'regular', color, ...rest }: TextProps) {
  const { colors } = useThemeColors();
  return (
    <RNText
      {...rest}
      style={[
        styles.text,
        { fontFamily: rubikFor[weight], color: color ?? colors.text },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
