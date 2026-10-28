const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/chapter/4', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  try { const btn = await page.$('button.accept'); if (btn) await btn.click(); } catch (e) {}
  for (let b = 1; b <= 6; b++) {
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 500));
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'continuity_evidence/board7_mobile_centered.png' });
  await browser.close();
  console.log('Saved board7_mobile_centered.png');
})();
