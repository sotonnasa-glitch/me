import React, { useState, useCallback, useRef } from 'react';
import { Sparkles, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { TRUSTED_COMPANIES } from '../data/mockData';
import { NeuralSubmitButton } from './common/NeuralSubmitButton';
import { HeroCanvasStars } from './HeroCanvasStars';

interface HeroProps {
  onOpenOrderModal: () => void;
  onOpenAdmin?: () => void;
}

const NASA_SPACE_AUDIO_URL = 'https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014983/SoundsofSpace.mp3';

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal, onOpenAdmin }) => {
  const { brandInfo } = useSiteData();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isSpaceAudioPlaying, setIsSpaceAudioPlaying] = useState(false);
  const spaceAudioRef = useRef<HTMLAudioElement | null>(null);

  // Smooth pointer parallax tilt for genuine 3D physical depth
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: nx * 14, y: -ny * 14 });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  // Play authentic NASA space audio. Browsers require this to be user-initiated.
  const toggleSpaceAudio = useCallback(async () => {
    try {
      if (!spaceAudioRef.current) {
        const audio = new Audio(NASA_SPACE_AUDIO_URL);
        audio.loop = true;
        audio.volume = 0.28;
        audio.addEventListener('ended', () => setIsSpaceAudioPlaying(false));
        audio.addEventListener('pause', () => setIsSpaceAudioPlaying(false));
        audio.addEventListener('play', () => setIsSpaceAudioPlaying(true));
        spaceAudioRef.current = audio;
      }

      const audio = spaceAudioRef.current;
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setIsSpaceAudioPlaying(false);
    }
  }, []);

  // Trigger expanding shockwave ring on tap/click
  const triggerOrbPulse = () => {
    const newId = Date.now();
    setShockwaves((prev) => [...prev.slice(-3), { id: newId, x: 0, y: 0 }]);
    setTimeout(() => {
      setShockwaves((prev) => prev.filter((sw) => sw.id !== newId));
    }, 1200);
  };

  return (
    <section
      id="hero-section"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col justify-between items-center text-center bg-transparent"
    >
      {/* Background Cosmic Grid */}
      <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none z-0" />
      
      {/* High-Performance Cosmic Canvas Stars & Meteors */}
      <HeroCanvasStars />

      {/* Volumetric Interstellar Light Beams (Ethereal Space Rays) */}
      <div className="absolute top-0 start-1/4 w-40 sm:w-80 h-[800px] bg-gradient-to-b from-purple-500/10 via-cyan-400/5 to-transparent rotate-[18deg] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-0 end-1/4 w-32 sm:w-64 h-[750px] bg-gradient-to-b from-cyan-400/10 via-fuchsia-500/5 to-transparent rotate-[-22deg] blur-2xl pointer-events-none -z-10" />

      {/* Radial Cosmic Background Aura */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] bg-radial-gradient pointer-events-none -z-10" />

      {/* Deep Space Cosmic Nebulas (Interstellar Dust Clouds) */}
      <div className="absolute top-[20%] start-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] md:w-[850px] h-[340px] sm:h-[650px] md:h-[850px] rounded-full bg-gradient-to-tr from-purple-700/25 via-fuchsia-600/15 to-transparent blur-3xl pointer-events-none -z-[5] animate-nebula" />
      <div className="absolute top-[28%] start-[45%] -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] md:w-[700px] h-[300px] sm:h-[550px] md:h-[700px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/15 to-transparent blur-3xl pointer-events-none -z-[5] animate-pulse-slow" />
      <div className="absolute top-[32%] start-[55%] -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[450px] md:w-[550px] h-[220px] sm:h-[450px] md:h-[550px] rounded-full bg-gradient-to-r from-amber-500/12 via-violet-600/15 to-transparent blur-3xl pointer-events-none -z-[5] animate-nebula" />

      {/* Main Celestial Glow / Orbital Rings Container */}
      <div className="relative w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center my-auto z-10">
        {/* The Cosmic Celestial Planet Orb & Orbit System with 3D Parallax Tilt */}
        <div
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="relative flex items-center justify-center w-full my-3 sm:my-6 overflow-visible min-h-[320px] sm:min-h-[480px] md:min-h-[560px]"
        >

          {/* Planetary Solar Corona Aura (Behind Orb) */}
          <div className="absolute inset-0 m-auto w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] md:w-[440px] md:h-[440px] rounded-full bg-gradient-to-r from-purple-600/40 via-cyan-500/30 to-fuchsia-500/35 blur-2xl pointer-events-none animate-cosmic-corona z-0" />

          {/* Deep Space Gravitational Lens Wave (Expanding Ring) */}
          <div className="absolute inset-0 m-auto w-[310px] h-[310px] sm:w-[560px] sm:h-[560px] md:w-[700px] md:h-[700px] rounded-full border border-dashed border-purple-500/20 pointer-events-none animate-orbit-reverse z-[1]" />

          {/* Outer Orbital Ring with rotating nodes & satellites */}
          <div className="absolute inset-0 m-auto w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] md:w-[620px] md:h-[620px] rounded-full border border-purple-500/25 pointer-events-none animate-orbit z-[1]">
            <div className="absolute top-0 start-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-purple-400 shadow-[0_0_18px_#c084fc]" />
            <div className="absolute bottom-8 sm:bottom-12 start-8 sm:start-10 w-2.5 h-2.5 rounded-full bg-indigo-300 shadow-[0_0_12px_#818cf8]" />
            <div className="absolute top-1/3 end-0 translate-x-1/2 w-3 h-3 rounded-full bg-fuchsia-400 shadow-[0_0_14px_#e879f9]" />
            <div className="absolute bottom-1/4 end-8 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_#fde047]" />
          </div>

          {/* 3D Tilted Orbital Ellipse 1 (Saturn style primary ring) */}
          <div className="absolute inset-0 m-auto w-[260px] h-[130px] sm:w-[460px] sm:h-[220px] md:w-[580px] md:h-[260px] rounded-[100%] border border-cyan-400/30 pointer-events-none rotate-[-25deg] animate-pulse-slow z-[2]">
            <div className="absolute top-1/2 -start-1.5 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8]" />
            <div className="absolute top-1/2 -end-1.5 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8]" />
            <div className="absolute top-2 start-1/4 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#38bdf8]" />
            <div className="absolute bottom-3 end-1/3 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#38bdf8]" />
          </div>

          {/* 3D Tilted Orbital Ellipse 2 (Secondary Crossed Ring - 3D Gyroscope Effect) */}
          <div className="absolute inset-0 m-auto w-[250px] h-[120px] sm:w-[440px] sm:h-[210px] md:w-[560px] md:h-[240px] rounded-[100%] border border-fuchsia-500/20 pointer-events-none rotate-[35deg] animate-pulse-slow z-[2]">
            <div className="absolute top-1/2 -start-1.5 w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_10px_#e879f9]" />
            <div className="absolute top-1/2 -end-1.5 w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_10px_#e879f9]" />
          </div>

          {/* Inner Orbital Ring with reverse rotation & celestial moons */}
          <div className="absolute inset-0 m-auto w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] rounded-full border border-violet-400/30 pointer-events-none animate-orbit-reverse z-[1]">
            <div className="absolute bottom-3 sm:bottom-4 end-10 sm:end-16 w-3 h-3 rounded-full bg-violet-300 shadow-[0_0_14px_#c084fc]" />
            <div className="absolute top-10 sm:top-16 start-8 sm:start-12 w-2 h-2 rounded-full bg-purple-200 shadow-[0_0_10px_#e9d5ff]" />
            <div className="absolute top-1/2 -start-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          </div>

          {/* Expanding Energy Shockwave Rings on Click */}
          {shockwaves.map((sw) => (
            <div
              key={sw.id}
              className="absolute inset-0 m-auto w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full border-2 border-cyan-400 animate-ping pointer-events-none z-20"
              style={{ animationDuration: '1.2s' }}
            />
          ))}

          {/* Glowing Planetary Core Sphere with Floating & Breathing Animation */}
          <div
            onClick={triggerOrbPulse}
            role="button"
            tabIndex={0}
            aria-label="سیاره هوش مصنوعی تکویکس"
            className="relative z-10 w-[190px] h-[190px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-b from-[#2e135b] via-[#1a0c36] to-[#0d071c] border-2 border-purple-400/50 shadow-[0_0_80px_rgba(168,85,247,0.7),inset_0_0_50px_rgba(192,132,252,0.45),inset_-15px_-15px_40px_rgba(0,0,0,0.8)] sm:shadow-[0_0_120px_rgba(168,85,247,0.7),inset_0_0_70px_rgba(192,132,252,0.5),inset_-25px_-25px_60px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden animate-orb-breathe select-none group cursor-pointer active:scale-95 transition-transform"
          >
            {/* Top Atmospheric Highlight / Shimmer */}
            <div className="absolute -top-12 inset-x-0 h-40 bg-gradient-to-b from-purple-300/40 via-violet-500/15 to-transparent blur-xl pointer-events-none" />

            {/* Planetary Atmospheric Rim Glow (Horizon Curve) */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 pointer-events-none shadow-[inset_0_8px_20px_rgba(56,189,248,0.35)]" />

            {/* Planetary Aurora / Latitudinal Cosmic Wave */}
            <div className="absolute -inset-x-10 top-1/2 -translate-y-1/2 h-16 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent blur-md pointer-events-none rotate-[-12deg]" />

            {/* Central Glowing TEKVIX Ai Text */}
            <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl sm:text-5xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-400 font-sans drop-shadow-[0_0_30px_rgba(192,132,252,0.85)] select-none group-hover:brightness-110 transition-all">
                TEKVIX Ai
              </span>
            </div>

            {/* Subtle inner cosmic grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none opacity-35" />
          </div>

          {/* Floating Stardust Shimmers around Orb */}
          <div className="absolute -top-4 start-1/3 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] pointer-events-none animate-stardust" />
          <div className="absolute -bottom-6 end-1/3 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047] pointer-events-none animate-stardust" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/4 end-1/6 w-1.5 h-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_8px_#e879f9] pointer-events-none animate-stardust" style={{ animationDelay: '4s' }} />
        </div>

        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-6 mt-4">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-purple-200">
            نسل جدید خدمات هوش مصنوعی و دیجیتال
          </span>
        </div>

        {/* Authentic NASA Space Audio */}
        <button
          type="button"
          id="hero-space-audio-btn"
          onClick={toggleSpaceAudio}
          aria-pressed={isSpaceAudioPlaying}
          aria-label={isSpaceAudioPlaying ? 'توقف صدای واقعی فضا' : 'پخش صدای واقعی فضا'}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-cyan-200 text-xs sm:text-sm backdrop-blur-sm transition-all duration-300 mb-6"
        >
          {isSpaceAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span>{isSpaceAudioPlaying ? 'توقف صدای واقعی فضا' : '🎧 شنیدن صدای واقعی فضا'}</span>
        </button>

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
        <div className="relative w-full overflow-hidden py-3" dir="ltr">
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
