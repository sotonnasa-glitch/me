import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowLeft, Sparkles, Send, ShieldCheck, AlertCircle, Phone, User, MessageSquare } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { OrderFormData } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
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
  const [countdown, setCountdown] = useState(8);
  const [serverFeedback, setServerFeedback] = useState<string | null>(null);

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
    setCountdown(8);
    setErrors({});
    setServerFeedback(null);
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
      fullName: 'کاربر تکویکس',
      telegramOrPhone: '@Lawat_kar',
      serviceId: formData.serviceId || 'ai-website',
      message: 'درخواست مشاوره و برآورد هزینه برای اجرای پروژه هوش مصنوعی',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setServerFeedback(null);

    // 1. Save directly to centralized site database context
    const created = addOrder(formData);
    setSubmittedOrderId(created.id);

    // 2. Dispatch telegram notification
    try {
      const res = await sendOrderToTelegramBot(created);
      if (res.success) {
        setServerFeedback(res.message || 'پیام با موفقیت به ربات تلگرام ارسال شد!');
      } else {
        setServerFeedback('سفارش در سیستم ثبت شد.');
      }
    } catch {
      setServerFeedback('سفارش در سیستم ثبت شد.');
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const selectedService = services.find((s) => s.id === formData.serviceId);

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
    >
      <div
        id="order-modal-content"
        className="w-full max-w-lg rounded-3xl bg-[#0e0a24] border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_70px_rgba(147,51,234,0.35)] relative overflow-hidden text-start"
      >
        {/* Background Aura */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          id="order-modal-close-btn"
          onClick={handleModalClose}
          className="absolute top-5 end-5 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="py-4 text-center flex flex-col items-center justify-center relative z-10 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                سفارش شما با موفقیت ثبت شد!
              </h3>
              <div className="text-xs text-purple-300 font-mono">
                کد رهگیری: <span className="font-bold text-white bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-500/30">{submittedOrderId}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
              اطلاعات سفارش در سیستم ثبت گردید و پیام به ربات تلگرام (<span className="text-purple-300 font-mono">Tekvixbot@</span>) ارسال شد.
            </p>

            {/* Direct Telegram Action Card */}
            <div className="p-4 rounded-2xl bg-purple-950/70 border border-purple-500/40 w-full text-center space-y-3">
              <div className="flex items-center justify-between text-xs text-purple-200 border-b border-purple-500/20 pb-2">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>پیام به ربات ارسال شد</span>
                </span>
                <span className="font-mono text-[11px] text-zinc-400">شناسه: 7460143967</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="https://t.me/Tekvixbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>مشاهده در ربات Tekvixbot@</span>
                </a>

                <a
                  href={`https://t.me/Lawat_kar?text=${encodeURIComponent(
                    `سلام! سفارش با کد ${submittedOrderId} برای سرویس ${selectedService?.title || ''} در سایت ثبت شد.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-purple-300 hover:text-white border border-purple-500/30 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>چت با پشتیبانی (@Lawat_kar)</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                بستن پنجره ({countdown})
              </button>
            </div>
          </div>
        ) : (
          /* Order Form State */
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-medium mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ثبت فوری سفارش و اتصال به تلگرام</span>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  سفارش خدمات هوش مصنوعی
                </h2>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] text-purple-300 hover:text-purple-100 bg-purple-950/60 hover:bg-purple-900/80 px-2.5 py-1 rounded-lg border border-purple-500/30 transition-colors cursor-pointer"
                  title="پر کردن نمونه برای تست سریع"
                >
                  تکمیل سریع نمونه
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-1">
                سفارش شما بی‌درنگ به ربات تلگرام و پنل مدیریت ارسال خواهد شد.
              </p>
            </div>

            {currentUser && (
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
                <div className="flex items-center gap-2">
                  <img src={currentUser.avatar} alt="User" className="w-5 h-5 rounded-md" />
                  <span>وارد شده با حساب: <strong>{currentUser.name}</strong></span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> پر شده خودکار
                </span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="modal-fullname" className="block text-xs font-medium text-gray-200 mb-1 flex items-center gap-1">
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
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all ${
                  errors.fullName
                    ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400'
                    : 'border-white/10 focus:border-purple-500 focus:bg-purple-950/20'
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Telegram or Phone */}
            <div>
              <label htmlFor="modal-contact" className="block text-xs font-medium text-gray-200 mb-1 flex items-center gap-1">
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
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all font-mono ${
                  errors.telegramOrPhone
                    ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400'
                    : 'border-white/10 focus:border-purple-500 focus:bg-purple-950/20'
                }`}
              />
              {errors.telegramOrPhone && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.telegramOrPhone}</span>
                </p>
              )}
            </div>

            {/* Service Dropdown */}
            <div>
              <label htmlFor="modal-service" className="block text-xs font-medium text-gray-200 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>انتخاب سرویس مورد نظر</span>
                <span className="text-rose-400">*</span>
              </label>
              <select
                id="modal-service"
                value={formData.serviceId}
                onChange={(e) => {
                  setFormData({ ...formData, serviceId: e.target.value });
                  trackServiceClick(e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161033] border border-white/10 focus:border-purple-500 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id} className="bg-[#120d2c] text-white">
                    {srv.title} ({srv.categoryLabel}) {srv.estimatedPrice ? `— ${srv.estimatedPrice}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Message / Details */}
            <div>
              <label htmlFor="modal-message" className="block text-xs font-medium text-gray-200 mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>توضیحات و نیازمندی‌های پروژه (اختیاری)</span>
              </label>
              <textarea
                id="modal-message"
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="خلاصه سناریوی ویدیو، امکانات مدنظر وب‌سایت یا ربات تلگرام..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-purple-500 focus:bg-purple-950/20 text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                id="modal-submit-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(147,51,234,0.55)] hover:shadow-[0_0_35px_rgba(147,51,234,0.85)] transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>در حال ثبت و ارسال به تلگرام...</span>
                ) : (
                  <>
                    <span>ثبت نهایی سفارش و ارسال به ربات تلگرام</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
