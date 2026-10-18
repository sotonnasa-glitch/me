import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

// Keep the historical build step name for compatibility, but validate rather than rewriting credentials.
const result = spawnSync(process.execPath, [path.join(process.cwd(), 'scripts/patch-telegram-runtime.mjs')], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);
const server = fs.readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
if (server.includes('VERIFIED_FALLBACK_BOT_TOKEN')) throw new Error('Legacy embedded Telegram fallback is not allowed.');
