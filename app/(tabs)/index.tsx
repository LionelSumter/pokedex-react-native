// app/(tabs)/index.tsx
import { PokemonWithId, useInfinitePokemonList } from '@/hooks/use-pokemon';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllPokemonScreen() {
  const [search, setSearch] = useState('');
  const pageSize = 50;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfinitePokemonList(pageSize);

  const allItems: PokemonWithId[] = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.items),
    [data?.pages]
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return allItems;
    return allItems.filter((p) => p.name.toLowerCase().includes(s));
  }, [allItems, search]);

  // ----- Loading -----
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.infoText}>Loading Pokémon...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ----- Error -----
  if (error instanceof Error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading Pokémon:</Text>
          <Text style={styles.infoText}>{error.message}</Text>
          <Pressable onPress={() => refetch()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ----- Render item -----
  const renderItem = ({ item }: { item: PokemonWithId }) => {
    const idLabel = `#${item.id.padStart(3, '0')}`;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

    return (
      <Pressable
        onPress={() => router.push(`/pokemon/${item.name}`)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.topRow}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>{idLabel}</Text>
          </View>
        </View>

        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />

        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search for Pokémon..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.listTitle}>All Pokémon</Text>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.name}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator />
              <Text style={styles.infoText}>Loading more…</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Pokémon found…</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E9F2F8' },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12, marginBottom: 8 },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B1026',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  column: { justifyContent: 'space-between', marginBottom: 12, gap: 12 },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: 'center',
  },
  cardPressed: { opacity: 0.8 },
  topRow: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%' },
  idBadge: { backgroundColor: '#6E56CF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  idText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  image: { width: 80, height: 80, marginVertical: 10 },
  name: { fontSize: 16, fontWeight: '700', color: '#111827', textTransform: 'capitalize' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#9CA3AF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoText: { marginTop: 8, fontSize: 16, color: '#374151' },
  errorText: { fontSize: 18, fontWeight: '700', color: '#DC2626' },
  retryBtn: {
    marginTop: 12,
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '700' },
  footer: { paddingVertical: 12, alignItems: 'center' },
});
