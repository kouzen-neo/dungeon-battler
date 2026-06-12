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

      <div className="flex-1 overflow-y-auto pb-24 relative px-8 pt-8">
        {/* Path Line */}
        <div className="absolute top-16 bottom-16 left-1/2 w-2 -translate-x-1/2 bg-slate-900 rounded-full" />

        {storyChapter1.map((floor, index) => {
          const reqEndless = floor.floorNumber * 2;
          const isStoryLocked = floor.floorNumber > storyMax;
          const isEndlessLocked = endlessMax < reqEndless;
          const isLocked = isStoryLocked || isEndlessLocked;
          const isCurrent = floor.floorNumber === storyMax;
          const isCleared = floor.floorNumber < storyMax;
          const isLeft = index % 2 === 0;

          return (
            <div 
              key={floor.floorNumber}
              className={`relative flex items-center justify-${isLeft ? 'start' : 'end'} mb-16 group`}
            >
              {/* Connector dot to path */}
              <div className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-slate-950 z-10 transition-all
                ${isCleared ? 'bg-red-600' : isCurrent ? 'bg-amber-400 animate-pulse' : 'bg-slate-800'}
              `} />

              {/* Node Card */}
              <div className={`
                relative w-40 p-4 rounded-3xl border-2 transition-all z-20 shadow-xl
                ${isLocked 
                  ? 'bg-slate-950 border-slate-900 opacity-60 grayscale' 
                  : isCurrent 
                    ? 'bg-red-950/40 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)] scale-110'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                }
                ${isLeft ? 'mr-auto' : 'ml-auto'}
              `}>
                <div className="flex flex-col items-center text-center gap-2">
                  <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-red-400' : 'text-slate-500'}`}>
                    Floor {floor.floorNumber}
                  </h2>
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${isLocked ? 'border-slate-800 bg-slate-900' : 'border-slate-700 bg-slate-800'}`}>
                    {isLocked ? (
                      <Lock size={16} className="text-slate-700" />
                    ) : (
                      <span className="text-xl font-black">{floor.floorNumber === 10 ? '👑' : '👾'}</span>
                    )}
                  </div>

                  <p className={`text-[10px] font-black tracking-tight uppercase leading-tight ${isLocked ? 'text-slate-600' : 'text-white'}`}>
                    {isLocked && !isStoryLocked ? '???' : floor.enemies[0].name}
                  </p>
                  
                  {isEndlessLocked ? (
                    <div className="mt-1 flex flex-col items-center gap-1 text-[8px] font-black text-amber-500 uppercase tracking-tight bg-amber-500/10 px-2 py-1 rounded-lg">
                       <Swords size={10} />
                       Req. Endless {reqEndless}
                    </div>
                  ) : !isLocked ? (
                    <Link 
                      href={`/game?floor=${floor.floorNumber}`}
                      className={`
                        mt-1 w-full py-2 rounded-xl transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-1
                        ${isCurrent ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}
                      `}
                    >
                      <Play size={10} fill="currentColor" /> {isCurrent ? 'BATTLE' : 'REPLAY'}
                    </Link>
                  ) : null}
                </div>
              </div>
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
