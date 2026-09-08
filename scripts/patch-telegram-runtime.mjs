import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
}
function replaceOnce(source, from, to, label) {
  if (!source.includes(from)) {
    throw new Error(`Telegram patch failed: pattern not found: ${label}`);
  }
  return source.replace(from, to);
}

// SERVER: remove hard-coded Telegram credentials and client-controlled secrets.
let server = read('server.ts');

const oldResolver = `  // Helper to resolve and normalize Telegram Chat IDs (maps usernames to verified chat IDs)\n  function resolveTelegramChatIds(chatIdInput: string | undefined | null): string[] {\n    const envChatId = (process.env.TELEGRAM_CHAT_ID || '').trim();\n    const defaultChatId = '7460143967';\n\n    const sourceString = [envChatId, chatIdInput].filter(Boolean).join(',');\n    if (!sourceString.trim()) {\n      return [defaultChatId];\n    }\n\n    const rawParts = sourceString\n      .split(/[,;\\n]+/)\n      .map((s) => s.trim())\n      .filter(Boolean);\n\n    if (rawParts.length === 0) {\n      return [defaultChatId];\n    }\n\n    const resolved: string[] = [];\n    for (const part of rawParts) {\n      const lower = part.toLowerCase();\n      if (lower === '@lawat_kar' || lower === 'lawat_kar') {\n        resolved.push('7460143967');\n      } else if (lower === '@tekvix' || lower === 'tekvix') {\n        resolved.push('-1003569018930');\n      } else if (/^-?\\d+$/.test(part)) {\n        // Valid numeric chat ID or channel ID\n        resolved.push(part);\n      } else {\n        // Passed some other channel or username - include it\n        resolved.push(part);\n      }\n    }\n\n    // Always ensure at least defaultChatId if list is empty\n    if (resolved.length === 0) {\n      resolved.push(defaultChatId);\n    }\n\n    return Array.from(new Set(resolved));\n  }\n\n  const VERIFIED_FALLBACK_BOT_TOKEN = '8518856410:AAHIe2F0906hD4O12sNpe_YplCv9_QZ86B4';\n  const VERIFIED_BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN || VERIFIED_FALLBACK_BOT_TOKEN).trim();`;

const newResolver = `  // Resolve Telegram targets exclusively from server-side environment configuration.\n  function resolveTelegramChatIds(chatIdInput?: string | null): string[] {\n    // chatIdInput is intentionally ignored: clients must never choose the destination.\n    const envChatId = (process.env.TELEGRAM_CHAT_ID || '').trim();\n    if (!envChatId) return [];\n    return Array.from(\n      new Set(\n        envChatId\n          .split(/[,;\\n]+/)\n          .map((s) => s.trim())\n          .filter((s) => /^-?\\d+$/.test(s))\n      )\n    );\n  }\n\n  function getTelegramBotToken(): string {\n    const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();\n    if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured on the server.');\n    return token;\n  }`;

if (server.includes('VERIFIED_FALLBACK_BOT_TOKEN')) {
  server = replaceOnce(server, oldResolver, newResolver, 'server Telegram resolver/token block');
}

server = replaceOnce(
  server,
  `    replyMarkup?: any,\n    customToken?: string\n  ): Promise<{ success: boolean; deliveredTo: string[]; errors: string[]; messageIds: number[] }> {\n    let effectiveToken = (customToken || VERIFIED_BOT_TOKEN).trim();\n    if (effectiveToken === '8518856410:AAEHtuGJHgyE6WDy2PwFVBpPiR0BgQwZfus' || !effectiveToken) {\n      effectiveToken = VERIFIED_BOT_TOKEN;\n    }\n\n    const targets = chatIds && chatIds.length > 0 ? chatIds : resolveTelegramChatIds(undefined);`,
  `    replyMarkup?: any\n  ): Promise<{ success: boolean; deliveredTo: string[]; errors: string[]; messageIds: number[] }> {\n    const effectiveToken = getTelegramBotToken();\n    const targets = chatIds && chatIds.length > 0 ? chatIds : resolveTelegramChatIds(undefined);\n    if (targets.length === 0) {\n      return { success: false, deliveredTo: [], errors: ['TELEGRAM_CHAT_ID is not configured or contains no numeric chat IDs.'], messageIds: [] };\n    }`,
  'dispatcher credentials/signature'
);

server = server.replace(/\n\s*\/\/ Auto-recovery: if custom token fails with 401 Unauthorized, retry with verified bot token[\s\S]*?\n\s*}\n\s*}\n\n\s*const desc = data\?\.description/, `\n          const desc = data?.description`);

// Remove background Telegram dispatch from /api/orders; the explicit Telegram endpoint is the single delivery path.
const orderDispatchStart = `      // Dispatch Telegram notification strictly via server environment variable\n`;
const orderDispatchEnd = `      dispatchTelegramNotification(targetChatIds, telegramText, inlineKeyboard).catch(\n        (tgErr) => console.error('❌ [BACKGROUND_TELEGRAM_ERROR]:', tgErr)\n      );\n\n`;
if (server.includes(orderDispatchStart)) {
  const start = server.indexOf(orderDispatchStart);
  const end = server.indexOf(orderDispatchEnd, start);
  if (end === -1) throw new Error('Telegram patch failed: /api/orders dispatch block end not found');
  server = server.slice(0, start) + `      // Telegram delivery is handled by /api/telegram/send-order after the order is saved.\n\n` + server.slice(end + orderDispatchEnd.length);
}

