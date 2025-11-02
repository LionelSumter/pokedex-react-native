// app/_layout.tsx
import { databaseService } from '@/services/database.native';
import { useAppFonts } from '@/theme/fonts';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/use-color-scheme';

// Splash scherm pas verbergen als fonts klaar zijn
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
  const colorScheme = useColorScheme();
  const { loaded: fontsLoaded } = useAppFonts();

  // Web: geen DB-init nodig → direct ready
  const [dbReady, setDbReady] = useState(Platform.OS === 'web');

  useEffect(() => {
    let mounted = true;

    async function init() {
      // Wacht op fonts (splash blijft zichtbaar) zodat er geen “font pop-in” is
      if (!fontsLoaded) return;

      // Init DB alleen op native
      if (Platform.OS !== 'web') {
        try {
          await databaseService.initDatabase();
        } catch (e) {
          console.warn('DB init failed', e);
        }
      }

      if (mounted) {
        setDbReady(true);
        // Alles klaar → splash verbergen
        SplashScreen.hideAsync().catch(() => {});
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [fontsLoaded]);

  if (!fontsLoaded || !dbReady) {
    // Niks renderen zodat Splash in beeld blijft
    return <View />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
