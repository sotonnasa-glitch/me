import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/db';

const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(express.json());

  // Helper for lazy Gemini client
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // 1. Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // 2. LIVE ADMIN STATS (GET /api/admin/stats)
  app.get('/api/admin/stats', (req, res) => {
    try {
      const stats = db.getAdminStats();
      res.json({
        success: true,
        stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ success: false, error: 'خطا در دریافت آمار پنل ادمین', details: error?.message });
    }
  });

  // 3. LIVE SITE PUBLIC STATS (GET /api/site/stats)
  app.get('/api/site/stats', (req, res) => {
    try {
      const siteStats = db.getSiteStats();
      res.json({
        success: true,
        stats: siteStats,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error fetching site stats:', error);
      res.status(500).json({ success: false, error: 'خطا در دریافت آمار زنده وب‌سایت', details: error?.message });
    }
  });

  // 4. RECORD ANALYTICS EVENT (POST /api/analytics/event)
  app.post('/api/analytics/event', (req, res) => {
    try {
      const { eventType, path: eventPath, serviceId, device, referrer, value, metadata } = req.body;
      if (!eventType) {
        res.status(400).json({ success: false, error: 'eventType الزامی است' });
        return;
      }

      const event = db.recordEvent({
        eventType,
        path: eventPath || '/',
        serviceId,
        device: device || 'mobile',
        referrer,
        value: Number(value) || 0,
        metadata,
      });

      res.json({ success: true, event });
    } catch (error: any) {
      console.error('Error recording analytics event:', error);
      res.status(500).json({ success: false, error: 'خطا در ثبت رویداد' });
    }
  });

  // 5. ORDERS REST API (GET, POST, PATCH, DELETE)
  app.get('/api/orders', (req, res) => {
    try {
      const orders = db.getOrders();
      res.json({ success: true, orders, count: orders.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'خطا در واکشی سفارش‌ها' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const {
        fullName,
        telegramOrPhone,
        serviceId,
        serviceTitle,
        budget,
        message,
        priceQuoted,
        adminNotes,
        isPromoEvent,
        promoEventName,
        userEmail,
        botToken,
        chatId,
      } = req.body;
      if (!fullName || !telegramOrPhone || !serviceId) {
        res.status(400).json({ success: false, error: 'اطلاعات سفارش ناقص است' });
        return;
      }

      const newOrder = db.createOrder({
        fullName,
        telegramOrPhone,
        serviceId,
        serviceTitle: serviceTitle || 'خدمت اختصاصی',
        message: message || '',
        priceQuoted,
        adminNotes,
        isPromoEvent: Boolean(isPromoEvent),
        promoEventName,
        userEmail,
        status: 'new',
      });

      // Asynchronously trigger Telegram notification to ensure guaranteed delivery
      const effectiveToken = (botToken || process.env.TELEGRAM_BOT_TOKEN || '8518856410:AAEHtuGJHgyE6WDy2PwFVBpPiR0BgQwZfus').trim();
      const targetChatIds = resolveTelegramChatIds(chatId);
      const orderId = escapeTgHtml(newOrder.id);
      const safeName = escapeTgHtml(newOrder.fullName);
      const rawContact = (newOrder.telegramOrPhone || '').trim();
      const safeContact = escapeTgHtml(rawContact);
      const safeService = escapeTgHtml(newOrder.serviceTitle);
      const safeMsg = escapeTgHtml(newOrder.message || 'بدون توضیح');
      const safePrice = escapeTgHtml(newOrder.priceQuoted || 'استعلامی');
      const { url: pvUrl } = getClientDirectChatUrl(rawContact);

      const telegramText = `
🚀 <b>سفارش جدید در تکویکس (Tekvix AI)</b>
${newOrder.isPromoEvent ? '🎁 <b>نوع سفارش:</b> <i>ایونت افتتاحیه (۱۰۰٪ رایگان)</i>\n' : ''}
📌 <b>کد رهگیری:</b> <code>${orderId}</code>
👤 <b>نام مشتری:</b> <b>${safeName}</b>
📱 <b>آیدی تلگرام:</b> <a href="${pvUrl}">${safeContact}</a> 👈 <i>(لمس کنید)</i>
💼 <b>سرویس انتخابی:</b> ${safeService}
💰 <b>هزینه / برآورد:</b> ${safePrice}
📝 <b>توضیحات:</b>
<i>${safeMsg}</i>

⏰ <b>زمان ثبت:</b> ${new Date().toLocaleString('fa-IR')}
🌐 <b>منبع:</b> وب‌سایت تکویکس
      `.trim();

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: '💬 ورود مستقیم به پی‌وی مشتری (چت تلگرام)',
              url: pvUrl,
            },
          ],
        ],
      };

      dispatchTelegramNotification(effectiveToken, targetChatIds, telegramText, inlineKeyboard).catch(
        (tgErr) => console.warn('Background telegram dispatch error:', tgErr)
      );

      res.status(201).json({ success: true, order: newOrder });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ success: false, error: 'خطا در ثبت سفارش' });
    }
  });

  // 5.1. OPENING EVENT API (GET, POST config)
  app.get('/api/opening-event', (req, res) => {
    try {
      const eventState = db.getOpeningEventState();
      res.json({ success: true, event: eventState });
    } catch (error: any) {
      console.error('Error fetching opening event state:', error);
      res.status(500).json({ success: false, error: 'خطا در دریافت وضعیت ایونت افتتاحیه' });
    }
  });

  app.post('/api/opening-event/config', (req, res) => {
    try {
      const updates = req.body;
      const updatedConfig = db.updateOpeningEventConfig(updates);
      const eventState = db.getOpeningEventState();
      res.json({ success: true, config: updatedConfig, event: eventState });
    } catch (error: any) {
      console.error('Error updating opening event config:', error);
      res.status(500).json({ success: false, error: 'خطا در به‌روزرسانی تنظیمات ایونت' });
    }
  });

  app.patch('/api/orders/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = db.updateOrder(id, updates);
      if (!updated) {
        res.status(404).json({ success: false, error: 'سفارش یافت نشد' });
        return;
      }
      res.json({ success: true, order: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'خطا در به‌روزرسانی سفارش' });
    }
  });

  app.delete('/api/orders/:id', (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteOrder(id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'خطا در حذف سفارش' });
    }
  });

  // 5.5. ADMIN PASSWORD AUTHENTICATION & CHANGE API
  app.get('/api/admin/password-status', (req, res) => {
    try {
      res.json({ success: true, isProtected: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'خطا در بررسی وضعیت رمز عبور' });
    }
  });

  app.post('/api/admin/verify-password', (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        res.status(400).json({ success: false, valid: false, message: 'لطفاً رمز عبور را وارد کنید.' });
        return;
      }
      const isValid = db.verifyAdminPassword(password);
      if (isValid) {
        res.json({ success: true, valid: true, message: 'ورود موفقیت‌آمیز بود.' });
      } else {
        res.status(401).json({ success: false, valid: false, message: 'رمز عبور وارد شده نادرست است.' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'خطا در بررسی رمز عبور' });
    }
  });

  app.post('/api/admin/change-password', (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        res.status(400).json({ success: false, message: 'رمز عبور فعلی و جدید الزامی هستند.' });
        return;
      }
      if (newPassword.trim().length < 4) {
        res.status(400).json({ success: false, message: 'رمز عبور جدید باید حداقل ۴ کاراکتر باشد.' });
        return;
      }
      const isOldValid = db.verifyAdminPassword(oldPassword);
      if (!isOldValid) {
        res.status(401).json({ success: false, message: 'رمز عبور فعلی نادرست است.' });
        return;
      }
      const updated = db.setAdminPassword(newPassword.trim());
      if (updated) {
        res.json({ success: true, message: 'رمز عبور پنل ادمین با موفقیت تغییر یافت.' });
      } else {
        res.status(500).json({ success: false, message: 'خطا در ذخیره رمز عبور جدید.' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'خطا در تغییر رمز عبور' });
    }
  });

  // 6. USERS REST API (GET, POST)
  app.get('/api/users', (req, res) => {
    try {
      const users = db.getUsers();
      res.json({ success: true, users, count: users.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'خطا در دریافت کاربران' });
    }
  });

  app.post('/api/users', (req, res) => {
    try {
      const { id, name, email, phone, telegram, avatar, role } = req.body;
      if (!id || !name || !email) {
        res.status(400).json({ success: false, error: 'شناسه، نام و ایمیل کاربر الزامی است' });
        return;
      }
      const user = db.upsertUser({ id, name, email, phone, telegram, avatar, role });
      res.json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'خطا در ثبت اطلاعات کاربر' });
    }
  });

  // 2. Gemini AI Assistant Endpoint
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { message, history, context } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'پیام نامعتبر است' });
        return;
      }

      const ai = getGeminiClient();

      const systemInstruction = `
شما «دستیار فوق‌هوشمند پلتفرم تکویکس (Tekvix AI Assistant)» هستید.
تکویکس برترین پلتفرم تخصصی ارائه خدمات هوش مصنوعی و طراحی دیجیتال به زبان فارسی است.

حیطه تخصص و خدمات تکویکس:
۱. ساخت وب‌سایت با هوش مصنوعی (طراحی اختصاصی UI/UX مدرن، اتصال به پایگاه داده، پنل ادمین هوشمند، تحویل در ۳ تا ۵ روز).
۲. تولید تیزر و ویدیو با هوش مصنوعی (ویدیوهای تبلیغاتی 4K، سناریونویسی با هوش مصنوعی، مدل‌های پیشرفته تولید ویدیو، موشن گرافیک).
۳. ساخت ربات‌های پیشرفته تلگرام (ربات‌های فروشگاهی، پشتیبانی هوشمند مبتنی بر Gemini، اتصال به وب‌هوک و درگاه پرداخت).
۴. خلق تصاویر، گرافیک و مدل‌های 3D (تولید تصویر با کیفیت فوق‌العاده، بازسازی چهره، کاور موزیک، بنر شبکه‌های اجتماعی).
۵. آهنگسازی، ترانه و صداگذاری هوش مصنوعی (تولید موزیک با کلام، نریشن اختصاصی، دوبله و افکت صوتی).
۶. چت‌بات‌های شرکتی و اتوماسیون بیزینس با هوش مصنوعی.

دستورالعمل لحن و پاسخ‌دهی:
- پاسخ‌ها باید کاملاً فارسی، حرفه‌ای، محترمانه، پرانرژی، کاربردی و جذاب باشند.
- اگر کاربر درباره قیمت یا زمان تحویل پرسید، محدوده تخمینی و مزایای تکویکس را با دقت توضیح دهید و کاربر را به ثبت سفارش مستقیم دعوت کنید.
- اگر کاربر ایده یا سناریو خواست (مثلاً سناریوی ویدیوی تبلیغاتی یا پرامپت)، پرامپت‌ها و سناریوهای خلاقانه با جزییات ارائه دهید.
- برای ساختاردهی زیبا از بولت‌پوینت‌ها و ایموجی‌های مناسب استفاده کنید.
- همواره در انتهای پاسخ‌های مرتبط، به کاربر بگویید که با کلیک روی دکمه «ثبت سفارش آنی» در پایین صفحه یا ارتباط با تلگرام (@Lawat_kar) می‌تواند پروژه خود را نهایی کند.
`;

      if (ai) {
        // Prepare formatted contents
        const contentsPayload: any[] = [];

        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-6)) {
            if (item.role === 'user' || item.role === 'model') {
              contentsPayload.push({
                role: item.role,
                parts: [{ text: item.text || item.content || '' }],
              });
            }
          }
        }

        contentsPayload.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: contentsPayload,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const textOutput = response.text || 'پاسخی از مدل دریافت نشد.';
        res.json({ text: textOutput, success: true });
        return;
      }

      // High-quality fallback intelligent responder when API key is missing or testing
      const lower = message.toLowerCase();
      let fallbackText = '';

      if (lower.includes('قیمت') || lower.includes('هزینه') || lower.includes('تعرفه')) {
        fallbackText = `💡 **برآورد هزینه خدمات تکویکس:**\n\n• **طراحی وب‌سایت با هوش مصنوعی:** از ۴,۵۰۰,۰۰۰ تومان (تحویل ۳ تا ۵ روز)\n• **تولید تیزر و ویدیوی هوش مصنوعی:** از ۲,۸۰۰,۰۰۰ تومان (تحویل ۲ روز)\n• **ساخت ربات تلگرام پیشرفته:** از ۳,۵۰۰,۰۰۰ تومان\n• **خلق بسته تصاویر و گرافیک:** از ۱,۲۰۰,۰۰۰ تومان\n\nبرای سفارش اختصاصی می‌توانید مستقیماً فرم ثبت سفارش را تکمیل کنید یا به تلگرام @Lawat_kar پیام دهید.`;
      } else if (lower.includes('ویدیو') || lower.includes('تیزر') || lower.includes('فیلم')) {
        fallbackText = `🎬 **تولید ویدیو و تیزر با هوش مصنوعی در تکویکس:**\n\nما با استفاده از جدیدترین موتورهای تولید تصویر و ویدیو، سناریوهای تبلیغاتی خیره‌کننده، گویندگی طبیعی و انیمیشن‌های روان 4K خلق می‌کنیم.\n\n✨ می‌توانید در بخش «وبلاگ و ویدیوها» نمونه ویدیوها را تماشا کنید یا سناریوی مدنظرتان را بگویید تا پرامپت اختصاصی برایتان بنویسم!`;
      } else if (lower.includes('ربات') || lower.includes('تلگرام')) {
        fallbackText = `🤖 **ساخت ربات‌های هوشمند تلگرام:**\n\nربات‌های تلگرام تکویکس مجهز به هوش مصنوعی پاسخگو، درگاه پرداخت، پنل ادمین اختصاصی و اتصال به دیتابیس هستند.\n\nسفارش شما در تلگرام به‌صورت بلادرنگ ثبت و به ادمین ارسال خواهد شد.`;
      } else {
        fallbackText = `سلام! خوشحالم که در تکویکس در خدمت شما هستم ✨\n\nمن دستیار هوش مصنوعی تکویکس هستم. می‌توانم در زمینه‌های زیر به شما کمک کنم:\n۱. 🌐 مشاوره و برآورد هزینه طراحی وب‌سایت مدرن\n۲. 🎬 نگارش سناریو و پرامپت برای تولید ویدیوی تبلیغاتی هوش مصنوعی\n۳. 🤖 ایده‌پردازی و امکانات ربات‌های تلگرام هوشمند\n۴. 🎨 خلق تصاویر و هویت بصری هوش مصنوعی\n\nچه کمکی از دست من برای پروژه شما برمی‌آید؟`;
      }

      res.json({ text: fallbackText, success: true, isFallback: true });
    } catch (error: any) {
      console.error('Gemini Assistant API Error:', error);
      res.status(500).json({
        error: 'خطا در پردازش درخواست هوش مصنوعی',
        details: error?.message || 'Unknown error',
      });
    }
  });

  // Helper to escape HTML for Telegram Markdown/HTML parse mode
  function escapeTgHtml(text: string | undefined | null): string {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function parseTelegramError(description: string, chatId: string): string {
    const desc = description || '';
    if (desc.includes('chat not found')) {
      if (chatId.startsWith('@')) {
        return `خطا: تلگرام برای چت‌های شخصی نام‌کاربری (مثل ${chatId}) را قبول نمی‌کند. لطفاً شناسه عددی (Chat ID) خود را از ربات @userinfobot دریافت و وارد کنید، یا اگر کانال است، ربات را ادمین کانال کنید.`;
      }
      return 'خطا: چت تلگرام یافت نشد. آیا ربات را استارت (/start) کرده‌اید؟ لطفاً ابتدا در تلگرام وارد ربات شده و دکمه Start را بزنید.';
    }
    if (desc.includes('Unauthorized') || desc.includes('bot_token')) {
      return 'خطا: توکن ربات تلگرام نامعتبر است. لطفاً توکن دقیق دریافتی از @BotFather را وارد کنید.';
    }
    if (desc.includes('bot was blocked by the user')) {
      return 'خطا: ربات توسط این کاربر بلاک شده است. لطفاً وارد ربات شده و آن را Unblock و Start کنید.';
    }
    return `خطای تلگرام: ${description}`;
  }

  // Helper to extract clean Telegram/Phone URL for direct PV chat
  const getClientDirectChatUrl = (rawContact: string): { url: string; isPhone: boolean } => {
    const contact = (rawContact || '').trim();
    if (!contact) {
      return { url: 'https://t.me/Lawat_kar', isPhone: false };
    }
    // Check if starts with @ or is a username
    if (contact.startsWith('@')) {
      const username = contact.replace(/^@+/, '').trim();
      return { url: `https://t.me/${username}`, isPhone: false };
    }
    // Check if phone number (Iranian or international)
    const digitsOnly = contact.replace(/\D/g, '');
    if (digitsOnly.length >= 10) {
      let intlPhone = digitsOnly;
      if (digitsOnly.startsWith('09')) {
        intlPhone = '98' + digitsOnly.slice(1);
      } else if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
        intlPhone = '98' + digitsOnly;
      }
      return { url: `https://t.me/+${intlPhone}`, isPhone: true };
    }
    // Check if alphanumeric username without @
    if (/^[a-zA-Z0-9_]{3,32}$/.test(contact)) {
      return { url: `https://t.me/${contact}`, isPhone: false };
    }
    // Fallback to Telegram search
    return { url: `https://t.me/${contact.replace(/\s+/g, '')}`, isPhone: false };
  };

  // Helper to resolve and normalize Telegram Chat IDs (maps usernames to verified chat IDs)
  function resolveTelegramChatIds(chatIdInput: string | undefined | null): string[] {
    const defaultChatId = (process.env.TELEGRAM_CHAT_ID || '7460143967').trim();
    if (!chatIdInput || !chatIdInput.trim()) {
      return [defaultChatId];
    }

    const rawParts = chatIdInput
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawParts.length === 0) {
      return [defaultChatId];
    }

    const resolved: string[] = [];
    for (const part of rawParts) {
      const lower = part.toLowerCase();
      if (lower === '@lawat_kar' || lower === 'lawat_kar') {
        resolved.push('7460143967');
      } else if (lower === '@tekvix' || lower === 'tekvix') {
        resolved.push('-1003569018930');
      } else if (/^-?\d+$/.test(part)) {
        // Valid numeric chat ID or channel ID
        resolved.push(part);
      } else {
        // Passed some other channel or username - include it and ensure admin default is also present
        resolved.push(part);
        if (!resolved.includes(defaultChatId)) {
          resolved.push(defaultChatId);
        }
      }
    }

    // Always ensure at least defaultChatId if list is empty
    return resolved.length > 0 ? Array.from(new Set(resolved)) : [defaultChatId];
  }

  // Robust Dispatcher to one or multiple Telegram targets
  async function dispatchTelegramNotification(
    token: string,
    chatIds: string[],
    text: string,
    replyMarkup?: any
  ): Promise<{ success: boolean; deliveredTo: string[]; errors: string[]; messageIds: number[] }> {
    const effectiveToken = (token || process.env.TELEGRAM_BOT_TOKEN || '8518856410:AAEHtuGJHgyE6WDy2PwFVBpPiR0BgQwZfus').trim();
    const targets = chatIds && chatIds.length > 0 ? chatIds : ['7460143967'];

    const deliveredTo: string[] = [];
    const errors: string[] = [];
    const messageIds: number[] = [];

    for (const target of targets) {
      try {
        const tgUrl = `https://api.telegram.org/bot${effectiveToken}/sendMessage`;
        const payload: any = {
          chat_id: target,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        };
        if (replyMarkup) {
          payload.reply_markup = replyMarkup;
        }

        const tgRes = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data: any = await tgRes.json();
        if (data.ok) {
          deliveredTo.push(target);
          if (data.result?.message_id) {
            messageIds.push(data.result.message_id);
          }
        } else {
          const errMsg = parseTelegramError(data.description || 'Unknown Telegram Error', target);
          errors.push(`[${target}]: ${errMsg}`);
          console.warn(`Telegram API failure for target ${target}:`, data);
        }
      } catch (err: any) {
        errors.push(`[${target}]: ${err?.message || 'Network error'}`);
        console.error(`Network error sending to Telegram target ${target}:`, err);
      }
    }

    return {
      success: deliveredTo.length > 0,
      deliveredTo,
      errors,
      messageIds,
    };
  }

  // 3. Telegram Bot Order Notification API
  app.post('/api/telegram/send-order', async (req, res) => {
    try {
      const { order, botToken, chatId } = req.body;

      if (!order) {
        res.status(400).json({ error: 'اطلاعات سفارش ارسال نشده است.' });
        return;
      }

      const effectiveToken = (botToken || process.env.TELEGRAM_BOT_TOKEN || '8518856410:AAEHtuGJHgyE6WDy2PwFVBpPiR0BgQwZfus').trim();
      const targetChatIds = resolveTelegramChatIds(chatId);

      const orderId = escapeTgHtml(order.id || 'ORD-' + Math.floor(1000 + Math.random() * 9000));
      const fullName = escapeTgHtml(order.fullName || 'کاربر تکویکس');
      const rawContact = (order.telegramOrPhone || 'ثبت نشده').trim();
      const contactEscaped = escapeTgHtml(rawContact);
      const serviceTitle = escapeTgHtml(order.serviceTitle || 'خدمات هوش مصنوعی');
      const message = escapeTgHtml(order.message || 'بدون توضیح');
      const priceQuoted = escapeTgHtml(order.priceQuoted || 'استعلامی');
      const isPromo = Boolean(order.isPromoEvent);
      const dateStr = new Date().toLocaleString('fa-IR');

      const { url: pvUrl } = getClientDirectChatUrl(rawContact);

      const telegramMessage = `
🚀 <b>سفارش جدید در تکویکس (Tekvix AI)</b>
${isPromo ? '🎁 <b>نوع سفارش:</b> <i>ایونت افتتاحیه (۱۰۰٪ رایگان)</i>\n' : ''}
📌 <b>کد رهگیری:</b> <code>${orderId}</code>
👤 <b>نام مشتری:</b> <b>${fullName}</b>
📱 <b>آیدی تلگرام:</b> <a href="${pvUrl}">${contactEscaped}</a> 👈 <i>(لمس کنید)</i>
💼 <b>سرویس انتخابی:</b> ${serviceTitle}
💰 <b>هزینه / برآورد:</b> ${priceQuoted}
📝 <b>توضیحات و نیازمندی:</b>
<i>${message}</i>

⏰ <b>زمان ثبت:</b> ${dateStr}
🌐 <b>منبع:</b> وب‌سایت تکویکس
      `.trim();

      // Inline Keyboard for 1-Tap Direct PV Open
      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: '💬 ورود مستقیم به پی‌وی مشتری (چت تلگرام)',
              url: pvUrl,
            },
          ],
        ],
      };

      const dispatchResult = await dispatchTelegramNotification(
        effectiveToken,
        targetChatIds,
        telegramMessage,
        inlineKeyboard
      );

      if (dispatchResult.success) {
        res.json({
          success: true,
          telegramSent: true,
          deliveredTo: dispatchResult.deliveredTo,
          messageId: dispatchResult.messageIds[0],
          pvUrl,
          message: 'پیام سفارش فوراً به ربات تلگرام ارسال شد!',
        });
      } else {
        res.json({
          success: true,
          telegramSent: false,
          telegramError: dispatchResult.errors.join(' | '),
          pvUrl,
          fallbackUrl: `https://t.me/Lawat_kar?text=${encodeURIComponent(`سفارش ${orderId}: ${serviceTitle} - ${rawContact}`)}`,
        });
      }
    } catch (err: any) {
      console.error('Error sending order to Telegram:', err);
      res.status(500).json({ error: 'خطا در ارتباط با سرور تلگرام', details: err?.message });
    }
  });

  // 3.5 Telegram Consultation & Lead Notification API
  app.post('/api/telegram/send-consultation', async (req, res) => {
    try {
      const { name, contactInfo, topic, message, botToken, chatId } = req.body;

      if (!name || !contactInfo) {
        res.status(400).json({ error: 'نام و اطلاعات تماس الزامی است.' });
        return;
      }

      const effectiveToken = (botToken || process.env.TELEGRAM_BOT_TOKEN || '8518856410:AAEHtuGJHgyE6WDy2PwFVBpPiR0BgQwZfus').trim();
      const targetChatIds = resolveTelegramChatIds(chatId);

      const fullName = escapeTgHtml(name.trim());
      const rawContact = contactInfo.trim();
      const contactEscaped = escapeTgHtml(rawContact);
      const consultationTopic = escapeTgHtml(topic || 'مشاوره و استعلام عمومی هوش مصنوعی');
      const userMessage = escapeTgHtml(message || 'بدون پیام تکمیلی');
      const dateStr = new Date().toLocaleString('fa-IR');

      const { url: pvUrl } = getClientDirectChatUrl(rawContact);

      const telegramMessage = `
💬 <b>درخواست مشاوره و استعلام جدید در تکویکس</b>

👤 <b>نام کاربر:</b> <b>${fullName}</b>
📱 <b>آیدی تلگرام:</b> <a href="${pvUrl}">${contactEscaped}</a> 👈 <i>(لمس کنید)</i>
🎯 <b>موضوع مشاوره:</b> ${consultationTopic}
📝 <b>متن پیام و شرح ایده:</b>
<i>${userMessage}</i>

⏰ <b>زمان ثبت:</b> ${dateStr}
🌐 <b>بخش:</b> فرم مشاوره و تماس سایت
      `.trim();

      // Inline Keyboard with 1-Tap Direct PV Button
      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: '🚀 ورود مستقیم به پی‌وی کاربر (چت تلگرام)',
              url: pvUrl,
            },
          ],
        ],
      };

      const dispatchResult = await dispatchTelegramNotification(
        effectiveToken,
        targetChatIds,
        telegramMessage,
        inlineKeyboard
      );

      if (dispatchResult.success) {
        res.json({
          success: true,
          telegramSent: true,
          deliveredTo: dispatchResult.deliveredTo,
          messageId: dispatchResult.messageIds[0],
          pvUrl,
          message: 'درخواست مشاوره با موفقیت به ربات تلگرام ارسال شد.',
        });
      } else {
        res.json({
          success: true,
          telegramSent: false,
          telegramError: dispatchResult.errors.join(' | '),
          pvUrl,
          fallbackUrl: `https://t.me/Lawat_kar?text=${encodeURIComponent(`مشاوره تکویکس\nکاربر: ${fullName}\nتماس: ${rawContact}\nموضوع: ${consultationTopic}\nپیام: ${userMessage}`)}`,
        });
      }
    } catch (err: any) {
      console.error('Error sending consultation to Telegram:', err);
      res.status(500).json({ error: 'خطا در ارسال پیام مشاوره به تلگرام', details: err?.message });
    }
  });

  // 4. Test Telegram Bot Connection API
  app.post('/api/telegram/test-bot', async (req, res) => {
    try {
      const { botToken, chatId } = req.body;
      const effectiveToken = (botToken || process.env.TELEGRAM_BOT_TOKEN || '8518856410:AAEHtuGJHgyE6WDy2PwFVBpPiR0BgQwZfus').trim();
      const targetChatIds = resolveTelegramChatIds(chatId);

      if (!effectiveToken) {
        res.status(400).json({
          success: false,
          error: 'توکن ربات تلگرام وارد نشده است. لطفاً توکن را از @BotFather دریافت و وارد کنید.',
        });
        return;
      }

      const testMsg = `🔔 <b>پیام تست اتصال تکویکس (Tekvix AI)</b>\n\n✅ ربات تلگرام شما با موفقیت به وب‌سایت متصل شد!\nاز این پس تمامی سفارشات و درخواست‌های مشاوره ثبت‌شده توسط کاربران، بی‌درنگ همراه با دکمه ورود مستقیم به پی‌وی به این چت ارسال می‌شوند.\n\n⏰ <b>زمان تست:</b> ${new Date().toLocaleString('fa-IR')}`;

      const dispatchResult = await dispatchTelegramNotification(
        effectiveToken,
        targetChatIds,
        testMsg
      );

      if (dispatchResult.success) {
        res.json({
          success: true,
          message: `پیام تست با موفقیت به چت (${dispatchResult.deliveredTo.join(', ')}) ارسال شد! اتصال کاملاً فعال است.`,
          deliveredTo: dispatchResult.deliveredTo,
        });
      } else {
        res.status(400).json({
          success: false,
          error: dispatchResult.errors.join(' | ') || 'خطا در ارسال پیام تست تلگرام',
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error?.message || 'خطا در ارتباط با سرور تلگرام',
      });
    }
  });

  // 5. Vite Middleware or Static Production Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tekvix server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
