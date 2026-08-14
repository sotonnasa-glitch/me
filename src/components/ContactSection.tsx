import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Copy, ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const ContactSection: React.FC = () => {
  const { brandInfo, addOrder } = useSiteData();
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    message: '',
  });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyTelegram = () => {
    navigator.clipboard.writeText(brandInfo.telegramHandle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactInfo) return;

    // Automatically record lead/order in site database
    addOrder({
      fullName: formData.name,
      telegramOrPhone: formData.contactInfo,
      serviceTitle: 'مشاوره و استعلام عمومی',
      message: formData.message,
    });

    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-[#05050d] overflow-hidden border-t border-purple-900/20">
      {/* Background glow */}
      <div className="absolute top-1/2 end-10 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>راه‌های ارتباطی</span>
          </div>

          <h2
            id="contact-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            تماس با تیم {brandInfo.name || 'تکویکس'}
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            برای مشاوره رایگان، استعلام قیمت یا پیگیری سفارش، از طریق تلگرام یا فرم زیر با ما در ارتباط باشید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Direct Telegram Card */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#160e33] to-[#0b081c] border border-purple-500/30 shadow-[0_0_40px_rgba(147,51,234,0.15)] flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-6 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <Send className="w-7 h-7 rotate-180" />
              </div>

              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                کانال ارتباطی اصلی
              </span>

              <h3 className="text-2xl font-bold text-white mb-3">
                ارتباط مستقیم در تلگرام
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                سریع‌ترین روش برای دریافت مشاوره، ارسال فایل و بررسی نیازمندی‌های پروژه شما. کارشناسان ما به طور مداوم پاسخگوی پیام‌ها هستند.
              </p>

              {/* Telegram ID Box with Copy */}
              <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/20 flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold">
                    @
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">آیدی اختصاصی تلگرام</span>
                    <span className="font-mono text-base font-bold text-white select-all">
                      {brandInfo.telegramHandle}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="copy-telegram-btn"
                  onClick={handleCopyTelegram}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 text-gray-300 hover:text-white transition-all"
                  title="کپی آیدی تلگرام"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <a
              href={brandInfo.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 transition-all"
            >
              <span>باز کردن چت تلگرام</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 p-7 sm:p-8 rounded-3xl bg-[#090717] border border-white/[0.08] shadow-xl">
            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">پیام شما دریافت شد!</h3>
                <p className="text-sm text-gray-300 max-w-sm mx-auto mb-6">
                  به زودی از طریق تلگرام یا اطلاعات تماسی که وارد کردید با شما ارتباط برقرار خواهیم کرد.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', contactInfo: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-purple-300 border border-purple-500/20"
                >
                  ارسال پیام دیگر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-white/[0.06] pb-4 mb-2">
                  <h3 className="text-lg font-bold text-white">ارسال پیام و شرح ایده</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    فرم زیر را تکمیل کنید تا کارشناسان ما بررسی اولیه را انجام دهند.
                  </p>
                </div>

                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-gray-300 mb-2">
                    نام و نام خانوادگی <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: علی محمدی"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-purple-500 focus:bg-purple-950/20 text-white placeholder:text-gray-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-info" className="block text-xs font-medium text-gray-300 mb-2">
                    آیدی تلگرام یا شماره موبایل <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-info"
                    required
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder="مثال: @my_telegram_id یا 09123456789"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-purple-500 focus:bg-purple-950/20 text-white placeholder:text-gray-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-msg" className="block text-xs font-medium text-gray-300 mb-2">
                    توضیحات یا پیام شما (اختیاری)
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="مختصری از نیازمندی‌ها، حجم پروژه یا سوالات خود را بنویسید..."
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-purple-500 focus:bg-purple-950/20 text-white placeholder:text-gray-500 text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <span>ارسال پیام و ثبت در سیستم</span>
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
