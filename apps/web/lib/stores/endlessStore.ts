import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EndlessState {
  currentFloor: number;
  maxFloorReached: number;
  incrementFloor: () => void;
  resetFloor: () => void;
  setMaxFloor: (floor: number) => void;
}

export const useEndlessStore = create<EndlessState>()(
  persist(
    (set) => ({
      currentFloor: 1,
      maxFloorReached: 0,
      
      incrementFloor: () => set((state) => ({ 
        currentFloor: state.currentFloor + 1,
        maxFloorReached: Math.max(state.maxFloorReached, state.currentFloor)
      })),
      
      resetFloor: () => set({ currentFloor: 1 }),
      
      setMaxFloor: (floor) => set({ maxFloorReached: floor }),
    }),
    {
      name: 'dungeon-endless-storage',
    }
  )
);
