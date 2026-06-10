import { T, E, D, S, M, m, B, W, b } from '../spriteSystem';

// ASSASSIN — Narrow face wrap/scarf, sleek body offset left, long cloak trailing right
// Distinctive silhouette: narrow head + asymmetric cloak + visible blade = unique outline
export const assassinSpriteData: number[][] = [
  [T, T, T, T, T, T, B, B, B, T, T, T, T, T, T, T], // shadow hair
  [T, T, T, T, T, D, D, D, D, D, T, T, T, T, T, T], // head wrap
  [T, T, T, T, T, D, S, S, D, D, T, T, T, T, T, T], // face (partial)
  [T, T, T, T, T, D, S, B, D, D, T, T, T, T, T, T], // one eye visible
  [T, T, T, T, T, D, D, D, D, D, T, T, T, T, T, T], // face wrap
  [T, T, T, T, T, E, E, E, E, T, T, T, T, T, T, T], // narrow collar
  [T, T, T, T, E, E, E, E, E, E, T, T, T, T, T, T], // shoulders (angled)
  [T, T, T, T, E, E, E, E, E, E, D, D, T, T, T, T], // body + cloak starts
  [T, T, T, b, E, E, E, E, E, E, D, D, D, T, T, T], // blade hilt (b) + cloak
  [T, T, T, b, T, E, E, E, E, E, D, D, D, T, T, T], // blade + lower body
  [T, T, T, T, D, E, E, E, T, T, D, D, T, T, T, T], // legs + cloak
  [T, T, T, T, T, D, E, E, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, E, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, E, E, T, T, T, T, T, T, T, T], // boots
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
];
