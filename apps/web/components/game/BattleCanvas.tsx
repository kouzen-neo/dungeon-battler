"use client";

import React, { useEffect, useRef } from 'react';
import { palette } from '@/lib/assets/palette';

interface BattleCanvasProps {
  partySprites: number[][][][];
  enemySprites: number[][][][];
  attackingId: string | null;
  targetId: string | null;
  damagePopups: Array<{ id: number, value: number, x: number, y: number }>;
  activeUnitId?: string | null;
  partyIds: string[];
  enemyIds: string[];
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
  damagePopups,
  activeUnitId,
  partyIds,
  enemyIds
}: BattleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const particlesRef = useRef<Array<{ x: number, y: number, vx: number, vy: number, life: number, color: string }>>([]);
  const prevPopupsLength = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    
    const render = () => {
      frameRef.current++;
      const frame = frameRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background (Dark gradient + parallax stars/dust)
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0f172a'); // slate-900
      grad.addColorStop(1, '#312e81'); // indigo-900
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor grid / perspective lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let i = 0; i < 5; i++) {
        ctx.moveTo(0, canvas.height/2 + i * 40);
        ctx.lineTo(canvas.width, canvas.height/2 + i * 40 + (Math.sin(frame*0.01)*10));
      }
      ctx.stroke();

      // Floating dust particles in background
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      for(let i=0; i<15; i++) {
        const px = (i * 30 + frame * 0.5) % canvas.width;
        const py = (canvas.height - (i * 20)) + Math.sin(frame * 0.05 + i) * 10;
        ctx.fillRect(px, py % canvas.height, 2, 2);
      }

      // Helper to draw shadow
      const drawShadow = (x: number, y: number, isActive: boolean = false) => {
        if (isActive) {
          // Draw glowing active highlight
          ctx.fillStyle = `rgba(251, 191, 36, ${0.4 + Math.sin(frame * 0.1) * 0.2})`; // amber-400 pulsing
          ctx.beginPath();
          ctx.ellipse(x + (SPRITE_SIZE*PIXEL_SIZE)/2, y + (SPRITE_SIZE*PIXEL_SIZE) - 5, 30, 12, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(x + (SPRITE_SIZE*PIXEL_SIZE)/2, y + (SPRITE_SIZE*PIXEL_SIZE) - 5, 25, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      // Party Positions (Draw from back to front so they overlap correctly)
      [...partySprites].reverse().forEach((sprite, reversedI) => {
        const i = partySprites.length - 1 - reversedI;
        const id = partyIds[i]; // Use real ID instead of hardcoded 'p1'
        let x = 60 + (i === 1 ? 20 : 0); // Stagger formation slightly
        let y = canvas.height - 120 - (i * 50);
        
        // Idle Animation (Floating)
        y += Math.sin(frame * 0.1 + i) * 3;

        // Attack Animation
        if (attackingId === id) {
          x += 40; // Jump forward
          
          // Attack blur
          ctx.globalAlpha = 0.5;
          drawSprite(ctx, sprite, x - 20, y);
          ctx.globalAlpha = 1.0;
        }
        
        // Hit Animation (Shake)
        if (targetId === id) {
          x += Math.sin(frame * 0.8) * 8;
          ctx.filter = 'brightness(200%) sepia(100%) hue-rotate(-50deg) saturate(500%)';
        }

        drawShadow(x, y, id === activeUnitId);
        drawSprite(ctx, sprite, x, y);
        ctx.filter = 'none'; // Reset filter
      });

      // Enemy Positions
      enemySprites.forEach((sprite, i) => {
        const id = enemyIds[i]; // Use real ID instead of hardcoded 'e1'
        let x = canvas.width - 120 - (i === 1 ? 20 : 0);
        let y = 60 + (i * 60);

        y += Math.sin(frame * 0.08 + i) * 4;

        if (attackingId === id) {
          x -= 40;
          ctx.globalAlpha = 0.5;
          drawSprite(ctx, sprite, x + 20, y, PIXEL_SIZE, true);
          ctx.globalAlpha = 1.0;
        }

        if (targetId === id) {
          x += Math.sin(frame * 0.8) * 8;
          ctx.filter = 'brightness(200%) sepia(100%) hue-rotate(-50deg) saturate(500%)';
        }

        drawShadow(x, y, id === activeUnitId);
        drawSprite(ctx, ctx.filter !== 'none' ? sprite : sprite, x, y, PIXEL_SIZE, true); // Keep original sprite reference but filter handles the color
        ctx.filter = 'none';
      });

      // Spawn new particles on damage popup
      if (damagePopups.length > prevPopupsLength.current) {
        const newPopups = damagePopups.slice(prevPopupsLength.current);
        newPopups.forEach(popup => {
          // Spawn 10 particles per hit
          for(let i=0; i<10; i++) {
            particlesRef.current.push({
              x: popup.x + 30, // center roughly
              y: popup.y + 40,
              vx: (Math.random() - 0.5) * 15,
              vy: (Math.random() - 0.5) * 15 - 5,
              life: 1.0,
              color: popup.value < 0 ? '#22c55e' : '#ef4444' // Green for heal, red for damage
            });
          }
        });
      }
      prevPopupsLength.current = damagePopups.length;

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.life -= 0.03;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        const size = Math.max(1, p.life * 6);
        ctx.fillRect(p.x, p.y, size, size);
      }
      ctx.globalAlpha = 1.0;

      // Damage Popups
      ctx.font = '900 24px "Inter", "Courier New", monospace';
      ctx.textAlign = 'center';
      damagePopups.forEach(popup => {
        const isHeal = popup.value < 0;
        const displayVal = isHeal ? `+${Math.abs(popup.value)}` : `-${popup.value}`;
        
        ctx.fillStyle = isHeal ? '#4ade80' : '#fca5a5';
        ctx.strokeStyle = isHeal ? '#14532d' : '#7f1d1d';
        ctx.lineWidth = 4;
        
        // Float upwards with ease out
        const age = (Date.now() - popup.id) / 1000; // rough age in seconds if popup.id is Date.now()
        // Wait, popup.id is Date.now(), we can use it to animate smoothly instead of frame
        const timeAlive = Math.max(0, Math.min(1, age * 2)); 
        const floatY = popup.y - (timeAlive * 50);
        
        ctx.globalAlpha = 1 - Math.pow(timeAlive, 3); // Fade out at the end
        
        // Add a little pop scaling effect
        const scale = timeAlive < 0.2 ? 1 + (0.2 - timeAlive) * 2 : 1;
        ctx.save();
        ctx.translate(popup.x + 30, floatY);
        ctx.scale(scale, scale);
        
        ctx.strokeText(displayVal, 0, 0);
        ctx.fillText(displayVal, 0, 0);
        ctx.restore();
      });
      ctx.globalAlpha = 1.0;
      ctx.textAlign = 'left';

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [partySprites, enemySprites, attackingId, targetId, damagePopups, activeUnitId]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className="w-full aspect-[4/3] rounded-3xl border-4 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black"
    />
  );
}
