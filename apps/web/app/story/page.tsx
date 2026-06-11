"use client";

import React from 'react';
import Link from 'next/link';
import { useStoryStore } from '@/lib/game/storyProgress';
import { useEndlessStore } from '@/lib/stores/endlessStore';
import { storyChapter1 } from '@/lib/game/storyData';
import { Lock, Play, ChevronLeft, Coins, Swords } from 'lucide-react';

export default function StoryPage() {
  const { currentFloor, maxFloorReached: storyMax, gold } = useStoryStore();
  const { maxFloorReached: endlessMax } = useEndlessStore();

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="p-2 hover:bg-slate-900 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-black tracking-widest text-red-500">CHAPTER 1</h1>
        <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <Coins size={14} className="text-yellow-500" />
          <span className="text-sm font-bold">{gold}</span>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto pb-20">
        {storyChapter1.map((floor) => {
          const reqEndless = floor.floorNumber * 2;
          const isStoryLocked = floor.floorNumber > storyMax;
          const isEndlessLocked = endlessMax < reqEndless;
          const isLocked = isStoryLocked || isEndlessLocked;
          const isCurrent = floor.floorNumber === storyMax;

          return (
            <div 
              key={floor.floorNumber}
              className={`
                relative p-4 rounded-2xl border-2 transition-all
                ${isLocked 
                  ? 'bg-slate-900/20 border-slate-900 opacity-50 grayscale' 
                  : isCurrent 
                    ? 'bg-red-900/20 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Floor {floor.floorNumber}</h2>
                  <p className={`text-lg font-black ${isLocked ? 'text-slate-600' : 'text-white'}`}>
                    {isLocked && !isStoryLocked ? '???' : floor.enemies[0].name}
                  </p>
                  
                  {isEndlessLocked && (
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-tight">
                       <Swords size={12} />
                       Requires Endless Floor {reqEndless}
                    </div>
                  )}
                </div>

                {isLocked ? (
                  <Lock size={20} className="text-slate-700" />
                ) : (
                  <Link 
                    href={`/game?floor=${floor.floorNumber}`}
                    className={`
                      p-3 rounded-xl transition-all active:scale-90
                      ${isCurrent ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}
                    `}
                  >
                    <Play size={20} fill="currentColor" />
                  </Link>
                )}
              </div>
              
              {!isLocked && (
                <div className="mt-2 flex gap-2">
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">
                    Reward: {floor.rewardGold}G
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 max-w-md mx-auto bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <p className="text-[10px] text-center text-slate-500 font-bold tracking-widest uppercase mb-2">
          Clear floor 10 to unlock Chapter 2
        </p>
      </div>
    </main>
  );
}
