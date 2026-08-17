import React, { useState } from 'react';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { DashboardView } from './views/DashboardView';
import { ServicesManager } from './views/ServicesManager';
import { OrdersManager } from './views/OrdersManager';
import { PortfolioManager } from './views/PortfolioManager';
import { TestimonialsManager } from './views/TestimonialsManager';
import { FAQManager } from './views/FAQManager';
import { SettingsManager } from './views/SettingsManager';
import { BackupManager } from './views/BackupManager';
import { BlogManager } from './views/BlogManager';
import { AnalyticsView } from './views/AnalyticsView';
import { OpeningEventManager } from './views/OpeningEventManager';
import { CustomizerDrawer, AdminThemePreset, AdminRadius, AdminMode } from './CustomizerDrawer';
import { Menu, Sparkles, Layers } from 'lucide-react';

interface AdminLayoutProps {
  onSwitchToSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onSwitchToSite }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuickAddServiceOpen, setIsQuickAddServiceOpen] = useState(false);
  
  // Customizer preferences
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AdminThemePreset>('tekvix-purple');
  const [currentRadius, setCurrentRadius] = useState<AdminRadius>('0.75');
  const [currentMode, setCurrentMode] = useState<AdminMode>('dark');

  const getThemeBg = () => {
    if (currentMode === 'light') return 'bg-zinc-50 text-zinc-900';
    switch (currentTheme) {
      case 'cosmic-dark':
        return 'bg-[#05030f] text-zinc-100';
      case 'cyberpunk-cyan':
        return 'bg-[#060b13] text-zinc-100';
      case 'emerald-ai':
        return 'bg-[#041009] text-zinc-100';
      case 'monochrome-zinc':
        return 'bg-[#09090b] text-zinc-100';
      default:
        return 'bg-[#09090b] text-zinc-100';
    }
  };

  const getRadiusClass = () => {
    switch (currentRadius) {
      case '0':
        return '[&_*]:!rounded-none';
      case '0.3':
        return '[&_.rounded-2xl]:!rounded-md [&_.rounded-xl]:!rounded-sm [&_.rounded-3xl]:!rounded-lg';
      case '0.5':
        return '[&_.rounded-2xl]:!rounded-lg [&_.rounded-xl]:!rounded-md';
      case '1.0':
        return '[&_.rounded-2xl]:!rounded-3xl [&_.rounded-xl]:!rounded-2xl';
      default:
        return '';
    }
  };

  const handleResetCustomizer = () => {
    setCurrentTheme('tekvix-purple');
    setCurrentRadius('0.75');
    setCurrentMode('dark');
  };

  return (
    <div
      className={`min-h-screen ${getThemeBg()} ${getRadiusClass()} flex flex-col font-sans selection:bg-purple-600 selection:text-white transition-colors duration-200 overflow-x-hidden`}
      dir="rtl"
    >
      {/* Top Navbar */}
      <AdminNavbar
        onSwitchToSite={onSwitchToSite}
        onOpenQuickAddService={() => {
          setActiveTab('services');
          setIsQuickAddServiceOpen(true);
        }}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Admin Area */}
      <div className="flex-1 flex relative">
        
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsQuickAddServiceOpen(false);
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onSwitchToSite={onSwitchToSite}
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative min-w-0 max-w-full">
          
          {/* Mobile Current Section Banner */}
          <div className="lg:hidden mb-4 flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-300 font-semibold">
                بخش فعال: {
                  activeTab === 'overview' ? 'داشبورد' :
                  activeTab === 'services' ? 'خدمات و محصولات' :
                  activeTab === 'orders' ? 'سفارشات' :
                  activeTab === 'portfolio' ? 'نمونه‌کارها' :
                  activeTab === 'testimonials' ? 'نظرات مشتریان' :
                  activeTab === 'faqs' ? 'سوالات متداول' :
                  activeTab === 'settings' ? 'تنظیمات برند' : 'پشتیبان‌گیری'
                }
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5 border border-purple-500/30 transition-colors"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>فهرست منو</span>
            </button>
          </div>

          {/* Render Active View */}
          {activeTab === 'overview' && (
            <DashboardView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddService={() => {
                setActiveTab('services');
                setIsQuickAddServiceOpen(true);
              }}
              onOpenCustomizer={() => setIsCustomizerOpen(true)}
            />
          )}

          {activeTab === 'opening_event' && <OpeningEventManager />}

          {activeTab === 'services' && (
            <ServicesManager
              isOpenAddModalDirectly={isQuickAddServiceOpen}
              onCloseDirectModal={() => setIsQuickAddServiceOpen(false)}
            />
          )}

          {activeTab === 'orders' && <OrdersManager />}

          {activeTab === 'blog' && <BlogManager />}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'portfolio' && <PortfolioManager />}

          {activeTab === 'testimonials' && <TestimonialsManager />}

          {activeTab === 'faqs' && <FAQManager />}

          {activeTab === 'settings' && <SettingsManager />}

          {activeTab === 'backup' && <BackupManager />}

        </main>
      </div>

      {/* Customizer Drawer */}
      <CustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        currentRadius={currentRadius}
        onSelectRadius={setCurrentRadius}
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onReset={handleResetCustomizer}
      />

    </div>
  );
};
