import { IconSymbol } from '@/components/ui/icon-symbol';
import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

interface FavoriteProps {
  pokemonId: number;
  pokemonName: string;
  imageUrl?: string;
}

export default function Favorite({ pokemonId, pokemonName, imageUrl }: FavoriteProps) {
  const { data: isFav } = useIsFavorite(pokemonId);
  const toggle = useToggleFavorite();

  const handleToggle = async () => {
    try {
      await Haptics.selectionAsync(); // kleine haptic
    } catch {}
    toggle.mutate({
      pokemonId,
      name: pokemonName,
      imageUrl,
      isCurrentlyFavorite: !!isFav,
    });
  };

  const filled = !!isFav;

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={handleToggle}
      disabled={toggle.isPending}
      accessibilityRole="button"
      accessibilityLabel={filled ? 'Remove from favorites' : 'Add to favorites'}
    >
      {Platform.OS === 'ios' ? (
        <IconSymbol name={filled ? 'heart.fill' : 'heart'} size={22} color={filled ? '#E11D48' : '#0B1026'} />
      ) : (
        <Ionicons name={filled ? 'heart' : 'heart-outline'} size={22} color={filled ? '#E11D48' : '#0B1026'} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
