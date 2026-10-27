const fs = require('fs');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const sqData = fs.readFileSync('scratch/p1_square_crop_pink_complete.png').toString('base64');
  const sqUrl = `data:image/png;base64,${sqData}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin: 0; padding: 0; background: #000; overflow: hidden; }
      #container { position: relative; width: 1000px; height: 1000px; }
      img { position: absolute; top: 0; left: 0; width: 1000px; height: 1000px; }
      svg { position: absolute; top: 0; left: 0; width: 1000px; height: 1000px; }
    </style>
  </head>
  <body>
    <div id="container">
      <img src="${sqUrl}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
        <defs>
          <!-- Centerline curve of ribbon in 1000x1000 square panel -->
          <path id="ribbonCurve" d="M 120 152 C 340 108, 660 108, 880 152" fill="none"/>
          <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="#FF85A2" flood-opacity="0.4"/>
          </filter>
        </defs>
        <!-- Background outline stroke -->
        <text font-family="'Libre Franklin', 'Segoe UI', Arial, sans-serif" font-size="52" font-weight="900" letter-spacing="3.0">
          <textPath href="#ribbonCurve" startOffset="50%" text-anchor="middle" dominant-baseline="central"
                    fill="#171717" stroke="#171717" stroke-width="11" stroke-linejoin="round" stroke-linecap="round">
            &#x2665; HAPPY BIRTHDAY, TIFA! &#x2665;
          </textPath>
        </text>
        <!-- Foreground Vibrant Hot Pink Fill -->
        <text font-family="'Libre Franklin', 'Segoe UI', Arial, sans-serif" font-size="52" font-weight="900" letter-spacing="3.0" filter="url(#textGlow)">
          <textPath href="#ribbonCurve" startOffset="50%" text-anchor="middle" dominant-baseline="central"
                    fill="#E8266B">
            &#x2665; HAPPY BIRTHDAY, TIFA! &#x2665;
          </textPath>
        </text>
      </svg>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'scratch/p1_square_banner_pink_complete_verified.png' });
  await browser.close();
  console.log('Saved to scratch/p1_square_banner_verified.png');
})();
