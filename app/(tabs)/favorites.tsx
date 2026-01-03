import PokemonCard from '@/components/ui/pokemon-card';
import { useFavorites, useFavoriteStats } from '@/hooks/use-favorites';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { data: favorites, isLoading } = useFavorites();
  const { data: stats } = useFavoriteStats();

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        <Text style={s.empty}>No favorites yet</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>My favorites</Text>
        {stats && (
          <Text style={s.sub}>
            {stats.count} saved · avg exp {stats.avgBaseExp}
          </Text>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(f) => String(f.id)}
        numColumns={2}
        columnWrapperStyle={s.column}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <PokemonCard
            item={{
              id: item.id,
              name: item.name,
              imageUrl: item.image_url,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E9F2F8' },
  header: { padding: 16 },
  title: { fontSize: 24, fontWeight: '900' },
  sub: { color: '#6B7280', marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  column: { justifyContent: 'space-between', marginBottom: 12 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 18 },
});
