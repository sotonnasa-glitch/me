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
  const headers = new Headers({
    // New Supabase sb_secret_* keys are opaque API keys, not JWT bearer tokens.
    apikey: (env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
    'content-type': 'application/json',
  });
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
  if (suppliedId && !/^ORD-\d{4,20}(?:-\d{1,6})?$/.test(suppliedId)) return null;
  const id = suppliedId || `ORD-${Date.now()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  const now = new Date().toISOString();
  const suppliedCreatedAt = typeof input.createdAt === 'string' ? Date.parse(input.createdAt) : NaN;
  const createdAt = Number.isFinite(suppliedCreatedAt) ? new Date(suppliedCreatedAt).toISOString() : now;
  const status = input.status === 'in_progress' || input.status === 'completed' || input.status === 'cancelled'
    ? input.status
    : 'new';

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

async function saveOrder(env: Env, row: OrderRow): Promise<OrderRow> {
  const response = await databaseRequest(env, 'orders?on_conflict=id', {
    method: 'POST',
    body: row,
    prefer: 'resolution=merge-duplicates,return=representation',
  });
  if (!response.ok) {
    // Do not log or return request payloads, contact details, or secret values.
    console.error('[TEKVIX] Supabase order write failed with status', response.status);
    throw new Error('Database write failed.');
  }
  const data = await response.json() as OrderRow[];
  if (!Array.isArray(data) || !data[0]) throw new Error('Database did not return the saved order.');
  return data[0];
}

async function sendTelegram(env: Env, message: string): Promise<boolean> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return false;

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

async function handleApi(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  if (path === '/api/health' && method === 'GET') {
    return json({
      status: 'ok',
      service: 'tekvix-worker',
      supabaseConfigured: supabaseReady(env),
      telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN?.trim() && env.TELEGRAM_CHAT_ID?.trim()),
      serverTime: new Date().toISOString(),
    });
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
      const saved = await saveOrder(env, row);
      return json({ success: true, order: orderToClient(saved) }, 201);
    } catch {
      return json({ success: false, error: 'ثبت سفارش در پایگاه داده انجام نشد. لطفاً دوباره تلاش کنید.' }, 502);
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
      // The order endpoint and this endpoint use the same ID, so concurrent calls
      // update the same database row rather than creating duplicates.
      const saved = await saveOrder(env, row);
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
    return json({
      success: true,
      configured: Boolean(env.TELEGRAM_BOT_TOKEN?.trim() && env.TELEGRAM_CHAT_ID?.trim()),
    });
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
      } catch {
        return json({ success: false, error: 'خطای داخلی سرویس. لطفاً دوباره تلاش کنید.' }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};
