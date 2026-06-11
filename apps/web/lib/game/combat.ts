export type ElementType = "FIRE" | "WATER" | "EARTH" | "WIND" | "NONE";

export interface CombatStats {
  hp: number;
  atk: number;
  def: number;
  spd: number;
  element: ElementType;
}

export const getElementMultiplier = (attacker: ElementType, defender: ElementType): number => {
  const chart: Record<ElementType, Partial<Record<ElementType, number>>> = {
    FIRE: { WIND: 1.5, WATER: 0.5 },
    WATER: { FIRE: 1.5, EARTH: 0.5 },
    EARTH: { WATER: 1.5, WIND: 0.5 },
    WIND: { EARTH: 1.5, FIRE: 0.5 },
    NONE: {},
  };

  return chart[attacker]?.[defender] ?? 1.0;
};

export const calculateDamage = (attacker: CombatStats, defender: CombatStats): number => {
  const baseDamage = Math.max(1, attacker.atk - defender.def);
  const randomVariance = Math.floor(Math.random() * 5) - 2; // -2 to +2
  const multiplier = getElementMultiplier(attacker.element, defender.element);

  return Math.floor((baseDamage + randomVariance) * multiplier);
};

export const determineTurnOrder = <T extends { stats: CombatStats }>(units: T[]): T[] => {
  return [...units].sort((a, b) => b.stats.spd - a.stats.spd);
};
