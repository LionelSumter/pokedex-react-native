// app/pokemon/_layout.tsx
import { Stack } from 'expo-router';

export default function PokemonStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#E9F2F8' }, // blauwe banner
        headerTitle: '',                  // geen titel
        headerShadowVisible: false,       // geen schaduw
        headerBackVisible: false,         // verberg standaard back
        headerLeft: () => null,           // 💥 force: geen back icoon
        headerTintColor: '#0B1026',
      }}
    >
      <Stack.Screen name="[name]" />
    </Stack>
  );
}
