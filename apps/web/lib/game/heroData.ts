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
  ultimateSkill: HeroSkill;
}

export const heroTemplates: Record<string, HeroTemplate> = {
  warrior: {
    id: "warrior",
    name: "Flame Knight",
    type: "Warrior",
    rarity: "R",
    icon: "⚔️",
    baseStats: { hp: 100, atk: 15, def: 8, spd: 10, element: "FIRE", energy: 0, maxEnergy: 100 },
    skill: {
      name: "Cleave",
      description: "Serang barisan depan dan tengah musuh (1.2x DMG).",
      cooldown: 3,
      targetType: 'FRONT_MID_ENEMIES',
      damageMultiplier: 1.2
    },
    ultimateSkill: {
      name: "Inferno Strike",
      description: "Ledakan api dahsyat ke seluruh musuh (2.5x DMG).",
      cooldown: 0,
      targetType: 'ALL_ENEMIES',
      damageMultiplier: 2.5
    }
  },
  mage: {
    id: "mage",
    name: "Frost Mage",
    type: "Mage",
    rarity: "R",
    icon: "❄️",
    baseStats: { hp: 80, atk: 20, def: 4, spd: 8, element: "WATER", energy: 0, maxEnergy: 100 },
    skill: {
      name: "Elemental Burst",
      description: "Serang semua musuh sekaligus (0.8x DMG).",
      cooldown: 4,
      targetType: 'ALL_ENEMIES',
      damageMultiplier: 0.8
    },
    ultimateSkill: {
      name: "Absolute Zero",
      description: "Membekukan dan menghancurkan semua musuh (2.0x DMG).",
      cooldown: 0,
      targetType: 'ALL_ENEMIES',
      damageMultiplier: 2.0
    }
  },
  rogue: {
    id: "rogue",
    name: "Wind Rogue",
    type: "Rogue",
    rarity: "R",
    icon: "🗡️",
    baseStats: { hp: 90, atk: 12, def: 5, spd: 15, element: "WIND", energy: 0, maxEnergy: 100 },
    skill: {
      name: "Assassinate",
      description: "Serangan mematikan ke satu target (2.5x DMG).",
      cooldown: 3,
      targetType: 'SINGLE_ENEMY',
      damageMultiplier: 2.5
    },
    ultimateSkill: {
      name: "Hurricane Dance",
      description: "Serangkaian serangan cepat ke target tunggal (5.0x DMG).",
      cooldown: 0,
      targetType: 'SINGLE_ENEMY',
      damageMultiplier: 5.0
    }
  },
  paladin: {
    id: "paladin",
    name: "Holy Bastion",
    type: "Tank",
    rarity: "SR",
    icon: "🛡️",
    baseStats: { hp: 150, atk: 10, def: 15, spd: 5, element: "EARTH", energy: 0, maxEnergy: 100 },
    skill: {
      name: "Holy Light",
      description: "Pulihkan 30% Max HP seluruh anggota Party.",
      cooldown: 4,
      targetType: 'ALL_ALLIES',
      healPercentage: 0.3
    },
    ultimateSkill: {
      name: "Divine Aegis",
      description: "Pulihkan 100% HP seluruh party dan bersihkan debuff.",
      cooldown: 0,
      targetType: 'ALL_ALLIES',
      healPercentage: 1.0
    }
  },
  assassin: {
    id: "assassin",
    name: "Shadow Blade",
    type: "Assassin",
    rarity: "SSR",
    icon: "🌑",
    baseStats: { hp: 85, atk: 25, def: 4, spd: 20, element: "WIND", energy: 0, maxEnergy: 100 },
    skill: {
      name: "Shadow Strike",
      description: "Serangan instan super cepat (3.0x DMG).",
      cooldown: 5,
      targetType: 'SINGLE_ENEMY',
      damageMultiplier: 3.0
    },
    ultimateSkill: {
      name: "Nightfall",
      description: "Serangan area bayangan yang menghancurkan (4.0x DMG).",
      cooldown: 0,
      targetType: 'ALL_ENEMIES',
      damageMultiplier: 4.0
    }
  }
};
