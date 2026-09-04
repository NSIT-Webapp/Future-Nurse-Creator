import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  symbol: 'star' | 'circle' | 'sparkle';
}

const COLORS = [
  '#FBBF24', // Amber gold
  '#FF4E72', // Mahidol open house pink
  '#38BDF8', // Sky cyan
  '#F472B6', // Soft pink
  '#FFFFFF', // Bright white
];

/**
 * TouchSparkles — High-performance Interactive Touch Particle Overlay
 * - Zero CPU when inactive (RAF loop pauses automatically when 0 particles)
 * - Fires on pointer down & pointer move (swipes/touches on iPad)
 * - Beautiful delicate sparkles in theme colors
 */
export const TouchSparkles: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isRunningRef = useRef<boolean>(false);
  const lastSpawnRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI (Retina) displays
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticles = (clientX: number, clientY: number, count: number = 3) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.8;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const symbols: Array<'star' | 'circle' | 'sparkle'> = ['star', 'sparkle', 'circle'];

        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8, // subtle upward drift
          size: 7 + Math.random() * 8,
          color,
          alpha: 0.95,
          decay: 0.024 + Math.random() * 0.016, // fades in ~0.5s
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.15,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
        });
      }

      if (!isRunningRef.current) {
        isRunningRef.current = true;
        requestAnimationFrame(render);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      lastSpawnRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      spawnParticles(e.clientX, e.clientY, 4);
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Throttle pointer move to avoid over-spawning (at least 28ms and 12px distance)
      const now = Date.now();
      const dx = e.clientX - lastSpawnRef.current.x;
      const dy = e.clientY - lastSpawnRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (now - lastSpawnRef.current.time > 28 && dist > 14) {
        lastSpawnRef.current = { x: e.clientX, y: e.clientY, time: now };
        spawnParticles(e.clientX, e.clientY, 2);
      }
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // light gravity
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (p.symbol === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.28, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.symbol === 'sparkle') {
          // 4-point diamond star
          const s = p.size * 0.7;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        } else {
          // 4-point cross star (✦)
          const s = p.size * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.2, -s * 0.2);
          ctx.lineTo(s, 0);
          ctx.lineTo(s * 0.2, s * 0.2);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.2, s * 0.2);
          ctx.lineTo(-s, 0);
          ctx.lineTo(-s * 0.2, -s * 0.2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        requestAnimationFrame(render);
      } else {
        isRunningRef.current = false;
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      particlesRef.current = [];
      isRunningRef.current = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-50 w-full h-full ${className}`}
    />
  );
};
