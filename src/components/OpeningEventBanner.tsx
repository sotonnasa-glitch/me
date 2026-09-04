import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gift,
  Sparkles,
  Clock,
  CheckCircle2,
  Flame,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Tag,
  Percent,
  Copy,
  Check,
  Trophy,
  Megaphone,
  Sliders,
  Layers,
  Pause,
  Play
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { CustomEventCampaign, EventTheme, EventType } from '../types';

interface OpeningEventBannerProps {
  onOpenOrderModal: (serviceId?: string) => void;
}

// Single Event Card Countdown Sub-component
const EventCountdownBox: React.FC<{
  endDate: string;
  hasCountdown: boolean;
  termsNote?: string;
  themeStyles: {
    timerBox: string;
  };
}> = ({ endDate, hasCountdown, termsNote, themeStyles }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const format2Digits = (num: number) => num.toString().padStart(2, '0');
  const now = Date.now();
  const end = new Date(endDate).getTime();
  const isExpired = now > end;

  if (!hasCountdown) {
    if (!termsNote) return null;
    return (
      <div className="w-full max-w-xs rounded-xl p-2.5 bg-black/40 border border-white/10 text-[11px] text-zinc-300 text-start space-y-0.5 backdrop-blur-md">
        <span className="font-bold text-amber-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>شرایط رویداد:</span>
        </span>
        <p className="text-zinc-300 text-[10px] leading-relaxed line-clamp-2">{termsNote}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs sm:max-w-[260px] rounded-xl p-2.5 sm:p-3 bg-black/50 border border-white/10 backdrop-blur-md space-y-1.5 text-center">
      <div className="flex items-center justify-between text-[11px] text-zinc-300 pb-1.5 border-b border-white/10 font-medium">
        <span className="flex items-center gap-1 text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>فرصت باقی‌مانده</span>
        </span>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${isExpired ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
          {isExpired ? 'پایان یافته' : 'فعال'}
        </span>
      </div>

      {/* 4 Compact Timer Boxes */}
      <div className="grid grid-cols-4 gap-1.5 text-center py-0.5" dir="ltr">
        {/* Days */}
        <div className={`p-1 sm:p-1.5 rounded-lg bg-gradient-to-b ${themeStyles.timerBox}`}>
          <span className="block text-sm sm:text-base font-extrabold font-mono text-white leading-none">
            {format2Digits(timeLeft.days)}
          </span>
          <span className="text-[9px] text-zinc-400 font-normal">روز</span>
        </div>

        {/* Hours */}
        <div className={`p-1 sm:p-1.5 rounded-lg bg-gradient-to-b ${themeStyles.timerBox}`}>
          <span className="block text-sm sm:text-base font-extrabold font-mono text-white leading-none">
            {format2Digits(timeLeft.hours)}
          </span>
          <span className="text-[9px] text-zinc-400 font-normal">ساعت</span>
        </div>

        {/* Minutes */}
        <div className={`p-1 sm:p-1.5 rounded-lg bg-gradient-to-b ${themeStyles.timerBox}`}>
          <span className="block text-sm sm:text-base font-extrabold font-mono text-white leading-none">
            {format2Digits(timeLeft.minutes)}
          </span>
          <span className="text-[9px] text-zinc-400 font-normal">دقیقه</span>
        </div>

        {/* Seconds */}
        <div className={`p-1 sm:p-1.5 rounded-lg bg-gradient-to-b ${themeStyles.timerBox}`}>
          <span className="block text-sm sm:text-base font-extrabold font-mono text-amber-300 leading-none animate-pulse">
            {format2Digits(timeLeft.seconds)}
          </span>
          <span className="text-[9px] text-amber-300 font-normal">ثانیه</span>
        </div>
      </div>

      {termsNote && (
        <div className="text-[10px] text-zinc-400 text-center font-normal pt-0.5 truncate">
          {termsNote}
        </div>
      )}
    </div>
  );
};

export const OpeningEventBanner: React.FC<OpeningEventBannerProps> = ({ onOpenOrderModal }) => {
  const { events, brandInfo } = useSiteData();

  // Active events list
  const activeEvents = events.filter((e) => e.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Touch Swipe Gesture State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Normalize current index when activeEvents list changes
  useEffect(() => {
    if (currentIndex >= activeEvents.length && activeEvents.length > 0) {
      setCurrentIndex(activeEvents.length - 1);
    }
  }, [activeEvents.length, currentIndex]);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlay || activeEvents.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
    }, 7500);

    return () => clearInterval(timer);
  }, [isAutoPlay, activeEvents.length]);

  const handleNext = useCallback(() => {
    if (activeEvents.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
  }, [activeEvents.length]);

  const handlePrev = useCallback(() => {
    if (activeEvents.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeEvents.length) % activeEvents.length);
  }, [activeEvents.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      isDragging.current = false;
      return;
    }
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    // In RTL layout:
    // Swiping right to left (diff > 0) -> Next card
    // Swiping left to right (diff < 0) -> Prev card
    if (diff > minSwipeDistance) {
      handleNext();
    } else if (diff < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
    isDragging.current = false;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (activeEvents.length === 0) {
    return null;
  }

  const currentEvent = activeEvents[currentIndex] || activeEvents[0];

  // Theme Styling Helper
  const getThemeStyles = (theme: EventTheme) => {
    switch (theme) {
      case 'purple-gold':
        return {
          cardBg: 'from-[#170c3a]/95 via-[#11072e]/95 to-[#09041b]',
          border: 'border-purple-500/40',
          shadow: 'shadow-[0_0_60px_rgba(168,85,247,0.25)]',
          glow: 'from-purple-600/30 to-amber-500/20',
          flare: 'from-transparent via-amber-400 to-purple-500',
          badgeBg: 'from-amber-500/20 to-purple-500/20 border-amber-400/40 text-amber-300',
          ctaBtn: 'from-amber-400 via-orange-500 to-purple-600 hover:from-amber-300 text-black shadow-[0_0_35px_rgba(251,191,36,0.6)]',
          timerBox: 'from-purple-950/80 to-purple-900/40 border-purple-500/30 text-white',
          tabActive: 'bg-purple-600 border-purple-400 text-white shadow-purple-500/40',
          accentColor: 'text-amber-400',
        };
      case 'cyber-cyan':
        return {
          cardBg: 'from-[#051c27]/95 via-[#03131b]/95 to-[#020a0f]',
          border: 'border-cyan-500/40',
          shadow: 'shadow-[0_0_60px_rgba(6,182,212,0.25)]',
          glow: 'from-cyan-600/30 to-indigo-500/20',
          flare: 'from-transparent via-cyan-400 to-indigo-500',
          badgeBg: 'from-cyan-500/20 to-indigo-500/20 border-cyan-400/40 text-cyan-300',
          ctaBtn: 'from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 text-black shadow-[0_0_35px_rgba(6,182,212,0.6)]',
          timerBox: 'from-cyan-950/80 to-cyan-900/40 border-cyan-500/30 text-white',
          tabActive: 'bg-cyan-600 border-cyan-400 text-black font-black shadow-cyan-500/40',
          accentColor: 'text-cyan-400',
        };
      case 'emerald-gold':
        return {
          cardBg: 'from-[#042416]/95 via-[#03160e]/95 to-[#020b07]',
          border: 'border-emerald-500/40',
          shadow: 'shadow-[0_0_60px_rgba(16,185,129,0.25)]',
          glow: 'from-emerald-600/30 to-amber-500/20',
          flare: 'from-transparent via-emerald-400 to-amber-400',
          badgeBg: 'from-emerald-500/20 to-amber-500/20 border-emerald-400/40 text-emerald-300',
          ctaBtn: 'from-emerald-400 via-teal-500 to-amber-500 hover:from-emerald-300 text-black shadow-[0_0_35px_rgba(16,185,129,0.6)]',
          timerBox: 'from-emerald-950/80 to-emerald-900/40 border-emerald-500/30 text-white',
          tabActive: 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/40',
          accentColor: 'text-emerald-400',
        };
      case 'fiery-orange':
        return {
          cardBg: 'from-[#2e0f04]/95 via-[#1c0902]/95 to-[#100401]',
          border: 'border-orange-500/40',
          shadow: 'shadow-[0_0_60px_rgba(249,115,22,0.25)]',
          glow: 'from-orange-600/30 to-rose-500/20',
          flare: 'from-transparent via-orange-400 to-rose-500',
          badgeBg: 'from-orange-500/20 to-red-500/20 border-orange-400/40 text-orange-300',
          ctaBtn: 'from-orange-400 via-amber-500 to-red-600 hover:from-orange-300 text-black shadow-[0_0_35px_rgba(249,115,22,0.6)]',
          timerBox: 'from-orange-950/80 to-orange-900/40 border-orange-500/30 text-white',
          tabActive: 'bg-orange-600 border-orange-400 text-white shadow-orange-500/40',
          accentColor: 'text-orange-400',
        };
      case 'rose-pink':
        return {
          cardBg: 'from-[#2b071c]/95 via-[#1a0411]/95 to-[#0e0209]',
          border: 'border-pink-500/40',
          shadow: 'shadow-[0_0_60px_rgba(236,72,153,0.25)]',
          glow: 'from-pink-600/30 to-purple-500/20',
          flare: 'from-transparent via-pink-400 to-purple-500',
          badgeBg: 'from-pink-500/20 to-rose-500/20 border-pink-400/40 text-pink-300',
          ctaBtn: 'from-pink-400 via-rose-500 to-purple-600 hover:from-pink-300 text-white shadow-[0_0_35px_rgba(236,72,153,0.6)]',
          timerBox: 'from-pink-950/80 to-pink-900/40 border-pink-500/30 text-white',
          tabActive: 'bg-pink-600 border-pink-400 text-white shadow-pink-500/40',
          accentColor: 'text-pink-400',
        };
      case 'midnight-blue':
      default:
        return {
          cardBg: 'from-[#091333]/95 via-[#05091f]/95 to-[#020410]',
          border: 'border-blue-500/40',
          shadow: 'shadow-[0_0_60px_rgba(59,130,246,0.25)]',
          glow: 'from-blue-600/30 to-indigo-500/20',
          flare: 'from-transparent via-blue-400 to-cyan-400',
          badgeBg: 'from-blue-500/20 to-indigo-500/20 border-blue-400/40 text-blue-300',
          ctaBtn: 'from-blue-400 via-indigo-500 to-purple-600 hover:from-blue-300 text-white shadow-[0_0_35px_rgba(59,130,246,0.6)]',
          timerBox: 'from-blue-950/80 to-blue-900/40 border-blue-500/30 text-white',
          tabActive: 'bg-blue-600 border-blue-400 text-white shadow-blue-500/40',
          accentColor: 'text-blue-400',
        };
    }
  };

  const currentStyles = getThemeStyles(currentEvent.theme);

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'giveaway':
        return <Gift className="w-4 h-4 text-amber-300 animate-bounce" />;
      case 'flash_sale':
        return <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />;
      case 'launch':
        return <Flame className="w-4 h-4 text-orange-300 animate-pulse" />;
      case 'contest':
        return <Trophy className="w-4 h-4 text-emerald-300" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-pink-300" />;
      default:
        return <Percent className="w-4 h-4 text-purple-300" />;
    }
  };

  const handleCtaClick = () => {
    if (currentEvent.ctaActionType === 'telegram_contact') {
      window.open(brandInfo.telegramUrl, '_blank');
    } else if (currentEvent.ctaActionType === 'custom_url' && currentEvent.ctaCustomUrl) {
      window.open(currentEvent.ctaCustomUrl, '_blank');
    } else if (currentEvent.ctaActionType === 'scroll_services') {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const targetServiceId =
        currentEvent.targetServices && currentEvent.targetServices.length > 0
          ? currentEvent.targetServices[0]
          : undefined;
      onOpenOrderModal(targetServiceId);
    }
  };

  const now = Date.now();
  const end = new Date(currentEvent.endDate).getTime();
  const isExpired = now > end;
  const isCapacityFull =
    currentEvent.hasCapacityLimit &&
    (currentEvent.usedCapacity || 0) >= (currentEvent.maxCapacity || 1);
  const isCurrentlyOpen = !isExpired && !isCapacityFull;
  const remainingCapacity = currentEvent.hasCapacityLimit
    ? Math.max(0, (currentEvent.maxCapacity || 1) - (currentEvent.usedCapacity || 0))
    : null;

  return (
    <section
      id="opening-event-banner"
      className="relative py-2.5 sm:py-4 overflow-hidden select-none"
      dir="rtl"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Dynamic Background Glow matching current event */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      <div
        className={`absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[180px] bg-gradient-to-r ${currentStyles.glow} rounded-full blur-3xl pointer-events-none opacity-25 transform-gpu will-change-transform transition-colors duration-500`}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Mini Carousel Navigation Header (If > 1 active event) */}
        {activeEvents.length > 1 && (
          <div className="flex items-center justify-between gap-2 mb-2 px-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] font-bold text-zinc-300">
                <Layers className="w-3 h-3 text-purple-400" />
                <span>کمپین‌های فعال ({currentIndex + 1} از {activeEvents.length})</span>
              </span>
            </div>

            {/* Left & Right Carousel Arrows + AutoPlay Toggle */}
            <div className="flex items-center gap-1" dir="ltr">
              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="p-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title={isAutoPlay ? 'توقف ورق‌زدن' : 'پخش خودکار'}
              >
                {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={handlePrev}
                className="p-1 rounded-lg bg-zinc-900/90 hover:bg-purple-600/30 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                title="ایونت قبلی"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded-lg bg-zinc-900/90 hover:bg-purple-600/30 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                title="ایونت بعدی"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3D Stacked Card Container with Touch Swipe Gesture */}
        <div
          className="relative perspective-1000"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background layered card 2 (Depth illusion when > 2 events) */}
          {activeEvents.length > 2 && (
            <div
              className="absolute -inset-x-1.5 -bottom-2 h-full rounded-2xl bg-zinc-900/40 border border-white/5 blur-[1px] transform scale-[0.96] -translate-y-1 pointer-events-none transition-all duration-500 opacity-30 z-0"
            />
          )}

          {/* Background layered card 1 (Depth illusion when > 1 event) */}
          {activeEvents.length > 1 && (
            <div
              className="absolute -inset-x-1 -bottom-1 h-full rounded-2xl bg-zinc-900/70 border border-white/10 backdrop-blur-xs transform scale-[0.98] -translate-y-0.5 pointer-events-none transition-all duration-500 opacity-60 z-10"
            />
          )}

          {/* Active Front Card */}
          <div
            key={currentEvent.id}
            className={`relative z-20 rounded-2xl p-3.5 sm:p-5 border ${currentStyles.border} bg-gradient-to-br ${currentStyles.cardBg} ${currentStyles.shadow} overflow-hidden transition-all duration-500 transform animate-in fade-in zoom-in-95`}
          >
            {/* Top Flare Accent */}
            <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${currentStyles.flare}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Content Column (8 Cols) */}
              <div className="lg:col-span-8 space-y-2.5 text-start">
                
                {/* Badges & Status */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r ${currentStyles.badgeBg} text-[11px] font-bold shadow-xs`}
                  >
                    {getEventIcon(currentEvent.eventType)}
                    <span>{currentEvent.badgeText || '🎉 رویداد اختصاصی'}</span>
                  </span>

                  {isCurrentlyOpen ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>کمپین در جریان</span>
                    </span>
                  ) : isCapacityFull ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ظرفیت تکمیل</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>پایان مهلت</span>
                    </span>
                  )}

                  {/* Discount/Offer Pill */}
                  {currentEvent.discountOrOffer && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black font-mono shadow-xs">
                      {currentEvent.discountOrOffer}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h2 className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight leading-snug">
                    {currentEvent.title}
                  </h2>
                  {(currentEvent.subtitle || currentEvent.description) && (
                    <p className="text-xs text-zinc-300 font-normal mt-1 leading-relaxed line-clamp-2">
                      {currentEvent.subtitle || currentEvent.description}
                    </p>
                  )}
                </div>

                {/* Highlights, Capacity & Promo Code Line */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {currentEvent.highlightText && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-[10px] font-semibold text-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{currentEvent.highlightText}</span>
                    </div>
                  )}

                  {currentEvent.promoCode && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 border border-amber-400/30 text-[11px] font-mono text-white">
                      <span className="text-zinc-400 text-[9px]">کد تخفیف:</span>
                      <span className="font-black text-amber-300 font-mono tracking-wide">
                        {currentEvent.promoCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(currentEvent.promoCode!)}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] transition-colors flex items-center gap-0.5 cursor-pointer"
                        title="کپی کد"
                      >
                        {copiedCode === currentEvent.promoCode ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                            <span>کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {currentEvent.hasCapacityLimit && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[10px]">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span className="text-zinc-400">باقی‌مانده:</span>
                      <span className="text-amber-300 font-bold font-mono">
                        {remainingCapacity} از {currentEvent.maxCapacity}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Button & Support Assurance */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className={`py-2 px-5 rounded-xl bg-gradient-to-r ${currentStyles.ctaBtn} font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>{currentEvent.ctaButtonText || 'ثبت سفارش و دریافت تخفیف'}</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </button>

                  <span className="text-[10px] text-zinc-400 hidden sm:flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>تضمین کیفیت و تحویل سریع تکویکس</span>
                  </span>
                </div>

              </div>

              {/* Right Column: Compact Countdown Box (4 Cols) */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <EventCountdownBox
                  endDate={currentEvent.endDate}
                  hasCountdown={currentEvent.hasCountdown}
                  termsNote={currentEvent.termsNote}
                  themeStyles={currentStyles}
                />
              </div>

            </div>

          </div>
        </div>

        {/* 4. Bottom Page Indicators & Theme Chips */}
        {activeEvents.length > 1 && (
          <div className="mt-2.5 flex items-center justify-between sm:justify-center gap-2 flex-wrap">
            
            {/* Interactive Thumbnail / Event Title Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeEvents.map((evt, idx) => {
                const isSelected = idx === currentIndex;
                const evtStyles = getThemeStyles(evt.theme);

                return (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? `${evtStyles.tabActive} shadow-sm scale-102`
                        : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="shrink-0">{getEventIcon(evt.eventType)}</span>
                    <span className="truncate max-w-[120px] sm:max-w-[160px]">{evt.badgeText || evt.title}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1">
              {activeEvents.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-5 bg-gradient-to-r from-purple-500 to-amber-400'
                      : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`رفتن به صفحه ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
