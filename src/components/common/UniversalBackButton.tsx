import React from 'react';
import { ArrowRight, ChevronRight, Home, Video, Film } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

interface UniversalBackButtonProps {
  onBack?: () => void;
  label?: string;
  className?: string;
  variant?: 'floating' | 'inline' | 'glass' | 'movie-link';
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

  const handleClick = () => {
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
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 text-purple-200 hover:text-white text-xs font-bold border border-purple-500/40 shadow-sm transition-all group ${className}`}
        title={defaultLabel}
      >
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
        className={`fixed bottom-6 end-6 z-40 px-4 py-2.5 rounded-2xl bg-[#09090b]/90 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold border border-zinc-700/80 shadow-2xl backdrop-blur-xl transition-all duration-200 flex items-center gap-2 group hover:scale-105 active:scale-95 ${className}`}
        title={defaultLabel}
      >
        {showMovieIcon ? (
          <Video className="w-4 h-4 text-purple-400" />
        ) : (
          <ArrowRight className="w-4 h-4 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
        )}
        <span>{defaultLabel}</span>
      </button>
    );
  }

  if (variant === 'glass') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 hover:text-white text-xs font-semibold border border-white/10 backdrop-blur-md transition-all flex items-center gap-2 group ${className}`}
        title={defaultLabel}
      >
        {showHomeIcon ? (
          <Home className="w-3.5 h-3.5 text-purple-400" />
        ) : showMovieIcon ? (
          <Video className="w-3.5 h-3.5 text-purple-400" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
        )}
        <span>{defaultLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 transition-all group ${className}`}
      title={defaultLabel}
    >
      {showMovieIcon ? (
        <Video className="w-3.5 h-3.5 text-purple-400" />
      ) : (
        <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
      )}
      <span>{defaultLabel}</span>
    </button>
  );
};
