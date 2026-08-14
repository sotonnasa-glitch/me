import React, { useState } from 'react';
import {
  Globe,
  Palette,
  Clapperboard,
  Music,
  Mic,
  PenTool,
  Smartphone,
  Bot,
  Target,
  Image as ImageIcon,
  Cpu,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Filter,
  Star
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { Service } from '../types';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const { services, brandInfo } = useSiteData();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'همه خدمات' },
    { id: 'web', label: 'توسعه وب' },
    { id: 'media', label: 'تصویر و ویدیو' },
    { id: 'content', label: 'محتوا و سوشال' },
    { id: 'bot', label: 'ربات تلگرام' },
    { id: 'custom', label: 'سفارشی و AI' },
  ];

  // Only show active services (or if active is not explicitly false)
  const activeServicesList = services.filter((s) => s.active !== false);

  const filteredServices = selectedFilter === 'all'
    ? activeServicesList
    : activeServicesList.filter(service => {
        if (selectedFilter === 'media') return service.category === 'media';
        if (selectedFilter === 'content') return service.category === 'content';
        if (selectedFilter === 'web') return service.category === 'web';
        if (selectedFilter === 'bot') return service.category === 'bot';
        if (selectedFilter === 'custom') return service.category === 'custom';
        return true;
      });

  const renderServiceIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 text-purple-300 group-hover:text-white transition-colors";
    switch (iconName) {
      case 'Globe': return <Globe className={iconClass} />;
      case 'Palette': return <Palette className={iconClass} />;
      case 'Clapperboard': return <Clapperboard className={iconClass} />;
      case 'Music': return <Music className={iconClass} />;
      case 'Mic': return <Mic className={iconClass} />;
      case 'PenTool': return <PenTool className={iconClass} />;
      case 'Smartphone': return <Smartphone className={iconClass} />;
      case 'Bot': return <Bot className={iconClass} />;
      case 'Target': return <Target className={iconClass} />;
      case 'Image': return <ImageIcon className={iconClass} />;
      case 'Cpu': return <Cpu className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-[#05050d] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 end-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 start-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>دسته‌بندی جامع سرویس‌ها ({activeServicesList.length} خدمت فعال)</span>
          </div>

          <h2
            id="services-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            خدمات هوش مصنوعی {brandInfo.name || 'تکویکس'}
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            ایده‌های خود را با ابزارهای نوین هوش مصنوعی به خروجی‌های حرفه‌ای و سطح یک تبدیل کنید.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none ${
                selectedFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                  : 'bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: Service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-black/20 relative overflow-hidden ${
                service.popular
                  ? 'bg-gradient-to-b from-purple-950/25 via-[#0e0a24]/90 to-[#090618] border-purple-500/40 shadow-[0_0_35px_rgba(147,51,234,0.18)]'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-purple-500/40 hover:bg-purple-950/15'
              }`}
            >
              {/* Subtle top gradient accent */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:scale-105 group-hover:border-purple-400 transition-all">
                    {renderServiceIcon(service.iconName)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {service.popular && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-300" />
                        محبوب
                      </span>
                    )}
                    {service.badge && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-950 border border-purple-600/40 text-purple-300">
                        {service.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                  {service.shortDescription}
                </p>

                {/* Deliverables List */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="space-y-2 mb-6 pt-4 border-t border-white/[0.06]">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action: Get Quote button */}
              <button
                type="button"
                id={`btn-quote-${service.id}`}
                onClick={() => onSelectServiceForQuote(service.id)}
                className="w-full py-3 px-4 rounded-xl bg-white/[0.04] group-hover:bg-purple-600 border border-white/10 group-hover:border-purple-500 text-gray-200 group-hover:text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] focus:outline-none"
              >
                <span>دریافت مشاوره و پیش‌فاکتور</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom helper note */}
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-purple-950/30 border border-purple-900/30 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-start">
            <h4 className="text-white font-semibold text-sm sm:text-base">خدمت خاصی مد نظرتان است که در لیست نیست؟</h4>
            <p className="text-xs text-gray-400 mt-1">تیم {brandInfo.name || 'تکویکس'} آماده پیاده‌سازی هرگونه سناریوی اختصاصی هوش مصنوعی است.</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectServiceForQuote('custom-ai')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold whitespace-nowrap shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all"
          >
            مشاوره پروژه سفارشی
          </button>
        </div>

      </div>
    </section>
  );
};
