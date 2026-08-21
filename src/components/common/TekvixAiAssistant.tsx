import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Video,
  Code2,
  Send as TelegramIcon,
  Palette,
  Music,
  ArrowLeft,
  Check,
  RefreshCw,
  Zap,
  MessageSquare,
  Volume2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { useSiteData } from '../../context/SiteDataContext';

interface TekvixAiAssistantProps {
  onOpenOrderModal: (serviceId?: string) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'model',
    text: `سلام! من **دستیار فوق‌هوشمند تکویکس (Tekvix AI)** هستم 🤖✨\n\nمی‌توانم در زمینه‌های زیر به شما مشاوره دهم یا سناریو و پرامپت بنویسم:\n• 🌐 **طراحی و راه‌اندازی وب‌سایت با پنل ادمین اختصاصی**\n• 🎬 **تولید سناریو و تیزرهای تبلیغاتی 4K با هوش مصنوعی**\n• 🤖 **طراحی و امکانات ربات‌های پیشرفته تلگرام**\n• 🎨 **خلق تصاویر هنری، لوگو و هویت بصری مدرن**\n• 🎵 **آهنگسازی و صداگذاری نریشن حرفه‌ای**\n\nچه سوال یا پروژه‌ای در ذهن دارید؟`,
    timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
  },
];

const PROMPT_SUGGESTIONS = [
  {
    icon: Code2,
    label: 'برآورد هزینه و زمان طراحی وب‌سایت',
    prompt: 'هزینه و زمان تحویل یک وب‌سایت شرکتی مدرن با پنل ادمین چقدر است؟',
  },
  {
    icon: Video,
    label: 'سناریو و ایده تیزر تبلیغاتی 4K',
    prompt: 'یک ایده و سناریوی جذاب برای ساخت ویدیوی تبلیغاتی هوش مصنوعی بنویس.',
  },
  {
    icon: TelegramIcon,
    label: 'امکانات و هزینه ربات تلگرام',
    prompt: 'یک ربات تلگرام فروشگاهی و پشتیبانی هوشمند چه قابلیت‌هایی دارد؟',
  },
  {
    icon: Palette,
    label: 'خلق تصاویر و لوگوی هوش مصنوعی',
    prompt: 'بهترین سبک‌های تصویرسازی با هوش مصنوعی برای برندینگ شرکتی چیست؟',
  },
];

