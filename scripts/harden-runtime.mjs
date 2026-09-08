import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(root, file), content, 'utf8');
const replace = (source, from, to, label) => {
  if (!source.includes(from)) throw new Error(`Runtime hardening failed: pattern not found: ${label}`);
  return source.replace(from, to);
};

let server = read('server.ts');
if (!server.includes("import crypto from 'crypto';")) {
  server = server.replace("import path from 'path';", "import path from 'path';\nimport crypto from 'crypto';");
}
server = server.replace(
  "secret: process.env.SESSION_SECRET || 'tekvix_sec_session_83jf02kf9481hx',",
  "secret: (process.env.SESSION_SECRET || '').trim() || crypto.randomBytes(32).toString('hex'),"
);
server = server.replace(
  "if (typeof newPassword !== 'string' || newPassword.trim().length < 4) {\n        res.status(400).json({ success: false, message: 'رمز عبور جدید باید حداقل ۴ کاراکتر باشد.' });",
  "if (typeof newPassword !== 'string' || newPassword.trim().length < 8) {\n        res.status(400).json({ success: false, message: 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد.' });"
);
server = server.replace(
  "            token: adminToken,\n            message: 'ورود با موفقیت انجام شد.',",
  "            message: 'ورود با موفقیت انجام شد.',"
);
write('server.ts', server);

let db = read('src/server/db.ts');
db = replace(
  db,
  "const initialPassword = process.env.ADMIN_INITIAL_PASSWORD?.trim() || 'mahdi2020';\n      this.adminPasswordHash = hashPassword(initialPassword);",
  "const initialPassword = process.env.ADMIN_INITIAL_PASSWORD?.trim();\n      if (!initialPassword) {\n        throw new Error('ADMIN_INITIAL_PASSWORD or ADMIN_PASSWORD_HASH must be configured before first admin initialization.');\n      }\n      const passwordCheck = validatePasswordStrength(initialPassword);\n      if (!passwordCheck.isValid) {\n        throw new Error(passwordCheck.message || 'ADMIN_INITIAL_PASSWORD is too weak.');\n      }\n      this.adminPasswordHash = hashPassword(initialPassword);",
  'hardcoded admin initial password'
);
write('src/server/db.ts', db);

let context = read('src/context/SiteDataContext.tsx');
context = context.replace(
  "      const token = typeof window !== 'undefined' ? localStorage.getItem('tekvix_admin_token') || '' : '';\n      const activeBotToken = (override?.botToken ?? telegramSettings.botToken ?? '').trim();\n      const activeChatId = (override?.chatId ?? telegramSettings.chatId ?? '').trim();",
  "      const activeBotToken = (override?.botToken ?? telegramSettings.botToken ?? '').trim();\n      const activeChatId = (override?.chatId ?? telegramSettings.chatId ?? '').trim();"
);
context = context.replace(
  "          ...(token ? { 'x-admin-token': token } : {}),",
  ""
);
write('src/context/SiteDataContext.tsx', context);

console.log('✅ Runtime hardening applied.');
