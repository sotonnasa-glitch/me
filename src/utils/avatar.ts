/**
 * Pure offline local SVG avatar generator.
 * Requires 0 external network requests - 100% immune to filtering, CDNs, or network issues in Iran.
 */
export function getLocalAvatarUrl(seed: string): string {
  const safeSeed = (seed || 'User').trim();
  const colorPairs = [
    ['#7c3aed', '#4f46e5'], // Purple to Indigo
    ['#ec4899', '#9333ea'], // Pink to Purple
    ['#06b6d4', '#2563eb'], // Cyan to Blue
    ['#10b981', '#059669'], // Emerald
    ['#f59e0b', '#d97706'], // Amber
    ['#6366f1', '#a855f7'], // Indigo to Violet
  ];

  let hash = 0;
  for (let i = 0; i < safeSeed.length; i++) {
    hash = safeSeed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pair = colorPairs[Math.abs(hash) % colorPairs.length];
  const initial = safeSeed.charAt(0).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="avatar-grad-${Math.abs(hash) % 100}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pair[0]}"/>
        <stop offset="100%" stop-color="${pair[1]}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#avatar-grad-${Math.abs(hash) % 100})"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="42" font-weight="700" font-family="system-ui, -apple-system, sans-serif">${initial}</text>
  </svg>`.replace(/\s+/g, ' ');

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
