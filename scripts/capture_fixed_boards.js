const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'artifacts_captures_v2');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureViewport(viewportName, width, height) {
  console.log(`Starting capture for ${viewportName} (${width}x${height})...`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Capture each board with a clean navigation
  for (let b = 1; b <= 8; b++) {
    const pageIndex = b - 1;
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    
    try {
      await page.goto(`http://localhost:3000/chapter/4?page=${pageIndex}`, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 2200));

      await page.evaluate(() => {
        const cookie = document.querySelector('.cookie-popin');
        if (cookie) cookie.style.display = 'none';
        const tip = document.querySelector('.chapter-tip');
        if (tip) tip.style.display = 'none';
      });

      const filename = `${viewportName}_board${b}_verified.png`;
      await page.screenshot({ path: path.join(outDir, filename) });
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.error(`Error on board ${b}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`Completed ${viewportName}!`);
}

async function run() {
  const arg = process.argv[2] || 'all';
  if (arg === 'all') {
    await captureViewport('desktop', 1440, 900);
    await captureViewport('tablet', 768, 1024);
    await captureViewport('mobile', 390, 844);
  } else if (arg === 'desktop') {
    await captureViewport('desktop', 1440, 900);
  } else if (arg === 'tablet') {
    await captureViewport('tablet', 768, 1024);
  } else if (arg === 'mobile') {
    await captureViewport('mobile', 390, 844);
  }
}

run().catch(console.error);
