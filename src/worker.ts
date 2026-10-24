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

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_LENGTH) return null;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_LENGTH) return null;
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


async function handleApi(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

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
    return env.ASSETS.fetch(request);
  },
};
