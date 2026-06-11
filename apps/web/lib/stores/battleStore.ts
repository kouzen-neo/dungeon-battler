import { create } from "zustand";
import { CombatStats, calculateDamage, determineTurnOrder } from "../game/combat";
import { HeroSkill } from "../game/heroData";
import { useAudioStore } from "./audioStore";

export type UnitPosition = 'FRONT' | 'MID' | 'BACK' | 'ENEMY';

export interface BattleUnit {
  id: string;
  name: string;
  stats: CombatStats;
  currentHp: number;
  currentEnergy: number;
  maxEnergy: number;
  isEnemy: boolean;
  position: UnitPosition;
  skillCooldown: number;
  skill?: HeroSkill;
  ultimateSkill?: HeroSkill;
}

interface BattleState {
  playerParty: BattleUnit[];
  enemies: BattleUnit[];
  turnOrder: BattleUnit[];
  currentTurnIndex: number;
  isBattleOver: boolean;
  winner: "player" | "enemy" | null;
  logs: string[];
  isAutoBattle: boolean;
  
  // Animation State
  attackingId: string | null;
  targetId: string | null;
  activeSkillName: string | null;
  damagePopups: Array<{ id: number, value: number, x: number, y: number }>;
  isShaking: boolean;

  startBattle: (party: BattleUnit[], enemies: BattleUnit[]) => void;
  nextTurn: () => void;
  attack: (targetId: string) => Promise<void>;
  useSkill: () => Promise<void>;
  useUltimate: () => Promise<void>;
  useItem: (itemId: string, config: { name: string, healHp?: number, damage?: number }) => Promise<void>;
  swapPositions: (id1: string, id2: string) => void;
  toggleAutoBattle: () => void;
  triggerShake: (duration?: number) => void;
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
  isAutoBattle: false,
  attackingId: null,
  targetId: null,
  activeSkillName: null,
  damagePopups: [],
  isShaking: false,

  resetBattle: () => set({
    playerParty: [],
    enemies: [],
    turnOrder: [],
    currentTurnIndex: 0,
    isBattleOver: false,
    winner: null,
    isAutoBattle: false,
    attackingId: null,
    targetId: null,
    activeSkillName: null,
    damagePopups: [],
    isShaking: false,
    logs: []
  }),

  triggerShake: (duration = 500) => {
    set({ isShaking: true });
    setTimeout(() => set({ isShaking: false }), duration);
  },

  toggleAutoBattle: () => set(state => ({ isAutoBattle: !state.isAutoBattle })),

