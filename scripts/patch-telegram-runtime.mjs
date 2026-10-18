import fs from 'node:fs';

const server = fs.readFileSync('server.ts', 'utf8');
if (!server.includes('function getTelegramBotToken()') || /\b\d{8,12}:[A-Za-z0-9_-]{30,}\b/.test(server)) {
  throw new Error('Telegram runtime check failed: use environment secrets only and remove embedded bot tokens.');
}
console.log('✅ Telegram runtime is configured for server-side secrets; no source rewrite needed.');
