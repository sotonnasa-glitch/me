-- Cloudflare D1 Initial Migration
-- Migration Name: 0001_d1_schema.sql

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

CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL CHECK(event_type IN ('page_view', 'service_click', 'order_created', 'chat_message', 'video_play', 'custom')),
    path TEXT,
    service_id TEXT,
    device TEXT DEFAULT 'mobile' CHECK(device IN ('mobile', 'desktop', 'tablet')),
    referrer TEXT,
    ip_hash TEXT,
    value REAL DEFAULT 0,
    metadata TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_stats (
    stat_date TEXT PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at);
