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
  const { sectionsConfig, newOrdersCount, currentUser, navigateToSection, isAdminAuthenticated } = useSiteData();
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
    if (isAdminAuthenticated) setIsAdminOpen(true);
    else setIsAdminAuthOpen(true);
  };

  const handleOpenOrderModal = (serviceId?: string) => {
    setSelectedServiceForOrder(serviceId);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => setIsOrderModalOpen(false);

  const isEnabled = (key: string) => {
    const normalized = key.toLowerCase().replace(/[-_]/g, '');
    const section = sectionsConfig.find((s) =>
      s.key === key || s.id === key ||
      (s.key && s.key.toLowerCase().replace(/[-_]/g, '') === normalized) ||
      (s.id && s.id.toLowerCase().replace(/[-_]/g, '') === normalized)
    );
    return section ? section.enabled : true;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (isAdminOpen) {
    return <Suspense fallback={null}><AdminLayout onSwitchToSite={() => setIsAdminOpen(false)} /></Suspense>;
  }

  return (
    <div className="min-h-screen bg-[#05050d] text-gray-200 selection:bg-purple-600 selection:text-white font-sans antialiased overflow-x-hidden relative" dir="rtl">
      <GlobalBackgroundStars />

      <div className="pointer-events-none fixed inset-0 overflow-hidden z-[2]" aria-hidden="true">
        <span className="page-meteor page-meteor-1" />
        <span className="page-meteor page-meteor-2" />
        <span className="page-meteor page-meteor-3" />
        <span className="page-meteor page-meteor-4" />
        <span className="page-meteor page-meteor-5" />
        <span className="page-meteor page-meteor-6" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-screen overflow-hidden z-[3]" aria-hidden="true">
        <span className="page-ship page-ship-1 ship-disc" />
        <span className="page-ship page-ship-2 ship-shuttle" />
        <span className="page-ship page-ship-3 ship-fighter" />
        <span className="page-ship page-ship-4 ship-rocket" />
        <span className="page-ship page-ship-5 ship-scout" />
        <span className="page-ship page-ship-6 ship-capsule" />
      </div>

      <Navbar onOpenOrderModal={handleOpenOrderModal} onOpenAdmin={handleOpenAdmin} onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)} onOpenOrderTracking={handleOpenOrderTracking} />

      <main>
        {isEnabled('hero') && <Hero onOpenOrderModal={() => handleOpenOrderModal()} onOpenAdmin={handleOpenAdmin} />}
        <OpeningEventBanner onOpenOrderModal={handleOpenOrderModal} />
        {isEnabled('services') && <ServicesSection onSelectServiceForQuote={(serviceId) => handleOpenOrderModal(serviceId)} />}
        {isEnabled('how_it_works') && <HowItWorks onOpenOrderModal={() => handleOpenOrderModal()} />}
        {isEnabled('portfolio') && <PortfolioSection onOpenOrderModal={(serviceId) => handleOpenOrderModal(serviceId)} />}
        {isEnabled('blog') && <BlogSection onOpenOrderModal={handleOpenOrderModal} onOpenAuthModal={() => setIsGoogleAuthOpen(true)} />}
        <CustomerReviewsSection onOpenAuthModal={() => setIsGoogleAuthOpen(true)} />
        {isEnabled('testimonials') && <TestimonialsSection />}
        {isEnabled('about') && <AboutSection />}
        <SocialMediaSection />
        {isEnabled('faq') && <FAQSection />}
        {isEnabled('cta') && <CTASection onOpenOrderModal={() => handleOpenOrderModal()} />}
        {isEnabled('contact') && <ContactSection />}
      </main>

      <div className="fixed bottom-6 end-6 z-30 flex items-center gap-2.5 animate-in fade-in duration-300 pb-[env(safe-area-inset-bottom)] sm:pb-0 max-sm:bottom-4 max-sm:end-4">
        <button type="button" id="floating-video-jump-btn" onClick={() => navigateToSection('blog')} className="min-w-[44px] min-h-[44px] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-500/40 shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation" title="پرش به بخش فیلم و ویدیوها" aria-label="پرش به بخش فیلم و ویدیوها">
          <Video className="w-4 h-4 text-purple-300 animate-pulse" /><span className="text-xs font-bold hidden sm:inline">فیلم‌ها</span>
        </button>
        {showScrollTop && <button type="button" onClick={scrollToTop} className="min-w-[44px] min-h-[44px] p-2.5 sm:p-3 rounded-2xl bg-[#09090b]/90 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none cursor-pointer touch-manipulation" title="بازگشت به بالای صفحه" aria-label="بازگشت به بالای صفحه">
          <ArrowUp className="w-4 h-4 text-purple-400 group-hover:-translate-y-0.5 transition-transform" />
        </button>}
      </div>

      <TekvixAiAssistant onOpenOrderModal={handleOpenOrderModal} />
      <Footer onOpenAdmin={handleOpenAdmin} onOpenOrderTracking={handleOpenOrderTracking} />

      <Suspense fallback={null}>
        <OrderModal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal} initialServiceId={selectedServiceForOrder} onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)} onOpenOrderTracking={(orderId) => { setIsOrderModalOpen(false); handleOpenOrderTracking(orderId); }} />
        <OrderTrackingModal isOpen={isOrderTrackingOpen} onClose={() => setIsOrderTrackingOpen(false)} onOpenOrderModal={() => handleOpenOrderModal()} initialQuery={trackingInitialQuery} />
        <AdminAuthModal isOpen={isAdminAuthOpen} onSuccess={() => { setIsAdminAuthOpen(false); setIsAdminOpen(true); }} onCancel={() => setIsAdminAuthOpen(false)} />
        <GoogleAuthModal isOpen={isGoogleAuthOpen} onClose={() => setIsGoogleAuthOpen(false)} onOpenOrderModal={() => handleOpenOrderModal()} onOpenOrderTracking={handleOpenOrderTracking} />
      </Suspense>

      <style>{`
        .page-meteor { position:absolute; width:110px; height:1.5px; border-radius:999px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),rgba(103,232,249,.72),transparent); filter:drop-shadow(0 0 6px rgba(103,232,249,.7)); opacity:0; transform:rotate(28deg) translate3d(0,0,0) scaleX(.55); animation:page-meteor-fly 12s linear infinite; will-change:transform,opacity; contain:paint; }
        .page-meteor-1 {top:9%;left:-10%;animation-delay:0s}.page-meteor-2 {top:24%;left:48%;width:85px;transform:rotate(24deg) translate3d(0,0,0) scaleX(.5);animation-delay:4s}.page-meteor-3 {top:39%;left:12%;width:125px;transform:rotate(30deg) translate3d(0,0,0) scaleX(.45);animation-delay:8s}.page-meteor-4 {top:55%;left:67%;width:75px;transform:rotate(25deg) translate3d(0,0,0) scaleX(.5);animation-delay:2s;animation-duration:14s}.page-meteor-5 {top:72%;left:30%;width:100px;transform:rotate(29deg) translate3d(0,0,0) scaleX(.5);animation-delay:7s;animation-duration:13s}.page-meteor-6 {top:88%;left:78%;width:70px;transform:rotate(27deg) translate3d(0,0,0) scaleX(.45);animation-delay:10s;animation-duration:15s}
        @keyframes page-meteor-fly {0%,72%{opacity:0;transform:translate3d(0,0,0) rotate(28deg) scaleX(.45)}76%{opacity:.95}88%{opacity:.72;transform:translate3d(300px,210px,0) rotate(28deg) scaleX(1)}100%{opacity:0;transform:translate3d(500px,350px,0) rotate(28deg) scaleX(1.15)}}
        .page-ship {position:absolute;display:block;opacity:0;transform-origin:center;will-change:transform,opacity;filter:drop-shadow(0 0 10px rgba(103,232,249,.45));animation:page-ship-drift 22s linear infinite;contain:paint}
        .page-ship::before,.page-ship::after{content:'';position:absolute;pointer-events:none}
        .ship-disc{width:78px;height:28px;border-radius:50%;background:linear-gradient(180deg,rgba(226,232,240,.9),rgba(71,85,105,.9));border:1px solid rgba(165,243,252,.8);box-shadow:inset 0 -8px 12px rgba(14,165,233,.35),0 0 14px rgba(34,211,238,.4)}
        .ship-disc::before{left:19px;top:-11px;width:40px;height:18px;border-radius:50% 50% 40% 40%;background:linear-gradient(180deg,rgba(192,132,252,.9),rgba(8,47,73,.8));border:1px solid rgba(216,180,254,.8)}
        .ship-disc::after{left:14px;right:14px;bottom:-8px;height:8px;background:linear-gradient(90deg,transparent,rgba(34,211,238,.8),transparent);filter:blur(2px)}
        .ship-shuttle{width:30px;height:88px;border-radius:48% 48% 28% 28%;background:linear-gradient(90deg,rgba(71,85,105,.95),rgba(226,232,240,.95) 48%,rgba(71,85,105,.95));border:1px solid rgba(165,243,252,.8)}
        .ship-shuttle::before{left:-17px;top:30px;width:64px;height:22px;background:linear-gradient(180deg,rgba(34,211,238,.35),rgba(30,41,59,.95));clip-path:polygon(0 55%,34% 0,100% 35%,78% 100%,30% 100%)}
        .ship-shuttle::after{left:9px;bottom:-22px;width:12px;height:25px;background:linear-gradient(180deg,rgba(251,191,36,.9),rgba(249,115,22,.2),transparent);filter:blur(3px)}
        .ship-fighter{width:92px;height:26px;background:linear-gradient(90deg,rgba(15,23,42,.95),rgba(148,163,184,.95),rgba(15,23,42,.95));clip-path:polygon(0 50%,25% 20%,58% 0,100% 50%,58% 100%,25% 80%);border:1px solid rgba(167,139,250,.8)}
        .ship-fighter::before{left:34px;top:8px;width:28px;height:8px;border-radius:50%;background:rgba(34,211,238,.85);box-shadow:0 0 12px rgba(34,211,238,.9)}
        .ship-fighter::after{left:-35px;top:10px;width:40px;height:6px;background:linear-gradient(90deg,transparent,rgba(168,85,247,.75));filter:blur(2px)}
        .ship-rocket{width:30px;height:90px;border-radius:50% 50% 18% 18%;background:linear-gradient(90deg,rgba(51,65,85,.95),rgba(248,250,252,.96) 50%,rgba(51,65,85,.95));border:1px solid rgba(216,180,254,.75)}
        .ship-rocket::before{left:-19px;top:48px;width:68px;height:18px;background:rgba(71,85,105,.9);clip-path:polygon(0 50%,35% 0,100% 25%,82% 100%,35% 100%)}
        .ship-rocket::after{left:7px;bottom:-28px;width:16px;height:34px;background:linear-gradient(180deg,rgba(251,191,36,.95),rgba(239,68,68,.3),transparent);filter:blur(3px)}
        .ship-scout{width:64px;height:36px;border-radius:55% 45% 50% 40%;background:linear-gradient(135deg,rgba(15,23,42,.95),rgba(125,211,252,.8));border:1px solid rgba(125,211,252,.9);transform:rotate(-12deg)}
        .ship-scout::before{left:-24px;top:13px;width:28px;height:10px;border-radius:50%;background:rgba(192,132,252,.7);box-shadow:0 0 14px rgba(192,132,252,.8)}
        .ship-scout::after{right:9px;top:9px;width:12px;height:12px;border-radius:50%;background:rgba(34,211,238,.95);box-shadow:0 0 10px rgba(34,211,238,1)}
        .ship-capsule{width:42px;height:62px;border-radius:50% 50% 36% 36%;background:linear-gradient(90deg,rgba(71,85,105,.9),rgba(241,245,249,.96),rgba(71,85,105,.9));border:1px solid rgba(165,243,252,.85);transform:rotate(18deg)}
        .ship-capsule::before{left:8px;top:13px;width:24px;height:18px;border-radius:50%;background:radial-gradient(circle at 45% 35%,rgba(34,211,238,.95),rgba(15,23,42,.9));border:1px solid rgba(103,232,249,.8)}
        .ship-capsule::after{left:13px;bottom:-18px;width:14px;height:22px;background:linear-gradient(180deg,rgba(34,211,238,.8),transparent);filter:blur(2px)}
        .page-ship-1{top:18%;left:8%;animation-delay:0s;animation-duration:24s}.page-ship-2{top:63%;left:18%;animation-delay:4s;animation-duration:28s}.page-ship-3{top:29%;left:62%;animation-delay:8s;animation-duration:26s}.page-ship-4{top:72%;left:72%;animation-delay:12s;animation-duration:30s}.page-ship-5{top:42%;left:36%;animation-delay:16s;animation-duration:25s}.page-ship-6{top:15%;left:76%;animation-delay:20s;animation-duration:27s}
        @keyframes page-ship-drift{0%{opacity:0;transform:translate3d(-80px,35px,0) rotate(-8deg) scale(.72)}7%{opacity:.9}35%{opacity:.95;transform:translate3d(110px,-45px,0) rotate(5deg) scale(1)}68%{opacity:.8;transform:translate3d(340px,75px,0) rotate(-4deg) scale(.92)}92%{opacity:.65}100%{opacity:0;transform:translate3d(620px,-90px,0) rotate(8deg) scale(.72)}}
        @media(max-width:640px){.page-ship{transform-origin:center}.ship-disc{width:62px;height:22px}.ship-shuttle{width:24px;height:68px}.ship-fighter{width:72px;height:20px}.ship-rocket{width:24px;height:70px}.ship-scout{width:50px;height:28px}.ship-capsule{width:34px;height:50px}}
        @media(prefers-reduced-motion:reduce){.page-meteor{animation:none;opacity:0}.page-ship{animation:none;opacity:0}}
      `}</style>
    </div>
  );
}

export default function App(){return <SiteDataProvider><MainWebsite /></SiteDataProvider>}
