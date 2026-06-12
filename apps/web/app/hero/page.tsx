"use client";

import React, { useState, useMemo } from 'react';
import { useHeroStore, OwnedHero } from '@/lib/stores/heroStore';
import { useStoryStore } from '@/lib/game/storyProgress';
import { 
  UserCircle, Shield, Sword, Zap, Heart, Sparkles, 
  ArrowUpCircle, Book, Trophy, Gem, Ticket, ChevronLeft,
  Users
} from 'lucide-react';
import Link from 'next/link';
import PixelSprite from '@/components/ui/PixelSprite';
import { useHaptic } from '@/hooks/useHaptic';

type HeroTab = 'MANAGEMENT' | 'SUMMON' | 'ARCHIVE';

export default function HeroHubPage() {
  const [activeTab, setActiveTab] = useState<HeroTab>('MANAGEMENT');
  const { ownedHeroes, partyIds, shards, setParty, levelUpHero, upgradeStar } = useHeroStore();
  const gold = useStoryStore((state) => state.gold);
  const gems = useStoryStore((state) => state.gems);
  const [selectedHero, setSelectedHero] = useState<OwnedHero | null>(ownedHeroes[0]);
  const { vibrate } = useHaptic();

  const toggleParty = (id: string) => {
    vibrate(10);
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
        vibrate(20);
        const updated = useHeroStore.getState().ownedHeroes.find(h => h.instanceId === selectedHero.instanceId);
        if (updated) setSelectedHero(updated);
      } else {
        alert("Not enough gold!");
      }
    }
  };

  const handleUpgradeStar = async () => {
    if (selectedHero) {
      const success = await upgradeStar(selectedHero.instanceId);
      if (success) {
        vibrate([30, 50, 30]); // Distinct evolution feel
        const updated = useHeroStore.getState().ownedHeroes.find(h => h.instanceId === selectedHero.instanceId);
        if (updated) setSelectedHero(updated);
      } else {
        alert("Not enough shards!");
      }
    }
  };

  const currentHeroShards = selectedHero ? (shards[selectedHero.id] || 0) : 0;
  const starUpgradeCost = selectedHero ? [0, 20, 50, 100, 200][selectedHero.stars] : 0;

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white max-w-md mx-auto relative overflow-hidden">
      {/* Dynamic Header based on Tab */}
      <header className="flex-shrink-0 pt-6 pb-2 px-4 flex justify-between items-center z-20 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <Users className="text-red-500" size={24} />
          <h1 className="text-xl font-black tracking-widest text-red-500 uppercase">HERO HUB</h1>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center text-[8px] font-black text-slate-950 italic">G</div>
            <span className="text-[10px] font-black text-yellow-500 tabular-nums">{gold}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            <Gem size={10} className="text-cyan-400" />
            <span className="text-[10px] font-black text-cyan-400 tabular-nums">{gems}</span>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Tabs */}
      <div className="px-4 py-4 flex gap-2 z-10 sticky top-[72px] bg-slate-950/80 backdrop-blur-md">
        <TabButton 
          active={activeTab === 'MANAGEMENT'} 
          onClick={() => setActiveTab('MANAGEMENT')} 
          label="Heroes" 
          icon={<Shield size={14} />} 
        />
        <TabButton 
          active={activeTab === 'SUMMON'} 
          onClick={() => setActiveTab('SUMMON')} 
          label="Summon" 
          icon={<Sparkles size={14} />} 
        />
        <Link href="/archive" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-slate-500 hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-widest">
           <Book size={14} /> Archive
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 z-0">
        {activeTab === 'MANAGEMENT' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Stats Card */}
            {selectedHero && (
              <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="text-8xl font-black italic">{selectedHero.rarity}</span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 overflow-hidden shadow-inner">
                    <PixelSprite spriteId={selectedHero.id} element={selectedHero.baseStats.element} size={48} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h2 className="text-xl font-black">{selectedHero.name}</h2>
                       <div className="flex text-amber-500">
                          {Array.from({ length: selectedHero.stars }).map((_, i) => (
                            <Sparkles key={i} size={10} fill="currentColor" />
                          ))}
                       </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-bold uppercase">{selectedHero.rarity}</span>
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">LV. {selectedHero.level} • {selectedHero.type}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <HeroStat 
                    icon={<Heart size={14} />} 
                    label="HP" 
                    value={selectedHero.baseStats.hp} 
                    nextValue={Math.floor(selectedHero.baseStats.hp * 1.1)}
                    color="text-green-500" 
                  />
                  <HeroStat 
                    icon={<Sword size={14} />} 
                    label="ATK" 
                    value={selectedHero.baseStats.atk} 
                    nextValue={Math.floor(selectedHero.baseStats.atk * 1.1)}
                    color="text-red-500" 
                  />
                  <HeroStat 
                    icon={<Shield size={14} />} 
                    label="DEF" 
                    value={selectedHero.baseStats.def} 
                    nextValue={Math.floor(selectedHero.baseStats.def * 1.1)}
                    color="text-blue-500" 
                  />
                  <HeroStat 
                    icon={<Zap size={14} />} 
                    label="SPD" 
                    value={selectedHero.baseStats.spd} 
                    nextValue={selectedHero.baseStats.spd}
                    color="text-yellow-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleLevelUp}
                    className="py-4 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <ArrowUpCircle size={16} />
                    UP LV ({selectedHero.level * 50}G)
                  </button>
                  <button
                    onClick={handleUpgradeStar}
                    disabled={selectedHero.stars >= 5 || currentHeroShards < starUpgradeCost}
                    className={`
                      py-4 font-black rounded-2xl transition-all flex flex-col items-center justify-center relative overflow-hidden text-xs
                      ${selectedHero.stars >= 5 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : currentHeroShards >= starUpgradeCost
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_4px_0_rgb(180,83,9)] active:translate-y-1 active:shadow-none'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'}
                    `}
                  >
                    <div className="flex items-center gap-1">
                      <Sparkles size={16} fill={currentHeroShards >= starUpgradeCost ? "black" : "none"} />
                      <span>EVOLVE</span>
                    </div>
                    <span className={`text-[8px] font-black ${currentHeroShards >= starUpgradeCost ? 'text-amber-900' : 'text-slate-500'}`}>
                      {currentHeroShards}/{starUpgradeCost} SHARDS
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Party Members ({partyIds.length}/3)</h3>
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
                      ${isInParty ? 'ring-2 ring-amber-500/30' : ''}
                    `}
                  >
                    <PixelSprite spriteId={hero.id} element={hero.baseStats.element} size={36} cropToHead={true} />
                    <span className="text-[8px] font-black text-slate-400 truncate w-full px-1 text-center uppercase tracking-tighter">{hero.name.split(' ')[0]}</span>
                    
                    {/* Stars indicator on icon */}
                    <div className="absolute bottom-1 right-1 flex gap-0.5">
                       {Array.from({ length: hero.stars }).map((_, i) => (
                         <div key={i} className="w-1 h-1 bg-amber-500 rounded-full" />
                       ))}
                    </div>
                    
                    <div 
                      onClick={(e) => { e.stopPropagation(); toggleParty(hero.instanceId); }}
                      className={`
                        absolute -top-1 -right-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                        ${isInParty ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-700'}
                      `}
                    >
                      <UserCircle size={12} fill={isInParty ? 'currentColor' : 'none'} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'SUMMON' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col pt-4">
            <GachaEmbed />
          </div>
        )}
      </div>
    </main>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest
        ${active 
          ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' 
          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}
      `}
    >
      {icon} {label}
    </button>
  );
}

