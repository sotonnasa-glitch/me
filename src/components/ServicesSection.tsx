import React, { useState } from 'react';
import {
  Globe,
  Palette,
  Clapperboard,
  Music,
  Mic,
  PenTool,
  Smartphone,
  Bot,
  Target,
  Image as ImageIcon,
  Cpu,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Zap,
  Star,
  ShieldCheck,
  Code,
  Layers,
  Heart,
  Radio,
  Send,
  Video,
  Play
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { Service } from '../types';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const { services, brandInfo } = useSiteData();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'همه خدمات' },
    { id: 'web', label: 'توسعه وب' },
    { id: 'media', label: 'تصویر و ویدیو' },
    { id: 'content', label: 'محتوا و سوشال' },
    { id: 'bot', label: 'ربات تلگرام' },
    { id: 'custom', label: 'سفارشی و AI' },
  ];

  const allServicesList = services;

  const filteredServices = selectedFilter === 'all'
    ? allServicesList
    : allServicesList.filter(service => {
        if (selectedFilter === 'media') return service.category === 'media';
        if (selectedFilter === 'content') return service.category === 'content';
        if (selectedFilter === 'web') return service.category === 'web';
        if (selectedFilter === 'bot') return service.category === 'bot';
        if (selectedFilter === 'custom') return service.category === 'custom';
        return true;
      });

  const getServiceGlow = (category?: string) => {
    switch (category) {
      case 'web':
        return {
          iconBg: 'from-cyan-950/80 via-blue-950/60 to-[#071324] border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.35)]',
          iconColor: 'text-cyan-300',
          badgeColor: 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200',
          hoverBorder: 'hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]',
          topLine: 'from-cyan-400 via-blue-500 to-indigo-500',
          dotColor: 'bg-cyan-400'
        };
      case 'media':
        return {
          iconBg: 'from-fuchsia-950/80 via-pink-950/60 to-[#1b071e] border-pink-500/50 shadow-[0_0_25px_rgba(244,63,94,0.35)]',
          iconColor: 'text-pink-300',
          badgeColor: 'bg-pink-500/15 border-pink-400/40 text-pink-200',
          hoverBorder: 'hover:border-pink-400/60 hover:shadow-[0_0_40px_rgba(244,63,94,0.25)]',
          topLine: 'from-pink-500 via-rose-500 to-purple-500',
          dotColor: 'bg-pink-400'
        };
      case 'bot':
        return {
          iconBg: 'from-sky-950/80 via-blue-950/60 to-[#051125] border-sky-500/50 shadow-[0_0_25px_rgba(56,189,248,0.35)]',
          iconColor: 'text-sky-300',
          badgeColor: 'bg-sky-500/15 border-sky-400/40 text-sky-200',
          hoverBorder: 'hover:border-sky-400/60 hover:shadow-[0_0_40px_rgba(56,189,248,0.25)]',
          topLine: 'from-sky-400 via-blue-500 to-indigo-500',
          dotColor: 'bg-sky-400'
        };
      case 'content':
        return {
          iconBg: 'from-emerald-950/80 via-teal-950/60 to-[#041914] border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.35)]',
          iconColor: 'text-emerald-300',
          badgeColor: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200',
          hoverBorder: 'hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]',
          topLine: 'from-emerald-400 via-teal-500 to-cyan-500',
          dotColor: 'bg-emerald-400'
        };
      default:
        return {
          iconBg: 'from-purple-950/80 via-indigo-950/60 to-[#0e0724] border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.35)]',
          iconColor: 'text-purple-300',
          badgeColor: 'bg-purple-500/15 border-purple-400/40 text-purple-200',
          hoverBorder: 'hover:border-purple-400/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]',
          topLine: 'from-purple-500 via-indigo-500 to-violet-500',
          dotColor: 'bg-purple-400'
        };
    }
  };

  // Live Animated Representation of Each AI Service in Action (نحوه کارکرد زنده سرویس‌ها)
  const renderServiceIcon = (iconName: string, isInactive?: boolean) => {
    if (isInactive) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Cpu className="w-6 h-6 text-zinc-500" />
        </div>
      );
    }

    switch (iconName) {
      // 1. Web Development with AI (Browser mockup + live code typing + scanning laser)
      case 'Globe':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden p-1.5">
            {/* Ambient Cyan Glow */}
            <div className="absolute inset-0 bg-cyan-500/25 rounded-full blur-md animate-pulse-slow pointer-events-none" />
            
            {/* Rotating Cyber Orbit Ring */}
            <div className="absolute w-12 h-12 rounded-full border border-dashed border-cyan-400/40 animate-orbit-spin pointer-events-none" />

            {/* Mini Browser Screen Header */}
            <div className="w-full flex items-center justify-between px-1 mb-1 z-10">
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[8px] font-mono text-cyan-300 font-bold tracking-tighter">&lt;AI/&gt;</span>
            </div>

            {/* Globe & Code Typing Matrix */}
            <div className="relative z-10 flex items-center justify-center gap-1">
              <div className="animate-globe-pulse">
                <Globe className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]" />
              </div>
              {/* Simulated Live Code Lines */}
              <div className="flex flex-col gap-0.5 w-5">
                <span className="h-0.5 bg-cyan-300 rounded-full animate-code-typing shadow-[0_0_4px_#67e8f9]" />
                <span className="h-0.5 bg-blue-300 rounded-full animate-code-typing [animation-delay:0.5s] w-3/4" />
                <span className="h-0.5 bg-indigo-300 rounded-full animate-code-typing [animation-delay:1s] w-full" />
              </div>
            </div>

            {/* Scanning Laser Line */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-laser-scan pointer-events-none" />

            {/* Live Indicator */}
            <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping opacity-80" />
          </div>
        );

      // 2. AI Image Diffusion & Artwork (Swirling Color Aura + Canvas Crosshairs + Sparkles)
      case 'Palette':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Color spectrum diffusion swirl */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/30 via-purple-500/25 to-amber-500/25 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-pink-500/25 rounded-full blur-md animate-color-swirl pointer-events-none" />

            {/* Art Canvas Corner Crop Marks */}
            <div className="absolute top-1.5 start-1.5 w-2 h-2 border-t border-s border-pink-300/60 pointer-events-none" />
            <div className="absolute bottom-1.5 end-1.5 w-2 h-2 border-b border-e border-pink-300/60 pointer-events-none" />

            {/* Palette & Sparkle Diffusion Burst */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-6 h-6 text-pink-300 drop-shadow-[0_0_14px_rgba(244,63,94,0.95)]" />
                <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-white animate-lens-sparkle shadow-[0_0_10px_#ffffff]" />
              </div>
              <Sparkles className="absolute -bottom-1 -start-1 w-3 h-3 text-amber-300 animate-canvas-diffusion" />
            </div>

            {/* Resolution indicator */}
            <span className="absolute bottom-1 end-1 text-[8px] font-mono text-pink-300 font-bold px-1 rounded bg-pink-950/80 border border-pink-500/40">
              4K
            </span>
          </div>
        );

      // 3. AI Video Production (Action clapperboard + film reel cogwheels + REC beacon)
      case 'Clapperboard':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Cinematic Red Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/35 via-purple-600/25 to-transparent rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-md animate-neon-radar pointer-events-none" />

            {/* Rotating Film Reels in Background */}
            <div className="absolute w-11 h-11 rounded-full border border-dashed border-rose-400/30 animate-reel-spin pointer-events-none" />

            {/* Clapperboard Snapping Action */}
            <div className="relative z-10 animate-clapper-action">
              <Clapperboard className="w-6 h-6 text-rose-300 drop-shadow-[0_0_14px_rgba(244,63,94,0.95)]" />
            </div>

            {/* Mini Play Badge */}
            <div className="absolute bottom-1 start-1.5 w-3.5 h-3.5 rounded-full bg-rose-600/90 flex items-center justify-center shadow-[0_0_6px_#f43f5e]">
              <Play className="w-2 h-2 text-white fill-white ms-0.5" />
            </div>

            {/* Live REC Indicator */}
            <div className="absolute top-1.5 end-1.5 flex items-center gap-0.5 bg-black/60 px-1 py-0.5 rounded border border-rose-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span className="text-[7px] font-mono text-red-300 font-bold">REC</span>
            </div>
          </div>
        );

      // 4. AI Music & Song Synthesis (Melodic float + soundwaves + jumping equalizer)
      case 'Music':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Melodic Violet Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/35 via-purple-600/30 to-pink-500/25 rounded-2xl pointer-events-none" />
            
            {/* Expanding Soundwave Ripples */}
            <div className="absolute w-10 h-10 rounded-full border border-fuchsia-400/40 animate-soundwave-ripple pointer-events-none" />

            {/* Music Note with Floating Oscillation */}
            <div className="relative z-10 animate-note-float">
              <Music className="w-6 h-6 text-fuchsia-300 drop-shadow-[0_0_16px_rgba(217,70,239,1)]" />
            </div>

            {/* 4-Bar Dynamic Equalizer Dancing Bars */}
            <div className="absolute bottom-1.5 end-1.5 flex items-end gap-0.5 pointer-events-none bg-fuchsia-950/60 p-0.5 rounded border border-fuchsia-400/30">
              <span className="w-0.5 bg-fuchsia-300 rounded-full animate-eq-1 shadow-[0_0_4px_#e879f9]" />
              <span className="w-0.5 bg-pink-300 rounded-full animate-eq-2 shadow-[0_0_4px_#f472b6]" />
              <span className="w-0.5 bg-fuchsia-200 rounded-full animate-eq-3 shadow-[0_0_4px_#e879f9]" />
              <span className="w-0.5 bg-purple-300 rounded-full animate-eq-1 [animation-delay:0.3s]" />
            </div>
          </div>
        );

      // 5. Voice Cloning & Speech Synthesis (Studio Mic + Concentric Soundwave Rings + dB Level)
      case 'Mic':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Vocal Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/35 via-purple-600/25 to-indigo-600/25 rounded-2xl pointer-events-none" />
            
            {/* Multi-layered Expanding Sound Rings */}
            <div className="absolute w-8 h-8 rounded-full border border-pink-400/50 animate-soundwave-ripple pointer-events-none" />
            <div className="absolute w-12 h-12 rounded-full border border-purple-400/35 animate-soundwave-ripple [animation-delay:0.8s] pointer-events-none" />

            {/* Glowing Microphone */}
            <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
              <Mic className="w-6 h-6 text-pink-300 drop-shadow-[0_0_14px_rgba(244,63,94,0.95)]" />
            </div>

            {/* Voice Frequency dB Wave Bars */}
            <div className="absolute bottom-1.5 start-1.5 flex items-center gap-0.5 pointer-events-none bg-pink-950/70 px-1 py-0.5 rounded border border-pink-400/30">
              <Radio className="w-2.5 h-2.5 text-pink-300 animate-pulse" />
              <span className="text-[7px] font-mono text-pink-200 font-bold">VOICE</span>
            </div>

            {/* Live Beacon */}
            <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping opacity-85" />
          </div>
        );

      // 6. Text Generation & Copywriting (Neural Pen Nib + Blinking Typewriter Cursor)
      case 'PenTool':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Emerald Content Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/35 via-teal-600/25 to-green-600/20 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse-slow pointer-events-none" />

            {/* Writing Document Sheet Mockup */}
            <div className="absolute w-9 h-10 rounded-md bg-emerald-950/70 border border-emerald-400/40 p-1 flex flex-col gap-1 pointer-events-none">
              <div className="flex items-center gap-0.5">
                <span className="h-0.5 bg-emerald-300 rounded-full w-4" />
                <span className="h-0.5 bg-teal-400 rounded-full w-2" />
              </div>
              <span className="h-0.5 bg-emerald-400/70 rounded-full w-full" />
              <div className="flex items-center gap-0.5">
                <span className="h-0.5 bg-emerald-300/80 rounded-full w-3" />
                <span className="w-1 h-1 bg-emerald-300 rounded-full animate-blink-cursor" />
              </div>
            </div>

            {/* Animated Pen Nib */}
            <div className="relative z-10 animate-pen-write translate-x-1 -translate-y-1">
              <PenTool className="w-5 h-5 text-emerald-200 drop-shadow-[0_0_12px_rgba(16,185,129,1)]" />
            </div>

            {/* Sparkle Star */}
            <Sparkles className="absolute top-1.5 end-1.5 w-2.5 h-2.5 text-emerald-300 animate-lens-sparkle" />
          </div>
        );

      // 7. Social Media & Reels Content (Phone frame + story gradient ring + floating heart + progress bar)
      case 'Smartphone':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Social Indigo / Purple Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/35 via-purple-600/25 to-pink-600/20 rounded-2xl pointer-events-none" />
            
            {/* Rotating Story Gradient Ring */}
            <div className="absolute w-11 h-11 rounded-full border border-dashed border-indigo-400/40 animate-orbit-spin pointer-events-none" />

            {/* Mini Phone Frame */}
            <div className="relative z-10 w-7 h-11 rounded-lg bg-indigo-950/90 border border-indigo-400/60 flex flex-col justify-between p-0.5 shadow-[0_0_12px_rgba(99,102,241,0.6)]">
              {/* Top Reel Story Progress Line */}
              <div className="w-full h-0.5 bg-indigo-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-400 to-amber-300 animate-reel-progress" />
              </div>

              {/* Center Play Icon */}
              <div className="flex items-center justify-center">
                <Play className="w-2.5 h-2.5 text-indigo-200 fill-indigo-200" />
              </div>

              {/* Floating Social Heart */}
              <div className="flex justify-center">
                <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 animate-heart-rise" />
              </div>
            </div>

            {/* Notification Badge */}
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-pink-500 border border-white/80 animate-ping opacity-80" />
          </div>
        );

      // 8. Telegram Bot & Automation (Flying Telegram Paper Plane + Robot Antenna + Signal Beacon)
      case 'Bot':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Sky Blue Telegram Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/40 via-blue-600/30 to-indigo-600/25 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-md animate-neon-radar pointer-events-none" />

            {/* Bot Antenna Orbital Path */}
            <div className="absolute w-11 h-11 rounded-full border border-dashed border-sky-400/40 animate-orbit-spin pointer-events-none" />

            {/* Bot Core with Pulse */}
            <div className="relative z-10 animate-cpu-pulse">
              <Bot className="w-6 h-6 text-sky-300 drop-shadow-[0_0_14px_rgba(56,189,248,1)]" />
            </div>

            {/* Flying Telegram Plane Mini Badge */}
            <div className="absolute bottom-1 start-1 w-3.5 h-3.5 rounded-full bg-sky-500/90 flex items-center justify-center shadow-[0_0_6px_#38bdf8]">
              <Send className="w-2 h-2 text-white -rotate-45" />
            </div>

            {/* Connection Signal Beacon */}
            <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 rounded-full bg-sky-300 animate-ping opacity-90" />
            <span className="absolute top-1.5 end-1.5 w-1 h-1 rounded-full bg-sky-100 shadow-[0_0_8px_#38bdf8]" />
          </div>
        );

      // 9. Digital Ads & Conversion Target (Concentric Radar Rings + Rotating Radar Sweep)
      case 'Target':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Amber Marketing Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/35 via-orange-600/25 to-yellow-600/20 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md animate-pulse-slow pointer-events-none" />

            {/* Radar Crosshair and Rotating Sweep Line */}
            <div className="absolute w-10 h-10 rounded-full border border-amber-400/40 pointer-events-none" />
            <div className="absolute w-6 h-6 rounded-full border border-amber-400/60 pointer-events-none" />
            <div className="absolute w-10 h-10 animate-radar-sweep pointer-events-none flex items-center justify-center">
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-amber-300 self-center origin-left shadow-[0_0_6px_#f59e0b]" />
            </div>

            {/* Bullseye Target Icon */}
            <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-6 h-6 text-amber-300 drop-shadow-[0_0_14px_rgba(245,158,11,1)]" />
            </div>

            {/* High CTR Badge */}
            <div className="absolute bottom-1 end-1 text-[7px] font-mono text-amber-200 font-bold px-1 rounded bg-amber-950/80 border border-amber-400/40">
              CTR+
            </div>
          </div>
        );

      // 10. Poster, Banner & Print (Holographic Layered Art Canvas + CMYK Color Dots)
      case 'Image':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Magenta / Violet Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/35 via-purple-600/25 to-rose-600/20 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-md animate-canvas-diffusion pointer-events-none" />

            {/* 3D Layered Frames */}
            <div className="absolute w-9 h-9 rounded-lg border border-fuchsia-400/30 rotate-6 pointer-events-none" />
            <div className="absolute w-9 h-9 rounded-lg border border-purple-400/50 -rotate-3 pointer-events-none bg-purple-950/40" />

            {/* Center Image Icon */}
            <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-6 h-6 text-fuchsia-300 drop-shadow-[0_0_14px_rgba(217,70,239,1)]" />
            </div>

            {/* CMYK 4-Color Print Dots in Corner */}
            <div className="absolute bottom-1.5 start-1.5 flex items-center gap-0.5 pointer-events-none">
              <span className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_4px_#22d3ee]" />
              <span className="w-1 h-1 rounded-full bg-pink-400 shadow-[0_0_4px_#f472b6]" />
              <span className="w-1 h-1 rounded-full bg-yellow-400 shadow-[0_0_4px_#facc15]" />
              <span className="w-1 h-1 rounded-full bg-black border border-white/40" />
            </div>

            <Sparkles className="absolute top-1.5 end-1.5 w-2.5 h-2.5 text-amber-300 animate-lens-sparkle" />
          </div>
        );

      // 11. Custom Enterprise AI & Neural Pipelines (Quantum Microprocessor + Bus Circuit Traces)
      case 'Cpu':
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* High-Voltage Royal Violet Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 via-indigo-600/30 to-fuchsia-600/25 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-purple-500/25 rounded-full blur-md animate-circuit-energy pointer-events-none" />

            {/* Quantum Electron Orbit */}
            <div className="absolute w-11 h-11 rounded-full border border-dashed border-purple-400/50 animate-orbit-spin pointer-events-none" />

            {/* CPU Core Processor with Neural Energy */}
            <div className="relative z-10 animate-cpu-pulse">
              <Cpu className="w-6 h-6 text-purple-300 drop-shadow-[0_0_16px_rgba(168,85,247,1)]" />
            </div>

            {/* Core Circuit Corner Nodes */}
            <span className="absolute top-1 start-1 w-1 h-1 rounded-full bg-purple-300 shadow-[0_0_6px_#c084fc]" />
            <span className="absolute bottom-1 end-1 w-1 h-1 rounded-full bg-indigo-300 shadow-[0_0_6px_#818cf8]" />

            {/* Enterprise Badge */}
            <div className="absolute bottom-1 start-1 text-[7px] font-mono text-purple-200 font-bold px-1 rounded bg-purple-950/80 border border-purple-400/40">
              LLM
            </div>

            <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 rounded-full bg-purple-300 animate-ping opacity-90" />
          </div>
        );
    }
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-[#040209] overflow-hidden">
      {/* Dynamic Cosmic Background Nebulas */}
      <div className="absolute top-1/4 end-0 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 start-0 w-[600px] h-[600px] bg-indigo-600/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.035] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Cybernetic Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/50 text-purple-200 text-xs font-bold mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>دسته‌بندی جامع سرویس‌ها و راهکارهای هوش مصنوعی</span>
          </div>

          <h2
            id="services-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            خدمات تخصصی هوش مصنوعی <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">{brandInfo.name || 'تکویکس'}</span>
          </h2>

          <p className="text-base sm:text-lg text-purple-200/80 leading-relaxed font-normal">
            ایده‌های شخصی، تجاری و رسانه‌ای خود را با جدیدترین فناوری‌های هوش مصنوعی جهان به خروجی‌های استاندارد، باکیفیت و آماده استفاده تبدیل کنید.
          </p>
        </div>

        {/* Filter Tabs with Glowing Futuristic Neon Styling */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 mb-14">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 focus:outline-none cursor-pointer relative overflow-hidden ${
                selectedFilter === tab.id
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(147,51,234,0.7)] border border-purple-300/60 scale-105'
                  : 'bg-[#0f0a24]/80 text-purple-200/70 hover:text-white hover:bg-white/[0.08] border border-purple-900/40 hover:border-purple-600/50'
              }`}
            >
              {selectedFilter === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine-gleam pointer-events-none" />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredServices.map((service: Service) => {
            const isInactive = service.active === false || service.availabilityStatus === 'unavailable';
            const theme = getServiceGlow(service.category);

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className={`p-6 sm:p-7 rounded-3xl border transition-all duration-400 flex flex-col justify-between group shadow-2xl relative overflow-hidden backdrop-blur-xl ${
                  isInactive
                    ? 'bg-zinc-950/70 border-zinc-800/80 opacity-75'
                    : service.popular
                    ? `bg-gradient-to-b from-purple-950/45 via-[#0e0926]/95 to-[#060412] border-purple-500/50 shadow-[0_0_40px_rgba(147,51,234,0.25)] ${theme.hoverBorder}`
                    : `bg-gradient-to-b from-[#0e0824]/80 via-[#0a051c]/90 to-[#05030f] border-purple-900/40 hover:bg-[#130b30]/90 shadow-black/60 ${theme.hoverBorder}`
                }`}
              >
                {/* Top Glowing Laser Accent Bar */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${theme.topLine} opacity-80 group-hover:opacity-100 group-hover:h-1.5 transition-all duration-300`} />
                
                {/* Background Shimmer Gleam */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-shine-gleam pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Header: Live Animated Logo Box + Badges */}
                  <div className="flex items-center justify-between mb-5">
                    {/* Living Animated Logo Box */}
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 relative overflow-hidden group-hover:scale-105 ${
                      isInactive
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        : `bg-gradient-to-br ${theme.iconBg}`
                    }`}>
                      {renderServiceIcon(service.iconName, isInactive)}
                      {!isInactive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-gleam pointer-events-none" />
                      )}
                    </div>

                    {/* Status & Feature Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {isInactive ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">
                          غیرفعال موقت
                        </span>
                      ) : service.availabilityStatus === 'coming_soon' ? (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-300" />
                          به‌زودی
                        </span>
                      ) : null}

                      {service.popular && !isInactive && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center gap-1 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          محبوب
                        </span>
                      )}

                      {service.badge && (
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${theme.badgeColor}`}>
                          {service.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-black mb-3 transition-colors duration-200 ${isInactive ? 'text-zinc-300' : 'text-white group-hover:text-purple-200'}`}>
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-sm text-purple-100/70 leading-relaxed mb-6 font-normal">
                    {service.shortDescription}
                  </p>

                  {/* Deliverables Checklist with Theme Highlight */}
                  {service.deliverables && service.deliverables.length > 0 && (
                    <div className="space-y-2.5 mb-6 pt-4 border-t border-purple-900/40">
                      {service.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-purple-200/90 font-medium">
                          <CheckCircle className={`w-4 h-4 shrink-0 ${isInactive ? 'text-zinc-500' : 'text-purple-400'}`} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action CTA Button */}
                {isInactive ? (
                  <div className="w-full py-3.5 px-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <span>این سرویس در حال حاضر فعال نیست</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    id={`btn-quote-${service.id}`}
                    onClick={() => onSelectServiceForQuote(service.id)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-purple-900/50 group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-purple-600 border border-purple-500/40 group-hover:border-purple-300 text-purple-100 group-hover:text-white text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] focus:outline-none cursor-pointer"
                  >
                    <span>دریافت مشاوره و ثبت سفارش</span>
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner for Custom Enterprise AI Projects */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#120b2e]/90 to-indigo-950/60 border border-purple-600/50 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(147,51,234,0.25)] relative overflow-hidden backdrop-blur-2xl">
          {/* Shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine-gleam pointer-events-none" />

          <div className="text-start flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <ShieldCheck className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h4 className="text-white font-black text-base sm:text-lg">ایده اختصاصی یا پروژه خاصی در ذهن دارید؟</h4>
              <p className="text-xs sm:text-sm text-purple-200/70 mt-1">تیم فنی {brandInfo.name || 'تکویکس'} آماده طراحی و پیاده‌سازی هرگونه خط لوله یا سناریوی ویژه هوش مصنوعی است.</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onSelectServiceForQuote('custom-ai')}
            className="relative z-10 w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold whitespace-nowrap shadow-[0_0_25px_rgba(147,51,234,0.6)] hover:shadow-[0_0_35px_rgba(147,51,234,0.8)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>مشاوره پروژه سفارشی</span>
          </button>
        </div>

      </div>
    </section>
  );
};
