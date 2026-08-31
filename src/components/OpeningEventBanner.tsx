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
      <div className="w-full max-w-sm rounded-2xl p-4 bg-black/40 border border-white/10 text-xs text-zinc-300 text-start space-y-1 backdrop-blur-md">
        <span className="font-bold text-amber-400 block flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>شرایط و نکات رویداد:</span>
        </span>
        <p className="text-zinc-300 leading-relaxed text-[11px]">{termsNote}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl p-5 bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3 text-center transition-all">
      <div className="flex items-center justify-between text-xs text-zinc-300 pb-2 border-b border-white/10 font-bold">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>شمارش معکوس تا پایان رویداد</span>
        </span>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${isExpired ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300 animate-pulse'}`}>
          {isExpired ? 'پایان یافته' : 'در حال اجرا'}
        </span>
      </div>

      {/* 4 Timer Digital Boxes */}
      <div className="grid grid-cols-4 gap-2 text-center py-2" dir="ltr">
        {/* Days */}
        <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-b ${themeStyles.timerBox} shadow-inner`}>
          <span className="block text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
            {format2Digits(timeLeft.days)}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">روز</span>
        </div>

        {/* Hours */}
        <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-b ${themeStyles.timerBox} shadow-inner`}>
          <span className="block text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
            {format2Digits(timeLeft.hours)}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">ساعت</span>
        </div>

        {/* Minutes */}
        <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-b ${themeStyles.timerBox} shadow-inner`}>
          <span className="block text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
            {format2Digits(timeLeft.minutes)}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">دقیقه</span>
        </div>

        {/* Seconds */}
        <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-b ${themeStyles.timerBox} shadow-inner`}>
          <span className="block text-xl sm:text-2xl font-black font-mono text-amber-300 tracking-wider animate-pulse">
            {format2Digits(timeLeft.seconds)}
          </span>
          <span className="text-[10px] text-amber-300 font-medium">ثانیه</span>
        </div>
      </div>

      {termsNote && (
        <div className="text-[11px] text-zinc-400 text-center font-normal pt-1 line-clamp-2">
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
      className="relative py-6 sm:py-12 overflow-hidden select-none"
      dir="rtl"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Dynamic Background Glow matching current event */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
      <div
        className={`absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r ${currentStyles.glow} rounded-full blur-[100px] pointer-events-none opacity-40 transition-all duration-700`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Mini Carousel Navigation Header (If > 1 active event) */}
        {activeEvents.length > 1 && (
          <div className="flex items-center justify-between gap-3 mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-bold text-zinc-300 shadow-md">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>کمپین‌های فعال ({currentIndex + 1} از {activeEvents.length})</span>
              </span>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                (برای ورق زدن به چپ و راست بکشید)
              </span>
            </div>

            {/* Left & Right Carousel Arrows + AutoPlay Toggle */}
            <div className="flex items-center gap-1.5" dir="ltr">
              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title={isAutoPlay ? 'توقف ورق‌زدن خودکار' : 'پخش خودکار'}
              >
                {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl bg-zinc-900/90 hover:bg-purple-600/30 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                title="ایونت قبلی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-xl bg-zinc-900/90 hover:bg-purple-600/30 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                title="ایونت بعدی"
              >
                <ChevronRight className="w-4 h-4" />
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
              className="absolute -inset-x-2 -bottom-4 h-full rounded-3xl bg-zinc-900/40 border border-white/5 blur-[2px] transform scale-[0.93] -translate-y-2 pointer-events-none transition-all duration-500 opacity-40 z-0"
            />
          )}

          {/* Background layered card 1 (Depth illusion when > 1 event) */}
          {activeEvents.length > 1 && (
            <div
              className="absolute -inset-x-1 -bottom-2 h-full rounded-3xl bg-zinc-900/70 border border-white/10 backdrop-blur-sm transform scale-[0.97] -translate-y-1 pointer-events-none transition-all duration-500 opacity-70 z-10"
            />
          )}

          {/* Active Front Card */}
          <div
            key={currentEvent.id}
            className={`relative z-20 rounded-3xl p-6 sm:p-10 border ${currentStyles.border} bg-gradient-to-br ${currentStyles.cardBg} ${currentStyles.shadow} overflow-hidden transition-all duration-500 transform animate-in fade-in zoom-in-95`}
          >
            {/* Top Flare Accent */}
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${currentStyles.flare}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Content Column (7 Cols) */}
              <div className="lg:col-span-7 space-y-5 text-start">
                
                {/* Badges & Status */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r ${currentStyles.badgeBg} text-xs font-bold shadow-sm`}
                  >
                    {getEventIcon(currentEvent.eventType)}
                    <span>{currentEvent.badgeText || '🎉 رویداد اختصاصی'}</span>
                  </span>

                  {isCurrentlyOpen ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>کمپین فعال و در جریان</span>
                    </span>
                  ) : isCapacityFull ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ظرفیت تکمیل شده</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>مهلت رویداد به پایان رسید</span>
                    </span>
                  )}

                  {/* Discount/Offer Pill */}
                  {currentEvent.discountOrOffer && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black font-mono shadow-sm">
                      {currentEvent.discountOrOffer}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                    {currentEvent.title}
                  </h2>
                  {currentEvent.subtitle && (
                    <p className="text-sm sm:text-base text-zinc-200 font-medium mt-2 leading-relaxed">
                      {currentEvent.subtitle}
                    </p>
                  )}
                </div>

                {/* Highlights & Promo Code */}
                {(currentEvent.highlightText || currentEvent.promoCode) && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {currentEvent.highlightText && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-bold text-amber-300">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{currentEvent.highlightText}</span>
                      </div>
                    )}

                    {currentEvent.promoCode && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/70 border border-amber-400/40 text-xs font-mono text-white shadow-lg">
                        <span className="text-zinc-400 text-[10px]">کد تخفیف:</span>
                        <span className="font-black text-amber-300 font-mono tracking-wider text-sm">
                          {currentEvent.promoCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(currentEvent.promoCode!)}
                          className="px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                          title="کپی کد تخفیف"
                        >
                          {copiedCode === currentEvent.promoCode ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>کپی شد</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>کپی</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Capacity Counter */}
                {currentEvent.hasCapacityLimit && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
                      <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                      <div className="text-xs">
                        <span className="text-zinc-300">ظرفیت اختصاصی: </span>
                        <span className="text-amber-300 font-extrabold text-sm font-mono">
                          {remainingCapacity} از {currentEvent.maxCapacity} عدد باقی‌مانده
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                {currentEvent.description && (
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                    {currentEvent.description}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className={`py-3.5 px-7 rounded-2xl bg-gradient-to-r ${currentStyles.ctaBtn} font-black text-sm sm:text-base transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 shadow-xl`}
                  >
                    <Gift className="w-5 h-5" />
                    <span>{currentEvent.ctaButtonText || 'ثبت سفارش و دریافت تخفیف'}</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </button>

                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>تضمین بالاترین کیفیت و پشتیبانی اختصاصی TEKVIX</span>
                  </span>
                </div>

              </div>

              {/* Right Column: Countdown Box (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
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
          <div className="mt-5 flex flex-col items-center gap-3">
            
            {/* Interactive Thumbnail / Event Title Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-full overflow-x-auto py-1 px-2">
              {activeEvents.map((evt, idx) => {
                const isSelected = idx === currentIndex;
                const evtStyles = getThemeStyles(evt.theme);

                return (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? `${evtStyles.tabActive} shadow-lg scale-105`
                        : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="shrink-0">{getEventIcon(evt.eventType)}</span>
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">{evt.badgeText || evt.title}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pagination Dots with Swipe Helper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="ایونت قبلی"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                {activeEvents.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-7 bg-gradient-to-r from-purple-500 to-amber-400 shadow-sm shadow-purple-500/50'
                        : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                    }`}
                    aria-label={`رفتن به صفحه ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="ایونت بعدی"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
