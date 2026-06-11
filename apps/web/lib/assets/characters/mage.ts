import { T, E, D, S, M, m, B, W, b } from '../spriteSystem';

// MAGE — Tall pointed wizard hat, narrow body, wide flaring robe, staff on left
// Distinctive silhouette: tall vertical hat + triangular robe flare = unique outline
export const mageSpriteData: number[][] = [
  [T, T, T, T, T, T, T, E, T, T, T, T, T, T, T, T], // hat tip
  [T, T, T, T, T, T, E, E, E, T, T, T, T, T, T, T], // hat
  [T, T, T, T, T, E, E, E, E, E, T, T, T, T, T, T],
  [T, T, T, T, E, E, E, E, E, E, E, T, T, T, T, T],
  [T, T, T, T, D, D, D, D, D, D, D, T, T, T, T, T], // hat brim (dark band)
  [T, T, T, T, T, S, S, S, S, S, T, T, T, T, T, T], // face
  [T, T, T, T, T, S, B, S, B, S, T, T, T, T, T, T], // eyes
  [T, T, T, T, T, S, S, S, S, S, T, T, T, T, T, T],
  [T, T, T, T, E, E, E, E, E, E, E, T, T, T, T, T], // robe top
  [T, M, T, T, E, E, E, E, E, E, E, T, T, T, T, T], // staff (M) + robe
  [T, M, T, E, E, E, E, E, E, E, E, E, T, T, T, T], // robe widens
  [T, M, T, E, E, E, E, E, E, E, E, E, T, T, T, T],
  [T, T, E, E, E, E, E, E, E, E, E, E, E, T, T, T], // robe flare
  [T, T, T, E, E, T, T, T, T, T, E, E, T, T, T, T], // feet
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
];
