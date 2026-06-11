"use client";

import React from 'react';
import StatusIndicator from './StatusIndicator';

interface BattleUnit {
  id: string;
  name: string;
  currentHp: number;
  currentEnergy: number;
  maxEnergy: number;
  stats: { hp: number };
}

interface PartyStatusProps {
  party: BattleUnit[];
  activeUnitId?: string | null;
}

export default function PartyStatus({ party, activeUnitId }: PartyStatusProps) {
  return (
    <div className="flex flex-col gap-2 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 shadow-lg">
      <h3 className="text-[10px] text-slate-500 font-bold mb-1 px-1">PARTY</h3>
      {party.map((unit) => (
        <StatusIndicator 
          key={unit.id} 
          name={unit.name} 
          currentHp={unit.currentHp} 
          maxHp={unit.stats.hp} 
          currentEnergy={unit.currentEnergy}
          maxEnergy={unit.maxEnergy}
          isActive={unit.id === activeUnitId}
        />
      ))}
    </div>
  );
}
