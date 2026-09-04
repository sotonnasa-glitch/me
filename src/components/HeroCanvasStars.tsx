import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
  maxAlpha: number;
  fadeInDuration: number;
  holdDuration: number;
  fadeOutDuration: number;
  totalCycleTime: number;
  elapsedTime: number;
  hasSparkle: boolean;
}

export const HeroCanvasStars: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let isVisible = true;

    // Palette of celestial soft colors (pure white, soft violet, cyan-blue, lavender, warm gold)
    const PALETTE = [
      { fill: '255, 255, 255', glow: 'rgba(255, 255, 255, 0.5)' },
      { fill: '224, 215, 255', glow: 'rgba(192, 132, 252, 0.55)' },
      { fill: '216, 180, 254', glow: 'rgba(168, 85, 247, 0.6)' },
      { fill: '199, 210, 254', glow: 'rgba(129, 140, 248, 0.5)' },
      { fill: '254, 240, 138', glow: 'rgba(250, 204, 21, 0.4)' },
    ];

    const TOTAL_STARS = 25; // 20 to 25 stars as requested, perfectly uncluttered
    let stars: Star[] = [];

    // Helper to generate a new star position anywhere across the full screen
    const createStarPosition = (width: number, height: number): { x: number; y: number } => {
      const centerX = width / 2;
      const centerY = height < 700 ? height * 0.35 : height * 0.38;
      const deadZoneRadius = Math.min(width, height) < 640 ? 75 : 120; // avoid center text

      for (let attempt = 0; attempt < 10; attempt++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const distFromCenter = Math.hypot(x - centerX, y - centerY);
        if (distFromCenter > deadZoneRadius) {
          return { x, y };
        }
      }
      return { x: Math.random() * width, y: Math.random() * height };
    };

    const initStars = (width: number, height: number) => {
      stars = Array.from({ length: TOTAL_STARS }, () => {
        const pos = createStarPosition(width, height);
        const fadeInDuration = 1600 + Math.random() * 2000;
        const holdDuration = 1200 + Math.random() * 2400;
        const fadeOutDuration = 1800 + Math.random() * 2200;
        const totalCycleTime = fadeInDuration + holdDuration + fadeOutDuration;
        const elapsedTime = Math.random() * totalCycleTime;

        const theme = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const radius = 1.0 + Math.random() * 1.6;
        const maxAlpha = 0.6 + Math.random() * 0.4;
        const hasSparkle = Math.random() > 0.4;

        return {
          x: pos.x,
          y: pos.y,
          radius,
          color: theme.fill,
          glowColor: theme.glow,
          maxAlpha,
          fadeInDuration,
          holdDuration,
          fadeOutDuration,
          totalCycleTime,
          elapsedTime,
          hasSparkle,
        };
      });
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(width, height);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const delta = Math.min(currentTime - lastTime, 100);
      lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width || canvas.width;
      const height = rect.height || canvas.height;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.elapsedTime += delta;

        // When lifecycle finishes, smoothly respawn in a new full-screen location
        if (star.elapsedTime >= star.totalCycleTime) {
          star.elapsedTime = 0;
          const newPos = createStarPosition(width, height);
          star.x = newPos.x;
          star.y = newPos.y;
          star.radius = 1.0 + Math.random() * 1.6;
          const theme = PALETTE[Math.floor(Math.random() * PALETTE.length)];
          star.color = theme.fill;
          star.glowColor = theme.glow;
          star.fadeInDuration = 1600 + Math.random() * 2000;
          star.holdDuration = 1200 + Math.random() * 2400;
          star.fadeOutDuration = 1800 + Math.random() * 2200;
          star.totalCycleTime = star.fadeInDuration + star.holdDuration + star.fadeOutDuration;
        }

        let alpha = 0;
        if (star.elapsedTime < star.fadeInDuration) {
          // Smooth sinusoidal fade-in
          const progress = star.elapsedTime / star.fadeInDuration;
          alpha = Math.sin((progress * Math.PI) / 2) * star.maxAlpha;
        } else if (star.elapsedTime < star.fadeInDuration + star.holdDuration) {
          // Sustained peak shine with gentle shimmer
          const holdElapsed = star.elapsedTime - star.fadeInDuration;
          const shimmer = Math.sin(holdElapsed * 0.004) * 0.08;
          alpha = Math.min(star.maxAlpha + shimmer, 1);
        } else {
          // Smooth sinusoidal fade-out
          const fadeOutElapsed = star.elapsedTime - (star.fadeInDuration + star.holdDuration);
          const progress = Math.min(fadeOutElapsed / star.fadeOutDuration, 1);
          alpha = Math.cos((progress * Math.PI) / 2) * star.maxAlpha;
        }

        if (alpha <= 0.01) continue;

        const cx = star.x;
        const cy = star.y;

        // 1. Soft radial outer glow
        const glowRadius = star.radius * 4.5;
        const radialGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        radialGradient.addColorStop(0, `rgba(${star.color}, ${alpha * 0.85})`);
        radialGradient.addColorStop(0.4, `rgba(${star.color}, ${alpha * 0.35})`);
        radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Crisp bright inner core
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha * 1.25, 1)})`;
        ctx.beginPath();
        ctx.arc(cx, cy, star.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();

        // 3. Subtle 4-point diffraction spike during peak brightness
        if (star.hasSparkle && alpha > 0.45) {
          const spikeAlpha = (alpha - 0.45) * 0.75;
          const spikeLen = star.radius * 3.6;
          ctx.strokeStyle = `rgba(${star.color}, ${spikeAlpha})`;
          ctx.lineWidth = 0.75;
          
          ctx.beginPath();
          ctx.moveTo(cx - spikeLen, cy);
          ctx.lineTo(cx + spikeLen, cy);
          ctx.moveTo(cx, cy - spikeLen);
          ctx.lineTo(cx, cy + spikeLen);
          ctx.stroke();
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
