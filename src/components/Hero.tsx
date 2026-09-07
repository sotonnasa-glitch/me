import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, Volume2, VolumeX, Radio, Crosshair, Signal } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { TRUSTED_COMPANIES } from '../data/mockData';
import { NeuralSubmitButton } from './common/NeuralSubmitButton';
import { HeroCanvasStars } from './HeroCanvasStars';

interface HeroProps {
  onOpenOrderModal: () => void;
  onOpenAdmin?: () => void;
}

// Real NASA space-radio recordings mirrored as browser-compatible MP3 files.
// These are spacecraft measurements/sonifications, not narration or background music.
const NASA_SPACE_AUDIO_URLS = [
  'https://gadgetnews.net/wp-content/uploads/2017/10/Cassini-Saturn-Radio-Emissions-1.mp3',
  'https://gadgetnews.net/wp-content/uploads/2017/10/Cassini-Enceladus-Sound.mp3',
];

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal, onOpenAdmin }) => {
  const { brandInfo } = useSiteData();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isSpaceAudioPlaying, setIsSpaceAudioPlaying] = useState(false);
  const [audioRipple, setAudioRipple] = useState(0);
  const [signalLevel, setSignalLevel] = useState(72);
  const spaceAudioRef = useRef<HTMLAudioElement | null>(null);
  const spaceAudioSourceRef = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSignalLevel((level) => {
        const drift = Math.floor(Math.random() * 15) - 7;
        return Math.max(48, Math.min(96, level + drift));
      });
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: nx * 14, y: -ny * 14 });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  // Play real spacecraft space-radio audio. Playback starts only after the user's tap.
  const toggleSpaceAudio = useCallback(async () => {
    setAudioRipple((value) => value + 1);

    try {
      if (!spaceAudioRef.current) {
        const audio = new Audio(NASA_SPACE_AUDIO_URLS[0]);
        audio.loop = true;
        audio.volume = 0.28;
        audio.preload = 'auto';
        audio.addEventListener('ended', () => setIsSpaceAudioPlaying(false));
        audio.addEventListener('pause', () => setIsSpaceAudioPlaying(false));
        audio.addEventListener('play', () => setIsSpaceAudioPlaying(true));
        audio.addEventListener('error', () => {
          const nextSource = spaceAudioSourceRef.current + 1;
          if (nextSource < NASA_SPACE_AUDIO_URLS.length) {
            spaceAudioSourceRef.current = nextSource;
            audio.src = NASA_SPACE_AUDIO_URLS[nextSource];
            audio.load();
            audio.play().catch(() => setIsSpaceAudioPlaying(false));
          } else {
            setIsSpaceAudioPlaying(false);
          }
        });
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
      <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none z-0" />
      <HeroCanvasStars />

      {/* Deep-space depth: multiple low-cost star fields create parallax-like layers without heavy 3D work. */}
      <div className="absolute inset-0 pointer-events-none -z-[8] hero-space-depth hero-space-depth-near" />
      <div className="absolute inset-0 pointer-events-none -z-[9] hero-space-depth hero-space-depth-far" />
      <div className="absolute inset-0 pointer-events-none -z-[10] hero-space-dust" />

      {/* Mission HUD */}
      <div className="absolute top-24 start-4 sm:start-7 lg:start-10 z-20 hidden sm:block text-start font-mono select-none pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.22em] text-cyan-300/90">
          <Crosshair className="w-3.5 h-3.5 animate-pulse" />
          <span>MISSION // TEKVIX-01</span>
        </div>
        <div className="mt-2 ps-5 text-[9px] sm:text-[10px] tracking-[0.16em] text-gray-500">
          DEEP SPACE NETWORK
        </div>
        <div className="mt-1 ps-5 flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.14em] text-emerald-300/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SYSTEM ONLINE
        </div>
      </div>

      <div className="absolute top-24 end-4 sm:end-7 lg:end-10 z-20 hidden sm:block text-end font-mono select-none pointer-events-none">
        <div className="flex items-center justify-end gap-2 text-[10px] sm:text-xs tracking-[0.18em] text-purple-300/90">
          <span>DEEP SPACE LINK</span>
          <Radio className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div className="mt-2 text-[9px] sm:text-[10px] tracking-[0.14em] text-gray-500">
          ORBITAL AI CORE // ACTIVE
        </div>
        <div className="mt-1 text-[9px] sm:text-[10px] tracking-[0.14em] text-cyan-300/70">
          CHANNEL 07 // SECURE
        </div>
      </div>

      <div className="absolute top-0 start-1/4 w-40 sm:w-80 h-[800px] bg-gradient-to-b from-purple-500/10 via-cyan-400/5 to-transparent rotate-[18deg] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-0 end-1/4 w-32 sm:w-64 h-[750px] bg-gradient-to-b from-cyan-400/10 via-fuchsia-500/5 to-transparent rotate-[-22deg] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] bg-radial-gradient pointer-events-none -z-10" />

      <div className="absolute top-[20%] start-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] md:w-[850px] h-[340px] sm:h-[650px] md:h-[850px] rounded-full bg-gradient-to-tr from-purple-700/25 via-fuchsia-600/15 to-transparent blur-3xl pointer-events-none -z-[5] animate-nebula" />
      <div className="absolute top-[28%] start-[45%] -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] md:w-[700px] h-[300px] sm:h-[550px] md:h-[700px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/15 to-transparent blur-3xl pointer-events-none -z-[5] animate-pulse-slow" />
      <div className="absolute top-[32%] start-[55%] -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[450px] md:w-[550px] h-[220px] sm:h-[450px] md:h-[550px] rounded-full bg-gradient-to-r from-amber-500/12 via-violet-600/15 to-transparent blur-3xl pointer-events-none -z-[5] animate-nebula" />

      <div className="relative w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center my-auto z-10">
        <div
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="relative flex items-center justify-center w-full my-3 sm:my-6 overflow-visible min-h-[320px] sm:min-h-[480px] md:min-h-[560px]"
        >
          <div className="absolute inset-0 m-auto w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] md:w-[440px] md:h-[440px] rounded-full bg-gradient-to-r from-purple-600/40 via-cyan-500/30 to-fuchsia-500/35 blur-2xl pointer-events-none animate-cosmic-corona z-0" />
          <div className="absolute inset-0 m-auto w-[310px] h-[310px] sm:w-[560px] sm:h-[560px] md:w-[700px] md:h-[700px] rounded-full border border-dashed border-purple-500/20 pointer-events-none animate-orbit-reverse z-[1]" />

          <div className="absolute inset-0 m-auto w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] md:w-[620px] md:h-[620px] rounded-full border border-purple-500/25 pointer-events-none animate-orbit z-[1]">
            <div className="absolute top-0 start-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-purple-400 shadow-[0_0_18px_#c084fc]" />
            <div className="absolute bottom-8 sm:bottom-12 start-8 sm:start-10 w-2.5 h-2.5 rounded-full bg-indigo-300 shadow-[0_0_12px_#818cf8]" />
            <div className="absolute top-1/3 end-0 translate-x-1/2 w-3 h-3 rounded-full bg-fuchsia-400 shadow-[0_0_14px_#e879f9]" />
            <div className="absolute bottom-1/4 end-8 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_#fde047]" />
          </div>

          <div className="absolute inset-0 m-auto w-[260px] h-[130px] sm:w-[460px] sm:h-[220px] md:w-[580px] md:h-[260px] rounded-[100%] border border-cyan-400/30 pointer-events-none rotate-[-25deg] animate-pulse-slow z-[2]">
            <div className="absolute top-1/2 -start-1.5 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8]" />
            <div className="absolute top-1/2 -end-1.5 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8]" />
            <div className="absolute top-2 start-1/4 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#38bdf8]" />
            <div className="absolute bottom-3 end-1/3 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#38bdf8]" />
          </div>

          <div className="absolute inset-0 m-auto w-[250px] h-[120px] sm:w-[440px] sm:h-[210px] md:w-[560px] md:h-[240px] rounded-[100%] border border-fuchsia-500/20 pointer-events-none rotate-[35deg] animate-pulse-slow z-[2]">
            <div className="absolute top-1/2 -start-1.5 w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_10px_#e879f9]" />
            <div className="absolute top-1/2 -end-1.5 w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_10px_#e879f9]" />
          </div>

          <div className="absolute inset-0 m-auto w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] rounded-full border border-violet-400/30 pointer-events-none animate-orbit-reverse z-[1]">
            <div className="absolute bottom-3 sm:bottom-4 end-10 sm:end-16 w-3 h-3 rounded-full bg-violet-300 shadow-[0_0_14px_#c084fc]" />
            <div className="absolute top-10 sm:top-16 start-8 sm:start-12 w-2 h-2 rounded-full bg-purple-200 shadow-[0_0_10px_#e9d5ff]" />
            <div className="absolute top-1/2 -start-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          </div>

          {shockwaves.map((sw) => (
            <div
              key={sw.id}
              className="absolute inset-0 m-auto w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full border-2 border-cyan-400 animate-ping pointer-events-none z-20"
              style={{ animationDuration: '1.2s' }}
            />
          ))}

          <div
            onClick={triggerOrbPulse}
            role="button"
            tabIndex={0}
            aria-label="سیاره هوش مصنوعی تکویکس"
            className="relative z-10 w-[190px] h-[190px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-b from-[#2e135b] via-[#1a0c36] to-[#0d071c] border-2 border-purple-400/50 shadow-[0_0_80px_rgba(168,85,247,0.7),inset_0_0_50px_rgba(192,132,252,0.45),inset_-15px_-15px_40px_rgba(0,0,0,0.8)] sm:shadow-[0_0_120px_rgba(168,85,247,0.7),inset_0_0_70px_rgba(192,132,252,0.5),inset_-25px_-25px_60px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden animate-orb-breathe select-none group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="absolute -top-12 inset-x-0 h-40 bg-gradient-to-b from-purple-300/40 via-violet-500/15 to-transparent blur-xl pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 pointer-events-none shadow-[inset_0_8px_20px_rgba(56,189,248,0.35)]" />
            <div className="absolute -inset-x-10 top-1/2 -translate-y-1/2 h-16 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent blur-md pointer-events-none rotate-[-12deg]" />
            <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl sm:text-5xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-400 font-sans drop-shadow-[0_0_30px_rgba(192,132,252,0.85)] select-none group-hover:brightness-110 transition-all">
                TEKVIX Ai
              </span>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none opacity-35" />
          </div>

          <div className="absolute -top-4 start-1/3 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] pointer-events-none animate-stardust" />
          <div className="absolute -bottom-6 end-1/3 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047] pointer-events-none animate-stardust" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/4 end-1/6 w-1.5 h-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_8px_#e879f9] pointer-events-none animate-stardust" style={{ animationDelay: '4s' }} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-4 mt-4">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-purple-200">
            نسل جدید خدمات هوش مصنوعی و دیجیتال
          </span>
        </div>

        {/* Visual signal console. The values are an atmospheric UI simulation, not live spacecraft telemetry. */}
        <div className="w-full max-w-md mb-4 rounded-2xl border border-cyan-400/15 bg-black/25 backdrop-blur-md px-4 py-3 shadow-[0_0_30px_rgba(34,211,238,0.06)]">
          <div className="flex items-center justify-between gap-4 text-[9px] sm:text-[10px] font-mono tracking-[0.14em]">
            <div className="flex items-center gap-2 text-cyan-300/90">
              <Signal className="w-3.5 h-3.5" />
              <span>DEEP SPACE SIGNAL</span>
            </div>
            <span className="text-emerald-300/80">LOCKED</span>
          </div>
          <div className="mt-2 flex items-end gap-1 h-7" aria-hidden="true">
            {Array.from({ length: 30 }, (_, index) => {
              const wave = 8 + Math.abs(Math.sin((index + signalLevel) * 0.65)) * 16 + ((signalLevel + index * 3) % 7);
              return (
                <span
                  key={index}
                  className="flex-1 min-w-0 rounded-full bg-cyan-300/50 transition-all duration-700"
                  style={{ height: `${Math.min(100, wave * 2.2)}%`, opacity: 0.25 + (index % 5) * 0.1 }}
                />
              );
            })}
          </div>
          <div className="mt-1 flex items-center justify-between text-[8px] font-mono tracking-[0.12em] text-gray-500">
            <span>VISUAL SIMULATION</span>
            <span>{signalLevel}% SIGNAL</span>
          </div>
        </div>

        {/* Real NASA spacecraft space-radio audio — no narration */}
        <button
          type="button"
          id="hero-space-audio-btn"
          onClick={toggleSpaceAudio}
          aria-pressed={isSpaceAudioPlaying}
          aria-label={isSpaceAudioPlaying ? 'توقف صدای واقعی فضا' : 'پخش صدای واقعی فضا'}
          className="group relative isolate overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-cyan-200 text-xs sm:text-sm backdrop-blur-sm transition-all duration-300 active:scale-95 shadow-[0_0_0_rgba(34,211,238,0)] hover:shadow-[0_0_24px_rgba(34,211,238,0.18)]"
        >
          <span
            key={audioRipple}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/80 bg-cyan-300/20 pointer-events-none z-0 animate-[audio-ripple_0.75s_ease-out_forwards]"
          />
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/0 via-cyan-300/10 to-fuchsia-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <span className="relative z-10 inline-flex items-center gap-2">
            {isSpaceAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span>{isSpaceAudioPlaying ? 'توقف صدای واقعی فضا' : '🌌 یه صدا از اعماق فضا... گوش کن 🎧'}</span>
          </span>
        </button>

        <h1
          id="hero-headline"
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.3] sm:leading-[1.25] max-w-4xl mx-auto mb-6"
        >
          {brandInfo.heroHeadline}
        </h1>

        <p
          id="hero-subtext"
          className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
        >
          {brandInfo.heroSubtext}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
          <NeuralSubmitButton
            id="hero-neural-submit-btn"
            label="ثبت سفارش آنلاین"
            successLabel="درخواست ثبت شد ✓"
            onSubmitSuccess={onOpenOrderModal}
            className="w-full sm:w-auto"
          />

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

      <div className="w-full mt-16 sm:mt-24 pt-8 border-t border-white/[0.06] relative z-10">
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <p className="text-xs sm:text-sm font-medium text-gray-400 text-center tracking-wide">
            مورد اعتماد تیم‌های پیشرو، آژانس‌های دیجیتال و استارتاپ‌های نوآور
          </p>
        </div>

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

      <style>{`
        .hero-space-depth-near {
          opacity: 0.55;
          background-image:
            radial-gradient(circle at 12% 18%, rgba(255,255,255,.75) 0 1px, transparent 1.5px),
            radial-gradient(circle at 72% 22%, rgba(103,232,249,.55) 0 1px, transparent 1.5px),
            radial-gradient(circle at 38% 76%, rgba(216,180,254,.5) 0 1px, transparent 1.5px),
            radial-gradient(circle at 86% 68%, rgba(255,255,255,.65) 0 1px, transparent 1.5px);
          background-size: 180px 180px, 230px 230px, 290px 290px, 210px 210px;
          animation: space-drift-near 24s linear infinite;
        }

        .hero-space-depth-far {
          opacity: 0.35;
          background-image:
            radial-gradient(circle at 20% 35%, rgba(255,255,255,.65) 0 1px, transparent 1.5px),
            radial-gradient(circle at 58% 12%, rgba(192,132,252,.45) 0 1px, transparent 1.5px),
            radial-gradient(circle at 82% 48%, rgba(56,189,248,.45) 0 1px, transparent 1.5px);
          background-size: 330px 330px, 410px 410px, 520px 520px;
          animation: space-drift-far 42s linear infinite reverse;
        }

        .hero-space-dust {
          opacity: 0.12;
          background-image: radial-gradient(circle, rgba(124,58,237,.55) 0, transparent 1.5px);
          background-size: 140px 140px;
          transform: scale(1.15);
          animation: space-dust-pulse 9s ease-in-out infinite;
        }

        @keyframes space-drift-near {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-10px, 8px, 0) scale(1.015); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes space-drift-far {
          0% { transform: translate3d(0, 0, 0) scale(1.03); }
          50% { transform: translate3d(8px, -6px, 0) scale(1); }
          100% { transform: translate3d(0, 0, 0) scale(1.03); }
        }

        @keyframes space-dust-pulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.16; }
        }

        @keyframes audio-ripple {
          0% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(0.35);
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.45), 0 0 10px rgba(34, 211, 238, 0.55);
          }
          70% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(7);
            box-shadow: 0 0 0 12px rgba(34, 211, 238, 0), 0 0 28px rgba(34, 211, 238, 0.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(9);
            box-shadow: 0 0 0 20px rgba(34, 211, 238, 0), 0 0 40px rgba(34, 211, 238, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-space-depth-near,
          .hero-space-depth-far,
          .hero-space-dust,
          .animate-\\[audio-ripple_0\\.75s_ease-out_forwards\\] {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};