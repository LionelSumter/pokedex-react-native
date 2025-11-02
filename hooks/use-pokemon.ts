import { EvoApiService, PokeApiService } from '@/services/pokemon-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type {
    ChainLink,
    EvolutionChain,
    NamedAPIResource,
    Pokemon,
    PokemonSpecies
} from 'pokenode-ts';

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
  return useQuery<PokemonWithId[], Error>({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: async () => {
      const res = await PokeApiService.listPokemons(offset, limit);
      return res.results.map(mapWithResourceId);
    },
    staleTime: 5 * 60 * 1000
  });
};

/* ---------- Detail (op naam) ---------- */
export const usePokemonByName = (name: string) => {
  return useQuery<Pokemon, Error>({
    queryKey: ['pokemon', name],
    queryFn: () => PokeApiService.getPokemonByName(name),
    enabled: !!name,
    staleTime: 10 * 60 * 1000
  });
};

/* ---------- Infinite scrolling (50 per page aanbevolen) ---------- */
type PokemonPage = {
  items: PokemonWithId[];
  count: number;
  nextOffset?: number;
};

export const useInfinitePokemonList = (pageSize: number = 50) => {
  return useInfiniteQuery<PokemonPage, Error, PokemonPage, ['pokemon-infinite', number], number>({
    queryKey: ['pokemon-infinite', pageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === 'number' ? pageParam : 0;
      const data = await PokeApiService.listPokemons(offset, pageSize);
      return {
        items: data.results.map(mapWithResourceId),
        count: data.count,
        nextOffset: offset + pageSize < data.count ? offset + pageSize : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 5 * 60 * 1000
  });
};

/* ---------- Evolution chain ---------- */
type EvoStep = { id: number; name: string; min_level?: number | null };

function idFromSpeciesUrl(url: string): number {
  const m = url.match(/\/pokemon-species\/(\d+)\/?$/);
  return m ? Number(m[1]) : 0;
}

function flattenChain(node: ChainLink, acc: EvoStep[] = []): EvoStep[] {
  acc.push({
    id: idFromSpeciesUrl(node.species.url),
    name: node.species.name,
    min_level: node.evolution_details?.[0]?.min_level ?? null
  });
  for (const child of node.evolves_to ?? []) flattenChain(child, acc);
  return acc;
}

export function useEvolutionChainByName(name: string) {
  // 1) species → evolution_chain url
  const speciesQuery = useQuery<PokemonSpecies, Error>({
    queryKey: ['species', name],
    queryFn: () => PokeApiService.getPokemonSpeciesByName(name),
    enabled: !!name,
    staleTime: 10 * 60 * 1000
  });

  const chainId =
    speciesQuery.data
      ? Number(speciesQuery.data.evolution_chain.url.match(/evolution-chain\/(\d+)/)?.[1] ?? '')
      : undefined;

  // 2) evolution chain
  const chainQuery = useQuery<EvolutionChain, Error>({
    queryKey: ['evo-chain', chainId],
    queryFn: async () => {
      const chain = await EvoApiService.getEvolutionChainById(chainId!);
      return chain;
    },
    enabled: !!chainId,
    staleTime: 10 * 60 * 1000
  });

  const steps: EvoStep[] = chainQuery.data?.chain ? flattenChain(chainQuery.data.chain) : [];

  return {
    steps,
    isLoading: speciesQuery.isLoading || chainQuery.isLoading,
    error: speciesQuery.error || chainQuery.error
  };
}
