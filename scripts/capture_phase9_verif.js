const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.join(__dirname, '..', 'before_after', 'phase9_ch4_cake');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox']
  });

  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'mobile_390', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    console.log(`Testing on ${vp.name}...`);
    const page = await browser.newPage();
    await page.setViewport(vp);

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('http://localhost:3000/chapter/4', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2500));

    try {
      const btn = await page.$('button.accept');
      if (btn) await btn.click();
    } catch (e) {}

    // Capture each board (Board 1 to 8)
    for (let b = 1; b <= 8; b++) {
      if (b > 1) {
        await page.keyboard.press('ArrowRight');
        await new Promise(r => setTimeout(r, 1200));
      }
      await new Promise(r => setTimeout(r, 1000));
      const shotPath = path.join(OUT_DIR, `ch4_board${b}_${vp.name}.png`);
      await page.screenshot({ path: shotPath });
      console.log(`Saved Board ${b} on ${vp.name} to ${shotPath}`);
    }

    console.log(`Console errors on ${vp.name}:`, consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    await page.close();
  }

  await browser.close();
  console.log('All phase 9 captures completed successfully!');
})();
