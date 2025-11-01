// hooks/use-pokemon.ts
import { EvoApiService, PokeApiService } from '@/services/pokemon-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { ChainLink, EvolutionChain, NamedAPIResource } from 'pokenode-ts';

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

// ---------- Lijst ----------
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

// ---------- Detail (op naam) ----------
export const usePokemonByName = (name: string) => {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => PokeApiService.getPokemonByName(name),
    enabled: !!name,
    staleTime: 10 * 60 * 1000,
  });
};

// ---------- BONUS: Infinite scrolling ----------
export const useInfinitePokemonList = (pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['pokemon-infinite', pageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const offset = pageParam ?? 0;
      const data = await PokeApiService.listPokemons(offset, pageSize);
      return {
        items: data.results.map(mapWithResourceId),
        count: data.count,
        nextOffset:
          offset + pageSize < data.count ? offset + pageSize : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 5 * 60 * 1000,
  });
};

// ---------- Evolution chain helpers ----------
type EvoStep = { id: number; name: string; min_level?: number | null };

function idFromSpeciesUrl(url: string): number {
  const m = url.match(/\/pokemon-species\/(\d+)\/?$/);
  return m ? Number(m[1]) : 0;
}

function flattenChain(node: ChainLink, acc: EvoStep[] = []): EvoStep[] {
  acc.push({
    id: idFromSpeciesUrl(node.species.url),
    name: node.species.name,
    min_level: node.evolution_details?.[0]?.min_level ?? null,
  });
  for (const child of node.evolves_to ?? []) flattenChain(child, acc);
  return acc;
}

// ---------- Evolution chain op basis van naam ----------
export function useEvolutionChainByName(name: string) {
  // 1) species (uit PokemonClient) → bevat evolution_chain url
  const speciesQuery = useQuery({
    queryKey: ['species', name],
    queryFn: () => PokeApiService.getPokemonSpeciesByName(name),
    enabled: !!name,
    staleTime: 10 * 60 * 1000,
  });

  const chainId =
    speciesQuery.data
      ? Number(
          speciesQuery.data.evolution_chain.url.match(
            /evolution-chain\/(\d+)/
          )?.[1] ?? ''
        )
      : undefined;

  // 2) evolution chain (uit EvolutionClient)
  const chainQuery = useQuery({
    queryKey: ['evo-chain', chainId],
    queryFn: async () => {
      const chain: EvolutionChain = await EvoApiService.getEvolutionChainById(
        chainId!
      );
      return chain;
    },
    enabled: !!chainId,
    staleTime: 10 * 60 * 1000,
  });

  // 3) vlakke lijst van stappen
  const steps: EvoStep[] =
    chainQuery.data?.chain ? flattenChain(chainQuery.data.chain) : [];

  return {
    steps,
    isLoading: speciesQuery.isLoading || chainQuery.isLoading,
    error: speciesQuery.error || chainQuery.error,
  };
}
