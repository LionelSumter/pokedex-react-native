// theme/fonts.ts
import { Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold, Rubik_700Bold, Rubik_900Black, useFonts as useRubikFonts } from '@expo-google-fonts/rubik';
import * as SplashScreen from 'expo-splash-screen';

// Zorg dat de splash blijft tot fonts geladen zijn
SplashScreen.preventAutoHideAsync().catch(() => {});

export function useAppFonts() {
  const [loaded, error] = useRubikFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
    Rubik_900Black,
    Rubik_600SemiBold,

    'CabinetGrotesk-Extrabold': require('../assets/fonts/CabinetGrotesk-Extrabold.otf'),
    'CabinetGrotesk-Regular': require('../assets/fonts/CabinetGrotesk-Regular.otf'),
  });
  return { loaded, error };
}

export const fontMap = {
  regular: 'Rubik_400Regular' as const,
  medium: 'Rubik_500Medium' as const,
  bold: 'Rubik_700Bold' as const,
  black: 'Rubik_900Black' as const,
  semibold: 'Rubik_600SemiBold' as const,
  heading: 'CabinetGrotesk-Extrabold' as const,
  cabinetRegular: 'CabinetGrotesk-Regular' as const,

};
