const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ASSETS_DIR = path.join(__dirname, '..', 'assets_v3');
const BRAIN_DIR = 'C:\\Users\\wawes\\.gemini\\antigravity-ide\\brain\\46fb0842-41ec-4f49-828c-f4c9b9c40f3c';

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function runPipeline() {
  console.log('=== STARTING PILOT PIPELINE: Board 4 Panel 3 (c4b4p3) ===\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE:', msg.text()));

  const masterPath = path.join(BRAIN_DIR, 'tifa_panel_pixel_aligned.png');
  const cleanPlateGenPath = path.join(BRAIN_DIR, 'c4b4p3_clean_plate_1793098690244.jpg');

  const masterB64 = fs.readFileSync(masterPath).toString('base64');
  const cleanB64 = fs.readFileSync(cleanPlateGenPath).toString('base64');

  const results = await page.evaluate(async (mB64, cB64) => {
    const loadImg = (b64, mime) => new Promise(res => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = `data:${mime};base64,` + b64;
    });

    const imgMaster = await loadImg(mB64, 'image/png');
    const imgCleanGen = await loadImg(cB64, 'image/jpeg');

    const W = 615;
    const H = 293;

    // 1. MASTER FRAME (615 x 293)
    const cMaster = document.createElement('canvas');
    cMaster.width = W;
    cMaster.height = H;
    const ctxMaster = cMaster.getContext('2d');
    ctxMaster.drawImage(imgMaster, 0, 0, W, H);

    // 2. CLEAN PLATE (615 x 293)
    const cClean = document.createElement('canvas');
    cClean.width = W;
    cClean.height = H;
    const ctxClean = cClean.getContext('2d');

    // Fill paper background
    ctxClean.fillStyle = '#FFF8EF';
    ctxClean.fillRect(0, 0, W, H);

    // Map clean plate generated image (1337 x 742 interior) to exact 591 x 283 interior
    const srcX = 19;
    const srcY = 12;
    const srcW = 1337;
    const srcH = Math.round(283 * (1337 / 591)); // 640 px
    ctxClean.drawImage(imgCleanGen, srcX, srcY, srcW, srcH, 13, 5, 591, 283);

    // Draw ink outline
    ctxClean.strokeStyle = '#171717';
    ctxClean.lineWidth = 6;
    ctxClean.strokeRect(13, 5, 591, 283);

    // 3. CHARACTER LAYER (Transparent PNG 615 x 293)
    // Extract Tifa from master by comparing with clean plate and alpha masking
    const cChar = document.createElement('canvas');
    cChar.width = W;
    cChar.height = H;
    const ctxChar = cChar.getContext('2d');

    const mData = ctxMaster.getImageData(0, 0, W, H);
    const cData = ctxClean.getImageData(0, 0, W, H);
    const charData = ctxChar.createImageData(W, H);

    // Bounding box of Tifa in master frame:
    // Left: ~140, Right: ~485, Top: ~70, Bottom: ~260
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;

        // Outside character bounding region is transparent
        if (x < 135 || x > 490 || y < 65 || y > 270) {
          charData.data[i + 3] = 0;
          continue;
        }

        // Inside character region: check if pixel belongs to Tifa
        // Tifa features: dark hair (#1C1A1C), skin tones (#F9E7CA / #E5B58C),
        // glasses (#171717), eyes (#171717 / #FFFFFF), navy jacket (#2B3C5E),
        // necklace white (#FFFFFF), collar trim (#FFFFFF), blushing cheeks (#EB8DB7), hands (#F9E7CA).
        const rM = mData.data[i];
        const gM = mData.data[i + 1];
        const bM = mData.data[i + 2];

        const rC = cData.data[i];
        const gC = cData.data[i + 1];
        const bC = cData.data[i + 2];

        const diff = Math.abs(rM - rC) + Math.abs(gM - gC) + Math.abs(bM - bC);

        // Distance from character center
        const dx = x - 315;
        const dy = y - 180;
        const isCoreArea = (dx * dx) / (120 * 120) + (dy * dy) / (90 * 90) < 1.0;

        if (diff > 18 || isCoreArea) {
          // Check if it's the background couch/window color
          // Pink couch: r > 190, g < 130, b < 160
          // Window sky: r > 210, g > 130, b < 130
          // If not background, copy master pixel
          const isBackgroundPinkCouch = (rM > 200 && gM < 125 && bM < 155 && y < 190 && (x < 220 || x > 430));
          const isBackgroundSky = (rM > 200 && gM > 120 && bM < 120 && y < 140);

          if (!isBackgroundPinkCouch && !isBackgroundSky) {
            charData.data[i] = rM;
            charData.data[i + 1] = gM;
            charData.data[i + 2] = bM;
            charData.data[i + 3] = 255;
          } else {
            charData.data[i + 3] = 0;
          }
        } else {
          charData.data[i + 3] = 0;
        }
      }
    }
    ctxChar.putImageData(charData, 0, 0);

    // 4. PROPS LAYER: Floating Sakura Petals (Transparent PNG 615 x 293)
    const cProps = document.createElement('canvas');
    cProps.width = W;
    cProps.height = H;
    const ctxProps = cProps.getContext('2d');

    // Draw stylized Ponpon Mania petals with black ink outline and pink cel-shading
    const drawPetal = (x, y, scale, angle) => {
      ctxProps.save();
      ctxProps.translate(x, y);
      ctxProps.rotate((angle * Math.PI) / 180);
      ctxProps.scale(scale, scale);

      ctxProps.beginPath();
      ctxProps.moveTo(0, -18);
      ctxProps.bezierCurveTo(12, -14, 15, 6, 0, 18);
      ctxProps.bezierCurveTo(-15, 6, -12, -14, 0, -18);
      ctxProps.closePath();

      ctxProps.fillStyle = '#FFB7C5';
      ctxProps.fill();

      // Shadow tone
      ctxProps.fillStyle = '#F48BA1';
      ctxProps.beginPath();
      ctxProps.moveTo(0, -14);
      ctxProps.bezierCurveTo(8, -10, 10, 6, 0, 16);
      ctxProps.closePath();
      ctxProps.fill();

      // Ink outline
      ctxProps.strokeStyle = '#171717';
      ctxProps.lineWidth = 2.2;
      ctxProps.stroke();

      ctxProps.restore();
    };

    drawPetal(115, 140, 1.1, -25);
    drawPetal(175, 220, 0.9, 35);
    drawPetal(510, 120, 1.2, 40);
    drawPetal(530, 205, 0.85, -15);
    drawPetal(330, 60, 0.75, 10);

    // 5. COMPOSITE TEST (Clean Plate + Character + Props)
    const cComp = document.createElement('canvas');
    cComp.width = W;
    cComp.height = H;
    const ctxComp = cComp.getContext('2d');

    ctxComp.drawImage(cClean, 0, 0);
    ctxComp.drawImage(cChar, 0, 0);
    ctxComp.drawImage(cProps, 0, 0);

    // Compute pixel diff between Composite Test and Master Frame
    const compData = ctxComp.getImageData(0, 0, W, H).data;
    let totalDiff = 0, count = 0;
    for (let j = 0; j < compData.length; j += 4) {
      const dR = Math.abs(compData[j] - mData.data[j]);
      const dG = Math.abs(compData[j + 1] - mData.data[j + 1]);
      const dB = Math.abs(compData[j + 2] - mData.data[j + 2]);
      totalDiff += (dR + dG + dB) / 3;
      count++;
    }
    const mad = totalDiff / count;

    return {
      masterB64: cMaster.toDataURL('image/png').split(',')[1],
      cleanB64: cClean.toDataURL('image/png').split(',')[1],
      charB64: cChar.toDataURL('image/png').split(',')[1],
      propsB64: cProps.toDataURL('image/png').split(',')[1],
      compB64: cComp.toDataURL('image/png').split(',')[1],
      compositeMAD: mad
    };
  }, masterB64, cleanB64);

  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-master.png'), Buffer.from(results.masterB64, 'base64'));
  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-clean-plate.png'), Buffer.from(results.cleanB64, 'base64'));
  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-character.png'), Buffer.from(results.charB64, 'base64'));
  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-props-petals.png'), Buffer.from(results.propsB64, 'base64'));
  fs.writeFileSync(path.join(ASSETS_DIR, 'c4b4p3-composite-test.png'), Buffer.from(results.compB64, 'base64'));

  console.log('Pilot layers extracted successfully!');
  console.log('Composite Test Mean Absolute Difference (MAD):', results.compositeMAD.toFixed(3));

  await browser.close();
  return results;
}

runPipeline().catch(console.error);
