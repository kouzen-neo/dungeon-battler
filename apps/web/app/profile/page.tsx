"use client";

import React from 'react';
import { useStoryStore } from '@/lib/game/storyProgress';
import { useEndlessStore } from '@/lib/stores/endlessStore';
import { 
  User, Coins, Gem, Trophy, Volume2, VolumeX, Settings, 
  BarChart3, Calendar, ShieldCheck
} from 'lucide-react';
import { useAudioStore } from '@/lib/stores/audioStore';

export default function ProfilePage() {
  const gold = useStoryStore((state) => state.gold);
  const gems = useStoryStore((state) => state.gems);
  const { maxFloorReached: endlessMax } = useEndlessStore();
  const { maxFloorReached: storyMax } = useStoryStore();
  const { isMuted, setMuted } = useAudioStore();

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <header className="flex items-center justify-between py-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-white uppercase leading-none">PLAYER</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Level 1 Adventurer</p>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard 
          icon={<Coins size={16} className="text-yellow-500" />} 
          label="Total Gold" 
          value={gold.toLocaleString()} 
        />
        <StatCard 
          icon={<Gem size={16} className="text-cyan-400" />} 
          label="Premium Gems" 
          value={gems.toLocaleString()} 
        />
        <StatCard 
          icon={<Trophy size={16} className="text-amber-500" />} 
          label="Endless Record" 
          value={`Floor ${endlessMax}`} 
        />
        <StatCard 
          icon={<ShieldCheck size={16} className="text-blue-500" />} 
          label="Story Progress" 
          value={`Floor ${storyMax}`} 
        />
      </div>

      <div className="space-y-6">
        {/* Settings Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Settings size={14} className="text-slate-500" />
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Game Settings</h2>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800/50">
            <div className="flex items-center justify-between p-5 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${isMuted ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-white">Audio & Sound</p>
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

            <div className="p-5 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-800 rounded-xl text-slate-400">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-white">Game Statistics</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase italic italic">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section>
           <div className="flex items-center gap-2 mb-4 px-1">
            <Calendar size={14} className="text-slate-500" />
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Account Info</h2>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Joined</span>
              <span className="text-xs font-black text-white">June 12, 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Region</span>
              <span className="text-xs font-black text-white">Indonesia</span>
            </div>
          </div>
        </section>

        {/* Logout Placeholder */}
        <button 
          className="w-full py-4 bg-slate-900 border-2 border-slate-800 hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-500 text-slate-500 font-black rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest"
          onClick={() => alert("Cloud Sync active. Data is saved locally.")}
        >
          Sign Out / Switch Account
        </button>
      </div>

      {/* Dev Menu */}
      <div className="mt-12 mb-20 p-4 bg-slate-900/20 border border-slate-900 rounded-3xl border-dashed">
        <h3 className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] mb-3 text-center">Dev Debug Tools</h3>
        <button 
          onClick={() => useStoryStore.setState({ gold: 999999, gems: 9999 })}
          className="w-full py-2.5 bg-slate-900/50 hover:bg-slate-800 text-slate-600 text-[9px] font-black rounded-xl transition-all"
        >
          RESET RESOURCES (999k G / 9k Gems)
        </button>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-sm hover:border-slate-700 transition-colors">
      <div className="mb-3">{icon}</div>
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-base font-black text-white">{value}</p>
    </div>
  );
}
