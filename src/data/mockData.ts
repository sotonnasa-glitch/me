import { Service, PortfolioItem, FeatureTab, FAQItem, TestimonialItem, BlogPost, SiteSectionConfig } from '../types';

export const BRAND_INFO = {
  name: 'تکویکس',
  latinName: 'Tekvix',
  tagline: 'پلتفرم خدمات هوش مصنوعی و دیجیتال',
  telegramHandle: '@Lawat_kar',
  telegramUrl: 'https://t.me/Lawat_kar',
  heroHeadline: 'خدمات هوش مصنوعی برای خلق ایده‌های بزرگ',
  heroSubtext: 'از ساخت وب‌سایت و طراحی تصاویر اختصاصی تا تولید ویدیو، موزیک و محتوای دیجیتال — سفارش خود را ثبت کنید و برای برآورد هزینه با ما در ارتباط باشید.',
};

export const SERVICES_LIST: Service[] = [
  {
    id: 'ai-website',
    title: 'ساخت وب‌سایت با هوش مصنوعی',
    category: 'web',
    categoryLabel: 'توسعه وب',
    iconName: 'Globe',
    badge: 'پرمخاطب',
    popular: true,
    shortDescription: 'طراحی و پیاده‌سازی وب‌سایت‌های واکنش‌گرا، سریع و مدرن با جدیدترین فناوری‌های هوش مصنوعی و کدنویسی استاندارد.',
    fullDescription: 'توسعه لندینگ‌پیج‌ها، پرتال‌های شرکتی و فروشگاهی با معماری فوق مدرن و رابط کاربری چشم‌نواز بر اساس هویت برند شما.',
    deliverables: ['طراحی ریسپانسیو', 'بهینه‌سازی سئو', 'سرعت لود زیر ۱ ثانیه', 'سورس کد استاندارد']
  },
  {
    id: 'image-creation',
    title: 'خلق تصاویر و طراحی گرافیکی',
    category: 'media',
    categoryLabel: 'تصویر و گرافیک',
    iconName: 'Palette',
    badge: 'کیفیت 4K',
    popular: true,
    shortDescription: 'تولید تصاویر مفهومی، آرت‌ورک‌های فوق‌واقع‌گرایانه، کاراکترسازی و المان‌های بصری اختصاصی با هوش مصنوعی.',
    fullDescription: 'خلق محتوای تصویری منحصربه‌فرد برای وب‌سایت، کمپین‌های تبلیغاتی و بسته‌بندی با بالاترین رزولوشن و تطابق رنگی.',
    deliverables: ['رزولوشن فوق‌العاده', 'بدون کپی‌رایت', 'سبک‌های چندگانه هنری', 'فایل لایه‌باز/ادیت']
  },
  {
    id: 'ai-video',
    title: 'تولید ویدیو با هوش مصنوعی',
    category: 'media',
    categoryLabel: 'ویدیو و انیمیشن',
    iconName: 'Clapperboard',
    badge: 'ترند روز',
    popular: true,
    shortDescription: 'ساخت تیزرهای تبلیغاتی، ویدیوهای پروداکت و انیمیشن‌های کوتاه سینمایی با مدل‌های پیشرفته تولید ویدیو.',
    fullDescription: 'تبدیل متن و تصویر به کلیپ‌های ویدیویی داینامیک، جلوه‌های بصری خیره‌کننده و تدوین حرفه‌ای جهت جذب حداکثری مخاطب.',
    deliverables: ['فرمت‌های افقی و عمودی', 'موشن‌گرافیک هوشمند', 'افکت‌های سینمایی', 'تدوین و صداگذاری']
  },
  {
    id: 'ai-music',
    title: 'ساخت موزیک و ترانه با AI',
    category: 'media',
    categoryLabel: 'صدا و موسیقی',
    iconName: 'Music',
    shortDescription: 'آهنگسازی اختصاصی، ساخت ملودی، ترک‌های پس‌زمینه تبلیغاتی و ترانه‌سرایی به زبان‌های مختلف.',
    fullDescription: 'تولید موسیقی یونیک در سبک‌های سینماتیک، الکترونیک، پاپ، راک و امبینت متناسب با حس‌وحال تیزر و پادکست شما.',
    deliverables: ['حق امتیاز کامل', 'میکس و مستر باکیفیت', 'سازگاری با اینستاگرام و یوتیوب', 'تنوع سبک‌ها']
  },
  {
    id: 'voice-narration',
    title: 'دوبله، نریشن و تبدیل صدا',
    category: 'media',
    categoryLabel: 'صدا و موسیقی',
    iconName: 'Mic',
    shortDescription: 'گویندگی روان فارسی و انگلیسی، شبیه‌سازی صدا (Voice Cloning) و تولید کتاب صوتی و نریشن تیزرها.',
    fullDescription: 'استفاده از طبیعی‌ترین مدل‌های صوتی با لحن‌های احساسی، حماسی، آموزشی و رسمی جهت ارتقای برند شما.',
    deliverables: ['صدای طبیعی بدون لحن رباتیک', 'تنوع لهجه‌ها و زبان‌ها', 'حذف نویز حرفه‌ای', 'زمان‌بندی دقیق با ویدیو']
  },
  {
    id: 'text-content',
    title: 'تولید متن و محتوای اختصاصی',
    category: 'content',
    categoryLabel: 'محتوا و نگارش',
    iconName: 'PenTool',
    shortDescription: 'نگارش مقالات تخصصی، کپی‌رایتینگ متون تبلیغاتی، پست بلاگ، سناریوی ویدیو و استراتژی محتوا.',
    fullDescription: 'تولید متن‌های خلاقانه و کاملاً انسانی با رعایت اصول سئو (SEO) برای جذب ترافیک ارگانیک و تعامل بالاتر کاربران.',
    deliverables: ['رعایت اصول لحن برند', 'ساختار سئو شده', 'تیترهای جذاب کلیک‌خور', 'سناریوهای ویدیو/ریلز']
  },
  {
    id: 'social-content',
    title: 'تولید محتوا برای شبکه‌های اجتماعی',
    category: 'content',
    categoryLabel: 'سوشال مدیا',
    iconName: 'Smartphone',
    badge: 'بسته‌های ماهانه',
    shortDescription: 'پکیج‌های کامل ریلز، استوری، اسلایدی و کاورهای گرافیکی برای اینستاگرام، لینکدین و یوتیوب.',
    fullDescription: 'طراحی زنجیره‌ای از پست‌ها و ویدیوهای تعاملی با الگوریتم‌شناسی شبکه‌های اجتماعی جهت رشد انفجاری پیج.',
    deliverables: ['تقویم محتوایی اختصاصی', 'طراحی قالب گرافیکی', 'ویدیوهای ریلز عمودی', 'کپشن‌نویسی و هشتگ‌گذاری']
  },
  {
    id: 'telegram-bot',
    title: 'ساخت ربات تلگرام پیشرفته',
    category: 'bot',
    categoryLabel: 'اتوماسیون و ربات',
    iconName: 'Bot',
    badge: 'فنی و اختصاصی',
    popular: true,
    shortDescription: 'توسعه ربات‌های تلگرامی فروشگاهی، پشتیبانی مشتریان، پردازش داده و اتصال به سرویس‌های هوش مصنوعی.',
    fullDescription: 'پیاده‌سازی بات‌های تعاملی و پرسرعت متصل به APIهای اختصاصی با دکمه‌های شیشه‌ای و پنل مدیریتی قدرتمند.',
    deliverables: ['سرعت پردازش آنی', 'اتصال به درگاه و هوش مصنوعی', 'مدیریت کاربران و کانال', 'سورس کد بهینه']
  },
  {
    id: 'ad-design',
    title: 'طراحی تبلیغات هدفمند دیجیتال',
    category: 'content',
    categoryLabel: 'تبلیغات و کمپین',
    iconName: 'Target',
    shortDescription: 'خلق بنرهای کلیکی، تبلیغات همسان، بنرهای گوگل ادز و کمپین‌های تبلیغاتی با نرخ تبدیل (CTR) بالا.',
    fullDescription: 'ترکیب روانشناسی فروش و زیبایی‌شناسی هوش مصنوعی برای ساخت آگهی‌هایی که مستقیم روی فروش اثر می‌گذارند.',
    deliverables: ['آزمون A/B چندین نسخه', 'طراحی سایزهای استاندارد وب', 'قلاب‌های بصری قدرتمند', 'کپی‌رایتینگ متقاعدکننده']
  },
  {
    id: 'poster-banner',
    title: 'طراحی پوستر، بنر و کاور',
    category: 'media',
    categoryLabel: 'طراحی و چاپ',
    iconName: 'Image',
    shortDescription: 'طراحی کاور موزیک، پوستر رویدادها، بنرهای چاپی و بیلبوردهای دیجیتال با جزئیات فوق‌العاده.',
    fullDescription: 'ایجاد طرح‌های گرافیکی با وضوح بسیار بالا و ترکیب هنر مدرن هوش مصنوعی با تایپوگرافی چشم‌نواز فارسی.',
    deliverables: ['آماده چاپ با مود رنگی CMYK', 'نسخه وب RGB و بهینه', 'تایپوگرافی خلاقانه', 'ترکیب‌بندی استاندارد']
  },
  {
    id: 'custom-ai',
    title: 'توسعه راهکارهای سفارشی هوش مصنوعی',
    category: 'custom',
    categoryLabel: 'سفارشی و شرکتی',
    iconName: 'Cpu',
    badge: 'Enterprise',
    shortDescription: 'طراحی پایپ‌لاین‌های اختصاصی، یکپارچه‌سازی مدل‌های زبانی (LLM) و اتوماسیون فرآیندهای کسب‌وکار شما.',
    fullDescription: 'بررسی نیازهای سازمان شما و پیاده‌سازی سیستم‌های هوشمند برای کاهش هزینه‌ها و افزایش سرعت کاری تیم‌ها.',
    deliverables: ['مشاوره تخصصی معماری', 'یکپارچه‌سازی با نرم‌افزارهای شما', 'امنیت داده‌های محرمانه', 'پشتیبانی و توسعه مداوم']
  }
];

