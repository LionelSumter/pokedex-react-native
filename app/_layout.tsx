// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/use-color-scheme';

// 👉 Import TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ✅ Maak één QueryClient-instantie met standaardinstellingen
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data blijft 5 minuten “vers”
      gcTime: 10 * 60 * 1000,   // Wordt na 10 minuten opgeruimd
      retry: 1,
    },
  },
});

// Expo Router setting zodat (tabs) de root is
export const unstable_settings = {
  anchor: '(tabs)',
};

// ------- ⭐ Eenvoudige inline ErrorBoundary (geen extra deps) -------
class InlineErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { error: unknown | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  handleReset = async () => {
    this.setState({ error: null });
    // Probeer alle queries te verversen
    await queryClient.invalidateQueries();
  };
  render() {
    if (this.state.error) {
      const msg =
        this.state.error instanceof Error
          ? this.state.error.message
          : 'Something went wrong';
      return (
        <View style={ebStyles.box}>
          <Text style={ebStyles.title}>Oops, er ging iets mis</Text>
          <Text style={ebStyles.msg}>{msg}</Text>
          <Pressable onPress={this.handleReset} style={ebStyles.btn}>
            <Text style={ebStyles.btnText}>Opnieuw proberen</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children as React.ReactNode;
  }
}

const ebStyles = StyleSheet.create({
  box: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  title: { fontWeight: '800', fontSize: 16, color: '#991B1B' },
  msg: { color: '#7F1D1D' },
  btn: {
    marginTop: 8,
    backgroundColor: '#111827',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
});

// ✅ RootLayout — alles gewrapped met QueryClientProvider
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          {/* ⭐ Error boundary om je navigatie */}
          <InlineErrorBoundary>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack>
          </InlineErrorBoundary>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
