import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStoryStore } from '../game/storyProgress';
import { useSaveStore } from './saveStore';

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  rewardGems: number;
  rewardGold: number;
}

const DAILY_MISSIONS: Mission[] = [
  { id: 'win_battles', title: 'Battle Veteran', description: 'Win 3 battles (Story or Endless)', target: 3, rewardGold: 100, rewardGems: 10 },
  { id: 'perform_summon', title: 'New Recruits', description: 'Perform 1 Hero Summon', target: 1, rewardGold: 0, rewardGems: 20 },
  { id: 'level_up', title: 'Growth', description: 'Level up any hero once', target: 1, rewardGold: 50, rewardGems: 5 },
];

interface MissionState {
  battlesWon: number;
  summonsPerformed: number;
  levelsGained: number;
  claimedMissions: string[];
  lastResetDate: string; // ISO Date

  incrementBattle: () => void;
  incrementSummon: () => void;
  incrementLevel: () => void;
  claimMission: (id: string) => boolean;
  checkAndResetDaily: () => void;
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      battlesWon: 0,
      summonsPerformed: 0,
      levelsGained: 0,
      claimedMissions: [],
      lastResetDate: new Date().toISOString().split('T')[0],

      incrementBattle: () => set(state => ({ battlesWon: state.battlesWon + 1 })),
      incrementSummon: () => set(state => ({ summonsPerformed: state.summonsPerformed + 1 })),
      incrementLevel: () => set(state => ({ levelsGained: state.levelsGained + 1 })),

      claimMission: (id: string) => {
        const { claimedMissions, battlesWon, summonsPerformed, levelsGained } = get();
        if (claimedMissions.includes(id)) return false;

        const mission = DAILY_MISSIONS.find(m => m.id === id);
        if (!mission) return false;

        // Check if requirement met
        let currentProgress = 0;
        if (id === 'win_battles') currentProgress = battlesWon;
        else if (id === 'perform_summon') currentProgress = summonsPerformed;
        else if (id === 'level_up') currentProgress = levelsGained;

        if (currentProgress < mission.target) return false;

        // Award rewards
        const story = useStoryStore.getState();
        story.addGold(mission.rewardGold);
        story.addGems(mission.rewardGems);

        set(state => ({ claimedMissions: [...state.claimedMissions, id] }));
        useSaveStore.getState().persistAll();
        return true;
      },

      checkAndResetDaily: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastResetDate } = get();

        if (today !== lastResetDate) {
          set({
            battlesWon: 0,
            summonsPerformed: 0,
            levelsGained: 0,
            claimedMissions: [],
            lastResetDate: today
          });
        }
      }
    }),
    {
      name: 'dungeon-mission-storage',
    }
  )
);

export { DAILY_MISSIONS };