  startBattle: (party, enemies) => {
    // Ensure all units have energy initialized
    const initializedParty = party.map(u => ({ ...u, currentEnergy: u.currentEnergy || 0, maxEnergy: u.maxEnergy || 100 }));
    const initializedEnemies = enemies.map(u => ({ ...u, currentEnergy: u.currentEnergy || 0, maxEnergy: u.maxEnergy || 100 }));
    
    const turnOrder = determineTurnOrder([...initializedParty, ...initializedEnemies]);
    set({
      playerParty: initializedParty,
      enemies: initializedEnemies,
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
    const { playSFX } = useAudioStore.getState();
    
    if (!attacker || attacker.currentHp <= 0) return;

    let target = [...playerParty, ...enemies].find(u => u.id === targetId);
    if (!target || target.currentHp <= 0) return;

    // Play attack sound
    playSFX('/audio/sfx-attack.wav');

    // Animation: Start
    set({ attackingId: attacker.id, targetId: target.id });
    if (!attacker.isEnemy) get().triggerShake(300);

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

    // Play hit sound
    playSFX('/audio/sfx-hit.wav');

    addLog(`${attacker.name} attacked ${target.name} for ${damage} damage!`);

    const updateUnit = (units: BattleUnit[], id: string, hp: number, energyAdd: number = 0) => 
      units.map(u => u.id === id ? { 
        ...u, 
        currentHp: hp, 
        currentEnergy: Math.min(u.maxEnergy, u.currentEnergy + energyAdd) 
      } : u);

    // Attacker gains 20 energy, target gains 10 energy from being hit
    let nextPlayerParty = [...playerParty];
    let nextEnemies = [...enemies];

    if (attacker.isEnemy) {
      nextEnemies = updateUnit(nextEnemies, attacker.id, attacker.currentHp, 20);
      nextPlayerParty = updateUnit(nextPlayerParty, target.id, newHp, 10);
    } else {
      nextPlayerParty = updateUnit(nextPlayerParty, attacker.id, attacker.currentHp, 20);
      nextEnemies = updateUnit(nextEnemies, target.id, newHp, 10);
    }
    
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
      playSFX('/audio/sfx-win.wav');
    } else if (allPlayerDead) {
      set({ isBattleOver: true, winner: "enemy" });
      addLog("Defeat...");
      playSFX('/audio/sfx-lose.wav');
    }

    if (!allEnemiesDead && !allPlayerDead) {
      get().nextTurn();
    }
  },

  useSkill: async () => {
    const { turnOrder, currentTurnIndex, playerParty, enemies, addLog } = get();
    const caster = turnOrder[currentTurnIndex];
    const { playSFX } = useAudioStore.getState();
    
    if (!caster || caster.currentHp <= 0 || caster.isEnemy || !caster.skill || caster.skillCooldown > 0) return;

    const skill = caster.skill;
    addLog(`${caster.name} used ${skill.name}!`);

    // Animation: Start (we just use the caster ID for animation)
    set({ attackingId: caster.id, activeSkillName: skill.name });

    let nextPlayerParty = [...playerParty];
    let nextEnemies = [...enemies];
    let popups: Array<{ id: number, value: number, x: number, y: number }> = [];

    // Apply Cooldown and gain energy
    nextPlayerParty = nextPlayerParty.map(u => u.id === caster.id ? { 
      ...u, 
      skillCooldown: skill.cooldown,
      currentEnergy: Math.min(u.maxEnergy, u.currentEnergy + 20)
    } : u);

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
        targets = [targets[0]];
      } else if (skill.targetType === 'FRONT_MID_ENEMIES') {
        targets = targets.filter(e => e.position === 'FRONT' || e.position === 'MID');
        if (targets.length === 0) targets = [nextEnemies.filter(e => e.currentHp > 0)[0]]; // fallback
      }

      targets.forEach((target, j) => {
        const i = nextEnemies.findIndex(e => e.id === target.id);
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
      activeSkillName: null,
    });

    setTimeout(() => {
      set(state => ({ damagePopups: state.damagePopups.filter(p => !popups.find(po => po.id === p.id)) }));
    }, 1000);

    if (allEnemiesDead) {
      set({ isBattleOver: true, winner: "player" });
      addLog("Victory!");
      playSFX('/audio/sfx-win.wav');
    } else if (allPlayerDead) {
      set({ isBattleOver: true, winner: "enemy" });
      addLog("Defeat...");
      playSFX('/audio/sfx-lose.wav');
    }

    if (!allEnemiesDead && !allPlayerDead) {
      get().nextTurn();
    }
  },

