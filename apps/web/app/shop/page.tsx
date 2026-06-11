"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useStoryStore } from '@/lib/game/storyProgress';
import { useShopStore } from '@/lib/stores/shopStore';
import { 
  ChevronLeft, Coins, ShoppingBag, Gem, Zap, 
  FlaskConical, Package, CreditCard, Sparkles 
} from 'lucide-react';

type ShopTab = 'ITEMS' | 'GEMS';

const BATTLE_SUPPLIES = [
  { id: 'pot_small', name: 'Small Potion', description: 'Recover 20 HP during battle.', price: 50, icon: <FlaskConical className="text-green-500" /> },
  { id: 'bomb', name: 'Explosive Bomb', description: 'Deals 30 direct damage to target.', price: 100, icon: <Package className="text-orange-500" /> },
  { id: 'ether', name: 'Elixir', description: 'Advanced recovery item.', price: 200, icon: <Zap className="text-blue-500" /> },
];

const GEM_PACKS = [
  { id: 'gem_100', name: 'Starter Pack', amount: 100, price: '$0.99', icon: <Gem className="text-cyan-400" /> },
  { id: 'gem_500', name: 'Value Pack', amount: 600, price: '$4.99', icon: <div className="flex -space-x-2"><Gem className="text-cyan-400" /><Gem className="text-cyan-400" /></div> },
  { id: 'gem_1200', name: 'Vault of Gems', amount: 1500, price: '$9.99', icon: <Sparkles className="text-amber-400" /> },
];

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<ShopTab>('ITEMS');
  const gold = useStoryStore((state) => state.gold);
  const gems = useStoryStore((state) => state.gems);
  const addGold = useStoryStore((state) => state.addGold);
  const addGems = useStoryStore((state) => state.addGems);
  const { buyItem, inventory } = useShopStore();

  const handleBuyItem = async (id: string, price: number, name: string) => {
    if (gold < price) {
      alert("Not enough gold!");
      return;
    }
    const success = await buyItem(id, price);
    if (success) {
      alert(`Purchased ${name}!`);
    }
  };

  const handleTopUp = (amount: number, price: string) => {
    if (confirm(`Simulate purchase of ${amount} Gems for ${price}?`)) {
      addGems(amount);
      alert(`Added ${amount} Gems to your account!`);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-red-500" size={24} />
          <h1 className="text-xl font-black tracking-widest text-red-500 uppercase">BLACK MARKET</h1>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1 bg-slate-900 px-3 py-0.5 rounded-full border border-slate-800">
             <span className="text-sm font-black text-yellow-500 tabular-nums">{gold.toLocaleString()}</span>
             <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          </div>
          <div className="flex items-center gap-1 bg-slate-900 px-3 py-0.5 rounded-full border border-slate-800">
             <span className="text-sm font-black text-cyan-400 tabular-nums">{gems.toLocaleString()}</span>
             <Gem size={12} className="text-cyan-400" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('ITEMS')}
          className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${activeTab === 'ITEMS' ? 'bg-red-600 border-red-500 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
        >
          Supplies
        </button>
        <button 
          onClick={() => setActiveTab('GEMS')}
          className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${activeTab === 'GEMS' ? 'bg-cyan-600 border-cyan-500 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
        >
          Gems
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-24">
        {activeTab === 'ITEMS' ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {BATTLE_SUPPLIES.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center justify-between group hover:border-slate-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 text-2xl shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight">{item.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold">{item.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-tighter">Owned: {inventory[item.id] || 0}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleBuyItem(item.id, item.price, item.name)}
                  className="bg-slate-950 hover:bg-red-600 border border-slate-800 hover:border-red-500 px-4 py-2 rounded-xl transition-all active:scale-95 group-hover:shadow-lg"
                >
                  <span className="text-xs font-black text-yellow-500 group-hover:text-white leading-none">{item.price}G</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-cyan-900/10 border border-cyan-900/30 p-4 rounded-2xl mb-4 text-center">
               <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.2em]">Premium Currency Store</p>
            </div>
            {GEM_PACKS.map(pack => (
              <div key={pack.id} className="bg-slate-900 border border-slate-800 p-5 rounded-[32px] flex items-center justify-between hover:border-cyan-900/50 transition-all group shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-950 rounded-[20px] flex items-center justify-center border border-slate-800 text-2xl shadow-inner">
                    {pack.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight">{pack.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <Gem size={14} className="text-cyan-400" />
                       <span className="text-lg font-black text-cyan-400 leading-none">{pack.amount}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleTopUp(pack.amount, pack.price)}
                  className="bg-cyan-600 hover:bg-cyan-500 px-5 py-3 rounded-2xl font-black text-xs shadow-lg shadow-cyan-900/20 active:translate-y-1 transition-all"
                >
                  {pack.price}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
