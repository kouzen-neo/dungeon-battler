import { useEffect } from "react";
import { useBattleStore } from "../lib/stores/battleStore";

export const useBattle = () => {
  const { 
    playerParty, 
    enemies, 
    turnOrder, 
    currentTurnIndex, 
    isBattleOver, 
    attack, 
    startBattle 
  } = useBattleStore();

  const currentUnit = turnOrder[currentTurnIndex];

  // Auto-attack for enemies
  useEffect(() => {
    if (isBattleOver || !currentUnit) return;

    if (currentUnit.isEnemy) {
      const timer = setTimeout(() => {
        const targets = playerParty.filter(p => p.currentHp > 0);
        if (targets.length > 0) {
          const randomTarget = targets[Math.floor(Math.random() * targets.length)];
          attack(randomTarget.id);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUnit, isBattleOver, playerParty, attack]);

  return {
    playerParty,
    enemies,
    currentUnit,
    isBattleOver,
    attack,
    startBattle
  };
};
