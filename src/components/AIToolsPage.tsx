import React from 'react';
import { ArrowLeft, Cpu, Sparkles } from 'lucide-react';
import { AIPoweredToolsShowcase } from './AIPoweredToolsShowcase';

export const AIToolsPage: React.FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-28 pb-20 sm:pt-32" dir="rtl">
      <div className="pointer-events-none absolute -top-32 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-[28rem] -end-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-9 max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-950/40 px-4 py-2 text-xs font-semibold text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.10)]">
            <Cpu className="h-4 w-4 animate-pulse" />
            TEKVIX AI DIRECTORY
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            مرکز ابزارهای
            <span className="mt-2 block bg-gradient-to-l from-cyan-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              هوش مصنوعی تکویکس
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray-300 sm:text-base">
            ابزار مناسب هر ایده را سریع پیدا کن؛ از تولید تصویر و ویدیو تا موسیقی، صدا، برنامه‌نویسی و اتوماسیون.
            روی هر ابزار بزن تا وارد وب‌سایت رسمی آن شوی.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-gray-200 transition-colors hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              بازگشت به صفحه اصلی
            </a>
            <span className="inline-flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-950/35 px-4 py-2.5 text-xs font-semibold text-purple-200">
              <Sparkles className="h-4 w-4" />
              ۲۰ ابزار منتخب
            </span>
          </div>
        </div>

        <div className="relative">
          <AIPoweredToolsShowcase />
        </div>

        <div className="mt-8 text-center text-xs leading-6 text-gray-500">
          تکویکس ابزارها را در یک مسیر ساده و یکپارچه برای خلق پروژه‌های دیجیتال کنار هم قرار می‌دهد.
        </div>
      </div>
    </section>
  );
};

export default AIToolsPage;
