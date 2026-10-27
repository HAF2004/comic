const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.join(__dirname, '..', 'bubble_qc_fixed');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox']
  });

  // Desktop Page
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1440, height: 900 });
  console.log('Navigating to http://localhost:3000/chapter/4 ...');
  await page.goto('http://localhost:3000/chapter/4', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));

  try {
    const btn = await page.$('button.accept');
    if (btn) await btn.click();
  } catch (e) {}

  // Navigate to Board 7 (6 presses)
  for (let b = 1; b <= 6; b++) {
    console.log(`Advancing from board ${b} to ${b+1}...`);
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 1200));
  }

  // We are on Board 7 now. Wait for entrance animation
  await new Promise(r => setTimeout(r, 2500));
  const board7Shot = path.join(OUT_DIR, 'live_board7_final_desktop.png');
  await page.screenshot({ path: board7Shot });
  console.log(`Saved Board 7 screenshot to ${board7Shot}`);

  // Also check mobile view
  const mobilePage = await browser.newPage();
  await mobilePage.setCacheEnabled(false);
  await mobilePage.setViewport({ width: 390, height: 844 });
  await mobilePage.goto('http://localhost:3000/chapter/4', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  for (let b = 1; b <= 6; b++) {
    await mobilePage.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 1200));
  }
  await new Promise(r => setTimeout(r, 2500));
  const mobileShot = path.join(OUT_DIR, 'live_board7_final_mobile.png');
  await mobilePage.screenshot({ path: mobileShot });
  console.log(`Saved mobile screenshot to ${mobileShot}`);

  await browser.close();
  console.log('Verification completed successfully!');
})();
