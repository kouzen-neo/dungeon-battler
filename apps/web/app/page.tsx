"use client";

import Link from 'next/link';
import { useStoryStore } from '@/lib/game/storyProgress';
import { Play, Users, User, Trophy, Coins, Repeat } from 'lucide-react';

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
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} className="text-amber-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase">Records</span>
          </div>
          <p className="text-xl font-black">Floor {maxFloorReached}</p>
        </div>
        
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase">Gold</span>
          </div>
          <p className="text-xl font-black text-yellow-500">{gold.toLocaleString()}</p>
        </div>
      </section>

      <div className="flex-1 space-y-4">
        <Link 
          href="/story"
          className="group relative flex items-center justify-between p-6 bg-red-600 hover:bg-red-500 rounded-3xl transition-all shadow-[0_8px_0_rgb(153,27,27)] active:translate-y-2 active:shadow-none"
        >
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">STORY MODE</h2>
            <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">Current: Floor {currentFloor}</p>
          </div>
          <Play size={40} fill="white" className="text-white drop-shadow-lg" />
        </Link>

        <Link 
          href="/endless"
          className="w-full p-6 bg-slate-900 border-2 border-slate-800 rounded-3xl flex items-center justify-center gap-3 hover:bg-slate-800 hover:border-red-900/50 transition-all active:scale-95 shadow-xl"
        >
          <Repeat size={24} className="text-red-500" />
          <span className="text-sm font-black text-white italic uppercase tracking-tighter">Enter Endless Dungeon</span>
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/hero"
            className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-[32px] hover:bg-slate-800 transition-all active:scale-95 shadow-md"
          >
            <Users size={32} className="text-blue-500 mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Hero Hub</span>
          </Link>

          <Link 
            href="/profile"
            className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-[32px] hover:bg-slate-800 transition-all active:scale-95 shadow-md"
          >
            <User size={32} className="text-green-500 mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
          </Link>
        </div>
      </div>

      <footer className="py-8 text-center">
        <p className="text-[8px] text-slate-700 font-black tracking-[0.4em] uppercase">
          Build v0.1.5-alpha
        </p>
      </footer>
    </main>
  );
}
