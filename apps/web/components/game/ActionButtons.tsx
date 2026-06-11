"use client";

import React from 'react';
import { Sword, Shield, FlaskConical, Repeat, Axe, Flame, Crosshair, Sun, Ghost, Zap, Sparkles } from 'lucide-react';

interface ActionButtonsProps {
  onAttack: () => void;
  onSkill: () => void;
  onUltimate: () => void;
  onItem: () => void;
  onSwap: () => void;
  disabled?: boolean;
  skillName?: string;
  skillCooldown?: number;
  currentEnergy?: number;
  maxEnergy?: number;
}

const getSkillIcon = (name?: string) => {
  if (!name) return <Shield size={18} />;
  const n = name.toLowerCase();
  if (n.includes('cleave') || n.includes('slash') || n.includes('strike')) return <Axe size={18} />;
  if (n.includes('elemental') || n.includes('burst') || n.includes('fire')) return <Flame size={18} />;
  if (n.includes('assassinate')) return <Crosshair size={18} />;
  if (n.includes('holy') || n.includes('light') || n.includes('heal')) return <Sun size={18} />;
  if (n.includes('shadow')) return <Ghost size={18} />;
  return <Zap size={18} />;
};

export default function ActionButtons({
  onAttack,
  onSkill,
  onUltimate,
  onItem,
  onSwap,
  disabled,
  skillName,
  skillCooldown = 0,
  currentEnergy = 0,
  maxEnergy = 100
}: ActionButtonsProps) {
  const isUltimateReady = currentEnergy >= maxEnergy;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-4 gap-3">
      {/* Ultimate Button */}
      <button
        onClick={onUltimate}
        disabled={disabled || !isUltimateReady}
        className={`
          relative flex items-center justify-center gap-3 h-14 text-lg font-black transition-all rounded-xl border-b-4 overflow-hidden
          ${isUltimateReady 
            ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white border-amber-900 shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-pulse active:scale-95' 
            : 'bg-slate-800 text-slate-500 border-slate-900 grayscale opacity-50 cursor-not-allowed'}
        `}
      >
        <Sparkles size={24} className={isUltimateReady ? 'animate-spin' : ''} />
        ULTIMATE
        {isUltimateReady && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-white/10 animate-ping opacity-20" />
        )}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onAttack}
          disabled={disabled}
          className="flex items-center justify-center gap-2 h-14 text-lg font-bold bg-red-700 hover:bg-red-600 active:scale-95 transition-all rounded-xl border-b-4 border-red-900 text-white disabled:opacity-50"
        >
          <Sword size={24} />
          ATTACK
        </button>
        
        <button
          onClick={onSkill}
          disabled={disabled || skillCooldown > 0}
          className="relative flex flex-col items-center justify-center h-14 bg-blue-700 hover:bg-blue-600 active:scale-95 transition-all rounded-xl border-b-4 border-blue-900 text-white disabled:opacity-50 overflow-hidden"
        >
          <div className="flex items-center gap-1 font-bold">
            {getSkillIcon(skillName)}
            {skillName || "SKILL"}
          </div>
          {skillCooldown > 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xl font-black text-white">
              {skillCooldown}
            </div>
          )}
        </button>

        <button
          onClick={onItem}
          disabled={disabled}
          className="flex items-center justify-center gap-2 h-14 text-lg font-bold bg-green-700 hover:bg-green-600 active:scale-95 transition-all rounded-xl border-b-4 border-green-900 text-white disabled:opacity-50"
        >
          <FlaskConical size={24} />
          ITEM
        </button>

        <button
          onClick={onSwap}
          disabled={disabled}
          className="flex items-center justify-center gap-2 h-14 text-lg font-bold bg-amber-700 hover:bg-amber-600 active:scale-95 transition-all rounded-xl border-b-4 border-amber-900 text-white disabled:opacity-50"
        >
          <Repeat size={24} />
          SWAP POS
        </button>
      </div>
    </div>
  );
}
