"use client";

import React from 'react';
import { useShopStore, type ShopItem } from '@/lib/stores/shopStore';
import { Coins, ShoppingCart } from 'lucide-react';

export default function ShopItemCard({ item }: { item: ShopItem }) {
  const buyItem = useShopStore((state) => state.buyItem);
  const inventoryCount = useShopStore((state) => state.inventory[item.id] || 0);

  const handleBuy = async () => {
    const success = await buyItem(item);
    if (!success) {
      alert("Not enough gold!");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-2xl">
          {item.icon}
        </div>
        <div>
          <h3 className="font-bold text-white">{item.name}</h3>
          <p className="text-xs text-slate-500">{item.description}</p>
          <div className="mt-1 flex items-center gap-1">
            <Coins size={12} className="text-yellow-500" />
            <span className="text-sm font-black text-yellow-500">{item.price}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-0.5 rounded">
          OWNED: {inventoryCount}
        </span>
        <button
          onClick={handleBuy}
          className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl active:scale-90 transition-all shadow-[0_4px_0_rgb(153,27,27)]"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
}
