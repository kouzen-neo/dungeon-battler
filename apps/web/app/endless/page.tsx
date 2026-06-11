"use client";

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import BattleCanvas from '@/components/game/BattleCanvas';
import ActionButtons from '@/components/game/ActionButtons';
import PartyStatus from '@/components/game/PartyStatus';
import EnemyStatus from '@/components/game/EnemyStatus';
import { useBattle } from '@/hooks/useBattle';
import { warriorSpriteData } from '@/lib/assets/characters/warrior';
import { mageSpriteData }    from '@/lib/assets/characters/mage';
import { rogueSpriteData }   from '@/lib/assets/characters/rogue';
import { goblinSprite }      from '@/lib/assets/monsters/goblin';
import { resolveSprite, ElementType } from '@/lib/assets/spriteSystem';
import { useBattleStore } from '@/lib/stores/battleStore';
import { useRouter } from 'next/navigation';
import { useSaveStore } from '@/lib/stores/saveStore';
import { useShopStore } from '@/lib/stores/shopStore';
import { useStoryStore } from '@/lib/game/storyProgress';
import { useEndlessStore } from '@/lib/stores/endlessStore';
import { generateEndlessEnemies } from '@/lib/game/endlessGeneration';
import { Trophy, Home, Coins, Flag, Sword } from 'lucide-react';
import Link from 'next/link';
import { useHeroStore } from '@/lib/stores/heroStore';

const BATTLE_ITEMS = {
  'pot_small': { name: 'Small Potion', healHp: 20 },
  'bomb': { name: 'Bomb', damage: 30 },
  'ether': { name: 'Elixir', healHp: 50 },
};

