import { CombatStats, ElementType } from "./combat";

export interface EnemyTemplate {
  id: string;
  name: string;
  stats: CombatStats;
  spriteName: string;
}

export const enemies: Record<string, EnemyTemplate> = {
  goblin: {
    id: "goblin",
    name: "Goblin",
    stats: { hp: 30, atk: 8, def: 2, spd: 12, element: "EARTH" },
    spriteName: "goblinSprite",
  },
  orc: {
    id: "orc",
    name: "Orc",
    stats: { hp: 60, atk: 12, def: 5, spd: 6, element: "FIRE" },
    spriteName: "orcSprite",
  },
  skeleton: {
    id: "skeleton",
    name: "Skeleton",
    stats: { hp: 40, atk: 10, def: 3, spd: 15, element: "WIND" },
    spriteName: "skeletonSprite",
  },
};
