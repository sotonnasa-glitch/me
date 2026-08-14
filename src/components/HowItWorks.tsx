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
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-cosmic-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium mb-4">
            <span>مراحل همکاری</span>
          </div>

          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            مسیر اجرای پروژه شما چگونه است؟
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            تنها در ۳ مرحله ساده، از ایده اولیه تا تحویل خروجی نهایی هوش مصنوعی همراه شما هستیم.
          </p>
        </div>

        {/* 3 Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line on Desktop */}
          <div className="hidden md:block absolute top-1/2 start-16 end-16 h-0.5 bg-gradient-to-r from-purple-500/20 via-purple-500/40 to-indigo-500/20 -translate-y-8 z-0" />

          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 p-7 sm:p-8 rounded-2xl bg-[#090717]/80 border border-purple-500/20 hover:border-purple-500/50 hover:bg-[#100c24] transition-all duration-300 flex flex-col items-start gap-4 shadow-xl shadow-black/40 group"
            >
              {/* Step Number & Icon Header */}
              <div className="w-full flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-950/60 border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.25)] group-hover:scale-110 group-hover:border-purple-400 transition-all">
                  {getStepIcon(step.icon)}
                </div>
                <span className="text-3xl font-black font-sans text-purple-400/40 group-hover:text-purple-400/80 transition-colors">
                  {step.stepNumber}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed">
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all duration-200"
          >
            <span>شروع مرحله اول و ثبت سفارش</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
