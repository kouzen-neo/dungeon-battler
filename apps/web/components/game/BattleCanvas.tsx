"use client";

import React, { useEffect, useRef } from 'react';
import { palette } from '@/lib/assets/palette';

interface BattleCanvasProps {
  partySprites: number[][][][];
  enemySprites: number[][][][];
  attackingId: string | null;
  targetId: string | null;
  damagePopups: Array<{ id: number, value: number, x: number, y: number }>;
}

const PIXEL_SIZE = 4;
const SPRITE_SIZE = 16;

export const drawSprite = (
  ctx: CanvasRenderingContext2D,
  sprite: number[][][],
  x: number,
  y: number,
  scale: number = PIXEL_SIZE,
  flip: boolean = false
) => {
  sprite.forEach((row, rowIndex) => {
    row.forEach((pixel, colIndex) => {
      if (pixel[3] === 0) return; // Transparent
      ctx.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
      const drawX = flip ? x + (SPRITE_SIZE - 1 - colIndex) * scale : x + colIndex * scale;
      ctx.fillRect(drawX, y + rowIndex * scale, scale, scale);
    });
  });
};

export default function BattleCanvas({ 
  partySprites, 
  enemySprites, 
  attackingId, 
  targetId, 
  damagePopups 
}: BattleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let frame = 0;
    
    const render = () => {
      frame++;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Party Positions
      partySprites.forEach((sprite, i) => {
        const id = `p${i+1}`;
        let x = 60;
        let y = canvas.height - 100 - (i * 60);
        
        // Idle Animation (Floating)
        y += Math.sin(frame * 0.1 + i) * 3;

        // Attack Animation
        if (attackingId === id) {
          x += 40; // Jump forward
        }
        
        // Hit Animation (Shake)
        if (targetId === id) {
          x += Math.sin(frame * 0.5) * 5;
        }

        drawSprite(ctx, sprite, x, y);
      });

      // Enemy Positions
      enemySprites.forEach((sprite, i) => {
        const id = `e${i+1}`;
        let x = canvas.width - 120;
        let y = 60 + (i * 60);

        y += Math.sin(frame * 0.08 + i) * 4;

        if (attackingId === id) {
          x -= 40;
        }

        if (targetId === id) {
          x += Math.sin(frame * 0.5) * 5;
        }

        drawSprite(ctx, sprite, x, y, PIXEL_SIZE, true);
      });

      // Damage Popups
      ctx.font = 'bold 20px "Courier New", monospace';
      damagePopups.forEach(popup => {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        // Float upwards
        const floatY = popup.y - (frame % 30);
        ctx.strokeText(`-${popup.value}`, popup.x, floatY);
        ctx.fillText(`-${popup.value}`, popup.x, floatY);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [partySprites, enemySprites, attackingId, targetId, damagePopups]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className="w-full aspect-[4/3] rounded-3xl border-4 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black"
    />
  );
}
