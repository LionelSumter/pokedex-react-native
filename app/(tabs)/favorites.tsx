// app/(tabs)/favorites.tsx
import { useFavorites, useFavoriteStats } from '@/hooks/use-favorites';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { data: favorites, isLoading, error } = useFavorites();
  const { data: stats } = useFavoriteStats();

  const openDetail = (name: string) => router.push(`/pokemon/${name}`);

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}><Text style={s.title}>My Favorites</Text></View>
        <View style={s.center}><ActivityIndicator size="large" /><Text style={s.muted}>Loading…</Text></View>
      </SafeAreaView>
    );
  }

  if (error || !favorites?.length) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}><Text style={s.title}>My Favorites</Text></View>
        <View style={s.center}><Text style={s.muted}>No favorites yet</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>My Favorites</Text>
        {stats && (
          <Text style={s.subtitle}>
            {stats.count} saved · avg exp {stats.avgBaseExp} · avg {stats.avgWeightKg}kg / {stats.avgHeightM}m
          </Text>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={s.card} onPress={() => openDetail(item.name)}>
            <View style={s.left}>
              <Image
                source={{ uri: item.image_url || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png` }}
                style={s.img}
              />
            </View>
            <View style={s.right}>
              <View style={s.badge}><Text style={s.badgeText}>#{String(item.id).padStart(3, '0')}</Text></View>
              <Text style={s.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FB' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '900', color: '#0B1026' },
  subtitle: { marginTop: 2, color: '#6B7280', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { marginTop: 8, color: '#6B7280', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    marginBottom: 12, shadowColor: '#1D1D1D', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  left: { width: 96, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  img: { width: 72, height: 72, resizeMode: 'contain' },
  right: { flex: 1, padding: 14, justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', backgroundColor: '#ECE7FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginBottom: 6 },
  badgeText: { color: '#4F46E5', fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '900', color: '#0B1026' },
});
