import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Share2
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { SocialMediaLink } from '../types';

export const SocialMediaSection: React.FC = () => {
  const { socialLinks, brandInfo } = useSiteData();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter only enabled non-github channels
  const activeLinks = socialLinks.filter((link) => link.enabled && link.platform !== 'github');

  const handleCopyLink = (link: SocialMediaLink, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (platform: SocialMediaLink['platform']) => {
    switch (platform) {
      case 'telegram':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Flying Wind Particles & Flight Glow Trail */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/30 via-sky-400/20 to-transparent rounded-2xl pointer-events-none" />
            <div className="absolute -bottom-2 -start-2 w-10 h-10 bg-sky-400/30 rounded-full blur-lg animate-neon-radar pointer-events-none" />
            
            {/* Wind flight trails */}
            <div className="absolute top-3 end-2 w-4 h-[1.5px] bg-sky-300/40 rounded-full animate-pulse" />
            <div className="absolute bottom-3 start-2 w-5 h-[1.5px] bg-sky-300/60 rounded-full animate-pulse" />

            {/* Flying Paper Plane Icon with 3D Float Animation */}
            <div className="relative z-10 animate-paper-plane">
              <Send className="w-8 h-8 text-sky-300 rotate-180 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-transform group-hover:scale-110" />
            </div>

            {/* Glowing Corner Star Sparkle */}
            <span className="absolute top-2 start-2 w-1.5 h-1.5 rounded-full bg-sky-200 animate-ping opacity-90" />
          </div>
        );
      case 'instagram':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Instagram sunset vibrant background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433]/30 via-[#dc2743]/30 to-[#bc1888]/40 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-md animate-neon-radar pointer-events-none" />

            {/* Rotating Story Gradient Ring around the camera */}
            <div className="absolute w-12 h-12 rounded-full border-[1.5px] border-dashed border-pink-400/60 animate-instagram-ring pointer-events-none" />

            {/* Camera Floating Body with 3D animation */}
            <div className="relative z-10 flex items-center justify-center animate-instagram-float group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-pink-300 drop-shadow-[0_0_16px_rgba(244,63,94,0.9)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>

              {/* Glowing Lens Flare Sparkle inside the camera lens */}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white animate-lens-sparkle pointer-events-none shadow-[0_0_8px_#ffffff]" />
            </div>

            {/* Top right camera flash flash-pulse */}
            <span className="absolute top-2.5 end-2.5 w-2 h-2 rounded-full bg-amber-300 animate-ping opacity-90" />
            <span className="absolute top-2.5 end-2.5 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fde047]" />
          </div>
        );
      case 'youtube':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* YouTube vivid red glow & background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-700/40 via-rose-600/30 to-red-500/20 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 rounded-2xl bg-red-500/25 animate-neon-radar pointer-events-none" />

            {/* Pulsing 3D YouTube Play Badge */}
            <div className="relative z-10 flex items-center justify-center animate-youtube-beat group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-9 h-9 text-red-500 drop-shadow-[0_0_18px_rgba(239,68,68,0.95)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9 10 15" fill="#ffffff" fillOpacity="0.95" />
              </svg>
            </div>

            {/* Dancing Equalizer Audio Bars at bottom-right */}
            <div className="absolute bottom-2.5 end-2.5 flex items-end gap-0.5 pointer-events-none">
              <span className="w-1 bg-red-400 rounded-full animate-eq-1 shadow-[0_0_6px_#f87171]" />
              <span className="w-1 bg-rose-300 rounded-full animate-eq-2 shadow-[0_0_6px_#fda4af]" />
              <span className="w-1 bg-red-400 rounded-full animate-eq-3 shadow-[0_0_6px_#f87171]" />
            </div>

            {/* Live Streaming Red Beacon at top-left */}
            <span className="absolute top-2.5 start-2.5 w-2 h-2 rounded-full bg-red-400 animate-ping opacity-90" />
            <span className="absolute top-2.5 start-2.5 w-1.5 h-1.5 rounded-full bg-red-300 shadow-[0_0_8px_#ef4444]" />
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="relative z-10">
              <Share2 className="w-7 h-7 text-purple-300 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-purple-400 animate-ping opacity-75" />
          </div>
        );
    }
  };

  const getCardTheme = (platform: SocialMediaLink['platform']) => {
    switch (platform) {
      case 'telegram':
        return {
          glow: 'from-sky-500/25 via-blue-600/15 to-transparent',
          border: 'border-sky-500/30 hover:border-sky-400/80',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          btnBg: 'bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]',
          shadow: 'hover:shadow-[0_0_40px_rgba(56,189,248,0.3)]',
          iconBg: 'bg-gradient-to-br from-sky-950/90 via-[#07132a] to-blue-950/90 border-sky-400/50 shadow-[0_0_25px_rgba(56,189,248,0.35)]',
        };
      case 'instagram':
        return {
          glow: 'from-pink-500/30 via-rose-600/20 to-transparent',
          border: 'border-pink-500/40 hover:border-pink-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
          badgeBg: 'bg-pink-500/25 text-pink-200 border-pink-400/50',
          btnBg: 'bg-gradient-to-r from-rose-500/30 to-pink-600/30 hover:from-rose-500/50 hover:to-pink-600/50 text-pink-100 border-pink-400/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
          shadow: 'hover:shadow-[0_0_50px_rgba(244,63,94,0.4)]',
          iconBg: 'bg-gradient-to-br from-pink-950/90 via-[#260a1d] to-rose-950/90 border-pink-400/60 shadow-[0_0_30px_rgba(244,63,94,0.45)]',
        };
      case 'youtube':
        return {
          glow: 'from-red-600/35 via-rose-600/20 to-transparent',
          border: 'border-red-500/40 hover:border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]',
          badgeBg: 'bg-red-500/25 text-red-200 border-red-400/50',
          btnBg: 'bg-gradient-to-r from-red-600/30 to-rose-600/30 hover:from-red-600/50 hover:to-rose-600/50 text-red-100 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.35)]',
          shadow: 'hover:shadow-[0_0_50px_rgba(239,68,68,0.4)]',
          iconBg: 'bg-gradient-to-br from-red-950/90 via-[#2a0909] to-rose-950/90 border-red-400/60 shadow-[0_0_30px_rgba(239,68,68,0.45)]',
        };
      default:
        return {
          glow: 'from-purple-500/25 via-indigo-600/15 to-transparent',
          border: 'border-purple-500/30 hover:border-purple-400/80',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          btnBg: 'bg-purple-500/20 hover:bg-purple-500/35 text-purple-200 border-purple-500/40',
          shadow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]',
          iconBg: 'bg-gradient-to-br from-purple-950/90 via-[#150a28] to-indigo-950/90 border-purple-400/50 shadow-[0_0_25px_rgba(168,85,247,0.35)]',
        };
    }
  };

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <section
      id="social-media-channels"
      className="relative py-20 sm:py-28 bg-[#05050d] overflow-hidden"
      dir="rtl"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-600/15 via-sky-600/15 to-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/15 via-purple-500/15 to-pink-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>کانال‌ها و شبکه‌های اجتماعی رسمی</span>
          </div>

          <h2
            id="social-section-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
          >
            به جامعه بزرگ {brandInfo.name || 'تکویکس'} بپیوندید
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            برای دریافت آخرین آموزش‌های هوش مصنوعی، کدهای تخفیف دوره‌ای، نمونه‌کارهای تازه و ارتباط مستقیم با تیم پشتیبانی در شبکه‌های اجتماعی همراهمان باشید.
          </p>
        </div>

        {/* Dynamic Social Cards Grid with Animated Logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeLinks.map((link) => {
            const theme = getCardTheme(link.platform);
            const isCopied = copiedId === link.id;

            return (
              <div
                key={link.id}
                id={`social-card-${link.id}`}
                className={`relative rounded-3xl bg-gradient-to-b from-[#0f0a28] via-[#0a061b] to-[#060312] border ${theme.border} p-6 sm:p-7 flex flex-col justify-between overflow-hidden group transition-all duration-300 ${theme.shadow} hover:-translate-y-1`}
              >
                {/* Background top radial glow */}
                <div
                  className={`absolute -top-12 -start-12 w-40 h-40 bg-gradient-to-br ${theme.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                {/* Cyber Mesh subtle texture */}
                <div className="absolute inset-0 bg-cosmic-grid opacity-20 pointer-events-none" />

                <div>
                  {/* Top Row: Animated Sparkling Logo + Badge */}
                  <div className="relative z-10 flex items-center justify-between mb-5">
                    {/* Animated Holographic Icon Box with Periodic Light Sweep */}
                    <div
                      className={`w-16 h-16 rounded-2xl ${theme.iconBg} border flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105`}
                    >
                      {/* Internal shimmering scan beam that sweeps through */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine-gleam pointer-events-none" />
                      {getPlatformIcon(link.platform)}
                    </div>

                    {link.badge && (
                      <span
                        className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border ${theme.badgeBg}`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Handle */}
                  <div className="relative z-10 space-y-1.5 mb-3">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-purple-200 transition-colors">
                      {link.title}
                    </h3>

                    <p className="text-xs font-mono text-gray-400 group-hover:text-gray-300 transition-colors">
                      {link.handle}
                    </p>
                  </div>

                  {/* Description */}
                  {link.description && (
                    <p className="relative z-10 text-xs text-gray-300/90 leading-relaxed mb-6 font-normal">
                      {link.description}
                    </p>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="relative z-10 pt-4 border-t border-white/[0.08] flex items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${theme.btnBg}`}
                  >
                    <span>ورود و عضویت مستقیم</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(link, e)}
                    className="w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title={isCopied ? 'کپی شد!' : 'کپی لینک'}
                    aria-label="کپی لینک"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in-50" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with Support Notice */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-sky-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">پشتیبانی و مشاوره آنلاین مستقیم</h4>
              <p className="text-xs text-gray-300 mt-0.5">
                برای استعلام سریع یا ارسال نیازمندی‌های خاص، مستقیماً در تلگرام با ما گفتگو کنید.
              </p>
            </div>
          </div>

          <a
            href={brandInfo.telegramUrl || 'https://t.me/Lawat_kar'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4 rotate-180" />
            <span>ارتباط در تلگرام ({brandInfo.telegramHandle || '@Lawat_kar'})</span>
          </a>
        </div>

      </div>
    </section>
  );
};