function HeroStat({ icon, label, value, nextValue, color }: { icon: any, label: string, value: number, nextValue?: number, color: string }) {
  const diff = nextValue ? nextValue - value : 0;
  
  return (
    <div className="bg-slate-950/50 p-2 rounded-xl flex items-center gap-2 border border-slate-800/50 group hover:border-slate-700 transition-all">
      <div className={`${color} opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[8px] font-black text-slate-500 leading-none uppercase tracking-tighter">{label}</span>
        <div className="flex items-center gap-1.5 mt-0.5">
           <span className="text-sm font-black leading-none tabular-nums text-white">{value}</span>
           {diff > 0 && (
             <div className="flex items-center text-[10px] font-black text-green-500 animate-in slide-in-from-left-1">
                <ArrowUpCircle size={8} fill="currentColor" className="text-green-500/20" />
                <span>{nextValue}</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

// Minimal embedded version of gacha page
function GachaEmbed() {
  const pullGacha = useHeroStore((state) => state.pullGacha);
  const pullGachaTen = useHeroStore((state) => state.pullGachaTen);
  const pityCounter = useHeroStore((state) => state.pityCounter);
  const gems = useStoryStore((state) => state.gems);
  const { vibrate } = useHaptic();
  
  const [isPulling, setIsPulling] = useState(false);
  const [results, setResults] = useState<Array<{ hero: OwnedHero, isNew: boolean, shardsAwarded?: number }>>([]);

  const handlePull = async (isTen: boolean) => {
    const cost = isTen ? 900 : 100;
    if (gems < cost) {
      alert("Not enough gems!");
      return;
    }
    vibrate([20, 20, 20]); // Anticipation vibration
    setIsPulling(true);
    setResults([]);
    
    setTimeout(async () => {
      if (isTen) {
        const data = await pullGachaTen();
        setResults(data);
      } else {
        const data = await pullGacha();
        if (data.hero) {
          setResults([{ hero: data.hero, isNew: data.isNew, shardsAwarded: data.shardsAwarded }]);
        }
      }
      setIsPulling(false);
      vibrate([50, 100, 50]); // Success vibration
    }, 1500);
  };

  const getRarityStyle = (rarity: string) => {
    if (rarity === 'SSR') return 'border-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.5)] bg-amber-950/20';
    if (rarity === 'SR') return 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-purple-950/20';
    return 'border-slate-800 bg-slate-900';
  };

  if (results.length > 0) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 py-4 h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2">
           <div className={`grid ${results.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
             {results.map((res, i) => (
               <div 
                 key={i} 
                 className={`
                   relative p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden
                   ${getRarityStyle(res.hero.rarity)}
                   animate-in zoom-in slide-in-from-bottom-2 duration-500
                 `}
                 style={{ animationDelay: `${i * 100}ms` }}
               >
                  <PixelSprite spriteId={res.hero.id} element={res.hero.baseStats.element} size={results.length > 1 ? 48 : 96} />
                  <div className="text-center">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase mb-1 inline-block ${res.hero.rarity === 'SSR' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-white'}`}>
                      {res.hero.rarity}
                    </span>
                    <h3 className={`${results.length > 1 ? 'text-xs' : 'text-xl'} font-black uppercase leading-tight truncate`}>{res.hero.name}</h3>
                    {res.isNew ? (
                      <p className="text-[8px] font-black text-red-500 animate-pulse mt-1">NEW HERO!</p>
                    ) : (
                      <p className="text-[8px] font-black text-amber-500 mt-1">+{res.shardsAwarded} SHARDS</p>
                    )}
                  </div>
               </div>
             ))}
           </div>
        </div>
        <button
          onClick={() => setResults([])}
          className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 shrink-0"
        >
          AWESOME!
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8 py-10">
      <div className="relative">
        <div className="w-48 h-48 bg-slate-900 rounded-[40px] border-4 border-slate-800 flex items-center justify-center shadow-2xl mx-auto relative z-10">
          <Ticket size={80} className={isPulling ? "animate-spin text-red-500" : "text-red-600 animate-bounce"} />
        </div>
        <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full scale-125 animate-pulse" />
        
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full z-20 shadow-xl flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">SSR Pity</span>
           <span className="text-sm font-black text-red-500 tabular-nums">{pityCounter}/50</span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">Hero Summon</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rate Up: Shadow Blade (SSR)</p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handlePull(false)}
          disabled={isPulling}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <div className="flex items-center gap-1.5">
             <Gem size={14} className="text-cyan-400" />
             <span className="text-cyan-400">100</span>
          </div>
          <span className="text-white uppercase tracking-widest">Single Summon</span>
        </button>

        <button
          onClick={() => handlePull(true)}
          disabled={isPulling}
          className="w-full py-6 bg-red-600 hover:bg-red-500 rounded-3xl text-xl font-black italic tracking-tight shadow-[0_8px_0_rgb(153,27,27)] active:translate-y-2 active:shadow-none transition-all flex flex-col items-center justify-center disabled:opacity-50 relative overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <Sparkles fill="white" size={20} />
            <span>SUMMON X10</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
             <Gem size={10} className="text-red-200" />
             <span className="text-xs text-red-100 font-bold strike-through opacity-50">1000</span>
             <span className="text-xs text-white font-black">900 GEMS</span>
          </div>
          {/* Discount Tag */}
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-950 text-[8px] font-black px-2 py-0.5 rounded-full transform rotate-12 shadow-md">
             10% OFF
          </div>
        </button>
      </div>
    </div>
  );
}
