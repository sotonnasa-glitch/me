import assert from 'node:assert/strict';

const workerModule = await import('../src/worker.ts');
const worker = workerModule.default;
const dbOrders = new Map();
const analyticsRows = [];
const telegramMessages = [];
const telegramToken = 'test-token-never-return-this';

const jsonResponse = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { 'content-type': 'application/json' },
});

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => {
  const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(rawUrl);
  const method = (init.method || 'GET').toUpperCase();

  if (url.hostname === 'jwppdvxyeuqbdcljzybj.supabase.co') {
    const headers = new Headers(init.headers);
    assert.equal(headers.get('apikey'), 'eyJ.test.legacy-service-role');
    assert.equal(headers.get('authorization'), 'Bearer eyJ.test.legacy-service-role',
      'Legacy service_role JWT must be supplied as the bearer token.');
  }

  if (url.hostname === 'jwppdvxyeuqbdcljzybj.supabase.co' && url.pathname === '/rest/v1/orders') {
    if (method === 'GET') {
      const idFilter = url.searchParams.get('id');
      if (idFilter?.startsWith('eq.')) {
        const row = dbOrders.get(idFilter.slice(3));
        return jsonResponse(row ? [row] : []);
      }
      return jsonResponse([...dbOrders.values()]);
    }
    if (method === 'POST') {
      const row = JSON.parse(init.body);
      if (dbOrders.has(row.id)) return jsonResponse({ code: '23505', message: 'duplicate key' }, 409);
      dbOrders.set(row.id, row);
      return jsonResponse([row], 201);
    }
  }

  if (url.hostname === 'jwppdvxyeuqbdcljzybj.supabase.co' && url.pathname === '/rest/v1/analytics_events' && method === 'POST') {
    analyticsRows.push(JSON.parse(init.body));
    return new Response(null, { status: 201 });
  }

  if (url.hostname === 'api.telegram.org' && url.pathname.endsWith('/getMe')) {
    return jsonResponse({ ok: true, result: { id: 123, is_bot: true, first_name: 'TEKVIX test', username: 'tekvix_test_bot' } });
  }
  if (url.hostname === 'api.telegram.org' && url.pathname.endsWith('/sendMessage')) {
    telegramMessages.push(JSON.parse(init.body));
    return jsonResponse({ ok: true, result: { message_id: telegramMessages.length } });
  }

  throw new Error('Unexpected network request in worker smoke test: ' + url.origin + url.pathname);
};

const env = {
  ASSETS: {
    async fetch() {
      return new Response('<main>static app</main>', { status: 200, headers: { 'content-type': 'text/html' } });
    },
  },
  SUPABASE_URL: 'https://jwppdvxyeuqbdcljzybj.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJ.test.legacy-service-role',
  TELEGRAM_BOT_TOKEN: telegramToken,
  TELEGRAM_CHAT_ID: '123456',
};

const request = (url, init = {}) => new Request('https://tekvix.ir' + url, {
  ...init,
  headers: { 'cf-connecting-ip': '192.0.2.' + (Math.floor(Math.random() * 200) + 1), ...(init.headers || {}) },
});
const readJson = async (response) => response.json();

try {
  const health = await worker.fetch(request('/api/health'), env);
  const healthData = await readJson(health);
  assert.equal(health.status, 200);
  assert.equal(healthData.status, 'ok');
  assert.equal(healthData.supabaseConfigured, true);
  assert.equal(healthData.telegramConfigured, true);

  const orderId = 'ORD-1700000000123-A1B2C3D4E5F60718293A4B5C6D7E8F90';
  const payload = {
    id: orderId,
    createdAt: '2020-01-01T00:00:00.000Z',
    fullName: 'کاربر تست',
    telegramOrPhone: '@tekvix_test',
    serviceId: 'ai-website',
    serviceTitle: 'ساخت وب‌سایت',
    message: 'سفارش آزمایشی',
    status: 'completed',
    priceQuoted: '۰ تومان',
    isPromoEvent: false,
  };
  const createResponse = await worker.fetch(request('/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  }), env);
  const createData = await readJson(createResponse);
  assert.equal(createResponse.status, 201);
  assert.equal(createData.success, true);
  assert.equal(createData.order.id, orderId);
  assert.equal(createData.order.status, 'new', 'Public order submissions must not set an admin status.');
  assert.notEqual(createData.order.createdAt, payload.createdAt, 'Creation time is server-generated.');

  const duplicate = await worker.fetch(request('/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  }), env);
  assert.equal(duplicate.status, 409, 'Duplicate order IDs must be rejected.');

  const trackResponse = await worker.fetch(request('/api/orders/track/' + orderId), env);
  const trackData = await readJson(trackResponse);
  assert.equal(trackResponse.status, 200);
  assert.equal(trackData.orders[0].id, orderId);
  assert.equal(trackData.orders[0].contactMasked, '');

  const privateLookup = await worker.fetch(request('/api/orders/track/%40tekvix_test'), env);
  const privateLookupData = await readJson(privateLookup);
  assert.equal(privateLookupData.count, 0, 'Contact-based order lookups must not disclose customer orders.');

  const telegramResponse = await worker.fetch(request('/api/telegram/send-order', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ order: payload }),
  }), env);
  const telegramData = await readJson(telegramResponse);
  assert.equal(telegramResponse.status, 200);
  assert.equal(telegramData.telegramSent, true);
  assert.equal(telegramMessages.length, 1);
  assert.ok(telegramMessages[0].text.includes(orderId));
  assert.ok(!JSON.stringify(telegramData).includes(telegramToken), 'The bot token must never be returned to clients.');

  const analyticsResponse = await worker.fetch(request('/api/analytics/event', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      eventType: 'order_submitted',
      page: '/order',
      serviceId: 'ai-website',
      value: 0,
      metadata: { fullName: 'PRIVATE CUSTOMER', isPromo: true, password: 'DO_NOT_STORE', amount: 0 },
    }),
  }), env);
  assert.equal(analyticsResponse.status, 200);
  assert.equal(analyticsRows.length, 1);
  assert.equal(analyticsRows[0].path, '/order');
  assert.equal(analyticsRows[0].metadata.isPromo, true);
  assert.equal('fullName' in analyticsRows[0].metadata, false);
  assert.equal('password' in analyticsRows[0].metadata, false);

  const statusResponse = await worker.fetch(request('/api/telegram/status'), env);
  const statusData = await readJson(statusResponse);
  assert.equal(statusData.online, true);
  assert.equal(statusData.bot.username, 'tekvix_test_bot');

  const consultationResponse = await worker.fetch(request('/api/telegram/send-consultation', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'مشاوره تست', contactInfo: '@test_contact', topic: 'وب‌سایت', message: 'پیام تست' }),
  }), env);
  const consultationData = await readJson(consultationResponse);
  assert.equal(consultationData.telegramSent, true);
  assert.equal(telegramMessages.length, 2);

  const assetResponse = await worker.fetch(request('/'), env);
  assert.equal(assetResponse.status, 200);
  assert.ok((await assetResponse.text()).includes('static app'));

  console.log('✅ Cloudflare Worker API smoke tests passed (Supabase + Telegram mocked).');
} finally {
  globalThis.fetch = originalFetch;
}
