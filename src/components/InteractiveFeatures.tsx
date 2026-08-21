import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  Send,
  CheckCircle2,
  Globe,
  Clapperboard,
  Bot,
  Palette,
  Music,
  FileText,
  ArrowLeft,
  Flame,
  BadgeCheck,
  Headphones,
  Code,
  Gift
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { NeuralSubmitButton } from './common/NeuralSubmitButton';

interface InteractiveFeaturesProps {
  onOpenOrderModal?: (serviceId?: string) => void;
}

interface ServiceOption {
  id: string;
  name: string;
  shortDesc: string;
  icon: React.ElementType;
  basePrice: number; // in Tomans
  tiers: {
    standard: {
      name: string;
      priceMultiplier: number;
      deliveryDays: string;
      features: string[];
    };
    pro: {
      name: string;
      priceMultiplier: number;
      deliveryDays: string;
      features: string[];
    };
    enterprise: {
      name: string;
      priceMultiplier: number;
      deliveryDays: string;
      features: string[];
    };
  };
}

const ESTIMATOR_SERVICES: ServiceOption[] = [
  {
    id: 'ai-website',
    name: 'طراحی وب‌سایت و لندینگ',
    shortDesc: 'وب‌سایت اختصاصی، مدرن و ریسپانسیو با سرعت فوق‌العاده',
    icon: Globe,
    basePrice: 1600000,
    tiers: {
      standard: {
        name: 'پایه (لندینگ پیج تک‌صفحه‌ای)',
        priceMultiplier: 1,
        deliveryDays: '۲۴ الی ۴۸ ساعت',
        features: [
          'طراحی ریسپانسیو موبایل و دسکتاپ',
          'فرم ثبت سفارش و مشاوره آنلاین',
          'سئو مقدماتی و متاتگ‌های گوگل',
          'یک ماه پشتیبانی فنی رایگان'
        ]
      },
      pro: {
        name: 'حرفه‌ای (سایت چندصفحه‌ای + پنل)',
        priceMultiplier: 1.8,
        deliveryDays: '۲ الی ۳ روز کاری',
        features: [
          'طراحی مدرن با افکت‌های تعاملی',
          'پنل مدیریت محتوا و سفارش‌ها',
          'اتصال اعلان‌های آنی به تلگرام',
          'بهینه‌سازی سرعت و لودینگ زیر ۱ ثانیه',
          '۳ ماه پشتیبانی و ارتقا رایگان'
        ]
      },
      enterprise: {
        name: 'سازمانی / VIP (فروشگاهی و اختصاصی)',
        priceMultiplier: 3.2,
        deliveryDays: '۳ الی ۵ روز کاری',
        features: [
          'معماری فول‌استک با دیتابیس اختصاصی',
          'درگاه پرداخت و سیستم کاربران',
          'سئو تکنیکال و رتبه برتر گوگل',
          'مشاوره اختصاصی برندینگ و کپی‌رایتینگ',
          '۶ ماه پشتیبانی اختصاصی VIP'
        ]
      }
    }
  },
  {
    id: 'ai-video',
    name: 'ساخت تیزر و ویدیو هوش مصنوعی',
    shortDesc: 'تیزرهای تبلیغاتی سینمایی 4K با سناریوی فروش و ترند',
    icon: Clapperboard,
    basePrice: 900000,
    tiers: {
      standard: {
        name: 'پایه (تیزر کوتاه ۳۰ ثانیه‌ای)',
        priceMultiplier: 1,
        deliveryDays: '۲۴ ساعت',
        features: [
          'کیفیت Full HD و انیمیشن پویا',
          'موزیک و افکت‌های صوتی ترند',
          'کاور ویدیویی اختصاصی',
          'یک نوبت ادیت و ویرایش رایگان'
        ]
      },
      pro: {
        name: 'حرفه‌ای (تیزر ۶۰ ثانیه‌ای 4K + سناریو)',
        priceMultiplier: 1.8,
        deliveryDays: '۲۴ الی ۴۸ ساعت',
        features: [
          'کیفیت سینمایی 4K با ۶۰ فریم',
          'سناریونویسی اختصاصی برای جذب مشتری',
          'نریشن و دوبله فارسی با هوش مصنوعی',
          'سایزبندی اختصاصی برای ریلز و یوتیوب',
          'دو نوبت ادیت و بازبینی رایگان'
        ]
      },
      enterprise: {
        name: 'سازمانی / VIP (پکیج کمپین ۳ ویدیویی)',
        priceMultiplier: 3.4,
        deliveryDays: '۲ الی ۳ روز',
        features: [
          '۳ ویدیوی کامل تبلیغاتی و محصول',
          'کاراکتر اختصاصی و برندبوک بصری',
          'جلوه‌های ویژه و تدوین حرفه‌ای',
          'سناریوی فروش تضمینی برای پیج و سایت'
        ]
      }
    }
  },
  {
    id: 'telegram-bot',
    name: 'ربات تلگرام هوشمند',
    shortDesc: 'ربات‌های خودکار فروش، پشتیبانی و تعامل با هوش مصنوعی',
    icon: Bot,
    basePrice: 1100000,
    tiers: {
      standard: {
        name: 'پایه (ربات منودار و پاسخگو)',
        priceMultiplier: 1,
        deliveryDays: '۲۴ الی ۴۸ ساعت',
        features: [
          'منوهای شیشه‌ای و دکمه‌های توکار',
          'سیستم پاسخگویی خودکار به مشتریان',
          'اتصال به کانال و گروه‌های تلگرام',
          'میزبانی روی سرورهای پایدار'
        ]
      },
      pro: {
        name: 'حرفه‌ای (ثبت سفارش + پنل مدیریت)',
        priceMultiplier: 1.7,
        deliveryDays: '۲ روز کاری',
        features: [
          'سیستم ثبت و رهگیری سفارش کاربران',
          'پنل مدیریت تحت وب یا در خود تلگرام',
          'ارسال پیام همگانی به اعضا',
          'اتصال به درگاه پرداخت ریالی'
        ]
      },
      enterprise: {
        name: 'سازمانی (ربات چت‌بات متصل به AI)',
        priceMultiplier: 3.0,
        deliveryDays: '۳ الی ۴ روز',
        features: [
          'پاسخگویی هوشمند با ChatGPT / Gemini',
          'اتصال به دیتابیس اختصاصی کسب‌وکار',
          'سیستم احراز هویت پیامکی کاربران',
          'پشتیبانی VIP و مانیتورینگ ۲۴/۷'
        ]
      }
    }
  },
  {
    id: 'image-creation',
    name: 'طراحی تصویر و گرافیک AI',
    shortDesc: 'طراحی لوگو، بنرهای تبلیغاتی، پوستر و تصاویر واقع‌گرایانه',
    icon: Palette,
    basePrice: 500000,
    tiers: {
      standard: {
        name: 'پایه (پکیج ۳ تصویر باکیفیت)',
        priceMultiplier: 1,
        deliveryDays: '۲۴ ساعت',
        features: [
          'کیفیت فوق‌العاده Ultra HD',
          'اصلاح رنگ و ترکیب اختصاصی',
          'مناسب پست و بنر اینستاگرام',
          'تحویل با فرمت‌های PNG و JPG'
        ]
      },
      pro: {
        name: 'حرفه‌ای (پکیج ۸ تصویر + لوگو برند)',
        priceMultiplier: 1.8,
        deliveryDays: '۲۴ ساعت',
        features: [
          'طراحی لوگو یا کاراکتر برند با AI',
          '۸ تصویر تبلیغاتی و محصولی',
          'فایل‌های لایه‌باز و بدون پس‌زمینه',
          'سایزبندی برای وب‌سایت و بنر محیطی'
        ]
      },
      enterprise: {
        name: 'سازمانی (پکیج جامع هویت بصری)',
        priceMultiplier: 3.5,
        deliveryDays: '۲ روز',
        features: [
          '۲۰ تصویر اختصاصی از محصولات',
          'هویت بصری کامل و پالت رنگی اختصاصی',
          'کیفیت مناسب چاپ در ابعاد بزرگ',
          'حق مالکیت تجاری ۱۰۰٪ تضمین‌شده'
        ]
      }
    }
  },
  {
    id: 'ai-music',
    name: 'موزیک و صداگذاری اختصاصی',
    shortDesc: 'ساخت آهنگ اختصاصی، نریشن دوبله فارسی و هویت صوتی',
    icon: Music,
    basePrice: 550000,
    tiers: {
      standard: {
        name: 'پایه (۲ ترک موسیقی اختصاصی)',
        priceMultiplier: 1,
        deliveryDays: '۲۴ ساعت',
        features: [
          'موسیقی متن بدون حق کپی‌رایت',
          'سبک و تمپوی دلخواه کارفرما',
          'کیفیت استودیویی 320kbps',
          'مناسب تیزر و پادکست'
        ]
      },
      pro: {
        name: 'حرفه‌ای (آهنگ کامل با خواننده و ترانه)',
        priceMultiplier: 1.8,
        deliveryDays: '۲۴ الی ۴۸ ساعت',
        features: [
          'ترانه‌سرایی اختصاصی با نام برند شما',
          'وکال و صدای خواننده فارسی یا انگلیسی',
          'میکس و مسترینگ هوشمند استودیویی',
          'نریشن دوبله اختصاصی برای تیزرها'
        ]
      },
      enterprise: {
        name: 'سازمانی (پکیج هویت صوتی کامل)',
        priceMultiplier: 3.2,
        deliveryDays: '۲ روز',
        features: [
          'آلبوم ۵ ترکی اختصاصی برند',
          'لوگوی صوتی (Audio Logo) کوتاه',
          'نسخه بی‌کلام و باکلام جداگانه',
          'مالکیت صددرصدی و حقوق معنوی کامل'
        ]
      }
    }
  },
  {
    id: 'text-content',
    name: 'تولید محتوا و سناریونویسی',
    shortDesc: 'مقالات سئو، سناریوی ویدیویی و متن‌های متقاعدکننده فروش',
    icon: FileText,
    basePrice: 400000,
    tiers: {
      standard: {
        name: 'پایه (۳ مقاله یا ۶ سناریوی ریلز)',
        priceMultiplier: 1,
        deliveryDays: '۲۴ ساعت',
        features: [
          'رعایت کامل اصول سئوی گوگل',
          'سناریوهای قلاب‌دار برای ویدیوها',
          'لحن متناسب با پرسونای مخاطب',
          'بررسی کامل عدم کپی بودن متن'
        ]
      },
      pro: {
        name: 'حرفه‌ای (تقویم محتوایی ۱ ماهه + ۱۰ مقاله)',
        priceMultiplier: 1.9,
        deliveryDays: '۲ روز کاری',
        features: [
          '۱۰ مقاله جامع سئو شده بیش از ۱۵۰۰ کلمه',
          'تقویم ۳۰ روزه ایده و سناریوی پست',
          'کپی‌رایتینگ متون صفحه اصلی و فروش',
          'تحقیق کلمات کلیدی پرسرچ حوزه کاری'
        ]
      },
      enterprise: {
        name: 'سازمانی (کمپین جامع محتوایی برند)',
        priceMultiplier: 3.5,
        deliveryDays: '۳ روز',
        features: [
          'بازنویسی کامل تمام متون سایت و اپ',
          'کتابچه الکترونیکی یا لید مگنت اختصاصی',
          'استراتژی جامع قیف فروش و جذب لید',
          'پشتیبانی و مشاوره محتوایی مستمر'
        ]
      }
    }
  }
];

