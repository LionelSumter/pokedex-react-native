import * as SQLite from 'expo-sqlite';

export interface FavoritePokemon {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('pokedex.db');
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async addFavorite(pokemonId: number, name: string, imageUrl?: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync(
      'INSERT OR REPLACE INTO favorites (id, name, image_url) VALUES (?, ?, ?)',
      [pokemonId, name, imageUrl ?? '']
    );
  }

  async removeFavorite(pokemonId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM favorites WHERE id = ?', [pokemonId]);
  }

  async isFavorite(pokemonId: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');
    const row = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM favorites WHERE id = ?',
      [pokemonId]
    );
    return (row?.count ?? 0) > 0;
  }

  async getAllFavorites(): Promise<FavoritePokemon[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<FavoritePokemon>(
      'SELECT * FROM favorites ORDER BY created_at DESC'
    );
  }
}

export const databaseService = new DatabaseService();
