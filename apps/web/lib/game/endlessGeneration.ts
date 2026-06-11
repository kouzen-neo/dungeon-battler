import { CombatStats, ElementType } from "./combat";

export interface EndlessEnemy {
  name: string;
  stats: CombatStats;
  spriteIndex: number; // For rendering different sprites
}

const ENEMY_TYPES = [
  { name: "Slime", baseStats: { hp: 30, atk: 8, def: 2, spd: 5 }, spriteIndex: 0 },
  { name: "Goblin", baseStats: { hp: 45, atk: 12, def: 4, spd: 10 }, spriteIndex: 1 },
  { name: "Skeleton", baseStats: { hp: 40, atk: 15, def: 3, spd: 12 }, spriteIndex: 2 },
  { name: "Orc", baseStats: { hp: 70, atk: 18, def: 8, spd: 6 }, spriteIndex: 3 },
  { name: "Shadow", baseStats: { hp: 35, atk: 25, def: 1, spd: 18 }, spriteIndex: 4 },
];

const ELEMENTS: ElementType[] = ["FIRE", "WATER", "EARTH", "WIND", "NONE"];

export const generateEndlessEnemies = (floor: number): EndlessEnemy[] => {
  const isBossFloor = floor % 10 === 0;
  const enemyCount = isBossFloor ? 1 : Math.min(3, Math.floor(floor / 15) + 1);
  
  const enemies: EndlessEnemy[] = [];
  
  // Scaling factors: steeper exponential curve
  const statMult = 1 + (floor * 0.15) + Math.pow(floor, 1.2) * 0.05;
  
  for (let i = 0; i < enemyCount; i++) {
    const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
    const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    
    let stats = {
      hp: Math.floor(type.baseStats.hp * statMult),
      atk: Math.floor(type.baseStats.atk * statMult),
      def: Math.floor(type.baseStats.def * statMult),
      spd: Math.floor(type.baseStats.spd * statMult),
      element: element
    };

    if (isBossFloor) {
      stats.hp *= 3;
      stats.atk *= 1.5;
      stats.name = `BOSS: ${type.name} Overlord`;
    }

    enemies.push({
      name: isBossFloor ? stats.name : type.name,
      stats: stats,
      spriteIndex: type.spriteIndex
    });
  }

  return enemies;
};
