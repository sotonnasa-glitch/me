export interface Service {
  id: string;
  title: string;
  category: 'web' | 'media' | 'content' | 'bot' | 'custom';
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  badge?: string;
  popular?: boolean;
  active?: boolean;
  availabilityStatus?: 'available' | 'unavailable' | 'coming_soon';
  availabilityNote?: string;
  deliverables: string[];
  estimatedPrice?: string;
  deliveryDays?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  serviceCategory: string;
  badge: string;
  gradientTheme: string;
  stats: {
    label: string;
    value: string;
  }[];
  tags: string[];
}

export interface FeatureTab {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  visibilityMetric: string;
  visibilityGrowth: string;
  chartData: number[];
  activeItems: {
    name: string;
    status: string;
    score: string;
  }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'process' | 'support';
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarSeed: string;
  verified: boolean;
  rating?: number;
}

// 3-Step Order Workflow: 'new' -> 'in_progress' -> 'completed' (plus 'cancelled')
export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  createdAt: string;
  fullName: string;
  telegramOrPhone: string;
  serviceId: string;
  serviceTitle: string;
  message?: string;
  status: OrderStatus;
  adminNotes?: string;
  priceQuoted?: string;
  updatedAt?: string;
  isPromoEvent?: boolean;
  promoEventName?: string;
  userEmail?: string;
}

export interface OrderFormData {
  fullName: string;
  telegramOrPhone: string;
  serviceId: string;
  message: string;
  isPromoEvent?: boolean;
  promoEventName?: string;
}

export interface OpeningEventConfig {
  isActive: boolean;
  title: string;
  subtitle: string;
  badgeText: string;
  highlightText: string;
  description: string;
  startDate: string; // ISO format
  endDate: string; // ISO format
  maxWinners: number;
  termsNote?: string;
}

export interface OpeningEventWinner {
  orderId: string;
  fullName: string;
  telegramOrPhone: string;
  serviceId: string;
  serviceTitle: string;
  createdAt: string;
  status: OrderStatus;
}

export interface OpeningEventState {
  config: OpeningEventConfig;
  status: 'active' | 'completed' | 'expired' | 'disabled';
  totalEligibleOrders: number;
  remainingCapacity: number;
  winners: OpeningEventWinner[];
  isCurrentlyOpen: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  videoUrl?: string; // YouTube / Aparat / MP4 video url
  videoDuration?: string;
  author: string;
  authorRole?: string;
  category: string;
  tags?: string[];
  hashtags?: string[]; // e.g. ['#هوش_مصنوعی', '#طراحی_وب', '#ربات_تلگرام']
  publishedAt?: string;
  createdAt?: string;
  readTime?: string;
  readTimeMinutes?: number;
  published?: boolean;
  featured?: boolean;
  viewsCount?: number;
  likesCount?: number;
}

export interface SiteSectionConfig {
  id: string;
  key?: string;
  nameFa?: string;
  nameEn?: string;
  titleFa?: string;
  titleEn?: string;
  subtitleFa?: string;
  category?: string;
  badgeText?: string;
  description?: string;
  enabled: boolean;
  customTitle?: string;
  customSubtitle?: string;
  orderIndex?: number;
}

export interface BrandInfo {
  name: string;
  latinName: string;
  tagline: string;
  telegramHandle: string;
  telegramUrl: string;
  heroHeadline: string;
  heroSubtext: string;
  announcementText?: string;
  showAnnouncement?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  telegram?: string;
  bio?: string;
  provider: 'google' | 'guest';
  joinedAt: string;
  savedServiceIds?: string[];
}

export interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  rating?: number;
  status?: 'approved' | 'pending';
}

export interface SiteReview {
  id: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  authorTelegram?: string;
  rating: number; // 1 to 5
  comment: string;
  serviceCategory?: string;
  createdAt: string;
  verified: boolean;
  likesCount?: number;
}

export interface TelegramBotSettings {
  botToken: string;
  chatId: string;
  botUsername: string;
  autoNotifyNewOrders: boolean;
  notifyOnStatusChange: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  suggestedServiceId?: string;
}

export interface SiteDataState {
  brandInfo: BrandInfo;
  telegramSettings: TelegramBotSettings;
  currentUser: UserProfile | null;
  services: Service[];
  portfolio: PortfolioItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  orders: OrderItem[];
  blogPosts: BlogPost[];
  sectionsConfig: SiteSectionConfig[];
  siteViewsCount: number;
  serviceClicksCount: Record<string, number>;
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  telegram?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'client';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'page_view' | 'service_click' | 'order_created' | 'chat_message' | 'video_play' | 'custom';
  path?: string;
  serviceId?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
  referrer?: string;
  value?: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AdminLiveStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  ordersByStatus: {
    new: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  totalRevenue: number;
  conversionRate: number;
  dailyTrend: {
    date: string;
    day: string;
    views: number;
    mobile: number;
    desktop: number;
    tablet?: number;
    orders: number;
    revenue: number;
  }[];
  monthlyTrend: {
    name: string;
    views: number;
    mobile: number;
    desktop: number;
    orders: number;
    revenue: number;
  }[];
  quarterlyTrend: {
    name: string;
    views: number;
    mobile: number;
    desktop: number;
    orders: number;
    revenue: number;
  }[];
  servicePerformance: {
    id: string;
    name: string;
    fullTitle: string;
    views: number;
    inquiries: number;
    revenue: number;
    conversionRate: number;
  }[];
  deviceBreakdown: {
    name: string;
    value: number;
    count: number;
    color: string;
  }[];
  recentEvents: AnalyticsEvent[];
  lastUpdated: string;
}

export interface SitePublicStats {
  activeOnlineUsers: number;
  totalCompletedProjects: number;
  totalSatisfiedClients: number;
  aiModelsActive: number;
  platformUptime: string;
  averageResponseTime: string;
  liveOrdersCount: number;
  totalViews: number;
  lastUpdated: string;
}


