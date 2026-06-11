import { T, E, D, S, M, m, B, W, b } from '../spriteSystem';

// ROGUE — Deep hood/cowl, slim body, twin daggers at sides, cloak at bottom
// Distinctive silhouette: rounded hood + narrow body + visible daggers at hips
export const rogueSpriteData: number[][] = [
  [T, T, T, T, T, D, D, D, D, D, T, T, T, T, T, T], // hood shadow
  [T, T, T, T, D, E, E, E, E, E, D, T, T, T, T, T], // hood outer
  [T, T, T, T, D, E, S, S, S, E, D, T, T, T, T, T], // face inside hood
  [T, T, T, T, D, E, S, B, S, E, D, T, T, T, T, T], // one eye
  [T, T, T, T, D, E, D, D, D, E, D, T, T, T, T, T], // lower face wrap
  [T, T, T, T, T, E, E, E, E, E, T, T, T, T, T, T], // neck/collar
  [T, T, T, T, E, E, E, E, E, E, E, T, T, T, T, T], // shoulders (narrow vs warrior)
  [T, T, b, T, E, E, E, E, E, E, E, T, b, T, T, T], // daggers (b) + body
  [T, T, b, T, E, E, E, E, E, E, E, T, b, T, T, T], // daggers + body
  [T, T, T, T, E, E, E, E, E, E, E, T, T, T, T, T],
  [T, T, T, T, D, E, E, E, E, E, D, T, T, T, T, T], // cloak/legs
  [T, T, T, T, D, T, E, E, E, T, D, T, T, T, T, T],
  [T, T, T, T, T, T, E, E, E, T, T, T, T, T, T, T],
  [T, T, T, T, T, E, D, T, D, E, T, T, T, T, T, T], // boots peeking
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
];
