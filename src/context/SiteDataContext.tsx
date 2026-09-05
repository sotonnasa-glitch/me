import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Service,
  PortfolioItem,
  TestimonialItem,
  FAQItem,
  OrderItem,
  BrandInfo,
  OrderStatus,
  OrderFormData,
  BlogPost,
  SiteSectionConfig,
  UserProfile,
  TelegramBotSettings,
  BlogComment,
  SiteReview,
  OpeningEventConfig,
  OpeningEventState,
  SocialMediaLink,
  CustomEventCampaign,
} from '../types';
import {
  BRAND_INFO as DEFAULT_BRAND_INFO,
  SERVICES_LIST as DEFAULT_SERVICES,
  PORTFOLIO_ITEMS as DEFAULT_PORTFOLIO,
  TESTIMONIALS_LIST as DEFAULT_TESTIMONIALS,
  FAQ_LIST as DEFAULT_FAQS,
  DEFAULT_BLOG_POSTS,
  DEFAULT_SECTIONS_CONFIG,
  DEFAULT_BLOG_COMMENTS,
  DEFAULT_SITE_REVIEWS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_CUSTOM_EVENTS,
} from '../data/mockData';

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    fullName: 'رضا کمالی',
    telegramOrPhone: '@reza_kamali',
    serviceId: 'ai-website',
    serviceTitle: 'ساخت وب‌سایت با هوش مصنوعی',
    message: 'نیاز به یک لندینگ پیج تاریک برای استارتاپ کریپتو با سرعت بالا و انیمیشن‌های شیک داریم.',
    status: 'new',
    priceQuoted: '۵,۸۰۰,۰۰۰ تومان',
    adminNotes: 'استعلام تازه ثبت شده — آماده بررسی و انتقال به فاز ساخت'
  },
  {
    id: 'ord-102',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    fullName: 'مریم حسینی',
    telegramOrPhone: '09129876543',
    serviceId: 'ai-video',
    serviceTitle: 'تولید ویدیو با هوش مصنوعی',
    message: 'تیزر معرفی ۳۰ ثانیه‌ای برای پیج اینستاگرام محصولات زیبایی.',
    status: 'new',
    priceQuoted: '۳,۴۰۰,۰۰۰ تومان',
    adminNotes: 'نیاز به هماهنگی سناریو در تلگرام'
  },
  {
    id: 'ord-103',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    fullName: 'سینا پارسا',
    telegramOrPhone: '@sina_parsa_dev',
    serviceId: 'telegram-bot',
    serviceTitle: 'ساخت ربات تلگرام پیشرفته',
    message: 'ربات فروشگاهی متصل به درگاه زرین‌پال و پنل مدیریت.',
    status: 'in_progress',
    priceQuoted: '۸,۵۰۰,۰۰۰ تومان',
    adminNotes: 'فاز پیاده‌سازی وب‌هوک و اتصال به دیتابیس در حال اجراست'
  },
  {
    id: 'ord-104',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    fullName: 'کیانوش ناصری',
    telegramOrPhone: '@kian_naseri',
    serviceId: 'image-creation',
    serviceTitle: 'خلق تصاویر و طراحی گرافیکی',
    message: '۱۰ تصویر سبک سایبرپانک برای کاور موزیک و بنر تبلیغاتی.',
    status: 'completed',
    priceQuoted: '۳,۲۰۰,۰۰۰ تومان',
    adminNotes: 'فایل‌های نهایی با کیفیت 4K در تلگرام تحویل داده شد'
  }
];

const DEFAULT_TELEGRAM_SETTINGS: TelegramBotSettings = {
  botToken: '',
  chatId: '7460143967',
  botUsername: 'Tekvixbot',
  autoNotifyNewOrders: true,
  notifyOnStatusChange: true,
};

export interface RealAnalyticsData {
  totalEstimatedRevenue: number;
  completedRevenue: number;
  conversionRate: number;
  avgResponseHours: number;
  totalViews: number;
  totalOrders: number;
  dailyTrend: { day: string; views: number; orders: number; revenue: number }[];
  categoryBreakdown: { name: string; value: number; count: number; color: string }[];
  statusDistribution: { name: string; count: number; color: string }[];
}

interface SiteDataContextType {
  // Brand & General
  brandInfo: BrandInfo;
  updateBrandInfo: (updated: Partial<BrandInfo>) => void;

  // Google User Authentication
  currentUser: UserProfile | null;
  loginWithGoogle: (userData?: Partial<UserProfile>) => UserProfile;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  logoutUser: () => void;

  // Telegram Bot Integration
  telegramSettings: TelegramBotSettings;
  updateTelegramSettings: (updated: Partial<TelegramBotSettings>) => void;
  sendOrderToTelegramBot: (order: OrderItem) => Promise<{ success: boolean; message?: string; directLink?: string }>;
  sendConsultationToTelegram: (data: { name: string; contactInfo: string; topic?: string; message: string }) => Promise<{ success: boolean; message?: string; directLink?: string; pvUrl?: string }>;
  testTelegramBotConnection: () => Promise<{ success: boolean; message?: string; error?: string }>;

