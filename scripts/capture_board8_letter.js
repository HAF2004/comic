const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.join(__dirname, '..', 'continuity_evidence');

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/chapter/4', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  try { const btn = await page.$('button.accept'); if (btn) await btn.click(); } catch (e) {}

  // Navigate to Board 8
  for (let b = 1; b <= 7; b++) {
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 500));
  }
  await new Promise(r => setTimeout(r, 1200));

  const shotPathDesk = path.join(OUT_DIR, 'board8_updated_letter_desktop.png');
  await page.screenshot({ path: shotPathDesk });
  console.log(`Saved Board 8 desktop to ${shotPathDesk}`);

  // Mobile 390
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));
  const shotPathMob = path.join(OUT_DIR, 'board8_updated_letter_mobile.png');
  await page.screenshot({ path: shotPathMob });
  console.log(`Saved Board 8 mobile to ${shotPathMob}`);

  await browser.close();
})();
