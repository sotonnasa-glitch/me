import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Inbox,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Send,
  Sparkles,
  ArrowLeft,
  ArrowUpRight,
  Search,
  Filter,
  GripVertical,
  CheckSquare,
  Square,
  Edit2,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  Smartphone,
  Monitor,
  X,
  Check,
  Columns3,
  Newspaper,
  Layout,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useSiteData } from '../../../context/SiteDataContext';
import { AdminTab } from '../AdminSidebar';
import { SiteSectionConfig } from '../../../types';

interface DashboardViewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddService: () => void;
  onOpenCustomizer?: () => void;
}

// Analytics chart dataset
const CHART_DATA_7_DAYS = [
  { name: 'شنبه', mobile: 180, desktop: 140 },
  { name: 'یکشنبه', mobile: 230, desktop: 190 },
  { name: 'دوشنبه', mobile: 160, desktop: 130 },
  { name: 'سه‌شنبه', mobile: 290, desktop: 220 },
  { name: 'چهارشنبه', mobile: 200, desktop: 194 },
  { name: 'پنج‌شنبه', mobile: 120, desktop: 95 },
  { name: 'جمعه', mobile: 260, desktop: 210 },
];

const CHART_DATA_30_DAYS = [
  { name: 'هفته ۱', mobile: 820, desktop: 640 },
  { name: 'هفته ۲', mobile: 950, desktop: 780 },
  { name: 'هفته ۳', mobile: 1100, desktop: 920 },
  { name: 'هفته ۴', mobile: 1340, desktop: 1050 },
];

