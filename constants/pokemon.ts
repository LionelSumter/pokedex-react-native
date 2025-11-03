// constants/pokemon.ts
export type Pokemon = {
  id: number;
  name: string;
  type: string;
};

export const pokemonData: Pokemon[] = [
  { id: 1, name: 'Pikachu', type: 'Electric' },
  { id: 2, name: 'Charmander', type: 'Fire' },
  { id: 3, name: 'Squirtle', type: 'Water' },
  { id: 4, name: 'Bulbasaur', type: 'Grass' },
  { id: 5, name: 'Charizard', type: 'Fire' },
  { id: 6, name: 'Blastoise', type: 'Water' },
  { id: 7, name: 'Venusaur', type: 'Grass' },
  { id: 8, name: 'Gengar', type: 'Ghost' },
  { id: 9, name: 'Mewtwo', type: 'Psychic' },
  { id: 10, name: 'Mew', type: 'Psychic' },
];
