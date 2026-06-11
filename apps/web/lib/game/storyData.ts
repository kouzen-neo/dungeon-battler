import { CombatStats, ElementType } from "./combat";

export interface EnemyInstance {
  name: string;
  stats: CombatStats;
}

export interface FloorData {
  floorNumber: number;
  enemies: EnemyInstance[];
  rewardGold: number;
}

export const storyChapter1: FloorData[] = [
  {
    floorNumber: 1,
    enemies: [{ name: "Goblin Scout", stats: { hp: 40, atk: 8, def: 2, spd: 8, element: "FIRE" } }],
    rewardGold: 10,
  },
  {
    floorNumber: 2,
    enemies: [{ name: "Goblin Thief", stats: { hp: 50, atk: 10, def: 2, spd: 10, element: "WATER" } }],
    rewardGold: 15,
  },
  {
    floorNumber: 3,
    enemies: [{ name: "Goblin Warrior", stats: { hp: 70, atk: 12, def: 4, spd: 6, element: "EARTH" } }],
    rewardGold: 20,
  },
  {
    floorNumber: 4,
    enemies: [{ name: "Goblin Duo", stats: { hp: 80, atk: 11, def: 3, spd: 9, element: "FIRE" } }],
    rewardGold: 25,
  },
  {
    floorNumber: 5,
    enemies: [{ name: "Goblin Squad", stats: { hp: 100, atk: 14, def: 4, spd: 7, element: "WATER" } }],
    rewardGold: 35,
  },
  {
    floorNumber: 6,
    enemies: [{ name: "Orc Brute", stats: { hp: 140, atk: 18, def: 6, spd: 5, element: "FIRE" } }],
    rewardGold: 50,
  },
  {
    floorNumber: 7,
    enemies: [{ name: "Skeleton Archer", stats: { hp: 90, atk: 21, def: 3, spd: 12, element: "WIND" } }],
    rewardGold: 60,
  },
  {
    floorNumber: 8,
    enemies: [{ name: "Orc & Skeleton", stats: { hp: 160, atk: 20, def: 5, spd: 8, element: "EARTH" } }],
    rewardGold: 80,
  },
  {
    floorNumber: 9,
    enemies: [{ name: "Undead Guardian", stats: { hp: 200, atk: 23, def: 8, spd: 6, element: "WIND" } }],
    rewardGold: 100,
  },
  {
    floorNumber: 10,
    enemies: [{ name: "Forest Wolf (BOSS)", stats: { hp: 400, atk: 30, def: 10, spd: 18, element: "WIND" } }],
    rewardGold: 500,
  },
];
