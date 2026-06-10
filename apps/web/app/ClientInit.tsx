"use client";

import { useEffect } from "react";
import { useSaveStore } from "@/lib/stores/saveStore";
import BottomNav from "@/components/ui/BottomNav";

export default function ClientInit({ children }: { children: React.ReactNode }) {
  const initializeFromDB = useSaveStore((state) => state.initializeFromDB);

  useEffect(() => {
    initializeFromDB();
  }, [initializeFromDB]);

  return (
    <div className="min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
