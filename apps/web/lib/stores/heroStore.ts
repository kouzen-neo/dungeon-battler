import { create } from 'zustand';
import { HeroTemplate, heroTemplates } from '../game/heroData';
import { useStoryStore } from '../game/storyProgress';
import { useSaveStore } from './saveStore';
import { useMissionStore } from './missionStore';

export interface OwnedHero extends HeroTemplate {
  instanceId: string;
  level: number;
  stars: number;
  exp: number;
}

interface HeroState {
  ownedHeroes: OwnedHero[];
  partyIds: string[]; // instanceIds
  shards: Record<string, number>; // templateId -> count
  pityCounter: number;
  
  pullGacha: () => Promise<{ hero: OwnedHero | null, isNew: boolean, shardsAwarded?: number }>;
  setParty: (ids: string[]) => void;
  levelUpHero: (instanceId: string) => Promise<boolean>;
  upgradeStar: (instanceId: string) => Promise<boolean>;
}

export const useHeroStore = create<HeroState>((set, get) => ({
  ownedHeroes: [
    { ...heroTemplates.warrior, instanceId: 'init-1', level: 1, stars: 1, exp: 0 },
    { ...heroTemplates.mage, instanceId: 'init-2', level: 1, stars: 1, exp: 0 },
    { ...heroTemplates.rogue, instanceId: 'init-3', level: 1, stars: 1, exp: 0 },
  ],
  partyIds: ['init-1', 'init-2', 'init-3'],
  shards: {},
  pityCounter: 0,

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
      useMissionStore.getState().incrementLevel();
      await save.persistAll();
      return true;
    }
    return false;
  },

  pullGacha: async () => {
    const { pityCounter, ownedHeroes } = get();
    const story = useStoryStore.getState();
    const save = useSaveStore.getState();
    const gachaCost = 100; // 100 Gems per pull

    if (story.gems < gachaCost) return { hero: null, isNew: false };

    // Deduct gems
    useStoryStore.setState({ gems: story.gems - gachaCost });

    const newPity = pityCounter + 1;
    let rolledRarity: "R" | "SR" | "SSR" = "R";

    // Weighted RNG: 70% R, 25% SR, 5% SSR
    if (newPity >= 50) {
      rolledRarity = "SSR";
      set({ pityCounter: 0 });
    } else {
      const roll = Math.random() * 100;
      if (roll < 5) {
        rolledRarity = "SSR";
        set({ pityCounter: 0 });
      } else if (roll < 30) {
        rolledRarity = "SR";
        set({ pityCounter: newPity });
      } else {
        rolledRarity = "R";
        set({ pityCounter: newPity });
      }
    }

    // Filter templates by rarity
    const possibleHeroes = Object.values(heroTemplates).filter(h => h.rarity === rolledRarity);
    const rolled = possibleHeroes[Math.floor(Math.random() * possibleHeroes.length)];
    
    // Check if duplicate
    const existingHero = ownedHeroes.find(h => h.id === rolled.id);
    
    if (existingHero) {
      // Award Shards instead of new instance
      const shardMap = { "R": 10, "SR": 30, "SSR": 100 };
      const amount = shardMap[rolledRarity];
      set(state => ({
        shards: {
          ...state.shards,
          [rolled.id]: (state.shards[rolled.id] || 0) + amount
        }
      }));
      await save.persistAll();
      return { hero: existingHero, isNew: false, shardsAwarded: amount };
    }

    const newHero: OwnedHero = {
      ...rolled,
      instanceId: Math.random().toString(36).substr(2, 9),
      level: 1,
      stars: 1,
      exp: 0,
    };

    set((state) => ({
      ownedHeroes: [...state.ownedHeroes, newHero],
    }));

    useMissionStore.getState().incrementSummon();
    await save.persistAll();
    return { hero: newHero, isNew: true };
  },

  setParty: (ids) => {
    if (ids.length <= 3) {
      set({ partyIds: ids });
    }
  },

  upgradeStar: async (instanceId) => {
    const { ownedHeroes, shards } = get();
    const save = useSaveStore.getState();
    const hero = ownedHeroes.find(h => h.instanceId === instanceId);
    
    if (!hero || hero.stars >= 5) return false;

    // Cost logic: 1->2 stars = 20 shards, 2->3 = 50, 3->4 = 100, 4->5 = 200
    const costs = [0, 20, 50, 100, 200];
    const cost = costs[hero.stars];
    const currentShards = shards[hero.id] || 0;

    if (currentShards < cost) return false;

    // Deduct shards and increment stars
    const updatedHeroes = ownedHeroes.map(h => {
      if (h.instanceId === instanceId) {
        return {
          ...h,
          stars: h.stars + 1,
          baseStats: {
            ...h.baseStats,
            hp: Math.floor(h.baseStats.hp * 1.2), // 20% buff per star
            atk: Math.floor(h.baseStats.atk * 1.2),
            def: Math.floor(h.baseStats.def * 1.2),
          }
        };
      }
      return h;
    });

    set(state => ({
      ownedHeroes: updatedHeroes,
      shards: {
        ...state.shards,
        [hero.id]: state.shards[hero.id] - cost
      }
    }));

    await save.persistAll();
    return true;
  },
}));
