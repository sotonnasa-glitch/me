import React, { useState, useEffect } from 'react';
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
  Gift,
  Layers,
  Activity,
  Calendar,
  User,
  Phone,
  FileText,
  Check,
  RefreshCw,
  MessageSquareQuote,
  Sparkle
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
  const { orders: contextOrders, brandInfo } = useSiteData();
  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverOrders, setServerOrders] = useState<OrderItem[]>([]);

  // Update query if initialQuery changes when modal opens
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setHasSearched(true);
    }
  }, [initialQuery, isOpen]);

  // Clean query for matching
  const cleanQuery = query.trim().toLowerCase().replace('@', '');

  // Perform server-side search whenever query changes or on search trigger
  useEffect(() => {
    let isMounted = true;
    if (!cleanQuery) {
      setServerOrders([]);
      return;
    }

    const fetchServerTracking = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/orders/track/${encodeURIComponent(cleanQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.orders)) {
            setServerOrders(data.orders);
          }
        }
      } catch (err) {
        // Fallback silently to context-based filter
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchServerTracking();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [cleanQuery]);

  if (!isOpen) return null;

  // Merge context and server orders without duplicates
  const matchedFromContext = contextOrders.filter((o) => {
    if (!cleanQuery) return false;
    const matchId = o.id.toLowerCase().includes(cleanQuery);
    const contactClean = (o.telegramOrPhone || '').toLowerCase().replace('@', '');
    const matchContact = contactClean.includes(cleanQuery);
    const matchName = (o.fullName || '').toLowerCase().includes(cleanQuery);
    return matchId || matchContact || matchName;
  });

  const mergedOrderMap = new Map<string, OrderItem>();
  // Prefer server data if available, fallback to context
  matchedFromContext.forEach((o) => mergedOrderMap.set(o.id, o));
  serverOrders.forEach((o) => mergedOrderMap.set(o.id, o));

  const matchedOrders = Array.from(mergedOrderMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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

  // 3-Step workflow definitions with realistic descriptions
  const steps: { key: OrderStatus; label: string; desc: string; stepNumber: number; timeEstimate: string }[] = [
    {
      key: 'new',
      label: 'ثبت و بررسی نیازمندی‌ها',
      desc: 'سفارش در سیستم دریافت شد و مشخصات فنی توسط کارشناسان هوش مصنوعی در حال ارزیابی است.',
      stepNumber: 1,
      timeEstimate: '۱ الی ۳ ساعت',
    },
    {
      key: 'in_progress',
      label: 'پردازش و پیاده‌سازی هوش مصنوعی',
      desc: 'سناریونویسی، توسعه الگوریتم، خروجی‌های هوش مصنوعی (کد، ویدیو، تصویر یا صوت) در پایپ‌لاین اجرایی قرار دارد.',
      stepNumber: 2,
      timeEstimate: '۱۲ الی ۴۸ ساعت',
    },
    {
      key: 'completed',
      label: 'تکمیل و تحویل نهایی',
      desc: 'پروژه با بالاترین کیفیت آماده شده و از طریق تلگرام و پشتیبانی مستقیم به شما تحویل داده شد.',
      stepNumber: 3,
      timeEstimate: 'انجام شد',
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

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return {
          text: 'در صف بررسی اولیه',
          bg: 'bg-blue-500/15 border-blue-400/40 text-blue-300',
          dot: 'bg-blue-400',
        };
      case 'in_progress':
        return {
          text: 'در حال تولید و پیاده‌سازی',
          bg: 'bg-purple-500/20 border-purple-400/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
          dot: 'bg-purple-400 animate-ping',
        };
      case 'completed':
        return {
          text: 'تکمیل و تحویل داده شد',
          bg: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
          dot: 'bg-emerald-400',
        };
      case 'cancelled':
        return {
          text: 'لغو شده',
          bg: 'bg-rose-500/20 border-rose-400/40 text-rose-300',
          dot: 'bg-rose-400',
        };
      default:
        return {
          text: 'نامشخص',
          bg: 'bg-zinc-800 border-zinc-700 text-zinc-300',
          dot: 'bg-zinc-400',
        };
    }
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
        className="w-full max-w-2xl sm:rounded-3xl bg-gradient-to-b from-[#0f0928] via-[#090518] to-[#04020c] border border-purple-500/40 p-5 sm:p-7 shadow-[0_0_90px_rgba(147,51,234,0.35)] relative flex flex-col justify-between text-start my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Futuristic Atmospheric Ambient Glows */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[480px] h-40 bg-gradient-to-r from-purple-600/30 via-indigo-600/25 to-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -end-10 w-60 h-60 bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 border border-purple-400/50 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.45)] shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200">
                  سامانه رهگیری بلادرنگ
                </span>
                <span className="text-[10px] text-purple-300/80 font-mono hidden sm:inline">
                  {brandInfo.name || 'تکویکس'} AI Tracker
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                پیگیری و استعلام وضعیت سفارش
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="tracking-modal-close-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Auto-Suggestions */}
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
                placeholder="کد رهگیری (مثلاً ORD-7821) یا آیدی تلگرام (@username)..."
                className="w-full ps-11 pe-9 py-3.5 rounded-2xl bg-[#140d30] border border-purple-800/60 focus:border-purple-400 focus:bg-[#1a113d] text-white placeholder:text-purple-300/40 text-xs sm:text-sm focus:outline-none transition-all shadow-inner font-sans"
              />
              <Search className="w-4 h-4 text-purple-400 absolute start-4 top-1/2 -translate-y-1/2" />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setHasSearched(false);
                  }}
                  className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>جستجو</span>
            </button>
          </form>

          {/* Quick-Access Test Codes */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[11px] text-purple-300/70 font-medium">کدهای فعال برای تست آنی:</span>
            {contextOrders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setQuery(o.id);
                  setHasSearched(true);
                }}
                className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-purple-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{o.id}</span>
                <span className="text-[9px] text-purple-400">({o.fullName.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="relative z-10 flex-1 space-y-4 max-h-[62vh] overflow-y-auto pe-1 custom-scrollbar">
          {isLoading && matchedOrders.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-xs text-purple-200">در حال استعلام وضعیت از پایگاه داده هوش مصنوعی...</p>
            </div>
          ) : hasSearched && matchedOrders.length > 0 ? (
            matchedOrders.map((order) => {
              const pvUrl = `https://t.me/${(order.telegramOrPhone || '').replace('@', '').replace(/\s+/g, '')}`;
              const formattedDate = new Date(order.createdAt).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const statusBadge = getStatusBadge(order.status);

              return (
                <div
                  key={order.id}
                  id={`tracking-card-${order.id}`}
                  className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#150d36]/90 via-[#0f0928]/95 to-[#080415] border border-purple-500/40 shadow-2xl space-y-5 relative overflow-hidden"
                >
                  {/* Top Glowing Laser Accent */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400" />

                  {/* Order Top Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-900/40">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Tracking ID Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/50 shadow-inner">
                          <span className="text-[10px] text-purple-300">کد رهگیری:</span>
                          <span className="font-mono text-sm sm:text-base font-black text-white tracking-wider">
                            {order.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(order.id)}
                            className="p-1 rounded-lg bg-purple-800/40 hover:bg-purple-700/60 text-purple-200 transition-colors cursor-pointer"
                            title="کپی کد رهگیری"
                          >
                            {copiedId === order.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border ${statusBadge.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                          <span>{statusBadge.text}</span>
                        </span>

                        {order.isPromoEvent && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                            <Gift className="w-3.5 h-3.5" />
                            <span>ایونت افتتاحیه (رایگان)</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-white mt-2.5 flex items-center gap-2">
                        <span>{order.serviceTitle}</span>
                      </h3>
                    </div>

                    <div className="text-start sm:text-end space-y-1">
                      <div className="text-[11px] text-purple-200/70 font-mono flex items-center sm:justify-end gap-1">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="text-xs font-bold text-emerald-400 flex items-center sm:justify-end gap-1">
                        <span className="text-purple-300/80 font-normal">برآورد هزینه:</span>
                        <span>{order.priceQuoted || 'استعلامی / توافقی'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs p-3.5 rounded-2xl bg-[#0b061e] border border-purple-900/40">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-purple-300/70">مشتری:</span>
                      <span className="font-bold text-white">{order.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-purple-400 shrink-0 rotate-180" />
                      <span className="text-purple-300/70">پل ارتباطی:</span>
                      <a
                        href={pvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-bold text-purple-300 hover:text-white underline hover:no-underline transition-colors select-all flex items-center gap-1"
                      >
                        <span>{order.telegramOrPhone}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Customer's Original Description */}
                  {order.message && (
                    <div className="p-3.5 rounded-2xl bg-[#0d0724] border border-purple-900/30 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-purple-300 mb-1">
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        <span>شرح درخواست اولیه مشتری:</span>
                      </div>
                      <p className="text-gray-200 leading-relaxed font-normal">
                        {order.message}
                      </p>
                    </div>
                  )}

                  {/* 3-Step Progress Pipeline */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-purple-400" />
                        <span>مراحل اجرای سفارش در پایپ‌لاین هوش مصنوعی:</span>
                      </span>
                    </div>

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
                                ? 'bg-purple-950/85 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/40'
                                : isFinished
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                                : 'bg-white/[0.02] border-white/5 opacity-55'
                            }`}
                          >
                            {/* Step Indicator */}
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-md ${
                                isFinished
                                  ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                                  : isCurrent
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse shadow-purple-500/40'
                                  : 'bg-white/10 text-gray-400'
                              }`}
                            >
                              {isFinished ? '✓' : step.stepNumber}
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
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/50">
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

                  {/* Admin Notes / Updates if any */}
                  {order.adminNotes && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 border border-amber-500/40 text-xs shadow-inner">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1.5">
                        <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                        <span>یادداشت رسمی تیم فنی و پشتیبانی تکویکس:</span>
                      </div>
                      <p className="text-amber-100/90 leading-relaxed font-sans">
                        {order.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Direct Action Link to Telegram */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                    <a
                      href={`https://t.me/Lawat_kar?text=${encodeURIComponent(
                        `سلام وقت بخیر! درخواست پیگیری سفارش با کد ${order.id} (${order.serviceTitle}) برای مشتری ${order.fullName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4 rotate-180" />
                      <span>گفت‌وگو مستقیم با پشتیبانی درباره این سفارش (@Lawat_kar)</span>
                    </a>

                    <a
                      href="https://t.me/Tekvixbot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#0f0928] hover:bg-purple-950 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span>ربات تلگرام</span>
                    </a>
                  </div>
                </div>
              );
            })
          ) : hasSearched ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/50">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">سفارشی با این مشخصات یافت نشد</h3>
              <p className="text-xs text-purple-200/70 max-w-sm mx-auto leading-relaxed">
                لطفاً کد رهگیری اختصاصی (مانند <span className="font-mono text-purple-300">ORD-7821</span>) یا آیدی تلگرام ثبت‌شده خود را بررسی کرده و مجدداً جستجو کنید.
              </p>
              <div className="pt-2">
                <a
                  href="https://t.me/Lawat_kar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>استعلام مستقیم از پشتیبانی تلگرام (@Lawat_kar)</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-purple-200/70 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <Package className="w-7 h-7 animate-bounce" />
              </div>
              <p className="max-w-xs mx-auto leading-relaxed">
                کد رهگیری دریافت شده در زمان ثبت سفارش یا آیدی تلگرام خود را در کادر بالا وارد کرده و کلید جستجو را لمس کنید.
              </p>
            </div>
          )}
        </div>

        {/* Footer Info & Quick Order Action */}
        <div className="relative z-10 pt-4 mt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-purple-300/70">
          <span>پشتیبانی تلگرام: {brandInfo.telegramHandle || '@Lawat_kar'}</span>
          {onOpenOrderModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrderModal();
              }}
              className="text-purple-300 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>ثبت سفارش جدید</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
