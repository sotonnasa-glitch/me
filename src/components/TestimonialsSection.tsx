import React from 'react';
import { Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, brandInfo } = useSiteData();

  return (
    <section className="relative py-24 sm:py-32 bg-[#05050d] overflow-hidden border-t border-purple-900/20">
      {/* Background glow */}
      <div className="absolute top-1/2 end-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>فراتر از انتظارات</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            تجربه همکاری مشتریان با {brandInfo.name || 'تکویکس'}
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            ابزارهای هوش مصنوعی و خدمات سریع ما استراتژی تولید محتوا و فروش کسب‌وکارها را متحول کرده است.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-7 rounded-2xl bg-gradient-to-b from-[#150f2e]/90 to-[#0c081c]/90 border border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_30px_rgba(147,51,234,0.15)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <Quote className="w-8 h-8 text-purple-400/40 mb-4 group-hover:text-purple-400/80 transition-colors" />
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-6 font-normal">
                  «{item.quote}»
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-purple-500/20">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-sm">{item.name}</span>
                    {item.verified && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <span className="text-xs text-purple-300/80">{item.role} · {item.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
