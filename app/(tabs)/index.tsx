import PokemonCard from '@/components/ui/pokemon-card';
import { tokens } from '@/constants/tokens';
import { PokemonWithId, useInfinitePokemonList } from '@/hooks/use-pokemon';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((p) => p.name.toLowerCase().includes(q));
  }, [allItems, search]);

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe} edges={['left', 'right']}>
        <View style={s.center}>
          <ActivityIndicator size="large" />
          <Text style={s.muted}>Loading Pokémon…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error instanceof Error) {
    return (
      <SafeAreaView style={s.safe} edges={['left', 'right']}>
        <View style={s.center}>
          <Text style={s.errorTitle}>Error loading Pokémon</Text>
          <Text style={s.muted}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right']}>
      {/* Top spacing like your design */}
      <View style={s.topPad}>
        <View style={s.searchWrap}>
          <View style={s.searchRow}>
            <Ionicons
              name="search"
              size={20}
              color={tokens.color.text.placeholder}
              style={{ marginRight: tokens.spacing.sm }}
            />
            <TextInput
              placeholder="Search for Pokémon..."
              placeholderTextColor={tokens.color.text.placeholder}
              value={search}
              onChangeText={setSearch}
              style={s.searchInput}
            />
          </View>
        </View>

        <Text style={s.title}>All Pokémon</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id || item.name}
        numColumns={2}
        columnWrapperStyle={s.column}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PokemonCard item={{ id: item.id, name: item.name }} />}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={s.footer}>
              <ActivityIndicator />
              <Text style={s.muted}>Loading more…</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.surface.background,
  },

  topPad: {
    paddingTop: 60,
  },

  searchWrap: {
    paddingHorizontal: tokens.spacing.screen,
    marginBottom: 32,
  },

  searchRow: {
    height: 48,
    backgroundColor: tokens.color.surface.card,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.searchPaddingX,
    flexDirection: 'row',
    alignItems: 'center',
    ...tokens.shadow.soft,
  },

  searchInput: {
    flex: 1,
    color: tokens.color.text.primary,
    fontFamily: tokens.typography.family.base,
    fontSize: tokens.typography.size.body,
  },

  title: {
    paddingHorizontal: tokens.spacing.screen,
    marginBottom: 16,
    color: tokens.color.primary.midnight,
    fontFamily: tokens.typography.family.heading,
    fontSize: tokens.typography.size.title,
    lineHeight: tokens.typography.lineHeight.title,
  },

  list: {
    paddingHorizontal: tokens.spacing.screen,
    paddingBottom: 120,
  },

  column: {
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.grid,
    gap: tokens.spacing.grid,
  },

  footer: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
  },

  muted: {
    color: tokens.color.text.muted,
    fontFamily: tokens.typography.family.base,
    fontSize: tokens.typography.size.body,
  },

  errorTitle: {
    color: tokens.color.status.error,
    fontFamily: tokens.typography.family.bold,
    fontSize: tokens.typography.size.title,
  },
});
