// components/ui/pokemon-list.tsx
import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type PokemonListItem = {
  id: number;
  name: string;
  type?: string;
  imageUrl?: string; // optioneel; valt terug op official artwork
};

type Props = {
  data: PokemonListItem[];
  contentPadding?: number;
};

function Card({ item }: { item: PokemonListItem }) {
  const { data: isFav } = useIsFavorite(item.id);
  const toggle = useToggleFavorite();

  const id3 = String(item.id).padStart(3, '0');
  const image =
    item.imageUrl ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`;

  const openDetail = () => router.push(`/pokemon/${item.name}`);

  const doToggle = () =>
    toggle.mutate({
      pokemonId: item.id,
      name: item.name,
      imageUrl: image,
      isCurrentlyFavorite: !!isFav,
    });

  const doShare = async () => {
    try {
      await Share.share({
        message: `${item.name} #${id3}\n${image}`,
      });
    } catch (err) {
      console.warn('Share failed', err);
    }
  };

  const openMenu = () => {
    const favLabel = isFav ? 'Remove from favorites' : 'Add to favorites';
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Open Pokémon', favLabel, 'Share', 'Cancel'],
          cancelButtonIndex: 3,
        },
        (idx) => {
          if (idx === 0) openDetail();
          if (idx === 1) doToggle();
          if (idx === 2) doShare();
        }
      );
    } else {
      Alert.alert('Actions', item.name, [
        { text: 'Open Pokémon', onPress: openDetail },
        { text: favLabel, onPress: doToggle },
        { text: 'Share', onPress: doShare },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  return (
    <Pressable
      onPress={openDetail}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* top row: id + 3-dots */}
      <View style={styles.cardTopRow}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{id3}</Text>
        </View>

        {/* ✅ stopPropagation fix zodat het menu opent */}
        <Pressable
          hitSlop={12}
          style={styles.kebabBtn}
          onPress={(e) => {
            // @ts-ignore — compat tussen RN versies
            if (e?.stopPropagation) e.stopPropagation();
            openMenu();
          }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
        </Pressable>
      </View>

      {/* image */}
      <View style={styles.imageBox}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>

      {/* name (en eventueel type als je die aanlevert) */}
      <Text style={styles.name}>{item.name}</Text>
      {!!item.type && <Text style={styles.typeText}>{item.type}</Text>}
    </Pressable>
  );
}

export default function PokemonList({ data, contentPadding = 16 }: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingHorizontal: contentPadding },
      ]}
      renderItem={({ item }) => <Card item={item} />}
      ListEmptyComponent={
        <Text style={styles.empty}>Geen Pokémon gevonden…</Text>
      }
      showsVerticalScrollIndicator={false}
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
  cardPressed: {
    transform: [{ scale: Platform.select({ ios: 0.98, android: 0.99 })! }],
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: '#6E56CF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  idText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },

  kebabBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  imageBox: {
    backgroundColor: '#F1ECFF',
    borderRadius: 12,
    aspectRatio: 1.2,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '70%', height: '70%', resizeMode: 'contain' },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
  },
  typeText: { color: '#6B7280', fontSize: 12, fontWeight: '600', marginTop: 2 },

  empty: {
    padding: 16,
    textAlign: 'center',
    color: '#DC0A2D',
    fontWeight: '700',
  },
});
