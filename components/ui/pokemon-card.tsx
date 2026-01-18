import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { useTokens } from '@/hooks/use-tokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  Pressable,
  Share,
  Text,
  View
} from 'react-native';

export type PokemonCardItem = {
  id: number | string;
  name: string;
};

type Props = {
  item: PokemonCardItem;
};

export default function PokemonCard({ item }: Props) {
  const tokens = useTokens();

  const id = Number(item.id);
  const label = String(id).padStart(3, '0');

  // ✅ Lists always use classic sprite
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

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
    try {
      await Share.share({
        message: `${item.name} #${label}\n${imageUrl}`,
      });
    } catch  {
      // intentionally empty (no console logs)
    }
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
    <Pressable
      onPress={openDetail}
      style={({ pressed }) => [s.card(tokens), pressed && s.cardPressed]}
    >
      {/* Image well */}
      <View style={s.imageWell(tokens)}>
        <View style={s.badge(tokens)}>
          <Text style={s.badgeText(tokens)}>{label}</Text>
        </View>

        {/* ✅ Render at fixed size to avoid stretching / washed look */}
        <Image source={{ uri: imageUrl }} style={s.sprite} resizeMode="contain" />
      </View>

      {/* Bottom row */}
      <View style={s.bottomRow(tokens)}>
        <Text numberOfLines={1} style={s.name(tokens)}>
          {item.name}
        </Text>

        <Pressable
          hitSlop={12}
          style={s.kebabBtn(tokens)}
          onPress={(e) => {
            e.stopPropagation();
            openActions();
          }}
          accessibilityRole="button"
          accessibilityLabel="Open actions"
        >
          <Ionicons name="ellipsis-vertical" size={18} color={tokens.color.icon.muted} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const s = {
  card: (tokens: any) =>
    ({
      width: '48%',
      backgroundColor: tokens.color.surface.card,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.cardPadding,
      ...tokens.shadow.soft,
    } as const),

  cardPressed: { opacity: 0.9 } as const,

  // Full-bleed image area (no white space top/sides)
  imageWell: (tokens: any) =>
    ({
      marginHorizontal: -tokens.spacing.cardPadding,
      marginTop: -tokens.spacing.cardPadding,

      height: 163,
      backgroundColor: tokens.color.surface.imageWell,
      borderTopLeftRadius: tokens.radius.md,
      borderTopRightRadius: tokens.radius.md,

      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    } as const),

  // ID badge inside the image well (top-left)
  badge: (tokens: any) =>
    ({
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: tokens.color.primary.purple,
      borderRadius: tokens.radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 4,
      zIndex: 2,
    } as const),

  badgeText: (tokens: any) =>
    ({
      color: tokens.color.text.onPrimary,
      fontFamily: tokens.typography.family.bold,
      fontSize: tokens.typography.size.badge,
    } as const),

  // ✅ Fixed size = less blur than scaling to 90–100%
  sprite: {
    width: '75%',
    height: '75%',
    flexShrink: 0,
  } as const,

  bottomRow: (tokens: any) =>
    ({
      marginTop: tokens.spacing.cardContentGap,
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    } as const),

  name: (tokens: any) =>
    ({
      flex: 1,
      color: tokens.color.text.primary,
      fontFamily: tokens.typography.family.bold,
      fontSize: tokens.typography.size.body,
      lineHeight: tokens.typography.lineHeight.body,
      textTransform: 'capitalize',
    } as const),

  kebabBtn: (tokens: any) =>
    ({
      width: 28,
      height: 28,
      borderRadius: tokens.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    } as const),
};
