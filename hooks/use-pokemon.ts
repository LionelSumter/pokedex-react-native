// hooks/use-pokemon.ts
import { PokeApiService } from '@/services/pokemon-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { NamedAPIResource } from 'pokenode-ts';

// ---------- Types & helpers ----------
export type PokemonWithId = NamedAPIResource & { id: string };

export function getPokemonIdFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? match[1] : null;
}

const mapWithResourceId = (r: NamedAPIResource): PokemonWithId => {
  const id = getPokemonIdFromUrl(r.url) ?? '';
  return { id, ...r };
};

// ---------- Hook 1: Pokémon lijst ----------
export const usePokemonList = (limit: number = 20, offset: number = 0) => {
  return useQuery<PokemonWithId[]>({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: async () => {
      const res = await PokeApiService.listPokemons(offset, limit);
      return res.results.map(mapWithResourceId);
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ---------- ✅ Hook 2: Pokémon detail (op naam) ----------
export const usePokemonByName = (name: string) => {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => PokeApiService.getPokemonByName(name),
    enabled: !!name, // alleen fetchen als er een naam is
    staleTime: 10 * 60 * 1000, // 10 minuten cache
  });
};

// ---------- ⭐ BONUS: Infinite scrolling ----------
export const useInfinitePokemonList = (pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['pokemon-infinite', pageSize],
    initialPageParam: 0, // offset start
    queryFn: async ({ pageParam }) => {
      const offset = pageParam ?? 0;
      const data = await PokeApiService.listPokemons(offset, pageSize);
      return {
        items: data.results.map(mapWithResourceId),
        count: data.count,
        nextOffset: offset + pageSize < data.count ? offset + pageSize : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 5 * 60 * 1000,
  });
};
