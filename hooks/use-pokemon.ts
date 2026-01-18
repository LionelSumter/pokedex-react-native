// hooks/use-pokemon.ts
import { PokeApiService } from '@/services/pokemon-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { NamedAPIResource, Pokemon } from 'pokenode-ts';

/* ---------- Types & helpers ---------- */
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

/* ---------- Eenvoudige (paged) lijst ---------- */
export const usePokemonList = (limit: number = 20, offset: number = 0) => {
  return useQuery<PokemonWithId[]>({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: async () => {
      // pokenode-ts: listPokemons(offset, limit)
      const res = await PokeApiService.listPokemons(offset, limit);
      return res.results.map(mapWithResourceId);
    },
    staleTime: 5 * 60 * 1000,
  });
};

/* ---------- Detail (op naam) ---------- */
export const usePokemonByName = (name: string) => {
  return useQuery<Pokemon>({
    queryKey: ['pokemon', name],
    queryFn: () => PokeApiService.getPokemonByName(name),
    enabled: !!name,
    staleTime: 10 * 60 * 1000,
  });
};

/* ---------- Infinite scrolling (50 per page aanbevolen) ---------- */
export const useInfinitePokemonList = (pageSize: number = 50) => {
  return useInfiniteQuery({
    queryKey: ['pokemon-infinite', pageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === 'number' ? pageParam : 0;
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


