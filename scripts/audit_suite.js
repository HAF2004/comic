// Comprehensive QA & Art Direction Audit Suite for Chapters 1 - 4
// Captures representative boards, measures technical metrics, console errors, load times, and assets
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EVIDENCE = path.join(ROOT, 'audit_evidence');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:3000';

const CHAPTERS = {
  1: { boards: 10, title: 'Welcome To Marny' },
  2: { boards: 10, title: 'Under Pressure' },
  3: { boards: 8, title: "Sheep Don't Sleep" },
  4: { boards: 8, title: 'A Birthday for Tifa' }
};

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: {
    width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runAudit() {
  console.log('--- Launching Browser for Audit Capture ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const auditMetrics = {
    loadTimes: {},
    consoleErrors: {},
    assetStats: {},
    boardsRendered: {}
  };

  try {
    for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
      console.log(`\n=== Auditing Viewport: ${vpName} (${vp.width}x${vp.height}) ===`);

      for (const [chStr, chConfig] of Object.entries(CHAPTERS)) {
        const ch = Number(chStr);
        const chDir = path.join(EVIDENCE, `ch${ch}`, vpName);
        fs.mkdirSync(chDir, { recursive: true });

        auditMetrics.loadTimes[`ch${ch}_${vpName}`] = [];
        auditMetrics.consoleErrors[`ch${ch}_${vpName}`] = [];
        auditMetrics.boardsRendered[`ch${ch}_${vpName}`] = 0;

        console.log(`  -> Chapter ${ch} (${chConfig.boards} boards)...`);

        // We capture key boards for baseline & comparison:
        // First board (intro), middle board (plot build-up), and climax/last board
        const boardsToCapture = chConfig.boards === 10
          ? [1, 2, 4, 7, 10]
          : [1, 2, 4, 6, 8];

        for (const b of boardsToCapture) {
          const pageIndex = b - 1;
          const page = await browser.newPage();
          if (vp.ua) await page.setUserAgent(vp.ua);
          await page.setViewport(vp);

          const errors = [];
          page.on('console', m => {
            if (['error', 'warning'].includes(m.type())) {
              errors.push({ type: m.type(), text: m.text() });
            }
          });
          page.on('pageerror', e => errors.push({ type: 'pageerror', text: e.message }));

          const start = Date.now();
          try {
            await page.goto(`${BASE}/chapter/${ch}?page=${pageIndex}`, { waitUntil: 'networkidle0', timeout: 35000 });
            await sleep(1800);

            // Hide cookie popin / tip
            await page.evaluate(() => {
              for (const s of ['.cookie-popin', '.chapter-tip']) {
                const el = document.querySelector(s);
                if (el) el.style.display = 'none';
              }
            });
            await sleep(400);

            const duration = Date.now() - start;
            auditMetrics.loadTimes[`ch${ch}_${vpName}`].push({ board: b, durationMs: duration });

            const outPath = path.join(chDir, `board${b}.png`);
            await page.screenshot({ path: outPath });
            auditMetrics.boardsRendered[`ch${ch}_${vpName}`]++;
            console.log(`    Board ${b} captured (${duration}ms) -> ${path.basename(outPath)}`);
          } catch (err) {
            console.error(`    Board ${b} error: ${err.message}`);
            errors.push({ type: 'loadError', text: err.message, board: b });
          } finally {
            if (errors.length > 0) {
              auditMetrics.consoleErrors[`ch${ch}_${vpName}`].push({ board: b, errors });
            }
            await page.close();
          }
        }
      }
    }
  } finally {
    await browser.close();
  }

  // Calculate Asset Stats per Chapter
  for (let ch = 1; ch <= 4; ch++) {
    const dir = path.join(ROOT, 'textures', 'chapters', String(ch));
    let totalSize = 0;
    let fileCount = 0;
    const extensions = {};
    let maxFile = { name: '', size: 0 };

    function scan(d) {
      if (!fs.existsSync(d)) return;
      for (const item of fs.readdirSync(d)) {
        const full = path.join(d, item);
        const st = fs.statSync(full);
        if (st.isDirectory()) {
          scan(full);
        } else {
          fileCount++;
          totalSize += st.size;
          const ext = path.extname(item).toLowerCase();
          extensions[ext] = (extensions[ext] || 0) + 1;
          if (st.size > maxFile.size) {
            maxFile = { name: path.relative(ROOT, full).replace(/\\/g, '/'), size: st.size };
          }
        }
      }
    }

    scan(dir);
    auditMetrics.assetStats[`ch${ch}`] = {
      fileCount,
      totalBytes: totalSize,
      totalMB: +(totalSize / (1024 * 1024)).toFixed(2),
      extensions,
      maxFile: { name: maxFile.name, sizeMB: +(maxFile.size / (1024 * 1024)).toFixed(2) }
    };
  }

  fs.writeFileSync(path.join(EVIDENCE, 'audit_metrics.json'), JSON.stringify(auditMetrics, null, 2));
  console.log('\n--- Audit Data & Screenshots Saved to audit_evidence/ ---');
}

runAudit().catch(console.error);
