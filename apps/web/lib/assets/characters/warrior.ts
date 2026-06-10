import { T, E, D, S, M, m, B, W, b } from '../spriteSystem';

// WARRIOR — Great helm with visor, broad pauldrons, greatsword on left flank
// Distinctive silhouette: wide V-shaped torso, tall rectangular helm
export const warriorSpriteData: number[][] = [
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, E, E, E, E, E, T, T, T, T, T, T],
  [T, T, T, T, E, E, E, E, E, E, E, T, T, T, T, T],
  [T, T, T, T, E, E, B, B, B, E, E, T, T, T, T, T], // visor slits
  [T, T, T, T, E, S, S, S, S, S, E, T, T, T, T, T], // chin/face
  [T, T, T, T, E, E, E, E, E, E, E, T, T, T, T, T],
  [T, T, T, m, E, E, E, E, E, E, E, m, T, T, T, T], // pauldrons
  [T, T, m, m, E, E, E, E, E, E, E, m, m, T, T, T], // wide chest
  [T, W, T, m, E, E, E, E, E, E, E, m, T, T, T, T], // sword handle (W)
  [T, W, T, m, E, E, M, M, M, E, E, m, T, T, T, T], // belt buckle (M)
  [T, M, T, T, m, E, E, E, E, E, m, T, T, T, T, T], // sword blade (M)
  [T, M, T, T, E, E, T, T, T, E, E, T, T, T, T, T], // legs
  [T, T, T, T, E, E, T, T, T, E, E, T, T, T, T, T],
  [T, T, T, T, m, m, T, T, T, m, m, T, T, T, T, T], // boots
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
];