export const FEATURES_STRENGTHS = [
  {
    icon: 'Zap',
    title: 'سرعت تحویل فوق‌العاده',
    description: 'بهره‌گیری از زنجیره ابزارهای اتوماتیک باعث می‌شود پروژه‌ها در یک‌سوم زمان متداول بازار تحویل شوند.'
  },
  {
    icon: 'Cpu',
    title: 'مدرن‌ترین ابزارهای AI',
    description: 'دسترسی مستقیم به پیشرفته‌ترین مدل‌های تولید کد، تصویر و ویدیو در سطح بین‌المللی.'
  },
  {
    icon: 'Sparkles',
    title: 'خروجی خلاقانه و متمایز',
    description: 'هر اثر با توجه به روحیه برند شما شخصی‌سازی شده و از کارهای تکراری و قالب‌های آماده اجتناب می‌شود.'
  },
  {
    icon: 'MessageSquare',
    title: 'ارتباط مستقیم و سریع',
    description: 'پشتیبانی بی‌واسطه و هماهنگی گام‌به‌گام از طریق تلگرام با کارشناس اختصاصی پروژه.'
  },
  {
    icon: 'Wrench',
    title: 'راهکارهای کاملاً سفارشی',
    description: 'امکان ترکیب چند سرویس و تعریف نیازمندی‌های خاص بر اساس وسعت و هدف دقیق کسب‌وکار شما.'
  }
];

