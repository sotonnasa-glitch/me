import React, { useState } from 'react';
import { Sparkles, Eye, X } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { PortfolioItem } from '../types';

export const PortfolioSection: React.FC = () => {
  const { portfolio, brandInfo } = useSiteData();
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 bg-[#05050d] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 start-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>منتخب پروژه‌های {brandInfo.name || 'تکویکس'}</span>
          </div>

          <h2
            id="portfolio-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            نمونه‌کارها و دستاوردهای هوش مصنوعی
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            مروری بر پروژه‌های منتخب در حوزه‌های توسعه وب، تولید محتوای ویدیویی، تصویرسازی و رباتیک.
          </p>
        </div>

        {/* Dynamic Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              id={`portfolio-card-${item.id}`}
              className="rounded-2xl bg-[#090717] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg shadow-black/30 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]"
            >
              {/* Project Visual Cover Area with futuristic dark gradient and subtle UI element */}
              <div className={`h-48 w-full bg-gradient-to-br ${item.gradientTheme || 'from-purple-900/60 via-indigo-900/40 to-black'} p-5 flex flex-col justify-between relative overflow-hidden border-b border-white/5`}>
                
                {/* Ambient Grid overlay */}
                <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/60 border border-purple-400/30 text-purple-200 backdrop-blur-md">
                    {item.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(item)}
                    className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/80 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors"
                    aria-label="مشاهده جزئیات"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Cover Center Title */}
                <div className="relative z-10">
                  <span className="text-[11px] font-medium text-purple-300 tracking-wider block mb-1">
                    {item.serviceCategory}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-100 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Stats Row */}
                {item.stats && item.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    {item.stats.map((st, i) => (
                      <div key={i} className="text-center">
                        <span className="text-[11px] text-gray-400 block mb-0.5">{st.label}</span>
                        <span className="text-xs font-bold text-purple-300 font-sans">{st.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-gray-400 border border-white/5"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0e0c1f] border border-purple-500/40 p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 end-4 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-semibold text-purple-400 block mb-1">
              {selectedProject.serviceCategory}
            </span>
            <h3 className="text-xl font-bold text-white mb-3">
              {selectedProject.title}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            {selectedProject.stats && selectedProject.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-purple-950/30 border border-purple-500/20">
                {selectedProject.stats.map((st, i) => (
                  <div key={i}>
                    <div className="text-xs text-gray-400">{st.label}</div>
                    <div className="text-base font-bold text-white font-sans mt-1">{st.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
