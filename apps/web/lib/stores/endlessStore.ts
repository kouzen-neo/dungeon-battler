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
      
      incrementFloor: () => set((state) => {
        const nextFloor = state.currentFloor + 1;
        const newMax = Math.max(state.maxFloorReached, state.currentFloor);
        
        // Trigger background sync if high score reached
        if (state.currentFloor > state.maxFloorReached) {
          fetch('/api/leaderboard', {
            method: 'POST',
            body: JSON.stringify({ userId: 'local-player', score: state.currentFloor }),
            headers: { 'Content-Type': 'application/json' }
          }).catch(console.error);
        }

        return { 
          currentFloor: nextFloor,
          maxFloorReached: newMax
        };
      }),
      
      resetFloor: () => set({ currentFloor: 1 }),
      
      setMaxFloor: (floor) => set({ maxFloorReached: floor }),
    }),
    {
      name: 'dungeon-endless-storage',
    }
  )
);
