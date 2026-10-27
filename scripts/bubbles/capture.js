// Capture every Chapter 4 panel (board view + focused view) on desktop and mobile.
// Usage: node scripts/bubbles/capture.js <tag> [--hide-bubbles] [--only=c4b1p1,c4b2p3] [--viewports=desktop,mobile]
// Output: before_after/<tag>/<viewport>/{boardN.png, <panel>_board.png, <panel>_focus.png}, rects.json, console.json
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = process.env.C4_BASE || 'http://localhost:3000';

const args = process.argv.slice(2);
const tag = args.find(a => !a.startsWith('--')) || 'capture';
const hideBubbles = args.includes('--hide-bubbles');
const onlyArg = args.find(a => a.startsWith('--only='));
const only = onlyArg ? onlyArg.slice(7).split(',') : null;
const vpArg = args.find(a => a.startsWith('--viewports='));
const viewportNames = vpArg ? vpArg.slice(12).split(',') : ['desktop', 'mobile'];
const noFocus = args.includes('--no-focus');

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: {
    width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  }
};

const BOARD_PANELS = {
  0: ['c4b1p1', 'c4b1p2'],
  1: ['c4b2p1', 'c4b2p2', 'c4b2p3'],
  2: ['c4b3p1', 'c4b3p2'],
  3: ['c4b4p1', 'c4b4p2', 'c4b4p3'],
  4: ['c4b5p1', 'c4b5p2'],
  5: ['c4b6p1'],
  6: ['c4b7p1', 'c4b7p2', 'c4b7p3'],
  7: ['c4b8p1']
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Runs in the page: returns screen rects (CSS px) for the panels of the current board.
function pageRects() {
  const reg = window.__C4_DEBUG__ || {};
  const canvas = document.querySelector('canvas');
  const cr = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight };
  const mul = (m, v) => [0, 1, 2, 3].map(i => m[i] * v[0] + m[4 + i] * v[1] + m[8 + i] * v[2] + m[12 + i] * v[3]);
  const out = {};
  for (const id of Object.keys(reg)) {
    const p = reg[id];
    const b = p.board;
    if (!b || !b.chapter || b.index !== b.chapter.chapterScroll.currentIndex) continue;
    const cam = b.chapter.camera;
    if (b.plane.updateMatrixWorld) b.plane.updateMatrixWorld(true);
    if (cam.updateMatrixWorld) cam.updateMatrixWorld();
    const proj = (x, y) => {
      let v = mul(b.plane.worldMatrix, [x, y, 0, 1]);
      v = mul(cam.viewMatrix, v);
      v = mul(cam.projectionMatrix, v);
      return [cr.left + (v[0] / v[3] * 0.5 + 0.5) * cr.width, cr.top + (1 - (v[1] / v[3] * 0.5 + 0.5)) * cr.height];
    };
    const tl = proj(-0.5, 0.5), tr = proj(0.5, 0.5), bl = proj(-0.5, -0.5), br = proj(0.5, -0.5);
    const lerp2 = (u, v) => {
      const top = [tl[0] + (tr[0] - tl[0]) * u, tl[1] + (tr[1] - tl[1]) * u];
      const bot = [bl[0] + (br[0] - bl[0]) * u, bl[1] + (br[1] - bl[1]) * u];
      return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
    };
    const oc = b.orthoCamera;
    const L = oc.left, R = oc.right, T = oc.top, B = oc.bottom;
    const pos = p.originalPosition, sc = p.originalScale;
    const fx0 = (pos.x - sc.x / 2 - L) / (R - L), fx1 = (pos.x + sc.x / 2 - L) / (R - L);
    const fy0 = (T - (pos.y + sc.y / 2)) / (T - B), fy1 = (T - (pos.y - sc.y / 2)) / (T - B);
    const pts = [lerp2(fx0, fy0), lerp2(fx1, fy0), lerp2(fx0, fy1), lerp2(fx1, fy1)];
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
    const bxs = [tl, tr, bl, br].map(q => q[0]), bys = [tl, tr, bl, br].map(q => q[1]);
    out[id] = {
      ratio: p.ratio,
      panel: { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) },
      board: { x: Math.min(...bxs), y: Math.min(...bys), w: Math.max(...bxs) - Math.min(...bxs), h: Math.max(...bys) - Math.min(...bys) }
    };
  }
  return out;
}

function clipOf(r, vp) {
  const x = Math.max(0, Math.round(r.x)), y = Math.max(0, Math.round(r.y));
  const w = Math.min(vp.width - x, Math.round(r.w)), h = Math.min(vp.height - y, Math.round(r.h));
  return { x, y, width: w, height: h };
}

