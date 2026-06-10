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

import { useSearchParams, useRouter } from 'next/navigation';
import { useStoryStore } from '@/lib/game/storyProgress';
import { useSaveStore } from '@/lib/stores/saveStore';
import { storyChapter1 } from '@/lib/game/storyData';
import { Trophy, Home, Coins, Flag } from 'lucide-react';
import Link from 'next/link';
import { useHeroStore } from '@/lib/stores/heroStore';

function GamePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const floorNum = parseInt(searchParams.get('floor') || '1');
  const floorData = storyChapter1.find(f => f.floorNumber === floorNum) || storyChapter1[0];

  const { ownedHeroes, partyIds } = useHeroStore();

  const { 
    playerParty, 
    enemies, 
    currentUnit, 
    isBattleOver, 
    attack, 
    startBattle 
  } = useBattle();

  const logs = useBattleStore((state) => state.logs);
  const winner = useBattleStore((state) => state.winner);
  const attackingId = useBattleStore((state) => state.attackingId);
  const targetId = useBattleStore((state) => state.targetId);
  const damagePopups = useBattleStore((state) => state.damagePopups);
  const [isSwapping, setIsSwapping] = useState(false);
  const completeFloor = useStoryStore((state) => state.completeFloor);
  const persistAll = useSaveStore((state) => state.persistAll);
  const resetBattle = useBattleStore((state) => state.resetBattle);
  const swapPositions = useBattleStore((state) => state.swapPositions);

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
          position: index === 0 ? 'FRONT' as const : index === 1 ? 'MID' as const : 'BACK' as const
        }))
      : [
          { id: 'p1', name: 'Warrior', stats: { hp: 100, atk: 15, def: 5, spd: 10, element: 'FIRE' as const }, currentHp: 100, isEnemy: false, position: 'FRONT' as const },
          { id: 'p2', name: 'Mage', stats: { hp: 80, atk: 20, def: 2, spd: 8, element: 'WATER' as const }, currentHp: 80, isEnemy: false, position: 'MID' as const },
          { id: 'p3', name: 'Rogue', stats: { hp: 90, atk: 12, def: 4, spd: 15, element: 'WIND' as const }, currentHp: 90, isEnemy: false, position: 'BACK' as const },
        ];

    startBattle(
      partyUnits,
      floorData.enemies.map((e, i) => ({
        id: `e${i+1}`,
        name: e.name,
        stats: e.stats,
        currentHp: e.stats.hp,
        isEnemy: true,
        position: 'ENEMY' as const
      }))
    );
  }, [startBattle, floorData, ownedHeroes, partyIds]);

  const handleVictory = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Victory handled");
    completeFloor(floorNum, floorData.rewardGold);
    await persistAll();
    router.replace('/story');
  };

  const handleAttack = () => {
    if (enemies.length > 0) {
      const target = enemies.find(e => e.currentHp > 0);
      if (target) attack(target.id);
    }
  };

  // Map hero template id -> sprite data
  const spriteDataMap: Record<string, number[][]> = {
    warrior: warriorSpriteData,
    mage:    mageSpriteData,
    rogue:   rogueSpriteData,
  };

  // Resolve party sprites with their element colors — memoized to avoid canvas flicker
  const resolvedPartySprites = useMemo(() =>
    playerParty.map(unit => {
      // Match unit name to sprite (fallback: warrior)
      const key = unit.name.toLowerCase().split(' ').pop() ?? 'warrior';
      const data = spriteDataMap[key] ?? warriorSpriteData;
      return resolveSprite(data, unit.stats.element as ElementType);
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playerParty]
  );

  const resolvedEnemySprites = useMemo(() =>
    // Goblin is still in old RGBA format — wrap as-is
    enemies.map(() => goblinSprite),
    [enemies]
  );

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <div className="flex-1 flex flex-col gap-4">
        <header className="py-4 text-center">
          <h1 className="text-2xl font-black tracking-tighter text-red-500">DUNGEON BATTLER</h1>
        </header>

        <div className="relative">
          <BattleCanvas 
            partySprites={resolvedPartySprites} 
            enemySprites={resolvedEnemySprites} 
            attackingId={attackingId}
            targetId={targetId}
            damagePopups={damagePopups}
          />
          
          <div className="absolute top-4 left-4 w-32 pointer-events-none">
            <PartyStatus party={playerParty} activeUnitId={currentUnit?.id} />
          </div>
          
          <div className="absolute top-4 right-4 w-32 pointer-events-none">
            <EnemyStatus enemies={enemies} activeUnitId={currentUnit?.id} />
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex-1 overflow-y-auto max-h-40">
          <h2 className="text-xs font-bold text-slate-500 uppercase mb-2">Battle Log</h2>
          {logs.map((log, i) => (
            <p key={i} className={`text-sm mb-1 ${i === 0 ? 'text-white' : 'text-slate-400'}`}>
              {log}
            </p>
          ))}
        </div>

        <div className="py-2">
           <div className="flex justify-between items-end mb-1">
             <span className="text-sm font-bold">{currentUnit?.name}'s Turn</span>
             <span className="text-xs text-slate-500">Wait: {currentUnit?.stats.spd}ms</span>
           </div>
           <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-red-500 w-1/2 animate-pulse" />
           </div>
        </div>

        <ActionButtons 
          onAttack={handleAttack}
          onSkill={() => console.log('Skill')}
          onItem={() => console.log('Item')}
          onSwap={() => setIsSwapping(true)}
          disabled={isBattleOver || currentUnit?.isEnemy || !!attackingId}
        />
      </div>

      {isBattleOver && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-6 z-[100] animate-in fade-in duration-500">
          <div className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl w-full max-w-xs text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto">
            {winner === 'player' ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/50">
                  <Trophy className="text-yellow-500" size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">VICTORY</h2>
                <p className="text-slate-400 mb-6 font-bold">Lantai {floorNum} Selesai!</p>
                <div className="bg-slate-950 p-3 rounded-xl mb-6 flex items-center justify-center gap-2 border border-slate-800 w-full">
                  <Coins className="text-yellow-500" size={16} />
                  <span className="text-xl font-black text-yellow-500">+{floorData.rewardGold}</span>
                </div>
                <button 
                  onClick={handleVictory}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-[0_4px_0_rgb(153,27,27)] active:translate-y-1 active:shadow-none transition-all cursor-pointer relative z-[110]"
                >
                  LANJUTKAN
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/50">
                  <Flag className="text-red-500" size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">DEFEAT</h2>
                <p className="text-slate-400 mb-6 font-bold">Jangan Menyerah!</p>
                <Link 
                  href="/story"
                  className="block w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all cursor-pointer relative z-[110]"
                >
                  KEMBALI
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {isSwapping && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-6 z-[90] animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl w-full max-w-xs text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <h2 className="text-xl font-black text-white mb-2 tracking-tighter">TUKAR POSISI</h2>
            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-wider">Tukar dengan {currentUnit?.name}:</p>
            
            <div className="space-y-3 mb-6">
              {playerParty
                .filter(u => u.id !== currentUnit?.id && u.currentHp > 0)
                .map(unit => (
                  <button
                    key={unit.id}
                    onClick={() => {
                      if (currentUnit) {
                        swapPositions(currentUnit.id, unit.id);
                        setIsSwapping(false);
                      }
                    }}
                    className="w-full py-4 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl border border-slate-800 active:scale-95 transition-all flex justify-between px-4 items-center"
                  >
                    <span>{unit.name}</span>
                    <span className="text-xs bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 text-amber-500 font-bold">{unit.position}</span>
                  </button>
                ))}
              {playerParty.filter(u => u.id !== currentUnit?.id && u.currentHp > 0).length === 0 && (
                <p className="text-sm text-red-500 font-bold">Tidak ada anggota party lain yang hidup!</p>
              )}
            </div>

            <button 
              onClick={() => setIsSwapping(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl active:scale-95 transition-all text-xs uppercase"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto items-center justify-center">
        <div className="text-xl font-black italic text-red-500 animate-pulse">LOADING BATTLE...</div>
      </main>
    }>
      <GamePageContent />
    </Suspense>
  );
}
