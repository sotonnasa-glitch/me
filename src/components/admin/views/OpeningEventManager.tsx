import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Users,
  Flame,
  Calendar,
  ExternalLink,
  Send,
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { OpeningEventConfig } from '../../../types';

export const OpeningEventManager: React.FC = () => {
  const { openingEventState, updateOpeningEventConfig, refreshOpeningEvent } = useSiteData();
  const { config, status, remainingCapacity, totalEligibleOrders, winners, isCurrentlyOpen } =
    openingEventState;

  const [formData, setFormData] = useState<OpeningEventConfig>({
    ...config,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOpeningEventConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSetQuickDuration = (days: number) => {
    const end = new Date(Date.now() + days * 86400000).toISOString();
    setFormData((prev) => ({
      ...prev,
      endDate: end,
    }));
  };

  const handleResetDefaults = () => {
    const defaults: OpeningEventConfig = {
      isActive: true,
      title: 'جشن افتتاحیه TEKVIX | اولین سفارش‌ها رایگان',
      subtitle: 'فرصت استثنایی برای ۲ سفارش اول با ۱۰۰٪ تخفیف و هزینه کاملاً رایگان',
      badgeText: '🎉 کمپین افتتاحیه ویژه',
      highlightText: '🔥 فقط ۲ سفارش اول رایگان!',
      description:
        'هر خدمتی که از TEKVIX انتخاب کنی، برای ۲ نفر اول کاملاً رایگان انجام می‌شود. 🤖✨',
      startDate: new Date(Date.now() - 24 * 3600000).toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      maxWinners: 2,
      termsNote:
        'هر کاربر فقط یک‌بار امکان استفاده از جایزه را دارد. سفارش‌های لغوشده محاسبه نمی‌شوند.',
    };
    setFormData(defaults);
    updateOpeningEventConfig(defaults);
  };

  const formatPersianDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                مدیریت ایونت و کمپین افتتاحیه سایت
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                تنظیم زمان‌بندی، سقف تعداد برندگان، متن‌ها و مشاهده زنده برندگان سفارش رایگان
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshOpeningEvent}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold border border-zinc-800 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>به‌روزرسانی وضعیت</span>
          </button>
        </div>
      </div>

      {/* Live Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Card 1: Status */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
          <span className="text-[11px] text-zinc-400 font-semibold block">وضعیت لحظه‌ای کمپین</span>
          <div className="flex items-center gap-2">
            {isCurrentlyOpen ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>در حال اجرا و فعال</span>
              </span>
            ) : status === 'completed' ? (
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-black flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ظرفیت ۲ برنده تکمیل شد</span>
              </span>
            ) : status === 'expired' ? (
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>زمان کمپین منقضی شد</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>غیرفعال دستی</span>
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Capacity Left */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold block">ظرفیت باقی‌مانده</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">
              {remainingCapacity}
            </span>
            <span className="text-xs text-zinc-400">از {config.maxWinners} سفارش رایگان</span>
          </div>
        </div>

        {/* Card 3: Eligible Winners registered */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold block">برندگان ثبت‌شده</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {totalEligibleOrders}
            </span>
            <span className="text-xs text-zinc-400">سفارش تایید شده</span>
          </div>
        </div>

        {/* Card 4: End Date */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold block">مهلت پایان</span>
          <span className="text-xs font-mono text-purple-300 font-bold block truncate">
            {formatPersianDate(config.endDate)}
          </span>
        </div>

      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800/80 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              <span>پیکربندی و متن‌های تبلیغاتی کمپین</span>
            </h2>

            {/* Main Active Switch */}
            <label className="relative inline-flex items-center cursor-pointer gap-2">
              <span className="text-xs font-bold text-zinc-300">
                {formData.isActive ? 'کمپین روشن است' : 'کمپین خاموش است'}
              </span>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                عنوان اصلی ایونت
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                زیرعنوان و شعار
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Badge Text */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                متن برچسب (Badge)
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Highlight Text */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                متن برجسته ظرفیت
              </label>
              <input
                type="text"
                value={formData.highlightText}
                onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Max Winners Capacity */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                ظرفیت تعداد سفارش‌های رایگان (سقف برندگان)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.maxWinners}
                onChange={(e) =>
                  setFormData({ ...formData, maxWinners: parseInt(e.target.value, 10) || 2 })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                به‌طور پیش‌فرض ۲ سفارش اول رایگان است. پس از رسیدن به این عدد کمپین خودکار متوقف می‌شود.
              </span>
            </div>

            {/* End Date & Time Presets */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>تاریخ و ساعت پایان کمپین</span>
                <span className="text-[11px] text-purple-400 font-normal">تمدید سریع:</span>
              </label>

              <input
                type="datetime-local"
                value={formData.endDate.slice(0, 16)}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: new Date(e.target.value).toISOString() })
                }
                className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleSetQuickDuration(3)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 transition-colors"
                >
                  +۳ روز
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDuration(7)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 transition-colors"
                >
                  +۷ روز (یک هفته)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDuration(14)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 transition-colors"
                >
                  +۱۴ روز (دو هفته)
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                توضیحات کامل ایونت برای کاربر
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Terms Note */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                قوانین و شرایط کوتاه (نمایش زیر تایمر)
              </label>
              <input
                type="text"
                value={formData.termsNote}
                onChange={(e) => setFormData({ ...formData, termsNote: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors"
            >
              بازنشانی به تنظیمات پیش‌فرض
            </button>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تنظیمات ایونت ذخیره شد!</span>
                </span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره و اعمال در سایت</span>
              </button>
            </div>
          </div>

        </div>

      </form>

      {/* Winners List Table */}
      <div className="p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>لیست برندگان ثبت‌شده (سفارش‌های رایگان افتتاحیه)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              مشتریانی که موفق شدند در بازه کمپین سفارش رایگان خود را ثبت کنند.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/20">
            {winners.length} برنده
          </span>
        </div>

        {winners.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-500 text-xs">
            هنوز سفارشی با شرایط رایگان ثبت نشده است. به محض ثبت اولین سفارش توسط کاربران، اطلاعات در این جدول قرار می‌گیرد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-3 text-start font-semibold">ردیف</th>
                  <th className="pb-3 text-start font-semibold">نام مشتری</th>
                  <th className="pb-3 text-start font-semibold">تماس / تلگرام</th>
                  <th className="pb-3 text-start font-semibold">خدمت انتخابی</th>
                  <th className="pb-3 text-start font-semibold">تاریخ ثبت</th>
                  <th className="pb-3 text-start font-semibold">وضعیت</th>
                  <th className="pb-3 text-start font-semibold">ارتباط مستقیم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {winners.map((w, idx) => {
                  const tgUrl = w.telegramOrPhone.startsWith('@')
                    ? `https://t.me/${w.telegramOrPhone.slice(1)}`
                    : `https://t.me/+${w.telegramOrPhone.replace(/\D/g, '')}`;
                  return (
                    <tr key={w.orderId} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 text-zinc-400 font-mono font-bold">{idx + 1}</td>
                      <td className="py-3 font-bold text-white">{w.fullName}</td>
                      <td className="py-3 font-mono text-purple-300">{w.telegramOrPhone}</td>
                      <td className="py-3 text-zinc-200">{w.serviceTitle}</td>
                      <td className="py-3 text-zinc-400 font-mono">
                        {formatPersianDate(w.createdAt)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            w.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : w.status === 'in_progress'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {w.status === 'completed'
                            ? 'تحویل شد'
                            : w.status === 'in_progress'
                            ? 'درحال انجام'
                            : 'سفارش جدید'}
                        </span>
                      </td>
                      <td className="py-3">
                        <a
                          href={tgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-[11px] font-semibold border border-purple-500/30 transition-colors"
                        >
                          <Send className="w-3 h-3 rotate-180" />
                          <span>چت تلگرام</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
