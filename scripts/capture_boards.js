const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'artifacts_captures');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureAll(viewportName, width, height) {
  console.log(`Starting capture for ${viewportName} (${width}x${height})...`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height });

  for (let b = 1; b <= 8; b++) {
    const pageIndex = b - 1;
    await page.goto(`http://localhost:3000/chapter/4?page=${pageIndex}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1600));

    // Hide cookie banner if visible
    try {
      await page.evaluate(() => {
        const cookie = document.querySelector('.cookie-popin');
        if (cookie) cookie.style.display = 'none';
      });
    } catch (e) {}

    const filename = `${viewportName}_board${b}.png`;
    await page.screenshot({ path: path.join(outDir, filename) });
    console.log(`Saved ${filename}`);
  }

  await browser.close();
  console.log(`Finished ${viewportName}!`);
}

async function run() {
  const arg = process.argv[2] || 'desktop';
  if (arg === 'all') {
    await captureAll('desktop', 1440, 900);
    await captureAll('tablet', 768, 1024);
    await captureAll('mobile', 390, 844);
  } else if (arg === 'desktop') {
    await captureAll('desktop', 1440, 900);
  } else if (arg === 'tablet') {
    await captureAll('tablet', 768, 1024);
  } else if (arg === 'mobile') {
    await captureAll('mobile', 390, 844);
  }
}

run().catch(console.error);
