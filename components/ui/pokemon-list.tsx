// components/ui/pokemon-list.tsx
import React from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import type { Pokemon } from '../../constants/pokemon';

type Props = {
  data: Pokemon[];
  contentPadding?: number;
};

export default function PokemonList({ data, contentPadding = 16 }: Props) {
  const renderItem = ({ item }: { item: Pokemon }) => {
    const idLabel = String(item.id).padStart(3, '0');

    return (
      <Pressable
        // ✅ objectvorm; werkt zonder app.d.ts (met as any om TS te sussen)
        onPress={() =>
          router.push(
            { pathname: '/pokemon/[id]', params: { id: String(item.id) } } as any
          )
        }
        onLongPress={() =>
          Alert.alert('Pokémon', `Long press: ${item.name} (#${idLabel})`)
        }
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>#{idLabel}</Text>
          </View>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>

        <View style={styles.imageBox} />

        <Text style={styles.name}>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: contentPadding }]}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.empty}>Geen Pokémon gevonden…</Text>}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: { paddingBottom: 24 },
  column: { justifyContent: 'space-between', marginBottom: 12, gap: 12 },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardPressed: { transform: [{ scale: Platform.select({ ios: 0.98, android: 0.99 })! }] },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  idBadge: { backgroundColor: '#6E56CF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  idText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },
  typeText: { color: '#6B7280', fontSize: 12, fontWeight: '600' },
  imageBox: { backgroundColor: '#F1ECFF', borderRadius: 12, aspectRatio: 1.2, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '700', color: '#111827', textTransform: 'capitalize' },
  empty: { padding: 16, textAlign: 'center', color: '#DC0A2D', fontWeight: '700' },
});
