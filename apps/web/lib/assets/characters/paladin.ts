import { T, E, D, S, M, m, B, W, b } from '../spriteSystem';

// PALADIN — Rounded dome helm, enormous pauldrons (widest class), tower shield left
// Distinctive silhouette: round helm + extreme width + square shield = unmistakable
export const paladinSpriteData: number[][] = [
  [T, T, T, T, T, E, E, E, E, T, T, T, T, T, T, T], // dome helm top
  [T, T, T, T, E, E, E, E, E, E, T, T, T, T, T, T], // dome (rounded, no flat top like warrior)
  [T, T, T, m, E, E, E, E, E, E, m, T, T, T, T, T], // helm + ear guards
  [T, T, T, m, E, B, B, B, E, E, m, T, T, T, T, T], // visor (full face, not slit)
  [T, T, T, m, E, E, E, E, E, E, m, T, T, T, T, T], // chin
  [T, T, m, m, m, E, E, E, m, m, m, m, T, T, T, T], // massive pauldrons
  [T, m, m, m, m, E, E, E, m, m, m, m, m, T, T, T], // even wider!
  [T, W, m, m, T, E, E, E, T, m, m, T, T, T, T, T], // tower shield (W) visible
  [T, W, W, T, T, E, E, E, T, T, m, T, T, T, T, T], // big shield + body
  [T, W, W, T, T, E, E, E, T, T, m, T, T, T, T, T],
  [T, W, T, T, T, m, m, m, T, T, T, T, T, T, T, T], // shield + thick legs
  [T, T, T, T, T, m, T, m, T, T, T, T, T, T, T, T], // wide stance legs
  [T, T, T, T, T, m, T, m, T, T, T, T, T, T, T, T],
  [T, T, T, T, m, m, m, m, m, T, T, T, T, T, T, T], // wide boots
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
];
