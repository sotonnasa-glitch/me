-- ==========================================================
-- Tekvix Platform - Cloudflare D1 Database Schema
-- Compatible with Cloudflare Workers / Pages & SQLite
-- ==========================================================

-- 1. Users Table (کاربران سیستم و مشتریان)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    telegram TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user', 'client')),
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Orders Table (سفارش‌های ثبت شده)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    full_name TEXT NOT NULL,
    telegram_or_phone TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_title TEXT NOT NULL,
    budget TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'in_progress', 'completed', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    price_quoted TEXT,
    admin_notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Analytics & Events Table (رویدادها و فعالیت‌های زنده برای نمودارها)
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL CHECK(event_type IN ('page_view', 'service_click', 'order_created', 'chat_message', 'video_play', 'custom')),
    path TEXT,
    service_id TEXT,
    device TEXT DEFAULT 'mobile' CHECK(device IN ('mobile', 'desktop', 'tablet')),
    referrer TEXT,
    ip_hash TEXT,
    value REAL DEFAULT 0,
    metadata TEXT, -- JSON payload
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Daily Aggregated Stats Table (کش محاسبات روزانه ترافیک و درآمد)
CREATE TABLE IF NOT EXISTS daily_stats (
    stat_date TEXT PRIMARY KEY, -- Format: YYYY-MM-DD
    day_fa TEXT NOT NULL,
    views_count INTEGER NOT NULL DEFAULT 0,
    mobile_views INTEGER NOT NULL DEFAULT 0,
    desktop_views INTEGER NOT NULL DEFAULT 0,
    tablet_views INTEGER NOT NULL DEFAULT 0,
    orders_count INTEGER NOT NULL DEFAULT 0,
    revenue REAL NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_service ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_service ON analytics_events(service_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==========================================================
-- Initial Seed Data for Cloudflare D1
-- ==========================================================

INSERT OR IGNORE INTO users (id, name, email, phone, telegram, avatar, role, last_login_at, created_at)
VALUES 
    ('usr_admin_01', 'مدیر ارشد تکویکس', 'admin@tekvix.ai', '09120000000', '@Lawat_kar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'admin', CURRENT_TIMESTAMP, datetime('now', '-30 days')),
    ('usr_client_02', 'امیرحسین رضایی', 'amir.rezaei@example.com', '09351234567', '@amir_rezaei', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'client', CURRENT_TIMESTAMP, datetime('now', '-12 days')),
    ('usr_client_03', 'سارا کاظمی', 'sara.kazemi@startup.io', '09198765432', '@sara_kazemi', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'client', CURRENT_TIMESTAMP, datetime('now', '-5 days'));

INSERT OR IGNORE INTO orders (id, user_id, full_name, telegram_or_phone, service_id, service_title, budget, message, status, price_quoted, admin_notes, created_at)
VALUES
    ('ORD-7821', 'usr_client_02', 'امیرحسین رضایی', '@amir_rezaei', 'ai-website', 'ساخت وب‌سایت با هوش مصنوعی', '۸-۱۰ میلیون', 'طراحی لندینگ‌پیج شرکتی برای استارتاپ فناوری هوش مصنوعی با قابلیت فرم ثبت‌نام و پنل ادمین', 'new', '۸,۵۰۰,۰۰۰ تومان', 'نیاز به هماهنگی برای ارسال رفرنس‌های گرافیکی در تلگرام.', datetime('now', '-35 minutes')),
    ('ORD-7820', 'usr_client_03', 'سارا کاظمی', '@sara_kazemi', 'ai-video', 'تولید ویدیو با هوش مصنوعی', '۴-۵ میلیون', 'تیزر ۳۰ ثانیه‌ای برای کمپین معرفی محصول جدید در اینستاگرام و آپارات', 'in_progress', '۴,۲۰۰,۰۰۰ تومان', 'سناریوی ویدیویی تایید شد، خروجی آزمایشی تا فردا عصر تحویل می‌شود.', datetime('now', '-3 hours')),
    ('ORD-7819', NULL, 'مهندس حسینی (آژانس دیجیتال)', '09121112233', 'telegram-bot', 'ساخت ربات تلگرام پیشرفته', '۵-۷ میلیون', 'ربات فروشگاهی متصل به درگاه پرداخت با قابلیت ثبت سفارش و ارسال فاکتور', 'in_progress', '۵,۸۰۰,۰۰۰ تومان', 'اتصال وب‌هوک و دیتابیس در مرحله تست قرار دارد.', datetime('now', '-9 hours')),
    ('ORD-7818', NULL, 'کیانوش راد', '@kian_rad', 'image-creation', 'خلق تصاویر و طراحی گرافیکی', '۲-۳ میلیون', 'طراحی ۱۰ تصویر مفهومی ۴K برای پست‌های لینکدین و هدر وب‌سایت', 'completed', '۲,۵۰۰,۰۰۰ تومان', 'فایل‌های نهایی از طریق تلگرام با کیفیت اورجینال ارسال شدند.', datetime('now', '-1 day')),
    ('ORD-7817', NULL, 'پریسا نامدار', '09367778899', 'ai-music', 'ساخت موزیک و ترانه با AI', '۱.۵-۲ میلیون', 'موزیک پس‌زمینه اختصاصی سبک سینماتیک برای تیزر سالانه شرکت', 'completed', '۱,۹۰۰,۰۰۰ تومان', 'پروژه تحویل داده شد و رضایت کامل ثبت گردید.', datetime('now', '-2 days'));

INSERT OR IGNORE INTO analytics_events (id, event_type, path, service_id, device, value, created_at)
VALUES
    ('ev_01', 'order_created', '/order', 'ai-website', 'mobile', 8500000, datetime('now', '-35 minutes')),
    ('ev_02', 'service_click', '/services/ai-video', 'ai-video', 'mobile', 0, datetime('now', '-42 minutes')),
    ('ev_03', 'chat_message', '/ai-assistant', NULL, 'desktop', 0, datetime('now', '-55 minutes')),
    ('ev_04', 'page_view', '/blog', NULL, 'mobile', 0, datetime('now', '-70 minutes')),
    ('ev_05', 'video_play', '/blog/video-showcase', 'ai-video', 'desktop', 0, datetime('now', '-95 minutes'));
