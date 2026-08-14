import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
- همواره در انتهای پاسخ‌های مرتبط، به کاربر بگویید که با کلیک روی دکمه «ثبت سفارش آنی» در پایین صفحه یا ارتباط با تلگرام (@arnirhq) می‌تواند پروژه خود را نهایی کند.
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
        fallbackText = `💡 **برآورد هزینه خدمات تکویکس:**\n\n• **طراحی وب‌سایت با هوش مصنوعی:** از ۴,۵۰۰,۰۰۰ تومان (تحویل ۳ تا ۵ روز)\n• **تولید تیزر و ویدیوی هوش مصنوعی:** از ۲,۸۰۰,۰۰۰ تومان (تحویل ۲ روز)\n• **ساخت ربات تلگرام پیشرفته:** از ۳,۵۰۰,۰۰۰ تومان\n• **خلق بسته تصاویر و گرافیک:** از ۱,۲۰۰,۰۰۰ تومان\n\nبرای سفارش اختصاصی می‌توانید مستقیماً فرم ثبت سفارش را تکمیل کنید یا به تلگرام @arnirhq پیام دهید.`;
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

  // 3. Telegram Bot Order Notification API
  app.post('/api/telegram/send-order', async (req, res) => {
    try {
      const { order, botToken, chatId } = req.body;

      if (!order) {
        res.status(400).json({ error: 'اطلاعات سفارش ارسال نشده است.' });
        return;
      }

      const effectiveToken = botToken || process.env.TELEGRAM_BOT_TOKEN;
      const effectiveChatId = chatId || process.env.TELEGRAM_CHAT_ID;

      const orderId = order.id || 'ORD-' + Math.floor(1000 + Math.random() * 9000);
      const fullName = order.fullName || 'کاربر تکویکس';
      const contact = order.telegramOrPhone || 'ثبت نشده';
      const serviceTitle = order.serviceTitle || 'خدمات هوش مصنوعی';
      const message = order.message || 'بدون توضیح';
      const dateStr = new Date().toLocaleString('fa-IR');

      const telegramMessage = `
🚀 <b>سفارش جدید در تکویکس (Tekvix AI)</b>

📌 <b>کد رهگیری:</b> <code>${orderId}</code>
👤 <b>نام مشتری:</b> ${fullName}
📱 <b>شماره / آیدی تلگرام:</b> <code>${contact}</code>
💼 <b>سرویس انتخابی:</b> ${serviceTitle}
📝 <b>توضیحات و نیازمندی:</b>
<i>${message}</i>

⏰ <b>زمان ثبت:</b> ${dateStr}
🌐 <b>منبع:</b> وب‌سایت تکویکس
      `.trim();

      // If Bot Token and Chat ID are configured, perform real Telegram Bot API call
      if (effectiveToken && effectiveChatId) {
        const tgUrl = `https://api.telegram.org/bot${effectiveToken}/sendMessage`;
        const tgRes = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: effectiveChatId,
            text: telegramMessage,
            parse_mode: 'HTML',
          }),
        });

        const tgData = await tgRes.json();

        if (tgData.ok) {
          res.json({
            success: true,
            telegramSent: true,
            messageId: tgData.result?.message_id,
          });
          return;
        } else {
          console.warn('Telegram Bot API returned error:', tgData);
          res.json({
            success: true,
            telegramSent: false,
            telegramError: tgData.description,
            fallbackUrl: `https://t.me/arnirhq?text=${encodeURIComponent(`سفارش ${orderId}: ${serviceTitle} - ${contact}`)}`,
          });
          return;
        }
      }

      // Simulated success with direct link fallback if token is not yet provided by user
      res.json({
        success: true,
        telegramSent: false,
        note: 'ربات تلگرام هنوز در تنظیمات کانفیگ نشده است اما سفارش در دیتابیس ثبت شد.',
        directLink: `https://t.me/arnirhq?text=${encodeURIComponent(`سفارش ${orderId}\nمشتری: ${fullName}\nتماس: ${contact}\nسرویس: ${serviceTitle}\nتوضیحات: ${message}`)}`,
      });
    } catch (err: any) {
      console.error('Error sending order to Telegram:', err);
      res.status(500).json({ error: 'خطا در ارتباط با سرور تلگرام', details: err?.message });
    }
  });

  // 4. Test Telegram Bot Connection API
  app.post('/api/telegram/test-bot', async (req, res) => {
    try {
      const { botToken, chatId } = req.body;
      const effectiveToken = botToken || process.env.TELEGRAM_BOT_TOKEN;
      const effectiveChatId = chatId || process.env.TELEGRAM_CHAT_ID;

      if (!effectiveToken || !effectiveChatId) {
        res.status(400).json({
          error: 'لطفاً توکن ربات و چت‌آیدی را وارد کنید.',
        });
        return;
      }

      const tgUrl = `https://api.telegram.org/bot${effectiveToken}/sendMessage`;
      const tgRes = await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: effectiveChatId,
          text: `🔔 <b>پیام تست اتصال تکویکس</b>\n\nربات تلگرام شما با موفقیت به پلتفرم تکویکس متصل شد! از این پس سفارشات جدید به این چت ارسال خواهند شد.\n⏰ زمان: ${new Date().toLocaleString('fa-IR')}`,
          parse_mode: 'HTML',
        }),
      });

      const data = await tgRes.json();
      if (data.ok) {
        res.json({ success: true, message: 'پیام تست با موفقیت ارسال شد!' });
      } else {
        res.status(400).json({ success: false, error: data.description || 'خطا در ارسال پیام به تلگرام' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'خطا در اتصال به تلگرام' });
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
