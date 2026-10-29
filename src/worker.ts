/**
 * TEKVIX Cloudflare Worker API.
 *
 * Server-only credentials are read from Worker Secrets. Never move them into
 * Vite environment variables or client-side code.
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  GEMINI_API_KEY?: string;
  TEKVIX_ADMIN_PASSWORD?: string;
}

type OrderInput = {
  id?: unknown;
  createdAt?: unknown;
  fullName?: unknown;
  telegramOrPhone?: unknown;
  serviceId?: unknown;
  serviceTitle?: unknown;
  message?: unknown;
  status?: unknown;
  priceQuoted?: unknown;
  isPromoEvent?: unknown;
  promoEventName?: unknown;
  userEmail?: unknown;
};

type OrderRow = {
  id: string;
  full_name: string;
  telegram_or_phone: string;
  service_id: string;
  service_title: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  price_quoted: string;
  is_promo_event: boolean;
  promo_event_name: string | null;
  user_email: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

const rateWindows = new Map<string, { count: number; expiresAt: number }>();
const MAX_BODY_LENGTH = 24_000;
const CMS_RESOURCES = [
  'brandInfo', 'services', 'portfolio', 'testimonials', 'faqs',
  'blogPosts', 'sectionsConfig', 'socialLinks', 'events',
] as const;
type CmsResource = typeof CMS_RESOURCES[number];
const CMS_ARRAY_RESOURCES = new Set<CmsResource>([
  'services', 'portfolio', 'testimonials', 'faqs', 'blogPosts',
  'sectionsConfig', 'socialLinks', 'events',
]);

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

function cleanText(value: unknown, maxLength: number, fallback = ''): string {
  if (typeof value !== 'string' && typeof value !== 'number') return fallback;
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength) || fallback;
}

function cleanSingleLine(value: unknown, maxLength: number, fallback = ''): string {
  return cleanText(value, maxLength, fallback).replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLength) || fallback;
}

async function readJson(request: Request, maxLength = MAX_BODY_LENGTH): Promise<Record<string, unknown> | null> {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > maxLength) return null;
  try {
    const raw = await request.text();
    if (raw.length > maxLength) return null;
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

/**
 * Best-effort per-isolate rate limiting. For stronger protection across all
 * Worker isolates, add a Cloudflare Rate Limiting binding/Turnstile later.
 */
function rateLimit(request: Request, key: string, max: number, windowMs: number): Response | null {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const mapKey = key + ':' + ip;
  const now = Date.now();
  let item = rateWindows.get(mapKey);
  if (!item || item.expiresAt <= now) {
    item = { count: 0, expiresAt: now + windowMs };
    rateWindows.set(mapKey, item);
  }
  item.count += 1;
  if (rateWindows.size > 3000) {
    for (const [currentKey, value] of rateWindows) {
      if (value.expiresAt <= now) rateWindows.delete(currentKey);
    }
  }
  if (item.count > max) {
    return json({ success: false, error: 'تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.' }, 429);
  }
  return null;
}

function supabaseReady(env: Env): boolean {
  return Boolean(env.SUPABASE_URL?.trim() && env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

function supabaseHeaders(env: Env, prefer?: string): Headers {
  const key = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const headers = new Headers({
    apikey: key,
    'content-type': 'application/json',
  });
  // New sb_secret_* API keys must be sent via apikey only. Legacy service_role
  // keys are JWTs and must also be the Authorization bearer token so PostgREST
  // receives the service_role claim and bypasses RLS as intended.
  if (key.startsWith('eyJ') && key.split('.').length === 3) {
    headers.set('authorization', 'Bearer ' + key);
  }
  if (prefer) headers.set('prefer', prefer);
  return headers;
}

async function databaseRequest(
  env: Env,
  tableAndQuery: string,
  init: { method?: string; body?: unknown; prefer?: string } = {},
): Promise<Response> {
  if (!supabaseReady(env)) throw new Error('Supabase environment is not configured.');
  const base = env.SUPABASE_URL!.trim().replace(/\/+$/, '');
  return fetch(base + '/rest/v1/' + tableAndQuery, {
    method: init.method || 'GET',
    headers: supabaseHeaders(env, init.prefer),
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

function makeOrderRow(input: OrderInput): OrderRow | null {
  const fullName = cleanSingleLine(input.fullName, 100);
  const contact = cleanSingleLine(input.telegramOrPhone, 80);
  const serviceId = cleanSingleLine(input.serviceId, 50);
  if (!fullName || !contact || !serviceId) return null;

  const suppliedId = cleanSingleLine(input.id, 64);
  if (suppliedId && !/^ORD-\d{4,20}(?:-(?:\d{1,6}|[A-Fa-f0-9]{32}))?$/.test(suppliedId)) return null;
  const id = suppliedId || `ORD-${Date.now()}-${crypto.randomUUID().replace(/-/g, '').toUpperCase()}`;
  const now = new Date().toISOString();
  // Public submissions always start as "new"; the browser cannot set admin status.
  const createdAt = now;
  const status = 'new' as const;

  return {
    id,
    full_name: fullName,
    telegram_or_phone: contact,
    service_id: serviceId,
    service_title: cleanSingleLine(input.serviceTitle, 100, 'خدمت اختصاصی'),
    message: cleanText(input.message, 2000),
    status,
    price_quoted: cleanSingleLine(input.priceQuoted, 50, 'استعلامی'),
    is_promo_event: input.isPromoEvent === true,
    promo_event_name: cleanSingleLine(input.promoEventName, 100) || null,
    user_email: cleanSingleLine(input.userEmail, 100) || null,
    admin_notes: null,
    created_at: createdAt,
    updated_at: now,
  };
}

function orderToClient(row: OrderRow) {
  return {
    id: row.id,
    createdAt: row.created_at,
    fullName: row.full_name,
    telegramOrPhone: row.telegram_or_phone,
    serviceId: row.service_id,
    serviceTitle: row.service_title,
    message: row.message,
    status: row.status,
    priceQuoted: row.price_quoted,
    isPromoEvent: row.is_promo_event,
    promoEventName: row.promo_event_name || undefined,
    userEmail: row.user_email || undefined,
    adminNotes: row.admin_notes || undefined,
    updatedAt: row.updated_at,
  };
}

async function findOrder(env: Env, id: string): Promise<OrderRow | null> {
  const response = await databaseRequest(
    env,
    'orders?select=*&id=eq.' + encodeURIComponent(id) + '&limit=1',
  );
  if (!response.ok) {
    console.error('[TEKVIX] Supabase order read failed with status', response.status);
    throw new Error('Database read failed.');
  }
  const data = await response.json() as OrderRow[];
  return Array.isArray(data) && data[0] ? data[0] : null;
}

async function insertOrder(env: Env, row: OrderRow): Promise<OrderRow | null> {
  const response = await databaseRequest(env, 'orders', {
    method: 'POST',
    body: row,
    prefer: 'return=representation',
  });
  // Another request may have inserted this client-generated ID first.
  if (response.status === 409) return null;
  if (!response.ok) {
    console.error('[TEKVIX] Supabase order write failed with status', response.status);
    throw new Error('Database write failed.');
  }
  const data = await response.json() as OrderRow[];
  if (!Array.isArray(data) || !data[0]) throw new Error('Database did not return the saved order.');
  return data[0];
}

async function findOrInsertOrder(env: Env, row: OrderRow): Promise<OrderRow> {
  const existing = await findOrder(env, row.id);
  if (existing) return existing;
  const inserted = await insertOrder(env, row);
  if (inserted) return inserted;
  // Resolve a race where the /api/orders request and Telegram notification
  // arrive at nearly the same time, without overwriting the first saved record.
  const raced = await findOrder(env, row.id);
  if (raced) return raced;
  throw new Error('Could not resolve concurrent order creation.');
}
async function resolveTelegramChatId(env: Env): Promise<string> {
  const configured = env.TELEGRAM_CHAT_ID?.trim();
  if (configured) return configured;
  if (!supabaseReady(env)) return '';
  try {
    const response = await databaseRequest(
      env,
      'site_settings?select=value&setting_key=eq.telegram_chat_id&limit=1',
    );
    if (!response.ok) return '';
    const rows = await response.json() as Array<{ value?: unknown }>;
    const value = rows?.[0]?.value;
    if (typeof value === 'string') return cleanSingleLine(value, 100);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return cleanSingleLine((value as Record<string, unknown>).chatId, 100);
    }
  } catch {
    // A missing DB setting must never crash the Worker; sending will fail closed.
  }
  return '';
}

async function sendTelegram(env: Env, message: string): Promise<boolean> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return false;
  const chatId = await resolveTelegramChatId(env);
  if (!chatId) return false;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.slice(0, 3900),
        disable_web_page_preview: true,
      }),
    });
    const data = await response.json().catch(() => null) as { ok?: boolean } | null;
    return response.ok && data?.ok === true;
  } catch {
    return false;
  }
}

function orderMessage(row: OrderRow): string {
  return [
    '🧾 سفارش جدید TEKVIX',
    'کد سفارش: ' + row.id,
    'نام: ' + row.full_name,
    'راه ارتباطی: ' + row.telegram_or_phone,
    'خدمت: ' + row.service_title,
    'قیمت: ' + row.price_quoted,
    'سفارش افتتاحیه: ' + (row.is_promo_event ? 'بله' : 'خیر'),
    row.message ? 'توضیحات: ' + row.message : '',
  ].filter(Boolean).join('\n');
}

const defaultOpeningConfig = () => {
  const now = Date.now();
  return {
    isActive: true,
    title: 'جشن افتتاحیه TEKVIX | اولین سفارش‌ها رایگان',
    subtitle: 'فرصت استثنایی برای ۲ سفارش اول با ۱۰۰٪ تخفیف و هزینه کاملاً رایگان',
    badgeText: '🎉 کمپین افتتاحیه ویژه',
    highlightText: '🔥 فقط ۲ سفارش اول رایگان!',
    description: 'هر خدمتی که از TEKVIX انتخاب کنی، برای ۲ نفر اول کاملاً رایگان انجام می‌شود. 🤖✨',
    startDate: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
    maxWinners: 2,
    termsNote: 'هر کاربر فقط یک‌بار امکان استفاده از جایزه را دارد. سفارش‌های لغوشده محاسبه نمی‌شوند.',
  };
};

const encoder = new TextEncoder();
const ADMIN_COOKIE = 'tekvix_admin';
const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;
const ADMIN_PASSWORD_ITERATIONS = 120_000;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlToBytes(value: string): Uint8Array | null {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function normalizeAdminPassword(value: string): string {
  return value.trim()
    .replace(/[۰-۹]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 1584));
}

async function adminSigningKey(env: Env): Promise<CryptoKey> {
  const baseSecret = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!baseSecret) throw new Error('Admin session signing secret unavailable.');
  return crypto.subtle.importKey(
    'raw',
    encoder.encode('TEKVIX_ADMIN_SESSION_V1:' + baseSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function createAdminCookie(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify({ sub: 'admin', iat: now, exp: now + ADMIN_SESSION_TTL_SECONDS })));
  const key = await adminSigningKey(env);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return payload + '.' + bytesToBase64Url(new Uint8Array(signature));
}

function getCookie(request: Request, name: string): string | null {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name) return part.slice(index + 1).trim();
  }
  return null;
}

async function isAdminRequest(request: Request, env: Env): Promise<boolean> {
  const token = getCookie(request, ADMIN_COOKIE);
  if (!token || token.length > 2048) return false;
  const splitAt = token.lastIndexOf('.');
  if (splitAt <= 0) return false;
  const payload = token.slice(0, splitAt);
  const signature = base64UrlToBytes(token.slice(splitAt + 1));
  if (!signature) return false;
  try {
    const key = await adminSigningKey(env);
    const valid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(payload));
    if (!valid) return false;
    const bytes = base64UrlToBytes(payload);
    if (!bytes) return false;
    const session = JSON.parse(new TextDecoder().decode(bytes)) as { sub?: string; exp?: number };
    return session.sub === 'admin' && Number.isFinite(session.exp) && Number(session.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function adminCookieHeaders(value: string): Headers {
  return new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'set-cookie': value,
    'x-content-type-options': 'nosniff',
  });
}

