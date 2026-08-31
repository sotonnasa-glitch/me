import React, { useState } from 'react';
import { X, ArrowRight, CornerUpRight } from 'lucide-react';

interface AICloseButtonProps {
  onClick: (e?: React.MouseEvent) => void;
  title?: string;
  ariaLabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  variant?: 'cyber' | 'neon' | 'glass' | 'minimal';
  showLabel?: boolean;
  labelText?: string;
}

export const AICloseButton: React.FC<AICloseButtonProps> = ({
  onClick,
  title = 'بازگشت به صفحه قبل',
  ariaLabel = 'بازگشت به صفحه قبل',
  className = '',
  size = 'md',
  id,
  variant = 'cyber',
  showLabel = false,
  labelText = 'بازگشت',
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'h-8 px-2.5 rounded-xl text-xs gap-1.5',
    md: 'h-10 sm:h-11 px-3 sm:px-3.5 rounded-2xl text-xs sm:text-sm gap-2',
    lg: 'h-12 px-4 rounded-2xl text-sm gap-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 400);
    onClick(e);
  };

  return (
    <button
      type="button"
      id={id}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
      title={title}
      className={`relative group inline-flex items-center justify-center cursor-pointer select-none overflow-hidden transition-all duration-300 ${
        showLabel ? sizeClasses[size] : size === 'sm' ? 'w-8 h-8 rounded-xl' : size === 'lg' ? 'w-12 h-12 rounded-2xl' : 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl'
      } ${
        variant === 'cyber'
          ? 'bg-[#120a2e]/95 hover:bg-[#1e104a] text-purple-200 hover:text-white border border-purple-500/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]'
          : variant === 'neon'
          ? 'bg-purple-950/90 hover:bg-purple-900 text-white border border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
          : variant === 'glass'
          ? 'bg-white/[0.08] hover:bg-white/[0.18] text-gray-200 hover:text-white border border-white/15 backdrop-blur-xl shadow-lg'
          : 'bg-zinc-900/90 hover:bg-zinc-800 text-gray-300 hover:text-white border border-zinc-700/80'
      } active:scale-95 active:translate-x-1 hover:-translate-x-0.5 ${className}`}
    >
      {/* Horizontal Return Light Stream (flows from left to right in RTL indicating going back) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

      {/* Cybernetic Return Back-Step Indicator Accent */}
      <div className="absolute top-0 end-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ripple Wave on Click */}
      {isClicked && (
        <span className="absolute inset-0 rounded-2xl bg-cyan-400/25 animate-ping pointer-events-none" />
      )}

      {/* Interactive Back-Motion Icon Container */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 transition-all duration-300">
        {/* Animated Directional Arrow / Exit Icon */}
        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
          {/* Default X icon that slides out smoothly on hover */}
          <X
            className={`${iconSizes[size]} text-purple-300 group-hover:text-cyan-300 transition-all duration-300 absolute ${
              isHovered
                ? 'opacity-0 -translate-x-4 rotate-45 scale-75'
                : 'opacity-100 translate-x-0 rotate-0 scale-100'
            }`}
          />

          {/* Morphing Return Arrow (ArrowRight for RTL = Go Back) that slides in smoothly */}
          <ArrowRight
            className={`${iconSizes[size]} text-cyan-300 transition-all duration-300 absolute ${
              isHovered
                ? 'opacity-100 translate-x-0 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse'
                : 'opacity-0 translate-x-4 scale-75'
            }`}
          />
        </div>

        {/* Optional "بازگشت" Label */}
        {showLabel && (
          <span className="font-bold font-sans text-xs tracking-tight transition-colors group-hover:text-cyan-200">
            {labelText}
          </span>
        )}
      </div>

      {/* Subtle Micro Return Particle */}
      <span className="absolute bottom-1.5 start-2 w-1 h-1 rounded-full bg-cyan-400/60 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
    </button>
  );
};
