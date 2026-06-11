"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Repeat, ShoppingBag, User, Users } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';
import { useAudioStore } from '@/lib/stores/audioStore';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Story', icon: BookOpen, href: '/story' },
  { label: 'Endless', icon: Repeat, href: '/endless' },
  { label: 'Hero', icon: Users, href: '/hero' },
  { label: 'Profile', icon: User, href: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { vibrate } = useHaptic();
  const { playSFX } = useAudioStore();

  // Don't show nav on the actual game/battle screen to maximize space
  if (pathname === '/game') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-900 px-2 pb-safe z-40 max-w-md mx-auto">
      <div className="flex justify-between items-center h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.disabled ? '#' : item.href}
              onClick={() => {
                if (!item.disabled) {
                  vibrate();
                  playSFX('/audio/sfx-click.wav');
                }
              }}
              className={`
                flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all
                ${item.disabled ? 'opacity-20 cursor-not-allowed' : 'active:scale-90'}
                ${isActive ? 'text-red-500' : 'text-slate-500'}
              `}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-red-500/10' : ''}`}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
