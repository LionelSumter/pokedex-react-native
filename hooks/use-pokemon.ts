// hooks/use-pokemon.ts
import { PokeApiService } from '@/services/pokemon-api';
import { useQuery } from '@tanstack/react-query';

// ✅ Custom hook voor het ophalen van een lijst met Pokémon
export const usePokemonList = (limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: async () => {
      // 🔹 listPokemons(offset, limit) haalt data van de PokéAPI
      const response = await PokeApiService.listPokemons(offset, limit);
      return response.results; // [{ name, url }, ...]
    },
    staleTime: 1000 * 60 * 5, // 5 minuten “vers”
  });
};
