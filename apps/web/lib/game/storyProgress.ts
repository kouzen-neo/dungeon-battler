import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StoryState {
  currentFloor: number;
  maxFloorReached: number;
  gold: number;
  gems: number;
  
  addGold: (amount: number) => void;
  addGems: (amount: number) => void;
  completeFloor: (floor: number, goldReward: number, gemReward?: number) => void;
  resetProgress: () => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      currentFloor: 1,
      maxFloorReached: 1,
      gold: 0,
      gems: 0,

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

      completeFloor: (floor, goldReward, gemReward = 0) => set((state) => ({
        currentFloor: floor + 1,
        maxFloorReached: Math.max(state.maxFloorReached, floor + 1),
        gold: state.gold + goldReward,
        gems: state.gems + gemReward,
      })),

      resetProgress: () => set({ currentFloor: 1, gold: 0 }),
    }),
    {
      name: "dungeon-story-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
