import * as SQLite from 'expo-sqlite';

export interface FavoritePokemon {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
}

class DatabaseServiceNative {
  private db: SQLite.SQLiteDatabase | null = null;
  private ready = false;

  async initDatabase(): Promise<void> {
    if (this.ready) return;
    this.db = await SQLite.openDatabaseAsync('pokedex.db');

    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        image_url TEXT DEFAULT '',
        created_at TEXT NOT NULL
      );
    `);

    this.ready = true;
  }

  private ensure(): void {
    if (!this.db || !this.ready) throw new Error('Database not initialized');
  }

  async addFavorite(pokemonId: number, name: string, imageUrl?: string): Promise<void> {
    this.ensure();
    const now = new Date().toISOString();
    await this.db!.runAsync(
      `INSERT OR REPLACE INTO favorites (id, name, image_url, created_at)
       VALUES ($id, $name, $image, $created_at);`,
      { $id: pokemonId, $name: name, $image: imageUrl ?? '', $created_at: now }
    );
  }

  async removeFavorite(pokemonId: number): Promise<void> {
    this.ensure();
    await this.db!.runAsync(`DELETE FROM favorites WHERE id = $id;`, { $id: pokemonId });
  }

  async isFavorite(pokemonId: number): Promise<boolean> {
    this.ensure();
    const row = await this.db!.getFirstAsync<{ id: number }>(
      `SELECT id FROM favorites WHERE id = $id LIMIT 1;`,
      { $id: pokemonId }
    );
    return !!row;
  }

  async getAllFavorites(): Promise<FavoritePokemon[]> {
    this.ensure();
    const rows = await this.db!.getAllAsync<FavoritePokemon>(`
      SELECT id, name, image_url, created_at
      FROM favorites
      ORDER BY datetime(created_at) DESC;
    `);
    return rows ?? [];
  }
}

export const databaseService = new DatabaseServiceNative();
