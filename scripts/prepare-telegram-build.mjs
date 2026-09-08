import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const serverPath = path.join(process.cwd(), 'server.ts');
const server = fs.readFileSync(serverPath, 'utf8');

// The Telegram patcher edits the working tree. Make repeated local builds safe:
// only apply the legacy patch when the legacy implementation is still present.
if (server.includes('VERIFIED_FALLBACK_BOT_TOKEN') && !server.includes('function getTelegramBotToken()')) {
  const result = spawnSync(process.execPath, [path.join(process.cwd(), 'scripts/patch-telegram-runtime.mjs')], {
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
} else {
  console.log('ℹ️ Telegram runtime already hardened; skipping legacy patch step.');
}
