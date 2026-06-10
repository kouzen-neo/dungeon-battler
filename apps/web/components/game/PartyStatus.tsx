"use client";

import React from 'react';
import StatusIndicator from './StatusIndicator';

interface BattleUnit {
  id: string;
  name: string;
  currentHp: number;
  stats: { hp: number };
}

export default function PartyStatus({ party }: { party: BattleUnit[] }) {
  return (
    <div className="flex flex-col gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 shadow-lg">
      <h3 className="text-[10px] text-slate-500 font-bold mb-1">PARTY</h3>
      {party.map((unit) => (
        <StatusIndicator 
          key={unit.id} 
          name={unit.name} 
          currentHp={unit.currentHp} 
          maxHp={unit.stats.hp} 
        />
      ))}
    </div>
  );
}
