// theme/fonts.ts
import { Rubik_400Regular, Rubik_500Medium, Rubik_700Bold, useFonts as useRubikFonts } from '@expo-google-fonts/rubik';
import * as SplashScreen from 'expo-splash-screen';

// Zorg dat de splash blijft tot fonts geladen zijn
SplashScreen.preventAutoHideAsync().catch(() => {});

export function useAppFonts() {
  const [loaded, error] = useRubikFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });
  return { loaded, error };
}

export const fontMap = {
  regular: 'Rubik_400Regular' as const,
  medium: 'Rubik_500Medium' as const,
  bold: 'Rubik_700Bold' as const,
};
