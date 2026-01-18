import PokemonCard from '@/components/ui/pokemon-card';
import { useFavorites } from '@/hooks/use-favorites';
import { useTokens } from '@/hooks/use-tokens';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const tokens = useTokens();
  const styles = makeStyles(tokens);

  const { data: favorites, isLoading, error } = useFavorites();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.infoText}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error instanceof Error) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading favorites:</Text>
          <Text style={styles.infoText}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <PokemonCard
      item={{
        id: item.pokemonId ?? item.id,
        name: item.name,
      }}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.topPad}>
        <Text style={styles.listTitle}>My favorites</Text>
      </View>

      <FlatList
        data={favorites ?? []}
        renderItem={renderItem}
        keyExtractor={(item: any) => String(item.pokemonId ?? item.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorites yet…</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const makeStyles = (tokens: any) =>
  StyleSheet.create({
    // 1-op-1 dezelfde basis als Home
    safe: { flex: 1, backgroundColor: tokens.color.surface.background },

    topPad: {
      paddingTop: 60,
    },

    listTitle: {
      fontFamily: tokens.typography.family.heading,
      fontSize: tokens.typography.size.title,
      lineHeight: tokens.typography.lineHeight.title,
      color: tokens.color.text.primary,
      paddingHorizontal: tokens.spacing.screen,
      marginBottom: 16,
    },

    listContainer: {
      paddingHorizontal: tokens.spacing.screen,
      paddingBottom: 120,
    },

    column: {
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.grid,
      gap: tokens.spacing.grid,
    },

    emptyContainer: { alignItems: 'center', marginTop: 40 },
    emptyText: {
      fontFamily: tokens.typography.family.bold,
      fontSize: tokens.typography.size.body,
      color: tokens.color.text.placeholder,
    },

    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    infoText: {
      marginTop: tokens.spacing.sm,
      fontFamily: tokens.typography.family.base,
      fontSize: tokens.typography.size.body,
      color: tokens.color.text.muted,
    },
    errorText: {
      fontFamily: tokens.typography.family.bold,
      fontSize: 18,
      color: tokens.color.status.error,
    },
  });
