import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

const tempDir = mkdtempSync(path.join(os.tmpdir(), 'tekvix-smoke-'));
const adminPassword = 'Smoke-' + crypto.randomBytes(16).toString('hex');
let child;
let logs = '';
let passed = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  passed += 1;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getFreePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not allocate a free port.');
  const port = address.port;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}
async function readJson(response) {
  return response.json().catch(() => ({}));
}

try {
  const port = await getFreePort();
  child = spawn(process.execPath, ['dist/server.cjs'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(port),
      TEKVIX_DATA_DIR: tempDir,
      SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
      ADMIN_INITIAL_PASSWORD: adminPassword,
      TELEGRAM_BOT_TOKEN: '',
      TELEGRAM_CHAT_ID: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (chunk) => { logs += chunk.toString().slice(-2000); });
  child.stderr.on('data', (chunk) => { logs += chunk.toString().slice(-2000); });
  const origin = 'http://127.0.0.1:' + port;

  let health;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error('Server process exited before health check:\n' + logs);
    try {
      health = await fetch(origin + '/api/health', { signal: AbortSignal.timeout(1000) });
      if (health.ok) break;
    } catch {
      // Wait briefly while the process starts.
    }
    await sleep(100);
  }
  if (!health?.ok) throw new Error('Server did not become healthy:\n' + logs);
  check((await readJson(health)).status === 'ok', 'Health endpoint should return status=ok.');

  const rootResponse = await fetch(origin + '/');
  const html = await rootResponse.text();
  check(rootResponse.status === 200, 'Homepage should return HTTP 200.');
  check(html.includes('id="root"') && html.toLowerCase().includes('tekvix'), 'Homepage HTML should contain the React mount and Tekvix metadata.');

  const statsResponse = await fetch(origin + '/api/site/stats');
  const statsData = await readJson(statsResponse);
  check(statsResponse.ok && statsData.success === true, 'Public site statistics endpoint should work.');

  const eventResponse = await fetch(origin + '/api/opening-event');
  const eventData = await readJson(eventResponse);
  check(eventResponse.ok && eventData.success === true, 'Opening-event endpoint should work.');

  const enamadResponse = await fetch(origin + '/71412558.txt');
  check(enamadResponse.status === 200 && (await enamadResponse.text()).trim() === '71412558', 'Domain verification text endpoint should return the expected text.');

  const portalResponse = await fetch(origin + '/assets/videos/pink-earth-portal.webm');
  const portalBytes = await portalResponse.arrayBuffer();
  check(portalResponse.status === 200, 'Pink portal video asset should be served.');
  check((portalResponse.headers.get('content-type') || '').includes('video/webm') && portalBytes.byteLength > 1000 && portalBytes.byteLength < 100000, 'Pink portal asset should be a compact WebM video.');

  const adminStatsBeforeLogin = await fetch(origin + '/api/admin/stats');
  check(adminStatsBeforeLogin.status === 401, 'Admin statistics must reject unauthenticated requests.');
  const usersBeforeLogin = await fetch(origin + '/api/users');
  check(usersBeforeLogin.status === 401, 'User listing must reject unauthenticated requests.');

  const orderId = 'ORD-' + Date.now() + '-' + String(crypto.randomInt(0, 1000)).padStart(3, '0');
  const orderPayload = {
    id: orderId,
    fullName: 'Tekvix Automated Smoke Test',
    telegramOrPhone: '@tekvix_smoke_test',
    serviceId: 'ai-website',
    serviceTitle: 'Automated smoke test',
    message: 'Test-only order generated in an isolated temporary database.',
    priceQuoted: '۰ تومان',
  };
  const orderResponse = await fetch(origin + '/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });
  const orderData = await readJson(orderResponse);
  check(orderResponse.status === 201 && orderData.success === true, 'Order submission should persist a valid order.');
  check(orderData.order?.id === orderId, 'Order ID shown to the customer must match the server-stored ID.');

  const duplicateResponse = await fetch(origin + '/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });
  check(duplicateResponse.status === 409, 'Duplicate order IDs must be rejected.');

  const trackResponse = await fetch(origin + '/api/orders/track/' + encodeURIComponent(orderId));
  const trackData = await readJson(trackResponse);
  check(trackResponse.ok && trackData.orders?.some((order) => order.id === orderId), 'Order tracking should find the exact stored order ID.');

  const userResponse = await fetch(origin + '/api/users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 'smoke-role-escalation',
      name: 'Smoke Test User',
      email: 'smoke@example.invalid',
      role: 'admin',
    }),
  });
  const userData = await readJson(userResponse);
  check(userResponse.ok && userData.success === true, 'Public user profile creation should remain available.');
  check(userData.user?.role !== 'admin', 'Public user creation must not allow role escalation to admin.');

  const loginResponse = await fetch(origin + '/api/admin/verify-password', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-proto': 'https',
    },
    body: JSON.stringify({ password: adminPassword }),
  });
  const loginData = await readJson(loginResponse);
  check(loginResponse.ok && loginData.success === true && loginData.valid === true, 'Valid admin login should establish a session.');
  check(!Object.hasOwn(loginData, 'token'), 'Admin login must not issue a browser-stored admin token.');
  const sessionCookie = (loginResponse.headers.get('set-cookie') || '').match(/tekvix_session=([^;]+)/)?.[0];
  check(Boolean(sessionCookie), 'Admin login should set the server-side session cookie.');

  const adminStatsAfterLogin = await fetch(origin + '/api/admin/stats', { headers: { cookie: sessionCookie } });
  const adminStatsData = await readJson(adminStatsAfterLogin);
  check(adminStatsAfterLogin.ok && adminStatsData.success === true, 'Authenticated session should unlock admin statistics.');

  const usersAfterLogin = await fetch(origin + '/api/users', { headers: { cookie: sessionCookie } });
  const usersAfterLoginData = await readJson(usersAfterLogin);
  check(usersAfterLogin.ok && usersAfterLoginData.success === true, 'Authenticated session should unlock user listing.');

  const weakPasswordResponse = await fetch(origin + '/api/admin/change-password', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: sessionCookie },
    body: JSON.stringify({ oldPassword: adminPassword, newPassword: 'weak' }),
  });
  check(weakPasswordResponse.status === 400, 'Password changes shorter than eight characters must be rejected.');

  console.log('✅ Tekvix runtime smoke checks passed: ' + passed + ' checks.');
} catch (error) {
  console.error('❌ Tekvix runtime smoke test failed:', error);
  if (logs) console.error(logs);
  process.exitCode = 1;
} finally {
  if (child && child.exitCode === null) {
    child.kill('SIGTERM');
    await Promise.race([once(child, 'exit'), sleep(2000)]);
    if (child.exitCode === null) child.kill('SIGKILL');
  }
  rmSync(tempDir, { recursive: true, force: true });
}
