import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Eye,
  X,
  Bot,
  Globe,
  Clapperboard,
  Palette,
  Music,
  Send,
  Zap,
  CheckCircle2,
  Layers,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { PortfolioItem } from '../types';

interface PortfolioSectionProps {
  onOpenOrderModal?: (serviceId?: string) => void;
}

type CategoryKey = 'all' | 'bot' | 'web' | 'video' | 'image' | 'music';

interface CategoryTab {
  key: CategoryKey;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  cyberBadge: string;
  glowColor: string;
  borderActive: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    key: 'all',
    label: 'همه نمونه‌کارها',
    shortLabel: 'همه',
    icon: Layers,
    cyberBadge: 'ALL AI PROJECTS',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    borderActive: 'border-purple-500 text-purple-200 bg-purple-950/60 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  },
  {
    key: 'bot',
    label: 'ربات‌های تلگرام و اتوماسیون',
    shortLabel: 'ربات تلگرام',
    icon: Bot,
    cyberBadge: 'TELEGRAM AI BOTS',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    borderActive: 'border-cyan-400 text-cyan-200 bg-cyan-950/60 shadow-[0_0_20px_rgba(56,189,248,0.3)]',
  },
  {
    key: 'web',
    label: 'طراحی وب‌سایت و لندینگ هوشمند',
    shortLabel: 'طراحی وب‌سایت',
    icon: Globe,
    cyberBadge: 'AI NEXT-GEN WEB',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    borderActive: 'border-indigo-400 text-indigo-200 bg-indigo-950/60 shadow-[0_0_20px_rgba(139,92,246,0.3)]',
  },
  {
    key: 'video',
    label: 'تیزر و ویدیوهای سینمایی AI',
    shortLabel: 'تیزر و ویدیو',
    icon: Clapperboard,
    cyberBadge: '4K AI CINEMATIC',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    borderActive: 'border-rose-400 text-rose-200 bg-rose-950/60 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
  },
  {
    key: 'image',
    label: 'طراحی تصویر و کانسپت آرت',
    shortLabel: 'تصویر و گرافیک',
    icon: Palette,
    cyberBadge: 'GEN-ART 8K',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    borderActive: 'border-pink-400 text-pink-200 bg-pink-950/60 shadow-[0_0_20px_rgba(236,72,153,0.3)]',
  },
  {
    key: 'music',
    label: 'موسیقی هوش مصنوعی و تولید صدا',
    shortLabel: 'موزیک و صدا',
    icon: Music,
    cyberBadge: 'NEURAL AUDIO LAB',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    borderActive: 'border-amber-400 text-amber-200 bg-amber-950/60 shadow-[0_0_20px_rgba(234,179,8,0.3)]',
  },
];

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenOrderModal }) => {
  const { portfolio, brandInfo } = useSiteData();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Filter items according to active tab
  const filteredPortfolio = useMemo(() => {
    if (activeCategory === 'all') return portfolio;
    return portfolio.filter((item) => {
      const cat = (item.serviceCategory || '').toLowerCase();
      const tags = (item.tags || []).map((t) => t.toLowerCase()).join(' ');
      const title = (item.title || '').toLowerCase();

      if (activeCategory === 'bot') {
        return cat.includes('ربات') || cat.includes('تلگرام') || tags.includes('bot') || tags.includes('telegram');
      }
      if (activeCategory === 'web') {
        return cat.includes('وب') || cat.includes('سایت') || cat.includes('کد') || tags.includes('web') || tags.includes('react') || tags.includes('next');
      }
      if (activeCategory === 'video') {
        return cat.includes('ویدیو') || cat.includes('انیمیشن') || cat.includes('تیزر') || tags.includes('video') || tags.includes('reels');
      }
      if (activeCategory === 'image') {
        return cat.includes('تصویر') || cat.includes('گرافیک') || cat.includes('آرت') || tags.includes('art') || tags.includes('midjourney');
      }
      if (activeCategory === 'music') {
        return cat.includes('موزیک') || cat.includes('صدا') || cat.includes('موسیقی') || tags.includes('music') || tags.includes('audio');
      }
      return true;
    });
  }, [portfolio, activeCategory]);

  const getServiceIdForProject = (item: PortfolioItem): string => {
    const cat = (item.serviceCategory || '').toLowerCase();
    if (cat.includes('ربات')) return 'telegram-bot';
    if (cat.includes('وب')) return 'ai-website';
    if (cat.includes('ویدیو')) return 'ai-video';
    if (cat.includes('تصویر')) return 'image-creation';
    if (cat.includes('موزیک') || cat.includes('صدا')) return 'ai-music';
    return 'ai-website';
  };

  return (
    <section id="portfolio" className="relative py-20 sm:py-28 bg-[#05050d] overflow-hidden" dir="rtl">
      {/* Dynamic Cosmic Ambient Glows */}
      <div className="absolute top-1/4 start-10 w-[550px] h-[550px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 end-10 w-[450px] h-[450px] bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-semibold mb-4 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>ویترین دستاوردهای هوش مصنوعی {brandInfo.name || 'تکویکس'}</span>
          </div>

          <h2
            id="portfolio-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
          >
            نمونه‌کارهای اجرایی و پروژه‌های تحویل‌شده
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            مجموعه‌ای از پروژه‌های واقعی طراحی وب‌سایت، ربات‌های تلگرامی پرسرعت، ویدیوهای سینمایی 4K و آرت‌ورک‌های خلق‌شده با آخرین مدل‌های هوش مصنوعی.
          </p>
        </div>

        {/* Categories Bar with Cyber/AI Animated Badges */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.key;
              const count =
                tab.key === 'all'
                  ? portfolio.length
                  : portfolio.filter((item) => {
                      const cat = (item.serviceCategory || '').toLowerCase();
                      const tags = (item.tags || []).map((t) => t.toLowerCase()).join(' ');
                      if (tab.key === 'bot') return cat.includes('ربات') || tags.includes('bot') || tags.includes('telegram');
                      if (tab.key === 'web') return cat.includes('وب') || tags.includes('web');
                      if (tab.key === 'video') return cat.includes('ویدیو') || tags.includes('video');
                      if (tab.key === 'image') return cat.includes('تصویر') || tags.includes('art');
                      if (tab.key === 'music') return cat.includes('موزیک') || tags.includes('music');
                      return true;
                    }).length;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveCategory(tab.key)}
                  className={`relative shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? tab.borderActive
                      : 'border-white/10 bg-[#0d0920]/80 text-gray-400 hover:text-white hover:border-purple-500/40 hover:bg-[#150e33]'
                  }`}
                >
                  {/* Digital Pulsing Indicator for Active Category */}
                  <span className="relative flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white animate-bounce' : 'text-gray-400'}`} />
                    {isActive && (
                      <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </span>

                  <span>{tab.label}</span>

                  {/* Count Pill */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Projects Grid */}
        {filteredPortfolio.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/5 max-w-lg mx-auto">
            <Bot className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-white mb-1">پروژه‌ای در این دسته‌بندی یافت نشد</h4>
            <p className="text-xs text-gray-400 mb-4">برای مشاهده تمام پروژه‌ها روی دسته‌بندی «همه نمونه‌کارها» کلیک کنید.</p>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 rounded-xl bg-purple-600/40 hover:bg-purple-600 text-purple-200 text-xs font-semibold"
            >
              مشاهده همه پروژه‌ها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => {
              const serviceId = getServiceIdForProject(item);

              return (
                <div
                  key={item.id}
                  id={`portfolio-card-${item.id}`}
                  className="rounded-3xl bg-gradient-to-b from-[#0e0924] via-[#090618] to-[#060312] border border-purple-500/25 hover:border-purple-400/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg shadow-black/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] hover:-translate-y-1"
                >
                  {/* Top Cover Visual with Animated Futuristic Gradient & Glass Badge */}
                  <div
                    className={`h-52 w-full bg-gradient-to-br ${
                      item.gradientTheme || 'from-purple-900/60 via-indigo-900/40 to-black'
                    } p-5 flex flex-col justify-between relative overflow-hidden border-b border-purple-900/30`}
                  >
                    {/* Animated Cyber Grid Overlay */}
                    <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none" />

                    {/* Cyber Neon Top Line */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent group-hover:via-cyan-400 transition-colors" />

                    {/* Header Row: Badge & Quick Eye Button */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/70 border border-purple-400/40 text-purple-200 backdrop-blur-md shadow-sm">
                        {item.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedProject(item)}
                        className="w-8 h-8 rounded-xl bg-black/60 hover:bg-purple-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-md"
                        aria-label="مشاهده جزئیات"
                        title="مشاهده جزئیات کامل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Category Label and Main Title */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-[11px] font-bold text-cyan-300 tracking-wider">
                          {item.serviceCategory}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-100 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 font-normal">
                      {item.description}
                    </p>

                    {/* Performance & Quality Stats */}
                    {item.stats && item.stats.length > 0 && (
                      <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                        {item.stats.map((st, i) => (
                          <div key={i} className="text-center">
                            <span className="text-[11px] text-gray-400 block mb-0.5">{st.label}</span>
                            <span className="text-xs sm:text-sm font-extrabold text-purple-300 font-sans tracking-wide">
                              {st.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technology Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/20"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons Row */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(item)}
                        className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>جزئیات پروژه</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenOrderModal && onOpenOrderModal(serviceId)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>سفارش مشابه</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Rich Project Details Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#130b2c] via-[#0d0720] to-[#070312] border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(168,85,247,0.4)] relative text-start overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Ambient Glow */}
            <div className="absolute top-0 start-1/2 -translate-x-1/2 w-80 h-32 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 end-5 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="relative z-10 mb-4">
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
                {selectedProject.serviceCategory} • {selectedProject.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {selectedProject.title}
              </h3>
            </div>

            {/* Description */}
            <p className="relative z-10 text-sm text-gray-200 leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            {/* Stats Metrics */}
            {selectedProject.stats && selectedProject.stats.length > 0 && (
              <div className="relative z-10 grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 shadow-inner">
                {selectedProject.stats.map((st, i) => (
                  <div key={i} className="text-center p-2 rounded-xl bg-black/30">
                    <div className="text-xs text-gray-400 mb-1">{st.label}</div>
                    <div className="text-base sm:text-lg font-black text-purple-300 font-sans">{st.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Technology Tags */}
            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="relative z-10 mb-6">
                <span className="text-xs text-gray-400 block mb-2 font-medium">تکنولوژی‌ها و ابزارهای مورد استفاده:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1 rounded-xl bg-white/[0.06] text-purple-200 border border-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="relative z-10 flex items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
              >
                بستن
              </button>

              <button
                type="button"
                onClick={() => {
                  const sId = getServiceIdForProject(selectedProject);
                  setSelectedProject(null);
                  if (onOpenOrderModal) onOpenOrderModal(sId);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>سفارش این پروژه اختصاصی</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