export const INTERACTIVE_FEATURE_TABS: FeatureTab[] = [
  {
    id: 'dashboard',
    title: 'داشبورد اختصاصی و کاربرپسند',
    description: 'مدیریت و مشاهده لحظه‌ای خروجی‌های هوش مصنوعی با رابطی شیک و کمینه.',
    iconName: 'LayoutDashboard',
    dashboardTitle: 'نمای کلی پلتفرم تکویکس',
    dashboardSubtitle: 'www.tekvix.ai/client-portal',
    visibilityMetric: '94.8%',
    visibilityGrowth: '+18.4%',
    chartData: [28, 42, 36, 58, 49, 72, 85, 94],
    activeItems: [
      { name: 'پروژه وب‌سایت لندینگ', status: 'تکمیل شده', score: '۹۹٪' },
      { name: 'پکیج تصاویر تبلیغاتی', status: 'در حال تولید', score: '۸۵٪' },
      { name: 'ربات پاسخگوی هوشمند', status: 'فعال', score: '۱۰۰٪' }
    ]
  },
  {
    id: 'one-click',
    title: 'بهینه‌سازی و تولید با یک کلیک',
    description: 'تسریع تولید محتوا و کد با پایپ‌لاین‌های آماده و تست‌شده تکویکس.',
    iconName: 'MousePointerClick',
    dashboardTitle: 'موتور بهینه‌سازی خودکار سرعت و کیفیت',
    dashboardSubtitle: 'AI Engine v4.2 Pipeline',
    visibilityMetric: '3.2x',
    visibilityGrowth: '+220%',
    chartData: [15, 30, 45, 60, 75, 90, 110, 135],
    activeItems: [
      { name: 'بهینه‌سازی کدهای فرانت‌اند', status: 'لود ۰.۸ ثانیه', score: 'A+' },
      { name: 'ارتقای کیفیت تصاویر به 4K', status: 'Upscaled', score: '۴K' },
      { name: 'تدوین هوشمند فریم‌های ویدیویی', status: 'Sync', score: '۶۰fps' }
    ]
  },
  {
    id: 'smart-gen',
    title: 'موتور هوشمند تولید محتوا و کد',
    description: 'الگوریتم‌های یادگیری عمیق اختصاصی برای ارائه ایده‌های ناب متناسب با بازار هدف شما.',
    iconName: 'Sparkles',
    badge: 'جدید',
    dashboardTitle: 'تحلیلگر ترندها و کلمات کلیدی هوشمند',
    dashboardSubtitle: 'Trend Radar & Prompt Suite',
    visibilityMetric: '10.15%',
    visibilityGrowth: '+5.6%',
    chartData: [20, 35, 25, 45, 40, 65, 55, 80],
    activeItems: [
      { name: 'ایده‌پردازی کمپین اینستاگرام', status: '۱۲ ایده آماده', score: 'Top' },
      { name: 'کپی‌رایتینگ صفحه لندینگ', status: 'نرخ تبدیل بالا', score: '۹۸/۱۰۰' },
      { name: 'اسکریپت ویدیوی تبلیغاتی', status: 'سناریوی آماده', score: 'Cinematic' }
    ]
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    stepNumber: '۰۱',
    title: 'انتخاب خدمت مورد نیاز',
    description: 'از میان سرویس‌های متنوع تکویکس (وب‌سایت، تصویر، ویدیو، ربات، صدا یا متن) خدمت متناسب با ایده خود را مشخص کنید.',
    icon: 'Layers'
  },
  {
    stepNumber: '۰۲',
    title: 'ثبت سفارش در فرم آنلاین',
    description: 'با زدن دکمه "ثبت سفارش" یا "دریافت مشاوره"، نام و آیدی تلگرام خود را وارد کنید تا پیش‌فاکتور برای شما آماده شود.',
    icon: 'FileSpreadsheet'
  },
  {
    stepNumber: '۰۳',
    title: 'تماس در تلگرام و تحویل نهایی',
    description: 'کارشناسان تکویکس در تلگرام با شما ارتباط برقرار کرده و پس از نهایی‌سازی جزئیات، خروجی با بالاترین کیفیت تحویل داده می‌شود.',
    icon: 'Send'
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'project-nexus',
    title: 'پلتفرم لندینگ‌پیج نکسوس هوش مصنوعی',
    description: 'توسعه وب‌سایت دارک و مدرن با المان‌های تعاملی و سرعت بارگذاری فوق‌العاده برای استارتاپ تکنولوژی.',
    serviceCategory: 'وب‌سایت و کدنویسی',
    badge: 'وب‌سایت هوشمند',
    gradientTheme: 'from-purple-900/60 via-indigo-900/40 to-black',
    stats: [
      { label: 'سرعت لود', value: '۰.۷ ثانیه' },
      { label: 'افزایش لید', value: '+۱۴۰٪' }
    ],
    tags: ['Next.js', 'Tailwind', 'Motion', 'Dark UI']
  },
  {
    id: 'project-cinematic',
    title: 'تیزر تبلیغاتی سینمایی شرکت ویستا',
    description: 'تولید کلیپ ویدیویی علمی-تخیلی با پرامپت‌های اختصاصی و صداگذاری هوشمند برای معرفی محصول جدید.',
    serviceCategory: 'ویدیو و انیمیشن',
    badge: 'ویدیو 4K',
    gradientTheme: 'from-blue-900/60 via-purple-900/40 to-black',
    stats: [
      { label: 'کیفیت تصویر', value: '4K Ultra HD' },
      { label: 'نرخ بازدید', value: '+۲۵۰K' }
    ],
    tags: ['AI Video', 'Sound Design', 'Color Grade', 'Reels']
  },
  {
    id: 'project-cyberart',
    title: 'مجموعه کاراکتر و آرت‌ورک سایبرپانک',
    description: 'طراحی ۱۰ کاراکتر اختصاصی و فضاسازی سه‌بعدی برای کمپین دیجیتال گیمینگ بدون کپی‌رایت.',
    serviceCategory: 'تصویر و گرافیک',
    badge: 'طراحی مفهومی',
    gradientTheme: 'from-fuchsia-900/60 via-pink-900/40 to-black',
    stats: [
      { label: 'تعداد طرح', value: '۱۰ کاراکتر' },
      { label: 'رزولوشن', value: '۶۰۰۰×۴۰۰۰' }
    ],
    tags: ['Midjourney', 'Concept Art', 'Photoshop', 'Branding']
  },
  {
    id: 'project-telebot',
    title: 'ربات تلگرام فروشگاهی و پشتیبانی هوشمند',
    description: 'ربات تعاملی با اتصال به درگاه پرداخت و موتور پردازش زبان طبیعی برای پاسخ‌دهی ۲۴ ساعته به مشتریان.',
    serviceCategory: 'ربات تلگرام',
    badge: 'اتوماسیون ۲۴/۷',
    gradientTheme: 'from-cyan-900/60 via-blue-900/40 to-black',
    stats: [
      { label: 'زمان پاسخ', value: '< ۰.۲ ثانیه' },
      { label: 'کاهش تیکت‌ها', value: '۷۰٪' }
    ],
    tags: ['Telegram Bot', 'Python', 'AI NLP', 'Webhooks']
  },
  {
    id: 'project-audio',
    title: 'موسیقی زمینه و هویت صوتی برند آورا',
    description: 'ساخت ۳ قطعه موسیقی مینیمال و آرامش‌بخش برای پادکست و ویدیوهای یوتیوب برند مد و زیبایی.',
    serviceCategory: 'موزیک و صدا',
    badge: 'موسیقی اختصاصی',
    gradientTheme: 'from-violet-900/60 via-purple-950 to-black',
    stats: [
      { label: 'سبک', value: 'Ambient Synth' },
      { label: 'حق کپی‌رایت', value: '۱۰۰٪ اختصاصی' }
    ],
    tags: ['AI Music', 'Voiceover', 'Mastering', 'Podcast']
  },
  {
    id: 'project-social',
    title: 'بسته ۳۰ عددی محتوای ریلز و استوری',
    description: 'تولید تقویم ماهانه محتوا شامل ویدیوهای کوتاه، کاورهای مدرن و سناریوهای جذاب جذب فالوور.',
    serviceCategory: 'سوشال مدیا',
    badge: 'کمپین شبکه‌های اجتماعی',
    gradientTheme: 'from-amber-900/50 via-purple-900/40 to-black',
    stats: [
      { label: 'رشد تعامل', value: '+۳۱۰٪' },
      { label: 'تعداد محتوا', value: '۳۰ پست و ریلز' }
    ],
    tags: ['Instagram', 'Viral Reels', 'Copywriting', 'Canva Pro']
  }
];

