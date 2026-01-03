import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    ActionSheetIOS,
    Alert,
    Image,
    Platform,
    Pressable,
    Share,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export type PokemonCardItem = {
  id: number | string;
  name: string;
  imageUrl?: string;
};

type Props = {
  item: PokemonCardItem;
};

export default function PokemonCard({ item }: Props) {
  const id = Number(item.id);
  const idLabel = `#${String(id).padStart(3, '0')}`;

  const imageUrl =
    item.imageUrl ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  const { data: isFav } = useIsFavorite(id);
  const toggle = useToggleFavorite();

  const openDetail = () => router.push(`/pokemon/${item.name}`);

  const toggleFavorite = () =>
    toggle.mutate({
      pokemonId: id,
      name: item.name,
      imageUrl,
      isCurrentlyFavorite: !!isFav,
    });

  const sharePokemon = async () => {
    await Share.share({
      message: `${item.name} ${idLabel}\n${imageUrl}`,
    });
  };

  const openActions = () => {
    const favLabel = isFav ? 'Remove from favorites' : 'Add to favorites';

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Open Pokémon', favLabel, 'Share', 'Cancel'],
          cancelButtonIndex: 3,
        },
        (i) => {
          if (i === 0) openDetail();
          if (i === 1) toggleFavorite();
          if (i === 2) sharePokemon();
        }
      );
    } else {
      Alert.alert(item.name, undefined, [
        { text: 'Open Pokémon', onPress: openDetail },
        { text: favLabel, onPress: toggleFavorite },
        { text: 'Share', onPress: sharePokemon },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  return (
    <Pressable onPress={openDetail} style={({ pressed }) => [s.card, pressed && s.pressed]}>
      <View style={s.topRow}>
        <View style={s.idBadge}>
          <Text style={s.idText}>{idLabel}</Text>
        </View>

        <Pressable
          hitSlop={12}
          onPress={(e) => {
            e.stopPropagation();
            openActions();
          }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
        </Pressable>
      </View>

      <Image source={{ uri: imageUrl }} style={s.image} resizeMode="contain" />
      <Text numberOfLines={1} style={s.name}>{item.name}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pressed: { opacity: 0.85 },

  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idBadge: {
    backgroundColor: '#6E56CF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  idText: { color: '#FFF', fontWeight: '700', fontSize: 12 },

  image: { width: 80, height: 80, marginVertical: 10 },
  name: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
});
