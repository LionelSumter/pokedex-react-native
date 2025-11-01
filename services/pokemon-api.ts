// services/pokemon-api.ts
import { EvolutionClient, PokemonClient } from 'pokenode-ts';

/** Clients */
export const PokeApiService = new PokemonClient();
export const EvoApiService = new EvolutionClient();

/** Hulpfuncties */
export function getPokemonIdFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? match[1] : null;
}

export function getIdFromSpeciesUrl(url: string): number | null {
  if (!url) return null;
  const match = url.match(/\/pokemon-species\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}
