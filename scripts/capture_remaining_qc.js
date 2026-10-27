const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = path.join(__dirname, '..', 'bubble_qc_evidence');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox']
  });

  for (const vp of [{ name: 'desktop_1920', width: 1920, height: 1080 }, { name: 'mobile_390', width: 390, height: 844 }]) {
    console.log(`Capturing boards on ${vp.name}...`);
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.goto('http://localhost:3000/chapter/4', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    try {
      const btn = await page.$('button.accept');
      if (btn) await btn.click();
    } catch (e) {}

    for (let b = 1; b <= 8; b++) {
      if (b > 1) {
        await page.keyboard.press('ArrowRight');
        await new Promise(r => setTimeout(r, 1200));
      }
      if ([3, 5, 6, 8].includes(b)) {
        const outPath = path.join(EVIDENCE_DIR, `board${b}-${vp.name}.png`);
        await page.screenshot({ path: outPath });
        console.log(`Saved ${outPath}`);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log('All remaining boards captured successfully!');
})();
