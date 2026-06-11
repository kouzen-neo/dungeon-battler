import { create } from "zustand";
import { CombatStats, calculateDamage, determineTurnOrder } from "../game/combat";
import { HeroSkill } from "../game/heroData";

export type UnitPosition = 'FRONT' | 'MID' | 'BACK' | 'ENEMY';

export interface BattleUnit {
  id: string;
  name: string;
  stats: CombatStats;
  currentHp: number;
  isEnemy: boolean;
  position: UnitPosition;
  skillCooldown: number;
  skill?: HeroSkill;
}

interface BattleState {
  playerParty: BattleUnit[];
  enemies: BattleUnit[];
  turnOrder: BattleUnit[];
  currentTurnIndex: number;
  isBattleOver: boolean;
  winner: "player" | "enemy" | null;
  logs: string[];
  
  // Animation State
  attackingId: string | null;
  targetId: string | null;
  damagePopups: Array<{ id: number, value: number, x: number, y: number }>;

  startBattle: (party: BattleUnit[], enemies: BattleUnit[]) => void;
  nextTurn: () => void;
  attack: (targetId: string) => Promise<void>;
  useSkill: () => Promise<void>;
  swapPositions: (id1: string, id2: string) => void;
  addLog: (log: string) => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleState>((set, get) => ({
  playerParty: [],
  enemies: [],
  turnOrder: [],
  currentTurnIndex: 0,
  isBattleOver: false,
  winner: null,
  logs: [],
  attackingId: null,
  targetId: null,
  damagePopups: [],

  resetBattle: () => set({
    playerParty: [],
    enemies: [],
    turnOrder: [],
    currentTurnIndex: 0,
    isBattleOver: false,
    winner: null,
    attackingId: null,
    targetId: null,
    damagePopups: [],
    logs: []
  }),

  startBattle: (party, enemies) => {
    const turnOrder = determineTurnOrder([...party, ...enemies]);
    set({
      playerParty: party,
      enemies: enemies,
      turnOrder: turnOrder,
      currentTurnIndex: 0,
      isBattleOver: false,
      winner: null,
      logs: ["Battle started!"],
      attackingId: null,
      targetId: null,
      damagePopups: [],
    });
  },

  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 50) })),

  attack: async (targetId) => {
    const { turnOrder, currentTurnIndex, playerParty, enemies, addLog } = get();
    const attacker = turnOrder[currentTurnIndex];
    
    if (!attacker || attacker.currentHp <= 0) return;

    let target = [...playerParty, ...enemies].find(u => u.id === targetId);
    if (!target || target.currentHp <= 0) return;

    // Animation: Start
    set({ attackingId: attacker.id, targetId: target.id });

    const damage = calculateDamage(attacker.stats, target.stats);
    const newHp = Math.max(0, target.currentHp - damage);

    const targetIndex = target.isEnemy 
      ? enemies.findIndex(e => e.id === target.id)
      : playerParty.findIndex(p => p.id === target.id);
      
    // Exact canvas coordinates for accuracy
    const popupX = target.isEnemy ? 400 - 120 - (targetIndex === 1 ? 20 : 0) : 60 + (targetIndex === 1 ? 20 : 0);
    const popupY = target.isEnemy ? 60 + (targetIndex * 60) : 300 - 120 - (targetIndex * 50);
    
    const newPopup = { id: Date.now(), value: damage, x: popupX, y: popupY };
    set(state => ({ damagePopups: [...state.damagePopups, newPopup] }));

    await new Promise(r => setTimeout(r, 600)); // Animation delay

    addLog(`${attacker.name} attacked ${target.name} for ${damage} damage!`);

    const updateUnit = (units: BattleUnit[]) => 
      units.map(u => u.id === targetId ? { ...u, currentHp: newHp } : u);

    const nextPlayerParty = updateUnit(playerParty);
    const nextEnemies = updateUnit(enemies);
    
    if (newHp === 0) {
      addLog(`${target.name} has been defeated!`);
    }

    const allEnemiesDead = nextEnemies.every(e => e.currentHp <= 0);
    const allPlayerDead = nextPlayerParty.every(p => p.currentHp <= 0);

    set({
      playerParty: nextPlayerParty,
      enemies: nextEnemies,
      turnOrder: determineTurnOrder([...nextPlayerParty, ...nextEnemies]),
      attackingId: null,
      targetId: null,
    });

    // Remove popup
    setTimeout(() => {
      set(state => ({ damagePopups: state.damagePopups.filter(p => p.id !== newPopup.id) }));
    }, 1000);

    if (allEnemiesDead) {
      set({ isBattleOver: true, winner: "player" });
      addLog("Victory!");
    } else if (allPlayerDead) {
      set({ isBattleOver: true, winner: "enemy" });
      addLog("Defeat...");
    }

    if (!allEnemiesDead && !allPlayerDead) {
      get().nextTurn();
    }
  },

  useSkill: async () => {
    const { turnOrder, currentTurnIndex, playerParty, enemies, addLog } = get();
    const caster = turnOrder[currentTurnIndex];
    
    if (!caster || caster.currentHp <= 0 || caster.isEnemy || !caster.skill || caster.skillCooldown > 0) return;

    const skill = caster.skill;
    addLog(`${caster.name} used ${skill.name}!`);

    // Animation: Start (we just use the caster ID for animation)
    set({ attackingId: caster.id });

    let nextPlayerParty = [...playerParty];
    let nextEnemies = [...enemies];
    let popups: Array<{ id: number, value: number, x: number, y: number }> = [];

    // Apply Cooldown
    nextPlayerParty = nextPlayerParty.map(u => u.id === caster.id ? { ...u, skillCooldown: skill.cooldown } : u);

    await new Promise(r => setTimeout(r, 600)); // Animation delay

    if (skill.targetType === 'ALL_ALLIES' && skill.healPercentage) {
      // Heal Party
      nextPlayerParty = nextPlayerParty.map((u, i) => {
        if (u.currentHp > 0) {
          const healAmount = Math.floor(u.stats.hp * skill.healPercentage!);
          const healedHp = Math.min(u.stats.hp, u.currentHp + healAmount);
          const px = 60 + (i === 1 ? 20 : 0);
          const py = 300 - 120 - (i * 50);
          popups.push({ id: Date.now() + i, value: -healAmount, x: px, y: py }); 
          return { ...u, currentHp: healedHp };
        }
        return u;
      });
      addLog(`Party recovered HP!`);
    } else {
      // Damage Enemies
      let targets = [...nextEnemies].filter(e => e.currentHp > 0);
      
      if (skill.targetType === 'SINGLE_ENEMY') {
        // Find highest HP enemy or random, let's just pick first alive
        targets = [targets[0]];
      } else if (skill.targetType === 'FRONT_MID_ENEMIES') {
        targets = targets.filter(e => e.position === 'FRONT' || e.position === 'MID');
        if (targets.length === 0) targets = [nextEnemies.filter(e => e.currentHp > 0)[0]]; // fallback
      } // ALL_ENEMIES keeps all alive targets

      targets.forEach((target, j) => {
        const i = nextEnemies.findIndex(e => e.id === target.id);
        // We override the attacker's ATK with multiplier before calculating damage
        const tempStats = { ...caster.stats, atk: caster.stats.atk * (skill.damageMultiplier || 1) };
        const damage = calculateDamage(tempStats, target.stats);
        const newHp = Math.max(0, target.currentHp - damage);
        
        const px = 400 - 120 - (i === 1 ? 20 : 0);
        const py = 60 + (i * 60);
        popups.push({ id: Date.now() + j, value: damage, x: px, y: py });
        
        nextEnemies = nextEnemies.map(e => e.id === target.id ? { ...e, currentHp: newHp } : e);
        if (newHp === 0) {
          addLog(`${target.name} has been defeated!`);
        }
      });
    }

    set(state => ({ damagePopups: [...state.damagePopups, ...popups] }));

    const allEnemiesDead = nextEnemies.every(e => e.currentHp <= 0);
    const allPlayerDead = nextPlayerParty.every(p => p.currentHp <= 0);

    set({
      playerParty: nextPlayerParty,
      enemies: nextEnemies,
      turnOrder: determineTurnOrder([...nextPlayerParty, ...nextEnemies]),
      attackingId: null,
      targetId: null,
    });

    setTimeout(() => {
      set(state => ({ damagePopups: state.damagePopups.filter(p => !popups.find(po => po.id === p.id)) }));
    }, 1000);

    if (allEnemiesDead) {
      set({ isBattleOver: true, winner: "player" });
      addLog("Victory!");
    } else if (allPlayerDead) {
      set({ isBattleOver: true, winner: "enemy" });
      addLog("Defeat...");
    }

    if (!allEnemiesDead && !allPlayerDead) {
      get().nextTurn();
    }
  },

  swapPositions: (id1, id2) => {
    const { playerParty, addLog, nextTurn } = get();
    const unit1 = playerParty.find(u => u.id === id1);
    const unit2 = playerParty.find(u => u.id === id2);

    if (!unit1 || !unit2) return;

    const pos1 = unit1.position;
    const pos2 = unit2.position;

    const nextParty = playerParty.map(u => {
      if (u.id === id1) return { ...u, position: pos2 };
      if (u.id === id2) return { ...u, position: pos1 };
      return u;
    });

    set({ 
      playerParty: nextParty,
      turnOrder: determineTurnOrder([...nextParty, ...get().enemies])
    });

    addLog(`${unit1.name} swapped positions with ${unit2.name}!`);
    nextTurn();
  },

  nextTurn: () => {
    set((state) => {
      let nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
      // Skip dead units
      while (state.turnOrder[nextIndex].currentHp <= 0) {
        nextIndex = (nextIndex + 1) % state.turnOrder.length;
      }
      
      const nextUnit = state.turnOrder[nextIndex];
      
      // Decrement cooldowns at the start of a new turn round?
      // Actually simpler: just decrement the active unit's cooldown
      let updatedParty = [...state.playerParty];
      if (!nextUnit.isEnemy && nextUnit.skillCooldown > 0) {
         updatedParty = updatedParty.map(u => 
           u.id === nextUnit.id ? { ...u, skillCooldown: u.skillCooldown - 1 } : u
         );
      }

      return { 
        currentTurnIndex: nextIndex,
        playerParty: updatedParty,
        // Also update the turnOrder reference so currentUnit gets the updated cooldown
        turnOrder: state.turnOrder.map(u => 
          u.id === nextUnit.id && u.skillCooldown > 0 ? { ...u, skillCooldown: u.skillCooldown - 1 } : u
        )
      };
    });
  },
}));
