import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  Clapperboard,
  Bot,
  Palette,
  Music,
  FileText,
  ArrowLeft,
  BadgeCheck,
  Headphones,
  Code,
  Clock
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

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

// Specialized Animated AI Digital Graphics for each service
const RenderAnimatedAiGraphic: React.FC<{ serviceId: string; isSelected: boolean }> = ({
  serviceId,
  isSelected,
}) => {
  switch (serviceId) {
    case 'ai-website':
      return (
        <div className="relative w-10 h-10 rounded-xl bg-[#120a28] border border-cyan-500/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-cyan-400">
          {/* Moving Scan Beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          <Globe className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'text-cyan-300 scale-110' : 'text-cyan-400'}`} />
          {/* Cyber Corner Node */}
          <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
      );
    case 'ai-video':
      return (
        <div className="relative w-10 h-10 rounded-xl bg-[#1d0a1b] border border-rose-500/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-rose-400">
          {/* Rotating Photon Ring */}
          <div className="absolute inset-1 rounded-lg border border-dashed border-rose-500/40 animate-spin" style={{ animationDuration: '6s' }} />
          <Clapperboard className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'text-rose-300 scale-110' : 'text-rose-400'}`} />
          <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
        </div>
      );
    case 'telegram-bot':
      return (
        <div className="relative w-10 h-10 rounded-xl bg-[#09152b] border border-sky-500/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-sky-400">
          {/* Radiating radar wave */}
          <span className="absolute inset-0 rounded-xl border border-sky-400/30 animate-ping opacity-60 pointer-events-none" />
          <Bot className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'text-sky-300 scale-110' : 'text-sky-400'}`} />
          <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        </div>
      );
    case 'image-creation':
      return (
        <div className="relative w-10 h-10 rounded-xl bg-[#1c0926] border border-pink-500/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-pink-400">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-transparent animate-pulse" />
          <Palette className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'text-pink-300 scale-110' : 'text-pink-400'}`} />
          <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
        </div>
      );
    case 'ai-music':
      return (
        <div className="relative w-10 h-10 rounded-xl bg-[#211804] border border-amber-500/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-amber-400">
          {/* Animated Equalizer Bars */}
          <div className="absolute bottom-1.5 inset-x-2 flex items-end justify-between h-3 opacity-60">
            <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2" />
            <span className="w-1 bg-amber-300 rounded-full animate-pulse h-3" style={{ animationDelay: '0.2s' }} />
            <span className="w-1 bg-amber-400 rounded-full animate-pulse h-1.5" style={{ animationDelay: '0.4s' }} />
            <span className="w-1 bg-amber-300 rounded-full animate-pulse h-2.5" style={{ animationDelay: '0.1s' }} />
          </div>
          <Music className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'text-amber-300 scale-110' : 'text-amber-400'}`} />
          <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </div>
      );
    case 'text-content':
    default:
      return (
        <div className="relative w-10 h-10 rounded-xl bg-[#0e181e] border border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-emerald-400">
          <FileText className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'text-emerald-300 scale-110' : 'text-emerald-400'}`} />
          {/* Blinking prompt */}
          <span className="absolute bottom-1.5 end-2 text-[8px] font-mono text-emerald-400 animate-pulse font-bold">&gt;_</span>
          <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      );
  }
};

export const InteractiveFeatures: React.FC<InteractiveFeaturesProps> = ({ onOpenOrderModal }) => {
  const { brandInfo } = useSiteData();

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const handleOrderClick = (serviceId: string) => {
    if (onOpenOrderModal) {
      onOpenOrderModal(serviceId);
    }
  };

  return (
    <section
      id="features"
      className="relative py-20 sm:py-28 bg-[#05050d] overflow-hidden border-t border-purple-900/20"
      dir="rtl"
    >
      {/* Background glow accents */}
      <div className="absolute top-1/3 start-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 end-10 w-80 h-80 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs font-semibold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>خدمات و سرویس‌های تخصصی هوش مصنوعی</span>
          </div>

          <h2
            id="estimator-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            سفارش خدمات هوشمند {brandInfo.name || 'تکویکس'}
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            از میان حوزه‌های مختلف هوش مصنوعی، سرویس مورد نیاز خود را انتخاب کرده و سفارش پروژه خود را به صورت آنلاین ثبت کنید.
          </p>
        </div>

        {/* 6 AI Services Cards Grid - Clean & Direct */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
          {ESTIMATOR_SERVICES.map((srv) => {
            return (
              <div
                key={srv.id}
                id={`estimator-srv-${srv.id}`}
                className="p-6 rounded-3xl bg-gradient-to-b from-[#0e0a24]/90 via-[#0a071a]/90 to-[#060410]/95 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_0_30px_rgba(147,51,234,0.08)] hover:shadow-[0_0_35px_rgba(147,51,234,0.25)] flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Animated AI Graphic & Price */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <RenderAnimatedAiGraphic serviceId={srv.id} isSelected={true} />
                    <div className="text-end">
                      <span className="text-[10px] text-gray-400 block font-medium">شروع تعرفه از</span>
                      <span className="text-sm font-black text-purple-300 font-sans">
                        {formatPrice(srv.basePrice)}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {srv.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-gray-300 leading-relaxed mb-6 font-normal">
                    {srv.shortDesc}
                  </p>
                </div>

                {/* Bottom CTA Button */}
                <button
                  type="button"
                  onClick={() => handleOrderClick(srv.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 hover:shadow-purple-600/40 flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.02]"
                >
                  <span>ثبت سفارش {srv.name.split(' ')[0]}</span>
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 4 Golden Guarantees & Why Us Highlights */}
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
