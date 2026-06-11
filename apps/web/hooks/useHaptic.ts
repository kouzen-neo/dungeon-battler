"use client";

export const useHaptic = () => {
  const vibrate = (pattern: number | number[] = 10) => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  };

  return { vibrate };
};
