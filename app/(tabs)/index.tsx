// app/(tabs)/index.tsx
import PokemonCard from '@/components/ui/pokemon-card';
import { getTokens } from '@/constants/tokens';
import { useColorScheme } from '@/hooks/use-color-scheme';
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
  const scheme = useColorScheme() ?? 'light';
  const t = useMemo(() => getTokens(scheme), [scheme]);

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

  const s = useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: t.color.surface.background,
        },

        topPad: {
          paddingTop: 60,
        },

        searchWrap: {
          paddingHorizontal: t.spacing.screen,
          marginBottom: 32,
        },

        searchRow: {
          height: 48,
          backgroundColor: t.color.surface.card,
          borderRadius: t.radius.md,
          paddingHorizontal: t.spacing.searchPaddingX,
          flexDirection: 'row',
          alignItems: 'center',
          ...(t.shadow?.soft ?? {}),
        },

        searchInput: {
          flex: 1,
          color: t.color.text.primary,
          fontFamily: t.typography.family.base,
          fontSize: t.typography.size.body,
        },

        title: {
          paddingHorizontal: t.spacing.screen,
          marginBottom: 16,
          color: t.color.primary.midnight,
          fontFamily: t.typography.family.heading,
          fontSize: t.typography.size.title,
          lineHeight: t.typography.lineHeight.title,
        },

        list: {
          paddingHorizontal: t.spacing.screen,
          paddingBottom: 120,
        },

        column: {
          justifyContent: 'space-between',
          marginBottom: t.spacing.grid,
          gap: t.spacing.grid,
        },

        footer: {
          paddingVertical: t.spacing.md,
          alignItems: 'center',
        },

        center: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.spacing.sm,
        },

        muted: {
          color: t.color.text.muted,
          fontFamily: t.typography.family.base,
          fontSize: t.typography.size.body,
        },

        errorTitle: {
          color: t.color.status.error,
          fontFamily: t.typography.family.bold,
          fontSize: t.typography.size.title,
        },
      }),
    [t]
  );

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
              color={t.color.text.placeholder}
              style={{ marginRight: t.spacing.sm }}
            />
            <TextInput
              placeholder="Search for Pokémon..."
              placeholderTextColor={t.color.text.placeholder}
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
