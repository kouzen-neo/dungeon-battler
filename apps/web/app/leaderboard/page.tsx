"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: string;
  score: number;
  user: {
    email: string;
  };
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setEntries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <header className="flex items-center justify-between py-6">
        <Link href="/profile" className="p-2 hover:bg-slate-900 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-black tracking-widest text-red-500 flex items-center gap-2">
          <Trophy size={20} />
          RANKINGS
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 bg-slate-900/50 rounded-[40px] border-2 border-slate-800 overflow-hidden flex flex-col mb-20">
        <div className="p-6 bg-slate-900 border-b border-slate-800">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Global Leaderboard</h2>
          <p className="text-lg font-black italic tracking-tighter">ENDLESS TOP PLAYERS</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-bold animate-pulse uppercase text-xs">Loading Rankings...</div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold uppercase text-xs">No records yet</div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {entries.map((entry, i) => (
                <div key={entry.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center">
                      {i === 0 ? <Crown size={20} className="text-yellow-500" /> : 
                       i === 1 ? <Medal size={20} className="text-slate-300" /> :
                       i === 2 ? <Medal size={20} className="text-amber-600" /> :
                       <span className="text-xs font-black text-slate-600">#{i + 1}</span>}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tighter">
                        {entry.user.email.split('@')[0]}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Player</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-red-500 leading-none">{entry.score}</p>
                    <p className="text-[8px] text-slate-600 font-bold uppercase">Floors</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
