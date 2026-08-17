import React, { useState, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  Clock,
  CheckCircle2,
  Users,
  Flame,
  ArrowLeft,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface OpeningEventBannerProps {
  onOpenOrderModal: (serviceId?: string) => void;
}

export const OpeningEventBanner: React.FC<OpeningEventBannerProps> = ({ onOpenOrderModal }) => {
  const { openingEventState, brandInfo } = useSiteData();
  const { config, status, remainingCapacity, winners, isCurrentlyOpen } = openingEventState;

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(config.endDate).getTime();
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
  }, [config.endDate]);

  // If campaign is manually disabled or completely inactive
  if (!config.isActive && status === 'disabled') {
    return null;
  }

  const format2Digits = (num: number) => num.toString().padStart(2, '0');

  return (
    <section
      id="opening-event-banner"
      className="relative py-10 sm:py-16 overflow-hidden"
      dir="rtl"
    >
      {/* Dynamic Cosmic Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e0728]/90 via-[#070314]/95 to-[#05050d] pointer-events-none" />
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-purple-600/25 via-pink-600/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Event Card */}
        <div className="relative rounded-3xl p-6 sm:p-10 border border-purple-500/40 bg-gradient-to-br from-[#160b38]/90 via-[#10072b]/95 to-[#09041a] shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden">
          
          {/* Top Decorative Flare */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-purple-500" />
          <div className="absolute -top-24 -end-24 w-60 h-60 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -start-24 w-60 h-60 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Content Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-5 text-start">
              
              {/* Badge & Status Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>{config.badgeText || '🎉 کمپین افتتاحیه ویژه'}</span>
                </span>

                {isCurrentlyOpen ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>کمپین فعال و در جریان</span>
                  </span>
                ) : status === 'completed' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ظرفیت ۲ سفارش رایگان تکمیل شد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>زمان کمپین به پایان رسید</span>
                  </span>
                )}
              </div>

              {/* Title & Headline */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {config.title}
                </h2>
                <p className="text-sm sm:text-base text-purple-200/90 font-medium mt-2 leading-relaxed">
                  {config.subtitle}
                </p>
              </div>

              {/* Live Remaining Capacity Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/40 border border-purple-500/30 backdrop-blur-md shadow-inner">
                  <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                  <div className="text-xs">
                    <span className="text-gray-300">ظرفیت باقی‌مانده: </span>
                    <span className="text-amber-300 font-extrabold text-sm sm:text-base font-mono">
                      {remainingCapacity} از {config.maxWinners} سفارش
                    </span>
                  </div>
                </div>

                {isCurrentlyOpen && remainingCapacity === 1 && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/30 animate-pulse">
                    ⚡ فقط ۱ ظرفیت دیگر باقی‌مانده است!
                  </span>
                )}
              </div>

              {/* Description & Terms */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                {config.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {isCurrentlyOpen ? (
                  <button
                    type="button"
                    onClick={() => onOpenOrderModal()}
                    className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 hover:from-amber-300 hover:via-orange-400 hover:to-purple-500 text-black font-black text-sm sm:text-base shadow-[0_0_35px_rgba(251,191,36,0.6)] hover:shadow-[0_0_45px_rgba(251,191,36,0.9)] transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Gift className="w-5 h-5 text-black" />
                    <span>ثبت سفارش و دریافت رایگان</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenOrderModal()}
                    className="py-3.5 px-6 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-white font-bold text-sm border border-purple-500/40 transition-all flex items-center gap-2"
                  >
                    <span>مشاهده خدمات و ثبت سفارش عادی</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>اعتبارسنجی ۱۰۰٪ هوشمند و بدون قرعه‌کشی (اولین ثبت‌ها)</span>
                </span>
              </div>

            </div>

            {/* Right Column: Dynamic Countdown Timer & Winners (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
              
              {/* Countdown Box */}
              <div className="w-full max-w-sm rounded-2xl p-5 bg-black/50 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-3 text-center">
                <div className="flex items-center justify-between text-xs text-purple-300 pb-2 border-b border-purple-500/20 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>شمارش معکوس تا پایان کمپین</span>
                  </span>
                  <span className="text-[11px] text-amber-300 font-mono">
                    {isCurrentlyOpen ? 'در حال اجرا' : 'پایان یافته'}
                  </span>
                </div>

                {/* 4 Timer Digital Boxes */}
                <div className="grid grid-cols-4 gap-2 text-center py-2" dir="ltr">
                  {/* Days */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-b from-purple-950/80 to-purple-900/40 border border-purple-500/30 shadow-inner">
                    <span className="block text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
                      {format2Digits(timeLeft.days)}
                    </span>
                    <span className="text-[10px] text-purple-300 font-medium">روز</span>
                  </div>

                  {/* Hours */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-b from-purple-950/80 to-purple-900/40 border border-purple-500/30 shadow-inner">
                    <span className="block text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
                      {format2Digits(timeLeft.hours)}
                    </span>
                    <span className="text-[10px] text-purple-300 font-medium">ساعت</span>
                  </div>

                  {/* Minutes */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-b from-purple-950/80 to-purple-900/40 border border-purple-500/30 shadow-inner">
                    <span className="block text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
                      {format2Digits(timeLeft.minutes)}
                    </span>
                    <span className="text-[10px] text-purple-300 font-medium">دقیقه</span>
                  </div>

                  {/* Seconds */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-b from-purple-950/80 to-purple-900/40 border border-purple-500/30 shadow-inner">
                    <span className="block text-xl sm:text-2xl font-black font-mono text-amber-300 tracking-wider animate-pulse">
                      {format2Digits(timeLeft.seconds)}
                    </span>
                    <span className="text-[10px] text-amber-300 font-medium">ثانیه</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 text-center font-normal pt-1">
                  {config.termsNote || 'هر کاربر فقط یک‌بار مجاز به دریافت خدمت رایگان است.'}
                </div>
              </div>

              {/* Winners Ticker / Live Registered Free Orders */}
              {winners && winners.length > 0 && (
                <div className="w-full max-w-sm rounded-2xl p-4 bg-purple-950/30 border border-purple-500/20 text-start space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>برندگان ثبت‌شده تاکنون ({winners.length}/{config.maxWinners})</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {winners.map((w, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-white font-semibold">{w.fullName}</span>
                        </div>
                        <span className="text-purple-300 text-[10px] font-mono">
                          {w.serviceTitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
