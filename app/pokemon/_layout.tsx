import { Stack } from 'expo-router';

export default function PokemonStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#E9F2F8' },
        headerTitle: '',
        headerShadowVisible: false,
        headerBackVisible: false,
        headerLeft: () => null,
        headerTintColor: '#0B1026',
      }}
    >
      <Stack.Screen name="[name]" />
    </Stack>
  );
}
