"use client";

import React from 'react';

interface UnitStatusProps {
  name: string;
  currentHp: number;
  maxHp: number;
  currentEnergy?: number;
  maxEnergy?: number;
  isEnemy?: boolean;
  isActive?: boolean;
}

export default function StatusIndicator({ 
  name, currentHp, maxHp, currentEnergy, maxEnergy, isEnemy, isActive 
}: UnitStatusProps) {
  const hpPercent = (currentHp / maxHp) * 100;
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500';

  const showEnergy = currentEnergy !== undefined && maxEnergy !== undefined;
  const energyPercent = showEnergy ? (currentEnergy! / maxEnergy!) * 100 : 0;

  return (
    <div className={`
      flex flex-col gap-1 w-full p-1.5 rounded-lg transition-all duration-300
      ${isEnemy ? 'items-end' : 'items-start'}
      ${isActive 
        ? 'bg-amber-500/10 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)] scale-105 z-10' 
        : 'border border-transparent'
      }
    `}>
      <div className="flex justify-between w-full px-1 items-center gap-2">
        <div className="flex items-center gap-1 truncate">
          {isActive && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shrink-0" />}
          <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${isActive ? 'text-amber-500' : 'text-slate-300'}`}>
            {name}
          </span>
        </div>
        <span className="text-[10px] font-mono shrink-0">{currentHp}/{maxHp}</span>
      </div>
      
      <div className="w-full h-1.5 bg-slate-800 rounded-full border border-slate-700/50 overflow-hidden">
        <div 
          className={`h-full ${hpColor} transition-all duration-300`} 
          style={{ width: `${hpPercent}%` }}
        />
      </div>

      {showEnergy && (
        <div className="w-full h-1 bg-slate-900 rounded-full border border-slate-800/50 overflow-hidden mt-0.5">
          <div 
            className={`h-full bg-cyan-400 transition-all duration-300`} 
            style={{ width: `${energyPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
