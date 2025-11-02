import { databaseService } from '@/services/database';
import { PokeApiService } from '@/services/pokemon-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

export const favoritesKeys = {
  all: ['favorites'] as const,
  one: (id: number) => ['is-favorite', id] as const,
  stats: ['favorite-stats'] as const
};

export const useFavorites = () => {
  return useQuery({
    queryKey: favoritesKeys.all,
    queryFn: () => databaseService.getAllFavorites(),
    staleTime: 0
  });
};

export const useIsFavorite = (pokemonId: number | undefined) => {
  return useQuery({
    queryKey: favoritesKeys.one(pokemonId ?? -1),
    queryFn: () => (pokemonId ? databaseService.isFavorite(pokemonId) : false),
    enabled: !!pokemonId,
    staleTime: 0
  });
};

type ToggleVars = {
  pokemonId: number;
  name: string;
  imageUrl?: string;
  isCurrentlyFavorite: boolean;
};

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, ToggleVars>({
    mutationFn: async (vars) => {
      try {
        await Haptics.selectionAsync();
      } catch {
        // haptics optioneel
      }
      if (vars.isCurrentlyFavorite) {
        await databaseService.removeFavorite(vars.pokemonId);
      } else {
        await databaseService.addFavorite(vars.pokemonId, vars.name, vars.imageUrl);
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: favoritesKeys.all });
      qc.invalidateQueries({ queryKey: favoritesKeys.one(vars.pokemonId) });
      qc.invalidateQueries({ queryKey: favoritesKeys.stats });
    }
  });
};

/** Kleine statistieken over favorieten (limiteer tot 25 detail-calls) */
export const useFavoriteStats = () => {
  return useQuery({
    queryKey: favoritesKeys.stats,
    queryFn: async () => {
      const favs = await databaseService.getAllFavorites();
      const subset = favs.slice(0, 25);
      const details = await Promise.allSettled(
        subset.map((f) => PokeApiService.getPokemonById(f.id))
      );

      const ok = details
        .filter(
          (r): r is PromiseFulfilledResult<
            Awaited<ReturnType<typeof PokeApiService.getPokemonById>>
          > => r.status === 'fulfilled'
        )
        .map((r) => r.value);

      const count = favs.length;
      const avg = (arr: number[]) =>
        arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;

      return {
        count,
        avgBaseExp: avg(ok.map((p) => p.base_experience ?? 0)),
        avgWeightKg: avg(ok.map((p) => (p.weight ?? 0) / 10)),
        avgHeightM: avg(ok.map((p) => (p.height ?? 0) / 10))
      };
    },
    staleTime: 0
  });
};
