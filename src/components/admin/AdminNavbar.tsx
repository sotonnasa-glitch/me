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
    <header className="sticky top-0 z-30 min-h-[60px] sm:h-16 bg-[#09090b]/95 backdrop-blur-xl border-b border-zinc-800 px-2.5 sm:px-6 flex items-center justify-between shadow-sm gap-2">
      {/* Left: Brand & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white shrink-0 cursor-pointer"
          title="منوی ناوبری پنل ادمین"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight font-sans truncate">
                {brandInfo.latinName || 'Tekvix'}
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/30 text-[10px] font-semibold text-purple-300 shrink-0">
                پنل مدیریت
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 block -mt-0.5 truncate hidden sm:block">
              کنترل یکپارچه و آنی وب‌سایت
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Return to Video / Film Showcase Page Button (Visible on md+ or as icon on sm) */}
        <button
          type="button"
          onClick={handleReturnToVideoPage}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          title="مشاهده صفحه فیلم‌ها و ویدیوها در سایت"
        >
          <Video className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">صفحه فیلم‌ها</span>
        </button>

        {/* Customizer (Shadcn Theme & Layout) */}
        <button
          type="button"
          onClick={onOpenCustomizer}
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="سفارشی‌ساز قالب و رنگ (Customizer)"
        >
          <Palette className="w-4 h-4 text-purple-400" />
        </button>

        {/* Notifications / Pending Orders Indicator */}
        <div className="relative">
          <div
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium border ${
              newOrdersCount > 0
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
            title={`${newOrdersCount} سفارش جدید در انتظار`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="font-bold font-mono">{newOrdersCount}</span>
          </div>
        </div>

        {/* Universal Return / Back to Live Site Button */}
        <button
          type="button"
          onClick={onSwitchToSite}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer shrink-0 group"
          title="بازگشت به نمای اصلی وب‌سایت"
        >
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>بازگشت به سایت</span>
        </button>
      </div>
    </header>
  );
};
