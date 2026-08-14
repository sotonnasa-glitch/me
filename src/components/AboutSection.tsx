import React from 'react';
import { ShieldCheck, Target, Zap, Sparkles } from 'lucide-react';
import { BRAND_INFO } from '../data/mockData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#05050d] overflow-hidden">
      {/* Background ambient */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>داستان برند تکویکس</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              پل میان ایده‌های نوآورانه و قدرت بی‌انتهای هوش مصنوعی
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              <p>
                <strong className="text-white font-semibold">تکویکس (Tekvix)</strong> با هدف از میان برداشتن موانع فنی و زمانی در خلق آثار دیجیتال متولد شد. ما پیشرفته‌ترین مدل‌های هوش مصنوعی بین‌المللی را با ذوق هنری و استانداردهای مهندسی نرم‌افزار ترکیب کرده‌ایم تا هر شخص یا برندی بتواند در کوتاه‌ترین زمان به خروجی‌های شگفت‌انگیز دست یابد.
              </p>
              <p>
                از طراحی وب‌سایت‌های فوق مدرن و تولید محتوای ویدیویی سینماتیک گرفته تا توسعه بات‌های اختصاصی تلگرام و صداگذاری طبیعی، تیم متخصص ما تمام جزئیات فنی را مدیریت می‌کند تا شما فقط بر رشد کسب‌وکار خود تمرکز کنید.
              </p>
              <p className="text-purple-300/90 font-medium">
                مأموریت ما ساده است: دسترسی سریع، شفاف و فوق‌حرفه‌ای به خدمات هوش مصنوعی با ارتباط مستقیم و بدون واسطه.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>مالکیت ۱۰۰٪ تجاری خروجی‌ها</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span>تحویل در کمترین زمان ممکن</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                <Target className="w-4 h-4 text-purple-400 shrink-0" />
                <span>تضمین کیفیت و پشتیبانی تا رضایت</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>مدل‌های نسل جدید 2026</span>
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#130d2a] to-[#0a0717] border border-purple-500/30 shadow-[0_0_40px_rgba(147,51,234,0.18)] relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                <span>تکویکس در یک نگاه</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/30 font-sans">
                  2026 Metrics
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white font-sans">
                    +۱۵۰
                  </div>
                  <div className="text-xs text-gray-400 mt-1">پروژه موفق تحویل‌شده</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white font-sans">
                    ۹۹.۸٪
                  </div>
                  <div className="text-xs text-gray-400 mt-1">نرخ رضایت کارفرمایان</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white font-sans">
                    ۳x
                  </div>
                  <div className="text-xs text-gray-400 mt-1">سرعت بالاتر نسبت به بازار</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white font-sans">
                    ۲۴/۷
                  </div>
                  <div className="text-xs text-gray-400 mt-1">پشتیبانی در تلگرام</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-purple-300">
                  ارتباط مستقیم با مدیریت فنی تکویکس: <span className="font-sans font-bold text-white">{BRAND_INFO.telegramHandle}</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