// High quality client-side fallback knowledge engine
function getSmartClientFallback(query: string): string {
  const q = query.trim().toLowerCase();

  if (q.includes('وب‌سایت') || q.includes('سایت') || q.includes('وبسایت') || q.includes('پنل') || q.includes('ادمین')) {
    return `🌐 **مشاوره و شرایط طراحی وب‌سایت با هوش مصنوعی تکویکس:**\n\n` +
      `⚡ **زمان تحویل:** ۳ الی ۵ روز کاری (کامل و آماده بهره‌برداری)\n` +
      `💎 **تکنولوژی:** React 19، Tailwind CSS، Node.js با بالاترین امتیاز سرعت سئو و لود زیر ۱ ثانیه\n` +
      `🛡 **امکانات پنل ادمین:**\n` +
      `• مدیریت سفارشات، کاربران و آمار تحلیلی زنده\n` +
      `• اتصال خودکار به ربات تلگرام برای ارسال فوری نوتیفیکیشن‌ها\n` +
      `• سیستم ضد نفوذ و پایداری بالا\n\n` +
      `💰 **هزینه:** از ۴,۵۰۰,۰۰۰ تومان برای لندینگ‌پیج و ۶,۸۰۰,۰۰۰ تا ۹,۵۰۰,۰۰۰ تومان برای سامانه‌های جامع شرکتی/فروشگاهی.\n\n` +
      `🚀 برای ثبت پروژه روی دکمه «ثبت سفارش» بزنید یا به تلگرام @Lawat_kar پیام دهید.`;
  }

  if (q.includes('ویدیو') || q.includes('تیزر') || q.includes('فیلم') || q.includes('ریلز') || q.includes('سناریو')) {
    return `🎬 **تولید ویدیو و تیزرهای تبلیغاتی 4K با هوش مصنوعی:**\n\n` +
      `✨ **ویژگی‌های خروجی تکویکس:**\n` +
      `• سناریونویسی و قلاب بصری جذاب برای اینستاگرام و یوتیوب\n` +
      `• متحرک‌سازی تصاویر و مدل‌های سه‌بعدی با کیفیت 4K\n` +
      `• نریشن و گویندگی استودیویی طبیعی با زبان و لحن دلخواه\n` +
      `• موسیقی متن اختصاصی بدون کپی‌رایت\n\n` +
      `⏱ **زمان تحویل:** ۱ تا ۲ روز کاری | هزینه: از ۲,۸۰۰,۰۰۰ تومان\n\n` +
      `📌 مایلید سناریوی اختصاصی برای چه محصولی بنویسم؟`;
  }

  if (q.includes('ربات') || q.includes('تلگرام') || q.includes('bot')) {
    return `🤖 **طراحی و پیاده‌سازی ربات‌های هوشمند تلگرام:**\n\n` +
      `🔹 **قابلیت‌ها:**\n` +
      `• پاسخگویی ۲۴ ساعته مجهز به هوش مصنوعی با قابلیت درک زبان محاوره‌ای\n` +
      `• سیستم ثبت سفارش، سبد خرید و اتصال به درگاه پرداخت\n` +
      `• ارسال پیام آنی به پی‌وی ادمین و مشتریان\n` +
      `• سرورهای پرسرعت اختصاصی بدون قطعی\n\n` +
      `⏱ **زمان تحویل:** ۳ الی ۶ روز کاری | هزینه: از ۳,۵۰۰,۰۰۰ تومان\n\n` +
      `🚀 برای سفارش ربات، دکمه «ثبت سفارش» را لمس کنید!`;
  }

  if (q.includes('قیمت') || q.includes('هزینه') || q.includes('تعرفه') || q.includes('چقدر')) {
    return `💎 **لیست تعرفه خدمات تخصصی تکویکس:**\n\n` +
      `• 🌐 **طراحی وب‌سایت با هوش مصنوعی:** از ۴,۵۰۰,۰۰۰ تومان\n` +
      `• 🎬 **تولید تیزر و ویدیو 4K:** از ۲,۸۰۰,۰۰۰ تومان\n` +
      `• 🤖 **ساخت ربات تلگرام پیشرفته:** از ۳,۵۰۰,۰۰۰ تومان\n` +
      `• 🎨 **خلق تصاویر و پکیج گرافیکی:** از ۱,۲۰۰,۰۰۰ تومان\n` +
      `• 🎵 **آهنگسازی و نریشن صوتی:** از ۱,۵۰۰,۰۰۰ تومان\n\n` +
      `🎁 **تخفیف ویژه افتتاحیه:** برای استفاده از هدایای ویژه، هم‌اکنون سفارش خود را ثبت کنید.`;
  }

  return `✨ **پاسخ هوش مصنوعی تکویکس:**\n\n` +
    `درخواست شما با موفقیت دریافت و تحلیل شد.\n` +
    `ما در تکویکس با تلفیق آخرین تکنولوژی‌های هوش مصنوعی (Gemini، Midjourney، Claude، Runway) تمام نیازهای نرم‌افزاری، رسانه‌ای و محتوایی شما را به بهترین شکل ممکن پیاده‌سازی می‌کنیم.\n\n` +
    `📌 برای راهنمایی دقیق‌تر و ثبت پروژه، می‌توانید با زدن دکمه «ثبت سفارش» یا پیام به آیدی تلگرام **@Lawat_kar** با ما در ارتباط باشید.`;
}

