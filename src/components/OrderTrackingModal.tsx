import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Send,
  AlertCircle,
  Package,
  ChevronRight,
  Activity,
  RefreshCw,
  Cpu,
  Radio,
  Sparkle
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useSiteData } from '../context/SiteDataContext';
import { OrderItem } from '../types';
import { OrderTrackingResultCard } from './OrderTrackingResultCard';
import { AICloseButton } from './common/AICloseButton';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderModal?: () => void;
  initialQuery?: string;
}

// Convert Persian/Arabic digits to English digits
function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
    .replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
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
  const [isLoading, setIsLoading] = useState(false);
  const [serverOrders, setServerOrders] = useState<OrderItem[]>([]);
  const [isLiveScanning, setIsLiveScanning] = useState(false);

  // Synchronize when initialQuery changes or modal opens
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setHasSearched(true);
    }
  }, [initialQuery, isOpen]);

  // Clean query for matching
  const cleanQuery = useMemo(() => {
    return normalizeDigits(query.trim().toLowerCase())
      .replace(/^@/, '')
      .replace(/^#/, '');
  }, [query]);

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
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [cleanQuery]);

  if (!isOpen) return null;

  // Merge context and server orders without duplicates
  const matchedFromContext = contextOrders.filter((o) => {
    if (!cleanQuery) return false;
    const matchId = normalizeDigits(o.id.toLowerCase()).includes(cleanQuery);
    const contactClean = normalizeDigits((o.telegramOrPhone || '').toLowerCase()).replace(/^@/, '');
    const matchContact = contactClean.includes(cleanQuery);
    const matchName = normalizeDigits((o.fullName || '').toLowerCase()).includes(cleanQuery);
    return matchId || matchContact || matchName;
  });

  const mergedOrderMap = new Map<string, OrderItem>();
  matchedFromContext.forEach((o) => mergedOrderMap.set(o.id, o));
  serverOrders.forEach((o) => mergedOrderMap.set(o.id, o));

  const matchedOrders = Array.from(mergedOrderMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
    triggerLiveScanEffect();
  };

  const triggerLiveScanEffect = () => {
    setIsLiveScanning(true);
    setTimeout(() => setIsLiveScanning(false), 1000);
  };

  return (
    <div
      id="order-tracking-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div
        id="order-tracking-modal-content"
        className="w-full max-w-3xl sm:rounded-3xl bg-gradient-to-b from-[#120a30] via-[#0a061b] to-[#04020c] border border-purple-500/40 p-4 sm:p-7 shadow-[0_0_100px_rgba(147,51,234,0.45)] relative flex flex-col justify-between text-start my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Cybernetic Ambient Glowing Orbs */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[520px] h-48 bg-gradient-to-r from-purple-600/30 via-indigo-500/25 to-cyan-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -end-16 w-72 h-72 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -start-16 w-60 h-60 bg-cyan-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Live Laser Scanner Line effect on search */}
        {isLiveScanning && (
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-pulse z-30 pointer-events-none" />
        )}

        {/* Modal Top Header with Live Radar & Status */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-purple-900/50">
          <div className="flex items-center gap-3">
            {/* Pulsing AI Radar Graphic Icon */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 border border-purple-400/50 flex items-center justify-center text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] shrink-0 overflow-hidden group">
              <Activity className="w-6 h-6 animate-pulse text-white z-10" />
              {/* Radar Rotating Sweep Line */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(255,255,255,0.4)_360deg)] animate-[spin_3s_linear_infinite] opacity-60" />
              <div className="absolute inset-1 rounded-xl border border-white/20" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/25 border border-purple-400/40 text-purple-200 flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                  <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                  <span>سامانه رهگیری بلادرنگ</span>
                </span>
                <span className="text-[10px] text-cyan-300 font-mono hidden sm:inline-flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>{brandInfo.latinName || 'TEKVIX'} Neural Core</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                <span>پیگیری هوشمند وضعیت سفارش</span>
              </h2>
            </div>
          </div>

          <AICloseButton
            id="tracking-modal-close-btn"
            onClick={onClose}
            title="بستن و بازگشت به صفحه قبل"
            ariaLabel="بستن پنجره رهگیری سفارش"
            variant="cyber"
          />
        </div>

        {/* Live Telemetry Bar */}
        <div className="relative z-10 mt-3 px-3.5 py-2 rounded-2xl bg-[#090518]/90 border border-purple-900/40 flex items-center justify-between text-[11px] text-purple-200/80 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-medium">سرور ابری آماده دریافت</span>
            </span>
            <span className="hidden sm:inline-block text-purple-500">|</span>
            <span className="hidden sm:inline text-purple-300/70 font-mono">تاخیر شبکه: ۱۸ms</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-purple-300/70">کانال ارتباطی:</span>
            <span className="font-mono font-bold text-white bg-purple-950/80 px-2 py-0.5 rounded-lg border border-purple-700/50">
              {brandInfo.telegramHandle}
            </span>
          </div>
        </div>

        {/* Search Bar & Auto-Suggestions */}
        <div className="relative z-10 my-4 space-y-2.5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHasSearched(true);
                }}
                placeholder="کد رهگیری (مثلاً ORD-4777)، آیدی تلگرام (@username) یا شماره تماس..."
                className="w-full ps-11 pe-9 py-3.5 rounded-2xl bg-[#140d32] border border-purple-700/50 focus:border-purple-300 focus:bg-[#1a113f] text-white placeholder:text-purple-300/40 text-xs sm:text-sm focus:outline-none transition-all shadow-inner font-sans"
              />
              <Search className="w-4 h-4 text-purple-400 absolute start-4 top-1/2 -translate-y-1/2" />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setHasSearched(false);
                  }}
                  className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>استعلام زنده</span>
            </button>
          </form>

          {/* Quick-Access Test Codes & Recent Orders */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-purple-300/80 font-medium flex items-center gap-1">
              <Sparkle className="w-3 h-3 text-amber-400" />
              <span>سفارش‌های فعال برای تست فوری:</span>
            </span>
            {contextOrders.slice(0, 4).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setQuery(o.id);
                  setHasSearched(true);
                  triggerLiveScanEffect();
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                  query.toLowerCase().includes(o.id.toLowerCase())
                    ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-purple-950/70 hover:bg-purple-900 border-purple-700/50 text-purple-200 hover:text-white'
                }`}
              >
                <span className="font-bold">{o.id}</span>
                <span className="text-[9px] opacity-75 font-sans">({o.fullName.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Area with Animated Card Transitions */}
        <div className="relative z-10 flex-1 space-y-4 max-h-[58vh] overflow-y-auto pe-1 custom-scrollbar">
          {isLoading && matchedOrders.length === 0 ? (
            <div className="py-14 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                <RefreshCw className="w-7 h-7 animate-spin text-purple-400" />
              </div>
              <h4 className="text-sm font-bold text-white">در حال ارتباط با هسته پایپ‌لاین هوش مصنوعی...</h4>
              <p className="text-xs text-purple-200/70">دریافت آخرین اطلاعات از سرور و صف پردازش</p>
            </div>
          ) : hasSearched && matchedOrders.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {matchedOrders.map((order, idx) => (
                <OrderTrackingResultCard
                  key={order.id}
                  order={order}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          ) : hasSearched ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/50">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">سفارشی با این مشخصات یافت نشد</h3>
              <p className="text-xs text-purple-200/70 max-w-sm mx-auto leading-relaxed">
                لطفاً کد رهگیری اختصاصی (مانند <span className="font-mono text-purple-300">ORD-4777</span>) یا آیدی تلگرام ثبت‌شده خود را بررسی کرده و مجدداً جستجو کنید.
              </p>
              <div className="pt-2">
                <a
                  href={`https://t.me/Lawat_kar?text=${encodeURIComponent(
                    `سلام وقت بخیر! درخواست استعلام سفارش با کد ${query || ''} در سایت تکویکس را داشتم.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-purple-600/30 hover:scale-105"
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
