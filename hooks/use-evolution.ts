// hooks/use-evolution.ts
import { EvoApiService, PokeApiService } from '@/services/pokemon-api';
import { useQuery } from '@tanstack/react-query';
import type { ChainLink, EvolutionChain } from 'pokenode-ts';

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

export function useEvolutionChainByName(name: string) {
  // 1) species → evolution_chain url
  const speciesQuery = useQuery({
    queryKey: ['species', name],
    queryFn: () => PokeApiService.getPokemonSpeciesByName(name),
    enabled: !!name,
    staleTime: 10 * 60 * 1000,
  });

  const chainId =
    speciesQuery.data
      ? Number(
          speciesQuery.data.evolution_chain.url.match(/evolution-chain\/(\d+)/)?.[1] ??
            ''
        )
      : undefined;

  // 2) evolution chain
  const chainQuery = useQuery({
    queryKey: ['evo-chain', chainId],
    queryFn: async () => {
      const chain: EvolutionChain = await EvoApiService.getEvolutionChainById(chainId!);
      return chain;
    },
    enabled: !!chainId,
    staleTime: 10 * 60 * 1000,
  });

  const steps: EvoStep[] = chainQuery.data?.chain
    ? flattenChain(chainQuery.data.chain)
    : [];

  return {
    steps,
    isLoading: speciesQuery.isLoading || chainQuery.isLoading,
    error: speciesQuery.error || chainQuery.error,
  };
}
