import PokemonCard from '@/components/ui/pokemon-card';
import { PokemonWithId, useInfinitePokemonList } from '@/hooks/use-pokemon';
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
    const s = search.toLowerCase().trim();
    return s ? allItems.filter((p) => p.name.includes(s)) : allItems;
  }, [allItems, search]);

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error instanceof Error) {
    return (
      <SafeAreaView style={s.safe}>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.searchWrap}>
        <TextInput
          placeholder="Search Pokémon..."
          value={search}
          onChangeText={setSearch}
          style={s.search}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={s.column}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <PokemonCard item={{ id: item.id, name: item.name }} />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator /> : null
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E9F2F8' },
  searchWrap: { padding: 16 },
  search: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  column: { justifyContent: 'space-between', marginBottom: 12 },
});
