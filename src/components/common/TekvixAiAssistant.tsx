import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  HelpCircle,
  Video,
  Code2,
  Send as TelegramIcon,
  Palette,
  Music,
  ArrowLeft,
  Check,
  RefreshCw,
  Zap,
  MessageSquare
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
    text: `سلام! من **دستیار هوش مصنوعی تکویکس (Tekvix AI)** هستم 🤖✨\n\nمی‌توانم به شما در موارد زیر کمک کنم:\n- 🎬 **ایده‌پردازی و سناریونویسی برای تولید ویدیو و تیزر تبلیغاتی**\n- 🌐 **برآورد هزینه و مشخصات فنی طراحی وب‌سایت**\n- 🤖 **طراحی و امکانات ربات‌های هوشمند تلگرام**\n- 🎨 **تولید تصاویر، لوگو و گرافیک اختصاصی**\n\nچه پروژه‌ای در ذهن دارید؟`,
    timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
  },
];

const PROMPT_SUGGESTIONS = [
  {
    icon: Video,
    label: 'ایده و سناریوی ویدیوی تبلیغاتی',
    prompt: 'یک سناریوی جذاب ۳۰ ثانیه‌ای برای تیزر اینستاگرام محصولات مدرن با هوش مصنوعی بنویس.',
  },
  {
    icon: Code2,
    label: 'برآورد هزینه طراحی وب‌سایت',
    prompt: 'هزینه و زمان تحویل یک وب‌سایت شرکتی مدرن با پنل ادمین چقدر است؟',
  },
  {
    icon: TelegramIcon,
    label: 'امکانات ربات فروشگاهی تلگرام',
    prompt: 'یک ربات تلگرام فروشگاهی چه امکاناتی دارد و چطور متصل می‌شود؟',
  },
  {
    icon: Palette,
    label: 'تولید تصویر و هویت بصری',
    prompt: 'بهترین سبک‌های تصویری با هوش مصنوعی برای برندینگ چیست؟',
  },
];

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

      const data = await response.json();
      const modelReplyText =
        data.text ||
        'متاسفانه در حال حاضر پاسخی دریافت نشد. لطفاً برای دریافت مشاوره اختصاصی به پشتیبانی تلگرام پیام دهید.';

      const modelMessage: ChatMessage = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        text: modelReplyText,
        timestamp: new Date().toLocaleTimeString('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err) {
      const fallbackMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        text: `✨ با تشکر از پیام شما!\n\nبرای سفارش این پروژه، کارشناسان تکویکس در کمتر از ۱۰ دقیقه در تلگرام پاسخگوی شما هستند. می‌توانید مستقیماً سفارش خود را ثبت کنید یا به آیدی @arnirhq پیام دهید.`,
        timestamp: new Date().toLocaleTimeString('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 start-6 z-40 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="دستیار هوش مصنوعی جیمینی"
            className="group relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-[0_0_30px_rgba(147,51,234,0.45)] border border-purple-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#09090b]" />
            </div>

            <div className="flex flex-col text-start">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm tracking-tight font-sans">هوش مصنوعی تکویکس</span>
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-[9px] font-mono uppercase tracking-wider">
                  Gemini 3.7
                </span>
              </div>
              <span className="text-[10px] text-purple-200 font-normal hidden sm:block">
                مشاوره هوشمند، نگارش سناریو و استعلام آنی
              </span>
            </div>

            <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 start-4 sm:bottom-6 sm:start-6 w-[92vw] sm:w-[420px] h-[580px] sm:h-[620px] rounded-3xl'
          } bg-[#0b081e]/95 backdrop-blur-2xl border border-purple-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden font-sans`}
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-zinc-900/80 border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b081e]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-sm">دستیار هوش مصنوعی تکویکس</h3>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/30 border border-purple-400/30 text-[10px] font-mono text-purple-200">
                    Gemini 3.7 Pro
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block">
                  آنلاین | پاسخگوی فوری به سوالات و استعلامات
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                title={isExpanded ? 'کوچک کردن' : 'بزرگ کردن'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                title="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="px-3 py-2 bg-purple-950/40 border-b border-purple-500/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>دسترسی‌های سریع:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigateToSection('blog');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/30 text-purple-200 text-[11px] font-semibold border border-purple-500/20 flex items-center gap-1 transition-colors"
              >
                <Video className="w-3 h-3 text-purple-400" />
                <span>🎬 صفحه فیلم‌ها</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenOrderModal();
                }}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-sm transition-colors flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>ثبت سفارش</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-start flex-row-reverse' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-te-none font-medium'
                        : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-ts-none'
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs sm:text-[13px]">{msg.text}</div>
                    <div
                      className={`text-[10px] mt-1.5 font-mono ${
                        isUser ? 'text-purple-200 text-end' : 'text-zinc-500 text-start'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-purple-300 text-xs py-2">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span>هوش مصنوعی در حال تحلیل و پاسخگویی است...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          {messages.length < 3 && (
            <div className="p-3 bg-zinc-950/60 border-t border-purple-900/20">
              <span className="text-[11px] text-zinc-400 font-medium block mb-2">
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
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 text-start transition-all text-[11px] text-zinc-300 hover:text-white flex items-center gap-2 group"
                    >
                      <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="line-clamp-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Form & Order Fast-Bridge */}
          <div className="p-3 bg-[#080518] border-t border-purple-500/20 space-y-2">
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
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white shadow-md shadow-purple-600/30 transition-all active:scale-95"
                title="ارسال پیام"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                متصل به هسته هوش مصنوعی تکویکس
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenOrderModal();
                }}
                className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
              >
                🚀 تبدیل چت به سفارش
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
