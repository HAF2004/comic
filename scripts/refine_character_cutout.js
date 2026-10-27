const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ASSETS_DIR = path.join(__dirname, '..', 'assets_v3');
const BRAIN_DIR = 'C:\\Users\\wawes\\.gemini\\antigravity-ide\\brain\\46fb0842-41ec-4f49-828c-f4c9b9c40f3c';

async function refineCharacter() {
  console.log('=== REFINING CHARACTER CUTOUT (ZERO HALO, TRUE ALPHA) ===\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE:', msg.text()));

  const masterPath = path.join(BRAIN_DIR, 'tifa_panel_pixel_aligned.png');
  const fgOrigPath = path.join(__dirname, '..', 'textures', 'chapters', '4', 'c4b4p3-foreground.png');
  const cleanPlatePath = path.join(ASSETS_DIR, 'c4b4p3-clean-plate.png');

  const masterB64 = fs.readFileSync(masterPath).toString('base64');
  const fgB64 = fs.readFileSync(fgOrigPath).toString('base64');
  const cleanB64 = fs.readFileSync(cleanPlatePath).toString('base64');

  const results = await page.evaluate(async (mB64, fgB64, cB64) => {
    const loadImg = (b64, mime) => new Promise(res => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = `data:${mime};base64,` + b64;
    });

    const imgMaster = await loadImg(mB64, 'image/png');
    const imgFg = await loadImg(fgB64, 'image/png');
    const imgClean = await loadImg(cB64, 'image/png');

    const W = 615;
    const H = 293;

    // 1. Draw Master to canvas
    const cMaster = document.createElement('canvas');
    cMaster.width = W;
    cMaster.height = H;
    const ctxMaster = cMaster.getContext('2d');
    ctxMaster.drawImage(imgMaster, 0, 0);
    const mData = ctxMaster.getImageData(0, 0, W, H).data;

    // 2. Draw Clean Plate to canvas
    const cClean = document.createElement('canvas');
    cClean.width = W;
    cClean.height = H;
    const ctxClean = cClean.getContext('2d');
    ctxClean.drawImage(imgClean, 0, 0);
    const cData = ctxClean.getImageData(0, 0, W, H).data;

    // 3. Map Original FG Cutout to find exact hair alpha silhouette
    // Original FG has dimensions 1536 x 1024. In the 615x293 panel, Tifa's head spans roughly x: 155 to 465, y: 70 to 260
    const cFgScaled = document.createElement('canvas');
    cFgScaled.width = W;
    cFgScaled.height = H;
    const ctxFgScaled = cFgScaled.getContext('2d');

    // In Chapter4Panel, fgScale: 0.95, fgOffset: { x: 0, y: -0.04 }
    // Scale and center the FG cutout to align with master
    // Dimensions in panel: width ~ 430, height ~ 286, centered at x: 310, y: 165
    const targetW = 432;
    const targetH = 288;
    const targetX = Math.round((W - targetW) / 2) + 2;
    const targetY = 22;
    ctxFgScaled.drawImage(imgFg, targetX, targetY, targetW, targetH);
    const fgData = ctxFgScaled.getImageData(0, 0, W, H).data;

    // 4. Create Refined Character Layer
    const cChar = document.createElement('canvas');
    cChar.width = W;
    cChar.height = H;
    const ctxChar = cChar.getContext('2d');
    const charData = ctxChar.createImageData(W, H);

    // Flood fill / color difference mask with feathering
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;

        // Skip borders & outside character envelope
        if (x < 140 || x > 480 || y < 65 || y > 275) {
          charData.data[i + 3] = 0;
          continue;
        }

        const rM = mData[i], gM = mData[i + 1], bM = mData[i + 2];
        const rC = cData[i], gC = cData[i + 1], bC = cData[i + 2];

        // Pixel difference between Master and Clean Plate
        const dR = Math.abs(rM - rC);
        const dG = Math.abs(gM - gC);
        const dB = Math.abs(bM - bC);
        const diff = dR + dG + dB;

        // Alpha from original cutout
        const fgAlpha = fgData[i + 3];

        // Is pixel definitely Tifa's hair, face, glasses, neck, jacket, hands?
        // Dark hair: r < 70, g < 70, b < 70
        // Skin: r > 210, g > 160, b > 130
        // Navy jacket: r < 80, g < 90, b > 90
        // Blush: r > 210, g < 160, b < 190
        const isDarkHair = (rM < 65 && gM < 65 && bM < 65);
        const isSkin = (rM > 200 && gM > 150 && bM > 120 && bM < 210);
        const isNavyJacket = (rM < 70 && gM < 85 && bM > 70 && bM < 140);
        const isCollarWhite = (rM > 220 && gM > 220 && bM > 220 && y > 195 && y < 250);
        const isBlush = (rM > 210 && gM < 160 && bM < 190 && y > 125 && y < 175);

        const isTifaColor = isDarkHair || isSkin || isNavyJacket || isCollarWhite || isBlush;

        if (diff > 25 && isTifaColor) {
          charData.data[i] = rM;
          charData.data[i + 1] = gM;
          charData.data[i + 2] = bM;
          charData.data[i + 3] = 255;
        } else if (fgAlpha > 50 && diff > 15 && !isTifaColor) {
          // Edge anti-aliasing
          charData.data[i] = rM;
          charData.data[i + 1] = gM;
          charData.data[i + 2] = bM;
          charData.data[i + 3] = Math.min(255, fgAlpha);
        } else {
          charData.data[i + 3] = 0;
        }
      }
    }

    ctxChar.putImageData(charData, 0, 0);

    // 5. Test against dark background and color background (QC Check 4: no white halo)
    const cTestDark = document.createElement('canvas');
    cTestDark.width = W;
    cTestDark.height = H;
    const ctxTestDark = cTestDark.getContext('2d');
    ctxTestDark.fillStyle = '#111115';
    ctxTestDark.fillRect(0, 0, W, H);
    ctxTestDark.drawImage(cChar, 0, 0);

    const cTestColor = document.createElement('canvas');
    cTestColor.width = W;
    cTestColor.height = H;
    const ctxTestColor = cTestColor.getContext('2d');
    ctxTestColor.fillStyle = '#4A85B8';
    ctxTestColor.fillRect(0, 0, W, H);
    ctxTestColor.drawImage(cChar, 0, 0);

    // 6. Test final composite (Clean plate + Refined Character + Props)
    const cFinalComp = document.createElement('canvas');
    cFinalComp.width = W;
    cFinalComp.height = H;
    const ctxFinalComp = cFinalComp.getContext('2d');
    ctxFinalComp.drawImage(cClean, 0, 0);
    ctxFinalComp.drawImage(cChar, 0, 0);

    // Check pixel diff against Master in the character region
    const finalData = ctxFinalComp.getImageData(0, 0, W, H).data;
    let charRegionDiff = 0, charRegionCount = 0;
    for (let y = 70; y < 265; y++) {
      for (let x = 150; x < 475; x++) {
        const idx = (y * W + x) * 4;
        const d = (Math.abs(finalData[idx] - mData[idx]) +
                   Math.abs(finalData[idx+1] - mData[idx+1]) +
                   Math.abs(finalData[idx+2] - mData[idx+2])) / 3;
        charRegionDiff += d;
        charRegionCount++;
      }
    }
    const regionMAD = charRegionDiff / charRegionCount;

    return {
      charB64: cChar.toDataURL('image/png').split(',')[1],
      testDarkB64: cTestDark.toDataURL('image/png').split(',')[1],
      testColorB64: cTestColor.toDataURL('image/png').split(',')[1],
      finalCompB64: cFinalComp.toDataURL('image/png').split(',')[1],
      regionMAD
    };
  }, masterB64, fgB64, cleanB64);

  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-character.png'), Buffer.from(results.charB64, 'base64'));
  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-test-dark.png'), Buffer.from(results.testDarkB64, 'base64'));
  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-test-color.png'), Buffer.from(results.testColorB64, 'base64'));
  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-composite-test.png'), Buffer.from(results.finalCompB64, 'base64'));

  console.log('Character cutout refined successfully!');
  console.log('Character Region MAD vs Master:', results.regionMAD.toFixed(3));

  await browser.close();
}

refineCharacter().catch(console.error);
