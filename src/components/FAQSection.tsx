import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const FAQSection: React.FC = () => {
  const { faqs, brandInfo } = useSiteData();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-[#05050d] overflow-hidden border-t border-purple-900/20">
      {/* Background glow */}
      <div className="absolute bottom-0 start-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>پاسخ به ابهامات متداول</span>
          </div>

          <h2
            id="faq-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            سوالات متداول
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            پاسخ به سوالاتی که ممکن است پیش از ثبت سفارش برای شما مطرح باشد.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0f0b22] border-purple-500/40 shadow-[0_0_20px_rgba(147,51,234,0.15)]'
                    : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/15'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base sm:text-lg text-white">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-purple-600 text-white rotate-180'
                        : 'bg-white/[0.05] text-gray-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-gray-300 leading-relaxed border-t border-purple-500/10">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-sm text-gray-300 mb-3">
            سوالی دارید که در لیست بالا نیست؟
          </p>
          <a
            href={brandInfo.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>ارسال پیام مستقیم در تلگرام ({brandInfo.telegramHandle})</span>
            <span className="text-lg">←</span>
          </a>
        </div>

      </div>
    </section>
  );
};
