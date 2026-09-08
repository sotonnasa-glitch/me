import React, { lazy, Suspense, useState, useEffect } from 'react';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OpeningEventBanner } from './components/OpeningEventBanner';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorks } from './components/HowItWorks';
import { PortfolioSection } from './components/PortfolioSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { BlogSection } from './components/BlogSection';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { SocialMediaSection } from './components/SocialMediaSection';
import { CTASection } from './components/CTASection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GlobalBackgroundStars } from './components/GlobalBackgroundStars';
import { ArrowUp, Video } from 'lucide-react';

const OrderModal = lazy(() => import('./components/OrderModal').then((module) => ({ default: module.OrderModal })));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal').then((module) => ({ default: module.OrderTrackingModal })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((module) => ({ default: module.AdminLayout })));
const AdminAuthModal = lazy(() => import('./components/admin/AdminAuthModal').then((module) => ({ default: module.AdminAuthModal })));
const GoogleAuthModal = lazy(() => import('./components/common/GoogleAuthModal').then((module) => ({ default: module.GoogleAuthModal })));

import { TekvixAiAssistant } from './components/common/TekvixAiAssistant';
import { UniversalBackButton } from './components/common/UniversalBackButton';

function MainWebsite() {
  const {
    sectionsConfig,
    newOrdersCount,
    currentUser,
    navigateToSection,
    isAdminAuthenticated
  } = useSiteData();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingInitialQuery, setTrackingInitialQuery] = useState('');
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<string | undefined>(undefined);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleOpenOrderTracking = (query?: string) => {
    setTrackingInitialQuery(query || '');
    setIsOrderTrackingOpen(true);
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 300;
          setShowScrollTop((prev) => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleOpenOrderModal = (serviceId?: string) => {
    setSelectedServiceForOrder(serviceId);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  const isEnabled = (key: string) => {
    const normalized = key.toLowerCase().replace(/[-_]/g, '');
    const section = sectionsConfig.find(
      (s) =>
        s.key === key ||
        s.id === key ||
        (s.key && s.key.toLowerCase().replace(/[-_]/g, '') === normalized) ||
        (s.id && s.id.toLowerCase().replace(/[-_]/g, '') === normalized)
    );
    return section ? section.enabled : true;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminOpen) {
    return (
      <Suspense fallback={null}>
        <AdminLayout onSwitchToSite={() => setIsAdminOpen(false)} />
      </Suspense>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#05050d] text-gray-200 selection:bg-purple-600 selection:text-white font-sans antialiased overflow-x-hidden relative"
      dir="rtl"
    >
      <GlobalBackgroundStars />

      <div className="pointer-events-none fixed inset-0 overflow-hidden z-[2]" aria-hidden="true">
        <span className="page-meteor page-meteor-1" />
        <span className="page-meteor page-meteor-2" />
        <span className="page-meteor page-meteor-3" />
        <span className="page-meteor page-meteor-4" />
        <span className="page-meteor page-meteor-5" />
        <span className="page-meteor page-meteor-6" />
      </div>

      {/* Multiple unique spacecraft drifting through the full landing page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-[3]" aria-hidden="true">
        <span className="page-ship page-ship-1 ship-disc" />
        <span className="page-ship page-ship-2 ship-shuttle" />
        <span className="page-ship page-ship-3 ship-fighter" />
        <span className="page-ship page-ship-4 ship-rocket" />
        <span className="page-ship page-ship-5 ship-scout" />
        <span className="page-ship page-ship-6 ship-capsule" />
      </div>

      <Navbar
        onOpenOrderModal={handleOpenOrderModal}
        onOpenAdmin={handleOpenAdmin}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        onOpenOrderTracking={handleOpenOrderTracking}
      />

      <main>
        {isEnabled('hero') && (
          <Hero
            onOpenOrderModal={() => handleOpenOrderModal()}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        <OpeningEventBanner onOpenOrderModal={handleOpenOrderModal} />

        {isEnabled('services') && (
          <ServicesSection onSelectServiceForQuote={(serviceId) => handleOpenOrderModal(serviceId)} />
        )}

        {isEnabled('how_it_works') && <HowItWorks onOpenOrderModal={() => handleOpenOrderModal()} />}

        {isEnabled('portfolio') && (
          <PortfolioSection onOpenOrderModal={(serviceId) => handleOpenOrderModal(serviceId)} />
        )}

        {isEnabled('blog') && (
          <BlogSection
            onOpenOrderModal={handleOpenOrderModal}
            onOpenAuthModal={() => setIsGoogleAuthOpen(true)}
          />
        )}

        <CustomerReviewsSection onOpenAuthModal={() => setIsGoogleAuthOpen(true)} />

        {isEnabled('testimonials') && <TestimonialsSection />}

        {isEnabled('about') && <AboutSection />}

        <SocialMediaSection />

        {isEnabled('faq') && <FAQSection />}

        {isEnabled('cta') && <CTASection onOpenOrderModal={() => handleOpenOrderModal()} />}

        {isEnabled('contact') && <ContactSection />}
      </main>

      <div className="fixed bottom-6 end-6 z-30 flex items-center gap-2.5 animate-in fade-in duration-300 pb-[env(safe-area-inset-bottom)] sm:pb-0 max-sm:bottom-4 max-sm:end-4">
        <button
          type="button"
          id="floating-video-jump-btn"
          onClick={() => navigateToSection('blog')}
          className="min-w-[44px] min-h-[44px] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-500/40 shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
          title="پرش به بخش فیلم و ویدیوها"
          aria-label="پرش به بخش فیلم و ویدیوها"
        >
          <Video className="w-4 h-4 text-purple-300 animate-pulse" />
          <span className="text-xs font-bold hidden sm:inline">فیلم‌ها</span>
        </button>

        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="min-w-[44px] min-h-[44px] p-2.5 sm:p-3 rounded-2xl bg-[#09090b]/90 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none cursor-pointer touch-manipulation"
            title="بازگشت به بالای صفحه"
            aria-label="بازگشت به بالای صفحه"
          >
            <ArrowUp className="w-4 h-4 text-purple-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>

      <TekvixAiAssistant onOpenOrderModal={handleOpenOrderModal} />

      <Footer
        onOpenAdmin={handleOpenAdmin}
        onOpenOrderTracking={handleOpenOrderTracking}
      />

      <Suspense fallback={null}>
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={handleCloseOrderModal}
          initialServiceId={selectedServiceForOrder}
          onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
          onOpenOrderTracking={(orderId) => {
            setIsOrderModalOpen(false);
            handleOpenOrderTracking(orderId);
          }}
        />

        <OrderTrackingModal
          isOpen={isOrderTrackingOpen}
          onClose={() => setIsOrderTrackingOpen(false)}
          onOpenOrderModal={() => handleOpenOrderModal()}
          initialQuery={trackingInitialQuery}
        />

        <AdminAuthModal
          isOpen={isAdminAuthOpen}
          onSuccess={() => {
            setIsAdminAuthOpen(false);
            setIsAdminOpen(true);
          }}
          onCancel={() => setIsAdminAuthOpen(false)}
        />

        <GoogleAuthModal
          isOpen={isGoogleAuthOpen}
          onClose={() => setIsGoogleAuthOpen(false)}
          onOpenOrderModal={() => handleOpenOrderModal()}
          onOpenOrderTracking={handleOpenOrderTracking}
        />
      </Suspense>

      <style>{`
        .page-meteor {
          position: absolute;
          width: 110px;
          height: 1.5px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.95), rgba(103,232,249,.72), transparent);
          filter: drop-shadow(0 0 6px rgba(103,232,249,.7));
          opacity: 0;
          transform: rotate(28deg) translate3d(0,0,0) scaleX(.55);
          animation: page-meteor-fly 12s linear infinite;
          will-change: transform, opacity;
          contain: paint;
        }

        .page-meteor-1 { top: 9%; left: -10%; animation-delay: 0s; }
        .page-meteor-2 { top: 24%; left: 48%; width: 85px; transform: rotate(24deg) translate3d(0,0,0) scaleX(.5); animation-delay: 4s; }
        .page-meteor-3 { top: 39%; left: 12%; width: 125px; transform: rotate(30deg) translate3d(0,0,0) scaleX(.45); animation-delay: 8s; }
        .page-meteor-4 { top: 55%; left: 67%; width: 75px; transform: rotate(25deg) translate3d(0,0,0) scaleX(.5); animation-delay: 2s; animation-duration: 14s; }
        .page-meteor-5 { top: 72%; left: 30%; width: 100px; transform: rotate(29deg) translate3d(0,0,0) scaleX(.5); animation-delay: 7s; animation-duration: 13s; }
        .page-meteor-6 { top: 88%; left: 78%; width: 70px; transform: rotate(27deg) translate3d(0,0,0) scaleX(.45); animation-delay: 10s; animation-duration: 15s; }

        @keyframes page-meteor-fly {
          0%, 72% {
            opacity: 0;
            transform: translate3d(0,0,0) rotate(28deg) scaleX(.45);
          }
          76% { opacity: .95; }
          88% {
            opacity: .72;
            transform: translate3d(300px,210px,0) rotate(28deg) scaleX(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(500px,350px,0) rotate(28deg) scaleX(1.15);
          }
        }

        .page-ship {
          position: absolute;
          display: block;
          opacity: 0;
          transform-origin: center;
          will-change: transform, opacity;
          filter: drop-shadow(0 0 10px rgba(103,232,249,.45));
          animation: page-ship-drift 22s linear infinite;
          contain: paint;
        }

        .page-ship::before,
        .page-ship::after {
          content: '';
          position: absolute;
          pointer-events: none;
        }

        /* 01 — Flying saucer */
        .ship-disc {
          width: 78px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(180deg, rgba(226,232,240,.9), rgba(71,85,105,.9));
          border: 1px solid rgba(165,243,252,.8);
          box-shadow: inset 0 -8px 12px rgba(14,165,233,.35), 0 0 14px rgba(34,211,238,.4);
        }
        .ship-disc::before {
          left: 19px;
          top: -11px;
          width: 40px;
          height: 18px;
          border-radius: 50% 50% 40% 40%;
          background: linear-gradient(180deg, rgba(192,132,252,.9), rgba(8,47,73,.8));
          border: 1px solid rgba(216,180,254,.8);
        }
        .ship-disc::after {
          left: 14px;
          right: 14px;
          bottom: -8px;
          height: 8px;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,.8), transparent);
          filter: blur(2px);
        }

        /* 02 — Deep-space shuttle */
        .ship-shuttle {
          width: 30px;
          height: 88px;
          border-radius: 48% 48% 28% 28%;
          background: linear-gradient(90deg, rgba(71,85,105,.95), rgba(226,232,240,.95) 48%, rgba(71,85,105,.95));
          border: 1px solid rgba(165,243,252,.8);
        }
        .ship-shuttle::before {
          left: -17px;
          top: 30px;
          width: 64px;
          height: 22px;
          background: linear-gradient(180deg, rgba(34,211,238,.35), rgba(30,41,59,.95));
          clip-path: polygon(0 0, 100% 35%, 83% 100%, 17% 100%);
          border: 1px solid rgba(103,232,249,.55);
        }
        .ship-shuttle::after {
          left: 9px;
          bottom: -24px;
          width: 12px;
          height: 26px;
          background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(34,211,238,.9), transparent);
          clip-path: polygon(30% 0, 70% 0, 100% 70%, 50% 100%, 0 70%);
        }

        /* 03 — Angular fighter */
        .ship-fighter {
          width: 84px;
          height: 34px;
          background: linear-gradient(180deg, rgba(148,163,184,.95), rgba(30,41,59,.98));
          clip-path: polygon(0 50%, 22% 30%, 44% 0, 63% 29%, 100% 42%, 100% 58%, 63% 71%, 44% 100%, 22% 70%);
          border: 1px solid rgba(216,180,254,.7);
        }
        .ship-fighter::before {
          left: 34px;
          top: 10px;
          width: 18px;
          height: 14px;
          border-radius: 45% 45% 60% 60%;
          background: linear-gradient(180deg, rgba(103,232,249,.95), rgba(59,130,246,.35));
          box-shadow: 0 0 12px rgba(34,211,238,.6);
        }
        .ship-fighter::after {
          left: -24px;
          top: 13px;
          width: 30px;
          height: 8px;
          background: linear-gradient(90deg, transparent, rgba(244,114,182,.85));
          filter: blur(3px);
        }

        /* 04 — Long-range rocket */
        .ship-rocket {
          width: 28px;
          height: 92px;
          border-radius: 55% 55% 18% 18%;
          background: linear-gradient(90deg, rgba(51,65,85,.95), rgba(248,250,252,.98), rgba(71,85,105,.95));
          border: 1px solid rgba(255,255,255,.75);
        }
        .ship-rocket::before {
          top: 11px;
          left: 5px;
          width: 18px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 35%, #67e8f9 0 18%, rgba(59,130,246,.65) 35%, rgba(15,23,42,.95) 70%);
          border: 1px solid rgba(165,243,252,.8);
        }
        .ship-rocket::after {
          left: 4px;
          bottom: -31px;
          width: 20px;
          height: 34px;
          background: linear-gradient(180deg, rgba(253,224,71,.95), rgba(244,114,182,.65), transparent);
          clip-path: polygon(32% 0, 68% 0, 100% 68%, 50% 100%, 0 68%);
          filter: blur(.3px);
        }

        /* 05 — Scout craft */
        .ship-scout {
          width: 66px;
          height: 22px;
          border-radius: 45% 45% 18% 18%;
          background: linear-gradient(180deg, rgba(34,211,238,.35), rgba(17,24,39,.98));
          border: 1px solid rgba(103,232,249,.85);
          box-shadow: inset 0 0 0 1px rgba(148,163,184,.25), 0 0 14px rgba(34,211,238,.35);
        }
        .ship-scout::before {
          left: -13px;
          top: 4px;
          width: 92px;
          height: 13px;
          border-radius: 50%;
          border: 1px solid rgba(192,132,252,.55);
          transform: rotate(-8deg);
        }
        .ship-scout::after {
          left: 29px;
          top: -16px;
          width: 8px;
          height: 20px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(216,180,254,.85), rgba(103,232,249,.6));
          box-shadow: 0 0 8px rgba(192,132,252,.6);
        }

        /* 06 — Compact exploration capsule */
        .ship-capsule {
          width: 38px;
          height: 64px;
          border-radius: 52% 52% 42% 42%;
          background: linear-gradient(90deg, rgba(71,85,105,.95), rgba(241,245,249,.98), rgba(71,85,105,.95));
          border: 1px solid rgba(165,243,252,.7);
        }
        .ship-capsule::before {
          left: 7px;
          top: 12px;
          width: 22px;
          height: 25px;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 35%, rgba(34,211,238,.95), rgba(30,64,175,.55) 45%, rgba(15,23,42,.95) 75%);
          border: 1px solid rgba(103,232,249,.65);
        }
        .ship-capsule::after {
          left: 4px;
          right: 4px;
          bottom: -13px;
          height: 14px;
          background: linear-gradient(180deg, rgba(103,232,249,.65), transparent);
          filter: blur(2px);
        }

        .page-ship-1 { top: 12%; left: -12%; animation-delay: 1s; animation-duration: 28s; transform: scale(.9) rotate(-7deg); }
        .page-ship-2 { top: 27%; right: -12%; animation-delay: 6s; animation-duration: 31s; transform: scale(.72) rotate(18deg); }
        .page-ship-3 { top: 43%; left: -16%; animation-delay: 12s; animation-duration: 26s; transform: scale(.6) rotate(-4deg); }
        .page-ship-4 { top: 59%; right: -11%; animation-delay: 4s; animation-duration: 34s; transform: scale(.66) rotate(12deg); }
        .page-ship-5 { top: 75%; left: -10%; animation-delay: 15s; animation-duration: 29s; transform: scale(.78) rotate(5deg); }
        .page-ship-6 { top: 89%; right: -10%; animation-delay: 9s; animation-duration: 32s; transform: scale(.64) rotate(-12deg); }

        @keyframes page-ship-drift {
          0% { opacity: 0; transform: translate3d(0, 0, 0) rotate(var(--ship-rotation, 0deg)) scale(.72); }
          7% { opacity: .78; }
          48% { opacity: .9; }
          88% { opacity: .7; }
          100% { opacity: 0; transform: translate3d(calc(100vw + 300px), 100px, 0) rotate(var(--ship-rotation, 0deg)) scale(.9); }
        }

        .page-ship-1 { --ship-rotation: -7deg; }
        .page-ship-2 { --ship-rotation: 18deg; }
        .page-ship-3 { --ship-rotation: -4deg; }
        .page-ship-4 { --ship-rotation: 12deg; }
        .page-ship-5 { --ship-rotation: 5deg; }
        .page-ship-6 { --ship-rotation: -12deg; }

        @media (prefers-reduced-motion: reduce) {
          .page-meteor { animation: none; opacity: 0; }
          .page-ship { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <MainWebsite />
    </SiteDataProvider>
  );
}