export const TESTIMONIALS_LIST: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'مهندس حسینی',
    role: 'مدیر محصول',
    company: 'استارتاپ فلوتک',
    quote: 'سرعت و دقت تیم تکویکس در طراحی لندینگ‌پیج با هوش مصنوعی حیرت‌انگیز بود. نتیجه نهایی بسیار فراتر از استانداردهای معمول بازار وب ایران است.',
    avatarSeed: 'hassan',
    verified: true
  },
  {
    id: 't-2',
    name: 'سارا رضایی',
    role: 'مدیر مارکتینگ',
    company: 'آژانس خلاقیت نووا',
    quote: 'برای تیزر تبلیغاتی‌مان نیاز به تصاویر و ویدیوی علمی-تخیلی داشتیم. تکویکس در کمتر از ۴۸ ساعت کاری چیزی به ما تحویل داد که تیم‌های سنتی ۲ هفته زمان می‌خواستند!',
    avatarSeed: 'sara',
    verified: true
  },
  {
    id: 't-3',
    name: 'امیرحسین پارسا',
    role: 'بنیان‌گذار',
    company: 'صرافی ارز دیجیتال بیتاکس',
    quote: 'ربات تلگرامی که برای ما پیاده‌سازی کردند توانسته بار کاری تیم پشتیبانی را ۷۰ درصد سبک کند. پیشنهاد می‌کنم حتماً از خدماتشان استفاده کنید.',
    avatarSeed: 'amir',
    verified: true
  }
];

export const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'process',
    question: 'روند ثبت سفارش و شروع پروژه به چه صورت است؟',
    answer: 'کافیست در هر بخش از سایت روی دکمه «ثبت سفارش» کلیک کنید و نام و آیدی تلگرام یا شماره تماس خود را وارد نمایید. پس از ارسال فرم، کارشناسان تکویکس در کمترین زمان از طریق تلگرام با شما تماس می‌گیرند تا جزئیات را هماهنگ کنند.'
  },
  {
    id: 'faq-2',
    category: 'pricing',
    question: 'هزینه و تعرفه پروژه‌ها چگونه تعیین می‌شود؟',
    answer: 'به دلیل تنوع گسترده در ابعاد پروژه‌ها و نیازهای مشتریان، هزینه هر سفارش با توجه به نوع سرویس (مثلاً تعداد فریم ویدیویی، حجم کدنویسی یا پیچیدگی ربات) برآورد شده و پیش‌فاکتور شفاف و منصفانه‌ای در تلگرام خدمت شما ارسال می‌شود.'
  },
  {
    id: 'faq-3',
    category: 'general',
    question: 'آیا امکان سفارش پروژه‌های سفارشی و ترکیبی وجود دارد؟',
    answer: 'بله کاملاً! شما می‌توانید چندین خدمت را با هم ترکیب کنید؛ برای مثال طراحی سایت همراه با تولید تمام تصاویر و ویدیوهای تبلیغاتی و راه‌اندازی ربات تلگرام در یک پکیج جامع انجام می‌پذیرد.'
  },
  {
    id: 'faq-4',
    category: 'support',
    question: 'پشتیبانی و نحوه تحویل پروژه چگونه است؟',
    answer: 'تمام فایل‌ها، سورس کدها و خروجی‌های باکیفیت به صورت مستقیم از طریق تلگرام یا لینک دانلود اختصاصی پرسرعت تحویل داده می‌شوند. همچنین تیم تکویکس تا حصول رضایت کامل شما از خروجی، پشتیبانی و اصلاحات لازم را انجام می‌دهد.'
  },
  {
    id: 'faq-5',
    category: 'process',
    question: 'زمان تحویل پروژه‌ها معمولاً چقدر است؟',
    answer: 'به لطف ابزارهای پرسرعت هوش مصنوعی و تخصص فنی تیم ما، پروژه‌های طراحی تصویر و محتوا معمولاً بین ۲۴ تا ۴۸ ساعت و پروژه‌های وب‌سایت یا ربات تلگرام بین ۳ تا ۷ روز کاری تحویل داده می‌شوند.'
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'آیا خروجی‌های هوش مصنوعی دارای کپی‌رایت اختصاصی هستند؟',
    answer: 'بله، تمامی تصاویر، ویدیوها، موزیک‌ها و کدهای تولید شده کاملاً یونیک بوده و حق استفاده تجاری بدون محدودیت متعلق به شما خواهد بود.'
  }
];

