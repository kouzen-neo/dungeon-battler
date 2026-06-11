"use client";

import React, { useState } from 'react';
import { useHeroStore, OwnedHero } from '@/lib/stores/heroStore';
import { useStoryStore } from '@/lib/game/storyProgress';
import { Coins, User, Shield, Sword, Zap, Heart, Sparkles, ArrowUpCircle, Volume2, VolumeX, Book, Trophy } from 'lucide-react';
import Link from 'next/link';
import PixelSprite from '@/components/ui/PixelSprite';
import { useAudioStore } from '@/lib/stores/audioStore';

export default function ProfilePage() {
  const { ownedHeroes, partyIds, setParty, levelUpHero } = useHeroStore();
  const gold = useStoryStore((state) => state.gold);
  const [selectedHero, setSelectedHero] = useState<OwnedHero | null>(ownedHeroes[0]);
  const { isMuted, setMuted } = useAudioStore();

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
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 overflow-hidden">
              <PixelSprite spriteId={selectedHero.id} element={selectedHero.baseStats.element} size={48} />
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
          <div className="flex gap-2">
            <Link href="/leaderboard" className="text-[10px] font-black text-blue-500 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 active:scale-95">
              <Trophy size={10} /> RANKINGS
            </Link>
            <Link href="/archive" className="text-[10px] font-black text-amber-500 flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 active:scale-95">
              <Book size={10} /> ARCHIVE
            </Link>
            <Link href="/gacha" className="text-[10px] font-black text-red-500 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 active:scale-95">
              <Sparkles size={10} /> GACHA
            </Link>
          </div>
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
                <PixelSprite spriteId={hero.id} element={hero.baseStats.element} size={36} cropToHead={true} />
                <span className="text-[10px] font-bold text-slate-400 truncate w-full px-1 text-center">{hero.name.split(' ')[0]}</span>
                
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

        {/* Settings */}
        <div className="mt-8 mb-4 p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Settings</h3>
          
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isMuted ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tighter">Audio Sound</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{isMuted ? 'Muted' : 'Enabled'}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setMuted(!isMuted)}
              className={`
                w-12 h-6 rounded-full relative transition-all duration-300
                ${isMuted ? 'bg-slate-800' : 'bg-green-600'}
              `}
            >
              <div className={`
                absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300
                ${isMuted ? 'left-1' : 'left-7'}
              `} />
            </button>
          </div>
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
