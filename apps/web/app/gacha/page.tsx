"use client";

import React, { useState } from 'react';
import { useHeroStore, OwnedHero } from '@/lib/stores/heroStore';
import { useStoryStore } from '@/lib/game/storyProgress';
import { Coins, Sparkles, ChevronLeft, Ticket } from 'lucide-react';
import Link from 'next/link';
import PixelSprite from '@/components/ui/PixelSprite';

export default function GachaPage() {
  const pullGacha = useHeroStore((state) => state.pullGacha);
  const gold = useStoryStore((state) => state.gold);
  
  const [isPulling, setIsPulling] = useState(false);
  const [result, setResult] = useState<OwnedHero | null>(null);

  const handlePull = async () => {
    if (gold < 100) {
      alert("Not enough gold! Go battle to earn more.");
      return;
    }

    setIsPulling(true);
    setResult(null);

    // Artificial delay for suspense
    setTimeout(async () => {
      const hero = await pullGacha();
      setResult(hero);
      setIsPulling(false);
    }, 2000);
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-red-600/5 blur-[120px] pointer-events-none" />

      <header className="flex items-center justify-between py-6 z-10">
        <Link href="/profile" className="p-2 hover:bg-slate-900 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-black tracking-widest text-red-500 flex items-center gap-2">
          <Sparkles size={20} />
          SUMMON
        </h1>
        <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <Coins size={14} className="text-yellow-500" />
          <span className="text-sm font-bold text-yellow-500">{gold}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        {!result && !isPulling ? (
          <div className="text-center space-y-8 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="w-48 h-48 bg-slate-900 rounded-[40px] border-4 border-slate-800 flex items-center justify-center shadow-2xl relative z-10">
                <Ticket size={80} className="text-red-600 animate-bounce" />
              </div>
              <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full scale-150 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black italic tracking-tighter">HERO SUMMON</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Random Hero • 100 Gold / Pull</p>
            </div>

            <button
              onClick={handlePull}
              className="w-full py-6 bg-red-600 hover:bg-red-500 rounded-3xl text-xl font-black italic tracking-tight shadow-[0_8px_0_rgb(153,27,27)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <Sparkles fill="white" /> SUMMON NOW
            </button>
          </div>
        ) : isPulling ? (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-red-600 rounded-full animate-ping opacity-20 mx-auto" />
            <p className="text-xl font-black italic text-red-500 animate-pulse">SUMMONING...</p>
          </div>
        ) : (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="relative">
               <div className="w-56 h-72 bg-slate-900 border-4 border-red-500 rounded-[40px] p-6 shadow-[0_0_60px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center gap-4 relative z-10 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <span className="text-9xl font-black italic">{result?.rarity}</span>
                  </div>
                  {result && <PixelSprite spriteId={result.id} element={result.baseStats.element} size={96} />}
                  <div className="text-center">
                    <span className="text-[10px] bg-red-600 px-3 py-1 rounded-full font-bold uppercase mb-2 inline-block">
                      {result?.rarity}
                    </span>
                    <h2 className="text-2xl font-black tracking-tight">{result?.name}</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase">{result?.type}</p>
                  </div>
               </div>
               <div className="absolute inset-0 bg-white blur-3xl opacity-20 scale-110" />
            </div>

            <div className="space-y-4">
               <button
                 onClick={() => setResult(null)}
                 className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest"
               >
                 AWESOME!
               </button>
               <button
                 onClick={handlePull}
                 className="w-full py-4 border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
               >
                 SUMMON AGAIN
               </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