server = server.replace(
  `      const { order, chatId, botToken } = req.body;`,
  `      const { order } = req.body;`
);
server = server.replace(
  `      const targetChatIds = resolveTelegramChatIds(chatId);`,
  `      const targetChatIds = resolveTelegramChatIds(undefined);`
);
server = server.replace(
  `        inlineKeyboard,\n        botToken\n      );`,
  `        inlineKeyboard\n      );`
);

// Make Telegram failures real HTTP failures instead of reporting success:true.
server = server.replace(
  `        res.json({\n          success: true,\n          telegramSent: false,`,
  `        res.status(502).json({\n          success: false,\n          telegramSent: false,`
);

// Consultation/test endpoints must also use only server-side credentials.
server = server.replace(
  `      const { chatId, botToken } = req.body;\n      const targetChatIds = resolveTelegramChatIds(chatId);`,
  `      const targetChatIds = resolveTelegramChatIds(undefined);`
);
server = server.replace(
  `        testInlineKeyboard,\n        botToken\n      );`,
  `        testInlineKeyboard\n      );`
);

// Never leak the active Telegram destination/token in startup logs.
server = server.replace(
  `console.log(\`• TELEGRAM_BOT_TOKEN env set: \${Boolean(process.env.TELEGRAM_BOT_TOKEN)} (\${maskToken(process.env.TELEGRAM_BOT_TOKEN || '')})\`);`,
  `console.log(\`• TELEGRAM_BOT_TOKEN configured: \${Boolean(process.env.TELEGRAM_BOT_TOKEN)}\`);`
);
server = server.replace(
  `console.log(\`• TELEGRAM_CHAT_ID env set:   \${Boolean(process.env.TELEGRAM_CHAT_ID)} (\${process.env.TELEGRAM_CHAT_ID || 'not set, using default: 7460143967'})\`);`,
  `console.log(\`• TELEGRAM_CHAT_ID configured:   \${Boolean(process.env.TELEGRAM_CHAT_ID)}\`);`
);

write('server.ts', server);

// CLIENT: never send Telegram credentials from the browser and never swallow delivery failures.
let context = read('src/context/SiteDataContext.tsx');
context = replaceOnce(
  context,
  `        body: JSON.stringify({\n          order,\n          botToken: telegramSettings.botToken,\n          chatId: telegramSettings.chatId,\n        }),`,
  `        body: JSON.stringify({ order }),`,
  'client order Telegram payload'
);
context = replaceOnce(
  context,
  `      return {\n        success: data.success ?? true,\n        message: data.message || 'سفارش ثبت و پیام به تلگرام ارسال شد.',\n        directLink: data.directLink || data.fallbackUrl,\n      };`,
  `      return {\n        success: Boolean(response.ok && data.success && data.telegramSent),\n        message: data.message || (data.telegramSent ? 'پیام سفارش به تلگرام ارسال شد.' : 'ارسال پیام به تلگرام ناموفق بود.'),\n        directLink: data.directLink || data.fallbackUrl,\n      };`,
  'client order Telegram result'
);
context = replaceOnce(
  context,
  `      return {\n        success: true,\n        message: 'سفارش در سیستم ثبت شد.',\n        directLink: ` + "`https://t.me/${brandInfo.telegramHandle.replace('@', '')}`" + `,\n      };`,
  `      return {\n        success: false,\n        message: 'سفارش ثبت شد اما ارسال اعلان تلگرام انجام نشد.',\n        directLink: ` + "`https://t.me/${brandInfo.telegramHandle.replace('@', '')}`" + `,\n      };`,
  'client order Telegram catch'
);
context = context.replace(
  `          ...data,\n          botToken: telegramSettings.botToken,\n          chatId: telegramSettings.chatId,\n        }),`,
  `          ...data,\n        }),`
);
context = context.replace(
  `        success: result.success ?? true,`,
  `        success: Boolean(response.ok && result.success && result.telegramSent),`
);
context = context.replace(
  `        success: true,\n        message: 'درخواست شما ثبت شد.',`,
  `        success: false,\n        message: 'درخواست ثبت شد اما ارسال اعلان تلگرام انجام نشد.',`
);
write('src/context/SiteDataContext.tsx', context);

// UI: only show success after Telegram delivery is confirmed.
let modal = read('src/components/OrderModal.tsx');
modal = replaceOnce(
  modal,
  `    try {\n      await sendOrderToTelegramBot(created);\n    } catch (err) {\n      console.warn('Telegram send ignored:', err);\n    } finally {\n      setIsSubmitting(false);\n      setIsSuccess(true);\n    }`,
  `    try {\n      const telegramResult = await sendOrderToTelegramBot(created);\n      if (!telegramResult.success) {\n        setErrors({ telegramOrPhone: telegramResult.message || 'ارسال اعلان تلگرام ناموفق بود. لطفاً دوباره تلاش کنید.' });\n        setIsSubmitting(false);\n        return;\n      }\n      setIsSubmitting(false);\n      setIsSuccess(true);\n    } catch (err) {\n      console.error('Telegram send failed:', err);\n      setErrors({ telegramOrPhone: 'ارسال اعلان تلگرام ناموفق بود. لطفاً دوباره تلاش کنید.' });\n      setIsSubmitting(false);\n    }`,
  'order modal Telegram confirmation'
);
write('src/components/OrderModal.tsx', modal);

console.log('✅ Tekvix Telegram runtime patch applied successfully.');
