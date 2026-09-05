import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  color: 'purple' | 'cyan' | 'gold' | 'white';
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export const HeroCanvasStars: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap DPR to prevent mobile fill-rate lag

    // Pre-rendered offscreen sprite for zero GC overhead during animation
    const spriteSize = 32;
    const offscreenSprites: Record<string, HTMLCanvasElement> = {};

    const createGlowSprite = (innerColor: string, outerColor: string) => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = spriteSize;
      offCanvas.height = spriteSize;
      const octx = offCanvas.getContext('2d');
      if (!octx) return offCanvas;

      const half = spriteSize / 2;
      const grad = octx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, innerColor);
      grad.addColorStop(0.65, outerColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      octx.fillStyle = grad;
      octx.fillRect(0, 0, spriteSize, spriteSize);
      return offCanvas;
    };

    offscreenSprites['purple'] = createGlowSprite('rgba(192, 132, 252, 0.85)', 'rgba(147, 51, 234, 0.25)');
    offscreenSprites['cyan'] = createGlowSprite('rgba(103, 232, 249, 0.85)', 'rgba(6, 182, 212, 0.25)');
    offscreenSprites['gold'] = createGlowSprite('rgba(253, 224, 71, 0.85)', 'rgba(234, 179, 8, 0.25)');
    offscreenSprites['white'] = createGlowSprite('rgba(243, 232, 255, 0.9)', 'rgba(168, 85, 247, 0.2)');

    // Star collection (controlled count: 42 stars for optimal balance of beauty and performance)
    const STAR_COUNT = 42;
    const stars: Star[] = [];

    const colors: ('purple' | 'cyan' | 'gold' | 'white')[] = ['purple', 'purple', 'cyan', 'gold', 'white'];

    const initStars = (w: number, h: number) => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        const baseRadius = 0.8 + Math.random() * 1.6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const baseAlpha = 0.35 + Math.random() * 0.55;
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseRadius,
          radius: baseRadius,
          color,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.015 + Math.random() * 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
        });
      }
    };

    // Single shooting star pool
    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: Math.PI / 4,
      opacity: 0,
      active: false,
    };

    let nextShootTime = Date.now() + 2000;

    const spawnShootingStar = () => {
      shootingStar.x = Math.random() * (width * 0.7);
      shootingStar.y = Math.random() * (height * 0.3);
      shootingStar.length = 60 + Math.random() * 80;
      shootingStar.speed = 10 + Math.random() * 8;
      shootingStar.angle = (Math.PI / 5) + (Math.random() * 0.1);
      shootingStar.opacity = 1;
      shootingStar.active = true;
      nextShootTime = Date.now() + 4000 + Math.random() * 6000;
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      if (stars.length === 0) {
        initStars(width, height);
      } else {
        // Re-scale star positions proportionally
        stars.forEach((s) => {
          if (s.x > width) s.x = Math.random() * width;
          if (s.y > height) s.y = Math.random() * height;
        });
      }
    };

    handleResize();

    // IntersectionObserver to auto-pause when Hero is not on screen (0% GPU/CPU while scrolled down!)
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          lastFrameTime = performance.now();
          render(lastFrameTime);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Animation Loop with smooth delta-time throttling
    let lastFrameTime = performance.now();

    const render = (now: number) => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      animId = requestAnimationFrame(render);

      // Delta time check (cap at 60fps to save CPU/battery)
      const elapsed = now - lastFrameTime;
      if (elapsed < 14) return; // ~60fps limiter
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);

      // Render & update twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Soft drift
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Harmonic twinkle without random jumps
        s.twinklePhase += s.twinkleSpeed;
        const sineVal = Math.sin(s.twinklePhase);
        const currentAlpha = Math.max(0.15, s.baseAlpha + sineVal * 0.35);
        const currentRadius = s.baseRadius * (1 + sineVal * 0.2);

        // Fast GPU blit using pre-rendered sprite
        const sprite = offscreenSprites[s.color] || offscreenSprites['white'];
        ctx.globalAlpha = currentAlpha;
        const renderDiameter = currentRadius * 8;
        ctx.drawImage(
          sprite,
          s.x - renderDiameter / 2,
          s.y - renderDiameter / 2,
          renderDiameter,
          renderDiameter
        );

        // Sharp star core center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, currentRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting star logic
      if (!shootingStar.active && now > nextShootTime) {
        spawnShootingStar();
      }

      if (shootingStar.active) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.02;

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        } else {
          ctx.save();
          ctx.globalAlpha = shootingStar.opacity;
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const shootGrad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          shootGrad.addColorStop(0, 'rgba(168, 85, 247, 0)');
          shootGrad.addColorStop(0.6, 'rgba(192, 132, 252, 0.4)');
          shootGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

          ctx.strokeStyle = shootGrad;
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();

          // Shooting star head glow
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(shootingStar.x, shootingStar.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
    };

    animId = requestAnimationFrame(render);

    let resizeTimer: any = null;
    const onWindowResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', onWindowResize, { passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onWindowResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas-stars"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 select-none"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-hidden="true"
    />
  );
};
