// app/(tabs)/index.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonList from '../../components/ui/pokemon-list'; // ✅ relatieve import
import { pokemonData } from '../../constants/pokemon'; // ✅ relatieve import

export default function AllPokemonScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>All Pokémon</Text>
      </View>
      <PokemonList data={pokemonData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E9F2F8' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  title: { fontSize: 28, fontWeight: '800', color: '#0B1026' },
});
