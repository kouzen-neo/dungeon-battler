import React from 'react';
import { Coins } from 'lucide-react';

interface GoldDisplayProps {
  gold: number;
}

export default function GoldDisplay({ gold }: GoldDisplayProps) {
  return (
    <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
      <Coins size={14} className="text-yellow-500" />
      <span className="text-sm font-black text-yellow-500">{gold}G</span>
    </div>
  );
}
