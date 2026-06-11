"use client";

import Link from 'next/link';
import { useStoryStore } from '@/lib/game/storyProgress';
import { useMissionStore, DAILY_MISSIONS } from '@/lib/stores/missionStore';
import { Play, Users, User, Trophy, Coins, Repeat, CheckCircle2, Gem } from 'lucide-react';

export default function HomePage() {
  const { currentFloor, gold, maxFloorReached } = useStoryStore();
  const { battlesWon, summonsPerformed, levelsGained, claimedMissions, claimMission } = useMissionStore();

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

        {/* Daily Missions */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-5 shadow-inner">
          <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Daily Missions</h3>
             <span className="text-[8px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">Resets Daily</span>
          </div>
          
          <div className="space-y-3">
            {DAILY_MISSIONS.map(mission => {
              const isClaimed = claimedMissions.includes(mission.id);
              let progress = 0;
              if (mission.id === 'win_battles') progress = battlesWon;
              else if (mission.id === 'perform_summon') progress = summonsPerformed;
              else if (mission.id === 'level_up') progress = levelsGained;

              const isComplete = progress >= mission.target;
              const percent = Math.min(100, (progress / mission.target) * 100);

              return (
                <div key={mission.id} className={`p-3 rounded-2xl border transition-all ${isClaimed ? 'bg-slate-950/50 border-transparent opacity-50' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{mission.title}</p>
                      <p className="text-[8px] text-slate-500 font-bold">{mission.description}</p>
                    </div>
                    {isClaimed ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : isComplete ? (
                      <button 
                        onClick={() => claimMission(mission.id)}
                        className="bg-red-600 hover:bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg shadow-red-600/40"
                      >
                        CLAIM
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-slate-600">{progress}/{mission.target}</span>
                    )}
                  </div>
                  {!isClaimed && (
                    <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  )}
                  {!isClaimed && (
                    <div className="mt-2 flex gap-2">
                      {mission.rewardGold > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span className="text-[8px] font-black text-yellow-500">{mission.rewardGold}</span>
                        </div>
                      )}
                      {mission.rewardGems > 0 && (
                        <div className="flex items-center gap-1">
                          <Gem size={8} className="text-cyan-400" />
                          <span className="text-[8px] font-black text-cyan-400">{mission.rewardGems}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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