export const TRUSTED_COMPANIES = [
  { name: 'OpenAI', symbol: '✦', tag: 'GPT-4o & Sora' },
  { name: 'Google DeepMind', symbol: '◈', tag: 'Gemini 2.5' },
  { name: 'Microsoft Azure AI', symbol: '❖', tag: 'Copilot Studio' },
  { name: 'Anthropic', symbol: '▲', tag: 'Claude 3.5' },
  { name: 'Mistral AI', symbol: '◆', tag: 'Le Chat & Pixtral' },
  { name: 'Meta AI', symbol: '◉', tag: 'Llama 3.3' },
  { name: 'Hugging Face', symbol: '🤗', tag: 'Open Models' },
  { name: 'Cohere', symbol: '✦', tag: 'Command R+' },
  { name: 'Scale AI', symbol: '◈', tag: 'Data Engine' },
  { name: 'ElevenLabs', symbol: '❖', tag: 'Voice AI' }
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'انقلاب طراحی وب‌سایت با هوش مصنوعی در سال ۲۰۲۶: از ایده تا لانچ در چند ساعت',
    slug: 'ai-web-design-revolution-2026',
    excerpt: 'چگونه ابزارهای نوین هوش مصنوعی نحوه خلق رابط‌های کاربری تاریک، انیمیشن‌های روان و بهینه‌سازی سرعت لود را دگرگون کرده‌اند.',
    content: `در دنیای شتابان تکنولوژی امروز، طراحی وب‌سایت دیگر نیازمند هفته‌ها کدنویسی خسته‌کننده برای پیاده‌سازی ساختارهای پایه نیست. هوش مصنوعی و مدل‌های عمیق چندوجهی این امکان را فراهم ساخته‌اند که ایده‌های نوآورانه در کوتاه‌ترین زمان به وب‌سایت‌های عملیاتی، باکیفیت و استاندارد تبدیل شوند.

### چرا رویکرد هوش مصنوعی در توسعه وب برتر است؟
۱. **طراحی واکنش‌گرا و سازگاری بی‌نقص:** الگوریتم‌های هوش مصنوعی با تحلیل هزاران قالب مدرن، مناسب‌ترین پالت‌های رنگی و نسبت‌های تایپوگرافی را برای نمایش در موبایل و دسکتاپ پیشنهاد می‌دهند.
۲. **سرعت بارگذاری خارق‌العاده:** حذف کدهای اضافه و بهینه‌سازی خودکار ساختار فایل‌ها موجب دستیابی به زمان بارگذاری زیر ۱ ثانیه می‌گردد.
۳. **امنیت و معماری ماژولار:** کدهای کامپوننت‌محور با فریم‌ورک‌هایی نظیر React و Tailwind موجب توسعه‌پذیری آسان در آینده می‌شوند.

تیم تکویکس با ترکیب خلاقیت هنری و قدرت الگوریتم‌های پیشرفته، وب‌سایت‌هایی فراتر از تصور برای کسب‌وکارهای مدرن خلق می‌کند.`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.aparat.com/video/video/embed/videohash/V36Yq/vt/frame',
    author: 'امیررضا صابری',
    authorRole: 'سرپرست تیم هوش مصنوعی',
    category: 'طراحی وب و کدنویسی',
    hashtags: ['#هوش_مصنوعی', '#طراحی_وب', '#توسعه_سایت', '#تکویکس', '#تکنولوژی'],
    createdAt: '2026-08-10T14:30:00Z',
    readTimeMinutes: 4,
    published: true,
    viewsCount: 420,
    likesCount: 58
  },
  {
    id: 'post-2',
    title: 'تولید ویدیوهای سینمایی و ریلز اینستاگرام با مدل‌های هوش مصنوعی',
    slug: 'cinematic-ai-video-generation-guide',
    excerpt: 'بررسی راهکارهای تولید تیزرهای ویدیویی فوق‌العاده با رزولوشن 4K بدون نیاز به استودیوهای فیلمبرداری گران‌قیمت.',
    content: `صنعت تولید ویدیو دستخوش تحولی بنیادین شده است. امروزه بدون نیاز به دوربین‌های گران‌قیمت یا لوکیشن‌های پیچیده، می‌توانید تیزرهای سینمایی چشم‌نوازی با هوش مصنوعی خلق کنید که توجه هر بیننده‌ای را جلب کند.

### مراحل خلق ویدیوی موفق با AI:
- **ایده‌پردازی و سناریونویسی:** خلق پرامپت‌های دقیق و احساسی که فضا، نورپردازی (نئون، سینمایی یا مودی) و حرکات دوربین را توصیف می‌کنند.
- **تولید فریم‌های پایه و متحرک‌سازی:** استفاده از برترین مدل‌های جنریتیو برای ایجاد حرکت‌های طبیعی و نرخ فریم پایدار ۶۰fps.
- **تدوین صوتی و موسیقی اتمسفریک:** میکس و مسترینگ صداهای زمینه، افکت‌های صوتی (SFX) و نریشن روان متناسب با تصویر.

در پلتفرم تکویکس، ما پکیج‌های ویدیویی آماده‌ای برای کمپین‌های تبلیغاتی و سوشال مدیا ارائه می‌دهیم که نرخ تعامل مخاطبان شما را چند برابر می‌کند.`,
    coverImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: 'زهرا کاظمی',
    authorRole: 'کارگردان و طراح موشن AI',
    category: 'ویدیو و انیمیشن',
    hashtags: ['#ویدیو_AI', '#تولید_محتوا', '#ریلز_اینستاگرام', '#تیزر_تبلیغاتی', '#هوش_مصنوعی'],
    createdAt: '2026-08-12T11:00:00Z',
    readTimeMinutes: 5,
    published: true,
    viewsCount: 680,
    likesCount: 94
  },
  {
    id: 'post-3',
    title: 'راهنمای راه‌اندازی ربات‌های تلگرام هوشمند برای فروشگاه‌ها و پشتیبانی ۲۴ ساعته',
    slug: 'smart-telegram-bots-ecommerce-support',
    excerpt: 'چگونه یک ربات تلگرام اختصاصی متصل به هوش مصنوعی می‌تواند تا ۷۰٪ بار کاری تیم پشتیبانی و فروش را کاهش دهد.',
    content: `تلگرام به عنوان یکی از محبوب‌ترین بسترهای ارتباطی، فرصتی بی‌نظیر برای ارتباط مداوم با مشتریان و خودکارسازی فرآیندهای فروش فراهم کرده است.

### مزایای کلیدی ربات‌های نسل جدید:
۱. **پاسخگویی آنی در کمتر از ۰.۲ ثانیه:** مشتریان هیچ‌گاه معطل پاسخ نخواهند ماند.
۲. **اتصال به سیستم‌های پرداخت و انبارداری:** ثبت خودکار سفارش و ارسال فاکتور دیجیتال بدون دخالت دست.
۳. **پردازش زبان طبیعی (NLP):** درک پیام‌های عامیانه کاربران و هدایت هوشمندانه آن‌ها به بخش مورد نظر.

با سرویس ربات‌سازی تکویکس، کسب‌وکار خود را به صورت ۲۴ ساعته و بدون وقفه فعال نگه دارید.`,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    author: 'مهدی حاتمی',
    authorRole: 'معمار ارشد نرم‌افزار',
    category: 'ربات و اتوماسیون',
    hashtags: ['#ربات_تلگرام', '#اتوماسیون', '#پشتیبانی_آنلاین', '#فروشگاه_اینترنتی', '#تکویکس'],
    createdAt: '2026-08-13T09:15:00Z',
    readTimeMinutes: 3,
    published: true,
    viewsCount: 510,
    likesCount: 72
  },
  {
    id: 'post-4',
    title: 'خلق موسیقی و هویت صوتی اختصاصی برند با هوش مصنوعی',
    slug: 'ai-music-sonic-branding',
    excerpt: 'نقش آهنگسازی هوشمند و نریشن با کیفیت استودیویی در تقویت ماندگاری نام تجاری در ذهن مخاطب.',
    content: `هویت صوتی (Sonic Branding) یکی از قدرتمندترین ابزارهای بازاریابی است که اغلب نادیده گرفته می‌شود. یک ملودی کوتاه یا سبک موسیقی خاص می‌تواند فوراً حس اطمینان و شناخت را در مخاطب برانگیزد.

امروزه با الگوریتم‌های آهنگسازی هوش مصنوعی، می‌توان قطعات موسیقی ارجینال بدون هیچ‌گونه مشکل کپی‌رایت ساخت که دقیقاً با فرکانس احساسی برند شما هماهنگ است.`,
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    author: 'کیارش نامدار',
    authorRole: 'طراح صدا و موسیقی',
    category: 'صدا و موسیقی',
    hashtags: ['#موسیقی_AI', '#هویت_صوتی', '#نریشن', '#پادکست', '#هوش_مصنوعی'],
    createdAt: '2026-08-14T08:00:00Z',
    readTimeMinutes: 3,
    published: true,
    viewsCount: 310,
    likesCount: 45
  }
];

