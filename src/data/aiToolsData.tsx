import React from 'react';

export interface AIToolItem {
  id: string;
  name: string;
  categoryBadge: string;
  categoryFa: string;
  company: string;
  animType: 'ai-anim-float' | 'ai-anim-scale' | 'ai-anim-tilt' | 'ai-glow-purple' | 'ai-glow-emerald' | 'ai-glow-cyan';
  duration: string;
  delay: string;
  logoUrl: string;
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

export const AI_TOOLS_LIST: AIToolItem[] = [
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    categoryBadge: 'Google AI',
    categoryFa: 'تحلیل چندرسانه‌ای و استدلال',
    company: 'Google DeepMind',
    animType: 'ai-glow-cyan',
    duration: '4.2s',
    delay: '0.8s',
    logoUrl: '/logos/gemini.svg',
    colorScheme: {
      badgeBg: 'rgba(6, 182, 212, 0.15)',
      badgeBorder: 'rgba(6, 182, 212, 0.4)',
      badgeText: '#67e8f9',
      iconBg: 'rgba(6, 182, 212, 0.2)',
      iconBorder: 'rgba(6, 182, 212, 0.5)',
      glowColor: 'rgba(6, 182, 212, 0.35)',
    },
    svgIcon: (
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
    id: 'chatgpt-openai',
    name: 'ChatGPT / OpenAI',
    categoryBadge: 'OpenAI',
    categoryFa: 'تولید محتوا و برنامه‌نویسی',
    company: 'OpenAI',
    animType: 'ai-anim-float',
    duration: '3.6s',
    delay: '0.2s',
    logoUrl: '/logos/chatgpt.svg',
    colorScheme: {
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeBorder: 'rgba(16, 185, 129, 0.4)',
      badgeText: '#6ee7b7',
      iconBg: 'rgba(16, 185, 129, 0.2)',
      iconBorder: 'rgba(16, 185, 129, 0.5)',
      glowColor: 'rgba(16, 185, 129, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 10.5a4.5 4.5 0 0 0-4.1-3.9 4.6 4.6 0 0 0-8.6-1.5 4.6 4.6 0 0 0-4.3 6.3 4.5 4.5 0 0 0 .5 4.1 4.5 4.5 0 0 0 4.1 3.9 4.6 4.6 0 0 0 8.6 1.5 4.6 4.6 0 0 0 4.3-6.3 4.5 4.5 0 0 0-.5-4.1z" />
        <path d="M12 8.5v7" />
        <path d="M8.5 10.5l7 3" />
        <path d="M8.5 13.5l7-3" />
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
    logoUrl: '/logos/midjourney.svg',
    colorScheme: {
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      badgeBorder: 'rgba(168, 85, 247, 0.4)',
      badgeText: '#d8b4fe',
      iconBg: '#ffffff',
      iconBorder: 'rgba(255, 255, 255, 0.4)',
      glowColor: 'rgba(168, 85, 247, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 19.5c4-2 7.5-2 11.5 0 3-1.5 5.5-1.5 7.5 0" />
        <path d="M14 17.5V3L4 16.5h10z" />
        <path d="M14 8.5l6 8h-6" />
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
    logoUrl: '/logos/claude.svg',
    colorScheme: {
      badgeBg: 'rgba(249, 115, 22, 0.15)',
      badgeBorder: 'rgba(249, 115, 22, 0.4)',
      badgeText: '#fdba74',
      iconBg: 'rgba(249, 115, 22, 0.2)',
      iconBorder: 'rgba(249, 115, 22, 0.5)',
      glowColor: 'rgba(249, 115, 22, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#d97706">
        <path d="M13.5 2.5L10.5 2.5L11.2 8.8L6.8 4.4L4.7 6.5L9.2 10.9L2.8 10.2L2.8 13.2L9.2 12.5L4.7 16.9L6.8 19L11.2 14.6L10.5 20.9L13.5 20.9L12.8 14.6L17.2 19L19.3 16.9L14.8 12.5L21.2 13.2L21.2 10.2L14.8 10.9L19.3 6.5L17.2 4.4L12.8 8.8Z" />
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
    logoUrl: '/logos/elevenlabs.svg',
    colorScheme: {
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.4)',
      badgeText: '#7dd3fc',
      iconBg: 'rgba(56, 189, 248, 0.2)',
      iconBorder: 'rgba(56, 189, 248, 0.5)',
      glowColor: 'rgba(56, 189, 248, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#38bdf8">
        <rect x="7" y="3" width="3.5" height="18" rx="1.75" />
        <rect x="13.5" y="3" width="3.5" height="18" rx="1.75" />
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
    logoUrl: '/logos/suno.svg',
    colorScheme: {
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      badgeBorder: 'rgba(236, 72, 153, 0.4)',
      badgeText: '#f472b6',
      iconBg: 'rgba(236, 72, 153, 0.2)',
      iconBorder: 'rgba(236, 72, 153, 0.5)',
      glowColor: 'rgba(236, 72, 153, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#ec4899" strokeWidth="2" />
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="#ec4899" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
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
    logoUrl: '/logos/sora.svg',
    colorScheme: {
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.4)',
      badgeText: '#7dd3fc',
      iconBg: 'rgba(14, 165, 233, 0.2)',
      iconBorder: 'rgba(56, 189, 248, 0.5)',
      glowColor: 'rgba(56, 189, 248, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <path d="M7 17h10c2.2 0 4-1.8 4-4 0-2-1.4-3.6-3.3-3.9C17.3 6.5 14.9 5 12 5c-2.6 0-4.9 1.5-5.9 3.7C4.3 9 3 10.7 3 13c0 2.2 1.8 4 4 4z" fill="#38bdf8" />
        <circle cx="9.5" cy="11.5" r="1" fill="#0f172a" />
        <circle cx="14.5" cy="11.5" r="1" fill="#0f172a" />
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
    logoUrl: '/logos/runway.svg',
    colorScheme: {
      badgeBg: 'rgba(52, 211, 153, 0.15)',
      badgeBorder: 'rgba(52, 211, 153, 0.4)',
      badgeText: '#6ee7b7',
      iconBg: 'rgba(52, 211, 153, 0.2)',
      iconBorder: 'rgba(52, 211, 153, 0.5)',
      glowColor: 'rgba(52, 211, 153, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h7a5 5 0 0 1 5 5 5 5 0 0 1-5 5H4V4z" />
        <path d="M12 14l8 6" />
        <path d="M4 14v6" />
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
    logoUrl: '/logos/kling.svg',
    colorScheme: {
      badgeBg: 'rgba(139, 92, 246, 0.15)',
      badgeBorder: 'rgba(139, 92, 246, 0.4)',
      badgeText: '#c4b5fd',
      iconBg: '#000000',
      iconBorder: 'rgba(255, 255, 255, 0.3)',
      glowColor: 'rgba(139, 92, 246, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.493 21.234c-1.112-1.451-1.109-4.263-.081-7.459l-4.557-2.63a1.683 1.683 0 01-.85-1.304 1.505 1.505 0 01.08-.622 13.18 13.18 0 011.037-2.255c3.476-6.02 10.916-8.23 16.619-4.938.46.266.82.67 1.081 1.184.785 1.545.685 4.096-.234 6.954l4.557 2.631c.339.196.596.492.736.832a1.53 1.53 0 01.034 1.093 13.146 13.146 0 01-1.037 2.255c-3.476 6.02-10.916 8.23-16.619 4.938a2.6 2.6 0 01-.766-.68zm11.096-6.615c-2.073 3.591-5.808 5.316-8.343 3.852-1.267-.731-1.994-2.122-2.145-3.778-.095-1.035.036-2.173.4-3.32.217-.684.517-1.37.902-2.039l.008-.014c2.073-3.59 5.808-5.315 8.343-3.852.633.366 1.13.895 1.49 1.54.986 1.772.922 4.415-.285 6.914-.111.23-.232.457-.362.683l-.008.014z" fill="#ffffff" />
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
    logoUrl: '/logos/flux.svg',
    colorScheme: {
      badgeBg: 'rgba(244, 63, 94, 0.15)',
      badgeBorder: 'rgba(244, 63, 94, 0.4)',
      badgeText: '#fda4af',
      iconBg: 'rgba(244, 63, 94, 0.2)',
      iconBorder: 'rgba(244, 63, 94, 0.5)',
      glowColor: 'rgba(244, 63, 94, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="4.5" rx="1.5" fill="#f43f5e" />
        <rect x="3" y="10" width="13" height="4.5" rx="1.5" fill="#f43f5e" />
        <rect x="3" y="3" width="5" height="18" rx="1.5" fill="#fb7185" />
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
    logoUrl: '/logos/dalle.svg',
    colorScheme: {
      badgeBg: 'rgba(0, 87, 255, 0.15)',
      badgeBorder: 'rgba(0, 87, 255, 0.4)',
      badgeText: '#60a5fa',
      iconBg: '#0057ff',
      iconBorder: 'rgba(0, 87, 255, 0.5)',
      glowColor: 'rgba(0, 87, 255, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#eab308" strokeWidth="2" />
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" stroke="#facc15" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill="#ca8a04" />
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
    logoUrl: '/logos/deepseek.svg',
    colorScheme: {
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeBorder: 'rgba(59, 130, 246, 0.4)',
      badgeText: '#93c5fd',
      iconBg: 'rgba(59, 130, 246, 0.2)',
      iconBorder: 'rgba(59, 130, 246, 0.5)',
      glowColor: 'rgba(59, 130, 246, 0.35)',
    },
    svgIcon: (
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
    id: 'pika-labs',
    name: 'Pika Labs',
    categoryBadge: 'Pika 3D',
    categoryFa: 'جلوه‌های ویژه و افکت‌های ۳D',
    company: 'Pika',
    animType: 'ai-anim-tilt',
    duration: '3.4s',
    delay: '0.7s',
    logoUrl: '/logos/pika.svg',
    colorScheme: {
      badgeBg: 'rgba(251, 191, 36, 0.15)',
      badgeBorder: 'rgba(251, 191, 36, 0.4)',
      badgeText: '#fcd34d',
      iconBg: 'rgba(251, 191, 36, 0.2)',
      iconBorder: 'rgba(251, 191, 36, 0.5)',
      glowColor: 'rgba(251, 191, 36, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#fbbf24">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
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
    logoUrl: '/logos/stable-diffusion.svg',
    colorScheme: {
      badgeBg: 'rgba(217, 70, 239, 0.15)',
      badgeBorder: 'rgba(217, 70, 239, 0.4)',
      badgeText: '#f0abfc',
      iconBg: 'rgba(217, 70, 239, 0.2)',
      iconBorder: 'rgba(217, 70, 239, 0.5)',
      glowColor: 'rgba(217, 70, 239, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 21.5 7.5 21.5 16.5 12 22 2.5 16.5 2.5 7.5 12 2" />
        <circle cx="12" cy="12" r="3" fill="#f0abfc" />
        <line x1="12" y1="2" x2="12" y2="9" />
        <line x1="12" y1="15" x2="12" y2="22" />
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
    logoUrl: '/logos/meta.svg',
    colorScheme: {
      badgeBg: 'rgba(0, 129, 251, 0.15)',
      badgeBorder: 'rgba(0, 129, 251, 0.4)',
      badgeText: '#60a5fa',
      iconBg: 'rgba(0, 129, 251, 0.15)',
      iconBorder: 'rgba(0, 129, 251, 0.4)',
      glowColor: 'rgba(0, 129, 251, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="7.5" stroke="#0081fb" strokeWidth="3.2" />
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
    logoUrl: '/logos/firefly.svg',
    colorScheme: {
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      badgeBorder: 'rgba(239, 68, 68, 0.4)',
      badgeText: '#fca5a5',
      iconBg: 'rgba(239, 68, 68, 0.2)',
      iconBorder: 'rgba(239, 68, 68, 0.5)',
      glowColor: 'rgba(239, 68, 68, 0.35)',
    },
    svgIcon: (
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
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    categoryBadge: 'Perplexity',
    categoryFa: 'پژوهش و جستجوی هوشمند',
    company: 'Perplexity',
    animType: 'ai-anim-tilt',
    duration: '4.5s',
    delay: '1.3s',
    logoUrl: '/logos/perplexity.svg',
    colorScheme: {
      badgeBg: 'rgba(45, 212, 191, 0.15)',
      badgeBorder: 'rgba(45, 212, 191, 0.4)',
      badgeText: '#99f6e4',
      iconBg: 'rgba(45, 212, 191, 0.2)',
      iconBorder: 'rgba(45, 212, 191, 0.5)',
      glowColor: 'rgba(45, 212, 191, 0.35)',
    },
    svgIcon: (
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
    id: 'leonardo-ai',
    name: 'Leonardo AI',
    categoryBadge: 'Leonardo',
    categoryFa: 'طراحی کاراکتر و آبجکت ۳D',
    company: 'Leonardo',
    animType: 'ai-anim-scale',
    duration: '3.6s',
    delay: '0.9s',
    logoUrl: '/logos/leonardo.svg',
    colorScheme: {
      badgeBg: 'rgba(167, 139, 250, 0.15)',
      badgeBorder: 'rgba(167, 139, 250, 0.4)',
      badgeText: '#ddd6fe',
      iconBg: 'rgba(167, 139, 250, 0.2)',
      iconBorder: 'rgba(167, 139, 250, 0.5)',
      glowColor: 'rgba(167, 139, 250, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#a78bfa" strokeWidth="1.8" />
        <polygon points="12 6 16 10 12 18 8 10" fill="#a78bfa" />
        <circle cx="12" cy="10" r="1.5" fill="#ffffff" />
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
    logoUrl: '/logos/grok.svg',
    colorScheme: {
      badgeBg: 'rgba(255, 255, 255, 0.12)',
      badgeBorder: 'rgba(255, 255, 255, 0.35)',
      badgeText: '#ffffff',
      iconBg: '#000000',
      iconBorder: 'rgba(255, 255, 255, 0.3)',
      glowColor: 'rgba(255, 255, 255, 0.3)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 34 33" fill="#ffffff">
        <path d="M13.2371 21.0407L24.3186 12.8506C24.8619 12.4491 25.6384 12.6057 25.8973 13.2294C27.2597 16.5185 26.651 20.4712 23.9403 23.1851C21.2297 25.8989 17.4581 26.4941 14.0108 25.1386L10.2449 26.8843C15.6463 30.5806 22.2053 29.6665 26.304 25.5601C29.5551 22.3051 30.562 17.8683 29.6205 13.8673L29.629 13.8758C28.2637 7.99809 29.9647 5.64871 33.449 0.844576C33.5314 0.730667 33.6139 0.616757 33.6964 0.5L29.1113 5.09055V5.07631L13.2343 21.0436" />
        <path d="M10.9503 23.0313C7.07343 19.3235 7.74185 13.5853 11.0498 10.2763C13.4959 7.82722 17.5036 6.82767 21.0021 8.2971L24.7595 6.55998C24.0826 6.07017 23.215 5.54334 22.2195 5.17313C17.7198 3.31926 12.3326 4.24192 8.67479 7.90126C5.15635 11.4239 4.0499 16.8403 5.94992 21.4622C7.36924 24.9165 5.04257 27.3598 2.69884 29.826C1.86829 30.7002 1.0349 31.5745 0.36364 32.5L10.9474 23.0341" />
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
    logoUrl: '/logos/n8n.svg',
    colorScheme: {
      badgeBg: 'rgba(244, 114, 182, 0.15)',
      badgeBorder: 'rgba(244, 114, 182, 0.4)',
      badgeText: '#fbcfe8',
      iconBg: 'rgba(244, 114, 182, 0.2)',
      iconBorder: 'rgba(244, 114, 182, 0.5)',
      glowColor: 'rgba(244, 114, 182, 0.35)',
    },
    svgIcon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="6" r="3" fill="#f472b6" />
        <circle cx="5" cy="18" r="3" fill="#f472b6" />
        <circle cx="19" cy="12" r="3.5" fill="#ec4899" />
        <path d="M8 6h5a4 4 0 0 1 4 4v2" stroke="#f472b6" strokeWidth="2" />
        <path d="M8 18h5a4 4 0 0 0 4-4v-2" stroke="#f472b6" strokeWidth="2" />
      </svg>
    ),
  },
];
