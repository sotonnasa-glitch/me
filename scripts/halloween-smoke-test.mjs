import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workerSource = await readFile(new URL('../src/worker.ts', import.meta.url), 'utf8');
const tick = String.fromCharCode(96);
const opening = 'const HALLOWEEN_PUMPKIN_INJECTION = String.raw' + tick;
const closing = tick + ';\n\nfunction isHalloweenPumpkinWindowActive';
const start = workerSource.indexOf(opening);
assert.notEqual(start, -1, 'Worker must define the seasonal HTML injection.');
const bodyStart = start + opening.length;
const bodyEnd = workerSource.indexOf(closing, bodyStart);
assert.notEqual(bodyEnd, -1, 'Seasonal HTML injection must have a proper template boundary.');
const html = workerSource.slice(bodyStart, bodyEnd);

for (const [needle, description] of [
  ['tekvix-living-pumpkin-style', 'The existing living pumpkin style must remain.'],
  ['tk-tekvix-living-pumpkin', 'The living pumpkin SVG overlay must remain.'],
  ['tekvix-haunted-world-style', 'The new Halloween scene stylesheet must be injected.'],
  ['three@0.160.0/build/three.module.js', 'The scene must use a pinned Three.js module.'],
  ['function makeGhost(THREE)', 'A 3D ghost model must be created.'],
  ['function makeDemonSkull(THREE)', 'A 3D horned demon skull must be created.'],
  ['function makeBat(THREE', '3D bats must be created.'],
  ['function makeCastle(THREE)', 'A 3D haunted castle must be created.'],
  ['function makeCandle(THREE', 'Floating candle props must be created.'],
  ['tk-haunt-fallback', 'A fallback must show if WebGL or the CDN is unavailable.'],
  ['prefers-reduced-motion: reduce', 'Motion-reduction preferences must be respected.'],
  ['IntersectionObserver', 'The scene must pause when outside the viewport.'],
  ['visibilitychange', 'The scene must pause when the tab is hidden.'],
  ['.halloween-mode .page-ship', 'Old spaceship decorations must be suppressed in Halloween mode.'],
  ['batBasePositions[index].x +', 'Bat flight positions must remain bounded over time.'],
]) {
  assert.ok(html.includes(needle), description);
}

const scriptBodies = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
assert.equal(scriptBodies.length, 2, 'The seasonal injection should have two ordered inline scripts.');
for (const [index, script] of scriptBodies.entries()) {
  assert.doesNotThrow(() => new Function(script), 'Injected script ' + (index + 1) + ' must be syntactically valid.');
}
assert.ok(html.indexOf('</script>') < html.indexOf('tekvix-haunted-world-style'), 'The first script must close before the new stylesheet.');
assert.ok(html.lastIndexOf('</script>') > html.indexOf('tk-haunted-world-stage'), 'The Three.js loader script must close correctly.');

console.log('✅ Halloween scene smoke tests passed: HTML boundaries, JS syntax, 3D cast, reduced-motion support, visibility pausing, fallback and legacy-prop suppression.');
