"use client";

import Link from 'next/link';
import { useStoryStore } from '@/lib/game/storyProgress';
import { Play, ShoppingBag, User, Trophy, Coins, Sword } from 'lucide-react';

export default function HomePage() {
  const { currentFloor, gold, maxFloorReached } = useStoryStore();

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-6 max-w-md mx-auto">
      <header className="py-12 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-red-600 mb-2">
          DUNGEON<br />BATTLER
        </h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
          Mobile Roguelite RPG
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} className="text-yellow-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Best</span>
          </div>
          <p className="text-2xl font-black">Floor {maxFloorReached}</p>
        </div>
        
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={14} className="text-yellow-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Gold</span>
          </div>
          <p className="text-2xl font-black text-yellow-500">{gold}</p>
        </div>
      </section>

      <div className="flex-1 space-y-4">
        <Link 
          href="/story"
          className="group relative flex items-center justify-between p-6 bg-red-600 hover:bg-red-500 rounded-3xl transition-all shadow-[0_8px_0_rgb(153,27,27)] active:translate-y-2 active:shadow-none"
        >
          <div>
            <h2 className="text-2xl font-black text-white italic">STORY MODE</h2>
            <p className="text-xs font-bold text-red-200">Current: Floor {currentFloor}</p>
          </div>
          <Play size={40} fill="white" className="text-white" />
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/shop"
            className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-slate-800 transition-all active:scale-95"
          >
            <ShoppingBag size={32} className="text-blue-500 mb-2" />
            <span className="text-xs font-bold uppercase">Shop</span>
          </Link>

          <Link 
            href="/profile"
            className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-slate-800 transition-all active:scale-95"
          >
            <User size={32} className="text-green-500 mb-2" />
            <span className="text-xs font-bold uppercase">Hero</span>
          </Link>
        </div>

        <button 
          disabled
          className="w-full p-6 bg-slate-900/50 border border-slate-800/50 rounded-3xl flex items-center justify-center gap-3 opacity-50 grayscale"
        >
          <Sword size={24} className="text-slate-600" />
          <span className="text-sm font-black text-slate-600">ENDLESS MODE (LOCKED)</span>
        </button>
      </div>

      <footer className="py-8 text-center">
        <p className="text-[10px] text-slate-700 font-bold tracking-widest uppercase">
          Build v0.1.0-alpha
        </p>
      </footer>
    </main>
  );
}
