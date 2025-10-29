// app/pokemon/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function PokemonStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Pokémon',
        }}
      />
    </Stack>
  );
}
