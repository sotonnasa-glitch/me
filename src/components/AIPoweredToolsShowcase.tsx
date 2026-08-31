import React, { useState } from 'react';
import { Sparkles, Cpu } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface AIToolItem {
  id: string;
  name: string;
  categoryBadge: string;
  categoryFa: string;
  company: string;
  animType: 'ai-anim-float' | 'ai-anim-scale' | 'ai-anim-tilt' | 'ai-glow-purple' | 'ai-glow-emerald' | 'ai-glow-cyan';
  duration: string;
  delay: string;
  colorScheme: {
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    iconBg: string;
    iconBorder: string;
    glowColor: string;
  };
  svgIcon: React.ReactNode;
}

const AI_TOOLS_LIST: AIToolItem[] = [
  {
    id: 'chatgpt-openai',
    name: 'ChatGPT / OpenAI',
    categoryBadge: 'OpenAI',
    categoryFa: 'تولید محتوا و برنامه‌نویسی',
    company: 'OpenAI',
    animType: 'ai-anim-float',
    duration: '3.6s',
    delay: '0.2s',
    colorScheme: {
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeBorder: 'rgba(16, 185, 129, 0.4)',
      badgeText: '#6ee7b7',
      iconBg: 'rgba(16, 185, 129, 0.2)',
      iconBorder: 'rgba(16, 185, 129, 0.5)',
      glowColor: 'rgba(16, 185, 129, 0.35)',
    },
    svgIcon: (
      /* Official OpenAI / ChatGPT Swirl Knot Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 10.5a4.5 4.5 0 0 0-4.1-3.9 4.6 4.6 0 0 0-8.6-1.5 4.6 4.6 0 0 0-4.3 6.3 4.5 4.5 0 0 0 .5 4.1 4.5 4.5 0 0 0 4.1 3.9 4.6 4.6 0 0 0 8.6 1.5 4.6 4.6 0 0 0 4.3-6.3 4.5 4.5 0 0 0-.5-4.1z" />
        <path d="M12 8.5v7" />
        <path d="M8.5 10.5l7 3" />
        <path d="M8.5 13.5l7-3" />
      </svg>
    ),
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    categoryBadge: 'Google AI',
    categoryFa: 'تحلیل چندرسانه‌ای و استدلال',
    company: 'Google DeepMind',
    animType: 'ai-glow-cyan',
    duration: '4.2s',
    delay: '0.8s',
    colorScheme: {
      badgeBg: 'rgba(6, 182, 212, 0.15)',
      badgeBorder: 'rgba(6, 182, 212, 0.4)',
      badgeText: '#67e8f9',
      iconBg: 'rgba(6, 182, 212, 0.2)',
      iconBorder: 'rgba(6, 182, 212, 0.5)',
      glowColor: 'rgba(6, 182, 212, 0.35)',
    },
    svgIcon: (
      /* Official Google Gemini Star/Sparkle 4-point Diamond Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 1.5C12 7.299 7.299 12 1.5 12C7.299 12 12 16.701 12 22.5C12 16.701 16.701 12 22.5 12C16.701 12 12 7.299 12 1.5Z"
          fill="url(#geminiGradShowcase)"
        />
        <defs>
          <linearGradient id="geminiGradShowcase" x1="1.5" y1="1.5" x2="22.5" y2="22.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="0.5" stopColor="#818cf8" />
            <stop offset="1" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'claude-anthropic',
    name: 'Claude (Anthropic)',
    categoryBadge: 'Anthropic',
    categoryFa: 'استدلال پیشرفته و کدنویسی',
    company: 'Anthropic',
    animType: 'ai-anim-scale',
    duration: '3.8s',
    delay: '1.4s',
    colorScheme: {
      badgeBg: 'rgba(249, 115, 22, 0.15)',
      badgeBorder: 'rgba(249, 115, 22, 0.4)',
      badgeText: '#fdba74',
      iconBg: 'rgba(249, 115, 22, 0.2)',
      iconBorder: 'rgba(249, 115, 22, 0.5)',
      glowColor: 'rgba(249, 115, 22, 0.35)',
    },
    svgIcon: (
      /* Official Anthropic Claude Radiant Sunburst Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#d97706">
        <path d="M13.5 2.5L10.5 2.5L11.2 8.8L6.8 4.4L4.7 6.5L9.2 10.9L2.8 10.2L2.8 13.2L9.2 12.5L4.7 16.9L6.8 19L11.2 14.6L10.5 20.9L13.5 20.9L12.8 14.6L17.2 19L19.3 16.9L14.8 12.5L21.2 13.2L21.2 10.2L14.8 10.9L19.3 6.5L17.2 4.4L12.8 8.8Z" />
      </svg>
    ),
  },
  {
    id: 'midjourney',
    name: 'Midjourney v6.1',
    categoryBadge: 'Midjourney',
    categoryFa: 'تصویرسازی فوق‌حرفه‌ای',
    company: 'Midjourney Inc',
    animType: 'ai-glow-purple',
    duration: '4.5s',
    delay: '0.4s',
    colorScheme: {
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      badgeBorder: 'rgba(168, 85, 247, 0.4)',
      badgeText: '#d8b4fe',
      iconBg: 'rgba(168, 85, 247, 0.2)',
      iconBorder: 'rgba(168, 85, 247, 0.5)',
      glowColor: 'rgba(168, 85, 247, 0.35)',
    },
    svgIcon: (
      /* Official Midjourney Sailboat / Mystic Sail Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 19.5c4-2 7.5-2 11.5 0 3-1.5 5.5-1.5 7.5 0" />
        <path d="M14 17.5V3L4 16.5h10z" />
        <path d="M14 8.5l6 8h-6" />
      </svg>
    ),
  },
  {
    id: 'suno-ai',
    name: 'Suno AI v3.5',
    categoryBadge: 'Suno AI',
    categoryFa: 'آهنگسازی و موزیک اختصاصی',
    company: 'Suno',
    animType: 'ai-anim-tilt',
    duration: '3.2s',
    delay: '1.1s',
    colorScheme: {
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      badgeBorder: 'rgba(236, 72, 153, 0.4)',
      badgeText: '#f472b6',
      iconBg: 'rgba(236, 72, 153, 0.2)',
      iconBorder: 'rgba(236, 72, 153, 0.5)',
      glowColor: 'rgba(236, 72, 153, 0.35)',
    },
    svgIcon: (
      /* Official Suno AI Audio Waves & Record Disc Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#ec4899" strokeWidth="2" />
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="#ec4899" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    categoryBadge: 'ElevenLabs',
    categoryFa: 'گویندگی و شبیه‌سازی صدا',
    company: 'ElevenLabs',
    animType: 'ai-anim-float',
    duration: '4.0s',
    delay: '0.6s',
    colorScheme: {
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.4)',
      badgeText: '#7dd3fc',
      iconBg: 'rgba(56, 189, 248, 0.2)',
      iconBorder: 'rgba(56, 189, 248, 0.5)',
      glowColor: 'rgba(56, 189, 248, 0.35)',
    },
    svgIcon: (
      /* Official ElevenLabs Vertical Dual-Bar Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#38bdf8">
        <rect x="7" y="3" width="3.5" height="18" rx="1.75" />
        <rect x="13.5" y="3" width="3.5" height="18" rx="1.75" />
      </svg>
    ),
  },
  {
    id: 'runway-ml',
    name: 'Runway Gen-3',
    categoryBadge: 'Runway ML',
    categoryFa: 'تیزرهای سینماتیک ویدیویی',
    company: 'Runway ML',
    animType: 'ai-glow-emerald',
    duration: '4.8s',
    delay: '1.9s',
    colorScheme: {
      badgeBg: 'rgba(52, 211, 153, 0.15)',
      badgeBorder: 'rgba(52, 211, 153, 0.4)',
      badgeText: '#6ee7b7',
      iconBg: 'rgba(52, 211, 153, 0.2)',
      iconBorder: 'rgba(52, 211, 153, 0.5)',
      glowColor: 'rgba(52, 211, 153, 0.35)',
    },
    svgIcon: (
      /* Official Runway ML Futuristic 'R' Infinite Track Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h7a5 5 0 0 1 5 5 5 5 0 0 1-5 5H4V4z" />
        <path d="M12 14l8 6" />
        <path d="M4 14v6" />
      </svg>
    ),
  },
  {
    id: 'sora-openai',
    name: 'Sora (OpenAI)',
    categoryBadge: 'Sora Video',
    categoryFa: 'تولید ویدیوهای واقع‌گرایانه',
    company: 'OpenAI',
    animType: 'ai-anim-scale',
    duration: '3.5s',
    delay: '0.3s',
    colorScheme: {
      badgeBg: 'rgba(20, 184, 166, 0.15)',
      badgeBorder: 'rgba(20, 184, 166, 0.4)',
      badgeText: '#5eead4',
      iconBg: 'rgba(20, 184, 166, 0.2)',
      iconBorder: 'rgba(20, 184, 166, 0.5)',
      glowColor: 'rgba(20, 184, 166, 0.35)',
    },
    svgIcon: (
      /* Official Sora / Video Horizon Lens Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="4" stroke="#14b8a6" strokeWidth="2" />
        <path d="M9.5 8.5L16 12L9.5 15.5V8.5Z" fill="#14b8a6" />
        <circle cx="18" cy="7" r="1" fill="#5eead4" />
      </svg>
    ),
  },
  {
    id: 'flux-1',
    name: 'Flux.1 Pro',
    categoryBadge: 'Flux.1',
    categoryFa: 'رندر دقیق متن و چهره',
    company: 'Black Forest Labs',
    animType: 'ai-anim-tilt',
    duration: '4.4s',
    delay: '1.7s',
    colorScheme: {
      badgeBg: 'rgba(244, 63, 94, 0.15)',
      badgeBorder: 'rgba(244, 63, 94, 0.4)',
      badgeText: '#fda4af',
      iconBg: 'rgba(244, 63, 94, 0.2)',
      iconBorder: 'rgba(244, 63, 94, 0.5)',
      glowColor: 'rgba(244, 63, 94, 0.35)',
    },
    svgIcon: (
      /* Official Black Forest Labs Flux Geometric 'F' Block Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="4.5" rx="1.5" fill="#f43f5e" />
        <rect x="3" y="10" width="13" height="4.5" rx="1.5" fill="#f43f5e" />
        <rect x="3" y="3" width="5" height="18" rx="1.5" fill="#fb7185" />
      </svg>
    ),
  },
  {
    id: 'kling-ai',
    name: 'Kling AI',
    categoryBadge: 'Kling AI',
    categoryFa: 'انیمیشن و موشن سینمایی',
    company: 'Kuaishou',
    animType: 'ai-anim-float',
    duration: '3.7s',
    delay: '1.2s',
    colorScheme: {
      badgeBg: 'rgba(139, 92, 246, 0.15)',
      badgeBorder: 'rgba(139, 92, 246, 0.4)',
      badgeText: '#c4b5fd',
      iconBg: 'rgba(139, 92, 246, 0.2)',
      iconBorder: 'rgba(139, 92, 246, 0.5)',
      glowColor: 'rgba(139, 92, 246, 0.35)',
    },
    svgIcon: (
      /* Official Kling AI Camera Reel Ring Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.5" stroke="#8b5cf6" strokeWidth="2.2" />
        <path d="M9 8l7 4-7 4V8z" fill="#8b5cf6" />
        <circle cx="12" cy="4" r="1.2" fill="#c4b5fd" />
        <circle cx="12" cy="20" r="1.2" fill="#c4b5fd" />
      </svg>
    ),
  },
  {
    id: 'deepseek',
    name: 'DeepSeek R1',
    categoryBadge: 'DeepSeek',
    categoryFa: 'الگوریتم‌های ریاضی و کدنویسی',
    company: 'DeepSeek',
    animType: 'ai-glow-cyan',
    duration: '4.6s',
    delay: '0.5s',
    colorScheme: {
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeBorder: 'rgba(59, 130, 246, 0.4)',
      badgeText: '#93c5fd',
      iconBg: 'rgba(59, 130, 246, 0.2)',
      iconBorder: 'rgba(59, 130, 246, 0.5)',
      glowColor: 'rgba(59, 130, 246, 0.35)',
    },
    svgIcon: (
      /* Official DeepSeek Blue Whale / Orbit Eye Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12C3 6.5 7.5 3 12 3C17.5 3 21 7 21 12C21 17 17 21 12 21C6.5 21 3 17 3 12Z"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="4" fill="#3b82f6" />
        <circle cx="10.5" cy="10.5" r="1.5" fill="#ffffff" />
        <path d="M19 12c1.5-1 2.5-3 2.5-3s-1 1-2.5 1.5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'dall-e-3',
    name: 'DALL·E 3',
    categoryBadge: 'DALL-E',
    categoryFa: 'خلق ایده‌های نوآورانه بصری',
    company: 'OpenAI',
    animType: 'ai-anim-scale',
    duration: '4.1s',
    delay: '1.5s',
    colorScheme: {
      badgeBg: 'rgba(234, 179, 8, 0.15)',
      badgeBorder: 'rgba(234, 179, 8, 0.4)',
      badgeText: '#fde047',
      iconBg: 'rgba(234, 179, 8, 0.2)',
      iconBorder: 'rgba(234, 179, 8, 0.5)',
      glowColor: 'rgba(234, 179, 8, 0.35)',
    },
    svgIcon: (
      /* Official DALL·E Colorful Creative Palette Ray Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#eab308" strokeWidth="2" />
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" stroke="#facc15" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill="#ca8a04" />
      </svg>
    ),
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    categoryBadge: 'Stability',
    categoryFa: 'تیونینگ مدل‌های اختصاصی',
    company: 'Stability AI',
    animType: 'ai-glow-purple',
    duration: '3.9s',
    delay: '2.1s',
    colorScheme: {
      badgeBg: 'rgba(217, 70, 239, 0.15)',
      badgeBorder: 'rgba(217, 70, 239, 0.4)',
      badgeText: '#f0abfc',
      iconBg: 'rgba(217, 70, 239, 0.2)',
      iconBorder: 'rgba(217, 70, 239, 0.5)',
      glowColor: 'rgba(217, 70, 239, 0.35)',
    },
    svgIcon: (
      /* Official Stability AI Connected Hexagon Latent Space Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 21.5 7.5 21.5 16.5 12 22 2.5 16.5 2.5 7.5 12 2" />
        <circle cx="12" cy="12" r="3" fill="#f0abfc" />
        <line x1="12" y1="2" x2="12" y2="9" />
        <line x1="12" y1="15" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    id: 'pika-labs',
    name: 'Pika Labs',
    categoryBadge: 'Pika 3D',
    categoryFa: 'جلوه‌های ویژه و افکت‌های ۳D',
    company: 'Pika',
    animType: 'ai-anim-tilt',
    duration: '3.4s',
    delay: '0.7s',
    colorScheme: {
      badgeBg: 'rgba(251, 191, 36, 0.15)',
      badgeBorder: 'rgba(251, 191, 36, 0.4)',
      badgeText: '#fcd34d',
      iconBg: 'rgba(251, 191, 36, 0.2)',
      iconBorder: 'rgba(251, 191, 36, 0.5)',
      glowColor: 'rgba(251, 191, 36, 0.35)',
    },
    svgIcon: (
      /* Official Pika Labs Spark Lightning Dynamic Star Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#fbbf24">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
      </svg>
    ),
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly',
    categoryBadge: 'Adobe AI',
    categoryFa: 'گرافیک تجاری و وکتور',
    company: 'Adobe',
    animType: 'ai-anim-float',
    duration: '4.3s',
    delay: '1.6s',
    colorScheme: {
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      badgeBorder: 'rgba(239, 68, 68, 0.4)',
      badgeText: '#fca5a5',
      iconBg: 'rgba(239, 68, 68, 0.2)',
      iconBorder: 'rgba(239, 68, 68, 0.5)',
      glowColor: 'rgba(239, 68, 68, 0.35)',
    },
    svgIcon: (
      /* Official Adobe Firefly Creative Flame Silhouette Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C10.5 5 6.5 8 6.5 13.5C6.5 17 9 20 12 21C15 20 17.5 17 17.5 13.5C17.5 10 14.5 7 12 2Z"
          fill="url(#fireflyGradShowcase)"
        />
        <circle cx="12" cy="14" r="2.5" fill="#ffffff" />
        <defs>
          <linearGradient id="fireflyGradShowcase" x1="6.5" y1="2" x2="17.5" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff4b4b" />
            <stop offset="0.5" stopColor="#ff8533" />
            <stop offset="1" stopColor="#ffcc00" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'meta-llama',
    name: 'Meta AI (Llama 3)',
    categoryBadge: 'Meta AI',
    categoryFa: 'موتور پردازش سریع متن',
    company: 'Meta',
    animType: 'ai-glow-cyan',
    duration: '4.7s',
    delay: '2.0s',
    colorScheme: {
      badgeBg: 'rgba(2, 132, 199, 0.15)',
      badgeBorder: 'rgba(2, 132, 199, 0.4)',
      badgeText: '#7dd3fc',
      iconBg: 'rgba(2, 132, 199, 0.2)',
      iconBorder: 'rgba(2, 132, 199, 0.5)',
      glowColor: 'rgba(2, 132, 199, 0.35)',
    },
    svgIcon: (
      /* Official Meta Infinity Loop Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M16.5 6C14.3 6 12.8 7.5 12 8.7C11.2 7.5 9.7 6 7.5 6C4.5 6 2 8.5 2 12C2 15.5 4.5 18 7.5 18C9.7 18 11.2 16.5 12 15.3C12.8 16.5 14.3 18 16.5 18C19.5 18 22 15.5 22 12C22 8.5 19.5 6 16.5 6ZM7.5 15.5C5.8 15.5 4.5 14 4.5 12C4.5 10 5.8 8.5 7.5 8.5C9.2 8.5 10.5 10.2 11.3 12C10.5 13.8 9.2 15.5 7.5 15.5ZM16.5 15.5C14.8 15.5 13.5 13.8 12.7 12C13.5 10.2 14.8 8.5 16.5 8.5C18.2 8.5 19.5 10 19.5 12C19.5 14 18.2 15.5 16.5 15.5Z"
          fill="#0284c7"
        />
      </svg>
    ),
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo AI',
    categoryBadge: 'Leonardo',
    categoryFa: 'طراحی کاراکتر و آبجکت ۳D',
    company: 'Leonardo',
    animType: 'ai-anim-scale',
    duration: '3.6s',
    delay: '0.9s',
    colorScheme: {
      badgeBg: 'rgba(167, 139, 250, 0.15)',
      badgeBorder: 'rgba(167, 139, 250, 0.4)',
      badgeText: '#ddd6fe',
      iconBg: 'rgba(167, 139, 250, 0.2)',
      iconBorder: 'rgba(167, 139, 250, 0.5)',
      glowColor: 'rgba(167, 139, 250, 0.35)',
    },
    svgIcon: (
      /* Official Leonardo AI Prismatic Diamond Shield Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#a78bfa" strokeWidth="1.8" />
        <polygon points="12 6 16 10 12 18 8 10" fill="#a78bfa" />
        <circle cx="12" cy="10" r="1.5" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    categoryBadge: 'Perplexity',
    categoryFa: 'پژوهش و جستجوی هوشمند',
    company: 'Perplexity',
    animType: 'ai-anim-tilt',
    duration: '4.5s',
    delay: '1.3s',
    colorScheme: {
      badgeBg: 'rgba(45, 212, 191, 0.15)',
      badgeBorder: 'rgba(45, 212, 191, 0.4)',
      badgeText: '#99f6e4',
      iconBg: 'rgba(45, 212, 191, 0.2)',
      iconBorder: 'rgba(45, 212, 191, 0.5)',
      glowColor: 'rgba(45, 212, 191, 0.35)',
    },
    svgIcon: (
      /* Official Perplexity Asterisk Grid Compass Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
        <circle cx="12" cy="12" r="3" fill="#14b8a6" />
      </svg>
    ),
  },
  {
    id: 'n8n-automation',
    name: 'n8n & Workflow',
    categoryBadge: 'n8n AI',
    categoryFa: 'اتوماسیون ربات‌ها و وب‌هوک',
    company: 'n8n.io',
    animType: 'ai-glow-emerald',
    duration: '4.2s',
    delay: '2.3s',
    colorScheme: {
      badgeBg: 'rgba(244, 114, 182, 0.15)',
      badgeBorder: 'rgba(244, 114, 182, 0.4)',
      badgeText: '#fbcfe8',
      iconBg: 'rgba(244, 114, 182, 0.2)',
      iconBorder: 'rgba(244, 114, 182, 0.5)',
      glowColor: 'rgba(244, 114, 182, 0.35)',
    },
    svgIcon: (
      /* Official n8n Node Connectors Network Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="6" r="3" fill="#f472b6" />
        <circle cx="5" cy="18" r="3" fill="#f472b6" />
        <circle cx="19" cy="12" r="3.5" fill="#ec4899" />
        <path d="M8 6h5a4 4 0 0 1 4 4v2" stroke="#f472b6" strokeWidth="2" />
        <path d="M8 18h5a4 4 0 0 0 4-4v-2" stroke="#f472b6" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'grok-xai',
    name: 'Grok (xAI)',
    categoryBadge: 'xAI Grok',
    categoryFa: 'داده‌های لحظه‌ای و زنده',
    company: 'xAI / Elon Musk',
    animType: 'ai-anim-float',
    duration: '3.9s',
    delay: '0.1s',
    colorScheme: {
      badgeBg: 'rgba(255, 255, 255, 0.12)',
      badgeBorder: 'rgba(255, 255, 255, 0.35)',
      badgeText: '#ffffff',
      iconBg: 'rgba(255, 255, 255, 0.15)',
      iconBorder: 'rgba(255, 255, 255, 0.4)',
      glowColor: 'rgba(255, 255, 255, 0.3)',
    },
    svgIcon: (
      /* Official xAI / Grok Angular Slash Logo */
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export const AIPoweredToolsShowcase: React.FC = () => {
  const { brandInfo } = useSiteData();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredTools =
    activeFilter === 'all'
      ? AI_TOOLS_LIST
      : activeFilter === 'visual'
      ? AI_TOOLS_LIST.filter((t) => ['midjourney', 'flux-1', 'adobe-firefly', 'leonardo-ai', 'dall-e-3', 'stable-diffusion'].includes(t.id))
      : activeFilter === 'video'
      ? AI_TOOLS_LIST.filter((t) => ['runway-ml', 'sora-openai', 'kling-ai', 'pika-labs'].includes(t.id))
      : activeFilter === 'audio'
      ? AI_TOOLS_LIST.filter((t) => ['suno-ai', 'elevenlabs'].includes(t.id))
      : AI_TOOLS_LIST.filter((t) => ['chatgpt-openai', 'google-gemini', 'claude-anthropic', 'deepseek', 'meta-llama', 'perplexity-ai', 'n8n-automation', 'grok-xai'].includes(t.id));

  return (
    <div
      className="p-4 sm:p-7 rounded-3xl bg-[#100828]/95 sm:bg-gradient-to-br sm:from-[#180e38]/95 sm:via-[#0f0928]/95 sm:to-[#080516] border border-purple-500/35 sm:border-purple-500/40 shadow-xl relative overflow-hidden backdrop-blur-md sm:backdrop-blur-2xl text-white gpu-accelerated"
      dir="rtl"
    >
      {/* Subtle ambient light - optimized with low blur on mobile */}
      <div className="absolute -top-10 end-0 w-40 sm:w-56 h-40 sm:h-56 bg-purple-600/15 sm:bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 start-0 w-40 sm:w-56 h-40 sm:h-56 bg-cyan-600/15 sm:bg-cyan-600/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Live AI Pulse & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-sm shrink-0">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 animate-pulse" />
            </span>
            <h3 className="text-sm sm:text-lg font-black text-white leading-tight">
              قدرت‌گرفته از بهترین ابزارهای هوش مصنوعی دنیا
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-purple-200/75 font-medium ps-9 sm:ps-10">
            تلفیق رسمی بیش از ۲۰ موتور برتر جهانی برای بالاترین کیفیت در تکویکس
          </p>
        </div>

        <div className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-400/40 text-purple-200 text-[11px] font-bold flex items-center gap-1.5 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>+۲۰ موتور فعال</span>
        </div>
      </div>

      {/* Filter Tabs - Smooth horizontal touch scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3.5 sm:mb-4 custom-scrollbar relative z-10 touch-pan-x overscroll-contain">
        {[
          { id: 'all', label: 'همه ابزارها' },
          { id: 'visual', label: 'تصویر و گرافیک' },
          { id: 'video', label: 'ویدیو و تیزر' },
          { id: 'audio', label: 'صدا و موزیک' },
          { id: 'code', label: 'متن و اتوماسیون' },
        ].map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer select-none active:scale-95 ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/50'
                : 'bg-white/[0.05] hover:bg-white/[0.09] text-gray-300 border border-white/5'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Grid of AI Cards with Official Logos & High Performance Rendering */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 relative z-10 max-h-[380px] sm:max-h-[400px] overflow-y-auto pe-1 custom-scrollbar overscroll-contain touch-pan-y">
        {filteredTools.map((tool) => {
          return (
            <div
              key={tool.id}
              style={{
                animationDuration: tool.duration,
                animationDelay: tool.delay,
              }}
              className={`${tool.animType} group relative p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300 flex flex-col justify-between gap-2.5 sm:gap-3 cursor-pointer backdrop-blur-sm sm:backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]`}
            >
              {/* Card Top: Official Logo Icon + Clean Unclipped Badge */}
              <div className="flex items-center justify-between gap-1.5">
                <div
                  style={{
                    backgroundColor: tool.colorScheme.iconBg,
                    borderColor: tool.colorScheme.iconBorder,
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105"
                >
                  {tool.svgIcon}
                </div>

                <span
                  style={{
                    backgroundColor: tool.colorScheme.badgeBg,
                    borderColor: tool.colorScheme.badgeBorder,
                    color: tool.colorScheme.badgeText,
                  }}
                  className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-md border whitespace-nowrap shrink-0"
                >
                  {tool.categoryBadge}
                </span>
              </div>

              {/* Card Bottom: Official Tool Name & Persian Speciality */}
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs font-black text-white group-hover:text-purple-200 transition-colors truncate">
                  {tool.name}
                </h4>
                <p className="text-[10px] text-gray-400 group-hover:text-gray-200 transition-colors truncate">
                  {tool.categoryFa}
                </p>
              </div>

              {/* Ambient Glow Accent for Desktop Hover */}
              <div
                style={{ backgroundColor: tool.colorScheme.glowColor }}
                className="hidden sm:block absolute -top-4 -end-4 w-12 h-12 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              />
            </div>
          );
        })}
      </div>

      {/* Persian Descriptive Statement */}
      <div className="mt-3.5 sm:mt-4 p-3 sm:p-3.5 rounded-2xl bg-purple-950/50 border border-purple-500/30 relative z-10 flex items-center gap-2.5 sm:gap-3">
        <Sparkles className="w-4 h-4 text-purple-300 shrink-0 animate-pulse" />
        <p className="text-xs text-purple-100/90 leading-relaxed font-medium">
          ما از پیشرفته‌ترین ابزارهای هوش مصنوعی دنیا برای ساخت سایت، طراحی گرافیک، تولید ویدیو و ساخت موزیک استفاده می‌کنیم.
        </p>
      </div>

      {/* Telegram Direct Contact Line (Exact format preserved) */}
      <div className="mt-3 sm:mt-3.5 pt-3 sm:pt-3.5 border-t border-purple-500/20 text-center relative z-10">
        <p className="text-xs text-purple-200 flex items-center justify-center gap-1.5 flex-wrap">
          <span>ارتباط مستقیم با مدیریت فنی تکویکس:</span>
          <a
            href={`https://t.me/${brandInfo.telegramHandle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-bold text-cyan-300 hover:text-white transition-colors tracking-wide underline underline-offset-4 decoration-cyan-400/40 hover:decoration-white"
          >
            {brandInfo.telegramHandle}
          </a>
        </p>
      </div>
    </div>
  );
};
