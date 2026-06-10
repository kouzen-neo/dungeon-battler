"use client";

import React from 'react';
import StatusIndicator from './StatusIndicator';

interface BattleUnit {
  id: string;
  name: string;
  currentHp: number;
  stats: { hp: number };
}

interface EnemyStatusProps {
  enemies: BattleUnit[];
  activeUnitId?: string | null;
}

export default function EnemyStatus({ enemies, activeUnitId }: EnemyStatusProps) {
  return (
    <div className="flex flex-col gap-2 p-2.5 bg-red-950/20 rounded-xl border border-red-900/30 shadow-lg">
      <h3 className="text-[10px] text-red-500/50 font-bold mb-1 text-right px-1">ENEMIES</h3>
      {enemies.map((unit) => (
        <StatusIndicator 
          key={unit.id} 
          name={unit.name} 
          currentHp={unit.currentHp} 
          maxHp={unit.stats.hp} 
          isEnemy 
          isActive={unit.id === activeUnitId}
        />
      ))}
    </div>
  );
}
