import React, { useMemo } from 'react';

interface StarConfig {
  id: number;
  top: number; // percentage 0-100
  left: number; // percentage 0-100
  size: number; // 1 to 3.5 px
  color: string;
  glow: string;
  duration: number; // seconds
  delay: number; // seconds
  hasSpike?: boolean;
}

export const GlobalBackgroundStars: React.FC = () => {
  const stars: StarConfig[] = useMemo(() => {
    const palette = [
      { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.85)' },
      { color: '#f3e8ff', glow: 'rgba(216, 180, 254, 0.85)' },
      { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.9)' },
      { color: '#a5b4fc', glow: 'rgba(165, 180, 252, 0.85)' },
      { color: '#67e8f9', glow: 'rgba(103, 232, 249, 0.85)' },
      { color: '#f472b6', glow: 'rgba(244, 114, 182, 0.85)' },
      { color: '#fde047', glow: 'rgba(253, 224, 71, 0.8)' },
    ];

    const rawCoords = [
      { t: 3, l: 12, s: 2.2, p: 0 },
      { t: 5, l: 88, s: 1.8, p: 1 },
      { t: 7, l: 52, s: 2.5, p: 2, spike: true },
      { t: 9, l: 32, s: 1.5, p: 3 },
      { t: 11, l: 74, s: 3, p: 4, spike: true },
      { t: 14, l: 18, s: 2, p: 0 },
      { t: 16, l: 92, s: 1.6, p: 2 },
      { t: 19, l: 42, s: 2.2, p: 5 },
      { t: 21, l: 82, s: 2.5, p: 1, spike: true },
      { t: 23, l: 8, s: 1.8, p: 4 },
      { t: 26, l: 62, s: 2, p: 2 },
      { t: 28, l: 28, s: 2.8, p: 0, spike: true },
      { t: 31, l: 95, s: 1.5, p: 3 },
      { t: 33, l: 14, s: 2.2, p: 1 },
      { t: 35, l: 78, s: 2.6, p: 6, spike: true },
      { t: 38, l: 48, s: 1.8, p: 2 },
      { t: 40, l: 89, s: 2.4, p: 4 },
      { t: 43, l: 22, s: 2, p: 0 },
      { t: 45, l: 68, s: 3.2, p: 2, spike: true },
      { t: 48, l: 5, s: 2.5, p: 3 },
      { t: 50, l: 85, s: 1.8, p: 1 },
      { t: 52, l: 38, s: 2.2, p: 5 },
      { t: 55, l: 96, s: 2, p: 0 },
      { t: 57, l: 19, s: 2.6, p: 2, spike: true },
      { t: 60, l: 72, s: 1.8, p: 4 },
      { t: 62, l: 44, s: 2.4, p: 1 },
      { t: 65, l: 88, s: 3, p: 0, spike: true },
      { t: 67, l: 12, s: 1.7, p: 3 },
      { t: 70, l: 58, s: 2.2, p: 2 },
      { t: 72, l: 82, s: 2.5, p: 6, spike: true },
      { t: 75, l: 26, s: 1.9, p: 1 },
      { t: 77, l: 93, s: 2.3, p: 4 },
      { t: 80, l: 36, s: 3, p: 2, spike: true },
      { t: 82, l: 7, s: 2.1, p: 0 },
      { t: 85, l: 75, s: 1.8, p: 3 },
      { t: 87, l: 49, s: 2.4, p: 5 },
      { t: 90, l: 91, s: 2.6, p: 1, spike: true },
      { t: 92, l: 16, s: 2, p: 2 },
      { t: 94, l: 64, s: 1.7, p: 4 },
      { t: 96, l: 33, s: 2.8, p: 0, spike: true },
      { t: 98, l: 84, s: 1.9, p: 2 },
      { t: 2, l: 40, s: 1.8, p: 5 },
      { t: 12, l: 60, s: 2.2, p: 0 },
      { t: 17, l: 2, s: 2.5, p: 1, spike: true },
      { t: 25, l: 46, s: 1.6, p: 3 },
      { t: 37, l: 3, s: 2, p: 4 },
      { t: 46, l: 35, s: 2.2, p: 2 },
      { t: 54, l: 63, s: 2.8, p: 6, spike: true },
      { t: 63, l: 6, s: 1.8, p: 0 },
      { t: 71, l: 39, s: 2.4, p: 1 },
      { t: 79, l: 67, s: 2, p: 5 },
      { t: 88, l: 2, s: 2.6, p: 2, spike: true },
      { t: 95, l: 50, s: 2.1, p: 3 },
    ];

    return rawCoords.map((c, idx) => {
      const theme = palette[c.p % palette.length];
      const duration = 2.2 + ((idx * 0.33) % 2.8);
      const delay = (idx * 0.37) % 3.5;
      return {
        id: idx,
        top: c.t,
        left: c.l,
        size: c.s,
        color: theme.color,
        glow: theme.glow,
        duration,
        delay,
        hasSpike: c.spike,
      };
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none will-change-auto"
      style={{ contain: 'strict' }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 3}px ${star.glow}, 0 0 ${star.size * 7}px ${star.glow}`,
            animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            transform: 'translateZ(0)',
          }}
        >
          {star.hasSpike && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
              style={{
                width: `${star.size * 6}px`,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${star.color}, transparent)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