  useUltimate: async () => {
    const { turnOrder, currentTurnIndex, playerParty, enemies, addLog } = get();
    const caster = turnOrder[currentTurnIndex];
    const { playSFX } = useAudioStore.getState();
    
    if (!caster || caster.currentHp <= 0 || caster.isEnemy || !caster.ultimateSkill || caster.currentEnergy < caster.maxEnergy) return;

    const skill = caster.ultimateSkill;
    addLog(`${caster.name} unleashed ULTIMATE: ${skill.name}!`);

    set({ attackingId: caster.id, activeSkillName: `ULTIMATE: ${skill.name}` });
    get().triggerShake(1000);

    let nextPlayerParty = [...playerParty];
    let nextEnemies = [...enemies];
    let popups: Array<{ id: number, value: number, x: number, y: number }> = [];

    // Reset Energy
    nextPlayerParty = nextPlayerParty.map(u => u.id === caster.id ? { ...u, currentEnergy: 0 } : u);

    await new Promise(r => setTimeout(r, 800));

    if (skill.targetType === 'ALL_ALLIES' && skill.healPercentage) {
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
      playSFX('/audio/sfx-win.wav');
    } else {
      let targets = [...nextEnemies].filter(e => e.currentHp > 0);
      
      if (skill.targetType === 'SINGLE_ENEMY') {
        targets = [targets[0]];
      }

      targets.forEach((target, j) => {
        const i = nextEnemies.findIndex(e => e.id === target.id);
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
      playSFX('/audio/sfx-hit.wav');
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
      activeSkillName: null,
    });

    setTimeout(() => {
      set(state => ({ damagePopups: state.damagePopups.filter(p => !popups.find(po => po.id === p.id)) }));
    }, 1000);

    if (allEnemiesDead) {
      set({ isBattleOver: true, winner: "player" });
      addLog("Victory!");
      playSFX('/audio/sfx-win.wav');
    } else if (allPlayerDead) {
      set({ isBattleOver: true, winner: "enemy" });
      addLog("Defeat...");
      playSFX('/audio/sfx-lose.wav');
    }

    if (!allEnemiesDead && !allPlayerDead) {
      get().nextTurn();
    }
  },

  useItem: async (itemId, config) => {
    const { turnOrder, currentTurnIndex, playerParty, enemies, addLog } = get();
    const caster = turnOrder[currentTurnIndex];
    const { playSFX } = useAudioStore.getState();
    if (!caster || caster.currentHp <= 0 || caster.isEnemy) return;

    addLog(`${caster.name} used ${config.name}!`);

    let nextPlayerParty = [...playerParty];
    let nextEnemies = [...enemies];
    let popups: Array<{ id: number, value: number, x: number, y: number }> = [];

    await new Promise(r => setTimeout(r, 400));

    if (config.healHp) {
      const targetIndex = playerParty.findIndex(p => p.id === caster.id);
      const healedHp = Math.min(caster.stats.hp, caster.currentHp + config.healHp);
      const px = 60 + (targetIndex === 1 ? 20 : 0);
      const py = 300 - 120 - (targetIndex * 50);
      popups.push({ id: Date.now(), value: -config.healHp, x: px, y: py });
      nextPlayerParty = nextPlayerParty.map(p => p.id === caster.id ? { ...p, currentHp: healedHp } : p);
    }

    if (config.damage) {
      const target = nextEnemies.find(e => e.currentHp > 0);
      if (target) {
        const targetIndex = nextEnemies.findIndex(e => e.id === target.id);
        const newHp = Math.max(0, target.currentHp - config.damage);
        const px = 400 - 120 - (targetIndex === 1 ? 20 : 0);
        const py = 60 + (targetIndex * 60);
        popups.push({ id: Date.now(), value: config.damage, x: px, y: py });
        nextEnemies = nextEnemies.map(e => e.id === target.id ? { ...e, currentHp: newHp } : e);
        if (newHp === 0) addLog(`${target.name} has been defeated!`);
      }
    }

    set(state => ({ damagePopups: [...state.damagePopups, ...popups] }));

    const allEnemiesDead = nextEnemies.every(e => e.currentHp <= 0);
    const allPlayerDead = nextPlayerParty.every(p => p.currentHp <= 0);

    set({
      playerParty: nextPlayerParty,
      enemies: nextEnemies,
      turnOrder: determineTurnOrder([...nextPlayerParty, ...nextEnemies])
    });

    setTimeout(() => {
      set(state => ({ damagePopups: state.damagePopups.filter(p => !popups.find(po => po.id === p.id)) }));
    }, 1000);

    if (allEnemiesDead) {
      set({ isBattleOver: true, winner: "player" });
      addLog("Victory!");
      playSFX('/audio/sfx-win.wav');
    } else if (allPlayerDead) {
      set({ isBattleOver: true, winner: "enemy" });
      addLog("Defeat...");
      playSFX('/audio/sfx-lose.wav');
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
      while (state.turnOrder[nextIndex].currentHp <= 0) {
        nextIndex = (nextIndex + 1) % state.turnOrder.length;
      }
      
      const nextUnit = state.turnOrder[nextIndex];
      
      let updatedParty = [...state.playerParty];
      if (!nextUnit.isEnemy && nextUnit.skillCooldown > 0) {
         updatedParty = updatedParty.map(u => 
           u.id === nextUnit.id ? { ...u, skillCooldown: u.skillCooldown - 1 } : u
         );
      }

      return { 
        currentTurnIndex: nextIndex,
        playerParty: updatedParty,
        turnOrder: state.turnOrder.map(u => 
          u.id === nextUnit.id && u.skillCooldown > 0 ? { ...u, skillCooldown: u.skillCooldown - 1 } : u
        )
      };
    });
  },
}));
