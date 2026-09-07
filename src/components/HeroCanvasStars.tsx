import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  color: 'purple' | 'cyan' | 'gold' | 'white' | 'fuchsia' | 'emerald';
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  hasSpike?: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  color: string;
}

export const HeroCanvasStars: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Pre-rendered offscreen sprite for zero GC overhead during animation
    const spriteSize = 36;
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
      grad.addColorStop(0.22, innerColor);
      grad.addColorStop(0.65, outerColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      octx.fillStyle = grad;
      octx.fillRect(0, 0, spriteSize, spriteSize);
      return offCanvas;
    };

    offscreenSprites['purple'] = createGlowSprite('rgba(192, 132, 252, 0.95)', 'rgba(147, 51, 234, 0.35)');
    offscreenSprites['cyan'] = createGlowSprite('rgba(103, 232, 249, 0.95)', 'rgba(6, 182, 212, 0.35)');
    offscreenSprites['gold'] = createGlowSprite('rgba(253, 224, 71, 0.95)', 'rgba(234, 179, 8, 0.35)');
    offscreenSprites['fuchsia'] = createGlowSprite('rgba(244, 114, 182, 0.95)', 'rgba(217, 70, 239, 0.35)');
    offscreenSprites['emerald'] = createGlowSprite('rgba(110, 231, 183, 0.95)', 'rgba(16, 185, 129, 0.35)');
    offscreenSprites['white'] = createGlowSprite('rgba(255, 255, 255, 0.98)', 'rgba(168, 85, 247, 0.3)');

    // Star collection (Rich deep space star count)
    const STAR_COUNT = 150;
    const stars: Star[] = [];
    const colors: ('purple' | 'cyan' | 'gold' | 'white' | 'fuchsia' | 'emerald')[] = [
      'purple',
      'cyan',
      'gold',
      'fuchsia',
      'white',
      'cyan',
      'purple',
      'emerald',
    ];

    const initStars = (w: number, h: number) => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        // 3 tiers: micro dust, standard twinkling star, bright beacon star with diffraction spike
        const isMicro = i < 60;
        const isBeacon = i > 135;
        const baseRadius = isMicro
          ? 0.5 + Math.random() * 0.7
          : isBeacon
          ? 2.2 + Math.random() * 1.2
          : 1.0 + Math.random() * 1.5;

        const color = colors[Math.floor(Math.random() * colors.length)];
        const baseAlpha = isMicro
          ? 0.25 + Math.random() * 0.35
          : isBeacon
          ? 0.65 + Math.random() * 0.35
          : 0.45 + Math.random() * 0.45;

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseRadius,
          radius: baseRadius,
          color,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.015 + Math.random() * 0.035,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          hasSpike: isBeacon,
        });
      }
    };

    // Pool of shooting stars / comets
    const shootingStars: ShootingStar[] = [
      { x: 0, y: 0, length: 0, speed: 0, angle: Math.PI / 4, opacity: 0, active: false, color: '#c084fc' },
      { x: 0, y: 0, length: 0, speed: 0, angle: Math.PI / 4, opacity: 0, active: false, color: '#38bdf8' },
      { x: 0, y: 0, length: 0, speed: 0, angle: Math.PI / 4, opacity: 0, active: false, color: '#fde047' },
    ];

    let nextShootTime = Date.now() + 800;

    const spawnShootingStar = () => {
      const inactive = shootingStars.find((s) => !s.active);
      if (!inactive) return;

      inactive.x = Math.random() * (width * 0.9);
      inactive.y = Math.random() * (height * 0.4);
      inactive.length = 85 + Math.random() * 110;
      inactive.speed = 14 + Math.random() * 9;
      inactive.angle = Math.PI / 5 + (Math.random() - 0.5) * 0.2;
      inactive.opacity = 1;
      inactive.active = true;
      const cometColors = ['#c084fc', '#38bdf8', '#fde047', '#f472b6'];
      inactive.color = cometColors[Math.floor(Math.random() * cometColors.length)];

      nextShootTime = Date.now() + 2000 + Math.random() * 3000;
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth || 1200;
      height = rect.height || 700;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (stars.length === 0) {
        initStars(width, height);
      } else {
        stars.forEach((s) => {
          if (s.x > width) s.x = Math.random() * width;
          if (s.y > height) s.y = Math.random() * height;
        });
      }
    };

    handleResize();

    let lastFrameTime = performance.now();
    let pointerX = -9999;
    let pointerY = -9999;
    let isPointerActive = false;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        pointerX = clientX - rect.left;
        pointerY = clientY - rect.top;
        isPointerActive = true;
      }
    };

    const onPointerLeave = () => {
      isPointerActive = false;
      pointerX = -9999;
      pointerY = -9999;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave, { passive: true });

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      // Delta time limiter (~60fps)
      const elapsed = now - lastFrameTime;
      if (elapsed < 14) return;
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);

      // Draw faint constellation lines between neighboring bright stars
      ctx.lineWidth = 0.6;
      for (let i = 80; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 7500) { // approx 86px
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 86) * 0.14;
            ctx.strokeStyle = `rgba(192, 132, 252, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // Render & update twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Gravitational interaction with cursor / touch
        if (isPointerActive) {
          const pdx = pointerX - s.x;
          const pdy = pointerY - s.y;
          const pdistSq = pdx * pdx + pdy * pdy;
          if (pdistSq < 22500 && pdistSq > 100) { // within 150px
            const pdist = Math.sqrt(pdistSq);
            const force = (1 - pdist / 150) * 0.45;
            s.x += (pdx / pdist) * force;
            s.y += (pdy / pdist) * force;
          }
        }

        // Soft drift
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Harmonic twinkle
        s.twinklePhase += s.twinkleSpeed;
        const sineVal = Math.sin(s.twinklePhase);
        let currentAlpha = Math.max(0.18, s.baseAlpha + sineVal * 0.38);
        let currentRadius = s.baseRadius * (1 + sineVal * 0.28);

        // Brighten up near cursor
        if (isPointerActive) {
          const cdx = pointerX - s.x;
          const cdy = pointerY - s.y;
          if (cdx * cdx + cdy * cdy < 14400) {
            currentAlpha = Math.min(1, currentAlpha + 0.35);
            currentRadius *= 1.25;
          }
        }

        // Fast GPU blit using pre-rendered sprite
        const sprite = offscreenSprites[s.color] || offscreenSprites['white'];
        ctx.globalAlpha = currentAlpha;
        const renderDiameter = currentRadius * 8.5;
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
        ctx.arc(s.x, s.y, Math.max(0.5, currentRadius * 0.65), 0, Math.PI * 2);
        ctx.fill();

        // If beacon star, draw subtle 4-point telescope diffraction spikes (JWST/Hubble style)
        if (s.hasSpike && currentAlpha > 0.45) {
          const spikeLen = currentRadius * (5 + sineVal * 1.5);
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          // Horizontal
          ctx.moveTo(s.x - spikeLen, s.y);
          ctx.lineTo(s.x + spikeLen, s.y);
          // Vertical
          ctx.moveTo(s.x, s.y - spikeLen);
          ctx.lineTo(s.x, s.y + spikeLen);
          ctx.stroke();
        }
      }

      // Shooting star trigger
      if (now > nextShootTime) {
        spawnShootingStar();
      }

      // Update active shooting stars
      for (const star of shootingStars) {
        if (!star.active) continue;

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.02;

        if (star.opacity <= 0 || star.x > width || star.y > height) {
          star.active = false;
        } else {
          ctx.save();
          ctx.globalAlpha = star.opacity;
          const tailX = star.x - Math.cos(star.angle) * star.length;
          const tailY = star.y - Math.sin(star.angle) * star.length;

          const shootGrad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
          shootGrad.addColorStop(0, 'rgba(168, 85, 247, 0)');
          shootGrad.addColorStop(0.5, star.color);
          shootGrad.addColorStop(1, '#ffffff');

          ctx.strokeStyle = shootGrad;
          ctx.lineWidth = 2.2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();

          // Shooting star head glow
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(star.x, star.y, 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
    };

    // Start render loop immediately
    animId = requestAnimationFrame(render);

    let resizeTimer: any = null;
    const onWindowResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', onWindowResize, { passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
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
