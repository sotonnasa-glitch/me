import fs from 'node:fs';

const server = fs.readFileSync('server.ts', 'utf8');
const db = fs.readFileSync('src/server/db.ts', 'utf8');
const context = fs.readFileSync('src/context/SiteDataContext.tsx', 'utf8');

if (!server.includes('function getTelegramBotToken()')) {
  throw new Error('Security check failed: Telegram credentials must be server-side environment secrets.');
}
if (/\b\d{8,12}:[A-Za-z0-9_-]{30,}\b/.test(server) || /\b\d{8,12}:[A-Za-z0-9_-]{30,}\b/.test(context)) {
  throw new Error('Security check failed: a Telegram bot token pattern is present in source. Rotate the token and remove it from source.');
}
if (db.includes('const validPWS =') || db.includes("|| 'mahdi2020'")) {
  throw new Error('Security check failed: hard-coded administrator password fallback remains.');
}
console.log('✅ Source security checks passed.');
