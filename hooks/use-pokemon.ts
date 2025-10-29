// hooks/use-pokemon.ts
import { PokeApiService } from '@/services/pokemon-api';
import { useQuery } from '@tanstack/react-query';
import { NamedAPIResource } from 'pokenode-ts';

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

// Signature: (limit, offset). PokeAPI: listPokemons(offset, limit)
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
