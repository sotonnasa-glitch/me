import React, { useState } from 'react';
import {
  LayoutDashboard,
  MousePointerClick,
  Sparkles,
  Zap,
  Cpu,
  MessageSquare,
  Wrench,
  TrendingUp,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  Layers,
  FolderGit2
} from 'lucide-react';
import { INTERACTIVE_FEATURE_TABS, FEATURES_STRENGTHS } from '../data/mockData';

export const InteractiveFeatures: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>(INTERACTIVE_FEATURE_TABS[0].id);

  const activeTab =
    INTERACTIVE_FEATURE_TABS.find((t) => t.id === activeTabId) ||
    INTERACTIVE_FEATURE_TABS[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-5 h-5" />;
      case 'MousePointerClick':
        return <MousePointerClick className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-[#05050d] overflow-hidden border-t border-purple-900/20">
      {/* Background glow */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading matching Screenshot 2 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>قدرت و تمایز پلتفرم تکویکس</span>
          </div>

          <h2
            id="features-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            ارتقای چشمگیر پروژه‌ها با قدرت AI
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            از استارتاپ‌های نوپا تا کسب‌وکارهای بزرگ، ابزارهای هوش مصنوعی تکویکس مسیر خلق محصول و اجرای ایده‌های دیجیتال را دگرگون می‌کنند.
          </p>
        </div>

        {/* Interactive Feature Tabs + Mock Dashboard Container (Screenshot 2 Replication) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
          
          {/* Feature Selector Buttons (Left on LTR, Right on RTL) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {INTERACTIVE_FEATURE_TABS.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  id={`feature-tab-${tab.id}`}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`w-full text-start p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group relative overflow-hidden focus:outline-none ${
                    isActive
                      ? 'bg-purple-950/40 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                      : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/20'
                  }`}
                >
                  {/* Subtle active border indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
                  )}

                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                          : 'bg-white/[0.05] text-gray-400 border border-white/10 group-hover:text-white'
                      }`}
                    >
                      {getIcon(tab.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-base sm:text-lg ${isActive ? 'text-white' : 'text-gray-200'}`}>
                          {tab.title}
                        </h3>
                        {tab.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.6)]">
                            {tab.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-1">
                        {tab.description}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'text-purple-400 rotate-45' : 'text-gray-600 group-hover:text-gray-400'
                    }`}
                  />
                </button>
              );
            })}

            {/* Quick Telegram Support Prompt */}
            <div className="mt-4 p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>پشتیبانی و مشاوره ۲۴ ساعته آنلاین است</span>
              </span>
              <a
                href="https://t.me/arnirhq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-medium hover:underline"
              >
                ارتباط سریع ←
              </a>
            </div>
          </div>

          {/* Live Mock Interactive Dashboard Window (Screenshot 2) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0a0818]/90 border border-purple-500/25 p-4 sm:p-6 shadow-[0_0_50px_rgba(126,34,206,0.15)] backdrop-blur-xl relative">
            
            {/* Window Top Bar (Red, Yellow, Green controls) */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-xs font-mono text-gray-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/5">
                {activeTab.dashboardSubtitle}
              </div>
              <div className="text-xs text-purple-400 flex items-center gap-1 font-medium">
                <Activity className="w-3.5 h-3.5" />
                <span>سیستم فعال</span>
              </div>
            </div>

            {/* Dashboard Inner Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Mini Sidebar */}
              <div className="hidden md:flex md:col-span-4 flex-col gap-1 text-xs text-gray-400 border-e border-white/5 pe-3">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  بخش‌های پلتفرم
                </div>
                <div className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 font-medium flex items-center gap-2 border border-purple-500/20">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{activeTab.title}</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>پایپ‌لاین خروجی‌ها</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>تنظیمات پرامپت</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>مدیریت دارایی‌ها</span>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-8 flex flex-col gap-4">
                
                {/* Metric Card */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">
                      شاخص بازدهی و عملکرد (Visibility / Performance)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold font-sans text-white">
                        {activeTab.visibilityMetric}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {activeTab.visibilityGrowth}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                {/* SVG Visual Graph Line (Screenshot 2 chart) */}
                <div className="h-28 sm:h-32 w-full rounded-xl bg-black/40 border border-white/5 p-3 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <span>روند صعودی بهینه‌سازی</span>
                    <span className="text-purple-400">زنده: ۱۰۰٪ هماهنگ</span>
                  </div>

                  <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 60">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M 0 50 L 40 40 L 80 45 L 120 30 L 160 35 L 200 20 L 240 15 L 300 8 L 300 60 L 0 60 Z"
                      fill="url(#chartGradient)"
                    />
                    {/* Glowing Stroke line */}
                    <path
                      d="M 0 50 L 40 40 L 80 45 L 120 30 L 160 35 L 200 20 L 240 15 L 300 8"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Highlight node */}
                    <circle cx="240" cy="15" r="4" fill="#ffffff" stroke="#9333ea" strokeWidth="2" />
                  </svg>

                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>مرحله اول</span>
                    <span>پردازش AI</span>
                    <span>خروجی نهایی</span>
                  </div>
                </div>

                {/* Live Process Items */}
                <div className="space-y-2">
                  <div className="text-[11px] font-medium text-gray-400">
                    وضعیت پروژه‌ها و ماژول‌ها:
                  </div>
                  {activeTab.activeItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-gray-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{item.status}</span>
                        <span className="font-mono text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-950/60">
                          {item.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 5 Core Strengths of Tekvix */}
        <div className="mt-12">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              چرا آژانس‌ها و استارتاپ‌ها تکویکس را انتخاب می‌کنند؟
            </h3>
            <p className="text-sm text-gray-400">
              ۵ رکن اصلی کیفیت، سرعت و تمایز در ارائه خدمات نوین
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FEATURES_STRENGTHS.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 hover:bg-purple-950/10 transition-all duration-300 flex flex-col items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(feat.icon)}
                </div>
                <h4 className="font-semibold text-white text-sm sm:text-base">
                  {feat.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
