"use client";

import React from 'react';
import { Sword, Shield, FlaskConical, Repeat, Axe, Flame, Crosshair, Sun, Ghost, Zap } from 'lucide-react';

interface ActionButtonsProps {
  onAttack: () => void;
  onSkill: () => void;
  onItem: () => void;
  onSwap: () => void;
  disabled?: boolean;
  skillName?: string;
  skillCooldown?: number;
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
  onItem,
  onSwap,
  disabled,
  skillName,
  skillCooldown = 0
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto p-4">
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
  );
}
