// Overlay a labelled percentage grid on panel crops to read coordinates precisely.
// Usage: node scripts/bubbles/grid.js <dir> [suffix=_board] -> writes <name>_grid.png next to each crop
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const dir = path.resolve(process.argv[2]);
const suffix = process.argv[3] || '_board';

(async () => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith(suffix + '.png'));
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  for (const f of files) {
    const b64 = fs.readFileSync(path.join(dir, f)).toString('base64');
    const out = await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const W = img.naturalWidth, H = img.naturalHeight;
      const scale = Math.max(1, 900 / W);
      const c = document.createElement('canvas');
      c.width = Math.round(W * scale); c.height = Math.round(H * scale);
      const g = c.getContext('2d');
      g.imageSmoothingQuality = 'high';
      g.drawImage(img, 0, 0, c.width, c.height);
      for (let i = 0; i <= 20; i++) {
        const major = i % 2 === 0;
        g.strokeStyle = major ? 'rgba(0,255,255,0.85)' : 'rgba(0,255,255,0.35)';
        g.lineWidth = major ? 1.5 : 1;
        const x = c.width * i / 20, y = c.height * i / 20;
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x, c.height); g.stroke();
        g.beginPath(); g.moveTo(0, y); g.lineTo(c.width, y); g.stroke();
        if (major && i > 0 && i < 20) {
          g.font = 'bold 13px Arial';
          g.fillStyle = '#000'; g.fillRect(x + 2, 2, 24, 15); g.fillRect(2, y + 2, 24, 15);
          g.fillStyle = '#0ff'; g.fillText(String(i * 5), x + 4, 14); g.fillText(String(i * 5), 4, y + 14);
        }
      }
      return c.toDataURL('image/png').split(',')[1];
    }, 'data:image/png;base64,' + b64);
    fs.writeFileSync(path.join(dir, f.replace('.png', '_grid.png')), Buffer.from(out, 'base64'));
  }
  await browser.close();
  console.log(`gridded ${files.length} files in ${dir}`);
})();
