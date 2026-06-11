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
    useSkill,
    useItem,
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
          // Weighted targeting based on positions: FRONT (50), MID (30), BACK (20)
          const weightedTargets = targets.map(target => {
            let weight = 10;
            if (target.position === 'FRONT') weight = 50;
            else if (target.position === 'MID') weight = 30;
            else if (target.position === 'BACK') weight = 20;
            return { target, weight };
          });

          const totalWeight = weightedTargets.reduce((sum, t) => sum + t.weight, 0);
          let randomNum = Math.random() * totalWeight;
          
          let selectedTarget = targets[0];
          for (const item of weightedTargets) {
            randomNum -= item.weight;
            if (randomNum <= 0) {
              selectedTarget = item.target;
              break;
            }
          }

          attack(selectedTarget.id);
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
    useSkill,
    useItem,
    startBattle
  };
};
