// app/(tabs)/favorites.tsx
import PokemonList, { type PokemonListItem } from '@/components/ui/pokemon-list';
import { useFavorites, useFavoriteStats } from '@/hooks/use-favorites';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { data: favorites, isLoading, error } = useFavorites();
  const { data: stats } = useFavoriteStats();

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}><Text style={s.title}>My favorites</Text></View>
        <View style={s.center}>
          <ActivityIndicator size="large" />
          <Text style={s.muted}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !favorites || favorites.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}><Text style={s.title}>My favorites</Text></View>
        <View style={s.center}>
          <Text style={s.emptyTitle}>No favorites yet</Text>
          <Text style={s.muted}>Tap the heart on a Pokémon to save it.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const items: PokemonListItem[] = favorites.map((f) => ({
    id: f.id,
    name: f.name,
    imageUrl: f.image_url,
  }));

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>My favorites</Text>
        {stats && (
          <Text style={s.subtitle}>
            {stats.count} saved · avg exp {stats.avgBaseExp} · avg {stats.avgWeightKg}kg / {stats.avgHeightM}m
          </Text>
        )}
      </View>

      <PokemonList data={items} contentPadding={16} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E9F2F8' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '900', color: '#0B1026' },
  subtitle: { marginTop: 2, color: '#6B7280', fontWeight: '600' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  muted: { color: '#6B7280', fontWeight: '600', textAlign: 'center' },
});
