"use client";

import React from 'react';
import { Sword, Shield, FlaskConical, Repeat } from 'lucide-react';

interface ActionButtonsProps {
  onAttack: () => void;
  onSkill: () => void;
  onItem: () => void;
  onSwap: () => void;
  disabled?: boolean;
}

export default function ActionButtons({
  onAttack,
  onSkill,
  onItem,
  onSwap,
  disabled
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
        disabled={disabled}
        className="flex items-center justify-center gap-2 h-14 text-lg font-bold bg-blue-700 hover:bg-blue-600 active:scale-95 transition-all rounded-xl border-b-4 border-blue-900 text-white disabled:opacity-50"
      >
        <Shield size={24} />
        SKILL
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
