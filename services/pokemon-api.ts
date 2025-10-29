// services/pokemon-api.ts
import { PokemonClient } from 'pokenode-ts';

// ✅ Eén gedeelde instantie van de PokéAPI-client
export const PokeApiService = new PokemonClient();
