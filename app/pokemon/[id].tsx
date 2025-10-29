// app/pokemon/[id].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pokemonData } from '../../constants/pokemon';

export default function PokemonDetailScreen() {
  const params = useLocalSearchParams(); // { id?: string | string[] }

  // ✅ Lees het id uit de URL
  const rawId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? '';
  const parsedId = Number(rawId);

  // ✅ Zoek de juiste Pokémon
  const pokemon = useMemo(() => {
    if (!rawId) return undefined;
    if (Number.isNaN(parsedId)) return undefined;
    return pokemonData.find((p) => p.id === parsedId);
  }, [rawId, parsedId]);

  // ✅ Als geen resultaat: foutmelding met debug-info
  if (!pokemon) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <View style={styles.container}>
          <Text style={styles.error}>Pokémon niet gevonden.</Text>
          <Text style={styles.hint}>Controleer het ID in de URL.</Text>

          {/* Debugbox om te checken of het ID wel binnenkomt */}
          <View style={styles.debugBox}>
            <Text style={styles.debugText}>rawId: {String(rawId)}</Text>
            <Text style={styles.debugText}>parsedId: {String(parsedId)}</Text>
            <Text style={styles.debugText}>dataset length: {pokemonData.length}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Format ID met leading zeros
  const idLabel = String(pokemon.id).padStart(3, '0');

  // ✅ Toon detailpagina
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ title: `${pokemon.name} #${idLabel}` }} />
      <View style={styles.container}>
        {/* Grote headerkleur / image placeholder */}
        <View style={styles.hero} />

        {/* Toprij met badges */}
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{idLabel}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <View style={[styles.badge, { backgroundColor: '#0EA5E9' }]}>
            <Text style={styles.badgeText}>{pokemon.type}</Text>
          </View>
        </View>

        {/* Naam */}
        <Text style={styles.name}>{pokemon.name}</Text>

        {/* Info-kaart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <Text style={styles.cardText}>Type: {pokemon.type}</Text>
          <Text style={styles.cardText}>ID: {pokemon.id}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ✅ Stijlen
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FB' },
  container: { flex: 1, padding: 20 },
  hero: {
    backgroundColor: '#EDE9FE',
    borderRadius: 16,
    aspectRatio: 2,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  badge: {
    backgroundColor: '#6E56CF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { color: '#fff', fontWeight: '700' },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0B1026',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111827',
  },
  cardText: { fontSize: 16, color: '#374151', marginBottom: 4 },
  error: { fontSize: 20, fontWeight: '800', color: '#DC2626' },
  hint: { marginTop: 6, color: '#6B7280' },
  debugBox: {
    marginTop: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 10,
  },
  debugText: {
    color: '#92400E',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? undefined : 'monospace',
  },
});