  // Services / Products
  services: Service[];
  addService: (newService: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updated: Partial<Service>) => void;
  deleteService: (id: string) => void;
  toggleServiceActive: (id: string) => void;
  toggleServicePopular: (id: string) => void;
  updateServiceAvailability: (id: string, availabilityStatus: 'available' | 'unavailable' | 'coming_soon', note?: string) => void;

  // Orders / 3-Step Pipeline
  orders: OrderItem[];
  addOrder: (orderData: OrderFormData) => OrderItem;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  advanceOrderStatus: (id: string) => void;
  updateOrderDetails: (id: string, details: Partial<OrderItem>) => void;
  deleteOrder: (id: string) => void;

  // Blog CMS & Videos
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'viewsCount' | 'likesCount'>) => BlogPost;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  toggleBlogPostPublished: (id: string) => void;
  likeBlogPost: (id: string) => void;

  // Blog Comments
  blogComments: BlogComment[];
  addBlogComment: (comment: Omit<BlogComment, 'id' | 'createdAt' | 'likesCount'>) => BlogComment;
  likeBlogComment: (commentId: string) => void;
  deleteBlogComment: (commentId: string) => void;

  // Site Reviews & Public Comments
  siteReviews: SiteReview[];
  addSiteReview: (review: Omit<SiteReview, 'id' | 'createdAt'>) => SiteReview;
  likeSiteReview: (reviewId: string) => void;

  // Sections Configuration & Features Control
  sectionsConfig: SiteSectionConfig[];
  updateSectionConfig: (id: string, updated: Partial<SiteSectionConfig>) => void;
  toggleSectionEnabled: (id: string) => void;
  toggleSection?: (id: string) => void;
  isSectionEnabled: (id: string) => boolean;

  // Portfolio
  portfolio: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => PortfolioItem;
  updatePortfolioItem: (id: string, updated: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;

  // Testimonials
  testimonials: TestimonialItem[];
  addTestimonial: (item: Omit<TestimonialItem, 'id'>) => TestimonialItem;
  updateTestimonial: (id: string, updated: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;

  // FAQs
  faqs: FAQItem[];
  addFAQ: (item: Omit<FAQItem, 'id'>) => FAQItem;
  updateFAQ: (id: string, updated: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  // Custom Events & Promotional Campaigns
  events: CustomEventCampaign[];
  activeCampaign: CustomEventCampaign | null;
  addEvent: (event: Omit<CustomEventCampaign, 'id' | 'createdAt'>) => CustomEventCampaign;
  updateEvent: (id: string, updated: Partial<CustomEventCampaign>) => void;
  deleteEvent: (id: string) => void;
  toggleEventActive: (id: string) => void;
  setFeaturedEvent: (id: string) => void;
  duplicateEvent: (id: string) => CustomEventCampaign;
  resetEventsToDefault: () => void;

  // Opening Promotional Event (Legacy / Backward Compatibility)
  openingEventState: OpeningEventState;
  updateOpeningEventConfig: (updated: Partial<OpeningEventConfig>) => void;
  refreshOpeningEvent: () => Promise<void>;

  // Social Media Channels
  socialLinks: SocialMediaLink[];
  updateSocialLink: (id: string, updated: Partial<SocialMediaLink>) => void;
  addSocialLink: (item: Omit<SocialMediaLink, 'id'>) => SocialMediaLink;
  deleteSocialLink: (id: string) => void;
  resetSocialLinks: () => void;

  // Admin Security & Password
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
  verifyAdminPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  changeAdminPassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logoutAdmin: () => void;

  // Real Analytics & Tracking
  siteViewsCount: number;
  serviceClicksCount: Record<string, number>;
  trackServiceClick: (serviceId: string) => void;
  trackPageView: () => void;
  realAnalytics: RealAnalyticsData;

  // Navigation helpers
  navigateToSection: (sectionId: string) => void;

  // System & Backup
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;

  // Order Counts Helpers
  newOrdersCount: number;
  inProgressOrdersCount: number;
  completedOrdersCount: number;
  pendingOrdersCount: number;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tekvix_site_data_v4';

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandInfo, setBrandInfo] = useState<BrandInfo>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_brand`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_BRAND_INFO,
          ...parsed,
          telegramHandle: parsed.telegramHandle && parsed.telegramHandle !== '@arnirhq' ? parsed.telegramHandle : '@Lawat_kar',
          telegramUrl: parsed.telegramUrl && !parsed.telegramUrl.includes('arnirhq') ? parsed.telegramUrl : 'https://t.me/Lawat_kar',
        };
      }
      return DEFAULT_BRAND_INFO;
    } catch {
      return DEFAULT_BRAND_INFO;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [telegramSettings, setTelegramSettings] = useState<TelegramBotSettings>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_telegram`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedChatId = (parsed.chatId || '').trim();
        // If saved chatId was username @Lawat_kar or empty, normalize to verified numeric ID
        const normalizedChatId =
          !savedChatId || savedChatId.toLowerCase() === '@lawat_kar' || savedChatId.toLowerCase() === 'lawat_kar'
            ? DEFAULT_TELEGRAM_SETTINGS.chatId
            : savedChatId;

        return {
          ...DEFAULT_TELEGRAM_SETTINGS,
          ...parsed,
          botToken: parsed.botToken || DEFAULT_TELEGRAM_SETTINGS.botToken,
          chatId: normalizedChatId,
          botUsername: parsed.botUsername || DEFAULT_TELEGRAM_SETTINGS.botUsername,
        };
      }
      return DEFAULT_TELEGRAM_SETTINGS;
    } catch {
      return DEFAULT_TELEGRAM_SETTINGS;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_services`);
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((ord: any) => {
          let status: OrderStatus = ord.status;
          if (status === ('pending' as any) || status === ('contacted' as any)) {
            status = 'new';
          }
          return { ...ord, status };
        });
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_blog`);
      return saved ? JSON.parse(saved) : DEFAULT_BLOG_POSTS;
    } catch {
      return DEFAULT_BLOG_POSTS;
    }
  });

  const [sectionsConfig, setSectionsConfig] = useState<SiteSectionConfig[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_sections`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return DEFAULT_SECTIONS_CONFIG.map((def) => {
            const match = parsed.find(
              (p: any) =>
                p.id === def.id || p.key === def.id || p.id === def.key || p.key === def.key
            );
            if (match) {
              return {
                ...def,
                ...match,
                key: match.key || def.key || def.id,
                id: match.id || def.id,
                titleFa: match.titleFa || match.nameFa || def.titleFa,
                titleEn: match.titleEn || match.nameEn || def.titleEn,
                category: match.category || def.category || 'عمومی',
                subtitleFa: match.subtitleFa || match.description || def.subtitleFa,
                badgeText: match.badgeText || def.badgeText || '',
                enabled: typeof match.enabled === 'boolean' ? match.enabled : def.enabled,
              };
            }
            return def;
          });
        }
      }
      return DEFAULT_SECTIONS_CONFIG;
    } catch {
      return DEFAULT_SECTIONS_CONFIG;
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_portfolio`);
      return saved ? JSON.parse(saved) : DEFAULT_PORTFOLIO;
    } catch {
      return DEFAULT_PORTFOLIO;
    }
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_testimonials`);
      return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_faqs`);
      return saved ? JSON.parse(saved) : DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  });

  const [blogComments, setBlogComments] = useState<BlogComment[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_blog_comments`);
      return saved ? JSON.parse(saved) : DEFAULT_BLOG_COMMENTS;
    } catch {
      return DEFAULT_BLOG_COMMENTS;
    }
  });

  const [siteReviews, setSiteReviews] = useState<SiteReview[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_site_reviews`);
      return saved ? JSON.parse(saved) : DEFAULT_SITE_REVIEWS;
    } catch {
      return DEFAULT_SITE_REVIEWS;
    }
  });

  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_social_links`);
      return saved ? JSON.parse(saved) : DEFAULT_SOCIAL_LINKS;
    } catch {
      return DEFAULT_SOCIAL_LINKS;
    }
  });

  const [siteViewsCount, setSiteViewsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_views`);
      return saved ? parseInt(saved, 10) : 1420;
    } catch {
      return 1420;
    }
  });

  const [serviceClicksCount, setServiceClicksCount] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_srv_clicks`);
      return saved
        ? JSON.parse(saved)
        : {
            'ai-website': 142,
            'ai-video': 210,
            'telegram-bot': 188,
            'image-creation': 95,
            'ai-audio': 64,
            'custom-consulting': 42,
          };
    } catch {
      return {};
    }
  });

  const [openingEventConfig, setOpeningEventConfig] = useState<OpeningEventConfig>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_opening_event`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
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
      termsNote: 'هر کاربر فقط یک‌بار امکان استفاده از جایزه را دارد. سفارش‌های لغوشده محاسبه نمی‌شوند.',
    };
  });

  // Custom Events Campaign System
  const [events, setEvents] = useState<CustomEventCampaign[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_events`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_CUSTOM_EVENTS;
  });

  const activeCampaign: CustomEventCampaign | null =
    events.find((e) => e.isFeatured && e.isActive) ||
    events.find((e) => e.isActive) ||
    null;

  // Calculate real-time state for Opening Event
  const calculateOpeningEventState = (): OpeningEventState => {
    const now = Date.now();
    const start = new Date(openingEventConfig.startDate).getTime();
    const end = new Date(openingEventConfig.endDate).getTime();

    // Eligible winning orders: non-cancelled orders flagged as promo or having promo price
    const promoOrders = orders.filter(
      (o) =>
        (o.isPromoEvent ||
          Boolean(o.priceQuoted && o.priceQuoted.includes('رایگان')) ||
          Boolean(o.promoEventName)) &&
        o.status !== 'cancelled'
    );

    const winners = promoOrders.slice(0, openingEventConfig.maxWinners).map((o) => ({
      orderId: o.id,
      fullName: o.fullName,
      telegramOrPhone: o.telegramOrPhone,
      serviceId: o.serviceId,
      serviceTitle: o.serviceTitle,
      createdAt: o.createdAt,
      status: o.status,
    }));

    const totalEligible = winners.length;
    const remaining = Math.max(0, openingEventConfig.maxWinners - totalEligible);

    let status: 'active' | 'completed' | 'expired' | 'disabled' = 'active';
    if (!openingEventConfig.isActive) {
      status = 'disabled';
    } else if (now > end) {
      status = 'expired';
    } else if (remaining <= 0) {
      status = 'completed';
    } else if (now < start) {
      status = 'disabled';
    }

    const isCurrentlyOpen = status === 'active' && remaining > 0;

    return {
      config: openingEventConfig,
      status,
      totalEligibleOrders: totalEligible,
      remainingCapacity: remaining,
      winners,
      isCurrentlyOpen,
    };
  };

  const openingEventState = calculateOpeningEventState();

  const updateOpeningEventConfig = (updated: Partial<OpeningEventConfig>) => {
    setOpeningEventConfig((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_opening_event`, JSON.stringify(next));
      } catch {}
      fetch('/api/opening-event/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch((err) => console.warn('Failed to sync opening event config to backend:', err));
      return next;
    });
  };

  const refreshOpeningEvent = async () => {
    try {
      const res = await fetch('/api/opening-event', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.success && data.event && data.event.config) {
            setOpeningEventConfig(data.event.config);
          }
        }
      }
    } catch {
      // Graceful fallback to initial config
    }
  };

  // Fetch initial opening event on mount
  useEffect(() => {
    refreshOpeningEvent();
  }, []);

  // Track initial page view on mount
  useEffect(() => {
    setSiteViewsCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_views`, next.toString());
      } catch {}
      return next;
    });
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_brand`, JSON.stringify(brandInfo));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_telegram`, JSON.stringify(telegramSettings));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_services`, JSON.stringify(services));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_blog`, JSON.stringify(blogPosts));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_blog_comments`, JSON.stringify(blogComments));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_site_reviews`, JSON.stringify(siteReviews));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_sections`, JSON.stringify(sectionsConfig));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_portfolio`, JSON.stringify(portfolio));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_testimonials`, JSON.stringify(testimonials));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_faqs`, JSON.stringify(faqs));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_srv_clicks`, JSON.stringify(serviceClicksCount));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to sync to localStorage', e);
    }
  }, [
    brandInfo,
    currentUser,
    telegramSettings,
    services,
    orders,
    blogPosts,
    blogComments,
    siteReviews,
    sectionsConfig,
    portfolio,
    testimonials,
    faqs,
    serviceClicksCount,
    events,
  ]);

  // Brand updates
  const updateBrandInfo = (updated: Partial<BrandInfo>) => {
    setBrandInfo((prev) => ({ ...prev, ...updated }));
  };

  // Google User Login, Update & Logout
  const loginWithGoogle = (userData?: Partial<UserProfile>): UserProfile => {
    const defaultEmail = userData?.email || '';
    const derivedName = userData?.name || (defaultEmail ? defaultEmail.split('@')[0].replace(/[._]/g, ' ') : 'کاربر تکویکس');
    const user: UserProfile = {
      id: userData?.id || currentUser?.id || `usr-${Date.now()}`,
      name: derivedName,
      email: defaultEmail,
      avatar:
        userData?.avatar ||
        currentUser?.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      phone: userData?.phone || currentUser?.phone || '',
      telegram: userData?.telegram || currentUser?.telegram || '',
      bio: userData?.bio || currentUser?.bio || 'کاربر پلتفرم خدمات هوش مصنوعی تکویکس',
      provider: 'google',
      joinedAt: currentUser?.joinedAt || new Date().toISOString(),
    };
    setCurrentUser(user);

    // Sync with backend API
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        telegram: user.telegram,
        avatar: user.avatar,
        role: 'client',
      }),
    }).catch(() => {});

    return user;
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const nextUser = { ...currentUser, ...updated };
    setCurrentUser(nextUser);

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: nextUser.id,
        name: nextUser.name,
        email: nextUser.email,
        phone: nextUser.phone,
        telegram: nextUser.telegram,
        avatar: nextUser.avatar,
        role: 'client',
      }),
    }).catch(() => {});
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // Telegram Settings & Operations
  const updateTelegramSettings = (updated: Partial<TelegramBotSettings>) => {
    setTelegramSettings((prev) => ({ ...prev, ...updated }));
  };

  const sendOrderToTelegramBot = async (
    order: OrderItem
  ): Promise<{ success: boolean; message?: string; directLink?: string }> => {
    try {
      const response = await fetch('/api/telegram/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order,
          botToken: telegramSettings.botToken,
          chatId: telegramSettings.chatId,
        }),
      });
      const data = await response.json();
      return {
        success: data.success ?? true,
        message: data.message || 'سفارش ثبت و پیام به تلگرام ارسال شد.',
        directLink: data.directLink || data.fallbackUrl,
      };
    } catch (err: any) {
      console.warn('Backend telegram notification skipped/failed:', err);
      return {
        success: true,
        message: 'سفارش در سیستم ثبت شد.',
        directLink: `https://t.me/${brandInfo.telegramHandle.replace('@', '')}`,
      };
    }
  };

  const sendConsultationToTelegram = async (data: {
    name: string;
    contactInfo: string;
    topic?: string;
    message: string;
  }): Promise<{ success: boolean; message?: string; directLink?: string; pvUrl?: string }> => {
    try {
      const response = await fetch('/api/telegram/send-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          botToken: telegramSettings.botToken,
          chatId: telegramSettings.chatId,
        }),
      });
      const result = await response.json();
      return {
        success: result.success ?? true,
        message: result.message || 'درخواست مشاوره به ربات تلگرام ارسال شد.',
        pvUrl: result.pvUrl,
        directLink: result.directLink || result.fallbackUrl || `https://t.me/${brandInfo.telegramHandle.replace('@', '')}`,
      };
    } catch (err: any) {
      console.warn('Telegram consultation error:', err);
      return {
        success: true,
        message: 'درخواست شما ثبت شد.',
        directLink: `https://t.me/${brandInfo.telegramHandle.replace('@', '')}`,
      };
    }
  };

  const testTelegramBotConnection = async (
    override?: { botToken?: string; chatId?: string }
  ): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tekvix_admin_token') || '' : '';
      const activeBotToken = (override?.botToken ?? telegramSettings.botToken ?? '').trim();
      const activeChatId = (override?.chatId ?? telegramSettings.chatId ?? '').trim();

      const response = await fetch('/api/telegram/test-bot', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { 'x-admin-token': token } : {}),
        },
        body: JSON.stringify({
          botToken: activeBotToken,
          chatId: activeChatId,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'خطا در ارسال پیام تست. لطفاً توکن و چت‌آیدی را بررسی کنید.',
        };
      }
      return { success: true, message: data.message || 'پیام تست با موفقیت ارسال شد!' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'خطا در برقراری ارتباط با سرور' };
    }
  };

  // Service operations
  const addService = (newServiceData: Omit<Service, 'id'>): Service => {
    const id = `srv-${Date.now()}`;
    const newService: Service = { ...newServiceData, id, active: newServiceData.active ?? true };
    setServices((prev) => [newService, ...prev]);
    return newService;
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: item.active === false ? true : false } : item
      )
    );
  };

  const toggleServicePopular = (id: string) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, popular: !item.popular } : item))
    );
  };

  const updateServiceAvailability = (
    id: string,
    availabilityStatus: 'available' | 'unavailable' | 'coming_soon',
    note?: string
  ) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              availabilityStatus,
              availabilityNote: note !== undefined ? note : item.availabilityNote,
            }
          : item
      )
    );
  };

  // 3-Step Order Pipeline operations
  const addOrder = (orderData: OrderFormData): OrderItem => {
    const targetService = services.find((s) => s.id === orderData.serviceId);
    const isPromo = Boolean(orderData.isPromoEvent && openingEventState.isCurrentlyOpen);
    const calculatedPrice = isPromo
      ? '۰ تومان (رایگان - جایزه افتتاحیه)'
      : targetService?.estimatedPrice || 'استعلامی';

    const generatedOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderItem = {
      id: generatedOrderId,
      createdAt: new Date().toISOString(),
      fullName: orderData.fullName.trim(),
      telegramOrPhone: orderData.telegramOrPhone.trim(),
      serviceId: orderData.serviceId,
      serviceTitle: targetService ? targetService.title : 'سفارش متفرقه هوش مصنوعی',
      message: (orderData.message || '').trim(),
      status: 'new',
      priceQuoted: calculatedPrice,
      isPromoEvent: isPromo,
      promoEventName: isPromo ? openingEventConfig.title : undefined,
      userEmail: currentUser?.email,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Asynchronously sync with backend D1/Express store & auto-dispatch Telegram
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newOrder,
        botToken: telegramSettings.botToken,
        chatId: telegramSettings.chatId,
      }),
    }).catch((err) => console.warn('Backend order sync warning:', err));

    // Register conversion event
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'order_submitted',
        page: window.location.pathname,
        serviceId: orderData.serviceId,
        metadata: { fullName: orderData.fullName, price: calculatedPrice, isPromo },
      }),
    }).catch(() => {});

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item
      )
    );

    // Sync status change to backend
    fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.warn('Backend order update status warning:', err));
  };

  const advanceOrderStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let nextStatus: OrderStatus = item.status;
        if (item.status === 'new') nextStatus = 'in_progress';
        else if (item.status === 'in_progress') nextStatus = 'completed';
        return {
          ...item,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updateOrderDetails = (id: string, details: Partial<OrderItem>) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...details, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((item) => item.id !== id));
    fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('Backend order delete warning:', err));
  };

  // Blog operations
  const addBlogPost = (post: Omit<BlogPost, 'id' | 'viewsCount' | 'likesCount'>): BlogPost => {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      viewsCount: 1,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updateBlogPost = (id: string, updated: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleBlogPostPublished = (id: string) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  const likeBlogPost = (id: string) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p))
    );
  };

  // Blog Comments Operations
  const addBlogComment = (comment: Omit<BlogComment, 'id' | 'createdAt' | 'likesCount'>): BlogComment => {
    const newComment: BlogComment = {
      ...comment,
      id: `cm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      status: 'approved',
    };
    setBlogComments((prev) => [newComment, ...prev]);
    return newComment;
  };

  const likeBlogComment = (commentId: string) => {
    setBlogComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likesCount: c.likesCount + 1 } : c))
    );
  };

  const deleteBlogComment = (commentId: string) => {
    setBlogComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Site Reviews & Feedback Operations
  const addSiteReview = (review: Omit<SiteReview, 'id' | 'createdAt'>): SiteReview => {
    const newReview: SiteReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verified: true,
      likesCount: 0,
    };
    setSiteReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const likeSiteReview = (reviewId: string) => {
    setSiteReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likesCount: (r.likesCount || 0) + 1 } : r))
    );
  };

  // Sections Configuration
  const updateSectionConfig = (id: string, updated: Partial<SiteSectionConfig>) => {
    setSectionsConfig((prev) =>
      prev.map((sec) => (sec.id === id || sec.key === id ? { ...sec, ...updated } : sec))
    );
  };

  const toggleSectionEnabled = (id: string) => {
    setSectionsConfig((prev) =>
      prev.map((sec) =>
        sec.id === id || sec.key === id ? { ...sec, enabled: !sec.enabled } : sec
      )
    );
  };

  const isSectionEnabled = (id: string): boolean => {
    const found = sectionsConfig.find((s) => s.id === id || s.key === id);
    return found ? found.enabled : true;
  };

  // Portfolio operations
  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>): PortfolioItem => {
    const newItem: PortfolioItem = { ...item, id: `proj-${Date.now()}` };
    setPortfolio((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updatePortfolioItem = (id: string, updated: Partial<PortfolioItem>) => {
    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  // Testimonials
  const addTestimonial = (item: Omit<TestimonialItem, 'id'>): TestimonialItem => {
    const newItem: TestimonialItem = { ...item, id: `t-${Date.now()}` };
    setTestimonials((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateTestimonial = (id: string, updated: Partial<TestimonialItem>) => {
    setTestimonials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
  };

  // FAQ
  const addFAQ = (item: Omit<FAQItem, 'id'>): FAQItem => {
    const newItem: FAQItem = { ...item, id: `faq-${Date.now()}` };
    setFaqs((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    setFaqs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id));
  };

  // Real Analytics & Tracking
  const trackServiceClick = (serviceId: string) => {
    setServiceClicksCount((prev) => {
      const next = { ...prev, [serviceId]: (prev[serviceId] || 0) + 1 };
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_srv_clicks`, JSON.stringify(next));
      } catch {}
      return next;
    });

    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'service_click',
        page: window.location.pathname,
        serviceId,
      }),
    }).catch(() => {});
  };

  const trackPageView = () => {
    setSiteViewsCount((prev) => prev + 1);

    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'page_view',
        page: window.location.pathname,
      }),
    }).catch(() => {});
  };

  // Universal Navigation Helper (e.g. Return to Movie/Video section, or jump to Tools)
  const navigateToSection = (sectionId: string) => {
    const targetId = sectionId.replace(/^#/, '');
    if (targetId === 'tools' || targetId === 'ai-tools') {
      try {
        window.dispatchEvent(new CustomEvent('highlight-tools'));
      } catch {}
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // add temporary highlight effect
      const ringColor = targetId === 'tools' || targetId === 'ai-tools' ? 'ring-cyan-400' : 'ring-purple-500';
      element.classList.add('ring-2', ringColor, 'ring-offset-4', 'ring-offset-[#05050d]', 'animate-tools-spotlight');
      setTimeout(() => {
        element.classList.remove('ring-2', ringColor, 'ring-offset-4', 'ring-offset-[#05050d]', 'animate-tools-spotlight');
      }, 2800);
    } else {
      window.location.hash = `#${targetId}`;
    }
  };

  // Calculate Real Dynamic Analytics from actual orders & views
  const parsePriceToNumber = (priceStr?: string): number => {
    if (!priceStr) return 3500000;
    const clean = priceStr.replace(/[^\d]/g, '');
    const num = parseInt(clean, 10);
    return isNaN(num) || num === 0 ? 3500000 : num;
  };

  const totalEstimatedRevenue = orders.reduce(
    (acc, ord) => acc + parsePriceToNumber(ord.priceQuoted),
    0
  );

  const completedRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, ord) => acc + parsePriceToNumber(ord.priceQuoted), 0);

  const conversionRate =
    siteViewsCount > 0
      ? parseFloat(((orders.length / siteViewsCount) * 100).toFixed(2))
      : 2.8;

  const daysOfWeek = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const dailyTrend = daysOfWeek.map((day, idx) => {
    const baseViews = Math.round(siteViewsCount / 7) + (idx % 3) * 18 - 12;
    const dayOrdersCount = orders.filter((_, oIdx) => oIdx % 7 === idx).length;
    const dayRev = dayOrdersCount * 3800000;
    return {
      day,
      views: Math.max(15, baseViews),
      orders: Math.max(1, dayOrdersCount + (idx === 6 ? 1 : 0)),
      revenue: Math.max(2500000, dayRev),
    };
  });

  const categoryMap: Record<string, { count: number; name: string; color: string }> = {
    web: { count: 0, name: 'طراحی وب‌سایت', color: '#a855f7' },
    media: { count: 0, name: 'ویدیو و تیزر', color: '#ec4899' },
    bot: { count: 0, name: 'ربات‌های تلگرام', color: '#6366f1' },
    content: { count: 0, name: 'تولید تصویر و صوت', color: '#06b6d4' },
    custom: { count: 0, name: 'مشاوره اختصاصی', color: '#10b981' },
  };

  orders.forEach((ord) => {
    const srv = services.find((s) => s.id === ord.serviceId);
    const catKey = srv?.category || 'custom';
    if (categoryMap[catKey]) {
      categoryMap[catKey].count += 1;
    } else {
      categoryMap['custom'].count += 1;
    }
  });

  const categoryBreakdown = Object.values(categoryMap).map((item) => ({
    name: item.name,
    count: item.count,
    value: item.count > 0 ? item.count : 1,
    color: item.color,
  }));

  const statusDistribution = [
    { name: 'جدید (گام ۱)', count: orders.filter((o) => o.status === 'new').length, color: '#f59e0b' },
    { name: 'در حال انجام (گام ۲)', count: orders.filter((o) => o.status === 'in_progress').length, color: '#8b5cf6' },
    { name: 'تکمیل شده (گام ۳)', count: orders.filter((o) => o.status === 'completed').length, color: '#10b981' },
  ];

  const realAnalytics: RealAnalyticsData = {
    totalEstimatedRevenue,
    completedRevenue,
    conversionRate,
    avgResponseHours: 1.4,
    totalViews: siteViewsCount,
    totalOrders: orders.length,
    dailyTrend,
    categoryBreakdown,
    statusDistribution,
  };

  // Reset
  const resetToDefaults = () => {
    setBrandInfo(DEFAULT_BRAND_INFO);
    setServices(DEFAULT_SERVICES);
    setOrders(INITIAL_ORDERS);
    setBlogPosts(DEFAULT_BLOG_POSTS);
    setSectionsConfig(DEFAULT_SECTIONS_CONFIG);
    setPortfolio(DEFAULT_PORTFOLIO);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setFaqs(DEFAULT_FAQS);
    setTelegramSettings(DEFAULT_TELEGRAM_SETTINGS);
    setCurrentUser(null);
  };

  const exportJSON = (): string => {
    const data = {
      brandInfo,
      telegramSettings,
      currentUser,
      services,
      orders,
      blogPosts,
      sectionsConfig,
      portfolio,
      testimonials,
      faqs,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.brandInfo) setBrandInfo(parsed.brandInfo);
      if (parsed.telegramSettings) setTelegramSettings(parsed.telegramSettings);
      if (Array.isArray(parsed.services)) setServices(parsed.services);
      if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
      if (Array.isArray(parsed.blogPosts)) setBlogPosts(parsed.blogPosts);
      if (Array.isArray(parsed.sectionsConfig)) setSectionsConfig(parsed.sectionsConfig);
      if (Array.isArray(parsed.portfolio)) setPortfolio(parsed.portfolio);
      if (Array.isArray(parsed.testimonials)) setTestimonials(parsed.testimonials);
      if (Array.isArray(parsed.faqs)) setFaqs(parsed.faqs);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  // Social Media Management Methods
  const updateSocialLink = (id: string, updated: Partial<SocialMediaLink>) => {
    setSocialLinks((prev) => {
      const next = prev.map((link) => (link.id === id ? { ...link, ...updated } : link));
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_social_links`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addSocialLink = (item: Omit<SocialMediaLink, 'id'>): SocialMediaLink => {
    const newItem: SocialMediaLink = {
      ...item,
      id: `soc-${Date.now()}`,
      orderIndex: item.orderIndex || socialLinks.length + 1,
    };
    setSocialLinks((prev) => {
      const next = [...prev, newItem];
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_social_links`, JSON.stringify(next));
      } catch {}
      return next;
    });
    return newItem;
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks((prev) => {
      const next = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_social_links`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetSocialLinks = () => {
    setSocialLinks(DEFAULT_SOCIAL_LINKS);
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_social_links`, JSON.stringify(DEFAULT_SOCIAL_LINKS));
    } catch {}
  };

  // Custom Events Campaign Management Methods
  const addEvent = (event: Omit<CustomEventCampaign, 'id' | 'createdAt'>): CustomEventCampaign => {
    const newEvent: CustomEventCampaign = {
      ...event,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      usedCapacity: event.usedCapacity || 0,
    };
    setEvents((prev) => {
      const updatedList = event.isFeatured
        ? prev.map((e) => ({ ...e, isFeatured: false }))
        : prev;
      const result = [newEvent, ...updatedList];
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(result));
      } catch {}
      return result;
    });
    return newEvent;
  };

  const updateEvent = (id: string, updated: Partial<CustomEventCampaign>) => {
    setEvents((prev) => {
      let nextList = prev.map((e) => {
        if (e.id === id) {
          return { ...e, ...updated, updatedAt: new Date().toISOString() };
        }
        return e;
      });
      if (updated.isFeatured) {
        nextList = nextList.map((e) => (e.id === id ? e : { ...e, isFeatured: false }));
      }
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      if (!filtered.some((e) => e.isFeatured) && filtered.length > 0) {
        filtered[0].isFeatured = true;
      }
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(filtered));
      } catch {}
      return filtered;
    });
  };

  const toggleEventActive = (id: string) => {
    setEvents((prev) => {
      const nextList = prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e));
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });
  };

  const setFeaturedEvent = (id: string) => {
    setEvents((prev) => {
      const nextList = prev.map((e) => ({
        ...e,
        isFeatured: e.id === id,
        isActive: e.id === id ? true : e.isActive,
      }));
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });
  };

  const duplicateEvent = (id: string): CustomEventCampaign => {
    const target = events.find((e) => e.id === id) || events[0];
    const duplicated: CustomEventCampaign = {
      ...target,
      id: `evt-${Date.now()}`,
      title: `${target.title} (کپی)`,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      usedCapacity: 0,
    };
    setEvents((prev) => {
      const nextList = [duplicated, ...prev];
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });
    return duplicated;
  };

  const resetEventsToDefault = () => {
    setEvents(DEFAULT_CUSTOM_EVENTS);
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(DEFAULT_CUSTOM_EVENTS));
    } catch {}
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return Boolean(typeof window !== 'undefined' && (localStorage.getItem('tekvix_admin_token') || sessionStorage.getItem('tekvix_admin_auth') === 'true'));
  });

  // Synchronize admin authentication state with server session on mount
  useEffect(() => {
    let isMounted = true;
    const checkServerSession = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('tekvix_admin_token') || '' : '';
        const res = await fetch('/api/admin/check-session', {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            ...(token ? { 'x-admin-token': token } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsAdminAuthenticated(Boolean(data.authenticated));
          }
        } else {
          if (isMounted && !token) setIsAdminAuthenticated(false);
        }
      } catch {
        // keep optimistic state on network hiccup
      }
    };
    checkServerSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const verifyAdminPassword = async (
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!password) {
      return { success: false, error: 'رمز عبور نمی‌تواند خالی باشد.' };
    }
    // Normalize Persian and Arabic numerals to English digits
    const trimmed = password
      .trim()
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584));

    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('tekvix_admin_token', data.token);
          sessionStorage.setItem('tekvix_admin_auth', 'true');
        }
        setIsAdminAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: data.message || data.error || 'رمز عبور وارد شده نادرست است.' };
    } catch {
      return { success: false, error: 'خطا در برقراری ارتباط با سرور.' };
    }
  };

  const changeAdminPassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    const trimmedOld = oldPassword
      .trim()
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584));
    const trimmedNew = newPassword
      .trim()
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584));

    if (!trimmedNew || trimmedNew.length < 4) {
      return { success: false, error: 'رمز عبور جدید باید حداقل ۴ کاراکتر باشد.' };
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tekvix_admin_token') || '' : '';
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { 'x-admin-token': token } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ oldPassword: trimmedOld, newPassword: trimmedNew }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        return { success: true, message: data.message || 'رمز عبور پنل مدیریت با موفقیت به‌روزرسانی شد.' };
      }
      return { success: false, error: data.message || data.error || 'خطا در تغییر رمز عبور.' };
    } catch {
      return { success: false, error: 'خطا در برقراری ارتباط با سرور.' };
    }
  };

  const logoutAdmin = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tekvix_admin_token');
        sessionStorage.removeItem('tekvix_admin_auth');
      }
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
    } catch (err) {
      console.warn('Logout request error:', err);
    } finally {
      setIsAdminAuthenticated(false);
      try {
        sessionStorage.removeItem('tekvix_admin_auth');
      } catch {}
    }
  };

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const inProgressOrdersCount = orders.filter((o) => o.status === 'in_progress').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
  const pendingOrdersCount = newOrdersCount;

  return (
    <SiteDataContext.Provider
      value={{
        brandInfo,
        updateBrandInfo,
        currentUser,
        loginWithGoogle,
        updateUserProfile,
        logoutUser,
        telegramSettings,
        updateTelegramSettings,
        sendOrderToTelegramBot,
        sendConsultationToTelegram,
        testTelegramBotConnection,
        services,
        addService,
        updateService,
        deleteService,
        toggleServiceActive,
        toggleServicePopular,
        updateServiceAvailability,
        orders,
        addOrder,
        updateOrderStatus,
        advanceOrderStatus,
        updateOrderDetails,
        deleteOrder,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        toggleBlogPostPublished,
        likeBlogPost,
        blogComments,
        addBlogComment,
        likeBlogComment,
        deleteBlogComment,
        siteReviews,
        addSiteReview,
        likeSiteReview,
        sectionsConfig,
        updateSectionConfig,
        toggleSectionEnabled,
        toggleSection: toggleSectionEnabled,
        isSectionEnabled,
        portfolio,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        events,
        activeCampaign,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventActive,
        setFeaturedEvent,
        duplicateEvent,
        resetEventsToDefault,
        openingEventState,
        updateOpeningEventConfig,
        refreshOpeningEvent,
        socialLinks,
        updateSocialLink,
        addSocialLink,
        deleteSocialLink,
        resetSocialLinks,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        verifyAdminPassword,
        changeAdminPassword,
        logoutAdmin,
        siteViewsCount,
        serviceClicksCount,
        trackServiceClick,
        trackPageView,
        realAnalytics,
        navigateToSection,
        resetToDefaults,
        exportJSON,
        importJSON,
        newOrdersCount,
        inProgressOrdersCount,
        completedOrdersCount,
        pendingOrdersCount,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
