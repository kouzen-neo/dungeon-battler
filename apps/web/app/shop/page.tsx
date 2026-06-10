"use client";

import React from 'react';
import Link from 'next/link';
import { useStoryStore } from '@/lib/game/storyProgress';
import ShopItemCard from '@/components/shop/ShopItem';
import { ChevronLeft, Coins, ShoppingBag } from 'lucide-react';

const SHOP_ITEMS = [
  { id: 'pot_small', name: 'Small Potion', description: 'Heal 20 HP', price: 50, icon: '🧪' },
  { id: 'bomb', name: 'Bomb', description: '30 DMG to 1 enemy', price: 100, icon: '💣' },
  { id: 'ether', name: 'Ether', description: 'Restore 10 Mana', price: 75, icon: '✨' },
];

export default function ShopPage() {
  const gold = useStoryStore((state) => state.gold);

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <header className="flex items-center justify-between py-6">
        <Link href="/story" className="p-2 hover:bg-slate-900 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-black tracking-widest text-red-500 flex items-center gap-2">
          <ShoppingBag size={20} />
          SHOP
        </h1>
        <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <Coins size={14} className="text-yellow-500" />
          <span className="text-sm font-bold text-yellow-500">{gold}</span>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto pb-20">
        <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-2xl mb-2">
          <p className="text-xs text-red-500 font-bold uppercase tracking-widest text-center">
            Limited Stock Available
          </p>
        </div>

        {SHOP_ITEMS.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>

      <footer className="py-4 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
          Purchases are auto-saved to your local device
        </p>
      </footer>
    </main>
  );
}
