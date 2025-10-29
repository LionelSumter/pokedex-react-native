// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/use-color-scheme';

// 👉 Import TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ Maak één QueryClient-instantie met standaardinstellingen
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data blijft 5 minuten “vers”
      gcTime: 10 * 60 * 1000,   // Wordt na 10 minuten opgeruimd
    },
  },
});

// Expo Router setting zodat (tabs) de root is
export const unstable_settings = {
  anchor: '(tabs)',
};

// ✅ RootLayout — alles gewrapped met QueryClientProvider
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Modal' }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
