import React from 'react';

interface CrystalCubeIconProps {
  className?: string;
  size?: number;
}

export const CrystalCubeIcon: React.FC<CrystalCubeIconProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]"
      >
        <defs>
          {/* Rounded Glossy Squircle Background */}
          <radialGradient id="cubeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0.4" />
          </radialGradient>

          <linearGradient id="neonBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="30%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <linearGradient id="facetTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="facetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="facetRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.6" />
          </linearGradient>

          <filter id="starBloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Squircle Dark Glass Backing */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="#0a0518"
          stroke="url(#neonBorder)"
          strokeWidth="2.5"
        />

        {/* Ambient Inner Particle Dots */}
        <circle cx="28" cy="24" r="1.5" fill="#e879f9" opacity="0.8" />
        <circle cx="76" cy="28" r="1" fill="#38bdf8" opacity="0.7" />
        <circle cx="24" cy="74" r="1" fill="#c084fc" opacity="0.6" />
        <circle cx="74" cy="78" r="1.5" fill="#f43f5e" opacity="0.7" />

        {/* Orbital Neon Ring Ellipse (Tilted) */}
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="14"
          transform="rotate(-26 50 50)"
          stroke="url(#neonBorder)"
          strokeWidth="1.8"
          strokeDasharray="90 8"
          opacity="0.85"
        />

        {/* Orbiting Glowing Spheres */}
        <circle cx="22" cy="62" r="4" fill="#d946ef" className="drop-shadow-[0_0_6px_#e879f9]" />
        <circle cx="22" cy="62" r="1.5" fill="#ffffff" />

        <circle cx="80" cy="38" r="3.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />
        <circle cx="80" cy="38" r="1.2" fill="#ffffff" />

        {/* 3D Isometric Glowing Crystal Cube */}
        {/* Top Facet */}
        <polygon
          points="50,22 72,35 50,48 28,35"
          fill="url(#facetTop)"
          stroke="#ffffff"
          strokeWidth="0.8"
          opacity="0.95"
        />

        {/* Left Facet */}
        <polygon
          points="28,35 50,48 50,75 28,62"
          fill="url(#facetLeft)"
          stroke="#93c5fd"
          strokeWidth="0.6"
          opacity="0.9"
        />

        {/* Right Facet */}
        <polygon
          points="50,48 72,35 72,62 50,75"
          fill="url(#facetRight)"
          stroke="#f472b6"
          strokeWidth="0.6"
          opacity="0.9"
        />

        {/* Internal Core Prismatic Diamond Lines */}
        <line x1="50" y1="22" x2="50" y2="75" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" />
        <line x1="28" y1="35" x2="72" y2="62" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
        <line x1="72" y1="35" x2="28" y2="62" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />

        {/* Radiant 4-Pointed Core Light Star (Glowing at center) */}
        <g filter="url(#starBloom)">
          {/* Main Star Core */}
          <path
            d="M50 34 Q50 48 36 48 Q50 48 50 62 Q50 48 64 48 Q50 48 50 34 Z"
            fill="#ffffff"
          />
          {/* Star Flare Glow */}
          <circle cx="50" cy="48" r="4.5" fill="#fdf4ff" opacity="0.95" />
          <circle cx="50" cy="48" r="8" fill="#e879f9" opacity="0.4" />
        </g>

        {/* Mini Accent Sparkles */}
        <path d="M28 26 L29.5 29 L32.5 30.5 L29.5 32 L28 35 L26.5 32 L23.5 30.5 L26.5 29 Z" fill="#ffffff" opacity="0.85" />
        <path d="M74 66 L75 68 L77 69 L75 70 L74 72 L73 70 L71 69 L73 68 Z" fill="#38bdf8" opacity="0.85" />
      </svg>
    </div>
  );
};
