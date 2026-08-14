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
}

export interface OrderFormData {
  fullName: string;
  telegramOrPhone: string;
  serviceId: string;
  message: string;
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
  provider: 'google' | 'guest';
  joinedAt: string;
  savedServiceIds?: string[];
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

