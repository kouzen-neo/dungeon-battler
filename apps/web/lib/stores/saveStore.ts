import { create } from 'zustand';
import { saveGame, loadGame } from '../db/dexie';
import { useStoryStore } from '../game/storyProgress';

interface SaveState {
  isSaving: boolean;
  lastSaved: number | null;
  
  persistAll: () => Promise<void>;
  initializeFromDB: () => Promise<void>;
}

export const useSaveStore = create<SaveState>((set, get) => ({
  isSaving: false,
  lastSaved: null,

  persistAll: async () => {
    set({ isSaving: true });
    
    const story = useStoryStore.getState();
    
    await saveGame({
      currentFloor: story.currentFloor,
      maxFloorReached: story.maxFloorReached,
      gold: story.gold,
      partyIds: ['p1', 'p2', 'p3'], // Placeholder for now
      inventory: [], // Placeholder
    });

    set({ isSaving: false, lastSaved: Date.now() });
  },

  initializeFromDB: async () => {
    const data = await loadGame();
    if (data) {
      useStoryStore.setState({
        currentFloor: data.currentFloor,
        maxFloorReached: data.maxFloorReached,
        gold: data.gold,
      });
      set({ lastSaved: data.updatedAt });
    }
  }
}));
