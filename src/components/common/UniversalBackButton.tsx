import React, { useState } from 'react';
import { ArrowRight, Video, Home, Undo2 } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

interface UniversalBackButtonProps {
  onBack?: () => void;
  label?: string;
  className?: string;
  variant?: 'floating' | 'inline' | 'glass' | 'movie-link' | 'cyber';
  showHomeIcon?: boolean;
  showMovieIcon?: boolean;
  targetSection?: string;
}

export const UniversalBackButton: React.FC<UniversalBackButtonProps> = ({
  onBack,
  label,
  className = '',
  variant = 'inline',
  showHomeIcon = false,
  showMovieIcon = false,
  targetSection,
}) => {
  const { navigateToSection } = useSiteData();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 400);

    if (onBack) {
      onBack();
    } else if (targetSection) {
      navigateToSection(targetSection);
    } else if (variant === 'movie-link') {
      navigateToSection('blog');
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      navigateToSection('blog');
    }
  };

  const defaultLabel =
    label ||
    (variant === 'movie-link' || showMovieIcon
      ? '🎬 بازگشت به صفحه فیلم و ویدیوها'
      : 'بازگشت به صفحه قبل');

  if (variant === 'movie-link') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`relative group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white text-xs font-bold border border-purple-500/40 shadow-sm transition-all overflow-hidden hover:scale-105 active:scale-95 cursor-pointer ${className}`}
        title={defaultLabel}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        <Video className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
        <span>{defaultLabel}</span>
      </button>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`fixed bottom-6 end-6 z-40 px-4 py-2.5 rounded-2xl bg-[#0d0726]/95 hover:bg-[#1a0f44] text-white text-xs sm:text-sm font-bold border border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.35)] backdrop-blur-xl transition-all duration-300 flex items-center gap-2 group hover:scale-105 active:scale-95 cursor-pointer overflow-hidden ${className}`}
        title={defaultLabel}
      >
        {/* Horizontal Return Stream */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        
        {showMovieIcon ? (
          <Video className="w-4 h-4 text-purple-400 relative z-10" />
        ) : (
          <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:-translate-x-1.5 transition-transform duration-300 relative z-10" />
        )}
        <span className="relative z-10">{defaultLabel}</span>
      </button>
    );
  }

  if (variant === 'glass') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`px-3.5 py-2 rounded-xl bg-white/[0.07] hover:bg-white/[0.15] text-zinc-200 hover:text-white text-xs font-semibold border border-white/15 backdrop-blur-md transition-all flex items-center gap-2 group hover:scale-105 active:scale-95 cursor-pointer ${className}`}
        title={defaultLabel}
      >
        {showHomeIcon ? (
          <Home className="w-3.5 h-3.5 text-purple-400" />
        ) : showMovieIcon ? (
          <Video className="w-3.5 h-3.5 text-purple-400" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:-translate-x-1.5 transition-transform duration-300" />
        )}
        <span>{defaultLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0f0927]/90 hover:bg-[#190f3c] text-purple-200 hover:text-white text-xs font-bold border border-purple-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all overflow-hidden hover:scale-105 active:scale-95 cursor-pointer ${className}`}
      title={defaultLabel}
    >
      {/* Return Back Flow Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
      
      {showMovieIcon ? (
        <Video className="w-3.5 h-3.5 text-purple-400 relative z-10" />
      ) : (
        <ArrowRight className="w-3.5 h-3.5 text-cyan-300 group-hover:-translate-x-1.5 transition-transform duration-300 relative z-10" />
      )}
      <span className="relative z-10">{defaultLabel}</span>
    </button>
  );
};
