/*
 * TEKVIX Red Signal preview proxy.
 * Keeps the existing Worker as the origin for every route/API and only decorates HTML responses.
 * At deploy time, replace __TK_HORROR_CSS__ with JSON.stringify(src/halloween-theme.css).
 */
const HORROR_CSS = __TK_HORROR_CSS__;

const HORROR_BOOT = [
  '<script id="tekvix-red-signal-boot">',
  '(() => {',
  '  const replacements = new Map([',
  '    ["MISSION // TEKVIX-01", "SIGNAL // TEKVIX-01"],',
  '    ["DEEP SPACE NETWORK", "UNKNOWN FREQUENCY"],',
  '    ["SYSTEM ONLINE", "ENTITY DETECTED"],',
  '    ["DEEP SPACE LINK", "UNKNOWN PRESENCE"],',
  '    ["ORBITAL AI CORE // ACTIVE", "THE SIGNAL IS LISTENING"],',
  '    ["CHANNEL 07 // SECURE", "DO NOT LOOK BACK"],',
  '    ["🌌 یه صدا از اعماق فضا... گوش کن 🎧", "🩸 یه صدا از اعماق تاریکی... گوش کن 🎧"]',
  '  ]);',
  '  function install() {',
  '    const root = document.getElementById("root");',
  '    const app = root && root.firstElementChild;',
  '    if (!app) return false;',
  '    app.classList.add("halloween-mode");',
  '    const oldStarField = app.querySelector(":scope > .fixed.inset-0.pointer-events-none.z-0");',
  '    if (oldStarField) oldStarField.remove();',
  '    app.querySelectorAll("#hero-section canvas").forEach((canvas) => canvas.remove());',
  '    app.querySelectorAll("#hero-section span").forEach((node) => {',
  '      const value = (node.textContent || "").trim();',
  '      if (replacements.has(value)) node.textContent = replacements.get(value);',
  '    });',
  '    return true;',
  '  }',
  '  const observer = new MutationObserver(() => { if (install()) observer.disconnect(); });',
  '  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true });',
  '  if (install()) observer.disconnect();',
  '  document.addEventListener("DOMContentLoaded", () => { if (install()) observer.disconnect(); }, { once: true });',
  '  window.setTimeout(() => observer.disconnect(), 20000);',
  '})();',
  '</script>'
].join("");

export default {
  async fetch(request, env) {
    const origin = await env.ORIGIN.fetch(request);
    const contentType = origin.headers.get("content-type") || "";
    if (request.method !== "GET" || origin.status < 200 || origin.status >= 300 || !/text\/html/i.test(contentType)) {
      return origin;
    }

    const originalHtml = await origin.text();
    if (originalHtml.includes('id="tekvix-red-signal-css"')) return origin;

    const stylesheet = '<style id="tekvix-red-signal-css">' + HORROR_CSS + '</style>';
    let html = originalHtml.replace(/<\/head>/i, stylesheet + '</head>');
    html = html.replace(/<\/body>/i, HORROR_BOOT + '</body>');

    const headers = new Headers(origin.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");
    headers.delete("etag");
    headers.delete("last-modified");
    headers.delete("content-md5");
    headers.set("cache-control", "no-store, no-cache, must-revalidate");
    headers.set("x-tekvix-horror", "the-red-signal-v2");
    return new Response(html, { status: origin.status, statusText: origin.statusText, headers });
  }
};
