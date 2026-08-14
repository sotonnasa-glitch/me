import React, { useState } from 'react';
import {
  Settings,
  Send,
  Sparkles,
  Save,
  CheckCircle2,
  Bell,
  Globe,
  MessageSquare,
  Bot,
  ShieldCheck,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';

export const SettingsManager: React.FC = () => {
  const {
    brandInfo,
    updateBrandInfo,
    telegramSettings,
    updateTelegramSettings,
    testTelegramBotNotification,
  } = useSiteData();

  const [form, setForm] = useState({
    name: brandInfo.name,
    latinName: brandInfo.latinName,
    tagline: brandInfo.tagline,
    telegramHandle: brandInfo.telegramHandle,
    telegramUrl: brandInfo.telegramUrl,
    heroHeadline: brandInfo.heroHeadline,
    heroSubtext: brandInfo.heroSubtext,
    announcementText:
      brandInfo.announcementText ||
      '🔥 ثبت سفارش پروژه‌های ویدیویی و طراحی سایت با هوش مصنوعی در کمتر از ۴۸ ساعت!',
    showAnnouncement: brandInfo.showAnnouncement ?? true,
  });

  const [botForm, setBotForm] = useState({
    botToken: telegramSettings.botToken,
    chatId: telegramSettings.chatId,
    autoNotifyNewOrders: telegramSettings.autoNotifyNewOrders,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(
    null
  );
  const [isTestingBot, setIsTestingBot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandInfo(form);
    updateTelegramSettings(botForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestBot = async () => {
    setIsTestingBot(true);
    setTestResult(null);
    try {
      const res = await testTelegramBotNotification();
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        message: 'خطا در ارتباط با سرور یا ارسال پیام تلگرام',
      });
    } finally {
      setIsTestingBot(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl font-sans" dir="rtl">
      
      {/* Header */}
      <div className="pb-4 border-b border-purple-900/30">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" />
          <span>تنظیمات عمومی سایت، برند، هوش مصنوعی و ربات تلگرام</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          تنظیم اطلاعات برند، اتصال مستقیم پیام‌های سفارش به ربات تلگرام، تیترهای اصلی و اعلان بالای سایت.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>کلیه تنظیمات سایت و ربات تلگرام با موفقیت ذخیره شد!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* TELEGRAM BOT REAL INTEGRATION (NEW & ENHANCED) */}
        <div className="p-6 rounded-3xl bg-[#09061c] border border-purple-500/40 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>اتصال مستقیم سفارشات به ربات تلگرام (Telegram Bot API)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    فعال و آماده
                  </span>
                </h2>
                <span className="text-[11px] text-zinc-400">
                  هر سفارشی که در سایت ثبت شود، فوراً با جزئیات کامل به ربات تلگرام شما ارسال می‌شود.
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
              <input
                type="checkbox"
                checked={botForm.autoNotifyNewOrders}
                onChange={(e) =>
                  setBotForm({ ...botForm, autoNotifyNewOrders: e.target.checked })
                }
                className="w-4 h-4 rounded text-purple-600 bg-white/5 border-white/20"
              />
              <span className="font-semibold">ارسال خودکار پیام سفارش</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                توکن ربات تلگرام (Telegram Bot Token)
              </label>
              <input
                type="password"
                value={botForm.botToken}
                onChange={(e) => setBotForm({ ...botForm, botToken: e.target.value })}
                placeholder="123456789:ABCDefghIJKlmnoPQRstuvWXyz..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                دریافت از @BotFather در تلگرام (یا خالی بگذارید تا از آیدی پشتیبانی استفاده شود)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                چت‌آیدی یا آیدی تلگرام ادمین (Admin Chat ID / Username)
              </label>
              <input
                type="text"
                value={botForm.chatId}
                onChange={(e) => setBotForm({ ...botForm, chatId: e.target.value })}
                placeholder="مثال: @arnirhq یا 12345678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                شناسه چت یا نام کاربری دریافت‌کننده اعلانات سفارشات جدید
              </span>
            </div>
          </div>

          {/* Test Bot Notification Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-purple-950/30 p-3 rounded-2xl border border-purple-500/20">
            <div className="text-xs text-purple-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>تست ارسال پیام آزمایشی به ربات تلگرام جهت اطمینان از اتصال:</span>
            </div>

            <button
              type="button"
              onClick={handleTestBot}
              disabled={isTestingBot}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
              <span>{isTestingBot ? 'در حال ارسال...' : 'ارسال پیام تست به ربات'}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                testResult.success
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Bot className="w-4 h-4 text-amber-400" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Telegram & Contact Info */}
        <div className="p-6 rounded-2xl bg-[#0d0922] border border-purple-500/30 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-purple-300 pb-2 border-b border-white/5">
            <Send className="w-4 h-4 rotate-180" />
            <h2 className="text-sm font-bold text-white">راه‌های ارتباطی و تلگرام رسمی</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                آیدی تلگرام پشتیبانی و ثبت سفارش <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.telegramHandle}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({
                    ...form,
                    telegramHandle: val,
                    telegramUrl: `https://t.me/${val.replace(/^@/, '')}`,
                  });
                }}
                placeholder="@arnirhq"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                این آیدی در تمامی دکمه‌های تماس، فوتر، فرم سفارش و بنرها اعمال می‌شود.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                لینک مستقیم چت تلگرام
              </label>
              <input
                type="text"
                value={form.telegramUrl}
                onChange={(e) => setForm({ ...form, telegramUrl: e.target.value })}
                placeholder="https://t.me/arnirhq"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Brand Names & Tagline */}
        <div className="p-6 rounded-2xl bg-[#0d0922] border border-purple-900/30 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-purple-300 pb-2 border-b border-white/5">
            <Globe className="w-4 h-4" />
            <h2 className="text-sm font-bold text-white">نام برند و هویت سازمانی</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">نام فارسی برند</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="تکویکس"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">نام لاتین برند</label>
              <input
                type="text"
                value={form.latinName}
                onChange={(e) => setForm({ ...form, latinName: e.target.value })}
                placeholder="Tekvix"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-sans focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                شعار برند (Tagline)
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="پلتفرم خدمات هوش مصنوعی و دیجیتال"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Texts */}
        <div className="p-6 rounded-2xl bg-[#0d0922] border border-purple-900/30 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-purple-300 pb-2 border-b border-white/5">
            <Sparkles className="w-4 h-4" />
            <h2 className="text-sm font-bold text-white">تیتر و متن بخش اصلی هیرو (Hero)</h2>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              تیتر بزرگ صفحه اصلی (Hero Headline)
            </label>
            <input
              type="text"
              value={form.heroHeadline}
              onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              توضیحات زیر تیتر هیرو (Hero Subtext)
            </label>
            <textarea
              rows={3}
              value={form.heroSubtext}
              onChange={(e) => setForm({ ...form, heroSubtext: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Top Announcement Bar */}
        <div className="p-6 rounded-2xl bg-[#0d0922] border border-purple-900/30 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-purple-300">
              <Bell className="w-4 h-4" />
              <h2 className="text-sm font-bold text-white">
                نوار اعلان بالای سایت (Announcement Bar)
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={form.showAnnouncement}
                onChange={(e) => setForm({ ...form, showAnnouncement: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 bg-white/5 border-white/20"
              />
              <span>نمایش در بالای سایت</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">متن پیام اعلان</label>
            <input
              type="text"
              value={form.announcementText}
              onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
              placeholder="مثال: 🔥 ثبت سفارش با تخفیف ویژه..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(147,51,234,0.4)] flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره کلیه تنظیمات و اتصال ربات تلگرام</span>
          </button>
        </div>
      </form>
    </div>
  );
};
