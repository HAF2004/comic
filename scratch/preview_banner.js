const fs = require('fs');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1448, height: 1086 });

  const bgData = fs.readFileSync('textures/chapters/4/c4b7p1-friends-surprise.png').toString('base64');
  const bgUrl = `data:image/png;base64,${bgData}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin: 0; padding: 0; background: #000; overflow: hidden; }
      #container { position: relative; width: 1448px; height: 1086px; }
      img { position: absolute; top: 0; left: 0; width: 1448px; height: 1086px; }
      svg { position: absolute; top: 0; left: 0; width: 1448px; height: 1086px; }
    </style>
  </head>
  <body>
    <div id="container">
      <img src="${bgUrl}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1448 1086">
        <defs>
          <path id="ribbonCurve" d="M 230 171 C 560 112, 890 118, 1220 169" fill="none"/>
          <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#FF85A2" flood-opacity="0.4"/>
          </filter>
        </defs>
        <!-- Background outline stroke -->
        <text font-family="'Libre Franklin', 'Segoe UI', Arial, sans-serif" font-size="46" font-weight="900" letter-spacing="2.2">
          <textPath href="#ribbonCurve" startOffset="50%" text-anchor="middle" dominant-baseline="central"
                    fill="#171717" stroke="#171717" stroke-width="11" stroke-linejoin="round" stroke-linecap="round">
            &#x2665; HAPPY BIRTHDAY, TIFA! &#x2665;
          </textPath>
        </text>
        <!-- Foreground Vibrant Hot Pink Fill -->
        <text font-family="'Libre Franklin', 'Segoe UI', Arial, sans-serif" font-size="46" font-weight="900" letter-spacing="2.2" filter="url(#textGlow)">
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
  await page.screenshot({ path: 'scratch/banner_overlay_preview_v3.png' });
  await browser.close();
  console.log('Preview v3 saved to scratch/banner_overlay_preview_v3.png');
})();
