import React from 'react';
import { Layers, FileSpreadsheet, Send, ArrowLeft } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/mockData';

interface HowItWorksProps {
  onOpenOrderModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOrderModal }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-6 h-6 text-purple-300" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-6 h-6 text-indigo-300" />;
      case 'Send': return <Send className="w-6 h-6 text-violet-300 rotate-180" />;
      default: return <Layers className="w-6 h-6 text-purple-300" />;
    }
  };

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-[#05050d] overflow-hidden border-t border-purple-900/20">
      {/* Background Grid Pattern and Ambient Glow */}
      <div className="absolute inset-0 bg-cosmic-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-radial-gradient opacity-50 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-200 text-xs font-semibold mb-4 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>مراحل شفاف و هوشمند همکاری</span>
          </div>

          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
          >
            مسیر اجرای پروژه شما چگونه است؟
          </h2>

          <p className="text-base sm:text-lg text-purple-200/80 leading-relaxed max-w-2xl mx-auto font-normal">
            تنها در ۳ مرحله ساده، از ایده اولیه تا تحویل خروجی نهایی هوش مصنوعی همراه شما هستیم.
          </p>
        </div>

        {/* 3 Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line on Desktop with Glowing Gradient */}
          <div className="hidden md:block absolute top-1/2 start-16 end-16 h-0.5 bg-gradient-to-r from-purple-500/20 via-cyan-400/40 to-indigo-500/20 -translate-y-8 z-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />

          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#130c2c]/85 via-[#0c081e]/90 to-[#070412]/95 border border-purple-500/25 hover:border-purple-400/60 transition-all duration-400 flex flex-col items-start gap-4 shadow-2xl backdrop-blur-xl group hover:-translate-y-1.5 hover:shadow-[0_0_35px_rgba(147,51,234,0.2)] overflow-hidden"
            >
              {/* Card Top Laser Light */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Background Gleam */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shine-gleam pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Step Number & Icon Header */}
              <div className="w-full flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-900/60 via-indigo-950/70 to-purple-950/80 border border-purple-500/40 flex items-center justify-center shadow-[0_0_22px_rgba(147,51,234,0.35)] group-hover:scale-110 group-hover:border-purple-300 transition-all duration-300">
                  {getStepIcon(step.icon)}
                </div>
                <span className="text-3xl font-black font-sans text-purple-400/30 group-hover:text-purple-300 transition-colors">
                  {step.stepNumber}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-purple-100/70 leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick CTA */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] transition-all duration-300 cursor-pointer"
          >
            <span>شروع مرحله اول و ثبت سفارش</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
