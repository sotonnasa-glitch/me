import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Package,
  Sparkles,
  ExternalLink,
  Copy,
  ChevronRight,
  ShieldCheck,
  Bot,
  Zap,
  Gift
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { OrderItem, OrderStatus } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderModal?: () => void;
  initialQuery?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderModal,
  initialQuery = '',
}) => {
  const { orders, brandInfo } = useSiteData();
  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Clean query for matching
  const cleanQuery = query.trim().toLowerCase().replace('@', '');

  // Filter orders matching tracking code or telegram handle or full name
  const matchedOrders = orders.filter((o) => {
    if (!cleanQuery) return false;
    const matchId = o.id.toLowerCase().includes(cleanQuery);
    const contactClean = (o.telegramOrPhone || '').toLowerCase().replace('@', '');
    const matchContact = contactClean.includes(cleanQuery);
    const matchName = o.fullName.toLowerCase().includes(cleanQuery);
    return matchId || matchContact || matchName;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
  };

  const handleCopyCode = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 3-Step workflow definitions
  const steps: { key: OrderStatus; label: string; desc: string; stepNumber: number }[] = [
    {
      key: 'new',
      label: 'ثبت و بررسی اولیه',
      desc: 'سفارش در سیستم دریافت شد و در صف بررسی فنی تیم قرار دارد.',
      stepNumber: 1,
    },
    {
      key: 'in_progress',
      label: 'در حال تولید و پیاده‌سازی هوش مصنوعی',
      desc: 'سناریو، خروجی‌های هوش مصنوعی، کدنویسی یا رندر در حال اجراست.',
      stepNumber: 2,
    },
    {
      key: 'completed',
      label: 'تکمیل و تحویل نهایی',
      desc: 'فایل‌ها و خروجی نهایی از طریق تلگرام به شما تحویل داده شد.',
      stepNumber: 3,
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
    <div
      id="order-tracking-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div
        id="order-tracking-modal-content"
        className="w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:rounded-3xl bg-gradient-to-b from-[#0e0924] via-[#090618] to-[#05030e] border border-purple-500/30 p-5 sm:p-7 shadow-[0_0_80px_rgba(147,51,234,0.3)] relative flex flex-col justify-between text-start my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">
                  سامانه پیگیری هوشمند
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                پیگیری وضعیت سفارش
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="tracking-modal-close-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 my-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHasSearched(true);
                }}
                placeholder="کد رهگیری (مثلاً ORD-7820) یا آیدی تلگرام (@username)..."
                className="w-full ps-11 pe-4 py-3.5 rounded-2xl bg-[#120c2b] border border-purple-900/50 focus:border-purple-400 focus:bg-[#181039] text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all shadow-inner font-mono"
              />
              <Search className="w-4 h-4 text-purple-400 absolute start-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 sm:px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 transition-all cursor-pointer shrink-0"
            >
              جستجو
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="text-[11px] text-gray-400">کدهای نمونه برای تست:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setQuery(o.id);
                  setHasSearched(true);
                }}
                className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-800/40 text-purple-300 transition-colors cursor-pointer"
              >
                {o.id}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="relative z-10 flex-1 space-y-4 max-h-[60vh] overflow-y-auto pe-1">
          {hasSearched && matchedOrders.length > 0 ? (
            matchedOrders.map((order) => {
              const pvUrl = `https://t.me/${(order.telegramOrPhone || '').replace('@', '').replace(/\s+/g, '')}`;
              const formattedDate = new Date(order.createdAt).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#130d2e]/90 border border-purple-500/40 shadow-xl space-y-5"
                >
                  {/* Order Top Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-purple-900/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm sm:text-base font-black text-purple-300">
                          {order.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(order.id)}
                          className="p-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/50 text-purple-300 transition-colors"
                          title="کپی کد رهگیری"
                        >
                          {copiedId === order.id ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {order.isPromoEvent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
                            <Gift className="w-3 h-3" />
                            <span>ایونت افتتاحیه (رایگان)</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                        {order.serviceTitle}
                      </h3>
                    </div>

                    <div className="text-start sm:text-end">
                      <span className="text-[11px] text-gray-400 block font-mono">
                        تاریخ ثبت: {formattedDate}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
                        مبلغ: {order.priceQuoted || 'استعلامی'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-[#09061c] border border-purple-900/30">
                    <div>
                      <span className="text-gray-400">نام مشتری: </span>
                      <span className="font-bold text-white">{order.fullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">آیدی تلگرام: </span>
                      <span className="font-mono font-bold text-purple-300 select-all">
                        {order.telegramOrPhone}
                      </span>
                    </div>
                  </div>

                  {/* 3-Step Progress Pipeline */}
                  <div className="space-y-3 pt-1">
                    <span className="text-xs font-bold text-gray-300 block">
                      مراحل اجرای سفارش در سیستم:
                    </span>
                    <div className="space-y-3 relative">
                      {steps.map((step, idx) => {
                        const status = getStepStatus(order.status, step.key);
                        const isFinished = status === 'finished';
                        const isCurrent = status === 'current';

                        return (
                          <div
                            key={step.key}
                            className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 relative ${
                              isCurrent
                                ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                                : isFinished
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                                : 'bg-white/[0.02] border-white/5 opacity-60'
                            }`}
                          >
                            {/* Step Indicator */}
                            <div
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                isFinished
                                  ? 'bg-emerald-500 text-black'
                                  : isCurrent
                                  ? 'bg-purple-500 text-white animate-pulse'
                                  : 'bg-white/10 text-gray-400'
                              }`}
                            >
                              {isFinished ? '✓' : step.stepNumber}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4
                                  className={`text-xs sm:text-sm font-bold ${
                                    isCurrent ? 'text-white' : isFinished ? 'text-emerald-300' : 'text-gray-400'
                                  }`}
                                >
                                  {step.label}
                                </h4>
                                {isCurrent && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40">
                                    وضعیت فعلی
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Admin Notes / Updates if any */}
                  {order.adminNotes && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
                      <span className="font-bold text-amber-300 block mb-1">
                        📌 یادداشت و پیام تیم پشتیبانی:
                      </span>
                      <p className="text-gray-200 leading-relaxed font-sans">
                        {order.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Direct Action Link to Telegram */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                    <a
                      href={`https://t.me/Lawat_kar?text=${encodeURIComponent(
                        `سلام، پیگیری سفارش کد ${order.id} (${order.serviceTitle}) برای کاربر ${order.fullName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4 rotate-180" />
                      <span>گفت‌وگو با پشتیبانی درباره این سفارش (@Lawat_kar)</span>
                    </a>

                    <a
                      href="https://t.me/Tekvixbot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Bot className="w-4 h-4" />
                      <span>ربات تلگرام</span>
                    </a>
                  </div>
                </div>
              );
            })
          ) : hasSearched ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">سفارشی با این مشخصات یافت نشد</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                لطفاً کد رهگیری (مثلاً ORD-7820) یا آیدی تلگرام خود را با دقت بیشتری وارد نمایید یا مستقیماً به پشتیبانی تلگرام پیام دهید.
              </p>
              <div className="pt-2">
                <a
                  href="https://t.me/Lawat_kar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>ارتباط مستقیم با پشتیبانی (@Lawat_kar)</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-400 space-y-2">
              <Package className="w-10 h-10 text-purple-400 mx-auto opacity-70 animate-bounce" />
              <p>کد رهگیری دریافت شده در زمان ثبت سفارش یا آیدی تلگرام خود را در کادر بالا بنویسید.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 border-t border-purple-900/30 flex items-center justify-between text-[11px] text-gray-400">
          <span>پشتیبانی تلگرام: {brandInfo.telegramHandle}</span>
          {onOpenOrderModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrderModal();
              }}
              className="text-purple-300 hover:text-white font-bold transition-colors cursor-pointer"
            >
              ثبت سفارش جدید ←
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
