import React from 'react';
import { Sparkles, ArrowLeft, ArrowDown, ChevronDown } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { TRUSTED_COMPANIES } from '../data/mockData';
import { NeuralSubmitButton } from './common/NeuralSubmitButton';
import { HeroCanvasStars } from './HeroCanvasStars';

interface HeroProps {
  onOpenOrderModal: () => void;
  onOpenAdmin?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal, onOpenAdmin }) => {
  const { brandInfo } = useSiteData();

  return (
    <section
      id="hero-section"
      className="relative min-h-[100dvh] pt-20 sm:pt-28 pb-12 sm:pb-16 overflow-hidden flex flex-col justify-between items-center text-center bg-[#05050d]"
    >
      {/* Background Cosmic Grid */}
      <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none z-0" />
      
      {/* Radial Cosmic Background Aura */}
      <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] bg-radial-gradient pointer-events-none -z-10" />

      {/* HTML5 Canvas with minimal fading stars across the ENTIRE full screen */}
      <HeroCanvasStars className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      {/* Main Celestial Glow / Orbital Rings Container */}
      <div className="relative w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center my-auto z-10">
        
        {/* The Cosmic Celestial Planet Orb & Orbit System */}
        <div className="relative flex items-center justify-center w-full my-2 sm:my-6 overflow-visible min-h-[220px] sm:min-h-[360px] md:min-h-[440px]">
          
          {/* Outer Orbital Ring with rotating nodes */}
          <div className="absolute w-[240px] h-[240px] sm:w-[440px] sm:h-[440px] md:w-[560px] md:h-[560px] rounded-full border border-purple-500/15 pointer-events-none animate-orbit z-[1]">
            <div className="absolute top-0 start-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-purple-400 shadow-[0_0_14px_#c084fc]" />
            <div className="absolute bottom-8 sm:bottom-14 start-5 sm:start-10 w-2 h-2 rounded-full bg-indigo-300/80 shadow-[0_0_10px_#818cf8]" />
            <div className="absolute top-1/3 end-0 translate-x-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_12px_#e879f9]" />
          </div>

          {/* Inner Orbital Ring with reverse rotation */}
          <div className="absolute w-[200px] h-[200px] sm:w-[340px] sm:h-[340px] md:w-[440px] md:h-[440px] rounded-full border border-violet-400/20 pointer-events-none animate-orbit-reverse z-[1]">
            <div className="absolute bottom-2 sm:bottom-4 end-8 sm:end-14 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-violet-300 shadow-[0_0_12px_#c084fc]" />
            <div className="absolute top-8 sm:top-14 start-6 sm:start-10 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-200/90 shadow-[0_0_8px_#e9d5ff]" />
          </div>

          {/* Glowing Planetary Core Sphere with Gentle Floating & Breathing Animation */}
          <div className="relative z-10 w-[170px] h-[170px] sm:w-[270px] sm:h-[270px] md:w-[360px] md:h-[360px] rounded-full bg-gradient-to-b from-[#2e135b] via-[#180931] to-[#0c0319] border border-purple-400/35 shadow-[0_0_55px_rgba(168,85,247,0.48),inset_0_0_35px_rgba(192,132,252,0.32)] sm:shadow-[0_0_90px_rgba(168,85,247,0.52),inset_0_0_60px_rgba(192,132,252,0.38)] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden animate-orb-breathe select-none">
            
            {/* Top Atmospheric Highlight / Shimmer */}
            <div className="absolute -top-8 sm:-top-10 inset-x-0 h-28 sm:h-40 bg-gradient-to-b from-purple-300/35 via-violet-500/10 to-transparent blur-xl pointer-events-none" />

            {/* Central Glowing TEKVIX Ai Text */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300 font-sans drop-shadow-[0_0_24px_rgba(216,180,254,0.85)] select-none">
                TEKVIX Ai
              </span>
            </div>

            {/* Subtle inner cosmic grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none opacity-35" />
          </div>
        </div>

        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-3 sm:mb-4 mt-2">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 animate-pulse" />
          <span className="text-[11px] sm:text-sm font-medium text-purple-200">
            نسل جدید خدمات هوش مصنوعی و دیجیتال
          </span>
        </div>

        {/* Hero Main Headline */}
        <h1
          id="hero-headline"
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.3] sm:leading-[1.25] max-w-4xl mx-auto mb-3 sm:mb-5"
        >
          {brandInfo.heroHeadline}
        </h1>

        {/* Persian Subtext */}
        <p
          id="hero-subtext"
          className="text-xs sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal"
        >
          {brandInfo.heroSubtext}
        </p>

        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg mx-auto">
          {/* Primary Neural Submit Request Button */}
          <NeuralSubmitButton
            id="hero-neural-submit-btn"
            label="ثبت سفارش آنلاین"
            successLabel="درخواست ثبت شد ✓"
            onSubmitSuccess={onOpenOrderModal}
            className="w-full sm:w-auto"
          />

          {/* Secondary Button */}
          <a
            href="#services"
            id="hero-secondary-cta"
            className="w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-purple-500/40 text-gray-200 hover:text-white font-medium text-xs sm:text-base transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 group"
          >
            <span>مشاهده خدمات</span>
            <ChevronDown className="w-4 h-4 text-purple-400 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Trusted By & Innovation Partner Marquee */}
      <div className="w-full mt-16 sm:mt-24 pt-8 border-t border-white/[0.06] relative z-10">
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <p className="text-xs sm:text-sm font-medium text-gray-400 text-center tracking-wide">
            مورد اعتماد تیم‌های پیشرو، آژانس‌های دیجیتال و استارتاپ‌های نوآور
          </p>
        </div>

        {/* Infinite Logo Ticker */}
        <div className="relative w-full overflow-hidden py-3">
          <div className="absolute start-0 inset-y-0 w-24 bg-gradient-to-r from-[#05050d] to-transparent z-10 pointer-events-none" />
          <div className="absolute end-0 inset-y-0 w-24 bg-gradient-to-l from-[#05050d] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-12 sm:gap-20">
            {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map((company, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-gray-400 hover:text-purple-300 transition-colors whitespace-nowrap opacity-60 hover:opacity-100"
              >
                <span className="text-purple-400 text-base">{company.symbol}</span>
                <span className="font-sans font-semibold text-sm sm:text-base tracking-wider">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
