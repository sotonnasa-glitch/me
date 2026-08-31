import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Flame,
  Tag,
  Zap,
  Trophy,
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Star,
  ExternalLink,
  Calendar,
  Layers,
  Palette,
  ArrowLeft,
  Check,
  RotateCcw,
  Sliders,
  Radio,
  Percent,
  X,
  Smartphone,
  ShieldAlert
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { CustomEventCampaign, EventType, EventTheme } from '../../../types';

export const EventsCampaignManager: React.FC = () => {
  const {
    events,
    activeCampaign,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventActive,
    setFeaturedEvent,
    duplicateEvent,
    resetEventsToDefault,
    services,
    orders,
    navigateToSection
  } = useSiteData();

  // Filters & State
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<CustomEventCampaign, 'id' | 'createdAt'>>({
    title: '',
    subtitle: '',
    badgeText: '🎉 رویداد ویژه',
    highlightText: '',
    description: '',
    eventType: 'discount',
    discountOrOffer: '',
    promoCode: '',
    theme: 'purple-gold',
    isActive: true,
    isFeatured: false,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    hasCountdown: true,
    hasCapacityLimit: false,
    maxCapacity: 10,
    usedCapacity: 0,
    ctaButtonText: 'ثبت سفارش با تخفیف',
    ctaActionType: 'order_modal',
    targetServices: [],
    termsNote: '',
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleOpenAddModal = (templateType?: EventType) => {
    setEditingEventId(null);

    const now = Date.now();
    let initial: Omit<CustomEventCampaign, 'id' | 'createdAt'> = {
      title: 'کمپین تخفیف ویژه هوش مصنوعی',
      subtitle: 'فرصت استثنایی برای ثبت پروژه با تخفیف محدود',
      badgeText: '🔥 پیشنهاد ویژه',
      highlightText: 'تخفیف روی تمام خدمات',
      description: 'با استفاده از این رویداد، پروژه‌های خود را با بهترین شرایط و سرعت تحویل در TEKVIX ثبت کنید.',
      eventType: templateType || 'discount',
      discountOrOffer: '۲۵٪ تخفیف',
      promoCode: 'TEKVIX25',
      theme: 'purple-gold',
      isActive: true,
      isFeatured: events.length === 0,
      startDate: new Date(now).toISOString(),
      endDate: new Date(now + 7 * 86400000).toISOString(),
      hasCountdown: true,
      hasCapacityLimit: false,
      maxCapacity: 10,
      usedCapacity: 0,
      ctaButtonText: 'ثبت سفارش با تخفیف',
      ctaActionType: 'order_modal',
      targetServices: [],
      termsNote: '',
    };

    if (templateType === 'giveaway') {
      initial = {
        title: 'جشنواره قرعه‌کشی و سفارشات رایگان',
        subtitle: 'اولین سفارش‌ها کاملاً رایگان بدون پرداخت هیچ هزینه‌ای',
        badgeText: '🎁 سفارش رایگان',
        highlightText: '🔥 ۱۰۰٪ رایگان برای برندگان',
        description: 'سفارش خود را ثبت کنید تا در لیست برندگان سفارش رایگان قرار گیرید.',
        eventType: 'giveaway',
        discountOrOffer: '۱۰۰٪ رایگان',
        promoCode: 'FREEGIFT',
        theme: 'purple-gold',
        isActive: true,
        isFeatured: false,
        startDate: new Date(now).toISOString(),
        endDate: new Date(now + 5 * 86400000).toISOString(),
        hasCountdown: true,
        hasCapacityLimit: true,
        maxCapacity: 3,
        usedCapacity: 0,
        ctaButtonText: 'ثبت سفارش رایگان',
        ctaActionType: 'order_modal',
        targetServices: [],
        termsNote: 'هر کاربر فقط یک‌بار امکان استفاده دارد.',
      };
    } else if (templateType === 'flash_sale') {
      initial = {
        title: 'تخفیف شگفت‌انگیز و محدود ۴۸ ساعته',
        subtitle: 'تخفیف ویژه ۴۰٪ فقط برای مدت محدود',
        badgeText: '⚡ تخفیف شگفت‌انگیز',
        highlightText: 'کد تخفیف: FLASH40',
        description: 'به مدت ۲ روز از ۴۰٪ تخفیف در پیاده‌سازی سرویس‌های انتخابی بهره‌مند شوید.',
        eventType: 'flash_sale',
        discountOrOffer: '۴۰٪ تخفیف',
        promoCode: 'FLASH40',
        theme: 'cyber-cyan',
        isActive: true,
        isFeatured: false,
        startDate: new Date(now).toISOString(),
        endDate: new Date(now + 2 * 86400000).toISOString(),
        hasCountdown: true,
        hasCapacityLimit: true,
        maxCapacity: 15,
        usedCapacity: 0,
        ctaButtonText: 'دریافت فوری تخفیف',
        ctaActionType: 'order_modal',
        targetServices: [],
        termsNote: 'مهلت استفاده تا پایان تایمر معکوس.',
      };
    } else if (templateType === 'launch') {
      initial = {
        title: 'رونمایی از خدمات پیشرفته نسل جدید هوش مصنوعی',
        subtitle: 'پکیج هدیه سناریو و مشاوره فنی رایگان برای خریداران اول',
        badgeText: '🚀 رونمایی جدید',
        highlightText: 'پکیج مشاوره و راه‌اندازی رایگان',
        description: 'امکانات جدید هوش مصنوعی با بالاترین سرعت و دقت اکنون در دسترس شماست.',
        eventType: 'launch',
        discountOrOffer: 'هدیه ویژه راه‌اندازی',
        promoCode: 'LAUNCH2025',
        theme: 'fiery-orange',
        isActive: true,
        isFeatured: false,
        startDate: new Date(now).toISOString(),
        endDate: new Date(now + 10 * 86400000).toISOString(),
        hasCountdown: false,
        hasCapacityLimit: false,
        maxCapacity: 20,
        usedCapacity: 0,
        ctaButtonText: 'مشاهده و سفارش اولیه',
        ctaActionType: 'order_modal',
        targetServices: [],
        termsNote: '',
      };
    }

    setFormData(initial);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: CustomEventCampaign) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title,
      subtitle: event.subtitle,
      badgeText: event.badgeText,
      highlightText: event.highlightText || '',
      description: event.description,
      eventType: event.eventType,
      discountOrOffer: event.discountOrOffer || '',
      promoCode: event.promoCode || '',
      theme: event.theme,
      isActive: event.isActive,
      isFeatured: event.isFeatured,
      startDate: event.startDate,
      endDate: event.endDate,
      hasCountdown: event.hasCountdown,
      hasCapacityLimit: event.hasCapacityLimit,
      maxCapacity: event.maxCapacity || 10,
      usedCapacity: event.usedCapacity || 0,
      ctaButtonText: event.ctaButtonText || 'ثبت سفارش با تخفیف',
      ctaActionType: event.ctaActionType || 'order_modal',
      ctaCustomUrl: event.ctaCustomUrl || '',
      targetServices: event.targetServices || [],
      termsNote: event.termsNote || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('لطفاً عنوان رویداد را وارد کنید.');
      return;
    }

    if (editingEventId) {
      updateEvent(editingEventId, formData);
      setSaveSuccessMsg('رویداد با موفقیت ویرایش و در سایت اعمال شد.');
    } else {
      addEvent(formData);
      setSaveSuccessMsg('رویداد جدید با موفقیت ایجاد و ذخیره شد.');
    }

    setIsModalOpen(false);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleSetQuickDuration = (days: number) => {
    const end = new Date(Date.now() + days * 86400000).toISOString();
    setFormData((prev) => ({ ...prev, endDate: end }));
  };

  const getThemeGradient = (theme: EventTheme) => {
    switch (theme) {
      case 'purple-gold':
        return 'from-purple-950/80 via-zinc-900 to-amber-950/40 border-amber-500/30 text-amber-300';
      case 'cyber-cyan':
        return 'from-cyan-950/80 via-zinc-900 to-purple-950/40 border-cyan-500/30 text-cyan-300';
      case 'emerald-gold':
        return 'from-emerald-950/80 via-zinc-900 to-amber-950/40 border-emerald-500/30 text-emerald-300';
      case 'fiery-orange':
        return 'from-orange-950/80 via-zinc-900 to-red-950/40 border-orange-500/30 text-orange-300';
      case 'rose-pink':
        return 'from-pink-950/80 via-zinc-900 to-rose-950/40 border-pink-500/30 text-pink-300';
      case 'midnight-blue':
        return 'from-blue-950/80 via-zinc-900 to-indigo-950/40 border-blue-500/30 text-blue-300';
      default:
        return 'from-zinc-900 via-zinc-900 to-zinc-900 border-zinc-800 text-purple-300';
    }
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'giveaway':
        return <Gift className="w-4 h-4 text-amber-400" />;
      case 'discount':
        return <Percent className="w-4 h-4 text-purple-400" />;
      case 'flash_sale':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'launch':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'contest':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-pink-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getEventTypeName = (type: EventType) => {
    switch (type) {
      case 'giveaway':
        return 'سفارش رایگان / قرعه‌کشی';
      case 'discount':
        return 'تخفیف درصدی و نقدی';
      case 'flash_sale':
        return 'تخفیف شگفت‌انگیز زمان‌دار';
      case 'launch':
        return 'رونمایی از محصول / خدمت';
      case 'contest':
        return 'چالش و مسابقه';
      case 'announcement':
        return 'اطلاعیه عمومی';
      default:
        return 'رویداد دلخواه';
    }
  };

  const filteredEvents = events.filter((evt) => {
    if (filterType === 'all') return true;
    if (filterType === 'active') return evt.isActive;
    if (filterType === 'featured') return evt.isFeatured;
    return evt.eventType === filterType;
  });

  const activeCount = events.filter((e) => e.isActive).length;

  return (
    <div className="space-y-7 max-w-7xl mx-auto animate-in fade-in duration-300 pb-16 font-sans" dir="rtl">
      
      {/* 1. Header with Title & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-purple-950/30 to-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/30 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  مرکز مدیریت ایونت‌ها، تخفیف‌ها و کمپین‌ها
                </h1>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>قابلیت ایجاد هر رویداد دلخواه</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                ایجاد بی‌نهایت کمپین تخفیف، قرعه‌کشی، سفارش رایگان، کد تخفیف و بنرهای مناسبتی با قابلیت فعال‌سازی آنی روی سایت.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          {/* Quick Add Button */}
          <button
            type="button"
            onClick={() => handleOpenAddModal('discount')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ ایجاد ایونت جدید</span>
          </button>

          {/* Reset Defaults */}
          <button
            type="button"
            onClick={resetEventsToDefault}
            className="px-3 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="بازنشانی نمونه‌های پیش‌فرض"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پیش‌فرض‌ها</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 2. Key Metrics & Featured Banner Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Campaigns */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400 font-semibold block">کل ایونت‌ها و کمپین‌ها</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{events.length}</span>
            <span className="text-xs text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
              ثبت‌شده
            </span>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400 font-semibold block">ایونت‌های فعال در سایت</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{activeCount}</span>
            <span className="text-xs text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>پخش زنده</span>
            </span>
          </div>
        </div>

        {/* Featured Main Event */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400 font-semibold block">رویداد شاخص بنر بالای صفحه</span>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
            <span className="text-xs font-bold text-white truncate" title={activeCampaign?.title || 'بدون بنر شاخص'}>
              {activeCampaign ? activeCampaign.title : 'هیچ رویدادی شاخص نیست'}
            </span>
          </div>
        </div>

        {/* Live Site Preview Link */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-zinc-900 border border-purple-500/30 flex flex-col justify-between">
          <span className="text-xs text-purple-300 font-semibold block">مشاهده در صفحه اصلی سایت:</span>
          <button
            type="button"
            onClick={() => navigateToSection('opening-event-banner')}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>مشاهده بنر در سایت</span>
          </button>
        </div>

      </div>

      {/* 3. Quick Template Launcher (سفارش رایگان، تخفیف، رونمایی و ...) */}
      <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>قالب‌های آماده برای ایجاد فوری ایونت جدید:</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          
          <button
            type="button"
            onClick={() => handleOpenAddModal('giveaway')}
            className="p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-amber-500/30 hover:border-amber-400 text-right space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-amber-400">
              <Gift className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-300">رایگان</span>
            </div>
            <span className="text-xs font-bold text-white block">سفارش رایگان</span>
            <span className="text-[10px] text-zinc-400 block truncate">قرعه‌کشی و هدیه</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal('discount')}
            className="p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-purple-500/30 hover:border-purple-400 text-right space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-purple-400">
              <Percent className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold bg-purple-500/10 px-1.5 py-0.5 rounded text-purple-300">تخفیف</span>
            </div>
            <span className="text-xs font-bold text-white block">تخفیف درصدی</span>
            <span className="text-[10px] text-zinc-400 block truncate">جشنواره و کوپن</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal('flash_sale')}
            className="p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-cyan-500/30 hover:border-cyan-400 text-right space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-cyan-400">
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded text-cyan-300">شگفت‌انگیز</span>
            </div>
            <span className="text-xs font-bold text-white block">تخفیف زمان‌دار</span>
            <span className="text-[10px] text-zinc-400 block truncate">با تایمر معکوس</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal('launch')}
            className="p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-orange-500/30 hover:border-orange-400 text-right space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-orange-400">
              <Flame className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold bg-orange-500/10 px-1.5 py-0.5 rounded text-orange-300">جدید</span>
            </div>
            <span className="text-xs font-bold text-white block">رونمایی محصول</span>
            <span className="text-[10px] text-zinc-400 block truncate">هدیه سناریو و مشاوره</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal('contest')}
            className="p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-emerald-500/30 hover:border-emerald-400 text-right space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-emerald-400">
              <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-300">مسابقه</span>
            </div>
            <span className="text-xs font-bold text-white block">چالش و جایزه</span>
            <span className="text-[10px] text-zinc-400 block truncate">امتیاز و هدایا</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal('custom')}
            className="p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-pink-500/30 hover:border-pink-400 text-right space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-pink-400">
              <Sliders className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold bg-pink-500/10 px-1.5 py-0.5 rounded text-pink-300">سفارشی</span>
            </div>
            <span className="text-xs font-bold text-white block">رویداد دلخواه</span>
            <span className="text-[10px] text-zinc-400 block truncate">تنظیمات کاملاً آزاد</span>
          </button>

        </div>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            همه رویدادها ({events.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'active'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            فعال در سایت ({activeCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('giveaway')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'giveaway'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            سفارش رایگان
          </button>

          <button
            type="button"
            onClick={() => setFilterType('discount')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'discount'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            تخفیف‌ها
          </button>

          <button
            type="button"
            onClick={() => setFilterType('flash_sale')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'flash_sale'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            شگفت‌انگیز
          </button>
        </div>

        <span className="text-xs text-zinc-400">
          نمایش {filteredEvents.length} از {events.length} رویداد
        </span>
      </div>

      {/* 5. Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((evt) => {
          const isFeatured = evt.isFeatured;
          const isActive = evt.isActive;

          return (
            <div
              key={evt.id}
              className={`rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${getThemeGradient(
                evt.theme
              )} border shadow-xl relative flex flex-col justify-between transition-all duration-200 hover:border-purple-500/60 ${
                isFeatured ? 'ring-2 ring-amber-400/50 shadow-amber-500/10' : ''
              }`}
            >
              
              {/* Top Row: Type, Badge & Status Switcher */}
              <div>
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-black/40 border border-white/10">
                      {getEventIcon(evt.eventType)}
                    </span>
                    <div>
                      <span className="text-[11px] text-zinc-400 font-semibold block">
                        {getEventTypeName(evt.eventType)}
                      </span>
                      <span className="text-xs font-black text-white block">
                        {evt.badgeText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Featured Star Badge */}
                    {isFeatured ? (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>بنر شاخص سایت</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setFeaturedEvent(evt.id)}
                        className="px-2 py-1 rounded-xl bg-zinc-900/80 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 text-[11px] font-semibold border border-zinc-800 hover:border-amber-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                        title="انتخاب این رویداد به عنوان بنر اصلی بالای سایت"
                      >
                        <Star className="w-3 h-3" />
                        <span>انتخاب به عنوان بنر اصلی</span>
                      </button>
                    )}

                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleEventActive(evt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                        isActive
                          ? 'bg-emerald-500/25 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                          : 'bg-zinc-800/90 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                      }`}
                      title={isActive ? 'برای غیرفعال کردن کلیک کنید' : 'برای فعال کردن در سایت کلیک کنید'}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          isActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-zinc-600'
                        }`}
                      />
                      <span>{isActive ? 'فعال در سایت' : 'غیرفعال'}</span>
                    </button>
                  </div>
                </div>

                {/* Event Content */}
                <div className="mt-4 space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                    {evt.subtitle}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                    {evt.description}
                  </p>
                </div>

                {/* Highlights, Promo code & Capacity Details */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  
                  {/* Promo Code & Offer */}
                  {evt.promoCode && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">کد تخفیف:</span>
                        <span className="font-mono font-black text-amber-300 text-sm">
                          {evt.promoCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(evt.promoCode!)}
                        className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode === evt.promoCode ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Discount / Value Offer */}
                  {evt.discountOrOffer && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">مقدار هدیه/تخفیف:</span>
                      <span className="font-black text-emerald-300 font-mono">
                        {evt.discountOrOffer}
                      </span>
                    </div>
                  )}

                  {/* Capacity Meter (if limited) */}
                  {evt.hasCapacityLimit && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between sm:col-span-2">
                      <span className="text-[10px] text-zinc-400">ظرفیت اختصاصی:</span>
                      <span className="font-mono font-bold text-white">
                        {evt.usedCapacity || 0} استفاده‌شده از سقف {evt.maxCapacity} عدد
                      </span>
                    </div>
                  )}

                </div>

              </div>

              {/* Bottom Actions Row */}
              <div className="mt-5 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>انقضا: {new Date(evt.endDate).toLocaleDateString('fa-IR')}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Duplicate Button */}
                  <button
                    type="button"
                    onClick={() => duplicateEvent(evt.id)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                    title="تکثیر و کپی کردن این رویداد"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(evt)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 hover:border-purple-500/60 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>ویرایش ایونت</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(evt.id)}
                    className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition-colors cursor-pointer"
                    title="حذف این رویداد"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400">
            <Gift className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">هیچ رویدادی با این فیلتر یافت نشد</h3>
            <p className="text-xs text-zinc-400">
              می‌توانید همین حالا اولین ایونت اختصاصی خود را با دکمه زیر ایجاد کنید.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenAddModal('discount')}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
          >
            + ساخت رویداد جدید
          </button>
        </div>
      )}

      {/* 6. Event Create / Edit Full Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-3xl rounded-3xl shadow-2xl p-6 sm:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto" dir="rtl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  {editingEventId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {editingEventId ? 'ویرایش اطلاعات ایونت' : 'ایجاد ایونت و کمپین جدید'}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    تنظیم عنوان، متن‌ها، تم رنگی، کد تخفیف، زمان‌بندی و شرایط نمایش
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="space-y-6 text-xs sm:text-sm">
              
              {/* Row 1: Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-zinc-300 font-bold block">عنوان اصلی رویداد *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: جشنواره تابستانه هوش مصنوعی تکویکس"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold block">متن نشان / بج</label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="مثال: 🔥 ۵۰٪ تخفیف"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Subtitle & Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold block">زیرعنوان جذاب</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="مثال: تخفیف استثنایی برای پروژه‌های طراحی سایت و ویدیو"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold block">متن هایلایت / شعار</label>
                  <input
                    type="text"
                    value={formData.highlightText}
                    onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                    placeholder="مثال: کد تخفیف ویژه: SUMMER2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold block">توضیحات کامل رویداد</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="توضیح شرایط استفاده، مزایای سفارش در این ایونت و نحوه دریافت هدیه..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                />
              </div>

              {/* Row 4: Event Type & Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold block">نوع دسته‌بندی ایونت</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none cursor-pointer"
                  >
                    <option value="discount">تخفیف درصدی و نقدی</option>
                    <option value="giveaway">سفارش رایگان و قرعه‌کشی</option>
                    <option value="flash_sale">تخفیف شگفت‌انگیز زمان‌دار</option>
                    <option value="launch">رونمایی از محصول / خدمت</option>
                    <option value="contest">چالش و مسابقه</option>
                    <option value="announcement">اطلاعیه عمومی</option>
                    <option value="custom">رویداد سفارشی</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold block">تم رنگی و استایل بصری</label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as EventTheme })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none cursor-pointer"
                  >
                    <option value="purple-gold">بنفش و طلایی کیهانی (Cosmic)</option>
                    <option value="cyber-cyan">سایبرپانک فیروزه‌ای و بنفش (Cyber Neon)</option>
                    <option value="emerald-gold">سبز زمردی و طلایی (Emerald Gold)</option>
                    <option value="fiery-orange">آتشی و نارنجی پرانرژی (Fiery Orange)</option>
                    <option value="rose-pink">صورتی و یاقوتی (Rose Pink)</option>
                    <option value="midnight-blue">آبی تیره نیمه‌شب (Midnight Blue)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Promo Code & Discount Offer Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold block">کد تخفیف اختصاصی (اختیاری)</label>
                  <input
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                    placeholder="مثال: TEKVIX2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold block">مقدار تخفیف یا هدیه</label>
                  <input
                    type="text"
                    value={formData.discountOrOffer}
                    onChange={(e) => setFormData({ ...formData, discountOrOffer: e.target.value })}
                    placeholder="مثال: ۳۰٪ تخفیف یا ۱۰۰٪ رایگان"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 6: Dates & Duration */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-200 font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>زمان‌بندی و انقضای ایونت:</span>
                  </span>

                  {/* Quick Extension Buttons */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleSetQuickDuration(3)}
                      className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                    >
                      +۳ روز
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetQuickDuration(7)}
                      className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                    >
                      +۷ روز
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetQuickDuration(14)}
                      className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                    >
                      +۱۴ روز
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetQuickDuration(30)}
                      className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                    >
                      +۱ ماه
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-400 text-xs block">تاریخ و ساعت پایان (انقضا)</label>
                    <input
                      type="datetime-local"
                      value={formData.endDate.slice(0, 16)}
                      onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value).toISOString() })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <label className="flex items-center gap-2 text-zinc-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasCountdown}
                        onChange={(e) => setFormData({ ...formData, hasCountdown: e.target.checked })}
                        className="w-4 h-4 rounded text-purple-600 accent-purple-600"
                      />
                      <span>نمایش تایمر معکوس (Countdown) روی بنر</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 7: Capacity Limit & CTA Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Capacity Controls */}
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <label className="flex items-center gap-2 text-zinc-300 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasCapacityLimit}
                      onChange={(e) => setFormData({ ...formData, hasCapacityLimit: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 accent-purple-600"
                    />
                    <span>محدودیت سقف تعداد برندگان یا سفارشات</span>
                  </label>

                  {formData.hasCapacityLimit && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[11px] text-zinc-400 block">حداکثر سقف (عدد)</label>
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={formData.maxCapacity}
                          onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block">تعداد استفاده‌شده</label>
                        <input
                          type="number"
                          min={0}
                          value={formData.usedCapacity}
                          onChange={(e) => setFormData({ ...formData, usedCapacity: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button Text */}
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <label className="text-zinc-300 font-bold block">متن دکمه ثبت اکشن (CTA Button)</label>
                  <input
                    type="text"
                    value={formData.ctaButtonText}
                    onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                    placeholder="مثال: ثبت سفارش با تخفیف"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none"
                  />
                  <span className="text-[10px] text-zinc-400 block">
                    این دکمه کاربر را مستقیماً به فرم ثبت سفارش اختصاصی این رویداد هدایت می‌کند.
                  </span>
                </div>

              </div>

              {/* Row 8: Status Flags */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label className="flex items-center gap-2.5 text-zinc-200 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>فعال و در دسترس بودن این رویداد در سایت</span>
                </label>

                <label className="flex items-center gap-2.5 text-amber-300 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                  />
                  <span>نمایش به عنوان بنر شاخص بالای صفحه اصلی</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  {editingEventId ? 'ذخیره تغییرات ایونت' : 'ثبت و انتشار رویداد'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 7. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl" dir="rtl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">آیا از حذف این رویداد اطمینان دارید؟</h3>
              <p className="text-xs text-zinc-400 mt-1">
                این عملیات رویداد را از پنل و سایت حذف خواهد کرد.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteEvent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                بله، حذف کن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
