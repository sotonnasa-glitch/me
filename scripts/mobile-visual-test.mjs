import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const TARGET_URL = process.env.TEKVIX_URL || 'https://tekvix.ir/tools';
const ARTIFACT_DIR = 'artifacts/mobile-tools';
const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 800, columns: 2 },
  { name: 'mobile-360', width: 360, height: 800, columns: 2 },
  { name: 'mobile-390', width: 390, height: 844, columns: 2 },
  { name: 'mobile-430', width: 430, height: 932, columns: 2 },
  { name: 'tablet-768', width: 768, height: 1024, columns: 4 },
  { name: 'desktop-1280', width: 1280, height: 900, columns: 5 },
];

const failures = [];
const results = [];
await fs.mkdir(ARTIFACT_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.width <= 430 ? 2 : 1,
      isMobile: viewport.width <= 430,
      hasTouch: viewport.width <= 430,
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    let response;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      response = await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
      try {
        await page.locator('#tools a[href="https://muse.ai"]').first().waitFor({ state: 'attached', timeout: 8000 });
        break;
      } catch {
        if (attempt === 11) throw new Error('Muse card did not appear on the deployed /tools page after 12 checks.');
        await page.waitForTimeout(10000);
      }
    }

    if (!response || response.status() >= 400) {
      failures.push(`${viewport.name}: page returned HTTP ${response?.status() ?? 'no response'}`);
    }

    await page.locator('#tools').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    const museCard = page.locator('#tools a[href="https://muse.ai"]');
    const museCount = await museCard.count();
    if (museCount !== 1) failures.push(`${viewport.name}: expected one Muse card, found ${museCount}`);

    const museImage = museCard.locator('img');
    await museImage.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const img = document.querySelector('#tools a[href="https://muse.ai"] img');
      return img && (img.complete || img.style.display === 'none');
    }, null, { timeout: 15000 }).catch(() => {});
    const imageState = await museImage.evaluate(img => ({
      src: img.getAttribute('src'),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      display: getComputedStyle(img).display,
    }));
    if (!imageState.naturalWidth) failures.push(`${viewport.name}: Muse logo image did not load (${imageState.src})`);

    const gridState = await page.locator('#tools .grid').evaluate(el => {
      const style = getComputedStyle(el);
      const gridRect = el.getBoundingClientRect();
      const cards = [...el.querySelectorAll(':scope > a')].map(card => card.getBoundingClientRect());
      const museRect = el.querySelector('a[href="https://muse.ai"]')?.getBoundingClientRect();
      return {
        columns: style.gridTemplateColumns.split(' ').length,
        gridWidth: Math.round(gridRect.width),
        cardWidth: cards[0] ? Math.round(cards[0].width) : 0,
        museCardWidth: museRect ? Math.round(museRect.width) : 0,
        museCardHeight: museRect ? Math.round(museRect.height) : 0,
        cardsStayInsideGrid: cards.every(rect =>
          rect.left >= gridRect.left - 1 && rect.right <= gridRect.right + 1
        ),
      };
    });
    if (gridState.columns !== viewport.columns) {
      failures.push(`${viewport.name}: expected ${viewport.columns} grid columns, found ${gridState.columns}`);
    }
    if (gridState.cardWidth < 90) failures.push(`${viewport.name}: AI cards are too narrow (${gridState.cardWidth}px)`);
    if (!gridState.cardsStayInsideGrid) {
      failures.push(`${viewport.name}: one or more AI cards exceed the visible grid bounds`);
    }

    const pageWidth = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    if (pageWidth.document > pageWidth.viewport + 2) {
      failures.push(`${viewport.name}: page has horizontal overflow (${pageWidth.document}px > ${pageWidth.viewport}px)`);
    }

    const filterButton = page.locator('#tools button').filter({ hasText: 'متن و اتوماسیون' }).first();
    await filterButton.click();
    const filteredMuseCount = await page.locator('#tools a[href="https://muse.ai"]').count();
    const filteredCount = await page.locator('#tools .grid > a').count();
    if (filteredMuseCount !== 1 || filteredCount !== 9) {
      failures.push(`${viewport.name}: code/automation filter mismatch (cards=${filteredCount}, Muse=${filteredMuseCount})`);
    }
    await page.locator('#tools button').filter({ hasText: 'همه ابزارها' }).first().click();
    const restoredCount = await page.locator('#tools .grid > a').count();
    if (restoredCount !== 21) failures.push(`${viewport.name}: All filter restored ${restoredCount} cards instead of 21`);

    // Capture a screenshot from the actual deployed site at every target viewport.
    await page.locator('#tools').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(100);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `${viewport.name}.png`),
      fullPage: true,
      animations: 'disabled',
    });

    results.push({
      viewport: viewport.name,
      httpStatus: response?.status(),
      gridColumns: gridState.columns,
      cardWidth: gridState.cardWidth,
      museCardWidth: gridState.museCardWidth,
      museCardHeight: gridState.museCardHeight,
      museImage: imageState,
      pageWidth,
      filterCards: filteredCount,
      restoredCards: restoredCount,
    });
    await page.close();
  }
  // Check every external AI-tool destination from the live production page.
  const linkPage = await browser.newPage();
  const linkPageResponse = await linkPage.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  if (!linkPageResponse || linkPageResponse.status() >= 400) {
    failures.push(`external-links: tools page returned HTTP ${linkPageResponse?.status() ?? 'no response'}`);
  }
  await linkPage.locator('#tools .grid > a').first().waitFor({ state: 'attached', timeout: 20000 });
  const links = await linkPage.locator('#tools .grid > a').evaluateAll(cards => cards.map(card => ({
    name: card.innerText.trim().split('\\n')[0],
    href: card.getAttribute('href'),
    target: card.getAttribute('target'),
    rel: card.getAttribute('rel'),
  })));
  const uniqueLinks = [...new Map(links.map(link => [link.href, link])).values()];
  if (links.length !== 21) failures.push(`external-links: expected 21 tool cards, found ${links.length}`);
  if (uniqueLinks.length !== links.length) failures.push('external-links: duplicate destinations detected');
  const linkChecks = await Promise.all(uniqueLinks.map(async link => {
    if (!link.href || !/^https:\\/\\//i.test(link.href)) {
      return { ...link, result: 'invalid-url', ok: false };
    }
    try {
      let response = await linkPage.request.get(link.href, { timeout: 20000, maxRedirects: 10 });
      if ([405, 501].includes(response.status())) {
        response = await linkPage.request.get(link.href, {
          timeout: 20000, maxRedirects: 10,
          headers: { Range: 'bytes=0-0' },
        });
      }
      const status = response.status();
      const restricted = [401, 403, 429].includes(status);
      return {
        ...link,
        finalUrl: response.url(),
        status,
        result: restricted ? 'reachable-restricted' : status >= 200 && status < 400 ? 'ok' : 'http-error',
        ok: status >= 200 && status < 400 || restricted,
      };
    } catch (error) {
      return { ...link, result: 'network-error', error: String(error).slice(0, 240), ok: false };
    }
  }));
  for (const link of linkChecks.filter(item => !item.ok)) {
    failures.push(`external-links: ${link.name} (${link.href}) failed: ${link.result} ${link.status ?? link.error ?? ''}`);
  }
  await linkPage.close();
  results.push({ externalLinks: linkChecks });
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(ARTIFACT_DIR, 'results.json'),
  JSON.stringify({ target: TARGET_URL, results, failures }, null, 2),
);

console.log(JSON.stringify({ target: TARGET_URL, results, failures }, null, 2));
if (failures.length) process.exit(1);