export const DEFAULT_SECTIONS_CONFIG: SiteSectionConfig[] = [
  {
    id: 'hero',
    key: 'hero',
    nameFa: 'بخش هیرو و سربرگ کیهانی',
    titleFa: 'بخش هیرو و سربرگ کیهانی',
    nameEn: 'Hero & Glowing Cosmic Orb',
    titleEn: 'Hero & Cosmic Orb',
    category: 'هدر و معرفی',
    badgeText: 'سربرگ اصلی',
    description: 'عنوان اصلی، متن معرفی و دکمه‌های ثبت سفارش در ابتدای سایت',
    subtitleFa: 'عنوان اصلی، متن معرفی و دکمه‌های ثبت سفارش در ابتدای سایت',
    enabled: true,
    customTitle: 'خدمات هوش مصنوعی برای خلق ایده‌های بزرگ',
    customSubtitle: 'از ساخت وب‌سایت و طراحی تصاویر اختصاصی تا تولید ویدیو، موزیک و محتوای دیجیتال',
    orderIndex: 1
  },
  {
    id: 'features',
    key: 'features',
    nameFa: 'ویژگی‌های تعاملی و داشبورد زنده',
    titleFa: 'ویژگی‌های تعاملی و داشبورد زنده',
    nameEn: 'Interactive Features & Live Dashboard',
    titleEn: 'Interactive Features',
    category: 'قابلیت‌ها',
    badgeText: 'داشبورد زنده',
    description: 'تب‌های تعاملی قابلیت‌های پلتفرم و پیش‌نمایش گرافیکی',
    subtitleFa: 'تب‌های تعاملی قابلیت‌های پلتفرم و پیش‌نمایش گرافیکی',
    enabled: true,
    customTitle: 'قابلیت‌های قدرتمند و بلادرنگ',
    customSubtitle: 'پلتفرم جامع برای پیاده‌سازی سریع‌ترین راهکارهای دیجیتال',
    orderIndex: 2
  },
  {
    id: 'services',
    key: 'services',
    nameFa: 'فهرست خدمات و پکیج‌ها',
    titleFa: 'فهرست خدمات و پکیج‌ها',
    nameEn: 'AI Services & Packages Grid',
    titleEn: 'Services Grid',
    category: 'خدمات و محصولات',
    badgeText: 'پرفروش‌ترین',
    description: 'کارت‌های تمامی خدمات هوش مصنوعی با فیلتر دسته‌بندی و سفارش آنی',
    subtitleFa: 'کارت‌های تمامی خدمات هوش مصنوعی با فیلتر دسته‌بندی و سفارش آنی',
    enabled: true,
    customTitle: 'خدمات هوشمند تکویکس',
    customSubtitle: 'راهکارهای نوین مبتنی بر هوش مصنوعی برای ارتقای کسب‌وکار شما',
    orderIndex: 3
  },
  {
    id: 'howItWorks',
    key: 'howItWorks',
    nameFa: 'مراحل انجام کار (۳ گام ساده)',
    titleFa: 'مراحل انجام کار (۳ گام ساده)',
    nameEn: 'How It Works (3 Steps)',
    titleEn: 'How It Works',
    category: 'فرآیند همکاری',
    badgeText: '۳ گام سریع',
    description: 'راهنمای ثبت سفارش، هماهنگی تلگرام و تحویل نهایی',
    subtitleFa: 'راهنمای ثبت سفارش، هماهنگی تلگرام و تحویل نهایی',
    enabled: true,
    customTitle: 'مسیر همکاری با تکویکس',
    customSubtitle: 'تنها در ۳ مرحله ساده سفارش خود را ثبت کرده و تحویل بگیرید',
    orderIndex: 4
  },
  {
    id: 'portfolio',
    key: 'portfolio',
    nameFa: 'نمونه‌کارها و پروژه‌های اجرا شده',
    titleFa: 'نمونه‌کارها و پروژه‌های اجرا شده',
    nameEn: 'Portfolio & Case Studies',
    titleEn: 'Portfolio Showcase',
    category: 'نمونه‌کارها',
    badgeText: 'گالری مدرن',
    description: 'گالری پروژه‌های موفق، تیزرها، ربات‌ها و وب‌سایت‌های اجرا شده',
    subtitleFa: 'گالری پروژه‌های موفق، تیزرها، ربات‌ها و وب‌سایت‌های اجرا شده',
    enabled: true,
    customTitle: 'نمونه‌کارهای برگزیده',
    customSubtitle: 'گوشه‌ای از پروژه‌هایی که با هوش مصنوعی تکویکس جان گرفته‌اند',
    orderIndex: 5
  },
  {
    id: 'testimonials',
    key: 'testimonials',
    nameFa: 'نظرات و رضایت مشتریان',
    titleFa: 'نظرات و رضایت مشتریان',
    nameEn: 'Client Testimonials',
    titleEn: 'Testimonials',
    category: 'نظرات مشتریان',
    badgeText: 'امتیاز ۵ از ۵',
    description: 'بازخوردها و تجربیات مشتریان از همکاری با تکویکس',
    subtitleFa: 'بازخوردها و تجربیات مشتریان از همکاری با تکویکس',
    enabled: true,
    customTitle: 'آنچه مشتریان درباره ما می‌گویند',
    customSubtitle: 'تجربه کار با جدیدترین فناوری‌های هوش مصنوعی و تحویل سریع',
    orderIndex: 6
  },
  {
    id: 'blog',
    key: 'blog',
    nameFa: 'بلاگ، مقالات و ویدیوها',
    titleFa: 'بلاگ، مقالات و ویدیوها',
    nameEn: 'Blog, Articles & Video Tutorials',
    titleEn: 'Blog & Media CMS',
    category: 'محتوا و رسانه',
    badgeText: 'ویدیو + مقاله',
    description: 'مقالات تخصصی همراه با ویدیو و جستجوی هشتگ‌های هوشمند',
    subtitleFa: 'مقالات تخصصی همراه با ویدیو و جستجوی هشتگ‌های هوشمند',
    enabled: true,
    customTitle: 'مجله تخصصی و بلاگ تکویکس',
    customSubtitle: 'جدیدترین آموزش‌ها، ترندهای هوش مصنوعی و راهنماهای کاربردی',
    orderIndex: 7
  },
  {
    id: 'about',
    key: 'about',
    nameFa: 'داستان و ارزش‌های برند',
    titleFa: 'داستان و ارزش‌های برند',
    nameEn: 'About & Brand Story',
    titleEn: 'About Tekvix',
    category: 'درباره ما',
    badgeText: 'هویت برند',
    description: 'معرفی اهداف، چشم‌انداز و سرعت تمایز تکویکس',
    subtitleFa: 'معرفی اهداف، چشم‌انداز و سرعت تمایز تکویکس',
    enabled: true,
    customTitle: 'درباره پلتفرم تکویکس',
    customSubtitle: 'ترکیب هوش مصنوعی و خلاقیت انسانی برای فتح آینده',
    orderIndex: 8
  },
  {
    id: 'faq',
    key: 'faq',
    nameFa: 'پرسش‌های متداول (FAQ)',
    titleFa: 'پرسش‌های متداول (FAQ)',
    nameEn: 'Frequently Asked Questions',
    titleEn: 'FAQ Section',
    category: 'راهنمایی و پشتیبانی',
    badgeText: 'پاسخ‌های شفاف',
    description: 'پاسخ به سوالات پرتکرار پیرامون قیمت، زمان تحویل و پشتیبانی',
    subtitleFa: 'پاسخ به سوالات پرتکرار پیرامون قیمت، زمان تحویل و پشتیبانی',
    enabled: true,
    customTitle: 'سوالات متداول',
    customSubtitle: 'پاسخ به سوالات رایج شما درباره نحوه همکاری و سفارشات',
    orderIndex: 9
  },
  {
    id: 'cta',
    key: 'cta',
    nameFa: 'بخش دعوت به اقدام (CTA نهایی)',
    titleFa: 'بخش دعوت به اقدام (CTA نهایی)',
    nameEn: 'Call To Action Box',
    titleEn: 'Call to Action',
    category: 'تبدیل و فروش',
    badgeText: 'ثبت سفارش سریع',
    description: 'باکس جذاب پایانی برای ثبت سفارش فوری و شروع پروژه',
    subtitleFa: 'باکس جذاب پایانی برای ثبت سفارش فوری و شروع پروژه',
    enabled: true,
    customTitle: 'آماده‌اید پروژه خود را آغاز کنید؟',
    customSubtitle: 'همین حالا سفارش خود را ثبت کنید تا در کمترین زمان در تلگرام پاسخگوی شما باشیم.',
    orderIndex: 10
  },
  {
    id: 'contact',
    key: 'contact',
    nameFa: 'اطلاعات تماس و لینک مستقیم تلگرام',
    titleFa: 'اطلاعات تماس و لینک مستقیم تلگرام',
    nameEn: 'Contact & Telegram Direct Link',
    titleEn: 'Contact & Telegram',
    category: 'ارتباطات',
    badgeText: 'پشتیبانی آنلاین',
    description: 'اطلاعات ارتباطی و دکمه اتصال مستقیم به آیدی پشتیبانی',
    subtitleFa: 'اطلاعات ارتباطی و دکمه اتصال مستقیم به آیدی پشتیبانی',
    enabled: true,
    customTitle: 'ارتباط مستقیم با تیم تکویکس',
    customSubtitle: 'ما مشتاقانه آماده شنیدن ایده‌ها و پاسخگویی به سوالات شما هستیم',
    orderIndex: 11
  }
];

