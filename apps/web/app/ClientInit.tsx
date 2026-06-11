"use client";

import { useEffect } from "react";
import { useSaveStore } from "@/lib/stores/saveStore";
import { useMissionStore } from "@/lib/stores/missionStore";
import BottomNav from "@/components/ui/BottomNav";
import SoundManager from "@/components/ui/SoundManager";

export default function ClientInit({ children }: { children: React.ReactNode }) {
  const initializeFromDB = useSaveStore((state) => state.initializeFromDB);
  const checkAndResetDaily = useMissionStore((state) => state.checkAndResetDaily);

  useEffect(() => {
    initializeFromDB();
    checkAndResetDaily();
  }, [initializeFromDB, checkAndResetDaily]);

  return (
    <div className="min-h-screen pb-20">
      <SoundManager />
      {children}
      <BottomNav />
    </div>
  );
}
