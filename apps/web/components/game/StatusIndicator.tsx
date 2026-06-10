"use client";

import React from 'react';

interface UnitStatusProps {
  name: string;
  currentHp: number;
  maxHp: number;
  isEnemy?: boolean;
}

export default function StatusIndicator({ name, currentHp, maxHp, isEnemy }: UnitStatusProps) {
  const hpPercent = (currentHp / maxHp) * 100;
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`flex flex-col gap-1 ${isEnemy ? 'items-end' : 'items-start'}`}>
      <div className="flex justify-between w-full px-1">
        <span className="text-[10px] font-bold uppercase tracking-wider">{name}</span>
        <span className="text-[10px] font-mono">{currentHp}/{maxHp}</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
        <div 
          className={`h-full ${hpColor} transition-all duration-300`} 
          style={{ width: `${hpPercent}%` }}
        />
      </div>
    </div>
  );
}
