import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowLeft, Sparkles, Send, Bot, ShieldCheck } from 'lucide-react';
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
  const { services, brandInfo, addOrder, currentUser, trackServiceClick } = useSiteData();

  const [formData, setFormData] = useState<OrderFormData>({
    fullName: currentUser?.name || '',
    telegramOrPhone: currentUser?.email || '',
    serviceId: initialServiceId || services[0]?.id || 'ai-website',
    message: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string>('');
  const [countdown, setCountdown] = useState(6);

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
    setCountdown(6);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.telegramOrPhone.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Save directly to centralized site database context & trigger telegram send
    const created = addOrder(formData);
    setSubmittedOrderId(created.id);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 450);
  };

  const selectedService = services.find((s) => s.id === formData.serviceId);

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="order-modal-content"
        className="w-full max-w-lg rounded-3xl bg-[#0d0922] border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] relative overflow-hidden text-start"
      >
        {/* Background Aura */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          id="order-modal-close-btn"
          onClick={handleModalClose}
          className="absolute top-5 end-5 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="py-6 text-center flex flex-col items-center justify-center relative z-10 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">
                درخواست شما با موفقیت ثبت و به ربات تلگرام ارسال شد!
              </h3>
              <div className="text-xs text-purple-300 font-mono">
                کد رهگیری اختصاصی: <span className="font-bold text-white bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">{submittedOrderId}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
              اطلاعات سفارش در سرور ثبت گردید و نوتیفیکیشن اختصاصی به ربات تلگرام ارسال شد. کارشناسان به زودی با شما ارتباط برقرار خواهند کرد.
            </p>

            {/* Direct Telegram Action Card */}
            <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 w-full text-center space-y-2.5">
              <div className="flex items-center justify-center gap-2 text-xs text-purple-200">
                <Send className="w-4 h-4 text-purple-400 rotate-180" />
                <span>پیگیری آنی در تلگرام:</span>
                <span className="font-mono font-bold text-white">{brandInfo.telegramHandle}</span>
              </div>

              <a
                href={`https://t.me/${brandInfo.telegramHandle.replace('@', '')}?text=${encodeURIComponent(
                  `سلام! سفارش با کد ${submittedOrderId} برای سرویس ${selectedService?.title || ''} در سایت ثبت شد.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
                <span>مشاهده و چت مستقیم در تلگرام</span>
              </a>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold shadow-md transition-colors"
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
                <span>ثبت سفارش و اتصال به ربات تلگرام</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                سفارش خدمات هوش مصنوعی {brandInfo.name || 'تکویکس'}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                سفارش شما فوراً به ربات تلگرام و دیتابیس ادمین ارسال خواهد شد.
              </p>
            </div>

            {currentUser && (
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
                <div className="flex items-center gap-2">
                  <img src={currentUser.avatar} alt="User" className="w-5 h-5 rounded-md" />
                  <span>وارد شده با حساب گوگل: <strong>{currentUser.name}</strong></span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> خودکار پر شد
                </span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="modal-fullname" className="block text-xs font-medium text-gray-200 mb-1">
                نام و نام خانوادگی <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                id="modal-fullname"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="مثال: مهدی حاتمی"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 focus:bg-purple-950/20 text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all"
              />
            </div>

            {/* Telegram or Phone */}
            <div>
              <label htmlFor="modal-contact" className="block text-xs font-medium text-gray-200 mb-1">
                آیدی تلگرام یا شماره تماس <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                id="modal-contact"
                required
                value={formData.telegramOrPhone}
                onChange={(e) => setFormData({ ...formData, telegramOrPhone: e.target.value })}
                placeholder="مثال: @my_telegram_id یا 09123456789"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 focus:bg-purple-950/20 text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all font-mono"
              />
            </div>

            {/* Service Dropdown */}
            <div>
              <label htmlFor="modal-service" className="block text-xs font-medium text-gray-200 mb-1">
                انتخاب سرویس مورد نظر <span className="text-rose-400">*</span>
              </label>
              <select
                id="modal-service"
                value={formData.serviceId}
                onChange={(e) => {
                  setFormData({ ...formData, serviceId: e.target.value });
                  trackServiceClick(e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f2e] border border-white/10 focus:border-purple-500 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id} className="bg-[#0f0b24] text-white">
                    {srv.title} ({srv.categoryLabel}) {srv.estimatedPrice ? `— ${srv.estimatedPrice}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Message / Details */}
            <div>
              <label htmlFor="modal-message" className="block text-xs font-medium text-gray-200 mb-1">
                توضیحات و نیازمندی‌های پروژه (اختیاری)
              </label>
              <textarea
                id="modal-message"
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="خلاصه سناریوی ویدیو، امکانات مدنظر وب‌سایت یا ربات تلگرام..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 focus:bg-purple-950/20 text-white placeholder:text-gray-500 text-xs sm:text-sm focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                id="modal-submit-btn"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>در حال ارسال به ربات و ثبت...</span>
                ) : (
                  <>
                    <span>ثبت سفارش و ارسال پیام تلگرام</span>
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
