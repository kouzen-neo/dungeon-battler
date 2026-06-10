import { CombatStats } from "./combat";

export interface HeroTemplate {
  id: string;
  name: string;
  type: string;
  baseStats: CombatStats;
  rarity: "R" | "SR" | "SSR";
  icon: string;
}

export const heroTemplates: Record<string, HeroTemplate> = {
  warrior: {
    id: "warrior",
    name: "Flame Knight",
    type: "Warrior",
    rarity: "R",
    icon: "⚔️",
    baseStats: { hp: 100, atk: 15, def: 8, spd: 10, element: "FIRE" }
  },
  mage: {
    id: "mage",
    name: "Frost Mage",
    type: "Mage",
    rarity: "R",
    icon: "❄️",
    baseStats: { hp: 80, atk: 20, def: 4, spd: 8, element: "WATER" }
  },
  rogue: {
    id: "rogue",
    name: "Wind Rogue",
    type: "Rogue",
    rarity: "R",
    icon: "🗡️",
    baseStats: { hp: 90, atk: 12, def: 5, spd: 15, element: "WIND" }
  },
  paladin: {
    id: "paladin",
    name: "Holy Bastion",
    type: "Tank",
    rarity: "SR",
    icon: "🛡️",
    baseStats: { hp: 150, atk: 10, def: 15, spd: 5, element: "EARTH" }
  },
  assassin: {
    id: "assassin",
    name: "Shadow Blade",
    type: "Assassin",
    rarity: "SSR",
    icon: "🌑",
    baseStats: { hp: 85, atk: 25, def: 4, spd: 20, element: "WIND" }
  }
};
