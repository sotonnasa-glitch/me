import React from 'react';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { NeuralSubmitButton } from './common/NeuralSubmitButton';

interface CTASectionProps {
  onOpenOrderModal: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenOrderModal }) => {
  const { brandInfo } = useSiteData();

  return (
    <section className="relative py-20 sm:py-28 bg-[#05050d] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Big Cosmic Mesh Grid Banner Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#190d3d] via-[#100826] to-[#080514] border border-purple-500/40 p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_80px_rgba(147,51,234,0.25)]">
          
          {/* Cyber Mesh Grid Overlay */}
          <div className="absolute inset-0 bg-cosmic-grid opacity-40 pointer-events-none" />
          
          {/* Radial Top Glow */}
          <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-semibold mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>شروع سریع همکاری با {brandInfo.name || 'تکویکس'}</span>
          </div>

          {/* Big Headline */}
          <h2
            id="cta-title"
            className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.3] mb-6 max-w-3xl mx-auto"
          >
            ایده‌ای در ذهن دارید؟ بیایید با هوش مصنوعی خلقش کنیم.
          </h2>

          <p className="relative z-10 text-base sm:text-xl text-purple-200/90 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            تیم متخصص {brandInfo.name || 'تکویکس'} آماده است تا در کوتاه‌ترین زمان، خروجی‌های حرفه‌ای وب، ویدیو، صدا و رباتیک را در اختیارتان قرار دهد.
          </p>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <NeuralSubmitButton
              id="cta-place-order-btn"
              label="Submit Request"
              successLabel="Submitted ✓"
              onSubmitSuccess={onOpenOrderModal}
              className="w-full sm:w-auto"
            />

            <a
              href={brandInfo.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-gray-200 hover:text-white font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 rotate-180 text-purple-300" />
              <span>گفتگو در تلگرام</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
