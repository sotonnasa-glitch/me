import React from 'react';
import { Sparkles, Send, ArrowUp, Shield } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { brandInfo, services } = useSiteData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'خدمات', href: '#services' },
    { label: 'ویژگی‌ها', href: '#features' },
    { label: 'نحوه کار', href: '#how-it-works' },
    { label: 'نمونه‌کارها', href: '#portfolio' },
    { label: 'درباره ما', href: '#about' },
    { label: 'سوالات متداول', href: '#faq' },
    { label: 'تماس با ما', href: '#contact' },
  ];

  return (
    <footer id="main-footer" className="bg-[#030308] border-t border-purple-950/40 text-gray-400 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 start-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-purple-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-violet-900/40 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-2xl font-black text-white font-sans tracking-tight">
                {brandInfo.latinName || 'Tekvix'}
              </span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              {brandInfo.tagline} — ارائه تخصصی‌ترین خدمات طراحی وب‌سایت، تصویرسازی، تیزر ویدیویی، موسیقی و توسعه ربات تلگرام با هوش مصنوعی.
            </p>

            {/* Telegram Badge & Admin link */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={brandInfo.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-300 hover:text-white text-xs font-semibold hover:border-purple-500 transition-all shadow-[0_0_15px_rgba(147,51,234,0.15)]"
              >
                <Send className="w-4 h-4 rotate-180" />
                <span>پشتیبانی مستقیم در تلگرام: {brandInfo.telegramHandle}</span>
              </a>

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-purple-300 text-xs font-medium transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>ورود به پنل ادمین</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              بخش‌های سایت
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-purple-500/60">›</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Popular Services Quick Links */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              خدمات فعال سایت
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {services.slice(0, 6).map((srv) => (
                <a
                  key={srv.id}
                  href="#services"
                  className="text-gray-400 hover:text-purple-200 transition-colors p-1.5 rounded hover:bg-white/[0.02]"
                >
                  {srv.title}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright and back-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span>© ۲۰۲۶ تمامی حقوق محفوظ است. پلتفرم</span>
            <span className="text-purple-300 font-semibold font-sans">{brandInfo.latinName || 'Tekvix'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              طراحی شده با دقت و کیفیت استاندارد
            </span>
            <button
              type="button"
              id="back-to-top-btn"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-purple-900/30 text-gray-400 hover:text-white border border-white/5 transition-all"
              title="بازگشت به بالای صفحه"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
