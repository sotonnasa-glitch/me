import React, { useMemo } from 'react';

interface StarConfig {
  id: number;
  top: number; // percentage 0-100
  left: number; // percentage 0-100
  size: number; // 1 to 3 px
  color: string;
  glow: string;
  duration: number; // seconds
  delay: number; // seconds
  hasSpike?: boolean;
}

export const GlobalBackgroundStars: React.FC = () => {
  // Pre-calculate 45 static celestial stars across the entire screen
  // Guaranteed zero re-renders, zero runtime JS execution, pure GPU composite animation
  const stars: StarConfig[] = useMemo(() => {
    const palette = [
      { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.7)' },
      { color: '#e9d5ff', glow: 'rgba(192, 132, 252, 0.75)' },
      { color: '#c084fc', glow: 'rgba(168, 85, 247, 0.8)' },
      { color: '#a5b4fc', glow: 'rgba(129, 140, 248, 0.7)' },
      { color: '#67e8f9', glow: 'rgba(34, 211, 238, 0.65)' },
      { color: '#fef08a', glow: 'rgba(250, 204, 21, 0.6)' },
    ];

    // Seeded coordinates evenly distributed to avoid cluttering the center text
    const rawCoords = [
      { t: 4, l: 12, s: 2, p: 0 },
      { t: 6, l: 88, s: 1.5, p: 1 },
      { t: 9, l: 35, s: 1.5, p: 2 },
      { t: 11, l: 72, s: 2.5, p: 0, spike: true },
      { t: 15, l: 18, s: 1.5, p: 3 },
      { t: 18, l: 82, s: 2, p: 1 },
      { t: 22, l: 94, s: 1, p: 4 },
      { t: 24, l: 6, s: 2, p: 0 },
      { t: 28, l: 26, s: 1.5, p: 2 },
      { t: 30, l: 78, s: 2.5, p: 5, spike: true },
      { t: 34, l: 14, s: 2, p: 1 },
      { t: 38, l: 89, s: 1.5, p: 0 },
      { t: 41, l: 38, s: 1, p: 3 },
      { t: 44, l: 64, s: 2, p: 2 },
      { t: 48, l: 8, s: 2.5, p: 0, spike: true },
      { t: 51, l: 92, s: 1.5, p: 4 },
      { t: 55, l: 22, s: 2, p: 1 },
      { t: 58, l: 81, s: 1.5, p: 2 },
      { t: 62, l: 45, s: 1, p: 0 },
      { t: 65, l: 68, s: 2.5, p: 3, spike: true },
      { t: 68, l: 15, s: 1.5, p: 5 },
      { t: 72, l: 86, s: 2, p: 1 },
      { t: 75, l: 30, s: 1, p: 4 },
      { t: 78, l: 74, s: 2, p: 0 },
      { t: 82, l: 9, s: 2.5, p: 2, spike: true },
      { t: 85, l: 93, s: 1.5, p: 1 },
      { t: 88, l: 25, s: 2, p: 3 },
      { t: 91, l: 62, s: 1, p: 0 },
      { t: 94, l: 84, s: 2, p: 4 },
      { t: 96, l: 40, s: 1.5, p: 5 },
      { t: 14, l: 48, s: 1, p: 0 },
      { t: 26, l: 58, s: 1.5, p: 1 },
      { t: 39, l: 19, s: 2, p: 2 },
      { t: 46, l: 82, s: 1.5, p: 3 },
      { t: 53, l: 35, s: 2, p: 0 },
      { t: 60, l: 75, s: 1.5, p: 1 },
      { t: 70, l: 52, s: 2.5, p: 2, spike: true },
      { t: 77, l: 20, s: 1, p: 4 },
      { t: 84, l: 70, s: 2, p: 0 },
      { t: 92, l: 16, s: 1.5, p: 3 },
      { t: 3, l: 55, s: 2, p: 1 },
      { t: 19, l: 3, s: 1.5, p: 0 },
      { t: 36, l: 96, s: 2, p: 2 },
      { t: 64, l: 4, s: 1.5, p: 4 },
      { t: 89, l: 48, s: 2, p: 1 },
    ];

    return rawCoords.map((c, idx) => {
      const theme = palette[c.p % palette.length];
      const duration = 2.8 + ((idx * 0.37) % 3.2); // between 2.8s and 6.0s
      const delay = (idx * 0.43) % 4.5; // staggered start
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
            boxShadow: `0 0 ${star.size * 3}px ${star.glow}, 0 0 ${star.size * 6}px ${star.glow}`,
            animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            transform: 'translateZ(0)',
          }}
        >
          {star.hasSpike && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40"
              style={{
                width: `${star.size * 5}px`,
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