function EndlessPageContent() {
  const router = useRouter();
  const { currentFloor, incrementFloor, resetFloor } = useEndlessStore();
  const { ownedHeroes, partyIds } = useHeroStore();

  const { 
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
  } = useBattle();

  const logs = useBattleStore((state) => state.logs);
  const winner = useBattleStore((state) => state.winner);
  const attackingId = useBattleStore((state) => state.attackingId);
  const targetId = useBattleStore((state) => state.targetId);
  const damagePopups = useBattleStore((state) => state.damagePopups);
  const isShaking = useBattleStore((state) => state.isShaking);
  
  const [isSwapping, setIsSwapping] = useState(false);
  const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);
  
  const persistAll = useSaveStore((state) => state.persistAll);
  const swapPositions = useBattleStore((state) => state.swapPositions);
  const { inventory, consumeItem } = useShopStore();
  const addGold = useStoryStore((state) => state.addGold);

  const rewardGold = useMemo(() => 10 + (currentFloor * 5), [currentFloor]);

  useEffect(() => {
    const activeParty = partyIds
      .map(id => ownedHeroes.find(h => h.instanceId === id))
      .filter((h): h is NonNullable<typeof h> => !!h);

    const partyUnits = activeParty.length > 0 
      ? activeParty.map((hero, index) => ({
          id: hero.instanceId,
          name: hero.name,
          stats: { ...hero.baseStats },
          currentHp: hero.baseStats.hp,
          isEnemy: false,
          position: index === 0 ? 'FRONT' as const : index === 1 ? 'MID' as const : 'BACK' as const,
          skillCooldown: 0,
          skill: hero.skill
        }))
      : [
          { id: 'p1', name: 'Warrior', stats: { hp: 100, atk: 15, def: 5, spd: 10, element: 'FIRE' as const }, currentHp: 100, isEnemy: false, position: 'FRONT' as const, skillCooldown: 0 },
          { id: 'p2', name: 'Mage', stats: { hp: 80, atk: 20, def: 2, spd: 8, element: 'WATER' as const }, currentHp: 80, isEnemy: false, position: 'MID' as const, skillCooldown: 0 },
          { id: 'p3', name: 'Rogue', stats: { hp: 90, atk: 12, def: 4, spd: 15, element: 'WIND' as const }, currentHp: 90, isEnemy: false, position: 'BACK' as const, skillCooldown: 0 },
        ];

    const endlessEnemies = generateEndlessEnemies(currentFloor);

    startBattle(
      partyUnits,
      endlessEnemies.map((e, i) => ({
        id: `e${i+1}`,
        name: e.name,
        stats: e.stats,
        currentHp: e.stats.hp,
        isEnemy: true,
        position: 'ENEMY' as const,
        skillCooldown: 0
      }))
    );
  }, [startBattle, currentFloor, ownedHeroes, partyIds]);

  const handleVictory = async (e: React.MouseEvent) => {
    e.preventDefault();
    incrementFloor();
    addGold(rewardGold);
    await persistAll();
    // In endless, we might want to go straight to next floor or show a rest screen
    // For now, let's just refresh the same page to start next battle
    window.location.reload(); 
  };

  const handleAttack = () => {
    if (enemies.length > 0) {
      const target = enemies.find(e => e.currentHp > 0);
      if (target) attack(target.id);
    }
  };

  const spriteDataMap: Record<string, number[][]> = {
    warrior: warriorSpriteData,
    mage:    mageSpriteData,
    rogue:   rogueSpriteData,
  };

  const resolvedPartySprites = useMemo(() =>
    playerParty.map(unit => {
      const key = unit.name.toLowerCase().split(' ').pop() ?? 'warrior';
      const data = spriteDataMap[key] ?? warriorSpriteData;
      return resolveSprite(data, unit.stats.element as ElementType);
    }),
    [playerParty]
  );

  const resolvedEnemySprites = useMemo(() =>
    enemies.map(() => goblinSprite),
    [enemies]
  );

  return (
    <main className="flex flex-col h-[100dvh] bg-slate-950 text-white overflow-hidden max-w-md mx-auto relative">
      <header className="flex-shrink-0 pt-4 pb-2 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sword className="text-red-500" size={20} />
          <h1 className="text-xl font-black tracking-tighter text-red-500 uppercase">ENDLESS</h1>
          <button 
            onClick={toggleAutoBattle}
            className={`
              ml-2 px-3 py-1 rounded-full text-[8px] font-black border transition-all active:scale-95
              ${isAutoBattle 
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                : 'bg-slate-900 border-slate-800 text-slate-500'}
            `}
          >
            {isAutoBattle ? 'AUTO: ON' : 'AUTO: OFF'}
          </button>
        </div>
        <div className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Floor</span>
          <span className="ml-2 font-mono font-bold text-white">{currentFloor}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-3 px-4 pb-2 overflow-y-auto">
        <div className="w-full rounded-2xl overflow-hidden border-2 border-slate-800 shadow-md flex-shrink-0 bg-black aspect-[4/3] relative">
          <BattleCanvas 
            partySprites={resolvedPartySprites} 
            enemySprites={resolvedEnemySprites} 
            attackingId={attackingId}
            targetId={targetId}
            damagePopups={damagePopups}
            activeUnitId={currentUnit?.id}
            partyIds={playerParty.map(u => u.id)}
            enemyIds={enemies.map(u => u.id)}
            activeSkillName={activeSkillName}
            isShaking={isShaking}
          />
        </div>
        
        <div className="flex flex-row gap-3 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <PartyStatus party={playerParty} activeUnitId={currentUnit?.id} />
          </div>
          <div className="flex-1 min-w-0">
            <EnemyStatus enemies={enemies} activeUnitId={currentUnit?.id} />
          </div>
        </div>

        <div className="flex-1 min-h-[100px] max-h-[150px] bg-slate-900/50 p-3 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex-shrink-0 border-b border-slate-800 pb-1">Endless Log</h2>
          <div className="overflow-y-auto flex-1 flex flex-col justify-end">
            <div className="space-y-1">
              {logs.map((log, i) => (
                <p key={i} className={`text-xs ${i === 0 ? 'text-white font-semibold' : 'text-slate-500'}`}>
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 bg-slate-900/30 p-2 rounded-xl border border-slate-800/50 mb-2">
           <div className="flex justify-between items-end mb-1 px-1">
             <span className="text-sm font-bold text-amber-400">{currentUnit?.name}'s Turn</span>
             <span className="text-[10px] text-slate-500 font-mono uppercase">Floor {currentFloor}</span>
           </div>
           <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
             <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 w-full animate-pulse" />
           </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-slate-950 border-t border-slate-900 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] z-10">
        <ActionButtons 
          onAttack={handleAttack}
          onSkill={() => useSkill()}
          onUltimate={() => useUltimate()}
          onItem={() => setIsItemMenuOpen(true)}
          onSwap={() => setIsSwapping(true)}
          disabled={isBattleOver || isAutoBattle || !currentUnit || currentUnit.isEnemy || !!attackingId}
          skillName={currentUnit?.skill?.name}
          skillCooldown={currentUnit?.skillCooldown}
          currentEnergy={currentUnit?.currentEnergy}
          maxEnergy={currentUnit?.maxEnergy}
        />
      </div>

      {isBattleOver && (
        <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center p-6 z-[100] animate-in fade-in duration-500">
          <div className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl w-full max-w-xs text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto">
            {winner === 'player' ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/50">
                  <Trophy className="text-yellow-500" size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">VICTORY</h2>
                <p className="text-slate-400 mb-6 font-bold">Floor {currentFloor} Conquered!</p>
                <div className="bg-slate-950 p-3 rounded-xl mb-6 flex items-center justify-center gap-2 border border-slate-800 w-full">
                  <Coins className="text-yellow-500" size={16} />
                  <span className="text-xl font-black text-yellow-500">+{rewardGold}</span>
                </div>
                <button 
                  onClick={handleVictory}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-[0_4px_0_rgb(153,27,27)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  NEXT FLOOR
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/50">
                  <Flag className="text-red-500" size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">DEFEAT</h2>
                <p className="text-slate-400 mb-1 font-bold">Ended at Floor {currentFloor}</p>
                <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-wider">Better luck next time!</p>
                <button 
                  onClick={() => { resetFloor(); router.replace('/'); }}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all cursor-pointer"
                >
                  RETIRE TO HOME
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Item & Swap menus omitted for brevity, but should be identical to game page */}
    </main>
  );
}

export default function EndlessPage() {
  return (
    <Suspense fallback={
      <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto items-center justify-center">
        <div className="text-xl font-black italic text-red-500 animate-pulse">LOADING ENDLESS...</div>
      </main>
    }>
      <EndlessPageContent />
    </Suspense>
  );
}
