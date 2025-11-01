export interface FavoritePokemon {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
}

const KEY = 'pokedex_favorites';

function readAll(): FavoritePokemon[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(items: FavoritePokemon[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

class DatabaseServiceWeb {
  async initDatabase(): Promise<void> {
    // niets nodig voor localStorage
  }

  async addFavorite(pokemonId: number, name: string, imageUrl?: string): Promise<void> {
    const items = readAll();
    const idx = items.findIndex(x => x.id === pokemonId);
    const now = new Date().toISOString();
    const row: FavoritePokemon = {
      id: pokemonId,
      name,
      image_url: imageUrl ?? '',
      created_at: now,
    };
    if (idx >= 0) items[idx] = row; else items.unshift(row);
    writeAll(items);
  }

  async removeFavorite(pokemonId: number): Promise<void> {
    writeAll(readAll().filter(x => x.id !== pokemonId));
  }

  async isFavorite(pokemonId: number): Promise<boolean> {
    return readAll().some(x => x.id === pokemonId);
  }

  async getAllFavorites(): Promise<FavoritePokemon[]> {
    return readAll();
  }
}

export const databaseService = new DatabaseServiceWeb();