function sessionCookie(value: string, maxAge: number): string {
  return `${ADMIN_COOKIE}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

async function getAdminPasswordRecord(env: Env): Promise<Record<string, unknown> | null> {
  const response = await databaseRequest(env, 'site_settings?select=value&setting_key=eq.admin_password_hash&limit=1');
  if (!response.ok) throw new Error('Could not read administrator password configuration.');
  const rows = await response.json() as Array<{ value?: unknown }>;
  const value = rows?.[0]?.value;
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

async function verifyPbkdf2Password(password: string, record: Record<string, unknown>): Promise<boolean> {
  if (record.scheme !== 'pbkdf2-sha256' || typeof record.salt !== 'string' || typeof record.hash !== 'string') return false;
  const iterationInput = Number(record.iterations);
  const iterations = Number.isInteger(iterationInput) && iterationInput >= 100_000 && iterationInput <= 500_000
    ? iterationInput
    : 0;
  const salt = base64UrlToBytes(record.salt);
  const expected = base64UrlToBytes(record.hash);
  if (!iterations || !salt || !expected || expected.length !== 32) return false;
  try {
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const result = new Uint8Array(await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      key,
      256,
    ));
    let diff = result.length ^ expected.length;
    for (let i = 0; i < Math.min(result.length, expected.length); i++) diff |= result[i] ^ expected[i];
    return diff === 0;
  } catch {
    return false;
  }
}

async function verifyAdminPassword(env: Env, rawPassword: string): Promise<boolean> {
  const password = normalizeAdminPassword(rawPassword);
  if (!password || password.length > 256) return false;
  const record = await getAdminPasswordRecord(env);
  if (record?.scheme === 'pbkdf2-sha256') return verifyPbkdf2Password(password, record);
  const configuredPassword = env.TEKVIX_ADMIN_PASSWORD;
  return Boolean(configuredPassword && password === configuredPassword.trim());
}

async function saveAdminPasswordRecord(env: Env, password: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ADMIN_PASSWORD_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  ));
  const value = {
    scheme: 'pbkdf2-sha256',
    iterations: ADMIN_PASSWORD_ITERATIONS,
    salt: bytesToBase64Url(salt),
    hash: bytesToBase64Url(bits),
  };
  const response = await databaseRequest(env, 'site_settings?on_conflict=setting_key', {
    method: 'POST',
    body: { setting_key: 'admin_password_hash', value, updated_at: new Date().toISOString() },
    prefer: 'resolution=merge-duplicates,return=minimal',
  });
  if (!response.ok) throw new Error('Could not save administrator password configuration.');
}

async function requireAdmin(request: Request, env: Env): Promise<Response | null> {
  if (!(await isAdminRequest(request, env))) {
    return json({ success: false, error: 'دسترسی غیرمجاز؛ ابتدا وارد پنل مدیریت شوید.', requireLogin: true }, 401);
  }
  if (!isSameOrigin(request)) return json({ success: false, error: 'درخواست از مبدأ معتبر نیست.' }, 403);
  return null;
}

type StoredOrder = {
  id: string; full_name: string; telegram_or_phone: string; service_id: string;
  service_title: string; message: string; status: 'new'|'in_progress'|'completed'|'cancelled';
  price_quoted: string; is_promo_event: boolean; promo_event_name: string|null;
  user_email: string|null; admin_notes: string|null; created_at: string; updated_at: string;
};

function storedOrderToClient(row: StoredOrder) {
  return {
    id: row.id, fullName: row.full_name, telegramOrPhone: row.telegram_or_phone,
    serviceId: row.service_id, serviceTitle: row.service_title, message: row.message,
    status: row.status, priceQuoted: row.price_quoted, isPromoEvent: row.is_promo_event,
    promoEventName: row.promo_event_name || undefined, userEmail: row.user_email || undefined,
    adminNotes: row.admin_notes || undefined, createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

async function readRows<T>(env: Env, tableAndQuery: string): Promise<T[]> {
  const response = await databaseRequest(env, tableAndQuery);
  if (!response.ok) throw new Error('Database read failed with status ' + response.status);
  const rows = await response.json() as T[];
  return Array.isArray(rows) ? rows : [];
}

function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 1584));
}

function parseQuotedPrice(value: unknown): number {
  const digits = normalizeDigits(String(value ?? '')).replace(/[^0-9]/g, '');
  const numeric = Number(digits);
  return Number.isFinite(numeric) ? numeric : 0;
}

function dateKey(value: string): string {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : '';
}

async function buildAdminStats(env: Env) {
  const [orders, events, users] = await Promise.all([
    readRows<StoredOrder>(env, 'orders?select=*&order=created_at.desc&limit=5000'),
    readRows<Record<string, unknown>>(env, 'analytics_events?select=*&order=created_at.desc&limit=5000'),
    readRows<{ id: string }>(env, 'user_profiles?select=id&limit=5000'),
  ]);
  const statusCounts = {
    new: orders.filter((o) => o.status === 'new').length,
    in_progress: orders.filter((o) => o.status === 'in_progress').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };
  const totalRevenue = orders.reduce((sum, order) => sum + parseQuotedPrice(order.price_quoted), 0);
  const completedRevenue = orders.filter((o) => o.status === 'completed').reduce((sum, order) => sum + parseQuotedPrice(order.price_quoted), 0);
  const views = events.filter((e) => e.event_type === 'page_view');
  const serviceEvents = new Map<string, number>();
  for (const event of events) {
    const service = typeof event.service_id === 'string' ? event.service_id : '';
    if (service) serviceEvents.set(service, (serviceEvents.get(service) || 0) + 1);
  }
  const orderByDate = new Map<string, number>();
  const revenueByDate = new Map<string, number>();
  for (const order of orders) {
    const day = dateKey(order.created_at);
    if (day) {
      orderByDate.set(day, (orderByDate.get(day) || 0) + 1);
      revenueByDate.set(day, (revenueByDate.get(day) || 0) + parseQuotedPrice(order.price_quoted));
    }
  }
  const viewsByDate = new Map<string, number>();
  for (const event of views) {
    const day = dateKey(String(event.created_at || ''));
    if (day) viewsByDate.set(day, (viewsByDate.get(day) || 0) + 1);
  }
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      date: key, day: index === 6 ? 'امروز' : key,
      views: viewsByDate.get(key) || 0,
      mobile: events.filter((e) => e.event_type === 'page_view' && dateKey(String(e.created_at || '')) === key && e.device === 'mobile').length,
      desktop: events.filter((e) => e.event_type === 'page_view' && dateKey(String(e.created_at || '')) === key && e.device === 'desktop').length,
      tablet: events.filter((e) => e.event_type === 'page_view' && dateKey(String(e.created_at || '')) === key && e.device === 'tablet').length,
      orders: orderByDate.get(key) || 0,
      revenue: revenueByDate.get(key) || 0,
    };
  });
  const recentEvents = events.slice(0, 10).map((e) => ({
    id: String(e.id || ''), eventType: String(e.event_type || 'unknown'),
    path: String(e.path || '/'), serviceId: typeof e.service_id === 'string' ? e.service_id : undefined,
    device: String(e.device || 'unknown'), referrer: typeof e.referrer === 'string' ? e.referrer : undefined,
    value: Number(e.value) || 0, createdAt: String(e.created_at || new Date().toISOString()),
    metadata: e.metadata && typeof e.metadata === 'object' ? e.metadata : undefined,
  }));
  const deviceCounts = ['mobile','desktop','tablet','unknown'].map((device) => {
    const count = views.filter((event) => event.device === device).length;
    return { name: device, value: count, count, color: ({ mobile: '#22d3ee', desktop: '#a78bfa', tablet: '#34d399', unknown: '#94a3b8' } as Record<string,string>)[device] };
  });
  const now = Date.now();
  const monthly = Array.from({ length: 4 }, (_, idx) => {
    const start = now - (3 - idx) * 7 * 24 * 60 * 60 * 1000;
    const end = start + 7 * 24 * 60 * 60 * 1000;
    const periodEvents = events.filter((e) => {
      const time = Date.parse(String(e.created_at || ''));
      return Number.isFinite(time) && time >= start && time < end;
    });
    const periodOrders = orders.filter((o) => {
      const time = Date.parse(o.created_at);
      return Number.isFinite(time) && time >= start && time < end;
    });
    return {
      name: 'هفته ' + (idx + 1),
      views: periodEvents.filter((e) => e.event_type === 'page_view').length,
      mobile: periodEvents.filter((e) => e.event_type === 'page_view' && e.device === 'mobile').length,
      desktop: periodEvents.filter((e) => e.event_type === 'page_view' && e.device === 'desktop').length,
      orders: periodOrders.length,
      revenue: periodOrders.reduce((sum,o)=>sum+parseQuotedPrice(o.price_quoted),0),
    };
  });
  const quarterly = Array.from({ length: 3 }, (_, idx) => {
    const start = now - (2 - idx) * 30 * 24 * 60 * 60 * 1000;
    const end = start + 30 * 24 * 60 * 60 * 1000;
    const periodEvents = events.filter((e) => {
      const time = Date.parse(String(e.created_at || ''));
      return Number.isFinite(time) && time >= start && time < end;
    });
    const periodOrders = orders.filter((o) => {
      const time = Date.parse(o.created_at);
      return Number.isFinite(time) && time >= start && time < end;
    });
    return {
      name: 'بازه ' + (idx + 1),
      views: periodEvents.filter((e) => e.event_type === 'page_view').length,
      mobile: periodEvents.filter((e) => e.event_type === 'page_view' && e.device === 'mobile').length,
      desktop: periodEvents.filter((e) => e.event_type === 'page_view' && e.device === 'desktop').length,
      orders: periodOrders.length,
      revenue: periodOrders.reduce((sum,o)=>sum+parseQuotedPrice(o.price_quoted),0),
    };
  });
  const servicePerformance = Array.from(serviceEvents.entries()).map(([id, inquiries]) => ({
    id, name: id, fullTitle: id, views: events.filter((e)=>e.service_id===id && e.event_type==='service_click').length,
    inquiries, revenue: orders.filter((o)=>o.service_id===id).reduce((sum,o)=>sum+parseQuotedPrice(o.price_quoted),0),
    conversionRate: inquiries ? Math.round(orders.filter((o)=>o.service_id===id).length / inquiries * 10000) / 100 : 0,
  })).slice(0, 20);

  return {
    totalUsers: users.length,
    activeUsers: users.length,
    totalOrders: orders.length,
    ordersByStatus: statusCounts,
    totalRevenue,
    completedRevenue,
    conversionRate: views.length ? Math.round(orders.length / views.length * 10000) / 100 : 0,
    dailyTrend: days,
    monthlyTrend: monthly,
    quarterlyTrend: quarterly,
    servicePerformance,
    deviceBreakdown: deviceCounts,
    recentEvents,
    lastUpdated: new Date().toISOString(),
  };
}


async function getOpeningEvent(env: Env): Promise<Record<string, unknown>> {
  const defaults = defaultOpeningConfig();
  const response = await databaseRequest(env, 'opening_event_config?select=config&singleton_id=eq.default');
  if (!response.ok) throw new Error('Unable to read opening event');
  const rows = await response.json() as Array<{ config?: unknown }>;
  const candidate = rows?.[0]?.config;
  const config = candidate && typeof candidate === 'object' && !Array.isArray(candidate) && Object.keys(candidate as object).length
    ? { ...defaults, ...(candidate as Record<string, unknown>) } : defaults;
  const now = Date.now();
  const start = Date.parse(String(config.startDate || ''));
  const end = Date.parse(String(config.endDate || ''));
  return { config, isCurrentlyOpen: config.isActive === true && Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end };
}

const TEKVIX_GEMINI_SYSTEM_INSTRUCTION = `
شما «دستیار فوق‌هوشمند پلتفرم تکویکس (Tekvix AI Assistant)» هستید.
تکویکس برترین پلتفرم تخصصی ارائه خدمات هوش مصنوعی و طراحی دیجیتال به زبان فارسی است.

حیطه تخصص و خدمات تکویکس:
۱. ساخت وب‌سایت با هوش مصنوعی (طراحی اختصاصی UI/UX مدرن با React و Tailwind، اتصال به پایگاه داده، پنل ادمین هوشمند، تحویل در ۳ تا ۵ روز، قیمت از ۴.۵ میلیون تومان).
۲. تولید تیزر و ویدیو با هوش مصنوعی (ویدیوهای تبلیغاتی 4K، سناریونویسی با هوش مصنوعی، مدل‌های پیشرفته تولید ویدیو، موشن گرافیک، تحویل ۱ تا ۲ روز، از ۲.۸ میلیون تومان).
۳. ساخت ربات‌های پیشرفته تلگرام (ربات‌های فروشگاهی، پشتیبانی هوشمند مبتنی بر Gemini، اتصال به وب‌هوک و درگاه پرداخت، از ۳.۵ میلیون تومان).
۴. خلق تصاویر، گرافیک و مدل‌های 3D (تولید تصویر با کیفیت 4K، بازسازی چهره، کاور موزیک، بنر شبکه‌های اجتماعی، از ۱.۲ میلیون تومان).
۵. آهنگسازی، ترانه و صداگذاری هوش مصنوعی (تولید موزیک با کلام، نریشن اختصاصی، دوبله و افکت صوتی).
۶. چت‌بات‌های شرکتی و اتوماسیون بیزینس با هوش مصنوعی.

دستورالعمل لحن و پاسخ‌دهی:
- پاسخ‌ها باید کاملاً فارسی، حرفه‌ای، محترمانه، پرانرژی، کاربردی و جذاب باشند.
- اگر کاربر درباره قیمت یا زمان تحویل پرسید، محدوده تخمینی و مزایای تکویکس را با دقت توضیح دهید و کاربر را به ثبت سفارش مستقیم یا پیام به تلگرام @Lawat_kar دعوت کنید.
- اگر کاربر ایده یا سناریو خواست (مثلاً سناریوی ویدیوی تبلیغاتی یا پرامپت)، پرامپت‌ها و سناریوهای خلاقانه با جزییات ارائه دهید.
- برای ساختاردهی زیبا از بولت‌پوینت‌ها و ایموجی‌های مناسب استفاده کنید.
`;

function generateTekvixFallbackResponse(userMessage: string): string {
    const text = userMessage.trim().toLowerCase();

    // 1. Website Development & Admin Panel (Direct answer to screenshot question)
    if (
      text.includes('وب‌سایت') ||
      text.includes('سایت') ||
      text.includes('وبسایت') ||
      text.includes('طراحی سایت') ||
      text.includes('پنل ادمین') ||
      text.includes('برنامه‌نویسی')
    ) {
      return `🌐 **مشاوره و شرایط طراحی وب‌سایت مدرن با هوش مصنوعی در تکویکس:**\n\n` +
        `✅ **زمان تحویل:** بین **۳ الی ۵ روز کاری** (به‌صورت کامل و آماده لانچ)\n` +
        `✅ **تکنولوژی‌ها:** React 19، Tailwind CSS، Node.js، دیتابیس اختصاصی، انیمیشن‌های سه‌بعدی و رابط کاربری کاملاً ریسپانسیو.\n` +
        `✅ **امکانات پنل ادمین اختصاصی:**\n` +
        `  • مدیریت کامل کاربران، سفارشات و تراکنش‌ها\n` +
        `  • آنالیتیکس و نمودارهای زنده بازدید و فروش\n` +
        `  • سیستم اعلان آنی و هماهنگی با ربات تلگرام\n` +
        `  • امنیت پیشرفته و محافظت در برابر نفوذ\n\n` +
        `💡 **برآورد هزینه:** طراحی پایه لندینگ‌پیج از **۴,۵۰۰,۰۰۰ تومان** و پورتال‌های کامل شرکتی/فروشگاهی همراه با پنل ادمین حدود **۶,۸۰۰,۰۰۰ تا ۹,۵۰۰,۰۰۰ تومان** می‌باشد.\n\n` +
        `🚀 برای ثبت پروژه و دریافت مشاوره فوری، روی دکمه **«ثبت سفارش»** در پایین بزنید یا به آیدی تلگرام **@Lawat_kar** پیام دهید!`;
    }

    // 2. Video & Teaser Generation
    if (
      text.includes('ویدیو') ||
      text.includes('تیزر') ||
      text.includes('فیلم') ||
      text.includes('انیمیشن') ||
      text.includes('ریلز') ||
      text.includes('موشن')
    ) {
      return `🎬 **تولید ویدیو و تیزرهای تبلیغاتی 4K با هوش مصنوعی:**\n\n` +
        `✨ **خدمات ویدیویی تکویکس شامل:**\n` +
        `  • نگارش سناریو و استوری‌بورد تبلیغاتی پرکشش و استاندارد\n` +
        `  • رندر کاراکترها و صحنه‌های فوق‌واقع‌گرایانه با کیفیت 4K\n` +
        `  • گویندگی و نریشن طبیعی با لهجه‌های مختلف فارسی و بین‌المللی\n` +
        `  • موسیقی متن و افکت‌های صوتی بدون کپی‌رایت مناسب اینستاگرام و یوتیوب\n\n` +
        `⏱ **زمان تحویل:** ۱ الی ۲ روز کاری\n` +
        `💰 **هزینه:** از ۲,۸۰۰,۰۰۰ تومان بسته به مدت‌زمان تیزر\n\n` +
        `📌 برای شروع ساخت تیزر، ایده یا محصول خود را بفرمایید یا از طریق دکمه ثبت سفارش اقدام کنید.`;
    }

    // 3. Telegram Bot Development
    if (
      text.includes('ربات') ||
      text.includes('بات') ||
      text.includes('تلگرام') ||
      text.includes('bot') ||
      text.includes('telegram')
    ) {
      return `🤖 **طراحی و برنامه‌نویسی ربات‌های هوشمند تلگرام در تکویکس:**\n\n` +
        `🔹 **قابلیت‌های ربات‌های تکویکس:**\n` +
        `  • پاسخگویی ۲۴ ساعته با هسته هوش مصنوعی Gemini و GPT\n` +
        `  • سیستم فروشگاهی با سبد خرید و اتصال به درگاه پرداخت آنلاین\n` +
        `  • ارسال نوتیفیکیشن‌های آنی همراه با دکمه ورود مستقیم به پی‌وی مشتری\n` +
        `  • پنل مدیریت تحت وب یا درون تلگرامی جهت گزارش‌گیری\n\n` +
        `⏱ **زمان تحویل:** ۳ الی ۶ روز کاری\n` +
        `🚀 برای سفارش ربات اختصاصی کسب‌وکارتان، دکمه «ثبت سفارش» را بزنید یا به تلگرام **@Lawat_kar** پیام دهید.`;
    }

    // 4. Image, Graphic & Logo Creation
    if (
      text.includes('تصویر') ||
      text.includes('عکس') ||
      text.includes('لوگو') ||
      text.includes('گرافیک') ||
      text.includes('طراحی') ||
      text.includes('بنر') ||
      text.includes('پوستر')
    ) {
      return `🎨 **خلق تصاویر هنری، لوگو و هویت بصری هوش مصنوعی:**\n\n` +
        `🔹 **خدمات گرافیک تکویکس:**\n` +
        `  • خلق آرت‌ورک‌های فوق‌العاده با رزولوشن 4K و 8K\n` +
        `  • طراحی لوگو و نماد برند با استایل‌های مدرن و مینیمال ۳ بعدی\n` +
        `  • طراحی کاور موزیک، بنر تبلیغاتی، پوستر و پست‌های اینستاگرام\n` +
        `  • تحویل فایل‌ها بدون واترمارک همراه با ادیت نهایی\n\n` +
        `⏱ **زمان تحویل:** چند ساعت تا ۲۴ ساعت\n` +
        `✨ آماده ثبت سفارش شما هستیم!`;
    }

    // 5. Music, Voice, Narration & Dubbing
    if (
      text.includes('موزیک') ||
      text.includes('آهنگ') ||
      text.includes('صدا') ||
      text.includes('دوبله') ||
      text.includes('نریشن') ||
      text.includes('خواننده') ||
      text.includes('ترانه')
    ) {
      return `🎵 **آهنگسازی، ترانه‌سرایی، نریشن و شبیه‌سازی صدا با هوش مصنوعی:**\n\n` +
        `🔹 **امکانات بخش صوت و موسیقی تکویکس:**\n` +
        `  • ساخت موزیک با کلام در سبک‌های پاپ، راک، رپ، سنتی و الکترونیک\n` +
        `  • دوبله و نریشن فوق‌طبیعی متن‌ها و کتاب‌های صوتی با لحن احساسی یا حماسی\n` +
        `  • میکس و مسترینگ حرفه‌ای با بالاترین بیت‌ریت صوتی\n` +
        `  • حق مالکیت ۱۰۰٪ تجاری برای نشر در تمام پلتفرم‌ها\n\n` +
        `🎧 برای شنیدن نمونه‌کارها یا سفارش موزیک اختصاصی، کافیست پیام دهید!`;
    }

    // 6. Pricing & General Inquiries
    if (
      text.includes('قیمت') ||
      text.includes('هزینه') ||
      text.includes('تعرفه') ||
      text.includes('چقدر') ||
      text.includes('سفارش')
    ) {
      return `💎 **لیست تعرفه‌های تخمینی خدمات تکویکس:**\n\n` +
        `• 🌐 **طراحی وب‌سایت مدرن:** از ۴,۵۰۰,۰۰۰ تومان\n` +
        `• 🎬 **تولید تیزر و ویدیوی هوش مصنوعی:** از ۲,۸۰۰,۰۰۰ تومان\n` +
        `• 🤖 **ساخت ربات تلگرام پیشرفته:** از ۳,۵۰۰,۰۰۰ تومان\n` +
        `• 🎨 **خلق تصاویر و بسته گرافیکی 4K:** از ۱,۲۰۰,۰۰۰ تومان\n` +
        `• 🎵 **آهنگسازی و نریشن صوتی:** از ۱,۵۰۰,۰۰۰ تومان\n\n` +
        `🎁 **توجه:** در ایونت افتتاحیه تکویکس، سفارشات واجد شرایط با تخفیف ویژه و هدایای اختصاصی ثبت می‌شوند.\n\n` +
        `همین حالا می‌توانید فرم «ثبت سفارش» را لمس کنید یا مستقیماً به تلگرام **@Lawat_kar** پیام دهید.`;
    }

    // Default High-Grade Response
    return `سلام دوست گرامی! من دستیار هوش مصنوعی **تکویکس (Tekvix AI)** هستم ✨🤖\n\n` +
      `سوالی که پرسیدید («${userMessage}») با دقت بررسی شد.\n\n` +
      `تیم مهندسی تکویکس آماده است تا هر ایده‌ای از **طراحی وب‌سایت مدرن**، **ساخت تیزر ویدیویی 4K**، **توسعه ربات‌های تلگرام** تا **تولید تصاویر و موزیک اختصاصی** را با بالاترین کیفیت برای شما پیاده‌سازی کند.\n\n` +
      `📌 **چطور شروع کنیم؟**\n` +
      `۱. با زدن دکمه **«ثبت سفارش»** در زیر، پروژه خود را در کمتر از ۱ دقیقه ثبت کنید.\n` +
      `۲. یا برای مشاوره صوتی/متنی مستقیم با مهندسین ما، به آیدی تلگرام **@Lawat_kar** پیام دهید.`;
  }


function isCmsResource(value: string): value is CmsResource {
  return (CMS_RESOURCES as readonly string[]).includes(value);
}

function cmsSettingKey(resource: CmsResource): string {
  return 'cms_' + resource;
}

async function readCmsContent(env: Env, resource: CmsResource): Promise<unknown | undefined> {
  const rows = await readRows<{ value?: unknown }>(
    env,
    'site_settings?select=value&setting_key=eq.' + encodeURIComponent(cmsSettingKey(resource)) + '&limit=1',
  );
  return rows[0]?.value;
}

async function readAllCmsContent(env: Env, publicOnly: boolean): Promise<Record<string, unknown>> {
  const content: Record<string, unknown> = {};
  const entries = await Promise.all(CMS_RESOURCES.map(async (resource) => ({
    resource,
    value: await readCmsContent(env, resource),
  })));
  for (const { resource, value } of entries) {
    if (value === undefined || value === null) continue;
    if (publicOnly && resource === 'blogPosts' && Array.isArray(value)) {
      // Public visitors must never receive unpublished draft posts.
      content[resource] = value.filter((post) =>
        post && typeof post === 'object' && (post as Record<string, unknown>).published !== false
      );
    } else {
      content[resource] = value;
    }
  }
  return content;
}

async function saveCmsContent(env: Env, resource: CmsResource, content: unknown): Promise<void> {
  const response = await databaseRequest(env, 'site_settings?on_conflict=setting_key', {
    method: 'POST',
    body: {
      setting_key: cmsSettingKey(resource),
      value: content,
      updated_at: new Date().toISOString(),
    },
    prefer: 'resolution=merge-duplicates,return=minimal',
  });
  if (!response.ok) throw new Error('CMS content save failed with status ' + response.status);
}

async function handleApi(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  if (path === '/api/site-content' && method === 'GET') {
    if (!supabaseReady(env)) return json({ success: true, content: {} });
    try {
      return json({ success: true, content: await readAllCmsContent(env, true) });
    } catch {
      return json({ success: false, error: 'خطا در دریافت محتوای سایت.' }, 502);
    }
  }

  if (path === '/api/admin/content' && method === 'GET') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    if (!supabaseReady(env)) return json({ success: false, error: 'پایگاه داده هنوز تنظیم نشده است.' }, 503);
    try {
      return json({ success: true, content: await readAllCmsContent(env, false) });
    } catch {
      return json({ success: false, error: 'خطا در دریافت محتوای پنل مدیریت.' }, 502);
    }
  }

  const cmsWriteMatch = path.match(/^\/api\/admin\/content\/([A-Za-z]+)$/);
  if (cmsWriteMatch && method === 'PUT') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    const limited = rateLimit(request, 'admin-cms-write', 180, 15 * 60 * 1000);
    if (limited) return limited;
    if (!supabaseReady(env)) return json({ success: false, error: 'پایگاه داده هنوز تنظیم نشده است.' }, 503);
    const resourceName = cmsWriteMatch[1];
    if (!isCmsResource(resourceName)) return json({ success: false, error: 'نوع محتوای درخواستی پشتیبانی نمی‌شود.' }, 404);
    const body = await readJson(request, 250_000);
    if (!body || !Object.prototype.hasOwnProperty.call(body, 'content')) {
      return json({ success: false, error: 'محتوای ارسالی معتبر نیست یا بیش از حد بزرگ است.' }, 400);
    }
    const content = body.content;
    if (CMS_ARRAY_RESOURCES.has(resourceName) && !Array.isArray(content)) {
      return json({ success: false, error: 'محتوا باید یک آرایه معتبر باشد.' }, 400);
    }
    if (resourceName === 'brandInfo' && (!content || typeof content !== 'object' || Array.isArray(content))) {
      return json({ success: false, error: 'اطلاعات برند معتبر نیست.' }, 400);
    }
    if (Array.isArray(content) && content.length > 2000) {
      return json({ success: false, error: 'تعداد آیتم‌های محتوا بیش از حد مجاز است.' }, 400);
    }
    try {
      await saveCmsContent(env, resourceName, content);
      return json({ success: true, resource: resourceName, updatedAt: new Date().toISOString() });
    } catch {
      return json({ success: false, error: 'ذخیره محتوا در پایگاه داده انجام نشد.' }, 502);
    }
  }

  if (path === '/api/health' && method === 'GET') {
    return json({
      status: 'ok',
      service: 'tekvix-worker',
      supabaseConfigured: supabaseReady(env),
      telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN?.trim() && (env.TELEGRAM_CHAT_ID?.trim() || await resolveTelegramChatId(env))),
      serverTime: new Date().toISOString(),
    });
  }


  if (path === '/api/gemini/assistant' && method === 'POST') {
    const limited = rateLimit(request, 'gemini-assistant', 12, 15 * 60 * 1000);
    if (limited) return limited;
    const body = await readJson(request);
    const message = cleanText(body?.message, 6000);
    if (!message) return json({ success: false, error: 'پیام نامعتبر است.' }, 400);

    const fallback = () => json({
      text: generateTekvixFallbackResponse(message),
      success: true,
      isFallback: true,
    });

    const apiKey = env.GEMINI_API_KEY?.trim();
    if (!apiKey) return fallback();

    const history = Array.isArray(body?.history)
      ? body.history.slice(-6).flatMap((item: unknown) => {
          if (!item || typeof item !== 'object') return [];
          const entry = item as Record<string, unknown>;
          if (entry.role !== 'user' && entry.role !== 'model') return [];
          const text = cleanText(entry.text ?? entry.content, 6000);
          return text ? [{ role: entry.role, parts: [{ text }] }] : [];
        })
      : [];
    const contents = [...history, { role: 'user', parts: [{ text: message }] }];

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: TEKVIX_GEMINI_SYSTEM_INSTRUCTION }] },
            generationConfig: { temperature: 0.7 },
          }),
        },
      );
      const data = await response.json().catch(() => null) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      } | null;
      const generatedText = (data?.candidates?.[0]?.content?.parts || [])
        .map((part) => typeof part.text === 'string' ? part.text : '')
        .filter(Boolean)
        .join('\n')
        .trim();
      if (response.ok && generatedText) return json({ text: generatedText, success: true });

      console.error('[TEKVIX] Gemini generation failed with status', response.status);
      return fallback();
    } catch {
      return fallback();
    }
  }

  if (path === '/api/admin/check-session' && method === 'GET') {
    return json({ success: true, authenticated: await isAdminRequest(request, env) });
  }

  if (path === '/api/admin/password-status' && method === 'GET') {
    try {
      const record = await getAdminPasswordRecord(env);
      return json({
        success: true,
        isProtected: record?.scheme === 'pbkdf2-sha256' || Boolean(env.TEKVIX_ADMIN_PASSWORD?.trim()),
        authenticated: await isAdminRequest(request, env),
      });
    } catch {
      return json({ success: false, error: 'خطا در بررسی وضعیت رمز مدیریت.' }, 502);
    }
  }

  if (path === '/api/admin/verify-password' && method === 'POST') {
    const limited = rateLimit(request, 'admin-login', 8, 15 * 60 * 1000);
    if (limited) return limited;
    if (!isSameOrigin(request)) return json({ success: false, valid: false, message: 'درخواست از مبدأ معتبر نیست.' }, 403);
    const body = await readJson(request);
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!password) return json({ success: false, valid: false, message: 'لطفاً رمز عبور را وارد کنید.' }, 400);
    try {
      const record = await getAdminPasswordRecord(env);
      if (record?.scheme !== 'pbkdf2-sha256' && !env.TEKVIX_ADMIN_PASSWORD?.trim()) {
        return json({ success: false, valid: false, message: 'رمز مدیریت هنوز تنظیم نشده است؛ ابتدا Secret با نام TEKVIX_ADMIN_PASSWORD را در Cloudflare اضافه کنید.' }, 503);
      }
      if (!(await verifyAdminPassword(env, password))) {
        return json({ success: false, valid: false, message: 'رمز عبور وارد شده نادرست است.' }, 401);
      }
      const token = await createAdminCookie(env);
      return new Response(JSON.stringify({ success: true, valid: true, message: 'ورود با موفقیت انجام شد.' }), {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
          'set-cookie': sessionCookie(token, ADMIN_SESSION_TTL_SECONDS),
          'x-content-type-options': 'nosniff',
        },
      });
    } catch {
      return json({ success: false, valid: false, message: 'خطا در بررسی رمز مدیریت.' }, 502);
    }
  }

  if (path === '/api/admin/logout' && method === 'POST') {
    if (!isSameOrigin(request)) return json({ success: false, error: 'درخواست از مبدأ معتبر نیست.' }, 403);
    return new Response(JSON.stringify({ success: true, message: 'خروج از پنل مدیریت با موفقیت انجام شد.' }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'set-cookie': sessionCookie('', 0),
        'x-content-type-options': 'nosniff',
      },
    });
  }

  if (path === '/api/admin/change-password' && method === 'POST') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    const body = await readJson(request);
    const oldPassword = typeof body?.oldPassword === 'string' ? body.oldPassword : '';
    const newPassword = typeof body?.newPassword === 'string' ? normalizeAdminPassword(body.newPassword) : '';
    if (!oldPassword || !newPassword) return json({ success: false, message: 'رمز عبور فعلی و جدید الزامی هستند.' }, 400);
    if (newPassword.length < 8 || newPassword.length > 256) return json({ success: false, message: 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد.' }, 400);
    try {
      if (!(await verifyAdminPassword(env, oldPassword))) return json({ success: false, message: 'رمز عبور فعلی نادرست است.' }, 400);
      await saveAdminPasswordRecord(env, newPassword);
      return json({ success: true, message: 'رمز عبور پنل مدیریت با موفقیت تغییر یافت.' });
    } catch {
      return json({ success: false, message: 'خطا در ذخیره رمز مدیریت؛ تنظیمات پایگاه داده را بررسی کنید.' }, 502);
    }
  }

  if (path === '/api/admin/stats' && method === 'GET') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    try {
      const stats = await buildAdminStats(env);
      return json({ success: true, stats, timestamp: new Date().toISOString() });
    } catch {
      return json({ success: false, error: 'خطا در دریافت آمار پنل مدیریت.' }, 502);
    }
  }

  if (path === '/api/site/stats' && method === 'GET') {
    try {
      const [orders, events] = await Promise.all([
        readRows<StoredOrder>(env, 'orders?select=id,status,created_at&order=created_at.desc&limit=5000'),
        readRows<{ id: string; event_type: string; created_at: string }>(env, 'analytics_events?select=id,event_type,created_at&limit=5000'),
      ]);
      const activeOrders = orders.filter((o) => o.status === 'new' || o.status === 'in_progress').length;
      const completedOrders = orders.filter((o) => o.status === 'completed').length;
      return json({
        success: true,
        stats: {
          activeOnlineUsers: 0,
          totalCompletedProjects: completedOrders,
          totalSatisfiedClients: completedOrders,
          aiModelsActive: 6,
          platformUptime: '—',
          averageResponseTime: '—',
          liveOrdersCount: activeOrders,
          totalViews: events.filter((e) => e.event_type === 'page_view').length,
          lastUpdated: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch {
      return json({ success: false, error: 'خطا در دریافت آمار وب‌سایت.' }, 502);
    }
  }


  if (path === '/api/users' && method === 'GET') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    try {
      const rows = await readRows<Record<string, unknown>>(env, 'user_profiles?select=*&order=created_at.desc&limit=5000');
      const users = rows.map((row) => ({
        id: String(row.id || ''),
        name: String(row.name || ''),
        email: String(row.email || ''),
        phone: String(row.phone || ''),
        telegram: String(row.telegram || ''),
        avatar: String(row.avatar || ''),
        bio: String(row.bio || ''),
        provider: String(row.provider || 'email'),
        role: row.role === 'admin' ? 'admin' : 'client',
        joinedAt: String(row.created_at || ''),
        lastLoginAt: String(row.last_login_at || ''),
      }));
      return json({ success: true, users, count: users.length });
    } catch {
      return json({ success: false, error: 'خطا در دریافت کاربران.' }, 502);
    }
  }

  if (path === '/api/users' && method === 'POST') {
    const limited = rateLimit(request, 'user-profile', 20, 15 * 60 * 1000);
    if (limited) return limited;
    const body = await readJson(request);
    const id = cleanSingleLine(body?.id, 100);
    const name = cleanSingleLine(body?.name, 100);
    const email = cleanSingleLine(body?.email, 160).toLowerCase();
    if (!id || !name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ success: false, error: 'شناسه، نام و ایمیل معتبر الزامی هستند.' }, 400);
    }
    try {
      const existing = await readRows<Record<string, unknown>>(env, 'user_profiles?select=id,role&id=eq.' + encodeURIComponent(id) + '&limit=1');
      if (existing[0]?.role === 'admin') {
        return json({ success: false, error: 'تغییر حساب مدیریت از این مسیر مجاز نیست.' }, 403);
      }
      const now = new Date().toISOString();
      const row = {
        id,
        auth_user_id: null,
        name,
        email,
        phone: cleanSingleLine(body?.phone, 40),
        telegram: cleanSingleLine(body?.telegram, 60),
        avatar: cleanSingleLine(body?.avatar, 500),
        bio: cleanText(body?.bio, 500),
        provider: body?.provider === 'google' ? 'google' : 'email',
        role: 'user',
        updated_at: now,
        last_login_at: now,
      };
      const response = await databaseRequest(env, 'user_profiles?on_conflict=id', {
        method: 'POST',
        body: row,
        prefer: 'resolution=merge-duplicates,return=representation',
      });
      if (!response.ok) throw new Error('Profile write failed');
      const rows = await response.json() as Record<string, unknown>[];
      const saved = (rows[0] || row) as Record<string, unknown>;
      return json({
        success: true,
        user: {
          id: saved.id, name: saved.name, email: saved.email, phone: saved.phone,
          telegram: saved.telegram, avatar: saved.avatar, bio: saved.bio,
          provider: saved.provider, role: saved.role === 'admin' ? 'admin' : 'client',
          joinedAt: String(saved.created_at || now), lastLoginAt: String(saved.last_login_at || now),
        },
      });
    } catch {
      return json({ success: false, error: 'خطا در ثبت اطلاعات کاربر.' }, 502);
    }
  }

  if (path === '/api/orders' && method === 'GET') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    try {
      const rows = await readRows<StoredOrder>(env, 'orders?select=*&order=created_at.desc&limit=5000');
      return json({ success: true, orders: rows.map(storedOrderToClient), count: rows.length });
    } catch {
      return json({ success: false, error: 'خطا در دریافت سفارش‌ها.' }, 502);
    }
  }

  if (path === '/api/opening-event/config' && method === 'POST') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    const body = await readJson(request);
    if (!body) return json({ success: false, error: 'تنظیمات ایونت معتبر نیست.' }, 400);
    const defaults = defaultOpeningConfig();
    const config = {
      isActive: typeof body.isActive === 'boolean' ? body.isActive : defaults.isActive,
      title: cleanSingleLine(body.title, 160, String(defaults.title)),
      subtitle: cleanText(body.subtitle, 500, String(defaults.subtitle)),
      badgeText: cleanSingleLine(body.badgeText, 100, String(defaults.badgeText)),
      highlightText: cleanSingleLine(body.highlightText, 160, String(defaults.highlightText)),
      description: cleanText(body.description, 1500, String(defaults.description)),
      startDate: typeof body.startDate === 'string' && Number.isFinite(Date.parse(body.startDate)) ? new Date(body.startDate).toISOString() : String(defaults.startDate),
      endDate: typeof body.endDate === 'string' && Number.isFinite(Date.parse(body.endDate)) ? new Date(body.endDate).toISOString() : String(defaults.endDate),
      maxWinners: Number.isInteger(Number(body.maxWinners)) ? Math.max(0, Math.min(1000, Number(body.maxWinners))) : Number(defaults.maxWinners),
      termsNote: cleanText(body.termsNote, 1000, String(defaults.termsNote)),
    };
    if (Date.parse(config.endDate) < Date.parse(config.startDate)) return json({ success: false, error: 'زمان پایان باید بعد از زمان شروع باشد.' }, 400);
    try {
      const response = await databaseRequest(env, 'opening_event_config?on_conflict=singleton_id', {
        method: 'POST',
        body: { singleton_id: 'default', config, updated_at: new Date().toISOString() },
        prefer: 'resolution=merge-duplicates,return=minimal',
      });
      if (!response.ok) throw new Error('Write failed');
      return json({ success: true, config, event: await getOpeningEvent(env) });
    } catch {
      return json({ success: false, error: 'خطا در ذخیره تنظیمات ایونت افتتاحیه.' }, 502);
    }
  }

  if (path === '/api/telegram/test-bot' && (method === 'POST' || method === 'GET')) {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    const limited = rateLimit(request, 'telegram-test', 5, 15 * 60 * 1000);
    if (limited) return limited;
    const token = env.TELEGRAM_BOT_TOKEN?.trim();
    if (!token) return json({ success: false, error: 'توکن ربات تنظیم نشده است.' }, 503);
    try {
      const response = await fetch('https://api.telegram.org/bot' + token + '/getMe');
      const data = await response.json().catch(() => null) as {
        ok?: boolean;
        result?: { id?: number; is_bot?: boolean; first_name?: string; username?: string };
      } | null;
      if (!response.ok || data?.ok !== true || !data.result) {
        return json({ success: false, status: 'error', error: 'توکن ربات معتبر نیست.' }, 502);
      }
      const sent = await sendTelegram(env, '✅ اتصال ربات تلگرام TEKVIX برقرار است.');
      if (!sent) {
        return json({
          success: false,
          status: 'error',
          telegramSent: false,
          error: 'توکن معتبر است، اما ارسال پیام انجام نشد؛ Chat ID و شروع گفت‌وگو با ربات را بررسی کن.',
        }, 502);
      }
      return json({
        success: true,
        status: 'online',
        telegramSent: true,
        message: 'پیام تست با موفقیت ارسال شد!',
        bot: data.result,
      });
    } catch {
      return json({ success: false, status: 'error', error: 'ارتباط با تلگرام برقرار نشد.' }, 502);
    }
  }

  if (path === '/api/orders' && method === 'POST') {
    const limited = rateLimit(request, 'order-submit', 15, 15 * 60 * 1000);
    if (limited) return limited;
    if (!supabaseReady(env)) return json({ success: false, error: 'سرویس ثبت سفارش هنوز تنظیم نشده است.' }, 503);

    const body = await readJson(request);
    if (!body) return json({ success: false, error: 'بدنهٔ درخواست معتبر نیست یا بیش از حد بزرگ است.' }, 400);
    const row = makeOrderRow(body as OrderInput);
    if (!row) return json({ success: false, error: 'نام، راه ارتباطی و خدمت الزامی‌اند؛ کد سفارش نیز باید معتبر باشد.' }, 400);

    try {
      const saved = await insertOrder(env, row);
      if (!saved) return json({ success: false, error: 'شناسه سفارش تکراری است؛ لطفاً دوباره ثبت کنید.' }, 409);
      return json({ success: true, order: orderToClient(saved) }, 201);
    } catch {
      return json({ success: false, error: 'ثبت سفارش در پایگاه داده انجام نشد. لطفاً دوباره تلاش کنید.' }, 502);
    }
  }

  if (path.startsWith('/api/orders/track/') && method === 'GET') {
    const encodedQuery = path.slice('/api/orders/track/'.length);
    let query = '';
    try {
      query = decodeURIComponent(encodedQuery).trim();
    } catch {
      return json({ success: false, error: 'کد رهگیری معتبر نیست.', orders: [] }, 400);
    }
    // Public tracking accepts order IDs only; phone/Telegram searches can expose
    // another customer's order details.
    if (!/^ORD-\d{4,20}(?:-(?:\d{1,6}|[a-f0-9]{32}))?$/i.test(query)) {
      return json({ success: true, count: 0, orders: [] });
    }
    if (!supabaseReady(env)) return json({ success: false, error: 'سرویس رهگیری هنوز تنظیم نشده است.', orders: [] }, 503);
    try {
      const response = await databaseRequest(
        env,
        'orders?select=id,service_title,status,created_at,price_quoted,is_promo_event&id=eq.' + encodeURIComponent(query.toUpperCase()) + '&limit=1',
      );
      if (!response.ok) {
        console.error('[TEKVIX] Order tracking read failed with status', response.status);
        return json({ success: false, error: 'خطا در رهگیری سفارش.', orders: [] }, 502);
      }
      const rows = await response.json() as Array<{
        id: string;
        service_title: string;
        status: string;
        created_at: string;
        price_quoted: string;
        is_promo_event: boolean;
      }>;
      const orders = (Array.isArray(rows) ? rows : []).map((row) => ({
        id: row.id,
        serviceTitle: row.service_title,
        status: row.status,
        createdAt: row.created_at,
        priceQuoted: row.price_quoted,
        isPromoEvent: row.is_promo_event,
        contactMasked: '',
      }));
      return json({ success: true, count: orders.length, orders });
    } catch {
      return json({ success: false, error: 'خطا در رهگیری سفارش.', orders: [] }, 502);
    }
  }


  const orderDetailMatch = path.match(/^\/api\/orders\/([^/]+)$/);
  if (orderDetailMatch && method === 'GET') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    let id = '';
    try { id = decodeURIComponent(orderDetailMatch[1]); } catch { return json({ success: false, error: 'شناسه سفارش معتبر نیست.' }, 400); }
    try {
      const rows = await readRows<StoredOrder>(env, 'orders?select=*&id=eq.' + encodeURIComponent(id) + '&limit=1');
      if (!rows[0]) return json({ success: false, error: 'سفارش یافت نشد.' }, 404);
      return json({ success: true, order: storedOrderToClient(rows[0]) });
    } catch {
      return json({ success: false, error: 'خطا در دریافت سفارش.' }, 502);
    }
  }

  if (orderDetailMatch && method === 'PATCH') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    const body = await readJson(request);
    if (!body) return json({ success: false, error: 'اطلاعات ویرایش معتبر نیست.' }, 400);
    let id = '';
    try { id = decodeURIComponent(orderDetailMatch[1]); } catch { return json({ success: false, error: 'شناسه سفارش معتبر نیست.' }, 400); }
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.status !== undefined) {
      if (!['new', 'in_progress', 'completed', 'cancelled'].includes(String(body.status))) return json({ success: false, error: 'وضعیت سفارش معتبر نیست.' }, 400);
      updates.status = body.status;
    }
    const fields: Array<[string, string, number]> = [
      ['adminNotes', 'admin_notes', 2000],
      ['fullName', 'full_name', 100],
      ['telegramOrPhone', 'telegram_or_phone', 100],
      ['serviceId', 'service_id', 80],
      ['serviceTitle', 'service_title', 120],
      ['message', 'message', 2000],
      ['priceQuoted', 'price_quoted', 80],
      ['promoEventName', 'promo_event_name', 150],
      ['userEmail', 'user_email', 120],
    ];
    for (const [from, to, max] of fields) {
      if (body[from] !== undefined) updates[to] = cleanText(body[from], max);
    }
    if (body.isPromoEvent !== undefined) updates.is_promo_event = body.isPromoEvent === true;
    if (Object.keys(updates).length === 1) return json({ success: false, error: 'هیچ فیلد قابل ویرایشی ارسال نشده است.' }, 400);
    try {
      const response = await databaseRequest(env, 'orders?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH', body: updates, prefer: 'return=representation',
      });
      if (!response.ok) throw new Error('Update failed');
      const rows = await response.json() as StoredOrder[];
      if (!rows[0]) return json({ success: false, error: 'سفارش یافت نشد.' }, 404);
      return json({ success: true, order: storedOrderToClient(rows[0]) });
    } catch {
      return json({ success: false, error: 'خطا در به‌روزرسانی سفارش.' }, 502);
    }
  }

  if (orderDetailMatch && method === 'DELETE') {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;
    let id = '';
    try { id = decodeURIComponent(orderDetailMatch[1]); } catch { return json({ success: false, error: 'شناسه سفارش معتبر نیست.' }, 400); }
    try {
      const response = await databaseRequest(env, 'orders?id=eq.' + encodeURIComponent(id), { method: 'DELETE', prefer: 'return=representation' });
      if (!response.ok) throw new Error('Delete failed');
      const rows = await response.json() as unknown[];
      return json({ success: rows.length > 0 });
    } catch {
      return json({ success: false, error: 'خطا در حذف سفارش.' }, 502);
    }
  }

  if (path === '/api/telegram/send-order' && method === 'POST') {
    const limited = rateLimit(request, 'telegram-order', 8, 15 * 60 * 1000);
    if (limited) return limited;
    if (!supabaseReady(env)) return json({ success: false, telegramSent: false, message: 'پایگاه داده هنوز تنظیم نشده است.' }, 503);

    const body = await readJson(request);
    if (!body || !body.order || typeof body.order !== 'object' || Array.isArray(body.order)) {
      return json({ success: false, telegramSent: false, message: 'اطلاعات سفارش معتبر نیست.' }, 400);
    }
    const row = makeOrderRow(body.order as OrderInput);
    if (!row) return json({ success: false, telegramSent: false, message: 'اطلاعات اصلی سفارش ناقص است.' }, 400);

    try {
      // Save only if the order does not already exist. This avoids overwriting
      // server-side fields when the two frontend requests arrive concurrently.
      const saved = await findOrInsertOrder(env, row);
      const telegramSent = await sendTelegram(env, orderMessage(saved));
      return json({
        success: true,
        telegramSent,
        message: telegramSent
          ? 'سفارش ذخیره شد و اعلان به تلگرام ارسال شد.'
          : 'سفارش در دیتابیس ذخیره شد، اما اعلان تلگرام ارسال نشد. تنظیمات توکن و Chat ID را بررسی کنید.',
        orderId: saved.id,
      });
    } catch {
      return json({ success: false, telegramSent: false, message: 'ثبت سفارش در پایگاه داده انجام نشد.' }, 502);
    }
  }

  if (path === '/api/telegram/send-consultation' && method === 'POST') {
    const limited = rateLimit(request, 'telegram-consultation', 5, 15 * 60 * 1000);
    if (limited) return limited;
    const body = await readJson(request);
    if (!body) return json({ success: false, telegramSent: false, message: 'اطلاعات درخواست معتبر نیست.' }, 400);
    const name = cleanSingleLine(body.name, 100);
    const contact = cleanSingleLine(body.contactInfo, 100);
    const topic = cleanSingleLine(body.topic, 120);
    const message = cleanText(body.message, 2000);
    if (!name || !contact || !message) {
      return json({ success: false, telegramSent: false, message: 'نام، راه ارتباطی و توضیحات الزامی‌اند.' }, 400);
    }
    const sent = await sendTelegram(env, [
      '💬 درخواست مشاوره جدید TEKVIX',
      'نام: ' + name,
      'راه ارتباطی: ' + contact,
      topic ? 'موضوع: ' + topic : '',
      'توضیحات: ' + message,
    ].filter(Boolean).join('\n'));
    return json({
      success: true,
      telegramSent: sent,
      message: sent ? 'درخواست مشاوره به تلگرام ارسال شد.' : 'ارتباط با تلگرام برقرار نشد؛ تنظیمات ربات را بررسی کنید.',
    });
  }

  if (path === '/api/telegram/status' && method === 'GET') {
    const token = env.TELEGRAM_BOT_TOKEN?.trim();
    if (!token) {
      return json({ success: false, online: false, error: 'توکن ربات در تنظیمات سرور ثبت نشده است.', pollingActive: false }, 503);
    }
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await response.json().catch(() => null) as {
        ok?: boolean;
        result?: { id?: number; is_bot?: boolean; first_name?: string; username?: string };
      } | null;
      if (!response.ok || data?.ok !== true || !data.result) {
        return json({ success: false, online: false, error: 'توکن ربات معتبر نیست یا تلگرام پاسخ موفق نداد.', pollingActive: false }, 502);
      }
      return json({
        success: true,
        online: true,
        bot: data.result,
        configured: Boolean(await resolveTelegramChatId(env)),
        pollingActive: false,
      });
    } catch {
      return json({ success: false, online: false, error: 'ارتباط با تلگرام برقرار نشد.', pollingActive: false }, 502);
    }
  }

  if (path === '/api/analytics/event' && method === 'POST') {
    const limited = rateLimit(request, 'analytics-event', 120, 15 * 60 * 1000);
    if (limited) return limited;
    if (!supabaseReady(env)) return json({ success: false, error: 'Analytics is not configured.' }, 503);
    const body = await readJson(request);
    if (!body) return json({ success: false, error: 'Invalid event payload.' }, 400);
    const eventType = cleanSingleLine(body.eventType, 80);
    if (!eventType) return json({ success: false, error: 'eventType الزامی است.' }, 400);

    const deviceValue = cleanSingleLine(body.device, 16).toLowerCase();
    const device = ['mobile', 'desktop', 'tablet', 'unknown'].includes(deviceValue) ? deviceValue : 'unknown';
    const meta = body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
      ? body.metadata as Record<string, unknown>
      : {};
    // Never persist direct identifiers in analytics metadata.
    const safeMetadata: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(meta).slice(0, 20)) {
      if (!/name|phone|contact|email|token|password|message/i.test(key)) {
        if (['string', 'number', 'boolean'].includes(typeof value)) safeMetadata[key.slice(0, 40)] = typeof value === 'string' ? value.slice(0, 200) : value;
      }
    }
    const numericValue = Number(body.value);
    const row = {
      id: crypto.randomUUID(),
      event_type: eventType,
      path: cleanSingleLine(body.path || body.page, 300, '/'),
      service_id: cleanSingleLine(body.serviceId, 80) || null,
      device,
      referrer: cleanSingleLine(body.referrer, 500) || null,
      value: Number.isFinite(numericValue) ? numericValue : 0,
      metadata: safeMetadata,
    };
    try {
      const response = await databaseRequest(env, 'analytics_events', {
        method: 'POST',
        body: row,
        prefer: 'return=minimal',
      });
      if (!response.ok) {
        console.error('[TEKVIX] Analytics write failed with status', response.status);
        return json({ success: false, error: 'Failed to record event.' }, 502);
      }
      return json({ success: true });
    } catch {
      return json({ success: false, error: 'Failed to record event.' }, 502);
    }
  }

  if (path === '/api/opening-event' && method === 'GET') {
    let config = defaultOpeningConfig();
    if (supabaseReady(env)) {
      try {
        const response = await databaseRequest(env, 'opening_event_config?select=config&singleton_id=eq.default');
        if (response.ok) {
          const data = await response.json() as Array<{ config?: unknown }>;
          const candidate = data?.[0]?.config;
          if (candidate && typeof candidate === 'object' && !Array.isArray(candidate) && Object.keys(candidate as object).length > 0) {
            config = { ...config, ...(candidate as Record<string, unknown>) };
          }
        }
      } catch {
        // The UI has a local default; keep the API resilient if the table is temporarily unavailable.
      }
    }
    const now = Date.now();
    const start = Date.parse(String(config.startDate));
    const end = Date.parse(String(config.endDate));
    return json({
      success: true,
      event: {
        config,
        isCurrentlyOpen: config.isActive === true && Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end,
      },
    });
  }

  return null;
}

const HALLOWEEN_PUMPKIN_INJECTION = String.raw`<style id="tekvix-living-pumpkin-style">
#hero-section .tk-halloween-pumpkin-host {
  border-radius: 47% 53% 48% 49% / 43% 47% 53% 55% !important;
  background:
    radial-gradient(ellipse at 48% 35%, rgba(255, 154, 57, .29), transparent 48%),
    radial-gradient(ellipse at 55% 70%, rgba(255, 67, 25, .2), transparent 55%),
    linear-gradient(145deg, #29102a 0%, #160817 55%, #07040c 100%) !important;
  border-color: rgba(255, 146, 65, .78) !important;
  box-shadow: 0 0 0 1px rgba(255, 121, 46, .16), 0 0 52px rgba(255, 76, 24, .33), 0 0 110px rgba(124, 58, 237, .23), inset 0 1px 0 rgba(255, 230, 195, .12), inset -24px -28px 60px rgba(0, 0, 0, .78) !important;
}
#hero-section .tk-halloween-pumpkin-host .halloween-orb-wordmark,
#hero-section .tk-halloween-pumpkin-host span.tk-halloween-hidden-wordmark {
  opacity: 0 !important;
  transform: scale(.7);
  filter: blur(5px);
}
.tk-tekvix-living-pumpkin {
  position: absolute;
  inset: -3%;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  pointer-events: none;
  animation: tk-pumpkin-enter 1.25s cubic-bezier(.16,.82,.22,1) both;
}
.tk-tekvix-living-pumpkin svg {
  display: block;
  width: 108%;
  height: 108%;
  overflow: visible;
  transform-origin: 50% 57%;
  filter: drop-shadow(0 9px 14px rgba(0,0,0,.55));
  animation: tk-pumpkin-alive 4.7s ease-in-out 1.2s infinite;
}
.tk-pumpkin-eye-cut { fill: #190613; stroke: #40101d; stroke-width: 2.4; stroke-linejoin: round; filter: drop-shadow(0 0 8px rgba(255, 96, 38, .86)); animation: tk-pumpkin-flicker 4.4s ease-in-out infinite; }
.tk-pumpkin-eye-glint { fill: #fff0b7; filter: drop-shadow(0 0 5px #ffbd58); }
.tk-pumpkin-mouth-cut { fill: #170511; stroke: #3b0d20; stroke-width: 3; stroke-linejoin: round; filter: drop-shadow(0 0 7px rgba(255, 80, 28, .62)); }
.tk-pumpkin-teeth { fill: #ffe1a0; stroke: #fff0c3; stroke-width: 1.1; stroke-linejoin: round; filter: drop-shadow(0 0 4px rgba(255,132,40,.8)); }
.tk-pumpkin-rib { fill: none; stroke: #bd482b; stroke-width: 12; stroke-linecap: round; opacity: .82; }
.tk-pumpkin-rib.thin { stroke-width: 7; opacity: .66; }
.tk-pumpkin-aura {
  position: absolute;
  inset: 12% 9% 4%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255,91,23,.28), rgba(132,41,141,.12) 48%, transparent 72%);
  filter: blur(12px);
  animation: tk-pumpkin-aura-pulse 3.6s ease-in-out infinite;
}
@keyframes tk-pumpkin-enter {
  0% { opacity: 0; transform: scale(.42) rotate(-14deg); filter: blur(10px); }
  48% { opacity: 1; transform: scale(1.07) rotate(3deg); filter: blur(0); }
  70% { transform: scale(.97) rotate(-1.5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
}
@keyframes tk-pumpkin-alive {
  0%,100% { transform: translate3d(0,0,0) rotate(0) scale(1); }
  22% { transform: translate3d(0,-3px,0) rotate(-1.1deg) scale(1.012); }
  49% { transform: translate3d(0,1px,0) rotate(.9deg) scale(1.025); }
  74% { transform: translate3d(0,-2px,0) rotate(1.3deg) scale(1.01); }
}
@keyframes tk-pumpkin-flicker {
  0%,7%,10%,48%,51%,100% { opacity: 1; }
  8%,49% { opacity: .52; }
}
@keyframes tk-pumpkin-aura-pulse {
  0%,100% { opacity: .35; transform: scale(.92); }
  50% { opacity: .92; transform: scale(1.08); }
}
@media (max-width: 640px) {
  .tk-tekvix-living-pumpkin { inset: 1%; }
  .tk-tekvix-living-pumpkin svg { width: 112%; height: 112%; }
}
@media (prefers-reduced-motion: reduce) {
  .tk-tekvix-living-pumpkin,
  .tk-tekvix-living-pumpkin svg,
  .tk-tekvix-living-pumpkin * ,
  .tk-pumpkin-aura { animation: none !important; }
}
</style>
<script>
(function () {
  if (window.__tekvixLivingPumpkinInstalled) return;
  window.__tekvixLivingPumpkinInstalled = true;
  var now = new Date();
  var month = now.getMonth();
  var day = now.getDate();
  var inHalloweenWindow = (month === 9 && day >= 29 && day <= 31) || (month === 10 && day >= 1 && day <= 2);
  if (!inHalloweenWindow) return;

  var pumpkinSvg = '<svg viewBox="0 0 260 240" role="img" aria-label="کدوی زنده هالووین تکویکس" focusable="false">' +
    '<defs>' +
      '<radialGradient id="tkPumpkinSkin" cx="43%" cy="29%" r="78%"><stop offset="0%" stop-color="#ffbf70"/><stop offset="27%" stop-color="#ff922f"/><stop offset="61%" stop-color="#ec591f"/><stop offset="87%" stop-color="#a72b2b"/><stop offset="100%" stop-color="#421025"/></radialGradient>' +
      '<linearGradient id="tkPumpkinStem" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c2c875"/><stop offset="48%" stop-color="#687c3d"/><stop offset="100%" stop-color="#20372b"/></linearGradient>' +
      '<linearGradient id="tkPumpkinRib" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6d192b" stop-opacity=".72"/><stop offset="42%" stop-color="#ffca74" stop-opacity=".08"/><stop offset="100%" stop-color="#571328" stop-opacity=".82"/></linearGradient>' +
      '<filter id="tkPumpkinGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '</defs>' +
    '<ellipse cx="130" cy="217" rx="84" ry="12" fill="#000" opacity=".5"/>' +
    '<path d="M130 45 C109 29 82 34 65 53 C42 47 26 66 23 91 C17 124 37 161 68 179 C87 190 109 193 130 186 C151 193 173 190 192 179 C223 161 243 124 237 91 C234 66 218 47 195 53 C178 34 151 29 130 45Z" fill="url(#tkPumpkinSkin)" stroke="#ff9b45" stroke-width="2.5"/>' +
    '<path class="tk-pumpkin-rib" d="M130 46 C104 66 100 103 105 132 C109 159 119 178 130 186"/>' +
    '<path class="tk-pumpkin-rib" d="M130 46 C156 66 160 103 155 132 C151 159 141 178 130 186"/>' +
    '<path class="tk-pumpkin-rib thin" d="M65 53 C78 78 80 113 83 137 C87 158 101 177 114 184"/>' +
    '<path class="tk-pumpkin-rib thin" d="M195 53 C182 78 180 113 177 137 C173 158 159 177 146 184"/>' +
    '<path d="M56 78 C42 110 55 143 76 161" fill="none" stroke="#ffe0a2" stroke-opacity=".46" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M118 48 C111 35 121 20 139 12 C136 28 147 37 143 49 C134 47 126 49 118 55Z" fill="url(#tkPumpkinStem)" stroke="#aeb96b" stroke-width="2" stroke-linejoin="round"/>' +
    '<path class="tk-pumpkin-eye-cut" d="M60 91 L94 70 L108 101 L84 112Z"/>' +
    '<path class="tk-pumpkin-eye-cut" d="M152 101 L166 70 L200 91 L176 112Z"/>' +
    '<path class="tk-pumpkin-eye-glint" d="M69 91 L91 78 L99 95Z"/>' +
    '<path class="tk-pumpkin-eye-glint" d="M163 95 L171 78 L193 91Z"/>' +
    '<path d="M120 106 L133 124 L109 128Z" fill="#32101c" stroke="#61202b" stroke-width="2"/>' +
    '<path class="tk-pumpkin-mouth-cut" d="M56 132 L80 133 L98 126 L112 141 L130 132 L147 142 L166 128 L204 130 L188 158 L166 177 L142 188 L125 190 L103 183 L79 165Z"/>' +
    '<path class="tk-pumpkin-teeth" d="M70 136 L83 138 L97 132 L111 146 L126 138 L143 148 L164 134 L187 135 L174 151 L158 157 L143 154 L130 166 L114 157 L98 159 L84 151Z"/>' +
    '<path class="tk-pumpkin-teeth" d="M95 181 L104 163 L119 171 L132 160 L145 175 L157 167 L153 185 L137 191 L119 190Z"/>' +
    '<path d="M180 56 L172 70 L182 75 L174 88" fill="none" stroke="#72222a" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="49" cy="122" r="2.4" fill="#ffd08c" filter="url(#tkPumpkinGlow)"/><circle cx="207" cy="118" r="2" fill="#ffd08c" filter="url(#tkPumpkinGlow)"/>' +
  '</svg>';

  function applyPumpkin() {
    var hero = document.querySelector("#hero-section");
    var orb = hero && hero.querySelector(".animate-orb-breathe");
    if (!orb) return false;
    orb.classList.add("tk-halloween-pumpkin-host");
    var wordmark = Array.prototype.slice.call(orb.querySelectorAll("span")).find(function (item) {
      return (item.textContent || "").trim() === "TEKVIX Ai";
    });
    if (wordmark) wordmark.classList.add("tk-halloween-hidden-wordmark");
    var existing = orb.querySelector(".halloween-pumpkin-overlay");
    if (existing) {
      existing.classList.add("tk-tekvix-living-pumpkin");
      existing.style.setProperty("opacity", "1", "important");
      existing.style.setProperty("transform", "none", "important");
      return true;
    }
    if (orb.querySelector(".tk-tekvix-living-pumpkin")) return true;
    var wrap = document.createElement("div");
    wrap.className = "tk-tekvix-living-pumpkin";
    wrap.setAttribute("aria-label", "کدوی متحرک هالووین تکویکس");
    wrap.innerHTML = pumpkinSvg + '<span class="tk-pumpkin-aura" aria-hidden="true"></span>';
    orb.appendChild(wrap);
    return true;
  }

  function startPumpkin() {
    var root = document.getElementById("root");
    if (root && root.firstElementChild) root.firstElementChild.classList.add("halloween-mode");
    if (applyPumpkin()) return;
    if (document.documentElement && window.MutationObserver) {
      var observer = new MutationObserver(function () {
        if (applyPumpkin()) observer.disconnect();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      window.setTimeout(function () { observer.disconnect(); }, 30000);
    }
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      if (applyPumpkin() || attempts >= 80) window.clearInterval(timer);
    }, 250);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startPumpkin, { once: true });
  else startPumpkin();
})();
</script>
<style id="tekvix-haunted-world-style">
/* Replace the stray sci-fi props with a balanced, low-noise Halloween scene. */
.halloween-mode .page-ship,
.halloween-mode .page-meteor,
.halloween-mode #hero-section .hero-meteor {
  display: none !important;
  opacity: 0 !important;
}
.halloween-mode #hero-section [class*="border-cyan-400"] {
  border-color: rgba(126, 98, 192, .22) !important;
}
.halloween-mode #hero-section .animate-orbit,
.halloween-mode #hero-section .animate-orbit-reverse {
  opacity: .56;
}
.halloween-mode #hero-section .animate-pulse-slow {
  animation-duration: 9s !important;
  opacity: .28;
}
.halloween-mode #hero-section .animate-cosmic-corona {
  background: radial-gradient(circle, rgba(255, 111, 35, .18), rgba(124, 58, 237, .12) 52%, transparent 74%) !important;
}
/* Halloween art direction: remove the old sci-fi props that collide with the hero copy. */
.halloween-mode .page-ship { display: none !important; }
.halloween-mode #hero-section .animate-orbit,
.halloween-mode #hero-section .animate-orbit-reverse {
  opacity: .28 !important;
  border-color: rgba(255, 147, 72, .14) !important;
}
.halloween-mode #hero-section .animate-orbit > div { opacity: .42; }
.halloween-mode #hero-section .hero-meteor { opacity: .35; }
.tk-haunted-world-stage { position: relative !important; isolation: isolate; }
.tk-haunted-3d-layer {
  position: absolute;
  inset: 0;
  z-index: 20;

  overflow: visible;
  pointer-events: none;
  contain: layout paint;
}
.tk-haunted-3d-ready .tk-tekvix-living-pumpkin,
.tk-haunted-3d-ready .halloween-pumpkin-overlay { display: none !important; }
.tk-haunted-3d-layer canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.tk-haunt-fallback {
  position: absolute;
  inset: 0;
  z-index: 20;
  overflow: visible;
  pointer-events: none;
  perspective: 700px;
  transform-style: preserve-3d;
}
.tk-haunt-prop {
  position: absolute;
  display: block;
  width: clamp(34px, 8vw, 58px);
  height: clamp(38px, 9vw, 64px);
  filter: drop-shadow(0 0 13px rgba(166, 104, 255, .55));
  transform-style: preserve-3d;
  will-change: transform;
  user-select: none;
  contain: layout style;
}
.tk-haunt-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.tk-haunt-ghost { top: 18%; left: 5%; width: clamp(34px, 8.5vw, 61px); height: clamp(42px, 10vw, 70px); animation: tk-haunt-ghost-flight 4.8s ease-in-out infinite; }
.tk-haunt-demon { top: 18%; right: 5%; width: clamp(36px, 8.9vw, 64px); height: clamp(38px, 9.2vw, 66px); filter: drop-shadow(0 0 13px rgba(255, 66, 45, .72)); animation: tk-haunt-demon-flight 4.1s ease-in-out infinite; }
.tk-haunt-bat-a { top: 4%; left: 36%; width: clamp(34px, 8vw, 56px); height: clamp(21px, 4.8vw, 34px); animation: tk-haunt-bat-a 6.5s ease-in-out infinite; }
.tk-haunt-bat-b { top: 48%; right: 2%; width: clamp(29px, 6.8vw, 48px); height: clamp(20px, 4.5vw, 32px); animation: tk-haunt-bat-b 7.2s ease-in-out infinite; }
.tk-haunt-skull { bottom: 9%; left: 14%; width: clamp(31px, 7.4vw, 53px); height: clamp(31px, 7.4vw, 53px); filter: drop-shadow(0 0 12px rgba(255, 133, 50, .52)); animation: tk-haunt-skull-drift 5.2s ease-in-out infinite; }
.tk-haunt-castle { bottom: 7%; right: 12%; width: clamp(38px, 9vw, 65px); height: clamp(34px, 8.2vw, 59px); filter: drop-shadow(0 0 11px rgba(145, 97, 225, .62)); animation: tk-haunt-castle-drift 6.4s ease-in-out infinite; }
.tk-bat-wing {
  transform-box: fill-box;
  animation: tk-bat-flap .42s ease-in-out infinite alternate;
}
.tk-bat-wing-left { transform-origin: 100% 80%; }
.tk-bat-wing-right { transform-origin: 0% 80%; animation-delay: -.21s; }
.tk-haunt-ghost-art { transform-origin: 50% 50%; animation: tk-ghost-glow 3.2s ease-in-out infinite, tk-ghost-tilt 4.3s ease-in-out infinite; }
.tk-haunt-demon-art { transform-origin: 50% 55%; animation: tk-demon-glow 2.4s ease-in-out infinite, tk-demon-nod 3.5s ease-in-out infinite; }
.tk-haunt-skull-art { transform-origin: 50% 55%; animation: tk-skull-glow 4.2s ease-in-out infinite, tk-skull-tilt 4.8s ease-in-out infinite; }
.tk-haunt-castle-art path:nth-of-type(3) { animation: tk-castle-windows 1.9s steps(2, end) infinite; }
.tk-haunt-castle-art { animation: tk-castle-glow 5.8s ease-in-out infinite; }
@keyframes tk-bat-flap {
  from { transform: rotate(-18deg) scaleY(.88); }
  to { transform: rotate(20deg) scaleY(1.08); }
}
@keyframes tk-ghost-glow {
  0%,100% { filter: drop-shadow(0 0 4px rgba(185,235,255,.35)); }
  50% { filter: drop-shadow(0 0 14px rgba(185,235,255,.9)); }
}
@keyframes tk-demon-glow {
  0%,100% { filter: drop-shadow(0 0 5px rgba(255,65,90,.35)); }
  50% { filter: drop-shadow(0 0 16px rgba(255,65,90,.95)); }
}
@keyframes tk-skull-glow {
  0%,100% { filter: drop-shadow(0 0 4px rgba(255,175,90,.28)); }
  50% { filter: drop-shadow(0 0 13px rgba(255,175,90,.85)); }
}
@keyframes tk-castle-glow {
  0%,100% { filter: brightness(.82) drop-shadow(0 0 6px rgba(145,97,225,.4)); }
  50% { filter: brightness(1.24) drop-shadow(0 0 16px rgba(145,97,225,.95)); }
}
@keyframes tk-haunt-ghost-flight {
  0%,100% { transform: translate3d(0,0,0) rotate(-4deg) scale(1); }
  25% { transform: translate3d(11px,-9px,0) rotate(2deg) scale(1.035); }
  55% { transform: translate3d(22px,-19px,0) rotate(6deg) scale(1.07); }
  78% { transform: translate3d(7px,-11px,0) rotate(-2deg) scale(1.025); }
}
@keyframes tk-haunt-demon-flight {
  0%,100% { transform: translate3d(0,0,0) rotate(3deg) scale(1); }
  30% { transform: translate3d(-9px,-13px,0) rotate(-3deg) scale(1.035); }
  62% { transform: translate3d(-19px,-5px,0) rotate(-7deg) scale(1.065); }
  82% { transform: translate3d(-5px,-10px,0) rotate(1deg) scale(1.025); }
}
@keyframes tk-haunt-skull-drift {
  0%,100% { transform: translate3d(0,0,0) rotate(-2deg); }
  35% { transform: translate3d(9px,-12px,0) rotate(5deg); }
  68% { transform: translate3d(-7px,-17px,0) rotate(-6deg); }
}
@keyframes tk-haunt-castle-drift {
  0%,100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
  40% { transform: translate3d(-8px,-8px,0) rotate(-2deg) scale(1.035); }
  75% { transform: translate3d(5px,-4px,0) rotate(2deg) scale(1.015); }
}
@keyframes tk-ghost-tilt {
  0%,100% { transform: rotate(-3deg) scale(1); }
  50% { transform: rotate(4deg) scale(1.035); }
}
@keyframes tk-demon-nod {
  0%,100% { transform: rotate(2deg) translateY(0); }
  40% { transform: rotate(-4deg) translateY(-2px); }
  70% { transform: rotate(3deg) translateY(1px); }
}
@keyframes tk-skull-tilt {
  0%,100% { transform: rotate(-4deg); }
  50% { transform: rotate(5deg) translateY(-2px); }
}
@keyframes tk-castle-windows {
  0%,100% { opacity: .72; }
  48% { opacity: 1; filter: drop-shadow(0 0 5px rgba(255,189,105,.85)); }
  52% { opacity: .38; }
}
@keyframes tk-haunt-drift-a {
  0%,100% { transform: translate3d(0,0,0) rotateY(-18deg) rotateZ(-4deg); }
  50% { transform: translate3d(0,-10px,18px) rotateY(18deg) rotateZ(4deg); }
}
@keyframes tk-haunt-drift-b {
  0%,100% { transform: translate3d(0,0,0) rotateY(20deg) rotateZ(4deg); }
  50% { transform: translate3d(0,-8px,14px) rotateY(-20deg) rotateZ(-5deg); }
}
@keyframes tk-haunt-bat-a {
  0%,100% { transform: translate3d(-5px,0,0) rotateY(-25deg) rotateZ(-8deg); }
  50% { transform: translate3d(28px,15px,25px) rotateY(25deg) rotateZ(8deg); }
}
@keyframes tk-haunt-bat-b {
  0%,100% { transform: translate3d(0,0,0) rotateY(25deg) rotateZ(7deg); }
  50% { transform: translate3d(-24px,-12px,16px) rotateY(-25deg) rotateZ(-7deg); }
}
@media (max-width: 640px) {
  .halloween-mode #hero-section .animate-orbit,
  .halloween-mode #hero-section .animate-orbit-reverse { opacity: .44; }
  .tk-haunt-prop { text-shadow: 0 4px 10px rgba(0,0,0,.75); }
}
@media (prefers-reduced-motion: reduce) {
  .tk-haunt-prop,
  .tk-haunt-svg,
  .tk-bat-wing,
  .tk-haunt-castle-art path:nth-of-type(3) { animation: none !important; }
}
@media (prefers-reduced-motion: reduce) {
  .tk-haunt-prop { animation: none !important; }
}
</style>
<script>
(function () {
  if (window.__tekvixHauntedWorldInstalled) return;
  window.__tekvixHauntedWorldInstalled = true;
  var current = new Date();
  var active = (current.getMonth() === 9 && current.getDate() >= 29) ||
    (current.getMonth() === 10 && current.getDate() <= 2);
  if (!active) return;

  function installFallback(stage) {
    var fallback = document.createElement('div');
    fallback.className = 'tk-haunt-fallback';
    fallback.setAttribute('aria-hidden', 'true');
    fallback.innerHTML =
      '<span class="tk-haunt-prop tk-haunt-ghost">' +
        '<svg class="tk-haunt-svg tk-haunt-ghost-art" viewBox="0 0 100 110" aria-hidden="true" focusable="false">' +
          '<defs><linearGradient id="tkGhostShell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#c8c9ff"/><stop offset="1" stop-color="#7a71ba"/></linearGradient><radialGradient id="tkGhostCore"><stop stop-color="#b3f7ff" stop-opacity=".7"/><stop offset="1" stop-color="#b3f7ff" stop-opacity="0"/></radialGradient></defs>' +
          '<ellipse cx="50" cy="54" rx="38" ry="48" fill="url(#tkGhostCore)"/>' +
          '<path d="M50 8C28 8 15 26 15 49V94L29 82L39 95L50 84L62 95L73 82L86 94V49C86 26 72 8 50 8Z" fill="url(#tkGhostShell)" stroke="#f4f1ff" stroke-width="2.5"/>' +
          '<path d="M26 45C30 25 42 18 53 18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".72"/>' +
          '<ellipse cx="38" cy="51" rx="6" ry="9" fill="#17112e"/><ellipse cx="63" cy="51" rx="6" ry="9" fill="#17112e"/>' +
          '<circle cx="39" cy="48" r="2" fill="#9df8ff"/><circle cx="64" cy="48" r="2" fill="#9df8ff"/>' +
          '<path d="M43 68Q50 75 58 67" fill="none" stroke="#35244f" stroke-width="4" stroke-linecap="round"/>' +
          '<path d="M20 79L29 72M73 72L82 79" stroke="#fff" stroke-width="2" opacity=".65"/>' +
        '</svg></span>' +
      '<span class="tk-haunt-prop tk-haunt-demon">' +
        '<svg class="tk-haunt-svg tk-haunt-demon-art" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
          '<path d="M23 35L10 8L36 23L64 23L90 8L77 38" fill="#79263d" stroke="#ff8068" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M50 18C25 18 16 35 18 54L24 77L39 88L61 88L76 77L82 54C84 35 75 18 50 18Z" fill="#b9a3ad" stroke="#f6d8e6" stroke-width="3"/>' +
          '<path d="M26 44L43 37L40 55L26 52Z" fill="#210c25" stroke="#ff4f66" stroke-width="2"/><path d="M74 44L57 37L60 55L74 52Z" fill="#210c25" stroke="#ff4f66" stroke-width="2"/>' +
          '<path d="M31 45L39 43L35 49Z" fill="#ffb45d"/><path d="M69 45L61 43L65 49Z" fill="#ffb45d"/>' +
          '<path d="M46 57L54 57L50 66Z" fill="#442039"/>' +
          '<path d="M31 70L69 70L63 84L56 77L50 85L44 77L37 84Z" fill="#2a1029" stroke="#f6d8e6" stroke-width="2"/>' +
          '<path d="M40 71L44 79L48 71M53 71L57 79L61 71" fill="#fff0d5"/>' +
        '</svg></span>' +
      '<span class="tk-haunt-prop tk-haunt-bat-a">' +
        '<svg class="tk-haunt-svg tk-haunt-bat-art" viewBox="0 0 100 60" aria-hidden="true" focusable="false">' +
          '<path class="tk-bat-wing tk-bat-wing-left" d="M49 29C35 8 20 8 5 3L12 20L1 25L21 34L27 47L43 39L50 49Z" fill="#24122f" stroke="#b49aff" stroke-width="2.3" stroke-linejoin="round"/>' +
          '<path class="tk-bat-wing tk-bat-wing-right" d="M51 29C65 8 80 8 95 3L88 20L99 25L79 34L73 47L57 39L50 49Z" fill="#24122f" stroke="#b49aff" stroke-width="2.3" stroke-linejoin="round"/>' +
          '<path d="M42 27L43 14L50 22L57 14L58 27L57 44L50 52L43 44Z" fill="#5b347a" stroke="#d9caff" stroke-width="2"/>' +
          '<circle cx="46" cy="32" r="2.2" fill="#ff6d94"/><circle cx="54" cy="32" r="2.2" fill="#ff6d94"/>' +
        '</svg></span>' +
      '<span class="tk-haunt-prop tk-haunt-bat-b">' +
        '<svg class="tk-haunt-svg tk-haunt-bat-art" viewBox="0 0 100 60" aria-hidden="true" focusable="false">' +
          '<path class="tk-bat-wing tk-bat-wing-left" d="M49 29C35 8 20 8 5 3L12 20L1 25L21 34L27 47L43 39L50 49Z" fill="#24122f" stroke="#ff9b70" stroke-width="2.3" stroke-linejoin="round"/>' +
          '<path class="tk-bat-wing tk-bat-wing-right" d="M51 29C65 8 80 8 95 3L88 20L99 25L79 34L73 47L57 39L50 49Z" fill="#24122f" stroke="#ff9b70" stroke-width="2.3" stroke-linejoin="round"/>' +
          '<path d="M42 27L43 14L50 22L57 14L58 27L57 44L50 52L43 44Z" fill="#6f263f" stroke="#ffd2b3" stroke-width="2"/>' +
          '<circle cx="46" cy="32" r="2.2" fill="#ffbe63"/><circle cx="54" cy="32" r="2.2" fill="#ffbe63"/>' +
        '</svg></span>' +
      '<span class="tk-haunt-prop tk-haunt-skull">' +
        '<svg class="tk-haunt-svg tk-haunt-skull-art" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
          '<path d="M50 8C25 8 13 26 16 48C17 61 25 70 34 76L34 90L66 90L66 76C75 70 83 61 84 48C87 26 75 8 50 8Z" fill="#e4d9c6" stroke="#fff0d6" stroke-width="3"/>' +
          '<path d="M22 42L36 36L42 51L34 60L23 55Z" fill="#201126" stroke="#9f81bc" stroke-width="2"/><path d="M78 42L64 36L58 51L66 60L77 55Z" fill="#201126" stroke="#9f81bc" stroke-width="2"/>' +
          '<path d="M44 58L50 49L56 58L50 63Z" fill="#35203a"/>' +
          '<path d="M37 72L63 72L63 90L37 90Z" fill="#211329"/>' +
          '<path d="M43 73V86M50 73V88M57 73V86" stroke="#fff1d6" stroke-width="3"/>' +
          '<path d="M33 23Q50 15 67 23" fill="none" stroke="#fff8ec" stroke-width="4" stroke-linecap="round" opacity=".8"/>' +
        '</svg></span>' +
      '<span class="tk-haunt-prop tk-haunt-castle">' +
        '<svg class="tk-haunt-svg tk-haunt-castle-art" viewBox="0 0 110 100" aria-hidden="true" focusable="false">' +
          '<path d="M8 90V48H20V32H35V48H43V20H58V38H72V29H88V47H101V90Z" fill="#2b1946" stroke="#aa8ee8" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M39 90V65Q55 42 71 65V90Z" fill="#100c21" stroke="#8b72ce" stroke-width="3"/>' +
          '<path d="M16 60H26V72H16ZM82 60H92V72H82ZM46 36H53V46H46ZM76 39H83V49H76Z" fill="#ffbd69"/>' +
          '<path d="M5 90H105" stroke="#d6c3ff" stroke-width="4" stroke-linecap="round"/>' +
        '</svg></span>';
    stage.appendChild(fallback);
    return fallback;
  }

  function material(THREE, color, emissive, emissiveIntensity, roughness) {
    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: emissive || 0x000000,
      emissiveIntensity: emissiveIntensity || 0,
      roughness: roughness === undefined ? 0.52 : roughness,
      metalness: 0.12
    });
  }

  function makePumpkin(THREE) {
    var group = new THREE.Group();
    var skin = new THREE.MeshStandardMaterial({
      color: 0xff7a18, emissive: 0x571800, emissiveIntensity: 0.38,
      roughness: 0.58, metalness: 0.02
    });
    var ribMaterial = new THREE.MeshStandardMaterial({
      color: 0xffae4a, emissive: 0x6b2100, emissiveIntensity: 0.28,
      roughness: 0.72, metalness: 0.02
    });
    var darkCut = new THREE.MeshStandardMaterial({
      color: 0x180813, emissive: 0x5a170d, emissiveIntensity: 0.3,
      roughness: 0.46, metalness: 0.02, side: THREE.DoubleSide
    });
    var toothMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd17b, emissive: 0xff6818, emissiveIntensity: 0.42,
      roughness: 0.42, metalness: 0.04, side: THREE.DoubleSide
    });
    var mainBody = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 22), skin);
    mainBody.scale.set(1.04, 0.82, 0.66);
    group.add(mainBody);

    for (var i = 0; i < 7; i++) {
      var x = -0.78 + i * 0.26;
      var fullness = Math.sqrt(Math.max(0.2, 1 - (x * x) / 1.03));
      var lobe = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), skin);
      lobe.scale.set(0.76, 0.84 * fullness, 0.68 * fullness);
      lobe.position.set(x, 0, 0.005);
      group.add(lobe);
    }

    for (var ridgeIndex = -2; ridgeIndex <= 2; ridgeIndex++) {
      var ridgeX = ridgeIndex * 0.29;
      var ridgeRatio = Math.abs(ridgeX) / 1.04;
      var frontZ = 0.66 * Math.sqrt(Math.max(0.15, 1 - ridgeRatio * ridgeRatio));
      var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(ridgeX * 0.7, 0.68, frontZ * 0.62),
        new THREE.Vector3(ridgeX, 0.39, frontZ * 0.92 + 0.015),
        new THREE.Vector3(ridgeX, 0.0, frontZ + 0.022),
        new THREE.Vector3(ridgeX, -0.36, frontZ * 0.92 + 0.015),
        new THREE.Vector3(ridgeX * 0.7, -0.65, frontZ * 0.62)
      ]);
      group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 18, 0.018, 5, false), ribMaterial));
    }

    var stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x53652b, emissive: 0x182307, emissiveIntensity: 0.18,
      roughness: 0.76, metalness: 0
    });
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.16, 0.38, 10), stemMaterial);
    stem.position.set(0.02, 0.91, 0.02);
    stem.rotation.z = -0.16;
    group.add(stem);
    var leafShape = new THREE.Shape();
    leafShape.moveTo(0.04, 0.9);
    leafShape.quadraticCurveTo(0.34, 1.1, 0.49, 0.91);
    leafShape.quadraticCurveTo(0.26, 0.81, 0.04, 0.9);
    var leaf = new THREE.Mesh(new THREE.ShapeGeometry(leafShape), new THREE.MeshStandardMaterial({
      color: 0x778a37, emissive: 0x202e0b, emissiveIntensity: 0.2,
      roughness: 0.65, side: THREE.DoubleSide
    }));
    leaf.position.z = 0.035;
    group.add(leaf);

    function face(points, z, material) {
      var shape = new THREE.Shape();
      shape.moveTo(points[0][0], points[0][1]);
      for (var p = 1; p < points.length; p++) shape.lineTo(points[p][0], points[p][1]);
      shape.closePath();
      var mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), material);
      mesh.position.z = z;
      group.add(mesh);
      return mesh;
    }
    face([[-0.65, 0.28], [-0.25, 0.45], [-0.23, 0.08]], 0.605, darkCut);
    face([[0.65, 0.28], [0.25, 0.45], [0.23, 0.08]], 0.605, darkCut);
    face([[-0.09, 0.02], [0.09, 0.02], [0, -0.18]], 0.62, darkCut);
    face([
      [-0.62, -0.22], [-0.42, -0.29], [-0.24, -0.25], [-0.08, -0.36],
      [0, -0.3], [0.08, -0.36], [0.24, -0.25], [0.42, -0.29],
      [0.62, -0.22], [0.48, -0.49], [0.29, -0.6], [0, -0.66],
      [-0.29, -0.6], [-0.48, -0.49]
    ], 0.515, darkCut);
    face([[-0.42, -0.29], [-0.23, -0.25], [-0.15, -0.4]], 0.535, toothMaterial);
    face([[-0.08, -0.36], [0, -0.3], [0.08, -0.36], [0.02, -0.46]], 0.54, toothMaterial);
    face([[0.24, -0.25], [0.42, -0.29], [0.15, -0.4]], 0.535, toothMaterial);
    face([[-0.25, -0.52], [-0.08, -0.45], [0, -0.53], [0.09, -0.45], [0.25, -0.52], [0.12, -0.58], [0, -0.6], [-0.12, -0.58]], 0.53, toothMaterial);

    var glow = new THREE.PointLight(0xff6a24, 0.58, 3.0);
    glow.position.set(0, 0.02, 0.95);
    group.add(glow);
    group.position.set(0, 0, 0.25);
    group.scale.setScalar(1.05);
    return group;
  }

  function makeGhost(THREE) {
    var group = new THREE.Group();
    var cloth = new THREE.MeshStandardMaterial({
      color: 0xe9e1ff, emissive: 0x6040b8, emissiveIntensity: 0.38,
      roughness: 0.3, metalness: 0.06, transparent: true, opacity: 0.91, side: THREE.DoubleSide
    });
    var dome = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 14), cloth);
    dome.scale.set(1, 1.04, 0.78);
    dome.position.y = 0.18;
    group.add(dome);
    var skirt = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.62, 20, 5), cloth);
    skirt.position.y = -0.21;
    skirt.scale.z = 0.8;
    group.add(skirt);
    for (var i = 0; i < 5; i++) {
      var angle = Math.PI * (i / 4);
      var hem = new THREE.Mesh(new THREE.SphereGeometry(0.095, 9, 7), cloth);
      hem.position.set(Math.cos(angle) * 0.25, -0.48 + (i % 2 ? 0.06 : -0.015), Math.sin(angle) * 0.16);
      hem.scale.set(1.08, 0.84, 0.9);
      group.add(hem);
    }
    var socket = material(THREE, 0x1c1026, 0x08030e, 0.15, 0.3);
    [-0.115, 0.115].forEach(function (x) {
      var eye = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), socket);
      eye.scale.set(0.9, 1.28, 0.4);
      eye.position.set(x, 0.2, 0.285);
      group.add(eye);
    });
    var mouth = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), socket);
    mouth.scale.set(0.7, 1.25, 0.36);
    mouth.position.set(0, 0.07, 0.3);
    group.add(mouth);
    var glow = new THREE.PointLight(0x9c7cff, 0.68, 2.2);
    glow.position.set(0, 0.08, 0.5);
    group.add(glow);
    group.position.set(-2.24, 0.48, 0.45);
    group.scale.setScalar(0.82);
    return group;
  }

  function makeDemonSkull(THREE) {
    var group = new THREE.Group();
    var bone = material(THREE, 0xd8cce5, 0x32183f, 0.34, 0.42);
    var face = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 14), bone);
    face.scale.set(0.86, 0.94, 0.74);
    face.position.y = 0.06;
    group.add(face);
    var jaw = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.28), bone);
    jaw.position.set(0, -0.21, 0.12);
    group.add(jaw);
    var socket = material(THREE, 0x160712, 0x070108, 0.1, 0.25);
    var ember = new THREE.MeshStandardMaterial({ color: 0xff643f, emissive: 0xff2815, emissiveIntensity: 1.65, roughness: 0.28 });
    [-0.135, 0.135].forEach(function (x) {
      var eye = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 8), socket);
      eye.scale.set(1.1, 0.88, 0.45);
      eye.position.set(x, 0.105, 0.26);
      group.add(eye);
      var shine = new THREE.Mesh(new THREE.SphereGeometry(0.033, 8, 6), ember);
      shine.position.set(x, 0.1, 0.31);
      group.add(shine);
    });
    var nose = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.13, 5), socket);
    nose.rotation.x = Math.PI;
    nose.position.set(0, -0.015, 0.28);
    group.add(nose);
    var teeth = material(THREE, 0xffe7b0, 0x9a451c, 0.42, 0.32);
    for (var i = 0; i < 4; i++) {
      var tooth = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.085, 0.06), teeth);
      tooth.position.set(-0.13 + i * 0.087, -0.2, 0.28);
      group.add(tooth);
    }
    var horn = material(THREE, 0x3a142f, 0x9d142a, 0.62, 0.38);
    [-1, 1].forEach(function (side) {
      var hornMesh = new THREE.Mesh(new THREE.ConeGeometry(0.087, 0.25, 8), horn);
      hornMesh.position.set(side * 0.23, 0.34, 0);
      hornMesh.rotation.z = side * -0.32;
      group.add(hornMesh);
    });
    var aura = new THREE.PointLight(0xff3d2e, 0.72, 2.1);
    aura.position.set(0, 0.1, 0.48);
    group.add(aura);
    group.position.set(2.25, 0.28, 0.38);
    group.scale.setScalar(0.78);
    return group;
  }

  function makeBat(THREE, scale, x, y, z) {
    var shape = new THREE.Shape();
    shape.moveTo(0, 0.06);
    shape.quadraticCurveTo(-0.22, 0.24, -0.48, 0.34);
    shape.lineTo(-0.4, 0.05);
    shape.lineTo(-0.72, 0.17);
    shape.quadraticCurveTo(-0.68, -0.13, -0.35, -0.13);
    shape.lineTo(-0.1, -0.31);
    shape.lineTo(0, -0.21);
    shape.lineTo(0.1, -0.31);
    shape.lineTo(0.35, -0.13);
    shape.quadraticCurveTo(0.68, -0.13, 0.72, 0.17);
    shape.lineTo(0.4, 0.05);
    shape.lineTo(0.48, 0.34);
    shape.quadraticCurveTo(0.22, 0.24, 0, 0.06);
    var wingMaterial = new THREE.MeshStandardMaterial({
      color: 0x21102f, emissive: 0x6731a0, emissiveIntensity: 0.48,
      roughness: 0.42, metalness: 0.22, side: THREE.DoubleSide
    });
    var bat = new THREE.Group();
    var wings = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
      depth: 0.045, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.012, bevelSegments: 2, steps: 1
    }), wingMaterial);
    wings.position.z = -0.02;
    bat.add(wings);
    var body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), material(THREE, 0x21102f, 0x4b1f76, 0.55, 0.42));
    body.scale.set(0.72, 1.3, 0.8);
    body.position.set(0, -0.035, 0.07);
    bat.add(body);
    var eyes = new THREE.MeshStandardMaterial({ color: 0xffb05e, emissive: 0xff5c20, emissiveIntensity: 1.25 });
    [-0.035, 0.035].forEach(function (eyeX) {
      var eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 5), eyes);
      eye.position.set(eyeX, 0.015, 0.16);
      bat.add(eye);
    });
    bat.position.set(x, y, z);
    bat.scale.setScalar(scale);
    return bat;
  }

  function makeCastle(THREE) {
    var castle = new THREE.Group();
    var stone = material(THREE, 0x160d25, 0x5b2577, 0.58, 0.68);
    var shadowStone = material(THREE, 0x0c0718, 0x2b194b, 0.38, 0.72);
    function tower(x, y, width, height, mat) {
      var body = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.22), mat);
      body.position.set(x, y, 0);
      castle.add(body);
      var roof = new THREE.Mesh(new THREE.ConeGeometry(width * 0.68, height * 0.4, 5), stone);
      roof.position.set(x, y + height / 2 + height * 0.19, 0);
      roof.rotation.y = Math.PI / 5;
      castle.add(roof);
      var slit = new THREE.Mesh(new THREE.BoxGeometry(width * 0.12, height * 0.3, 0.03), material(THREE, 0xffa15c, 0xff5b23, 1.15, 0.3));
      slit.position.set(x, y + height * 0.06, 0.13);
      castle.add(slit);
    }
    tower(-0.32, 0.02, 0.26, 0.78, stone);
    tower(0, -0.08, 0.46, 0.58, shadowStone);
    tower(0.33, 0.1, 0.25, 0.88, stone);
    var gate = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.26, 0.05), material(THREE, 0x05030b, 0x000000, 0, 0.95));
    gate.position.set(0, -0.22, 0.15);
    castle.add(gate);
    castle.position.set(0, -1.8, -0.7);
    castle.scale.setScalar(0.92);
    return castle;
  }

  function makeCandle(THREE, x, y, scale) {
    var group = new THREE.Group();
    var wax = material(THREE, 0xd9c7a7, 0x3c1c4a, 0.18, 0.72);
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.31, 9), wax);
    group.add(body);
    var flame = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.19, 8), new THREE.MeshStandardMaterial({
      color: 0xffc36d, emissive: 0xff6a20, emissiveIntensity: 1.6, roughness: 0.3
    }));
    flame.position.y = 0.235;
    group.add(flame);
    var light = new THREE.PointLight(0xff8536, 0.64, 1.45);
    light.position.y = 0.23;
    group.add(light);
    group.position.set(x, y, -0.2);
    group.scale.setScalar(scale);
    return { group: group, flame: flame, light: light };
  }

  function mount3D(THREE, stage, fallback) {
    var width = Math.max(1, stage.clientWidth);
    var height = Math.max(1, stage.clientHeight);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(39, width / height, 0.1, 40);
    camera.position.set(0, 0, 8);
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true, antialias: window.innerWidth > 640, powerPreference: 'low-power'
      });
    } catch (error) {
      fallback.classList.add('tk-haunt-fallback-ready');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.2 : 1.55));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    if (renderer.outputColorSpace && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    var layer = document.createElement('div');
    layer.className = 'tk-haunted-3d-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.appendChild(renderer.domElement);
    stage.appendChild(layer);

    scene.add(new THREE.HemisphereLight(0xc7b3ff, 0x1a071f, 1.35));
    var moon = new THREE.DirectionalLight(0xe0d9ff, 1.55);
    moon.position.set(-3, 4, 6);
    scene.add(moon);
    var ember = new THREE.PointLight(0xff6a2d, 1.7, 6);
    ember.position.set(0, -0.1, 2);
    scene.add(ember);

    var pumpkin = makePumpkin(THREE);
    scene.add(pumpkin);
    var ghost = makeGhost(THREE);
    scene.add(ghost);
    var demon = makeDemonSkull(THREE);
    scene.add(demon);
    var bats = [
      makeBat(THREE, 0.52, -0.95, 1.42, 0.35),
      makeBat(THREE, 0.39, 1.18, 1.34, -0.15),
      makeBat(THREE, 0.3, -1.63, -0.72, 0.25)
    ];
    bats.forEach(function (bat) { scene.add(bat); });
    var batBasePositions = bats.map(function (bat) {
      return { x: bat.position.x, y: bat.position.y };
    });
    scene.add(makeCastle(THREE));
    var candles = [
      makeCandle(THREE, -2.75, -1.18, 0.78),
      makeCandle(THREE, 2.72, -1.22, 0.72)
    ];
    candles.forEach(function (candle) { scene.add(candle.group); });

    var moteCount = window.innerWidth < 640 ? 48 : 78;
    var motePositions = new Float32Array(moteCount * 3);
    for (var i = 0; i < moteCount; i++) {
      motePositions[i * 3] = (Math.random() - 0.5) * 6.6;
      motePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.9;
      motePositions[i * 3 + 2] = -0.8 - Math.random() * 1.8;
    }
    var moteGeometry = new THREE.BufferGeometry();
    moteGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    var motes = new THREE.Points(moteGeometry, new THREE.PointsMaterial({
      color: 0xffaa67, size: 0.035, transparent: true, opacity: 0.72, sizeAttenuation: true
    }));
    scene.add(motes);

    try {
      renderer.render(scene, camera);
      stage.classList.add('tk-haunted-3d-ready');
      fallback.remove();
    } catch (error) {
      layer.remove();
      renderer.dispose();
      fallback.classList.add('tk-haunt-fallback-ready');
      return;
    }

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var visible = !('IntersectionObserver' in window);
    var frame = 0;
    var startedAt = 0;
    function draw(timestamp) {
      frame = 0;
      if (document.hidden || !visible) return;
      if (!reducedMotion) {
        if (!startedAt) startedAt = timestamp;
        var t = timestamp * 0.001;
        pumpkin.position.y = Math.sin(t * 0.82) * 0.065;
        pumpkin.rotation.y = Math.sin(t * 0.55) * 0.14;
        pumpkin.rotation.z = Math.sin(t * 0.9) * 0.035;
        ghost.position.y = 0.48 + Math.sin(t * 1.15) * 0.16;
        ghost.rotation.y = Math.sin(t * 0.72) * 0.45;
        ghost.rotation.z = Math.sin(t * 1.35) * 0.09;
        demon.position.y = 0.28 + Math.sin(t * 1.3 + 1.4) * 0.12;
        demon.rotation.y = Math.sin(t * 0.9) * 0.34;
        bats.forEach(function (bat, index) {
          bat.position.x = batBasePositions[index].x + Math.sin(t * (0.42 + index * 0.08) + index) * 0.22;
          bat.position.y = batBasePositions[index].y + Math.sin(t * 2.1 + index * 1.7) * 0.13;
          bat.rotation.z = Math.sin(t * 3.2 + index) * 0.2;
          bat.rotation.y = Math.sin(t * 1.1 + index) * 0.38;
        });
        candles.forEach(function (candle, index) {
          candle.flame.scale.y = 0.78 + Math.sin(t * 8 + index * 2) * 0.14;
          candle.light.intensity = 0.48 + Math.sin(t * 9 + index) * 0.18;
        });
        motes.rotation.y = t * 0.025;
        motes.rotation.z = Math.sin(t * 0.18) * 0.05;
      }
      renderer.render(scene, camera);
      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    }
    function resume() {
      if (!reducedMotion && !frame && visible && !document.hidden) frame = window.requestAnimationFrame(draw);
      else if (reducedMotion) renderer.render(scene, camera);
    }
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        visible = entries.some(function (entry) { return entry.isIntersecting; });
        if (visible) resume();
        else if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
      }, { rootMargin: '160px' });
      observer.observe(stage);
    }
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) resume();
      else if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    });
    var resizeObserver;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(function () {
        var nextWidth = Math.max(1, stage.clientWidth);
        var nextHeight = Math.max(1, stage.clientHeight);
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nextWidth, nextHeight, false);
        if (reducedMotion) renderer.render(scene, camera);
      });
      resizeObserver.observe(stage);
    } else {
      window.addEventListener('resize', function () {
        var nextWidth = Math.max(1, stage.clientWidth);
        var nextHeight = Math.max(1, stage.clientHeight);
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nextWidth, nextHeight, false);
      }, { passive: true });
    }
    if (reducedMotion) renderer.render(scene, camera);
    else resume();
  }

  function applyHauntedWorld() {
    var hero = document.querySelector('#hero-section');
    var orb = hero && hero.querySelector('.animate-orb-breathe');
    if (!orb || !orb.parentElement) return false;
    var stage = orb.parentElement;
    if (stage.querySelector('.tk-haunted-3d-layer') || stage.querySelector('.tk-haunt-fallback')) return true;
    stage.classList.add('tk-haunted-world-stage');
    var fallback = stage.querySelector('.tk-haunt-fallback') || installFallback(stage);
    window.__tekvixHauntStatus = { state: 'loading-three', stageConnected: stage.isConnected, time: Date.now() };
    window.setTimeout(function () {
      var currentStage = document.querySelector('#hero-section .animate-orb-breathe');
      currentStage = currentStage && currentStage.parentElement;
      var currentFallback = currentStage && currentStage.querySelector('.tk-haunt-fallback');
      if (currentFallback && !currentStage.querySelector('.tk-haunted-3d-layer')) {
        currentFallback.classList.add('tk-haunt-fallback-ready');
        window.__tekvixHauntStatus = {
          state: 'fallback-visible',
          reason: 'three-scene-not-mounted-yet',
          stageConnected: currentStage.isConnected,
          time: Date.now()
        };
      }
    }, 1800);
    import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js')
      .then(function (THREE) {
        // React may rerender the Hero while the remote module downloads. Resolve the
        // stage again at mount time instead of using a potentially stale DOM node.
        var currentHero = document.querySelector('#hero-section');
        var currentOrb = currentHero && currentHero.querySelector('.animate-orb-breathe');
        var currentStage = currentOrb && currentOrb.parentElement;
        if (!currentStage || !currentStage.isConnected) {
          window.__tekvixHauntStatus = { state: 'mount-target-missing', time: Date.now() };
          throw new Error('Halloween hero stage is no longer connected');
        }
        currentStage.classList.add('tk-haunted-world-stage');
        var currentFallback = currentStage.querySelector('.tk-haunt-fallback') || installFallback(currentStage);
        if (currentStage.querySelector('.tk-haunted-3d-layer')) {
          window.__tekvixHauntStatus = { state: 'already-mounted', time: Date.now() };
          currentFallback.remove();
          return;
        }
        window.__tekvixHauntStatus = { state: 'mounting-three-scene', stageConnected: currentStage.isConnected, time: Date.now() };
        try {
          mount3D(THREE, currentStage, currentFallback);
          var mounted = !!currentStage.querySelector('.tk-haunted-3d-layer');
          window.__tekvixHauntStatus = { state: mounted ? 'three-scene-mounted' : 'fallback-after-render', mounted: mounted, time: Date.now() };
          if (!mounted && currentFallback.isConnected) currentFallback.classList.add('tk-haunt-fallback-ready');
        } catch (error) {
          currentFallback.classList.add('tk-haunt-fallback-ready');
          window.__tekvixHauntStatus = { state: 'mount-error', error: String(error), time: Date.now() };
        }
      })
      .catch(function (error) {
        var currentHero = document.querySelector('#hero-section');
        var currentOrb = currentHero && currentHero.querySelector('.animate-orb-breathe');
        var currentStage = currentOrb && currentOrb.parentElement;
        var currentFallback = currentStage && currentStage.querySelector('.tk-haunt-fallback');
        if (currentFallback) currentFallback.classList.add('tk-haunt-fallback-ready');
        window.__tekvixHauntStatus = { state: 'import-error', error: String(error), time: Date.now() };
      });
    return true;
  }

  function boot() {
    var root = document.getElementById('root');
    if (root && root.firstElementChild) root.firstElementChild.classList.add('halloween-mode');
    if (applyHauntedWorld()) return;
    if (!window.MutationObserver || !document.documentElement) return;
    var observer = new MutationObserver(function () {
      if (applyHauntedWorld()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(function () { observer.disconnect(); }, 30000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>`

function isHalloweenPumpkinWindowActive(date: Date = new Date()): boolean {
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  return (month === 9 && day >= 29 && day <= 31) || (month === 10 && day >= 1 && day <= 2);
}

async function serveSeasonalAsset(request: Request, env: Env): Promise<Response> {
  const headers = new Headers(request.headers);
  headers.set('accept-encoding', 'identity');
  const cleanRequest = new Request(request, { headers });
  const response = await env.ASSETS.fetch(cleanRequest);
  if (!response.ok || !(response.headers.get('content-type') || '').toLowerCase().includes('text/html')) {
    return response;
  }
  const html = await response.clone().text();
  if (!/<\/body>/i.test(html)) return response;
  const enhancedHtml = html.replace(/<\/body>/i, HALLOWEEN_PUMPKIN_INJECTION + '</body>');
  if (enhancedHtml === html) return response;
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-length');
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('etag');
  responseHeaders.set('cache-control', 'no-store, no-cache, must-revalidate');
  responseHeaders.set('x-tekvix-halloween', 'living-pumpkin-v1');
  return new Response(enhancedHtml, { status: response.status, statusText: response.statusText, headers: responseHeaders });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname.startsWith('/api/')) {
      try {
        const apiResponse = await handleApi(request, env);
        if (apiResponse) return apiResponse;
        return json({ success: false, error: 'مسیر API در نسخه Worker پیاده‌سازی نشده است.' }, 404);
      } catch {
        return json({ success: false, error: 'خطای داخلی سرویس. لطفاً دوباره تلاش کنید.' }, 500);
      }
    }
    if (request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html') && isHalloweenPumpkinWindowActive()) {
      return serveSeasonalAsset(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
