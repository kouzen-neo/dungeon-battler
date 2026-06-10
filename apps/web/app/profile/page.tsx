"use client";

import React, { useState } from 'react';
import { useHeroStore, OwnedHero } from '@/lib/stores/heroStore';
import { useStoryStore } from '@/lib/game/storyProgress';
import { Coins, User, Shield, Sword, Zap, Heart, Sparkles, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { ownedHeroes, partyIds, setParty, levelUpHero } = useHeroStore();
  const gold = useStoryStore((state) => state.gold);
  const [selectedHero, setSelectedHero] = useState<OwnedHero | null>(ownedHeroes[0]);

  const toggleParty = (id: string) => {
    if (partyIds.includes(id)) {
      setParty(partyIds.filter(pid => pid !== id));
    } else if (partyIds.length < 3) {
      setParty([...partyIds, id]);
    }
  };

  const handleLevelUp = async () => {
    if (selectedHero) {
      const success = await levelUpHero(selectedHero.instanceId);
      if (success) {
        // Update selected hero display
        const updated = useHeroStore.getState().ownedHeroes.find(h => h.instanceId === selectedHero.instanceId);
        if (updated) setSelectedHero(updated);
      } else {
        alert("Not enough gold!");
      }
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <header className="flex items-center justify-between py-6">
        <h1 className="text-xl font-black tracking-widest text-red-500 flex items-center gap-2">
          <User size={20} />
          PROFILE
        </h1>
        <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <Coins size={14} className="text-yellow-500" />
          <span className="text-sm font-bold text-yellow-500">{gold}</span>
        </div>
      </header>

      {/* Hero Stats Card */}
      {selectedHero && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-8xl font-black italic">{selectedHero.rarity}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-4xl border border-slate-800">
              {selectedHero.icon}
            </div>
            <div>
              <h2 className="text-xl font-black">{selectedHero.name}</h2>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-bold uppercase">{selectedHero.rarity}</span>
                <span className="text-xs text-slate-500 font-bold">LV. {selectedHero.level} {selectedHero.type}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatItem icon={<Heart size={14} />} label="HP" value={selectedHero.baseStats.hp} color="text-green-500" />
            <StatItem icon={<Sword size={14} />} label="ATK" value={selectedHero.baseStats.atk} color="text-red-500" />
            <StatItem icon={<Shield size={14} />} label="DEF" value={selectedHero.baseStats.def} color="text-blue-500" />
            <StatItem icon={<Zap size={14} />} label="SPD" value={selectedHero.baseStats.spd} color="text-yellow-500" />
          </div>

          <button
            onClick={handleLevelUp}
            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <ArrowUpCircle size={20} />
            LEVEL UP ({selectedHero.level * 50}G)
          </button>
        </div>
      )}

      {/* Hero List */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Collection ({ownedHeroes.length})</h3>
          <Link href="/gacha" className="text-xs font-black text-red-500 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 active:scale-95">
            <Sparkles size={12} /> GACHA NEW HERO
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {ownedHeroes.map((hero) => {
            const isInParty = partyIds.includes(hero.instanceId);
            const isSelected = selectedHero?.instanceId === hero.instanceId;

            return (
              <button
                key={hero.instanceId}
                onClick={() => setSelectedHero(hero)}
                className={`
                  relative aspect-square rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1
                  ${isSelected ? 'border-red-500 bg-red-950/20' : 'border-slate-900 bg-slate-900/50'}
                `}
              >
                <span className="text-2xl">{hero.icon}</span>
                <span className="text-[10px] font-bold text-slate-400 truncate w-full px-1">{hero.name.split(' ')[0]}</span>
                
                <div 
                  onClick={(e) => { e.stopPropagation(); toggleParty(hero.instanceId); }}
                  className={`
                    absolute -top-1 -right-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                    ${isInParty ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-700'}
                  `}
                >
                  <Shield size={12} fill={isInParty ? 'white' : 'none'} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Dev Menu */}
        <div className="mt-4 p-4 bg-slate-900/30 border border-slate-800 rounded-3xl">
          <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Dev Menu</h3>
          <button 
            onClick={() => useStoryStore.setState({ gold: 999999 })}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold rounded-xl transition-all active:scale-95"
          >
            GET UNLIMITED GOLD (999,999)
          </button>
        </div>
      </div>
    </main>
  );
}

function StatItem({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="bg-slate-950/50 p-2 rounded-xl flex items-center gap-2 border border-slate-800/50">
      <div className={`${color} opacity-50`}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-[8px] font-bold text-slate-500 leading-none">{label}</span>
        <span className="text-sm font-black leading-none">{value}</span>
      </div>
    </div>
  );
}
