// app/pokemon/_layout.tsx
import { Stack } from 'expo-router';

export default function PokemonStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ✅ je gebruikt een custom header in [name].tsx
      }}
    >
      <Stack.Screen name="[name]" />
    </Stack>
  );
}
