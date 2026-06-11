import { CombatStats } from "./combat";

export type SkillTargetType = 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'ALL_ALLIES' | 'FRONT_MID_ENEMIES';

export interface HeroSkill {
  name: string;
  description: string;
  cooldown: number; // in turns
  targetType: SkillTargetType;
  damageMultiplier?: number;
  healPercentage?: number;
}

export interface HeroTemplate {
  id: string;
  name: string;
  type: string;
  baseStats: CombatStats;
  rarity: "R" | "SR" | "SSR";
  icon: string;
  skill: HeroSkill;
}

export const heroTemplates: Record<string, HeroTemplate> = {
  warrior: {
    id: "warrior",
    name: "Flame Knight",
    type: "Warrior",
    rarity: "R",
    icon: "⚔️",
    baseStats: { hp: 100, atk: 15, def: 8, spd: 10, element: "FIRE" },
    skill: {
      name: "Cleave",
      description: "Serang barisan depan dan tengah musuh (1.2x DMG).",
      cooldown: 3,
      targetType: 'FRONT_MID_ENEMIES',
      damageMultiplier: 1.2
    }
  },
  mage: {
    id: "mage",
    name: "Frost Mage",
    type: "Mage",
    rarity: "R",
    icon: "❄️",
    baseStats: { hp: 80, atk: 20, def: 4, spd: 8, element: "WATER" },
    skill: {
      name: "Elemental Burst",
      description: "Serang semua musuh sekaligus (0.8x DMG).",
      cooldown: 4,
      targetType: 'ALL_ENEMIES',
      damageMultiplier: 0.8
    }
  },
  rogue: {
    id: "rogue",
    name: "Wind Rogue",
    type: "Rogue",
    rarity: "R",
    icon: "🗡️",
    baseStats: { hp: 90, atk: 12, def: 5, spd: 15, element: "WIND" },
    skill: {
      name: "Assassinate",
      description: "Serangan mematikan ke satu target (2.5x DMG).",
      cooldown: 3,
      targetType: 'SINGLE_ENEMY',
      damageMultiplier: 2.5
    }
  },
  paladin: {
    id: "paladin",
    name: "Holy Bastion",
    type: "Tank",
    rarity: "SR",
    icon: "🛡️",
    baseStats: { hp: 150, atk: 10, def: 15, spd: 5, element: "EARTH" },
    skill: {
      name: "Holy Light",
      description: "Pulihkan 30% Max HP seluruh anggota Party.",
      cooldown: 4,
      targetType: 'ALL_ALLIES',
      healPercentage: 0.3
    }
  },
  assassin: {
    id: "assassin",
    name: "Shadow Blade",
    type: "Assassin",
    rarity: "SSR",
    icon: "🌑",
    baseStats: { hp: 85, atk: 25, def: 4, spd: 20, element: "WIND" },
    skill: {
      name: "Shadow Strike",
      description: "Serangan instan super cepat (3.0x DMG).",
      cooldown: 5,
      targetType: 'SINGLE_ENEMY',
      damageMultiplier: 3.0
    }
  }
};
