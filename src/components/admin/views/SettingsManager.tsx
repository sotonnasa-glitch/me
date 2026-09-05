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
  ExternalLink,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';

export const SettingsManager: React.FC = () => {
  const {
    brandInfo,
    updateBrandInfo,
    telegramSettings,
    updateTelegramSettings,
    testTelegramBotConnection,
    changeAdminPassword,
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

  // Password Management state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!passwordForm.newPassword) {
      setPasswordStatus({ error: 'لطفاً رمز عبور جدید را وارد کنید.' });
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      setPasswordStatus({ error: 'رمز عبور جدید باید حداقل ۴ کاراکتر باشد.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ error: 'رمز عبور جدید و تکرار آن یکسان نیستند.' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changeAdminPassword(passwordForm.oldPassword, passwordForm.newPassword);
      if (res.success) {
        setPasswordStatus({ success: true, message: res.message || 'رمز عبور با موفقیت تغییر یافت.' });
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordStatus({ error: res.error || 'رمز عبور فعلی نادرست است.' });
      }
    } catch (err: any) {
      setPasswordStatus({ error: 'خطا در ارتباط با سرور.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleTestBot = async () => {
    setIsTestingBot(true);
    setTestResult(null);
    try {
      // First save the current token and chat ID
      updateTelegramSettings(botForm);
      const res = await testTelegramBotConnection(botForm);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err?.message || 'خطا در برقراری ارتباط با سرور تلگرام',
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

          {/* Step by step guide */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-zinc-300 space-y-2">
            <h3 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>راهنمای ۳ مرحله‌ای فعال‌سازی ارسال پیام به ربات تلگرام:</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-zinc-300 leading-relaxed pr-1">
              <li>
                <strong className="text-white">دریافت توکن:</strong> در تلگرام به <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-purple-300 underline font-mono">@BotFather</a> رفته، دستور <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">/newbot</code> را بزنید و توکن داده‌شده را در کادر زیر وارد کنید.
              </li>
              <li>
                <strong className="text-white">استارت ربات:</strong> حتماً وارد ربات تلگرامی که ساختید شوید و دکمه <span className="text-emerald-400 font-bold">Start (شروع)</span> را بزنید (تلگرام به رباتی که استارت نشده اجازه ارسال پیام نمی‌دهد).
              </li>
              <li>
                <strong className="text-white">دریافت شناسه چت (Chat ID):</strong> به ربات رایگان <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-purple-300 underline font-mono">@userinfobot</a> پیام دهید تا شناسه عددی (مثل <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">123456789</code>) را به شما بدهد و در کادر چت‌آیدی وارد کنید.
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                توکن ربات تلگرام (Telegram Bot Token) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={botForm.botToken}
                onChange={(e) => setBotForm({ ...botForm, botToken: e.target.value })}
                placeholder="7123456789:AAHq..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                توکن اختصاصی دریافت‌شده از BotFather@
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-zinc-300">
                  شناسه چت عددی یا کانال (Chat ID) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] text-amber-400 font-mono">شناسه چت شما: 7460143967</span>
              </div>
              <input
                type="text"
                value={botForm.chatId}
                onChange={(e) => setBotForm({ ...botForm, chatId: e.target.value })}
                placeholder="7460143967 یا -1003569018930"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-zinc-400">انتخاب سریع:</span>
                <button
                  type="button"
                  onClick={() => setBotForm({ ...botForm, chatId: '7460143967' })}
                  className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white text-[10px] transition-colors"
                >
                  چت شخصی شما (7460143967)
                </button>
                <button
                  type="button"
                  onClick={() => setBotForm({ ...botForm, chatId: '-1003569018930' })}
                  className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white text-[10px] transition-colors"
                >
                  کانال تکویکس (-1003569018930)
                </button>
                <button
                  type="button"
                  onClick={() => setBotForm({ ...botForm, chatId: '7460143967, -1003569018930' })}
                  className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white text-[10px] transition-colors"
                >
                  ارسال همزمان به چت و کانال
                </button>
              </div>
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
              className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 animate-in fade-in leading-relaxed ${
                testResult.success
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Bot className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.success ? testResult.message : (testResult.error || testResult.message)}</span>
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
                placeholder="@Lawat_kar"
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
                placeholder="https://t.me/Lawat_kar"
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

        {/* ADMIN PASSWORD MANAGEMENT (NEW) */}
        <div className="p-6 rounded-3xl bg-[#09061c] border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>تغییر رمز عبور ورود به پنل مدیریت</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                    امنیت پنل
                  </span>
                </h2>
                <span className="text-[11px] text-zinc-400">
                  برای جلوگیری از دسترسی غیرمجاز، رمز پنل ادمین را به یک رمز دلخواه و ایمن تغییر دهید.
                </span>
              </div>
            </div>
          </div>

          {passwordStatus && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                passwordStatus.success
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
            >
              {passwordStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{passwordStatus.message || passwordStatus.error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {/* Old Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                رمز عبور فعلی
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? 'text' : 'password'}
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="رمز عبور قبلی..."
                  className="w-full ps-3.5 pe-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="حداقل ۴ کاراکتر..."
                  className="w-full ps-3.5 pe-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                تکرار رمز عبور جدید
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="تکرار رمز عبور جدید..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isChangingPass || !passwordForm.newPassword}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isChangingPass ? 'در حال تغییر...' : 'ثبت و تغییر رمز ادمین'}</span>
            </button>
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