export const DEFAULT_BLOG_COMMENTS: import('../types').BlogComment[] = [
  {
    id: 'cm-1',
    postId: 'post-ai-websites-2026',
    authorName: 'محمدرضا سلطانی',
    authorEmail: 'm.soltani@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    content: 'مقاله فوق‌العاده کاربردی و دقیقی بود! سرعت ساخت وب‌سایت با تکویکس واقعاً شگفت‌انگیزه، ما پروژه‌مون رو ظرف ۳ روز تحویل گرفتیم.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    likesCount: 14,
    rating: 5,
    status: 'approved'
  },
  {
    id: 'cm-2',
    postId: 'post-ai-video-generation',
    authorName: 'سارا نیک‌زاد',
    authorEmail: 'sara.nik@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'ویدیوهایی که با ابزارهای هوش مصنوعی تکویکس ساخته میشه کیفیت 4K واقعی داره و برای پیج اینستاگرام ما بازخورد بی‌نظیری داشت.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    likesCount: 9,
    rating: 5,
    status: 'approved'
  },
  {
    id: 'cm-3',
    postId: 'post-telegram-bot-ai-integration',
    authorName: 'امیرحسین عباسی',
    authorEmail: 'amir.abbasi@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    content: 'ربات تلگرامی که برامون ساختید مجهز به هوش مصنوعی پاسخگو و اتصال به وب‌هوک کار ما رو کاملاً اتوماتیک کرده. خسته نباشید به تیم تکویکس.',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    likesCount: 12,
    rating: 5,
    status: 'approved'
  }
];