export const TekvixAiAssistant: React.FC<TekvixAiAssistantProps> = ({
  onOpenOrderModal,
  onNavigateToSection,
}) => {
  const { navigateToSection } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      let replyText = '';
      if (response.ok) {
        const data = await response.json();
        replyText = data.text || getSmartClientFallback(text);
      } else {
        replyText = getSmartClientFallback(text);
      }

      const modelMessage: ChatMessage = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err) {
      const smartFallback = getSmartClientFallback(text);
      const modelMessage: ChatMessage = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        text: smartFallback,
        timestamp: new Date().toLocaleTimeString('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, modelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Futuristic Cyber Crystal Badge) */}
      {!isOpen && (
        <div className="fixed bottom-6 start-6 z-40 flex items-center">
          <button
            type="button"
            id="floating-ai-assistant-btn"
            onClick={() => setIsOpen(true)}
            aria-label="دستیار هوش مصنوعی تکویکس"
            className="group relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-purple-900/90 via-violet-900/90 to-indigo-900/90 hover:from-purple-800 hover:to-indigo-800 text-white font-semibold shadow-[0_0_30px_rgba(168,85,247,0.55)] border border-purple-400/60 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
            title="گفتگو با دستیار هوش مصنوعی تکویکس"
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-gleam pointer-events-none" />

            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.8)]">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-80" />
              <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#09090b]" />
            </div>

            <div className="hidden sm:flex flex-col text-start">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white">دستیار هوش مصنوعی</span>
                <span className="px-1.5 py-0.2 rounded bg-purple-500/30 border border-purple-400/40 text-[9px] font-mono text-purple-200 font-bold">
                  AI PRO
                </span>
              </div>
              <span className="text-[10px] text-purple-300/80">پاسخگوی زنده استعلامات</span>
            </div>

            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Floating Chat Window (Cyber Cosmic Theme) */}
      {isOpen && (
        <div
          id="ai-assistant-modal-window"
          className={`fixed z-50 transition-all duration-300 flex flex-col ${
            isExpanded
              ? 'inset-3 sm:inset-8 rounded-3xl'
              : 'bottom-3 start-3 sm:bottom-6 sm:start-6 w-[94vw] sm:w-[440px] h-[590px] sm:h-[640px] rounded-3xl'
          } bg-gradient-to-b from-[#0e0826]/98 via-[#090518]/98 to-[#05030f]/98 backdrop-blur-3xl border border-purple-500/50 shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(147,51,234,0.3)] overflow-hidden font-sans`}
          dir="rtl"
        >
          {/* Cybernetic Ambient Light effects */}
          <div className="absolute top-0 end-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 p-3.5 sm:p-4 bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-[#0c081e]/90 border-b border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Animated Robot Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.7)] flex items-center justify-center">
                  <div className="w-full h-full rounded-[14px] bg-[#0c0824] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-300 animate-pulse" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c0824]" />
                <span className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-white text-sm">دستیار هوشمند تکویکس</h3>
                  <span className="px-1.5 py-0.5 rounded-md bg-purple-500/25 border border-purple-400/40 text-[9px] font-mono text-purple-200 font-bold">
                    Gemini 3.7 Pro
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-purple-300/80 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>آنلاین | پاسخگوی فوری به سوالات و استعلامات</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-purple-300">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-purple-600/30 hover:text-white border border-white/5 transition-colors cursor-pointer"
                title={isExpanded ? 'کوچک کردن' : 'بزرگ کردن'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-600/30 hover:text-rose-300 border border-white/5 transition-colors cursor-pointer"
                title="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="relative z-10 px-3.5 py-2 bg-purple-950/30 border-b border-purple-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-purple-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] font-bold">دسترسی‌های سریع:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (navigateToSection) navigateToSection('blog');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-purple-600/40 text-purple-200 text-[11px] font-semibold border border-purple-500/30 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Video className="w-3 h-3 text-purple-300" />
                <span>صفحه فیلم‌ها</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenOrderModal();
                }}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-bold shadow-[0_0_12px_rgba(147,51,234,0.4)] transition-all flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>ثبت سفارش</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start ${isUser ? 'justify-start flex-row-reverse' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4 text-purple-300" />
                    </div>
                  )}

                  <div
                    className={`max-w-[86%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 leading-relaxed shadow-md relative ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-te-none font-medium shadow-purple-950/50'
                        : 'bg-[#120b2e]/90 border border-purple-500/30 text-purple-100 rounded-ts-none shadow-black/60'
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed">
                      {msg.text}
                    </div>

                    {/* Quick embedded order button for model responses */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-purple-500/20 flex items-center justify-between">
                        <span className="text-[10px] text-purple-400 font-mono">{msg.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            onOpenOrderModal();
                          }}
                          className="px-2 py-1 rounded-md bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Zap className="w-2.5 h-2.5 text-amber-300" />
                          <span>ثبت سفارش این پروژه</span>
                        </button>
                      </div>
                    )}

                    {isUser && (
                      <div className="text-[10px] mt-1.5 font-mono text-purple-200 text-end">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#120b2e]/80 border border-purple-500/30 text-purple-200 text-xs w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span className="font-medium">هوش مصنوعی در حال پردازش و تنظیم پاسخ است...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          {messages.length < 4 && (
            <div className="relative z-10 p-3 bg-[#0c0722]/90 border-t border-purple-900/30">
              <span className="text-[11px] text-purple-300 font-bold block mb-2">
                پیشنهادهای هوشمند گفتگو:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PROMPT_SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-purple-600/30 border border-purple-500/20 hover:border-purple-400/40 text-start transition-all text-[11px] text-purple-200 hover:text-white flex items-center gap-2 group cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0 group-hover:scale-110 group-hover:text-purple-200 transition-transform" />
                      <span className="line-clamp-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Form & Order Fast-Bridge */}
          <div className="relative z-10 p-3 bg-[#080417] border-t border-purple-500/30 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="سوال یا ایده پروژه خود را بنویسید..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-purple-500/30 text-xs sm:text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:bg-purple-950/40 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white shadow-lg shadow-purple-600/40 transition-all active:scale-95 cursor-pointer"
                title="ارسال پیام"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-purple-300/80 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                متصل به هسته هوش مصنوعی تکویکس
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenOrderModal();
                }}
                className="text-purple-300 hover:text-white font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>تبدیل چت به سفارش</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
