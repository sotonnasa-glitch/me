import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Send,
  ShieldCheck,
  AlertCircle,
  Phone,
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
  FileText
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { OrderFormData } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  onOpenGoogleAuth?: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  onOpenGoogleAuth,
}) => {
  const {
    services,
    brandInfo,
    addOrder,
    sendOrderToTelegramBot,
    currentUser,
    trackServiceClick,
  } = useSiteData();

  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    telegramOrPhone: '',
    serviceId: initialServiceId || services[0]?.id || 'ai-website',
    message: '',
  });

  const [errors, setErrors] = useState<{ fullName?: string; telegramOrPhone?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string>('');
  const [countdown, setCountdown] = useState(10);
  const [copiedCode, setCopiedCode] = useState(false);

  // Quick service categories pills
  const quickCategories = [
    { id: 'ai-website', label: 'طراحی وب‌سایت', icon: Globe },
    { id: 'ai-video', label: 'ویدیو سینمایی', icon: Clapperboard },
    { id: 'telegram-bot', label: 'ربات تلگرام', icon: Bot },
    { id: 'image-creation', label: 'تصویر و گرافیک', icon: Palette },
    { id: 'ai-music', label: 'موزیک و صدا', icon: Music },
    { id: 'text-content', label: 'تولید محتوا', icon: FileText },
  ];

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name,
        telegramOrPhone: prev.telegramOrPhone || currentUser.email,
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (initialServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: initialServiceId }));
      trackServiceClick(initialServiceId);
    } else if (services.length > 0 && !formData.serviceId) {
      setFormData((prev) => ({ ...prev, serviceId: services[0].id }));
    }
  }, [initialServiceId, services]);

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

  const validate = (): boolean => {
    const newErrors: { fullName?: string; telegramOrPhone?: string } = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'لطفاً نام و نام خانوادگی خود را وارد کنید.';
    }
    if (!formData.telegramOrPhone.trim()) {
      newErrors.telegramOrPhone = 'لطفاً آیدی تلگرام یا شماره تماس خود را وارد کنید.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickFill = () => {
    setFormData({
      fullName: currentUser ? currentUser.name : 'مهدی حاتمی',
      telegramOrPhone: '@Lawat_kar',
      serviceId: formData.serviceId || 'ai-website',
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
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // 1. Save directly to centralized site database context
    const created = addOrder(formData);
    setSubmittedOrderId(created.id);

    // 2. Dispatch telegram notification to bot
    try {
      await sendOrderToTelegramBot(created);
    } catch (err) {
      console.warn('Telegram send ignored:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const selectedService = services.find((s) => s.id === formData.serviceId) || services[0];

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div
        id="order-modal-content"
        className="w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:rounded-3xl bg-gradient-to-b from-[#0e0924] via-[#090618] to-[#05030e] border-0 sm:border sm:border-purple-500/30 p-5 sm:p-8 shadow-[0_0_80px_rgba(147,51,234,0.35)] relative flex flex-col justify-between text-start my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Effect */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -end-10 w-60 h-60 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between pb-4 sm:pb-5 border-b border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 flex items-center justify-center text-white shadow-[0_0_18px_rgba(168,85,247,0.5)] shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">
                  {brandInfo.latinName || 'Tekvix'} AI
                </span>
                <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
                  پشتیبانی: {brandInfo.telegramHandle}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                سفارش خدمات هوش مصنوعی
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSuccess && (
              <button
                type="button"
                onClick={handleQuickFill}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-white bg-purple-950/70 hover:bg-purple-900/80 px-3 py-1.5 rounded-xl border border-purple-500/40 transition-colors cursor-pointer"
                title="تکمیل سریع نمونه برای تست فوری"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>تکمیل سریع نمونه</span>
              </button>
            )}

            <button
              type="button"
              id="order-modal-close-btn"
              onClick={handleModalClose}
              className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isSuccess ? (
          /* ================= SUCCESS STATE ================= */
          <div className="py-6 sm:py-8 text-center flex flex-col items-center justify-center relative z-10 space-y-6 animate-in zoom-in-95 duration-300">
            {/* Animated Celebration Icon */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 via-purple-500/20 to-indigo-500/20 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <span className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center">
                ✓
              </span>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                سفارش شما با موفقیت ثبت شد!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                اطلاعات سفارش در سیستم ثبت گردید و پیام بلادرنگ به ربات تلگرام و مدیریت ارسال شد.
              </p>
            </div>

            {/* Tracking Code Chip with 1-Click Copy */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#140e33] border border-purple-500/40 w-full max-w-md flex items-center justify-between shadow-inner">
              <div className="text-start">
                <span className="text-[11px] text-gray-400 block">کد رهگیری اختصاصی سفارش شما:</span>
                <span className="font-mono text-base sm:text-lg font-black text-purple-300 tracking-wider">
                  {submittedOrderId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyOrderCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی کد</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Instant Action Cards */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 w-full max-w-md space-y-3 text-start">
              <div className="flex items-center justify-between text-xs text-purple-200 border-b border-purple-500/20 pb-2.5">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>پیام به ربات ارسال شد</span>
                </span>
                <span className="font-mono text-[11px] text-gray-400">سرویس: {selectedService?.title}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Chat with Support @Lawat_kar */}
                <a
                  href={`https://t.me/Lawat_kar?text=${encodeURIComponent(
                    `سلام وقت بخیر! سفارش با کد رهگیری ${submittedOrderId} برای خدمت "${selectedService?.title}" در سایت تکویکس ثبت شد.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>چت با پشتیبانی (@Lawat_kar)</span>
                </a>

                {/* Open Telegram Bot */}
                <a
                  href="https://t.me/Tekvixbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>مشاهده در ربات Tekvixbot@</span>
                </a>
              </div>
            </div>

            {/* Close Button & Timer */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                بستن پنجره ({countdown} ثانیه)
              </button>
            </div>
          </div>
        ) : (
          /* ================= ORDER FORM STATE ================= */
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4 sm:space-y-5 my-auto py-2">
            
            {/* Google Authentication Quick Bar */}
            {currentUser ? (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 flex items-center justify-between text-xs text-purple-200">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover border border-purple-400 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span>{currentUser.name}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> گوگل متصل
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">{currentUser.email}</span>
                  </div>
                </div>
                <span className="text-[10px] text-purple-300 bg-white/5 px-2.5 py-1 rounded-lg">
                  اطلاعات خودکار
                </span>
              </div>
            ) : onOpenGoogleAuth ? (
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-[11px] sm:text-xs">ثبت‌نام با گوگل برای پیگیری راحت‌تر</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenGoogleAuth}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all cursor-pointer shrink-0"
                >
                  ورود با گوگل
                </button>
              </div>
            ) : null}

            {/* Quick Service Categories Carousel Pills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>انتخاب سریع خدمت مورد نظر</span>
                </span>
                <span className="text-[11px] text-purple-400 font-normal">کلیک جهت تغییر</span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {quickCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.serviceId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, serviceId: cat.id });
                        trackServiceClick(cat.id);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-105 font-bold'
                          : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 transition-transform group-hover:scale-110 ${isSelected ? 'text-purple-300' : 'text-gray-400'}`} />
                      <span className="text-[10px] leading-tight line-clamp-1">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Field 1: Full Name */}
              <div>
                <label htmlFor="modal-fullname" className="block text-xs font-medium text-gray-200 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>نام و نام خانوادگی</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  id="modal-fullname"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  placeholder="مثال: مهدی حاتمی"
                  className={`w-full px-4 py-3 rounded-2xl bg-[#120c2b] border text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all ${
                    errors.fullName
                      ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                      : 'border-purple-900/40 focus:border-purple-400 focus:bg-[#181039] focus:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Telegram or Phone Contact */}
              <div>
                <label htmlFor="modal-contact" className="block text-xs font-medium text-gray-200 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>آیدی تلگرام یا شماره تماس</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  id="modal-contact"
                  value={formData.telegramOrPhone}
                  onChange={(e) => {
                    setFormData({ ...formData, telegramOrPhone: e.target.value });
                    if (errors.telegramOrPhone) setErrors({ ...errors, telegramOrPhone: undefined });
                  }}
                  placeholder="مثال: @Lawat_kar یا 09123456789"
                  className={`w-full px-4 py-3 rounded-2xl bg-[#120c2b] border text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all font-mono ${
                    errors.telegramOrPhone
                      ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                      : 'border-purple-900/40 focus:border-purple-400 focus:bg-[#181039] focus:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  }`}
                />
                {errors.telegramOrPhone && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.telegramOrPhone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Field 3: Service Full Dropdown */}
            <div>
              <label htmlFor="modal-service" className="block text-xs font-medium text-gray-200 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>سرویس مشخص شده</span>
                  <span className="text-rose-400">*</span>
                </span>
                {selectedService?.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {selectedService.badge}
                  </span>
                )}
              </label>
              <select
                id="modal-service"
                value={formData.serviceId}
                onChange={(e) => {
                  setFormData({ ...formData, serviceId: e.target.value });
                  trackServiceClick(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[#120c2b] border border-purple-900/40 focus:border-purple-400 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id} className="bg-[#120d2c] text-white py-2">
                    {srv.title} ({srv.categoryLabel}) {srv.estimatedPrice ? `— ${srv.estimatedPrice}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 4: Description / Message */}
            <div>
              <label htmlFor="modal-message" className="block text-xs font-medium text-gray-200 mb-1.5 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>توضیحات و نیازمندی‌های پروژه (اختیاری)</span>
              </label>
              <textarea
                id="modal-message"
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="خلاصه سناریوی ویدیو، امکانات مدنظر وب‌سایت یا ربات تلگرام..."
                className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-[#120c2b] border border-purple-900/40 focus:border-purple-400 focus:bg-[#181039] text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 py-1 text-[10px] sm:text-[11px] text-gray-400 text-center">
              <div className="flex items-center justify-center gap-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>مالکیت ۱۰۰٪ تجاری</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/5">
                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>تحویل در سریع‌ترین زمان</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/5">
                <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0 rotate-180" />
                <span>پشتیبانی با @Lawat_kar</span>
              </div>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="modal-submit-btn"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-[0_0_35px_rgba(147,51,234,0.6)] hover:shadow-[0_0_45px_rgba(147,51,234,0.9)] transition-all flex items-center justify-center gap-2.5 focus:outline-none disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>در حال ثبت و ارسال به ربات تلگرام...</span>
                  </div>
                ) : (
                  <>
                    <span>ثبت نهایی سفارش و ارسال به ربات تلگرام</span>
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Bottom Support Info */}
        <div className="relative z-10 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
          <span>آیدی مدیریت و پشتیبانی مستقیم:</span>
          <a
            href="https://t.me/Lawat_kar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-purple-300 font-bold hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>@Lawat_kar</span>
            <Send className="w-3 h-3 rotate-180" />
          </a>
        </div>
      </div>
    </div>
  );
};
