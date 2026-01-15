// app/_layout.tsx
import { databaseService } from '@/services/databaseService.native'; // ← laat platform resolver .native/.web kiezen
import { useAppFonts } from '@/theme/fonts';
import { DarkTheme as NavDark, DefaultTheme as NavLight, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/use-color-scheme'; // jouw hook blijft prima

// Splash zichtbaar houden tot fonts/DB klaar zijn
SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme(); // 'light' | 'dark'
  const { loaded: fontsLoaded } = useAppFonts();

  // Web hoeft geen DB-init → start ready
  const [dbReady, setDbReady] = useState(Platform.OS === 'web');

  useEffect(() => {
    let mounted = true;

    async function init() {
      // wacht tot fonts geladen zijn zodat er geen font "pop" is
      if (!fontsLoaded) return;

      if (Platform.OS !== 'web') {
        try {
          await databaseService.initDatabase();
        } catch (e) {
          console.warn('DB init failed', e);
        }
      }

      if (!mounted) return;

      setDbReady(true);

      // alles klaar → splash weg
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }

    init();
    return () => {
      mounted = false;
    };
  }, [fontsLoaded]);

  // Laat de Splash staan zolang we niet klaar zijn
  if (!fontsLoaded || !dbReady) {
    return <View />;
  }

  const navTheme = colorScheme === 'dark' ? NavDark : NavLight;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={navTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="pokemon" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
