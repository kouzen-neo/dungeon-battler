"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAudioStore } from '@/lib/stores/audioStore';

export default function SoundManager() {
  const pathname = usePathname();
  const { playBGM, stopBGM } = useAudioStore();

  useEffect(() => {
    // Mapping routes to BGM files
    // In a real project, these files would exist in /public/audio/
    if (pathname === '/game') {
      playBGM('/audio/bgm-battle.mp3');
    } else {
      playBGM('/audio/bgm-menu.mp3');
    }

    return () => {
      // Optional: Logic for cleaning up if needed
    };
  }, [pathname, playBGM]);

  return null; // This component doesn't render anything
}
