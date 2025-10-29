// app/(tabs)/favorites.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonList from '../../components/ui/pokemon-list';
import { pokemonData } from '../../constants/pokemon';

export default function FavoritesScreen() {
  // Simpele filter: eerste 2 als favorieten (later kun je AsyncStorage gebruiken)
  const favorites = pokemonData.slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      <PokemonList data={favorites} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E9F2F8' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  title: { fontSize: 28, fontWeight: '800', color: '#0B1026' },
});
