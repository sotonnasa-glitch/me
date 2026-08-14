import React from 'react';
import {
  ExternalLink,
  Shield,
  Bell,
  Sparkles,
  LayoutDashboard,
  Eye,
  RefreshCw,
  Plus,
  Palette,
  Search,
  SlidersHorizontal,
  Menu,
  Moon,
  Sun,
  ArrowRight,
  Video
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

interface AdminNavbarProps {
  onSwitchToSite: () => void;
  onOpenQuickAddService: () => void;
  onOpenCustomizer: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onSwitchToSite,
  onOpenQuickAddService,
  onOpenCustomizer,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const { brandInfo, newOrdersCount, navigateToSection } = useSiteData();

  const handleReturnToVideoPage = () => {
    onSwitchToSite();
    setTimeout(() => {
      navigateToSection('blog');
    }, 150);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800 px-3 sm:px-6 flex items-center justify-between shadow-sm">
      
      {/* Left: Brand & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          title="منوی ناوبری"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight font-sans">
                {brandInfo.latinName}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/30 text-[10px] font-semibold text-purple-300">
                پنل مدیریت و کنترل
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 block -mt-0.5">
              متصل به وب‌سایت اصلی (همگام‌سازی زنده)
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Return to Video / Film Showcase Page Button */}
        <button
          type="button"
          onClick={handleReturnToVideoPage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold transition-all shadow-sm group"
          title="خروج از پنل ادمین و پرش مستقیم به بخش تماشای فیلم و ویدیوها"
        >
          <Video className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">🎬 بازگشت به صفحه فیلم و ویدیوها</span>
          <span className="sm:hidden">🎬 صفحه فیلم</span>
        </button>

        {/* Quick Add Service Button */}
        <button
          type="button"
          onClick={onOpenQuickAddService}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن خدمت</span>
        </button>

        {/* Customizer (Shadcn Theme & Layout) */}
        <button
          type="button"
          onClick={onOpenCustomizer}
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          title="سفارشی‌ساز رنگ و قالب (Customizer)"
        >
          <Palette className="w-4 h-4 text-purple-400" />
        </button>

        {/* Notifications / Pending Orders Indicator */}
        <div className="relative">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border ${
              newOrdersCount > 0
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
            title={`${newOrdersCount} سفارش جدید در گام اول`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="font-bold font-mono">{newOrdersCount}</span>
          </div>
        </div>

        {/* Universal Return / Back to Live Site Button */}
        <button
          type="button"
          onClick={onSwitchToSite}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all group"
        >
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>بازگشت به سایت</span>
        </button>

      </div>
    </header>
  );
};
