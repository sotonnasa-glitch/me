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
      className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col justify-between items-center text-center bg-[#05050d]"
    >
      {/* Background Cosmic Grid */}
      <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none z-0" />
      
      {/* High-Performance Cosmic Canvas Stars & Meteors */}
      <HeroCanvasStars />

      {/* Radial Cosmic Background Aura */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] bg-radial-gradient pointer-events-none -z-10" />

      {/* Main Celestial Glow / Orbital Rings Container */}
      <div className="relative w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center my-auto z-10">
        
        {/* The Cosmic Celestial Planet Orb & Orbit System */}
        <div className="relative flex items-center justify-center w-full my-4 sm:my-8 overflow-visible min-h-[300px] sm:min-h-[460px] md:min-h-[540px]">

          {/* Outer Orbital Ring with rotating nodes */}
          <div className="absolute w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] md:w-[620px] md:h-[620px] rounded-full border border-purple-500/15 pointer-events-none animate-orbit z-[1]">
            <div className="absolute top-0 start-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-purple-400 shadow-[0_0_14px_#c084fc]" />
            <div className="absolute bottom-8 sm:bottom-12 start-8 sm:start-10 w-2 h-2 rounded-full bg-indigo-300/80 shadow-[0_0_10px_#818cf8]" />
            <div className="absolute top-1/3 end-0 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_12px_#e879f9]" />
          </div>

          {/* Inner Orbital Ring with reverse rotation */}
          <div className="absolute w-[230px] h-[230px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] rounded-full border border-violet-400/20 pointer-events-none animate-orbit-reverse z-[1]">
            <div className="absolute bottom-3 sm:bottom-4 end-10 sm:end-16 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-violet-300 shadow-[0_0_12px_#c084fc]" />
            <div className="absolute top-10 sm:top-16 start-8 sm:start-12 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-200/90 shadow-[0_0_8px_#e9d5ff]" />
          </div>

          {/* Glowing Planetary Core Sphere with Gentle Floating & Breathing Animation */}
          <div className="relative z-10 w-[190px] h-[190px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-b from-[#2e135b] via-[#1a0c36] to-[#0d071c] border border-purple-400/35 shadow-[0_0_65px_rgba(168,85,247,0.48),inset_0_0_40px_rgba(192,132,252,0.32)] sm:shadow-[0_0_95px_rgba(168,85,247,0.5),inset_0_0_60px_rgba(192,132,252,0.35)] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden animate-orb-breathe select-none">
            
            {/* Top Atmospheric Highlight / Shimmer */}
            <div className="absolute -top-12 inset-x-0 h-40 bg-gradient-to-b from-purple-300/35 via-violet-500/10 to-transparent blur-xl pointer-events-none" />

            {/* Central Glowing TEKVIX Ai Text */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-5xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-400 font-sans drop-shadow-[0_0_30px_rgba(192,132,252,0.7)] select-none">
                TEKVIX Ai
              </span>
            </div>

            {/* Subtle inner cosmic grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none opacity-35" />
          </div>
        </div>

        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-6 mt-4">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-purple-200">
            نسل جدید خدمات هوش مصنوعی و دیجیتال
          </span>
        </div>

        {/* Hero Main Headline */}
        <h1
          id="hero-headline"
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.3] sm:leading-[1.25] max-w-4xl mx-auto mb-6"
        >
          {brandInfo.heroHeadline}
        </h1>

        {/* Persian Subtext */}
        <p
          id="hero-subtext"
          className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
        >
          {brandInfo.heroSubtext}
        </p>

        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
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
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-purple-500/40 text-gray-200 hover:text-white font-medium text-sm sm:text-base transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 group"
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