async function captureViewport(browser, vpName) {
  const vp = VIEWPORTS[vpName];
  const outDir = path.join(ROOT, 'before_after', tag, vpName);
  fs.mkdirSync(outDir, { recursive: true });
  const rectsAll = {};
  const consoleLog = [];

  for (const [pageIndex, panelIds] of Object.entries(BOARD_PANELS)) {
    if (only && !panelIds.some(id => only.includes(id))) continue;
    const page = await browser.newPage();
    if (vp.ua) await page.setUserAgent(vp.ua);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.deviceScaleFactor, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) consoleLog.push({ board: +pageIndex + 1, type: m.type(), text: m.text() }); });
    page.on('pageerror', e => consoleLog.push({ board: +pageIndex + 1, type: 'pageerror', text: e.message }));
    page.on('requestfailed', r => consoleLog.push({ board: +pageIndex + 1, type: 'requestfailed', text: r.url() }));
    page.on('response', r => { if (r.status() >= 400) consoleLog.push({ board: +pageIndex + 1, type: 'http' + r.status(), text: r.url() }); });
    try {
      await page.goto(`${BASE}/chapter/4?page=${pageIndex}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.waitForFunction(() => window.__C4_DEBUG__ && Object.keys(window.__C4_DEBUG__).length > 0, { timeout: 30000 });
      await sleep(2600);
      await page.evaluate(() => {
        for (const s of ['.cookie-popin', '.chapter-tip']) { const el = document.querySelector(s); if (el) el.style.display = 'none'; }
      });
      if (hideBubbles) {
        await page.evaluate(() => {
          for (const p of Object.values(window.__C4_DEBUG__)) {
            (p.textOverlayMeshes || []).forEach(m => { m.mesh.visible = false; });
            if (p.bubbleMeshes) p.bubbleMeshes.forEach(m => { m.mesh.visible = false; });
          }
        });
        await sleep(400);
      }
      await page.mouse.move(vp.width / 2, vp.height - 5);
      await sleep(300);
      const rects = await page.evaluate(pageRects);
      Object.assign(rectsAll, rects);
      await page.screenshot({ path: path.join(outDir, `board${+pageIndex + 1}.png`) });
      for (const id of panelIds) {
        if (only && !only.includes(id)) continue;
        if (!rects[id]) { consoleLog.push({ board: +pageIndex + 1, type: 'tool', text: `no rect for ${id}` }); continue; }
        await page.screenshot({ path: path.join(outDir, `${id}_board.png`), clip: clipOf(rects[id].panel, vp) });
      }
      if (!noFocus) {
        for (const id of panelIds) {
          if (only && !only.includes(id)) continue;
          if (!rects[id]) continue;
          await page.evaluate(pid => {
            const p = window.__C4_DEBUG__[pid];
            p.board.selectPanel(p);
          }, id);
          await sleep(1800);
          if (hideBubbles) {
            await page.evaluate(() => {
              for (const p of Object.values(window.__C4_DEBUG__)) {
                (p.textOverlayMeshes || []).forEach(m => { m.mesh.visible = false; });
              }
            });
            await sleep(300);
          }
          await page.screenshot({ path: path.join(outDir, `${id}_focus.png`), clip: clipOf(rects[id].board, vp) });
          await page.evaluate(pid => { const p = window.__C4_DEBUG__[pid]; p.board.unselectPanel(); }, id);
          await sleep(900);
        }
      }
      console.log(`[${vpName}] board ${+pageIndex + 1} done`);
    } catch (e) {
      consoleLog.push({ board: +pageIndex + 1, type: 'tool-error', text: e.message });
      console.error(`[${vpName}] board ${+pageIndex + 1} error: ${e.message}`);
    } finally {
      await page.close();
    }
  }
  fs.writeFileSync(path.join(outDir, 'rects.json'), JSON.stringify(rectsAll, null, 2));
  fs.writeFileSync(path.join(outDir, 'console.json'), JSON.stringify(consoleLog, null, 2));
  return consoleLog;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  try {
    for (const vp of viewportNames) {
      const log = await captureViewport(browser, vp);
      const errs = log.filter(l => l.type !== 'warning');
      console.log(`[${vp}] console/network issues: ${errs.length}`);
      errs.slice(0, 20).forEach(e => console.log('   ', e.type, e.text.slice(0, 160)));
    }
  } finally {
    await browser.close();
  }
})();
