import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Send,
  ShieldCheck,
  AlertCircle,
  User,
  MessageSquare,
  Copy,
  Clock,
  Layers,
  Zap,
  Globe,
  Clapperboard,
  Bot,
  Palette,
  Music,
  FileText,
  Gift,
  Wand2,
  Cpu,
  BadgeCheck,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { OrderFormData } from '../types';
import { NeuralSubmitButton } from './common/NeuralSubmitButton';
import { AICloseButton } from './common/AICloseButton';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  onOpenGoogleAuth?: () => void;
  onOpenOrderTracking?: (orderId: string) => void;
}

type ServiceVisual = {
  icon: React.ElementType;
  eyebrow: string;
  headline: string;
  description: string;
  accent: string;
  glow: string;
  points: string[];
};

const SERVICE_VISUALS: Record<string, ServiceVisual> = {
  'ai-website': {
    icon: Globe,
    eyebrow: 'WEB • AI • PRODUCT',
    headline: 'یک وب‌سایت هوشمند برای ایده‌ات',
    description: 'از لندینگ تا تجربه‌های تعاملی؛ ظاهر مدرن، عملکرد سریع و قابلیت‌های AI در یک پروژه یکپارچه.',
    accent: 'text-cyan-300',
    glow: 'bg-cyan-400/15',
    points: ['UI مدرن و واکنش‌گرا', 'اتصال قابلیت‌های AI', 'تحویل آماده استفاده'],
  },
  'ai-video': {
    icon: Clapperboard,
    eyebrow: 'VIDEO • AI • STORY',
    headline: 'ویدیویی که ایده‌ات را زنده می‌کند',
    description: 'برای تبلیغات، شبکه‌های اجتماعی، معرفی محصول یا روایت یک ایده، سناریو و خروجی بصری را حرفه‌ای می‌سازیم.',
    accent: 'text-fuchsia-300',
    glow: 'bg-fuchsia-400/15',
    points: ['سناریو و ایده‌پردازی', 'تولید با ابزارهای AI', 'خروجی مناسب انتشار'],
  },
  'telegram-bot': {
    icon: Bot,
    eyebrow: 'BOT • AUTOMATION • AI',
    headline: 'رباتی که بخشی از کار را برایت انجام می‌دهد',
    description: 'ربات تلگرامی اختصاصی با جریان‌های خودکار، تعامل هوشمند و قابلیت اتصال به سرویس‌های موردنیازت.',
    accent: 'text-sky-300',
    glow: 'bg-sky-400/15',
    points: ['فرآیندهای خودکار', 'اتصال سرویس‌ها', 'تجربه ساده برای کاربر'],
  },
  'image-creation': {
    icon: Palette,
    eyebrow: 'VISUAL • BRAND • AI',
    headline: 'تصویری که دقیقاً برای برندت ساخته شده',
    description: 'از پوستر و کاور تا سبک‌های اختصاصی تصویری؛ خروجی تمیز، قابل استفاده و متناسب با هویت بصری پروژه.',
    accent: 'text-violet-300',
    glow: 'bg-violet-400/15',
    points: ['کانسپت و art direction', 'سبک تصویری اختصاصی', 'فایل مناسب انتشار'],
  },
  'ai-music': {
    icon: Music,
    eyebrow: 'AUDIO • MUSIC • SOUND',
    headline: 'صدا و موسیقی متناسب با پروژه‌ات',
    description: 'برای محتوا، برند یا تجربه دیجیتال، فضای صوتی اختصاصی می‌سازیم تا خروجی فقط «یک فایل صدا» نباشد.',
    accent: 'text-amber-300',
    glow: 'bg-amber-400/15',
    points: ['فضاسازی صوتی', 'موسیقی متناسب با کاربرد', 'خروجی آماده انتشار'],
  },
  'text-content': {
    icon: FileText,
    eyebrow: 'CONTENT • AI • COPY',
    headline: 'محتوایی که برای هدف مشخص نوشته شده',
    description: 'محتوای سایت، شبکه‌های اجتماعی، معرفی محصول و متن‌های کاربردی با ساختار، لحن و هدف مشخص.',
    accent: 'text-emerald-300',
    glow: 'bg-emerald-400/15',
    points: ['لحن اختصاصی برند', 'ساختار هدفمند', 'مناسب انتشار سریع'],
  },
};

