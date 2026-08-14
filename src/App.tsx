import React, { useState, useEffect } from 'react';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveFeatures } from './components/InteractiveFeatures';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorks } from './components/HowItWorks';
import { PortfolioSection } from './components/PortfolioSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSection } from './components/BlogSection';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { GoogleAuthModal } from './components/common/GoogleAuthModal';
import { TekvixAiAssistant } from './components/common/TekvixAiAssistant';
import { UniversalBackButton } from './components/common/UniversalBackButton';
import { ArrowUp, Shield, Sparkles, Video, User } from 'lucide-react';

function MainWebsite() {
  const { sectionsConfig, newOrdersCount, currentUser, navigateToSection } = useSiteData();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<string | undefined>(undefined);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenOrderModal = (serviceId?: string) => {
    setSelectedServiceForOrder(serviceId);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  const isEnabled = (key: string) => {
    const section = sectionsConfig.find((s) => s.key === key || s.id === key);
    return section ? section.enabled : true;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminOpen) {
    return (
      <AdminLayout
        onSwitchToSite={() => setIsAdminOpen(false)}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-[#05050d] text-gray-200 selection:bg-purple-600 selection:text-white font-sans antialiased overflow-x-hidden relative"
      dir="rtl"
    >
      {/* Sticky Glassmorphic Navbar */}
      <Navbar
        onOpenOrderModal={handleOpenOrderModal}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
      />

      <main>
        {/* 1. Hero Section with Cosmic Glowing Orb */}
        {isEnabled('hero') && (
          <Hero
            onOpenOrderModal={() => handleOpenOrderModal()}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}

        {/* 2. Interactive Features & Live Dashboard */}
        {isEnabled('features') && <InteractiveFeatures />}

        {/* 3. Services Section (Dynamic Services Grid) */}
        {isEnabled('services') && (
          <ServicesSection onSelectServiceForQuote={(serviceId) => handleOpenOrderModal(serviceId)} />
        )}

        {/* 4. How It Works (3-Step Flow) */}
        {isEnabled('how_it_works') && <HowItWorks onOpenOrderModal={() => handleOpenOrderModal()} />}

        {/* 5. Portfolio Section */}
        {isEnabled('portfolio') && <PortfolioSection />}

        {/* 6. Blog & Cinema Video Player Section */}
        {isEnabled('blog') && <BlogSection onOpenOrderModal={handleOpenOrderModal} />}

        {/* 7. Testimonials Section */}
        {isEnabled('testimonials') && <TestimonialsSection />}

        {/* 8. About Brand Story Section */}
        {isEnabled('about') && <AboutSection />}

        {/* 9. FAQ Section */}
        {isEnabled('faq') && <FAQSection />}

        {/* 10. Glowing Mesh Grid CTA Section */}
        {isEnabled('cta') && <CTASection onOpenOrderModal={() => handleOpenOrderModal()} />}

        {/* 11. Contact Section with Telegram Handle */}
        {isEnabled('contact') && <ContactSection />}
      </main>

      {/* Floating Bottom Quick Controls */}
      <div className="fixed bottom-6 start-6 z-40 flex items-center gap-2.5 animate-in fade-in duration-300">
        
        {/* Instant Admin Shortcut Button */}
        <button
          type="button"
          id="floating-admin-btn"
          onClick={() => setIsAdminOpen(true)}
          className="relative px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-[#0d071f]/95 hover:bg-[#1a0f3c] text-purple-200 hover:text-white border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.35)] backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer group focus:outline-none"
          title="ورود مستقیم به پنل مدیریت"
        >
          <div className="w-6 h-6 rounded-lg bg-purple-600/30 flex items-center justify-center border border-purple-400/40">
            <Shield className="w-3.5 h-3.5 text-purple-300 group-hover:text-white transition-colors" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">پنل مدیریت</span>
          {newOrdersCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold shadow-sm animate-pulse">
              {newOrdersCount}
            </span>
          )}
        </button>

        {/* Quick Return to Movie / Video Page Button */}
        <button
          type="button"
          id="floating-video-jump-btn"
          onClick={() => navigateToSection('blog')}
          className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-500/40 shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5"
          title="پرش به بخش فیلم و ویدیوها"
        >
          <Video className="w-4 h-4 text-purple-300 animate-pulse" />
          <span className="text-xs font-bold hidden sm:inline">صفحه فیلم</span>
        </button>

        {/* Google User Profile Quick Badge */}
        {currentUser && (
          <button
            type="button"
            onClick={() => setIsGoogleAuthOpen(true)}
            className="p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white border border-purple-500/30 shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            title="پروفایل کاربر گوگل"
          >
            <img src={currentUser.avatar} alt="User" className="w-6 h-6 rounded-xl object-cover" />
            <span className="text-xs font-semibold hidden md:inline max-w-[90px] truncate">
              {currentUser.name}
            </span>
          </button>
        )}

        {/* Return To Top Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="p-3 rounded-2xl bg-[#09090b]/90 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none"
            title="بازگشت به بالای صفحه"
          >
            <ArrowUp className="w-4 h-4 text-purple-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Intelligent Gemini AI Assistant (Floating Assistant) */}
      <TekvixAiAssistant onOpenOrderModal={handleOpenOrderModal} />

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Unified Place Order / Get Quote Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        initialServiceId={selectedServiceForOrder}
      />

      {/* Google Authentication & Account Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        onOpenOrderModal={() => handleOpenOrderModal()}
      />
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
