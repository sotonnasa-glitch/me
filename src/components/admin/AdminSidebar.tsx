import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  Briefcase,
  MessageSquareHeart,
  HelpCircle,
  Settings,
  Database,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  X,
  Shield,
  Newspaper,
  BarChart3,
  Gift,
  Radio,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export type AdminTab =
  | 'overview'
  | 'opening_event'
  | 'orders'
  | 'services'
  | 'blog'
  | 'analytics'
  | 'portfolio'
  | 'testimonials'
  | 'social'
  | 'faqs'
  | 'settings'
  | 'backup';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onSwitchToSite?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  onSwitchToSite,
}) => {
  const {
    newOrdersCount,
    inProgressOrdersCount,
    services,
    orders,
    blogPosts,
    events,
    activeCampaign,
    openingEventState,
    navigateToSection,
  } = useSiteData();

  const handleReturnToVideoPage = () => {
    onCloseMobile();
    if (onSwitchToSite) {
      onSwitchToSite();
    }
    setTimeout(() => {
      navigateToSection('blog');
    }, 150);
  };

  const activeEventsCount = events.filter((e) => e.isActive).length;

  const menuItems = [
    {
      id: 'overview' as AdminTab,
      label: 'داشبورد و کنترل بخش‌ها',
      icon: LayoutDashboard,
      badge: null,
      colorClass: 'text-purple-400'
    },
    {
      id: 'opening_event' as AdminTab,
      label: 'ایونت‌ها و کمپین‌های اختصاصی',
      icon: Gift,
      badge: activeEventsCount > 0 ? `${activeEventsCount} فعال` : `${events.length}`,
      badgeHighlight: activeEventsCount > 0,
      colorClass: 'text-amber-400'
    },
    {
      id: 'orders' as AdminTab,
      label: 'سفارشات (گردش ۳ مرحله‌ای)',
      icon: Inbox,
      badge: newOrdersCount > 0 ? `${newOrdersCount} جدید` : `${orders.length}`,
      badgeHighlight: newOrdersCount > 0,
      colorClass: 'text-indigo-400'
    },
    {
      id: 'services' as AdminTab,
      label: 'مدیریت خدمات هوش مصنوعی',
      icon: Layers,
      badge: `${services.length} سرویس`,
      colorClass: 'text-violet-400'
    },
    {
      id: 'blog' as AdminTab,
      label: 'مدیریت بلاگ و ویدیوها (CMS)',
      icon: Newspaper,
      badge: `${blogPosts.length} مقاله`,
      colorClass: 'text-pink-400'
    },
    {
      id: 'analytics' as AdminTab,
      label: 'آمار و تحلیل‌های زنده (Live)',
      icon: BarChart3,
      badge: 'Live',
      badgeHighlight: false,
      colorClass: 'text-cyan-400'
    },
    {
      id: 'portfolio' as AdminTab,
      label: 'نمونه‌کارها و پروژه‌ها',
      icon: Briefcase,
      badge: null,
      colorClass: 'text-blue-400'
    },
    {
      id: 'testimonials' as AdminTab,
      label: 'نظرات و رضایت مشتریان',
      icon: MessageSquareHeart,
      badge: null,
      colorClass: 'text-rose-400'
    },
    {
      id: 'social' as AdminTab,
      label: 'شبکه‌های اجتماعی و کانال‌ها',
      icon: Radio,
      badge: null,
      colorClass: 'text-sky-400'
    },
    {
      id: 'faqs' as AdminTab,
      label: 'سوالات متداول (FAQ)',
      icon: HelpCircle,
      badge: null,
      colorClass: 'text-emerald-400'
    },
    {
      id: 'settings' as AdminTab,
      label: 'تنظیمات برند و هیرو',
      icon: Settings,
      badge: null,
      colorClass: 'text-amber-400'
    },
    {
      id: 'backup' as AdminTab,
      label: 'پشتیبان‌گیری و خروجی',
      icon: Database,
      badge: null,
      colorClass: 'text-zinc-400'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 start-0 z-50 w-72 bg-[#09090b] border-e border-zinc-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col gap-5 overflow-y-auto">
          
          {/* Admin Header Title */}
          <div className="pt-2 px-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                منوی مدیریت وب‌سایت
              </span>
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links (Shadcn style) */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-950/60 text-white font-bold border border-purple-500/40 shadow-sm shadow-purple-950/50'
                      : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                        item.badgeHighlight
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 space-y-3">
          {/* Direct Return to Live Website */}
          <button
            type="button"
            onClick={() => {
              onCloseMobile();
              if (onSwitchToSite) onSwitchToSite();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-between group shadow-md shadow-purple-600/20 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>مشاهده و بازگشت به وب‌سایت</span>
            </div>
            <span className="text-xs text-purple-200 group-hover:-translate-x-1 transition-transform">
              ←
            </span>
          </button>

          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs text-zinc-200 font-semibold mb-1">
              <span>وضعیت اتصال دیتابیس</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-medium font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              آمارها و سفارشات بلادرنگ با سرور و دیتابیس همگام هستند.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
