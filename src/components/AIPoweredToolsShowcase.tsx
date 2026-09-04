import React, { useState } from 'react';
import { Sparkles, Cpu } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { AI_TOOLS_LIST } from '../data/aiToolsData';

export const AIPoweredToolsShowcase: React.FC = () => {
  const { brandInfo } = useSiteData();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredTools =
    activeFilter === 'all'
      ? AI_TOOLS_LIST
      : activeFilter === 'visual'
      ? AI_TOOLS_LIST.filter((t) => ['midjourney', 'flux-1', 'adobe-firefly', 'leonardo-ai', 'dall-e-3', 'stable-diffusion'].includes(t.id))
      : activeFilter === 'video'
      ? AI_TOOLS_LIST.filter((t) => ['runway-ml', 'sora-openai', 'kling-ai', 'pika-labs'].includes(t.id))
      : activeFilter === 'audio'
      ? AI_TOOLS_LIST.filter((t) => ['suno-ai', 'elevenlabs'].includes(t.id))
      : AI_TOOLS_LIST.filter((t) => ['chatgpt-openai', 'google-gemini', 'claude-anthropic', 'deepseek', 'meta-llama', 'perplexity-ai', 'n8n-automation', 'grok-xai'].includes(t.id));

  return (
    <div
      className="p-4 sm:p-7 lg:p-8 rounded-3xl bg-[#100828]/95 sm:bg-gradient-to-br sm:from-[#180e38]/95 sm:via-[#0f0928]/95 sm:to-[#080516] border border-purple-500/35 sm:border-purple-500/40 shadow-2xl relative overflow-hidden backdrop-blur-md sm:backdrop-blur-2xl text-white gpu-accelerated"
      dir="rtl"
    >
      {/* Subtle ambient light - optimized with low blur on mobile */}
      <div className="absolute -top-10 end-0 w-56 sm:w-80 h-56 sm:h-80 bg-purple-600/15 sm:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 start-0 w-56 sm:w-80 h-56 sm:h-80 bg-cyan-600/15 sm:bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Live AI Pulse & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-sm shrink-0">
              <Cpu className="w-4 h-4 text-purple-300 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base sm:text-xl font-black text-white leading-tight">
                قدرت‌گرفته از ۲۰ موتور هوش مصنوعی برتر دنیا
              </h3>
              <p className="text-xs text-purple-200/80 font-medium">
                تمامی ۲۰ ابزار جهانی به صورت یکپارچه در پروژه‌های تکویکس فعال هستند
              </p>
            </div>
          </div>
        </div>

        <div className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-400/40 text-purple-200 text-xs font-bold flex items-center gap-2 shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>نمایش کامل ۲۰ ابزار فعال (۲۰ از ۲۰)</span>
        </div>
      </div>

      {/* Filter Tabs with explicit counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 custom-scrollbar relative z-10 touch-pan-x overscroll-contain">
        {[
          { id: 'all', label: 'همه ابزارها', count: 20 },
          { id: 'visual', label: 'تصویر و گرافیک', count: 6 },
          { id: 'video', label: 'ویدیو و تیزر', count: 4 },
          { id: 'audio', label: 'صدا و موزیک', count: 2 },
          { id: 'code', label: 'متن و اتوماسیون', count: 8 },
        ].map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1.5 ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/50'
                : 'bg-white/[0.05] hover:bg-white/[0.09] text-gray-300 border border-white/5'
            }`}
          >
            <span>{filter.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'}`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid of ALL 20 AI Cards - Fully visible without internal scroll restriction */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 relative z-10">
        {filteredTools.map((tool) => {
          return (
            <div
              key={tool.id}
              style={{
                animationDuration: tool.duration,
                animationDelay: tool.delay,
              }}
              className={`${tool.animType} group relative p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer backdrop-blur-sm sm:backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] shadow-sm`}
            >
              {/* Card Top: Official Logo Image + Clean Unclipped Badge */}
              <div className="flex items-center justify-between gap-1.5">
                <div
                  style={{
                    backgroundColor: tool.colorScheme.iconBg,
                    borderColor: tool.colorScheme.iconBorder,
                  }}
                  className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 overflow-hidden p-2 relative"
                >
                  <img
                    src={tool.logoUrl}
                    alt={tool.name}
                    className="w-full h-full object-contain filter drop-shadow select-none transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="logo-fallback hidden w-full h-full items-center justify-center">
                    {tool.svgIcon}
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: tool.colorScheme.badgeBg,
                    borderColor: tool.colorScheme.badgeBorder,
                    color: tool.colorScheme.badgeText,
                  }}
                  className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-md border whitespace-nowrap shrink-0"
                >
                  {tool.categoryBadge}
                </span>
              </div>

              {/* Card Bottom: Official Tool Name & Persian Speciality */}
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs font-black text-white group-hover:text-purple-200 transition-colors truncate">
                  {tool.name}
                </h4>
                <p className="text-[10px] text-gray-400 group-hover:text-gray-200 transition-colors truncate">
                  {tool.categoryFa}
                </p>
              </div>

              {/* Ambient Glow Accent for Desktop Hover */}
              <div
                style={{ backgroundColor: tool.colorScheme.glowColor }}
                className="hidden sm:block absolute -top-4 -end-4 w-12 h-12 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              />
            </div>
          );
        })}
      </div>

      {/* Persian Descriptive Statement */}
      <div className="mt-3.5 sm:mt-4 p-3 sm:p-3.5 rounded-2xl bg-purple-950/50 border border-purple-500/30 relative z-10 flex items-center gap-2.5 sm:gap-3">
        <Sparkles className="w-4 h-4 text-purple-300 shrink-0 animate-pulse" />
        <p className="text-xs text-purple-100/90 leading-relaxed font-medium">
          ما از پیشرفته‌ترین ابزارهای هوش مصنوعی دنیا برای ساخت سایت، طراحی گرافیک، تولید ویدیو و ساخت موزیک استفاده می‌کنیم.
        </p>
      </div>

      {/* Telegram Direct Contact Line (Exact format preserved) */}
      <div className="mt-3 sm:mt-3.5 pt-3 sm:pt-3.5 border-t border-purple-500/20 text-center relative z-10">
        <p className="text-xs text-purple-200 flex items-center justify-center gap-1.5 flex-wrap">
          <span>ارتباط مستقیم با مدیریت فنی تکویکس:</span>
          <a
            href={`https://t.me/${brandInfo.telegramHandle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-bold text-cyan-300 hover:text-white transition-colors tracking-wide underline underline-offset-4 decoration-cyan-400/40 hover:decoration-white"
          >
            {brandInfo.telegramHandle}
          </a>
        </p>
      </div>
    </div>
  );
};
