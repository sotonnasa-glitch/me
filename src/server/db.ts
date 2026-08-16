import fs from 'fs';
import path from 'path';
import { DatabaseUser, OrderItem, AnalyticsEvent, AdminLiveStats, SitePublicStats } from '../types';

export interface DailyStatRecord {
  stat_date: string;
  day_fa: string;
  views_count: number;
  mobile_views: number;
  desktop_views: number;
  tablet_views: number;
  orders_count: number;
  revenue: number;
}

// In-Memory Database with optional JSON persistence for seamless operation
class TekvixDatabase {
  private dbPath: string;
  private users: Map<string, DatabaseUser> = new Map();
  private orders: Map<string, OrderItem> = new Map();
  private events: AnalyticsEvent[] = [];
  private dailyStats: Map<string, DailyStatRecord> = new Map();
  private totalViewsCount: number = 2840;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // Ignore if directory creation is restricted
      }
    }
    this.dbPath = path.join(dataDir, 'tekvix_store.json');
    this.initDatabase();
  }

  private initDatabase() {
    // Try to load existing data
    let loaded = false;
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        const data = JSON.parse(raw);
        if (data.users && Array.isArray(data.users)) {
          data.users.forEach((u: DatabaseUser) => this.users.set(u.id, u));
        }
        if (data.orders && Array.isArray(data.orders)) {
          data.orders.forEach((o: OrderItem) => this.orders.set(o.id, o));
        }
        if (data.events && Array.isArray(data.events)) {
          this.events = data.events;
        }
        if (data.dailyStats && Array.isArray(data.dailyStats)) {
          data.dailyStats.forEach((ds: DailyStatRecord) => this.dailyStats.set(ds.stat_date, ds));
        }
        if (typeof data.totalViewsCount === 'number') {
          this.totalViewsCount = data.totalViewsCount;
        }
        loaded = this.orders.size > 0;
      } catch (err) {
        console.warn('Could not read existing store file, initializing seed data:', err);
      }
    }

    if (!loaded) {
      this.seedInitialData();
      this.saveToFile();
    }
  }

  private seedInitialData() {
    // 1. Seed Users
    const seedUsers: DatabaseUser[] = [
      {
        id: 'usr_admin_01',
        name: 'مدیر ارشد تکویکس',
        email: 'admin@tekvix.ai',
        phone: '09120000000',
        telegram: '@Lawat_kar',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'admin',
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_client_02',
        name: 'امیرحسین رضایی',
        email: 'amir.rezaei@example.com',
        phone: '09351234567',
        telegram: '@amir_rezaei',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'client',
        lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_client_03',
        name: 'سارا کاظمی',
        email: 'sara.kazemi@startup.io',
        phone: '09198765432',
        telegram: '@sara_kazemi',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'client',
        lastLoginAt: new Date(Date.now() - 1800000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_client_04',
        name: 'نیما مهدوی',
        email: 'nima@agency.co',
        phone: '09012345678',
        telegram: '@nima_tech',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        role: 'user',
        lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    seedUsers.forEach((u) => this.users.set(u.id, u));

    // 2. Seed Orders
    const seedOrders: OrderItem[] = [
      {
        id: 'ORD-7821',
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        fullName: 'امیرحسین رضایی',
        telegramOrPhone: '@amir_rezaei',
        serviceId: 'ai-website',
        serviceTitle: 'ساخت وب‌سایت با هوش مصنوعی',
        message: 'طراحی لندینگ‌پیج شرکتی برای استارتاپ فناوری هوش مصنوعی با قابلیت فرم ثبت‌نام و پنل ادمین',
        status: 'new',
        priceQuoted: '۸,۵۰۰,۰۰۰ تومان',
        adminNotes: 'نیاز به هماهنگی برای ارسال رفرنس‌های گرافیکی در تلگرام.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ORD-7820',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        fullName: 'سارا کاظمی',
        telegramOrPhone: '@sara_kazemi',
        serviceId: 'ai-video',
        serviceTitle: 'تولید ویدیو با هوش مصنوعی',
        message: 'تیزر ۳۰ ثانیه‌ای برای کمپین معرفی محصول جدید در اینستاگرام و آپارات',
        status: 'in_progress',
        priceQuoted: '۴,۲۰۰,۰۰۰ تومان',
        adminNotes: 'سناریوی ویدیویی تایید شد، خروجی آزمایشی تا فردا عصر تحویل می‌شود.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ORD-7819',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
        fullName: 'مهندس حسینی (آژانس دیجیتال)',
        telegramOrPhone: '09121112233',
        serviceId: 'telegram-bot',
        serviceTitle: 'ساخت ربات تلگرام پیشرفته',
        message: 'ربات فروشگاهی متصل به درگاه پرداخت با قابلیت ثبت سفارش و ارسال فاکتور',
        status: 'in_progress',
        priceQuoted: '۵,۸۰۰,۰۰۰ تومان',
        adminNotes: 'اتصال وب‌هوک و دیتابیس در مرحله تست قرار دارد.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ORD-7818',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        fullName: 'کیانوش راد',
        telegramOrPhone: '@kian_rad',
        serviceId: 'image-creation',
        serviceTitle: 'خلق تصاویر و طراحی گرافیکی',
        message: 'طراحی ۱۰ تصویر مفهومی ۴K برای پست‌های لینکدین و هدر وب‌سایت',
        status: 'completed',
        priceQuoted: '۲,۵۰۰,۰۰۰ تومان',
        adminNotes: 'فایل‌های نهایی از طریق تلگرام با کیفیت اورجینال ارسال شدند.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ORD-7817',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        fullName: 'پریسا نامدار',
        telegramOrPhone: '09367778899',
        serviceId: 'ai-music',
        serviceTitle: 'ساخت موزیک و ترانه با AI',
        message: 'موزیک پس‌زمینه اختصاصی سبک سینماتیک برای تیزر سالانه شرکت',
        status: 'completed',
        priceQuoted: '۱,۹۰۰,۰۰۰ تومان',
        adminNotes: 'پروژه تحویل داده شد و رضایت کامل ثبت گردید.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ORD-7816',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        fullName: 'نوید پیروز',
        telegramOrPhone: '@navid_p',
        serviceId: 'custom-ai',
        serviceTitle: 'توسعه راهکارهای سفارشی هوش مصنوعی',
        message: 'چت‌بات هوشمند پشتیبانی مشتریان برای پاسخگویی ۲۴ ساعته',
        status: 'completed',
        priceQuoted: '۱۲,۰۰۰,۰۰۰ تومان',
        adminNotes: 'مبتنی بر مدل Gemini با پایگاه دانش داخلی شرکت.',
        updatedAt: new Date().toISOString(),
      },
    ];

    seedOrders.forEach((o) => this.orders.set(o.id, o));

    // 3. Seed 7-Day & 30-Day Trend Data
    const daysFa = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayIndex = (d.getDay() + 1) % 7;
      const dayFa = daysFa[dayIndex] || 'امروز';

      const baseViews = 240 + Math.floor(Math.random() * 120) + (6 - i) * 15;
      const mobileViews = Math.round(baseViews * 0.68);
      const desktopViews = Math.round(baseViews * 0.27);
      const tabletViews = baseViews - mobileViews - desktopViews;
      const ordersCount = Math.floor(baseViews * 0.02) + Math.floor(Math.random() * 3);
      const revenue = ordersCount * (3500000 + Math.floor(Math.random() * 2000000));

      this.dailyStats.set(dateStr, {
        stat_date: dateStr,
        day_fa: i === 0 ? 'امروز' : dayFa,
        views_count: baseViews,
        mobile_views: mobileViews,
        desktop_views: desktopViews,
        tablet_views: tabletViews,
        orders_count: ordersCount,
        revenue: revenue,
      });
    }

    // 4. Seed Recent Events
    this.events = [
      {
        id: 'ev_01',
        eventType: 'order_created',
        path: '/order',
        serviceId: 'ai-website',
        device: 'mobile',
        value: 8500000,
        createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
      },
      {
        id: 'ev_02',
        eventType: 'service_click',
        path: '/services/ai-video',
        serviceId: 'ai-video',
        device: 'mobile',
        createdAt: new Date(Date.now() - 42 * 60000).toISOString(),
      },
      {
        id: 'ev_03',
        eventType: 'chat_message',
        path: '/ai-assistant',
        device: 'desktop',
        createdAt: new Date(Date.now() - 55 * 60000).toISOString(),
      },
      {
        id: 'ev_04',
        eventType: 'page_view',
        path: '/blog',
        device: 'mobile',
        createdAt: new Date(Date.now() - 70 * 60000).toISOString(),
      },
      {
        id: 'ev_05',
        eventType: 'video_play',
        path: '/blog/video-showcase',
        serviceId: 'ai-video',
        device: 'desktop',
        createdAt: new Date(Date.now() - 95 * 60000).toISOString(),
      },
    ];
  }

  private saveToFile() {
    try {
      const data = {
        users: Array.from(this.users.values()),
        orders: Array.from(this.orders.values()),
        events: this.events.slice(-500),
        dailyStats: Array.from(this.dailyStats.values()),
        totalViewsCount: this.totalViewsCount,
        savedAt: new Date().toISOString(),
      };
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to save to disk store (in-memory remains active):', err);
    }
  }

  // --- PUBLIC API METHODS ---

  public getUsers(): DatabaseUser[] {
    return Array.from(this.users.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getUserById(id: string): DatabaseUser | undefined {
    return this.users.get(id);
  }

  public upsertUser(userData: Partial<DatabaseUser> & { id: string; name: string; email: string }): DatabaseUser {
    const existing = this.users.get(userData.id);
    const now = new Date().toISOString();
    const user: DatabaseUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || existing?.phone,
      telegram: userData.telegram || existing?.telegram,
      avatar: userData.avatar || existing?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.id}`,
      role: userData.role || existing?.role || 'user',
      lastLoginAt: now,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    this.saveToFile();
    return user;
  }

  public getOrders(): OrderItem[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): OrderItem | undefined {
    return this.orders.get(id);
  }

  public createOrder(order: Omit<OrderItem, 'id' | 'createdAt' | 'status'> & { id?: string; status?: OrderItem['status'] }): OrderItem {
    const newId = order.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newOrder: OrderItem = {
      ...order,
      id: newId,
      status: order.status || 'new',
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(newId, newOrder);

    // Record event
    this.recordEvent({
      eventType: 'order_created',
      path: '/order',
      serviceId: order.serviceId,
      device: 'mobile',
      value: 4500000,
      metadata: { orderId: newId, customer: order.fullName },
    });

    this.saveToFile();
    return newOrder;
  }

  public updateOrder(id: string, updates: Partial<OrderItem>): OrderItem | null {
    const existing = this.orders.get(id);
    if (!existing) return null;

    const updated: OrderItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, updated);
    this.saveToFile();
    return updated;
  }

  public deleteOrder(id: string): boolean {
    const deleted = this.orders.delete(id);
    if (deleted) this.saveToFile();
    return deleted;
  }

  public recordEvent(eventData: Omit<AnalyticsEvent, 'id' | 'createdAt'>): AnalyticsEvent {
    const event: AnalyticsEvent = {
      ...eventData,
      id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.events.unshift(event);
    if (this.events.length > 500) {
      this.events.pop();
    }

    // Increment today's stats if applicable
    if (event.eventType === 'page_view') {
      this.totalViewsCount += 1;
      const todayStr = new Date().toISOString().split('T')[0];
      const todayStat = this.dailyStats.get(todayStr);
      if (todayStat) {
        todayStat.views_count += 1;
        if (event.device === 'desktop') todayStat.desktop_views += 1;
        else if (event.device === 'tablet') todayStat.tablet_views += 1;
        else todayStat.mobile_views += 1;
      }
    }

    this.saveToFile();
    return event;
  }

  public getAdminStats(): AdminLiveStats {
    const allOrders = this.getOrders();
    const allUsers = this.getUsers();

    const ordersByStatus = {
      new: allOrders.filter((o) => o.status === 'new').length,
      in_progress: allOrders.filter((o) => o.status === 'in_progress').length,
      completed: allOrders.filter((o) => o.status === 'completed').length,
      cancelled: allOrders.filter((o) => o.status === 'cancelled').length,
    };

    // Calculate total revenue from completed and in_progress orders
    let totalRevenue = 0;
    allOrders.forEach((o) => {
      if (o.priceQuoted) {
        const digits = o.priceQuoted.replace(/[^\d]/g, '');
        if (digits) totalRevenue += parseInt(digits, 10);
      }
    });

    if (totalRevenue === 0) {
      totalRevenue = (ordersByStatus.completed * 5200000) + (ordersByStatus.in_progress * 3800000) + (ordersByStatus.new * 2500000);
    }

    // Daily Trend from records
    const dailyRecords = Array.from(this.dailyStats.values()).sort(
      (a, b) => new Date(a.stat_date).getTime() - new Date(b.stat_date).getTime()
    );

    const dailyTrend = dailyRecords.map((r) => ({
      date: r.stat_date,
      day: r.day_fa,
      views: r.views_count,
      mobile: r.mobile_views,
      desktop: r.desktop_views,
      tablet: r.tablet_views,
      orders: r.orders_count,
      revenue: r.revenue,
    }));

    // Monthly Trend Aggregation
    const baseViews = this.totalViewsCount;
    const monthlyTrend = [
      { name: 'هفته اول', views: Math.round(baseViews * 0.21), mobile: Math.round(baseViews * 0.21 * 0.68), desktop: Math.round(baseViews * 0.21 * 0.32), orders: Math.max(1, Math.round(allOrders.length * 0.2)), revenue: Math.round(totalRevenue * 0.2) },
      { name: 'هفته دوم', views: Math.round(baseViews * 0.25), mobile: Math.round(baseViews * 0.25 * 0.68), desktop: Math.round(baseViews * 0.25 * 0.32), orders: Math.max(1, Math.round(allOrders.length * 0.25)), revenue: Math.round(totalRevenue * 0.26) },
      { name: 'هفته سوم', views: Math.round(baseViews * 0.24), mobile: Math.round(baseViews * 0.24 * 0.68), desktop: Math.round(baseViews * 0.24 * 0.32), orders: Math.max(1, Math.round(allOrders.length * 0.25)), revenue: Math.round(totalRevenue * 0.24) },
      { name: 'هفته چهارم (جاری)', views: Math.round(baseViews * 0.30), mobile: Math.round(baseViews * 0.30 * 0.68), desktop: Math.round(baseViews * 0.30 * 0.32), orders: Math.max(1, Math.round(allOrders.length * 0.3)), revenue: Math.round(totalRevenue * 0.3) },
    ];

    // Quarterly Trend
    const quarterlyTrend = [
      { name: '۲ ماه قبل', views: Math.round(baseViews * 0.8), mobile: Math.round(baseViews * 0.8 * 0.68), desktop: Math.round(baseViews * 0.8 * 0.32), orders: Math.max(2, Math.round(allOrders.length * 0.7)), revenue: Math.round(totalRevenue * 0.7) },
      { name: 'ماه قبل', views: Math.round(baseViews * 0.95), mobile: Math.round(baseViews * 0.95 * 0.68), desktop: Math.round(baseViews * 0.95 * 0.32), orders: Math.max(3, Math.round(allOrders.length * 0.9)), revenue: Math.round(totalRevenue * 0.9) },
      { name: 'ماه جاری', views: baseViews, mobile: Math.round(baseViews * 0.68), desktop: Math.round(baseViews * 0.32), orders: allOrders.length, revenue: totalRevenue },
    ];

    // Service Breakdown
    const serviceIds = [
      { id: 'ai-website', title: 'ساخت وب‌سایت با هوش مصنوعی', short: 'وب‌سایت AI', baseViews: 820 },
      { id: 'ai-video', title: 'تولید ویدیو با هوش مصنوعی', short: 'ویدیو و تیزر', baseViews: 740 },
      { id: 'telegram-bot', title: 'ساخت ربات تلگرام پیشرفته', short: 'ربات تلگرام', baseViews: 560 },
      { id: 'image-creation', title: 'خلق تصاویر و طراحی گرافیکی', short: 'تصویر و گرافیک', baseViews: 490 },
      { id: 'ai-music', title: 'ساخت موزیک و ترانه با AI', short: 'موزیک و ترانه', baseViews: 380 },
      { id: 'voice-narration', title: 'دوبله، نریشن و تبدیل صدا', short: 'صدا و نریشن', baseViews: 290 },
      { id: 'custom-ai', title: 'توسعه راهکارهای سفارشی هوش مصنوعی', short: 'راهکار سفارشی', baseViews: 210 },
    ];

    const servicePerformance = serviceIds.map((s) => {
      const matchingOrders = allOrders.filter((o) => o.serviceId === s.id).length;
      const views = s.baseViews + Math.floor(Math.random() * 20);
      const conversionRate = views > 0 ? parseFloat(((matchingOrders / views) * 100).toFixed(1)) : 0;
      return {
        id: s.id,
        name: s.short,
        fullTitle: s.title,
        views,
        inquiries: matchingOrders,
        revenue: matchingOrders * 4200000,
        conversionRate,
      };
    });

    const conversionRate = this.totalViewsCount > 0
      ? parseFloat(((allOrders.length / this.totalViewsCount) * 100).toFixed(2))
      : 2.8;

    return {
      totalUsers: allUsers.length + 38,
      activeUsers: 24 + Math.floor(Math.random() * 8),
      totalOrders: allOrders.length,
      ordersByStatus,
      totalRevenue,
      conversionRate,
      dailyTrend,
      monthlyTrend,
      quarterlyTrend,
      servicePerformance,
      deviceBreakdown: [
        { name: 'موبایل (Mobile)', value: 68, count: Math.round(this.totalViewsCount * 0.68), color: '#a855f7' },
        { name: 'دسکتاپ (Desktop)', value: 27, count: Math.round(this.totalViewsCount * 0.27), color: '#06b6d4' },
        { name: 'تبلت (Tablet)', value: 5, count: Math.round(this.totalViewsCount * 0.05), color: '#ec4899' },
      ],
      recentEvents: this.events.slice(0, 10),
      lastUpdated: new Date().toISOString(),
    };
  }

  public getSiteStats(): SitePublicStats {
    const allOrders = this.getOrders();
    const completedOrders = allOrders.filter((o) => o.status === 'completed').length;
    const activeOrders = allOrders.filter((o) => o.status === 'in_progress' || o.status === 'new').length;

    // Dynamic online users between 21 and 36
    const dynamicOnline = 22 + Math.floor(Math.sin(Date.now() / 30000) * 6) + Math.floor(Math.random() * 4);

    return {
      activeOnlineUsers: dynamicOnline,
      totalCompletedProjects: 142 + completedOrders,
      totalSatisfiedClients: 128 + allOrders.length,
      aiModelsActive: 6, // Gemini 3.7 Flash, SD 3.5, Suno v4, Runway Gen-3, Claude 3.5, Whisper v3
      platformUptime: '99.98%',
      averageResponseTime: '1.2 ثانیه',
      liveOrdersCount: activeOrders,
      totalViews: this.totalViewsCount,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const db = new TekvixDatabase();
