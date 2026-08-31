import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Copy,
  Check,
  Send,
  ExternalLink,
  Bot,
  Calendar,
  User,
  FileText,
  Workflow,
  CheckCheck,
  Gift,
  MessageSquareQuote,
  Activity,
  Cpu,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { OrderItem, OrderStatus } from '../types';

interface OrderTrackingResultCardProps {
  order: OrderItem;
  index?: number;
}

export const OrderTrackingResultCard: React.FC<OrderTrackingResultCardProps> = ({
  order,
  index = 0,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const pvUrl = `https://t.me/${(order.telegramOrPhone || '').replace('@', '').replace(/\s+/g, '')}`;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return {
          text: 'در صف تحلیل و بررسی اولیه',
          bg: 'bg-blue-500/20 border-blue-400/40 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
          dot: 'bg-blue-400 animate-pulse',
          percent: 33,
        };
      case 'in_progress':
        return {
          text: 'در حال پردازش و تولید AI',
          bg: 'bg-purple-500/25 border-purple-400/60 text-purple-200 shadow-[0_0_25px_rgba(168,85,247,0.45)] ring-1 ring-purple-400/30',
          dot: 'bg-purple-400 animate-ping',
          percent: 72,
        };
      case 'completed':
        return {
          text: 'تکمیل و تحویل نهایی شد',
          bg: 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]',
          dot: 'bg-emerald-400',
          percent: 100,
        };
      case 'cancelled':
        return {
          text: 'لغو شده',
          bg: 'bg-rose-500/20 border-rose-400/40 text-rose-300',
          dot: 'bg-rose-400',
          percent: 0,
        };
      default:
        return {
          text: 'در حال بررسی',
          bg: 'bg-zinc-800 border-zinc-700 text-zinc-300',
          dot: 'bg-zinc-400',
          percent: 25,
        };
    }
  };

  const statusBadge = getStatusBadge(order.status);

  // 3-Step workflow definitions
  const steps: {
    key: OrderStatus;
    label: string;
    stageTitle: string;
    desc: string;
    stepNumber: number;
    timeEstimate: string;
  }[] = [
    {
      key: 'new',
      label: 'ثبت و ارزیابی نیازمندی‌ها',
      stageTitle: 'تحلیل پرامپت و مشخصات پروژه',
      desc: 'سفارش در سیستم دریافت شد و مشخصات فنی توسط مهندسین تکویکس در حال ارزیابی است.',
      stepNumber: 1,
      timeEstimate: '۱ الی ۲ ساعت',
    },
    {
      key: 'in_progress',
      label: 'پردازش، مدل‌سازی و پیاده‌سازی هوش مصنوعی',
      stageTitle: 'رندر الگوریتم‌ها و تدوین خروجی',
      desc: 'الگوریتم‌های پیشرفته هوش مصنوعی در حال اجرای مدل، کدنویسی یا ساخت فایل‌های نهایی هستند.',
      stepNumber: 2,
      timeEstimate: '۱۲ الی ۳۶ ساعت',
    },
    {
      key: 'completed',
      label: 'تکمیل، کنترل کیفیت و تحویل در تلگرام',
      stageTitle: 'آماده تحویل به کارفرما',
      desc: 'سفارش با حداکثر استانداردها نهایی شده و از طریق تلگرام و پشتیبانی اختصاصی تحویل گردید.',
      stepNumber: 3,
      timeEstimate: 'تکمیل شد ✓',
    },
  ];

  const getStepStatus = (orderStatus: OrderStatus, stepKey: OrderStatus) => {
    if (orderStatus === 'cancelled') return 'cancelled';
    const statusOrder: OrderStatus[] = ['new', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(orderStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentIndex > stepIndex) return 'finished';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <motion.div
      id={`tracking-card-${order.id}`}
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#170e3a]/95 via-[#0f092b]/95 to-[#070415] border border-purple-500/40 shadow-[0_0_50px_rgba(147,51,234,0.25)] hover:shadow-[0_0_70px_rgba(147,51,234,0.4)] space-y-5 relative overflow-hidden backdrop-blur-2xl transition-all duration-300 will-change-transform"
    >
      {/* Top Glowing Laser Accent with Shimmer */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />

      {/* Cybernetic Ambient Glow Behind Card */}
      <div className="absolute -top-12 -end-12 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -start-12 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Order Top Badge Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-900/50 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Tracking ID Badge with Neon Highlight */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/90 border border-purple-400/50 shadow-inner">
              <span className="text-[10px] text-purple-300 font-medium">کد رهگیری:</span>
              <span className="font-mono text-sm sm:text-base font-black text-white tracking-widest">
                {order.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(order.id)}
                className="p-1 rounded-lg bg-purple-800/50 hover:bg-purple-700/70 text-purple-200 hover:text-white transition-colors cursor-pointer"
                title="کپی کد رهگیری"
              >
                {copiedId === order.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Status Badge with Live Glowing Dot */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${statusBadge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
              <span>{statusBadge.text}</span>
            </span>

            {order.isPromoEvent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <Gift className="w-3.5 h-3.5" />
                <span>جشن افتتاحیه (رایگان)</span>
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-xl font-black text-white mt-2.5 flex items-center gap-2">
            <span>{order.serviceTitle}</span>
          </h3>
        </div>

        <div className="text-start sm:text-end space-y-1">
          <div className="text-[11px] text-purple-200/80 font-mono flex items-center sm:justify-end gap-1">
            <Calendar className="w-3 h-3 text-purple-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="text-xs font-bold text-emerald-400 flex items-center sm:justify-end gap-1">
            <span className="text-purple-300/80 font-normal">برآورد هزینه:</span>
            <span className="font-sans font-bold">{order.priceQuoted || 'استعلامی / توافقی'}</span>
          </div>
        </div>
      </div>

      {/* Customer Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs p-3.5 rounded-2xl bg-[#0a051e] border border-purple-900/50 relative z-10">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-purple-300/70">کارفرما / متقاضی:</span>
          <span className="font-bold text-white">{order.fullName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400 shrink-0 rotate-180" />
          <span className="text-purple-300/70">آیدی یا شماره تلگرام:</span>
          <a
            href={pvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-bold text-cyan-300 hover:text-white underline hover:no-underline transition-colors select-all flex items-center gap-1"
          >
            <span>{order.telegramOrPhone}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Customer's Initial Project Message / Notes */}
      {order.message && (
        <div className="p-3.5 rounded-2xl bg-[#0d0726] border border-purple-900/40 text-xs space-y-1 relative z-10">
          <div className="flex items-center gap-1.5 font-bold text-purple-300">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>شرح نیازمندی‌های ثبت‌شده توسط شما:</span>
          </div>
          <p className="text-gray-200 leading-relaxed font-normal">
            {order.message}
          </p>
        </div>
      )}

      {/* 3-Step Live Progress Pipeline with Live Animated Pulse */}
      <div className="space-y-3 pt-1 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
            <Workflow className="w-4 h-4 text-purple-400" />
            <span>وضعیت گام‌به‌گام در پایپ‌لاین تولید تکویکس:</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-cyan-300">
            پیشرفت: {statusBadge.percent}٪
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-purple-950/80 border border-purple-900/60 overflow-hidden relative shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${statusBadge.percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shine-gleam_2s_infinite]" />
          </motion.div>
        </div>

        {/* Steps Cards */}
        <div className="space-y-3 relative">
          {steps.map((step) => {
            const status = getStepStatus(order.status, step.key);
            const isFinished = status === 'finished';
            const isCurrent = status === 'current';

            return (
              <div
                key={step.key}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                  isCurrent
                    ? 'bg-purple-950/90 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.35)] ring-1 ring-purple-400/50'
                    : isFinished
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/[0.02] border-white/5 opacity-55'
                }`}
              >
                {/* Moving light shimmer for current active step */}
                {isCurrent && (
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-pulse" />
                )}

                {/* Step Indicator Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-md ${
                    isFinished
                      ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse shadow-purple-500/50 ring-2 ring-purple-300/40'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {isFinished ? <CheckCheck className="w-5 h-5" /> : step.stepNumber}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        isCurrent ? 'text-white' : isFinished ? 'text-emerald-300' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </h4>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-purple-300/70 font-mono">
                        تخمین: {step.timeEstimate}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/50 animate-pulse">
                          مرحله فعال
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-purple-100/70 mt-1 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Technical Notes if any */}
      {order.adminNotes && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 border border-amber-500/40 text-xs shadow-inner relative z-10">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1.5">
            <MessageSquareQuote className="w-4 h-4 text-amber-400" />
            <span>یادداشت رسمی تیم فنی و پشتیبانی تکویکس:</span>
          </div>
          <p className="text-amber-100/90 leading-relaxed font-sans">
            {order.adminNotes}
          </p>
        </div>
      )}

      {/* Direct Action Links to Telegram */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 relative z-10">
        <a
          href={`https://t.me/Lawat_kar?text=${encodeURIComponent(
            `سلام وقت بخیر! درخواست پیگیری سفارش با کد ${order.id} (${order.serviceTitle}) برای مشتری ${order.fullName}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <Send className="w-4 h-4 rotate-180" />
          <span>گفت‌وگو مستقیم با پشتیبانی درباره این سفارش (@Lawat_kar)</span>
        </a>

        <a
          href="https://t.me/Tekvixbot"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#0f0928] hover:bg-purple-950 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>ربات تلگرام</span>
        </a>
      </div>
    </motion.div>
  );
};
