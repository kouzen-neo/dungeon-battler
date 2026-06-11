import { create } from 'zustand';

interface GameStoreState {
  version: string;
}

export const useGameStore = create<GameStoreState>((set) => ({
  version: '0.1.0',
}));
