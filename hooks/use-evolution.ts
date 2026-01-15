import { useEffect, useMemo, useState } from 'react';

type EvoStep = { id: number; name: string };

type State =
  | { status: 'idle' | 'loading'; data: null; error: null }
  | { status: 'success'; data: EvoStep[]; error: null }
  | { status: 'error'; data: null; error: Error };

function getIdFromSpeciesUrl(url: string): number {
  // url voorbeeld: https://pokeapi.co/api/v2/pokemon-species/25/
  const m = url.match(/\/pokemon-species\/(\d+)\//);
  return m ? Number(m[1]) : 0;
}

function flattenEvolutionChain(chainNode: any): EvoStep[] {
  // chainNode: { species: { name, url }, evolves_to: [...] }
  const out: EvoStep[] = [];

  function walk(node: any) {
    if (!node?.species?.name || !node?.species?.url) return;

    out.push({
      name: String(node.species.name),
      id: getIdFromSpeciesUrl(String(node.species.url)),
    });

    const next = Array.isArray(node.evolves_to) ? node.evolves_to : [];
    next.forEach(walk);
  }

  walk(chainNode);
  return out.filter((x) => x.id > 0 && x.name.length > 0);
}

export function useEvolutionChainByPokemonName(name: string) {
  const [state, setState] = useState<State>({
    status: name ? 'loading' : 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!name) return;

      setState({ status: 'loading', data: null, error: null });

      try {
        // 1) pokemon -> species url
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!pokemonRes.ok) throw new Error('Failed to fetch pokemon');
        const pokemonJson = await pokemonRes.json();

        const speciesUrl: string | undefined = pokemonJson?.species?.url;
        if (!speciesUrl) throw new Error('Missing species url');

        // 2) species -> evolution_chain url
        const speciesRes = await fetch(speciesUrl);
        if (!speciesRes.ok) throw new Error('Failed to fetch species');
        const speciesJson = await speciesRes.json();

        const evoUrl: string | undefined = speciesJson?.evolution_chain?.url;
        if (!evoUrl) throw new Error('Missing evolution chain url');

        // 3) evolution chain
        const evoRes = await fetch(evoUrl);
        if (!evoRes.ok) throw new Error('Failed to fetch evolution chain');
        const evoJson = await evoRes.json();

        const steps = flattenEvolutionChain(evoJson?.chain);

        if (!cancelled) {
          setState({ status: 'success', data: steps, error: null });
        }
      } catch (e: any) {
        if (!cancelled) {
          setState({ status: 'error', data: null, error: e instanceof Error ? e : new Error('Error') });
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [name]);

  return useMemo(() => {
    return {
      data: state.status === 'success' ? state.data : null,
      isLoading: state.status === 'loading',
      error: state.status === 'error' ? state.error : null,
    };
  }, [state]);
}