export const DEFAULT_SITE_REVIEWS: import('../types').SiteReview[] = [
  {
    id: 'rev-1',
    authorName: 'مهندس نوید صادقی',
    authorRole: 'بنیان‌گذار صرافی کریپتو آریا',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorTelegram: '@navid_crypto',
    rating: 5,
    serviceCategory: 'طراحی وب‌سایت با هوش مصنوعی',
    comment: 'طراحی دارک و سرعت لود فوق‌العاده وب‌سایتی که تیم تکویکس برامون ساخت فراتر از انتظار بود. در تلگرام هم پشتیبانی بسیار محترمانه و سریعی دارند.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    verified: true,
    likesCount: 28
  },
  {
    id: 'rev-2',
    authorName: 'الهام فرهمند',
    authorRole: 'مدیر مارکتینگ برند بیوتی‌پلاس',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    authorTelegram: '@elham_marketing',
    rating: 5,
    serviceCategory: 'تولید ویدیو و تیزر 4K',
    comment: 'تیزر تبلیغاتی ۳۰ ثانیه‌ای که با سناریوی هوش مصنوعی تولید کردند فروش کمپین عید ما رو ۳ برابر کرد. کیفیت تصاویر و انیمیشن‌ها عالی بود.',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    verified: true,
    likesCount: 19
  },
  {
    id: 'rev-3',
    authorName: 'آرش کیانی',
    authorRole: 'مدیرعامل فروشگاه آنلاین بست‌بای',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    authorTelegram: '@arash_kiani',
    rating: 5,
    serviceCategory: 'ساخت ربات پیشرفته تلگرام',
    comment: 'ربات تلگرام فروشگاهی ما با قابلیت سفارش‌گیری خودکار و اتصال به درگاه پرداخت در کمتر از ۴ روز تحویل داده شد. به همه دوستان پیشنهاد می‌کنم.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    verified: true,
    likesCount: 34
  }
];


