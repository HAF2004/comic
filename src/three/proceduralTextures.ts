import * as THREE from 'three';

/**
 * Draws a clean, romantic vector heart on a 2D canvas context
 * so headless Chromium never renders a missing-glyph tofu box for '♡'.
 */
export function drawVectorHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color = '#C77B87',
  filled = false,
): void {
  ctx.save();
  ctx.translate(cx, cy - size * 0.35);
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
  ctx.bezierCurveTo(
    -size / 2,
    (size + topCurveHeight) / 2,
    0,
    (size + topCurveHeight) / 1.45,
    0,
    size,
  );
  ctx.bezierCurveTo(
    0,
    (size + topCurveHeight) / 1.45,
    size / 2,
    (size + topCurveHeight) / 2,
    size / 2,
    topCurveHeight,
  );
  ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
  ctx.closePath();

  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2.5, size * 0.09);
    ctx.stroke();
  }
  ctx.restore();
}

export function createLinenBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 4) {
      ctx.fillStyle = y % 8 === 0 ? '#868686' : '#7a7a7a';
      ctx.fillRect(0, y, 256, 1);
    }
    for (let x = 0; x < 256; x += 4) {
      ctx.fillStyle = x % 8 === 0 ? '#858585' : '#7b7b7b';
      ctx.fillRect(x, 0, 1, 256);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  return texture;
}

export function createTabletopSunlightTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Seamless warm cream base matching #F8F3EE at outer edges so there is no horizon seam
    ctx.fillStyle = '#F8F3EE';
    ctx.fillRect(0, 0, 512, 512);

    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 240);
    grad.addColorStop(0, '#FFFDF9');
    grad.addColorStop(0.55, '#F9F4EE');
    grad.addColorStop(1, '#F8F3EE');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createRadialContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 120);
    grad.addColorStop(0, 'rgba(70, 52, 48, 0.38)');
    grad.addColorStop(0.55, 'rgba(70, 52, 48, 0.14)');
    grad.addColorStop(1, 'rgba(70, 52, 48, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBirthdayCardTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 860;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Warm ivory cotton cardstock
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 860);
    bgGrad.addColorStop(0, '#FFFDF9');
    bgGrad.addColorStop(1, '#FBF3EB');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 860);

    // Outer & inner rose letterpress border
    ctx.strokeStyle = '#C77B87';
    ctx.lineWidth = 5;
    ctx.strokeRect(46, 46, 1200 - 92, 860 - 92);

    ctx.strokeStyle = 'rgba(199, 123, 135, 0.42)';
    ctx.lineWidth = 2;
    ctx.strokeRect(64, 64, 1200 - 128, 860 - 128);

    // Clear, high-contrast letterpress typography on the rising 3D card
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#B55464';
    ctx.font = 'italic 38px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Dearest Putri,', 600, 165);

    ctx.fillStyle = '#3A2C2A';
    ctx.font = '600 66px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Happy Birthday', 600, 255);

    // Decorative divider line
    ctx.strokeStyle = 'rgba(199, 123, 135, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(460, 312);
    ctx.lineTo(740, 312);
    ctx.stroke();

    // Heartfelt wishes text directly on the letterpress card
    ctx.fillStyle = '#463A38';
    ctx.font = 'italic 40px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('“May your year ahead be filled with warm', 600, 390);
    ctx.fillText('mornings, gentle laughter, and every quiet', 600, 450);
    ctx.fillText('happiness your heart has been wishing for.”', 600, 510);

    drawVectorHeart(ctx, 600, 610, 38, '#C77B87', true);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createGiftTagTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 512, 640);
    grad.addColorStop(0, '#E6D0BE');
    grad.addColorStop(1, '#D5B9A4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 640);

    ctx.strokeStyle = 'rgba(70, 58, 56, 0.35)';
    ctx.lineWidth = 5;
    ctx.strokeRect(24, 24, 512 - 48, 640 - 48);

    ctx.beginPath();
    ctx.arc(256, 68, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#B89B87';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#7E6454';
    ctx.stroke();

    ctx.fillStyle = '#382B28';
    ctx.textAlign = 'center';
    ctx.font = 'italic 74px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('For', 256, 245);
    ctx.fillText('Putri', 256, 338);

    drawVectorHeart(ctx, 256, 438, 40, '#9E3B4F', false);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createGiftBoxCardTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#D9ABA6';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 472, 472);

    ctx.strokeStyle = 'rgba(199, 123, 135, 0.55)';
    ctx.lineWidth = 3;
    ctx.strokeRect(44, 44, 424, 424);

    ctx.strokeStyle = '#B55464';
    ctx.lineWidth = 6;
    const corners = [
      [88, 88, 1, 1],
      [424, 88, -1, 1],
      [88, 370, 1, -1],
      [424, 370, -1, -1],
    ];
    for (const [cx, cy, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx, cy + dy * 36);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + dx * 36, cy);
      ctx.stroke();
    }

    drawVectorHeart(ctx, 256, 212, 34, '#C77B87', true);

    ctx.fillStyle = '#463A38';
    ctx.textAlign = 'center';
    ctx.font = 'italic 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('A little something', 256, 282);
    ctx.fillText('for you', 256, 320);

    ctx.fillStyle = '#8C6268';
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Scan this', 242, 430);
    drawVectorHeart(ctx, 306, 428, 16, '#C77B87', false);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}
