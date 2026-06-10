"use client";

import React, { useEffect, Suspense } from 'react';
import BattleCanvas from '@/components/game/BattleCanvas';
import ActionButtons from '@/components/game/ActionButtons';
import PartyStatus from '@/components/game/PartyStatus';
import EnemyStatus from '@/components/game/EnemyStatus';
import { useBattle } from '@/hooks/useBattle';
import { warriorSprite } from '@/lib/assets/characters/warrior';
import { mageSprite } from '@/lib/assets/characters/mage';
import { rogueSprite } from '@/lib/assets/characters/rogue';
import { goblinSprite } from '@/lib/assets/monsters/goblin';
import { useBattleStore } from '@/lib/stores/battleStore';

import { useSearchParams, useRouter } from 'next/navigation';
import { useStoryStore } from '@/lib/game/storyProgress';
import { useSaveStore } from '@/lib/stores/saveStore';
import { storyChapter1 } from '@/lib/game/storyData';
import { Trophy, Home, Coins, Flag } from 'lucide-react';
import Link from 'next/link';

function GamePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const floorNum = parseInt(searchParams.get('floor') || '1');
  const floorData = storyChapter1.find(f => f.floorNumber === floorNum) || storyChapter1[0];

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
  const completeFloor = useStoryStore((state) => state.completeFloor);
  const persistAll = useSaveStore((state) => state.persistAll);
  const resetBattle = useBattleStore((state) => state.resetBattle);

  useEffect(() => {
    startBattle(
      [
        { id: 'p1', name: 'Warrior', stats: { hp: 100, atk: 15, def: 5, spd: 10, element: 'FIRE' }, currentHp: 100, isEnemy: false },
        { id: 'p2', name: 'Mage', stats: { hp: 80, atk: 20, def: 2, spd: 8, element: 'WATER' }, currentHp: 80, isEnemy: false },
        { id: 'p3', name: 'Rogue', stats: { hp: 90, atk: 12, def: 4, spd: 15, element: 'WIND' }, currentHp: 90, isEnemy: false },
      ],
      floorData.enemies.map((e, i) => ({
        id: `e${i+1}`,
        name: e.name,
        stats: e.stats,
        currentHp: e.stats.hp,
        isEnemy: true
      }))
    );
  }, [startBattle, floorData]);

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

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <div className="flex-1 flex flex-col gap-4">
        <header className="py-4 text-center">
          <h1 className="text-2xl font-black tracking-tighter text-red-500">DUNGEON BATTLER</h1>
        </header>

        <div className="relative">
          <BattleCanvas 
            partySprites={[warriorSprite, mageSprite, rogueSprite]} 
            enemySprites={[goblinSprite]} 
            attackingId={attackingId}
            targetId={targetId}
            damagePopups={damagePopups}
          />
          
          <div className="absolute top-4 left-4 w-32 pointer-events-none">
            <PartyStatus party={playerParty} />
          </div>
          
          <div className="absolute top-4 right-4 w-32 pointer-events-none">
            <EnemyStatus enemies={enemies} />
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
          onRun={() => console.log('Run')}
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
