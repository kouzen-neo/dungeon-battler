// Color slot indices — used in sprite data arrays
export const T = 0; // Transparent
export const E = 1; // Element color (main)
export const D = 2; // Element color (dark)
export const S = 3; // Skin
export const M = 4; // Metal (grey)
export const m = 5; // Dark metal
export const B = 6; // Black / near-black
export const W = 7; // White / highlight
export const b = 8; // Brown

export type ElementType = 'FIRE' | 'WATER' | 'EARTH' | 'WIND' | 'NONE';

type RGBA = [number, number, number, number];

const BASE_COLORS: Record<number, RGBA> = {
  [T]: [0,   0,   0,   0  ],
  [S]: [255, 220, 185, 255],
  [M]: [160, 170, 180, 255],
  [m]: [70,  80,  95,  255],
  [B]: [15,  20,  30,  255],
  [W]: [240, 245, 250, 255],
  [b]: [120, 60,  15,  255],
};

export const ELEMENT_PALETTES: Record<ElementType, { main: RGBA; dark: RGBA }> = {
  FIRE:  { main: [220, 38,  60,  255], dark: [153, 27,  27,  255] },
  WATER: { main: [56,  130, 246, 255], dark: [29,  78,  216, 255] },
  EARTH: { main: [101, 163, 13,  255], dark: [63,  98,  18,  255] },
  WIND:  { main: [6,   182, 212, 255], dark: [14,  116, 144, 255] },
  NONE:  { main: [148, 163, 184, 255], dark: [71,  85,  105, 255] },
};

/**
 * Converts an indexed 16×16 sprite into an RGBA pixel array,
 * substituting element colors based on the given element type.
 */
export function resolveSprite(sprite: number[][], element: ElementType = 'NONE'): number[][][] {
  const { main, dark } = ELEMENT_PALETTES[element];
  return sprite.map(row =>
    row.map(idx => {
      if (idx === E) return [...main];
      if (idx === D) return [...dark];
      return [...(BASE_COLORS[idx] ?? [0, 0, 0, 0])];
    })
  );
}
