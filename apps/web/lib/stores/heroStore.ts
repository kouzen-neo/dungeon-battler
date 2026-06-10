import { create } from 'zustand';
import { HeroTemplate, heroTemplates } from '../game/heroData';
import { useStoryStore } from '../game/storyProgress';
import { useSaveStore } from './saveStore';

export interface OwnedHero extends HeroTemplate {
  instanceId: string;
  level: number;
  exp: number;
}

interface HeroState {
  ownedHeroes: OwnedHero[];
  partyIds: string[]; // instanceIds
  
  pullGacha: () => Promise<OwnedHero | null>;
  setParty: (ids: string[]) => void;
  levelUpHero: (instanceId: string) => Promise<boolean>;
}

export const useHeroStore = create<HeroState>((set, get) => ({
  ownedHeroes: [
    { ...heroTemplates.warrior, instanceId: 'init-1', level: 1, exp: 0 },
    { ...heroTemplates.mage, instanceId: 'init-2', level: 1, exp: 0 },
    { ...heroTemplates.rogue, instanceId: 'init-3', level: 1, exp: 0 },
  ],
  partyIds: ['init-1', 'init-2', 'init-3'],

  levelUpHero: async (instanceId: string) => {
    const { ownedHeroes } = get();
    const story = useStoryStore.getState();
    const save = useSaveStore.getState();
    
    const hero = ownedHeroes.find(h => h.instanceId === instanceId);
    if (!hero) return false;

    const levelCost = hero.level * 50; // Cost increases with level

    if (story.gold >= levelCost) {
      // Deduct gold
      useStoryStore.setState({ gold: story.gold - levelCost });

      // Update hero stats (10% increase per level)
      const updatedHeroes = ownedHeroes.map(h => {
        if (h.instanceId === instanceId) {
          return {
            ...h,
            level: h.level + 1,
            baseStats: {
              ...h.baseStats,
              hp: Math.floor(h.baseStats.hp * 1.1),
              atk: Math.floor(h.baseStats.atk * 1.1),
              def: Math.floor(h.baseStats.def * 1.1),
            }
          };
        }
        return h;
      });

      set({ ownedHeroes: updatedHeroes });
      await save.persistAll();
      return true;
    }
    return false;
  },

  pullGacha: async () => {
    const story = useStoryStore.getState();
    const save = useSaveStore.getState();
    const gachaCost = 100;

    if (story.gold < gachaCost) return null;

    // Deduct gold
    useStoryStore.setState({ gold: story.gold - gachaCost });

    // Random roll
    const templates = Object.values(heroTemplates);
    const rolled = templates[Math.floor(Math.random() * templates.length)];
    
    const newHero: OwnedHero = {
      ...rolled,
      instanceId: Math.random().toString(36).substr(2, 9),
      level: 1,
      exp: 0,
    };

    set((state) => ({
      ownedHeroes: [...state.ownedHeroes, newHero],
    }));

    await save.persistAll();
    return newHero;
  },

  setParty: (ids) => {
    if (ids.length <= 3) {
      set({ partyIds: ids });
    }
  }
}));
