import Dexie, { type Table } from 'dexie';

export interface GameSave {
  id?: number;
  currentFloor: number;
  maxFloorReached: number;
  gold: number;
  partyIds: string[];
  inventory: Array<{ itemId: string; quantity: number }>;
  updatedAt: number;
}

export class DungeonDatabase extends Dexie {
  saves!: Table<GameSave>;

  constructor() {
    super('DungeonBattlerDB');
    this.version(1).stores({
      saves: '++id, updatedAt'
    });
  }
}

export const db = new DungeonDatabase();

export const saveGame = async (data: Omit<GameSave, 'id' | 'updatedAt'>) => {
  await db.saves.put({
    ...data,
    id: 1, // We only use one save slot for now
    updatedAt: Date.now(),
  });
};

export const loadGame = async () => {
  return await db.saves.get(1);
};