const DEFAULT_SERVICE_VISUAL: ServiceVisual = {
  icon: Sparkles,
  eyebrow: 'AI SERVICE • TEKVIX',
  headline: 'پروژه‌ات را با Tekvix شروع کن',
  description: 'جزئیات ایده‌ات را بگو تا بهترین مسیر اجرا را برایت مشخص کنیم.',
  accent: 'text-purple-300',
  glow: 'bg-purple-400/15',
  points: ['راهکار متناسب با پروژه', 'فرآیند شفاف', 'پشتیبانی مستقیم'],
};

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  onOpenGoogleAuth,
  onOpenOrderTracking,
}) => {
  const {
    services,
    brandInfo,
    addOrder,
    sendOrderToTelegramBot,
    currentUser,
    trackServiceClick,
    openingEventState,
  } = useSiteData();

  const availableServices = useMemo(
    () => services.filter((s) => s.active !== false && s.availabilityStatus !== 'unavailable'),
    [services]
  );

  const defaultServiceId = useMemo(
    () =>
      initialServiceId && availableServices.some((s) => s.id === initialServiceId)
        ? initialServiceId
        : availableServices[0]?.id || 'ai-website',
    [initialServiceId, availableServices]
  );

  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    telegramOrPhone: '',
    serviceId: defaultServiceId,
    message: '',
  });
  const [errors, setErrors] = useState<{ fullName?: string; telegramOrPhone?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [copiedCode, setCopiedCode] = useState(false);
  const lastTrackedServiceRef = useRef<string | null>(null);

  const quickCategories = useMemo(
    () =>
      [
        { id: 'ai-website', label: 'طراحی وب‌سایت', icon: Globe },
        { id: 'ai-video', label: 'ویدیو', icon: Clapperboard },
        { id: 'telegram-bot', label: 'ربات تلگرام', icon: Bot },
        { id: 'image-creation', label: 'تصویر', icon: Palette },
        { id: 'ai-music', label: 'موزیک', icon: Music },
        { id: 'text-content', label: 'محتوا', icon: FileText },
      ].filter((cat) => availableServices.some((s) => s.id === cat.id)),
    [availableServices]
  );

  const selectedService = availableServices.find((s) => s.id === formData.serviceId) || availableServices[0];
  const serviceVisual = (selectedService && SERVICE_VISUALS[selectedService.id]) || DEFAULT_SERVICE_VISUAL;
  const ServiceIcon = serviceVisual.icon;

  useEffect(() => {
    if (currentUser?.name) {
      setFormData((prev) => (prev.fullName ? prev : { ...prev, fullName: currentUser.name }));
    }
  }, [currentUser?.name]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialServiceId && availableServices.some((s) => s.id === initialServiceId)) {
      setFormData((prev) => (prev.serviceId === initialServiceId ? prev : { ...prev, serviceId: initialServiceId }));
      if (lastTrackedServiceRef.current !== initialServiceId) {
        lastTrackedServiceRef.current = initialServiceId;
        trackServiceClick(initialServiceId);
      }
    } else if (availableServices.length > 0) {
      setFormData((prev) => {
        if (!availableServices.some((s) => s.id === prev.serviceId)) {
          return { ...prev, serviceId: availableServices[0].id };
        }
        return prev;
      });
    }
  }, [isOpen, initialServiceId, availableServices, trackServiceClick]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isSuccess && countdown === 0) {
      handleModalClose();
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown]);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setCountdown(10);
    setErrors({});
    setCopiedCode(false);
    onClose();
  };

  const handleServiceChange = (serviceId: string) => {
    setFormData((prev) => ({ ...prev, serviceId }));
    trackServiceClick(serviceId);
  };

  const validate = (): boolean => {
    const newErrors: { fullName?: string; telegramOrPhone?: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'لطفاً نام و نام خانوادگی خود را وارد کنید.';
    if (!formData.telegramOrPhone.trim()) newErrors.telegramOrPhone = 'لطفاً آیدی تلگرام خود را وارد کنید.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickFill = () => {
    setFormData({
      fullName: currentUser ? currentUser.name : 'کاربر تکویکس',
      telegramOrPhone: '@username',
      serviceId: availableServices[0]?.id || 'ai-website',
      message: 'درخواست پیاده‌سازی پروژه هوش مصنوعی اختصاصی با بالاترین کیفیت و سرعت تحویل.',
    });
    setErrors({});
  };

  const handleCopyOrderCode = () => {
    if (!submittedOrderId) return;
    navigator.clipboard.writeText(submittedOrderId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const isPromo = Boolean(openingEventState.isCurrentlyOpen);
    const created = addOrder({
      ...formData,
      isPromoEvent: isPromo,
      promoEventName: isPromo ? openingEventState.config.title : undefined,
    });
    setSubmittedOrderId(created.id);

    try {
      await sendOrderToTelegramBot(created);
    } catch (err) {
      console.warn('Telegram send ignored:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020108]/90 backdrop-blur-xl overflow-y-auto p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div
        id="order-modal-content"
        className="relative w-full min-h-screen sm:min-h-0 sm:max-w-5xl sm:max-h-[92vh] overflow-hidden sm:rounded-[32px] border border-white/10 bg-[#080712] text-white shadow-[0_30px_120px_rgba(0,0,0,.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_78%_18%,rgba(139,92,246,.16),transparent_28%),radial-gradient(circle_at_15%_90%,rgba(6,182,212,.10),transparent_25%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,.025)_45%,transparent_70%)]" />

        <div className="relative z-10 flex min-h-[92vh] sm:min-h-0 sm:max-h-[92vh] flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/10 shadow-[0_0_30px_rgba(139,92,246,.18)]">
                <Cpu className="h-5 w-5 text-purple-300" />
                <span className="absolute -bottom-1 -end-1 h-3 w-3 rounded-full border-2 border-[#080712] bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-gray-500">
                  <span>{brandInfo.latinName || 'Tekvix'} AI Studio</span>
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300">Online</span>
                </div>
                <h2 className="mt-1 truncate text-lg font-black sm:text-xl">شروع یک پروژه جدید</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isSuccess && (
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-[11px] font-bold text-gray-300 transition hover:border-purple-400/30 hover:bg-purple-500/10 hover:text-white"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-300" /> نمونه سریع
                </button>
              )}
              <AICloseButton
                id="order-modal-close-btn"
                onClick={handleModalClose}
                title="بستن و بازگشت"
                ariaLabel="بستن پنجره سفارش"
                variant="cyber"
              />
            </div>
          </header>

          {isSuccess ? (
            <div className="relative flex flex-1 items-center justify-center overflow-y-auto px-5 py-10 sm:px-10">
              <div className="w-full max-w-2xl text-center">
                <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[30px] border border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_70px_rgba(16,185,129,.18)]">
                  <CheckCircle2 className="h-12 w-12 text-emerald-300" />
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.2em] text-emerald-300">
                  <BadgeCheck className="h-3.5 w-3.5" /> Request accepted
                </span>
                <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">سفارش با موفقیت ثبت شد ✨</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                  اطلاعات پروژه ثبت شد و درخواست برای تیم Tekvix ارسال شده است. برای ادامه می‌توانی از کد رهگیری استفاده کنی.
                </p>

                <div className="mx-auto mt-7 flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500">کد رهگیری سفارش</span>
                    <div className="mt-1 font-mono text-lg font-black tracking-widest text-purple-200">{submittedOrderId}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyOrderCode}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-purple-400/20 bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-200"
                  >
                    {copiedCode ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                    {copiedCode ? 'کپی شد' : 'کپی کد'}
                  </button>
                </div>

                <div className="mx-auto mt-4 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={`https://t.me/Lawat_kar?text=${encodeURIComponent(`سلام وقت بخیر! سفارش با کد رهگیری ${submittedOrderId} برای خدمت "${selectedService?.title}" در سایت تکویکس ثبت شد.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 text-xs font-black text-white shadow-[0_14px_30px_rgba(124,58,237,.25)]"
                  >
                    <Send className="h-4 w-4 rotate-180" /> چت با پشتیبانی
                  </a>
                  <a
                    href="https://t.me/Tekvixbot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3.5 text-xs font-black text-gray-200"
                  >
                    <Bot className="h-4 w-4 text-purple-300" /> مشاهده در Tekvixbot
                  </a>
                  {onOpenOrderTracking && (
                    <button
                      type="button"
                      onClick={() => submittedOrderId && onOpenOrderTracking(submittedOrderId)}
                      className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3.5 text-xs font-black text-emerald-200"
                    >
                      <Layers className="h-4 w-4" /> پیگیری این سفارش
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleModalClose}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-gray-500 transition hover:text-white"
                >
                  بستن پنجره ({countdown} ثانیه) <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex flex-1 flex-col overflow-y-auto">
              <div className="grid flex-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,.92fr)]">
                <aside className="relative order-1 border-b border-white/10 p-5 sm:p-7 lg:order-2 lg:border-b-0 lg:border-s-0">
                  <div className={`absolute -top-20 -end-20 h-56 w-56 rounded-full blur-3xl ${serviceVisual.glow}`} />
                  <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[.035] p-5 sm:p-6">
                    <div className="absolute -end-12 -top-12 h-32 w-32 rounded-full border border-white/10" />
                    <div className="absolute -end-7 -top-7 h-24 w-24 rounded-full border border-white/10" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/20 shadow-[0_0_35px_rgba(139,92,246,.16)]">
                        <ServiceIcon className={`h-8 w-8 ${serviceVisual.accent}`} />
                      </div>
                      <div className="text-end">
                        <div className={`text-[10px] font-black tracking-[.2em] ${serviceVisual.accent}`}>{serviceVisual.eyebrow}</div>
                        {selectedService?.badge && (
                          <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[.05] px-2.5 py-1 text-[10px] font-bold text-gray-300">
                            {selectedService.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative mt-7">
                      <p className="text-xs font-bold text-gray-500">سرویس انتخاب‌شده</p>
                      <h3 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{selectedService?.title || 'خدمات هوش مصنوعی'}</h3>
                      <h4 className={`mt-3 text-sm font-bold ${serviceVisual.accent}`}>{serviceVisual.headline}</h4>
                      <p className="mt-3 text-sm leading-7 text-gray-400">{serviceVisual.description}</p>
                    </div>

                    <div className="mt-6 space-y-2.5">
                      {serviceVisual.points.map((point) => (
                        <div key={point} className="flex items-center gap-2 rounded-xl border border-white/[.06] bg-black/10 px-3 py-2.5 text-xs text-gray-300">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[.06]">
                            <CheckCircle2 className={`h-3.5 w-3.5 ${serviceVisual.accent}`} />
                          </span>
                          {point}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl border border-white/[.06] bg-black/10 p-3">
                        <span className="text-[10px] text-gray-500">برآورد اولیه</span>
                        <div className="mt-1 text-sm font-black text-white">{selectedService?.estimatedPrice || 'پس از بررسی'}</div>
                      </div>
                      <div className="rounded-2xl border border-white/[.06] bg-black/10 p-3">
                        <span className="text-[10px] text-gray-500">پشتیبانی</span>
                        <div className="mt-1 text-sm font-black text-white">سریع و مستقیم</div>
                      </div>
                    </div>
                  </div>
                </aside>

                <section className="order-2 p-5 sm:p-7 lg:order-1">
                  {openingEventState.isCurrentlyOpen && (
                    <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-300/30 bg-gradient-to-r from-amber-300/10 via-purple-400/10 to-pink-400/10 p-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
                          <Gift className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-black text-amber-200">۱۰۰٪ تخفیف و رایگان — ایونت افتتاحیه</div>
                          <p className="mt-0.5 truncate text-[10px] text-gray-400">
                            ظرفیت: {openingEventState.remainingCapacity} از {openingEventState.config.maxWinners}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-lg bg-amber-300 px-2.5 py-1 text-[10px] font-black text-black">۰ تومان</span>
                    </div>
                  )}

                  {currentUser ? (
                    <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-xl border border-purple-400/30 object-cover" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-black text-white">
                            <span className="truncate">{currentUser.name}</span>
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                          </div>
                          <span className="block truncate text-[10px] text-gray-500">{currentUser.email}</span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-lg bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">ورود فعال</span>
                    </div>
                  ) : onOpenGoogleAuth ? (
                    <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.025] p-3">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Wand2 className="h-4 w-4 text-purple-300" /> ثبت‌نام با گوگل برای پیگیری راحت‌تر
                      </div>
                      <button type="button" onClick={onOpenGoogleAuth} className="rounded-xl border border-white/10 bg-white/[.05] px-3 py-2 text-[11px] font-bold text-white">ورود با گوگل</button>
                    </div>
                  ) : null}

                  <div className="mb-6">
                    <div className="mb-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[.18em] text-gray-500">01 • SERVICE</p>
                        <h3 className="mt-1 text-lg font-black">اول سرویس مناسب را انتخاب کن</h3>
                      </div>
                      <span className="hidden text-[10px] text-gray-500 sm:block">با انتخاب سرویس، پنل کناری تغییر می‌کند</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {quickCategories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = formData.serviceId === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleServiceChange(cat.id)}
                            className={`group rounded-2xl border p-3 text-start transition-all ${
                              isSelected
                                ? 'border-purple-400/50 bg-gradient-to-br from-purple-500/15 to-cyan-400/10 shadow-[0_0_30px_rgba(139,92,246,.12)]'
                                : 'border-white/[.08] bg-white/[.025] hover:border-white/20 hover:bg-white/[.05]'
                            }`}
                          >
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${isSelected ? 'border-purple-300/30 bg-purple-400/10' : 'border-white/[.08] bg-black/10'}`}>
                              <Icon className={`h-4 w-4 ${isSelected ? 'text-purple-200' : 'text-gray-500 group-hover:text-gray-300'}`} />
                            </div>
                            <div className={`mt-2 text-[11px] font-black ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{cat.label}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 rounded-2xl border border-purple-400/15 bg-purple-400/[.04] px-3.5 py-3">
                      <div className="flex items-center gap-2">
                        <ServiceIcon className={`h-4 w-4 ${serviceVisual.accent}`} />
                        <span className="text-xs font-black text-white">{selectedService?.title || 'خدمت انتخاب‌شده'}</span>
                        <span className="mr-auto text-[10px] text-gray-500">{selectedService?.categoryLabel || 'AI Service'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-3 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[.18em] text-gray-500">02 • PROJECT INFO</p>
                          <h3 className="mt-1 text-lg font-black">اطلاعات پروژه</h3>
                        </div>
                        <span className="text-[10px] text-gray-600">موارد ستاره‌دار الزامی‌اند</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><User className="h-3.5 w-3.5 text-purple-300" /> نام و نام خانوادگی *</span>
                          <input
                            id="modal-fullname"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => {
                              setFormData({ ...formData, fullName: e.target.value });
                              if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                            }}
                            placeholder="مثلاً مهدی حاتمی"
                            className={`w-full rounded-2xl border bg-white/[.03] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 ${errors.fullName ? 'border-rose-500/70' : 'border-white/[.08] focus:border-purple-400/50 focus:bg-white/[.05]'}`}
                          />
                          {errors.fullName && <span className="mt-1 flex items-center gap-1 text-[10px] text-rose-400"><AlertCircle className="h-3 w-3" />{errors.fullName}</span>}
                        </label>

                        <label className="block">
                          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><Send className="h-3.5 w-3.5 rotate-180 text-cyan-300" /> آیدی تلگرام *</span>
                          <input
                            id="modal-contact"
                            type="text"
                            value={formData.telegramOrPhone}
                            onChange={(e) => {
                              setFormData({ ...formData, telegramOrPhone: e.target.value });
                              if (errors.telegramOrPhone) setErrors({ ...errors, telegramOrPhone: undefined });
                            }}
                            placeholder="@username"
                            className={`w-full rounded-2xl border bg-white/[.03] px-4 py-3.5 text-sm font-mono text-white outline-none transition placeholder:text-gray-600 ${errors.telegramOrPhone ? 'border-rose-500/70' : 'border-white/[.08] focus:border-cyan-400/40 focus:bg-white/[.05]'}`}
                          />
                          {errors.telegramOrPhone && <span className="mt-1 flex items-center gap-1 text-[10px] text-rose-400"><AlertCircle className="h-3 w-3" />{errors.telegramOrPhone}</span>}
                        </label>
                      </div>
                    </div>

                    <div>
                      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><Layers className="h-3.5 w-3.5 text-purple-300" /> انتخاب سرویس</span>
                      <select
                        id="modal-service"
                        value={formData.serviceId}
                        onChange={(e) => handleServiceChange(e.target.value)}
                        className="w-full rounded-2xl border border-white/[.08] bg-white/[.03] px-4 py-3.5 text-sm text-white outline-none transition focus:border-purple-400/50"
                      >
                        {availableServices.map((srv) => (
                          <option key={srv.id} value={srv.id} className="bg-[#0b0915] text-white">
                            {srv.title}{srv.estimatedPrice ? ` — ${srv.estimatedPrice}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><MessageSquare className="h-3.5 w-3.5 text-cyan-300" /> توضیحات پروژه <span className="text-gray-600">(اختیاری)</span></span>
                      <textarea
                        id="modal-message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="ایده، امکانات، سبک موردنظر، نمونه مشابه یا هر چیزی که لازم است بدانیم را بنویس..."
                        className="w-full resize-none rounded-2xl border border-white/[.08] bg-white/[.03] px-4 py-3.5 text-sm leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:bg-white/[.05]"
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl border border-white/[.06] bg-white/[.02] p-2.5 text-center"><ShieldCheck className="mx-auto h-4 w-4 text-emerald-300" /><span className="mt-1 block text-[9px] leading-4 text-gray-500">مالکیت تجاری</span></div>
                    <div className="rounded-2xl border border-white/[.06] bg-white/[.02] p-2.5 text-center"><Clock className="mx-auto h-4 w-4 text-purple-300" /><span className="mt-1 block text-[9px] leading-4 text-gray-500">پاسخ سریع</span></div>
                    <div className="rounded-2xl border border-white/[.06] bg-white/[.02] p-2.5 text-center"><Send className="mx-auto h-4 w-4 rotate-180 text-cyan-300" /><span className="mt-1 block text-[9px] leading-4 text-gray-500">پشتیبانی مستقیم</span></div>
                  </div>
                </section>
              </div>

              <div className="sticky bottom-0 border-t border-white/10 bg-[#080712]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
                <div className="mx-auto flex max-w-5xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> با ارسال فرم، اطلاعات برای بررسی پروژه ثبت می‌شود.
                  </div>
                  <div className="sm:w-[360px]">
                    <NeuralSubmitButton
                      id="modal-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      onValidate={validate}
                      label="شروع پروژه ✨"
                      successLabel="درخواست با موفقیت ثبت شد ✓"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          <footer className="border-t border-white/[.06] px-5 py-3 text-[10px] text-gray-600 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <span>پشتیبانی مستقیم Tekvix</span>
              <a href="https://t.me/Lawat_kar" target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-purple-300 transition hover:text-white">@Lawat_kar</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