export const InteractiveFeatures: React.FC<InteractiveFeaturesProps> = ({ onOpenOrderModal }) => {
  const { brandInfo, openingEventState } = useSiteData();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('ai-website');
  const [selectedTier, setSelectedTier] = useState<'standard' | 'pro' | 'enterprise'>('pro');
  const [isExpress, setIsExpress] = useState<boolean>(false);

  const currentService =
    ESTIMATOR_SERVICES.find((s) => s.id === selectedServiceId) || ESTIMATOR_SERVICES[0];

  const currentTierData = currentService.tiers[selectedTier];

  // Price Calculation
  const rawPrice = Math.round(currentService.basePrice * currentTierData.priceMultiplier);
  const expressPrice = isExpress ? Math.round(rawPrice * 0.15) : 0;
  const totalPrice = rawPrice + expressPrice;

  const deliveryText = isExpress
    ? 'فوری (تحویل تضمینی در کمتر از ۲۴ ساعت ⚡)'
    : currentTierData.deliveryDays;

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const handleOrderClick = () => {
    if (onOpenOrderModal) {
      onOpenOrderModal(selectedServiceId);
    }
  };

  return (
    <section
      id="features"
      className="relative py-20 sm:py-28 bg-[#05050d] overflow-hidden border-t border-purple-900/20"
    >
      {/* Background glow accents */}
      <div className="absolute top-1/3 start-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 end-10 w-80 h-80 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs font-semibold mb-4 shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-purple-400" />
            <span>محاسبه‌گر آنلاین هزینه و زمان تحویل</span>
          </div>

          <h2
            id="estimator-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            تخمین هوشمند قیمت و زمان اجرای پروژه
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            نوع خدمت و سطح امکانات مدنظرتان را انتخاب کنید تا هزینه و زمان‌بندی دقیق تحویل را در لحظه مشاهده کنید.
          </p>
        </div>

        {/* Main Estimator Box */}
        <div className="bg-[#0a0818]/90 border border-purple-500/25 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(147,51,234,0.15)] backdrop-blur-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Step 1 & 2 Controls (Right on RTL, Left on LTR) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Step 1: Select Service */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono flex items-center justify-center">
                      ۱
                    </span>
                    <span>انتخاب نوع خدمت:</span>
                  </label>
                  <span className="text-xs text-purple-400 font-medium">
                    {currentService.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ESTIMATOR_SERVICES.map((srv) => {
                    const isSelected = srv.id === selectedServiceId;
                    const IconComp = srv.icon;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        id={`estimator-srv-${srv.id}`}
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-3.5 rounded-2xl border text-start flex flex-col items-start gap-2.5 transition-all duration-200 cursor-pointer focus:outline-none ${
                          isSelected
                            ? 'bg-purple-950/70 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02]'
                            : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/50'
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <span
                            className={`text-xs font-bold block line-clamp-1 ${
                              isSelected ? 'text-white' : 'text-gray-300'
                            }`}
                          >
                            {srv.name}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            از {formatPrice(srv.basePrice)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Tier Level */}
              <div>
                <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono flex items-center justify-center">
                    ۲
                  </span>
                  <span>انتخاب سطح و امکانات پروژه:</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Standard Tier */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier('standard')}
                    className={`p-4 rounded-2xl border text-start flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      selectedTier === 'standard'
                        ? 'bg-purple-950/60 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-200">پایه / اقتصادی</span>
                        {selectedTier === 'standard' && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-1">
                        مناسب شروع سریع و پروژه‌های جمع‌وجور
                      </span>
                    </div>
                    <span className="text-xs font-bold text-purple-300 mt-2">
                      {formatPrice(currentService.basePrice)}
                    </span>
                  </button>

                  {/* Pro Tier (Popular) */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier('pro')}
                    className={`p-4 rounded-2xl border text-start flex flex-col justify-between gap-2 transition-all cursor-pointer relative overflow-hidden ${
                      selectedTier === 'pro'
                        ? 'bg-gradient-to-b from-purple-950/90 to-[#12082b] border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.35)] ring-1 ring-purple-400'
                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="absolute top-0 end-0 bg-gradient-to-l from-purple-500 to-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-es-lg">
                      محبوب‌ترین ⭐
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">حرفه‌ای و ویژه</span>
                        {selectedTier === 'pro' && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-purple-200/70 block mt-1">
                        امکانات کامل، انیمیشن و خروجی باکیفیت
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 mt-2">
                      {formatPrice(Math.round(currentService.basePrice * currentService.tiers.pro.priceMultiplier))}
                    </span>
                  </button>

                  {/* Enterprise Tier */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier('enterprise')}
                    className={`p-4 rounded-2xl border text-start flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      selectedTier === 'enterprise'
                        ? 'bg-purple-950/60 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-200">سازمانی / VIP</span>
                        {selectedTier === 'enterprise' && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-1">
                        بالاترین سطح اختصاصی‌سازی و پشتیبانی
                      </span>
                    </div>
                    <span className="text-xs font-bold text-purple-300 mt-2">
                      {formatPrice(Math.round(currentService.basePrice * currentService.tiers.enterprise.priceMultiplier))}
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 3: Fast Track / Delivery Speed Toggle */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      تحویل اکسپرس و فوق‌سریع (زیر ۲۴ ساعت)
                    </span>
                    <span className="text-[11px] text-gray-400">
                      پروژه در اولویت فوری و بدون نوبت قرار می‌گیرد
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExpress(!isExpress)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                    isExpress ? 'bg-purple-600' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      isExpress ? 'start-7' : 'start-1'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Live Result Summary Card (Left on RTL, Right on LTR) */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-[#130d2e] via-[#0e0922] to-[#070512] border border-purple-500/40 p-6 shadow-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
              
              {/* Decorative Corner Glow */}
              <div className="absolute -top-10 -end-10 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

              <div>
                {/* Result Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div>
                    <span className="text-[11px] text-purple-300 font-semibold block uppercase">
                      برآورد نهایی پروژه
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {currentService.name}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {currentTierData.name.split(' ')[0]}
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-xl bg-black/40 border border-purple-500/20 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>برآورد هزینه تمام‌شده:</span>
                    {openingEventState.freeOrdersRemaining > 0 && (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        <span>شامل کمپین افتتاحیه</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-sans text-white">
                      {totalPrice.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-xs text-purple-300 font-medium">تومان</span>
                  </div>
                </div>

                {/* Delivery Time Badge */}
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/[0.04] p-3 rounded-xl border border-white/5 mb-5">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>زمان تحویل:</span>
                  <span className="font-bold text-emerald-400">{deliveryText}</span>
                </div>

                {/* Features Included List */}
                <div className="space-y-2.5 mb-2">
                  <span className="text-xs font-bold text-gray-300 block">
                    امکانات و خروجی‌های شامل پکیج:
                  </span>
                  {currentTierData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-white/10">
                <NeuralSubmitButton
                  id="estimator-order-btn"
                  label="Submit Request — ثبت سفارش"
                  successLabel="Submitted — درخواست ثبت شد ✓"
                  onSubmitSuccess={handleOrderClick}
                  className="w-full"
                />

                <a
                  href={brandInfo.telegramUrl || 'https://t.me/Lawat_kar'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <Send className="w-3.5 h-3.5 text-purple-400 rotate-180" />
                  <span>استعلام و مشاوره اختصاصی در تلگرام (@{brandInfo.telegramHandle})</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* 4 Golden Guarantees & Why Us Highlights (Fresh & High Value) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-6 rounded-2xl bg-[#090717]/80 border border-purple-500/15 hover:border-purple-500/40 transition-all flex flex-col gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-base font-bold text-white">تحویل سریع در ۲۴ الی ۴۸ ساعت</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              با تکیه بر ابزارهای هوش مصنوعی و تیم فنی متمرکز، پروژه‌ها بدون فوت وقت و با سرعت فوق‌العاده تحویل داده می‌شوند.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090717]/80 border border-purple-500/15 hover:border-purple-500/40 transition-all flex flex-col gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-base font-bold text-white">گارانتی بازگشت ۱۰۰٪ وجه</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              در صورت عدم رضایت یا عدم تطابق خروجی با نیازهای ثبت‌شده، کل مبلغ سفارش بدون قید و شرط عودت داده می‌شود.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090717]/80 border border-purple-500/15 hover:border-purple-500/40 transition-all flex flex-col gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-900/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
              <Code className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-base font-bold text-white">سورس کامل و مالکیت ۱۰۰٪</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              تمامی کدهای وب‌سایت، دارایی‌های بصری، ویدیوها و فایل‌های صوتی به طور کامل و با مالکیت دائمی به شما تحویل می‌گردد.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090717]/80 border border-purple-500/15 hover:border-purple-500/40 transition-all flex flex-col gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-violet-900/30 border border-violet-500/30 flex items-center justify-center text-violet-300 group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6 text-violet-400" />
            </div>
            <h4 className="text-base font-bold text-white">پشتیبانی اختصاصی در تلگرام</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              پاسخگویی سریع در تلگرام برای اعمال اصلاحات، مشاوره رایگان و پیگیری آنی وضعیت پروژه توسط کارشناسان تکویکس.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
