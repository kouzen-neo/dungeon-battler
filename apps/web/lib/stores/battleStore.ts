import { create } from "zustand";
import { CombatStats, calculateDamage, determineTurnOrder } from "../game/combat";

interface BattleUnit {
  id: string;
  name: string;
  stats: CombatStats;
  currentHp: number;
  isEnemy: boolean;
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

    // Add Popup
    const popupX = target.isEnemy ? 300 : 80;
    const popupY = 150;
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

  nextTurn: () => {
    set((state) => {
      let nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
      // Skip dead units
      while (state.turnOrder[nextIndex].currentHp <= 0) {
        nextIndex = (nextIndex + 1) % state.turnOrder.length;
      }
      return { currentTurnIndex: nextIndex };
    });
  },
}));
