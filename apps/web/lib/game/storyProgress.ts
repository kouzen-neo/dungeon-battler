import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StoryState {
  currentFloor: number;
  maxFloorReached: number;
  gold: number;
  
  addGold: (amount: number) => void;
  completeFloor: (floor: number, goldReward: number) => void;
  resetProgress: () => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      currentFloor: 1,
      maxFloorReached: 1,
      gold: 0,

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

      completeFloor: (floor, goldReward) => set((state) => ({
        currentFloor: floor + 1,
        maxFloorReached: Math.max(state.maxFloorReached, floor + 1),
        gold: state.gold + goldReward,
      })),

      resetProgress: () => set({ currentFloor: 1, gold: 0 }),
    }),
    {
      name: "dungeon-story-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
