// app/(tabs)/index.tsx
import { PokemonWithId, usePokemonList } from '@/hooks/use-pokemon';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllPokemonScreen() {
  // Voorbeeld: 20 items vanaf offset 0
  const { data: pokemonList, isLoading, error } = usePokemonList(20, 0);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Loading Pokémon...</Text>
      </View>
    );
  }

  if (error instanceof Error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading Pokémon:</Text>
        <Text style={styles.infoText}>{error.message}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: PokemonWithId }) => {
    const label = item.id ? `#${item.id.padStart(3, '0')}` : '';
    return (
      <Pressable
        onPress={() => router.push(`/pokemon/${item.name}`)}
        style={styles.pokemonItem}
      >
        <Text style={styles.pokemonName}>{item.name}</Text>
        <Text style={styles.pokemonId}>ID: {label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Pokémon List ({pokemonList?.length || 0})
        </Text>
      </View>

      <FlatList
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E9F2F8' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  title: { fontSize: 28, fontWeight: '800', color: '#0B1026' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoText: { marginTop: 8, fontSize: 16, color: '#374151' },
  errorText: { fontSize: 18, fontWeight: '700', color: '#DC2626' },
  pokemonItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  pokemonName: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  pokemonId: { marginTop: 4, color: '#6B7280', fontWeight: '600' },
});
