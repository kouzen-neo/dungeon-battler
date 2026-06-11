"use client";

import React, { useEffect, useRef } from 'react';
import { resolveSprite, ElementType } from '@/lib/assets/spriteSystem';
import { warriorSpriteData } from '@/lib/assets/characters/warrior';
import { mageSpriteData } from '@/lib/assets/characters/mage';
import { rogueSpriteData } from '@/lib/assets/characters/rogue';
import { paladinSpriteData } from '@/lib/assets/characters/paladin';
import { assassinSpriteData } from '@/lib/assets/characters/assassin';

const spriteDataMap: Record<string, number[][]> = {
  warrior: warriorSpriteData,
  mage:    mageSpriteData,
  rogue:   rogueSpriteData,
  paladin: paladinSpriteData,
  assassin: assassinSpriteData,
};

interface PixelSpriteProps {
  spriteId: string;
  element?: ElementType;
  size?: number;
  cropToHead?: boolean;
}

export default function PixelSprite({
  spriteId,
  element = 'NONE',
  size = 32,
  cropToHead = false,
}: PixelSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rawData = spriteDataMap[spriteId?.toLowerCase()] ?? warriorSpriteData;
  // Resolve RGBA pixel array with element colors applied
  const sprite = resolveSprite(rawData, element);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // Crop window: head = rows 0-7, cols 4-11 (8×8 region)
    const r0 = cropToHead ? 0 : 0;
    const r1 = cropToHead ? 8 : 16;
    const c0 = cropToHead ? 4 : 0;
    const c1 = cropToHead ? 12 : 16;

    const numRows = r1 - r0;
    const numCols = c1 - c0;
    const pw = canvas.width  / numCols;
    const ph = canvas.height / numRows;

    for (let r = r0; r < r1; r++) {
      for (let c = c0; c < c1; c++) {
        const pixel = sprite[r]?.[c];
        if (!pixel || pixel[3] === 0) continue;
        ctx.fillStyle = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3] / 255})`;
        ctx.fillRect(
          (c - c0) * pw,
          (r - r0) * ph,
          pw + 0.5,
          ph + 0.5,
        );
      }
    }
  }, [sprite, cropToHead]);

  const canvasW = cropToHead ? 32 : 64;
  const canvasH = cropToHead ? 32 : 64;
  const displayW = size;
  const displayH = cropToHead ? Math.round(size) : size;

  return (
    <canvas
      ref={canvasRef}
      width={canvasW}
      height={canvasH}
      style={{
        width:  `${displayW}px`,
        height: `${displayH}px`,
        imageRendering: 'pixelated',
      }}
      className="shrink-0"
    />
  );
}