const CHART_DATA_3_MONTHS = [
  { name: 'اردیبهشت', mobile: 3200, desktop: 2600 },
  { name: 'خرداد', mobile: 4100, desktop: 3400 },
  { name: 'تیر', mobile: 5300, desktop: 4200 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenAddService,
}) => {
  const {
    services,
    orders,
    sectionsConfig,
    toggleSection,
    updateSectionConfig,
    advanceOrderStatus,
    newOrdersCount,
    inProgressOrdersCount,
    completedOrdersCount,
    blogPosts
  } = useSiteData();

  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '3months'>('7days');
  const [selectedSectionKeys, setSelectedSectionKeys] = useState<string[]>([]);
  const [sectionSearch, setSectionSearch] = useState('');
  const [editingSection, setEditingSection] = useState<SiteSectionConfig | null>(null);

  const pendingOrNewOrders = orders.filter(
    (o) => o.status === 'new' || (o.status as any) === 'pending' || (o.status as any) === 'contacted'
  );
  const activeServices = services.filter((s) => s.active !== false);

  const getChartData = () => {
    switch (timeRange) {
      case '30days':
        return CHART_DATA_30_DAYS;
      case '3months':
        return CHART_DATA_3_MONTHS;
      default:
        return CHART_DATA_7_DAYS;
    }
  };

  const handleToggleSelectSection = (keyOrId: string) => {
    setSelectedSectionKeys((prev) =>
      prev.includes(keyOrId) ? prev.filter((k) => k !== keyOrId) : [...prev, keyOrId]
    );
  };

  const handleSelectAllSections = () => {
    if (selectedSectionKeys.length === sectionsConfig.length) {
      setSelectedSectionKeys([]);
    } else {
      setSelectedSectionKeys(sectionsConfig.map((s) => s.key || s.id));
    }
  };

  const handleSaveSectionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    const targetKey = editingSection.key || editingSection.id;
    updateSectionConfig(targetKey, {
      titleFa: editingSection.titleFa || editingSection.nameFa || editingSection.customTitle,
      nameFa: editingSection.nameFa || editingSection.titleFa || editingSection.customTitle,
      customTitle: editingSection.customTitle || editingSection.titleFa || editingSection.nameFa,
      subtitleFa: editingSection.subtitleFa || editingSection.description || editingSection.customSubtitle,
      description: editingSection.description || editingSection.subtitleFa || editingSection.customSubtitle,
      customSubtitle: editingSection.customSubtitle || editingSection.subtitleFa || editingSection.description,
      badgeText: editingSection.badgeText || '',
      enabled: editingSection.enabled,
    });
    setEditingSection(null);
  };

  const filteredSections = sectionsConfig.filter((s) => {
    const q = (sectionSearch || '').toLowerCase().trim();
    if (!q) return true;
    const titleFa = (s.titleFa || s.nameFa || s.customTitle || '').toLowerCase();
    const titleEn = (s.titleEn || s.nameEn || s.id || s.key || '').toLowerCase();
    const cat = (s.category || s.description || s.subtitleFa || s.customSubtitle || '').toLowerCase();
    return titleFa.includes(q) || titleEn.includes(q) || cat.includes(q);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            داشبورد مدیریت و کنترل سایت
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            کنترل بلادرنگ بخش‌های سایت، مدیریت سفارشات ۳ مرحله‌ای، خدمات و محتوای بلاگ.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Inbox className="w-4 h-4 text-amber-400" />
            <span>سفارشات جدید ({newOrdersCount})</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddService}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن خدمت جدید</span>
          </button>
        </div>
      </div>

      {/* 4 REFACTORED KPI METRIC CARDS (No Toman/Monthly Income Card - 3-Step Workflow & Content Focused) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: New Orders (گام ۱) */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-[#09090b] border border-amber-900/40 hover:border-amber-500/50 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">۱. سفارشات جدید (ورودی)</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              {newOrdersCount > 0 ? `${newOrdersCount} مورد جدید` : 'بروز'}
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mb-2">
              {newOrdersCount} <span className="text-xs font-normal text-zinc-400 font-sans">درخواست</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>نیازمند هماهنگی اولیه و تایید</span>
            </div>
            <span className="text-[11px] text-zinc-500 block mt-1">
              کلیک برای مشاهده و انتقال به ساخت
            </span>
          </div>
        </div>

        {/* Card 2: In Progress Orders (گام ۲) */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-[#09090b] border border-purple-900/40 hover:border-purple-500/50 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">۲. درحال ساخت و در انتظار</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              در حال تولید
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mb-2">
              {inProgressOrdersCount} <span className="text-xs font-normal text-zinc-400 font-sans">پروژه فعال</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>طراحی و پیاده‌سازی هوش مصنوعی</span>
            </div>
            <span className="text-[11px] text-zinc-500 block mt-1">
              آماده تحویل نهایی و دریافت بازخورد
            </span>
          </div>
        </div>

        {/* Card 3: Completed Orders (گام ۳) */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-[#09090b] border border-emerald-900/40 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">۳. سفارشات تکمیل شده</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              موفق
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mb-2">
              {completedOrdersCount} <span className="text-xs font-normal text-zinc-400 font-sans">تحویل‌شده</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>پروژه‌های پایان یافته با رضایت</span>
            </div>
            <span className="text-[11px] text-zinc-500 block mt-1">
              ثبت‌شده در سوابق کاری
            </span>
          </div>
        </div>

        {/* Card 4: Active Services & Blog Posts */}
        <div
          onClick={() => onNavigateTab('services')}
          className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">محتوا و پکیج‌های فعال</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              زنده در سایت
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mb-2">
              {activeServices.length} <span className="text-xs font-normal text-zinc-400 font-sans">خدمت</span> + {blogPosts.length} <span className="text-xs font-normal text-zinc-400 font-sans">مقاله</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>پوشش کامل خدمات هوشمند و وبلاگ</span>
            </div>
            <span className="text-[11px] text-zinc-500 block mt-1">
              قابل ویرایش و سفارش مستقیم در لندینگ
            </span>
          </div>
        </div>

      </div>

      {/* QUICK WORKFLOW PIPELINE BAR (1-Click Advance on Dashboard) */}
      {pendingOrNewOrders.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-zinc-950 border border-amber-500/30 p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>{pendingOrNewOrders.length} سفارش جدید در گام اول منتظر بررسی هستند!</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                آخرین سفارش: <span className="text-amber-300 font-medium">{pendingOrNewOrders[0]?.fullName}</span> ({pendingOrNewOrders[0]?.serviceTitle})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => advanceOrderStatus(pendingOrNewOrders[0].id)}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5"
            >
              <span>انتقال به مرحله ساخت</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors"
            >
              مشاهده همه
            </button>
          </div>
        </div>
      )}

      {/* Interactive Real-Time Chart */}
      <div className="rounded-2xl bg-[#09090b] border border-zinc-800 p-5 sm:p-6 shadow-md">
        
        {/* Chart Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>ترافیک بازدیدکنندگان و درخواست‌ها</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              آمار زنده ترافیک سایت بر اساس دستگاه‌های موبایل و دسکتاپ
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-medium text-white focus:outline-none focus:border-purple-500 cursor-pointer pe-8"
              >
                <option value="7days">۷ روز گذشته</option>
                <option value="30days">۳۰ روز گذشته</option>
                <option value="3months">۳ ماه گذشته</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('analytics')}
              className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-colors flex items-center gap-1.5"
            >
              <span>گزارشات کامل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs shadow-2xl space-y-1.5 font-sans" dir="rtl">
                        <span className="font-bold text-white block pb-1 border-b border-zinc-800">{label}</span>
                        <div className="flex items-center justify-between gap-4 text-purple-300">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            موبایل:
                          </span>
                          <span className="font-bold font-mono">{payload[0]?.value}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-cyan-300">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                            دسکتاپ:
                          </span>
                          <span className="font-bold font-mono">{payload[1]?.value}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="mobile"
                stroke="#a855f7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMobile)"
              />
              <Area
                type="monotone"
                dataKey="desktop"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDesktop)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-3 border-t border-zinc-800/80 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            <span>موبایل (Mobile Traffic)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500" />
            <span>دسکتاپ (Desktop Traffic)</span>
          </div>
        </div>

      </div>

      {/* DYNAMIC SITE SECTIONS & MODULES MANAGER (Connected to SiteDataContext) */}
      <div className="rounded-2xl bg-[#09090b] border border-zinc-800 p-5 sm:p-6 shadow-md space-y-4">
        
        {/* Action Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-purple-400" />
              <span>مدیریت ساختار و بخش‌های فعال وب‌سایت</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              فعال‌سازی، غیرفعال‌سازی و ویرایش عنوان هر بخش از صفحه اصلی سایت بصورت آنی.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={sectionSearch}
              onChange={(e) => setSectionSearch(e.target.value)}
              placeholder="جستجو در بخش‌ها..."
              className="w-full ps-9 pe-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Selection Count Status Bar */}
        <div className="flex items-center justify-between text-xs px-2 text-zinc-400">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllSections}
              className="hover:text-white font-medium flex items-center gap-1.5"
            >
              {selectedSectionKeys.length === sectionsConfig.length ? (
                <CheckSquare className="w-4 h-4 text-purple-400" />
              ) : (
                <Square className="w-4 h-4 text-zinc-500" />
              )}
              <span>
                {selectedSectionKeys.length} از {sectionsConfig.length} انتخاب شده
              </span>
            </button>
          </div>

          <span className="text-[11px] text-zinc-500">
            برای فعال/غیرفعال‌سازی سوییچ سمت چپ را تغییر دهید
          </span>
        </div>

        {/* Sections List Rows */}
        <div className="rounded-xl border border-zinc-800 divide-y divide-zinc-800/60 overflow-hidden bg-zinc-950/40">
          {filteredSections.map((sec) => {
            const secKey = sec.key || sec.id;
            const isSelected = selectedSectionKeys.includes(secKey);
            const titleFa = sec.titleFa || sec.nameFa || sec.customTitle || sec.id;
            const titleEn = sec.titleEn || sec.nameEn || sec.id;
            const category = sec.category || 'عمومی';
            const subtitleFa = sec.subtitleFa || sec.description || sec.customSubtitle || '';

            return (
              <div
                key={secKey}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  isSelected ? 'bg-zinc-900/60' : 'hover:bg-zinc-900/30'
                }`}
              >
                {/* Left: Checkbox, Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleSelectSection(secKey)}
                    className="text-zinc-400 hover:text-white shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-600" />
                    )}
                  </button>

                  <GripVertical className="w-4 h-4 text-zinc-600 shrink-0 cursor-grab" />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {titleFa}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                        ({titleEn})
                      </span>
                      {sec.badgeText && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 font-semibold">
                          {sec.badgeText}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5 truncate">
                      دسته‌بندی: <span className="text-zinc-300">{category}</span> • توضیح: <span className="text-zinc-300">{subtitleFa}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Status Badges, Edit Button, Toggle Switch */}
                <div className="flex items-center gap-2 shrink-0">
                  
                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
                      sec.enabled
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {sec.enabled ? 'نمایش در سایت' : 'مخفی'}
                  </span>

                  {/* Edit Action Button */}
                  <button
                    type="button"
                    onClick={() => setEditingSection(sec)}
                    className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                    title="ویرایش عنوان و متن"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Enable/Disable Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSection && toggleSection(secKey)}
                    className={`w-8 h-4.5 rounded-full transition-colors relative p-0.5 ${
                      sec.enabled ? 'bg-purple-600' : 'bg-zinc-700'
                    }`}
                    title={sec.enabled ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                  >
                    <span
                      className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                        sec.enabled ? 'translate-x-0' : '-translate-x-3.5'
                      }`}
                    />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#09090b] border border-zinc-800 p-6 space-y-4 shadow-2xl relative text-xs">
            
            {/* Modal Header */}
            <div className="text-center pb-2 border-b border-zinc-800">
              <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />
              <h3 className="text-base font-bold text-white">ویرایش عنوان و تنظیمات بخش</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                تغییرات بلافاصله در ساختار صفحه اصلی منعکس می‌شود.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSectionEdit} className="space-y-3.5">
              
              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  عنوان فارسی بخش
                </label>
                <input
                  type="text"
                  required
                  value={editingSection.titleFa || editingSection.nameFa || editingSection.customTitle || ''}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      titleFa: e.target.value,
                      nameFa: e.target.value,
                      customTitle: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  توضیح کوتاه / زیرعنوان
                </label>
                <textarea
                  rows={2}
                  value={editingSection.subtitleFa || editingSection.description || editingSection.customSubtitle || ''}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      subtitleFa: e.target.value,
                      description: e.target.value,
                      customSubtitle: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-purple-500 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  متن نشان / بج (Badge)
                </label>
                <input
                  type="text"
                  value={editingSection.badgeText || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, badgeText: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Enabled checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="section-enabled"
                  checked={editingSection.enabled ?? true}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, enabled: e.target.checked })
                  }
                  className="rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="section-enabled" className="text-xs text-zinc-300 cursor-pointer font-medium">
                  نمایش این بخش در صفحه اصلی سایت
                </label>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  ذخیره و همگام‌سازی با سایت
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all border border-zinc-800"
                >
                  انصراف
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
