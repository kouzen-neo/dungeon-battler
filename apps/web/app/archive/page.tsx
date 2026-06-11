"use client";

import React, { useMemo } from 'react';
import { useHeroStore } from '@/lib/stores/heroStore';
import { heroTemplates } from '@/lib/game/heroData';
import { Book, Shield, Sword, Zap, Heart, Lock, CheckCircle2 } from 'lucide-react';
import PixelSprite from '@/components/ui/PixelSprite';
import Link from 'next/link';

export default function ArchivePage() {
  const { ownedHeroes } = useHeroStore();

  // Create a list of all heroes, marking them as owned or not
  const archiveHeroes = useMemo(() => {
    return Object.values(heroTemplates).map(template => {
      const isOwned = ownedHeroes.some(h => h.id === template.id);
      return {
        ...template,
        isOwned
      };
    });
  }, [ownedHeroes]);

  const stats = useMemo(() => {
    const total = archiveHeroes.length;
    const owned = archiveHeroes.filter(h => h.isOwned).length;
    return { total, owned, percent: Math.round((owned / total) * 100) };
  }, [archiveHeroes]);

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto pb-24">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Book className="text-red-500" size={24} />
          <h1 className="text-xl font-black tracking-widest text-red-500 uppercase">ARCHIVE</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Collection</p>
          <p className="text-sm font-black text-white">{stats.owned} / {stats.total}</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-900 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Progress</span>
          <span className="text-[10px] font-bold text-red-500">{stats.percent}%</span>
        </div>
        <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-red-600 transition-all duration-1000 ease-out" 
            style={{ width: `${stats.percent}%` }}
          />
        </div>
      </div>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 gap-4">
        {archiveHeroes.map((hero) => (
          <div 
            key={hero.id}
            className={`
              relative p-4 rounded-3xl border-2 transition-all flex gap-4 items-center overflow-hidden
              ${hero.isOwned 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-slate-950 border-slate-900 opacity-60 grayscale'
              }
            `}
          >
            {/* Status Icon */}
            <div className="absolute top-3 right-3">
              {hero.isOwned ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Lock size={16} className="text-slate-700" />
              )}
            </div>

            {/* Sprite Container */}
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center border shrink-0
              ${hero.isOwned ? 'bg-slate-950 border-slate-800 shadow-inner' : 'bg-black border-slate-900'}
            `}>
              <PixelSprite 
                spriteId={hero.id} 
                element={hero.baseStats.element} 
                size={64} 
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-lg truncate leading-none uppercase tracking-tighter">
                  {hero.isOwned ? hero.name : '???'}
                </h3>
                {hero.isOwned && (
                   <span className="text-[8px] bg-red-600 px-1.5 py-0.5 rounded font-bold">{hero.rarity}</span>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                {hero.isOwned ? `${hero.baseStats.element} ${hero.type}` : 'Unknown Hero'}
              </p>

              {/* Mini Stats */}
              <div className="flex gap-3">
                <ArchiveStat icon={<Heart size={10} />} value={hero.isOwned ? hero.baseStats.hp : '??'} color="text-green-500" />
                <ArchiveStat icon={<Sword size={10} />} value={hero.isOwned ? hero.baseStats.atk : '??'} color="text-red-500" />
                <ArchiveStat icon={<Shield size={10} />} value={hero.isOwned ? hero.baseStats.def : '??'} color="text-blue-500" />
                <ArchiveStat icon={<Zap size={10} />} value={hero.isOwned ? hero.baseStats.spd : '??'} color="text-yellow-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link 
        href="/hero"
        className="mt-8 block w-full py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 font-black text-center rounded-2xl border border-slate-800 transition-all active:scale-95 text-xs uppercase"
      >
        Kembali ke Hero Hub
      </Link>
    </main>
  );
}

function ArchiveStat({ icon, value, color }: { icon: React.ReactNode, value: number | string, color: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`${color} opacity-50`}>{icon}</div>
      <span className="text-[10px] font-mono text-slate-400">{value}</span>
    </div>
  );
}
