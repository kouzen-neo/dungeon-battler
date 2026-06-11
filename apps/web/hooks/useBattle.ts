import { useEffect } from "react";
import { useBattleStore } from "../lib/stores/battleStore";

export const useBattle = () => {
  const { 
    playerParty, 
    enemies, 
    turnOrder, 
    currentTurnIndex, 
    isBattleOver, 
    isAutoBattle,
    attack, 
    useSkill,
    useUltimate,
    useItem,
    startBattle,
    toggleAutoBattle,
    activeSkillName
  } = useBattleStore();

  const currentUnit = turnOrder[currentTurnIndex];

  // Auto-attack for enemies AND player (if auto-battle is on)
  useEffect(() => {
    if (isBattleOver || !currentUnit) return;

    if (currentUnit.isEnemy || isAutoBattle) {
      const timer = setTimeout(() => {
        const isPlayerTurn = !currentUnit.isEnemy;
        const targets = isPlayerTurn 
          ? enemies.filter(e => e.currentHp > 0)
          : playerParty.filter(p => p.currentHp > 0);

        if (targets.length > 0) {
          if (isPlayerTurn) {
            // Auto Logic: Ultimate > Skill > Attack
            if (currentUnit.currentEnergy >= currentUnit.maxEnergy) {
              useUltimate();
            } else if (currentUnit.skillCooldown === 0) {
              useSkill();
            } else {
              attack(targets[0].id);
            }
          } else {
            // Enemy Logic: Weighted targeting based on positions
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
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUnit, isBattleOver, isAutoBattle, playerParty, enemies, attack, useSkill, useUltimate]);

  return {
    playerParty,
    enemies,
    currentUnit,
    isBattleOver,
    isAutoBattle,
    attack,
    useSkill,
    useUltimate,
    useItem,
    startBattle,
    toggleAutoBattle,
    activeSkillName
  };
};
