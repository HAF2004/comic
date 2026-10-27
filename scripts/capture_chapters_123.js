const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'artifacts_captures', 'ch123');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureChapter(chapterNum) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(`http://localhost:3000/chapter/${chapterNum}?page=0`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  try {
    await page.evaluate(() => {
      const cookie = document.querySelector('.cookie-popin');
      if (cookie) cookie.style.display = 'none';
    });
  } catch (e) {}

  await page.screenshot({ path: path.join(outDir, `ch${chapterNum}_board1_desktop.png`) });
  console.log(`Saved ch${chapterNum}_board1_desktop.png`);

  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, `ch${chapterNum}_board1_mobile.png`) });
  console.log(`Saved ch${chapterNum}_board1_mobile.png`);

  await browser.close();
}

async function run() {
  for (let c = 1; c <= 3; c++) {
    await captureChapter(c);
  }
}

run().catch(console.error);
