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
  const hpColor = hpPercent > 50 
    ? 'bg-gradient-to-r from-emerald-600 to-green-400' 
    : hpPercent > 20 
      ? 'bg-gradient-to-r from-amber-600 to-yellow-400' 
      : 'bg-gradient-to-r from-red-600 to-rose-400';

  const showEnergy = currentEnergy !== undefined && maxEnergy !== undefined;
  const energyPercent = showEnergy ? (currentEnergy! / maxEnergy!) * 100 : 0;

  return (
    <div className={`
      flex flex-col gap-1.5 w-full p-2 rounded-xl transition-all duration-500
      ${isEnemy ? 'items-end' : 'items-start'}
      ${isActive 
        ? 'bg-white/5 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] scale-[1.02] z-10' 
        : 'border border-transparent opacity-80'
      }
    `}>
      <div className="flex justify-between w-full px-1 items-center gap-2 mb-0.5">
        <div className="flex items-center gap-1.5 truncate">
          {isActive && <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping shrink-0" />}
          <span className={`text-[10px] font-black uppercase tracking-widest truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
            {name}
          </span>
        </div>
        <span className={`text-[9px] font-mono font-black tabular-nums ${isActive ? 'text-white' : 'text-slate-500'}`}>
          {currentHp}<span className="opacity-30 mx-0.5">/</span>{maxHp}
        </span>
      </div>
      
      {/* HP Bar - Thicker and Gradient */}
      <div className="w-full h-2.5 bg-slate-950 rounded-full border border-white/10 overflow-hidden shadow-inner relative">
        <div 
          className={`h-full ${hpColor} transition-all duration-700 ease-out relative z-10`} 
          style={{ width: `${hpPercent}%` }}
        >
          {/* Highlight effect on bar */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-white/20" />
        </div>
        {/* Ghost bar for damage feedback (optional, but good for UX) */}
        <div className="absolute inset-0 bg-slate-900 opacity-20" />
      </div>

      {showEnergy && (
        <div className="w-full h-1.5 bg-slate-950 rounded-full border border-white/5 overflow-hidden mt-0.5 shadow-inner">
          <div 
            className={`h-full bg-gradient-to-r from-cyan-600 to-blue-400 transition-all duration-500 ease-out`} 
            style={{ width: `${energyPercent}%` }}
          >
             <div className="w-full h-1/2 bg-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}
