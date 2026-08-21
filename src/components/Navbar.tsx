import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Menu,
  X,
  ArrowLeft,
  Send,
  Bell,
  Video,
  User,
  Bot,
  PackageCheck,
  Search
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { CrystalCubeIcon } from './common/CrystalCubeIcon';

interface NavbarProps {
  onOpenOrderModal: (serviceId?: string) => void;
  onOpenAdmin: () => void;
  onOpenGoogleAuth?: () => void;
  onOpenOrderTracking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
  onOpenAdmin,
  onOpenGoogleAuth,
  onOpenOrderTracking,
}) => {
  const { brandInfo, currentUser, navigateToSection } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Secret 5-Tap Easter Egg state for Admin Access
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretLogoTap = (e: React.MouseEvent) => {
    e.preventDefault();
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      onOpenAdmin();
      return;
    }

    // Reset tap count after 2.5 seconds if 5 taps not completed
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2500);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'خدمات', href: '#services' },
    { label: '🎬 فیلم‌ها و مقالات', href: '#blog', isHighlight: true },
    { label: '💬 نظرات کاربران', href: '#reviews' },
    { label: 'محاسبه‌گر هزینه', href: '#features' },
    { label: 'نحوه کار', href: '#how-it-works' },
    { label: 'نمونه‌کارها', href: '#portfolio' },
    { label: 'درباره ما', href: '#about' },
    { label: 'سوالات متداول', href: '#faq' },
    { label: 'تماس', href: '#contact' },
  ];

  const handleVideoLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToSection('blog');
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05050d]/95 backdrop-blur-xl border-b border-purple-900/30 shadow-lg shadow-black/60 py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      {/* Optional Top Announcement Banner */}
      {brandInfo.showAnnouncement && brandInfo.announcementText && !isScrolled && (
        <div className="bg-gradient-to-r from-purple-950/90 via-purple-900/80 to-indigo-950/90 border-b border-purple-500/20 py-1.5 px-4 text-center text-xs text-purple-200 flex items-center justify-center gap-2 mb-2">
          <Bell className="w-3 h-3 text-purple-300 animate-pulse" />
          <span>{brandInfo.announcementText}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Right Corner (Start in RTL): Custom Purple Frame + Tekvix AI Logo (Secret 5-tap area) */}
        <div
          id="nav-brand-container"
          onClick={handleSecretLogoTap}
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none"
        >
          {/* Purple Bordered Square Frame with Embedded Reference 3D Crystal Asset */}
          <div
            id="nav-crystal-frame"
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#090517] border border-purple-500/50 hover:border-purple-400 p-0.5 flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.4)] hover:shadow-[0_0_24px_rgba(168,85,247,0.7)] transition-all group"
          >
            <CrystalCubeIcon size={36} className="transition-transform group-hover:scale-105" />
            <span className="absolute -top-1 -start-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <span className="absolute -top-1 -start-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>

          {/* Tekvix AI Brand Logo */}
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white font-sans flex items-center gap-1.5">
              <span>{brandInfo.latinName || 'Tekvix'}</span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300">
                AI
              </span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-400 hidden sm:inline-block">
              {brandInfo.tagline || 'پلتفرم خدمات هوش مصنوعی'}
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-1 xl:gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={link.href === '#blog' ? handleVideoLinkClick : undefined}
              className={`text-xs xl:text-sm px-3 py-1.5 rounded-full transition-all font-medium flex items-center gap-1 ${
                link.isHighlight
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 hover:bg-purple-600 hover:text-white font-bold shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons (Google Sign-In + Direct Telegram + Order CTA) */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
          {/* Google Sign-in / Profile Button */}
          {onOpenGoogleAuth && (
            <button
              type="button"
              onClick={onOpenGoogleAuth}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentUser
                  ? 'bg-zinc-900/90 border-purple-500/40 text-white hover:border-purple-400'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-zinc-200 hover:text-white'
              }`}
              title={currentUser ? `کاربر: ${currentUser.name}` : 'ورود با اکانت گوگل'}
            >
              {currentUser ? (
                <>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-lg object-cover"
                  />
                  <span className="max-w-[80px] truncate">{currentUser.name}</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>ورود با گوگل</span>
                </>
              )}
            </button>
          )}

          {/* Order Tracking Button */}
          {onOpenOrderTracking && (
            <button
              type="button"
              id="nav-order-tracking-btn"
              onClick={onOpenOrderTracking}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-200 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer shadow-sm"
              title="پیگیری سفارشات با کد رهگیری یا آیدی تلگرام"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>پیگیری سفارش</span>
            </button>
          )}

          {/* Direct Telegram Support Button */}
          <a
            href={brandInfo.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-telegram-link"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl border border-white/10 transition-all"
            title="پشتیبانی در تلگرام"
          >
            <Send className="w-3.5 h-3.5 rotate-180 text-purple-400" />
            <span className="font-mono">{brandInfo.telegramHandle}</span>
          </a>

          {/* Place Order CTA Button */}
          <button
            type="button"
            id="nav-place-order-btn"
            onClick={() => onOpenOrderModal()}
            className="relative group px-4 sm:px-5 py-2 rounded-xl font-medium text-xs sm:text-sm text-white overflow-hidden transition-all duration-300 focus:outline-none cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.4)] group-hover:shadow-[0_0_28px_rgba(147,51,234,0.7)]" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative flex items-center gap-1.5">
              <span>ثبت سفارش</span>
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex sm:hidden items-center gap-2">
          {onOpenGoogleAuth && (
            <button
              type="button"
              onClick={onOpenGoogleAuth}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300"
              title="پروفایل کاربری"
            >
              {currentUser ? (
                <img src={currentUser.avatar} alt="User" className="w-4 h-4 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-purple-400" />
              )}
            </button>
          )}

          {/* Order Button */}
          <button
            type="button"
            id="mobile-place-order-cta"
            onClick={() => onOpenOrderModal()}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-[0_0_14px_rgba(147,51,234,0.5)] active:scale-95 cursor-pointer"
          >
            سفارش
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-200 hover:text-white cursor-pointer"
            aria-label="منوی سایت"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden fixed inset-x-0 top-[60px] bg-[#070614]/95 backdrop-blur-2xl border-b border-purple-900/30 px-6 py-6 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.href === '#blog') {
                    handleVideoLinkClick(e);
                  }
                }}
                className={`text-sm py-2.5 px-3 rounded-xl transition-colors flex items-center justify-between ${
                  link.isHighlight
                    ? 'bg-purple-600/30 text-purple-200 font-bold border border-purple-500/30'
                    : 'text-gray-200 hover:text-purple-300 hover:bg-white/[0.04]'
                }`}
              >
                <span>{link.label}</span>
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {onOpenOrderTracking && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrderTracking();
                }}
                className="w-full py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/80 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span>پیگیری وضعیت سفارشات</span>
              </button>
            )}

            {onOpenGoogleAuth && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGoogleAuth();
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span>{currentUser ? `پروفایل: ${currentUser.name}` : 'ورود با حساب گوگل'}</span>
              </button>
            )}

            <button
              type="button"
              id="drawer-order-button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-center shadow-[0_0_20px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ثبت سفارش آنلاین</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
