// Parametric SVG Speech Bubble & Overlay Generator
// Generates full-panel SVGs in textures/chapters/4/text/{en,fr}/ directly from bubbles.json
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const bubbles = JSON.parse(fs.readFileSync(path.join(ROOT, 'bubbles.json'), 'utf8'));

const enDir = path.join(ROOT, 'textures', 'chapters', '4', 'text', 'en');
const frDir = path.join(ROOT, 'textures', 'chapters', '4', 'text', 'fr');
fs.mkdirSync(enDir, { recursive: true });
fs.mkdirSync(frDir, { recursive: true });

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + ' ' + w).length <= maxChars) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function generateSvg(key, entry, lang) {
  const ratio = entry.ratio;
  const W = Math.round(ratio * 1000);
  const H = 1000;
  const text = entry.text[lang];

  const bx = entry.bubble.x * W / 100;
  const by = entry.bubble.y * H / 100;
  const bw = entry.bubble.w * W / 100;
  const bh = entry.bubble.h * H / 100;

  if (entry.type === 'sfx') {
    // Dynamic starburst
    const pts = [
      [bx + bw * 0.10, by + bh * 0.50],
      [bx + bw * 0.20, by + bh * 0.15],
      [bx + bw * 0.40, by + bh * 0.25],
      [bx + bw * 0.55, by + bh * 0.05],
      [bx + bw * 0.70, by + bh * 0.22],
      [bx + bw * 0.90, by + bh * 0.10],
      [bx + bw * 0.82, by + bh * 0.45],
      [bx + bw * 0.98, by + bh * 0.60],
      [bx + bw * 0.78, by + bh * 0.80],
      [bx + bw * 0.65, by + bh * 0.98],
      [bx + bw * 0.48, by + bh * 0.82],
      [bx + bw * 0.30, by + bh * 0.95],
      [bx + bw * 0.22, by + bh * 0.75],
      [bx + bw * 0.02, by + bh * 0.65]
    ].map(p => `${Math.round(p[0])},${Math.round(p[1])}`).join(' ');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <polygon points="${pts}" fill="#FFF8EF" stroke="#171717" stroke-width="8" stroke-linejoin="round"/>
  <text x="${bx + bw / 2}" y="${by + bh / 2 + 10}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Libre Franklin', Impact, Arial Black, sans-serif"
        font-size="44" font-weight="900" font-style="italic" fill="#F87800" stroke="#171717" stroke-width="3" letter-spacing="3">${text}</text>
</svg>`;
  }

  if (entry.type === 'caption') {
    const pad = 8;
    const r = 16;
    let fs = bw > 400 ? 26 : 22;
    let maxChars = Math.floor((bw - 40) / (fs * 0.55));
    if (text.length > 28) {
      maxChars = Math.ceil(text.length * 0.58);
    }
    const lines = wrapText(text.toUpperCase(), maxChars);
    const lh = fs * 1.28;
    const totalH = lines.length * lh;
    const startY = by + (bh - totalH) / 2 + fs * 0.85;

    const tLines = lines.map((l, i) =>
      `<text x="${bx + bw / 2}" y="${startY + i * lh}" text-anchor="middle"
            font-family="'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
            font-size="${fs}" font-weight="800" fill="#171717" letter-spacing="1.2">${l}</text>`
    ).join('\n  ');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${r}" ry="${r}"
        fill="#FFF8EF" stroke="#171717" stroke-width="7.5" stroke-linejoin="round"/>
  ${tLines}
</svg>`;
  }

  if (entry.type === 'letter') {
    const fs = bw > 400 ? 30 : 25;
    const maxChars = Math.floor((bw - 40) / (fs * 0.55));
    const lines = wrapText(text, maxChars);
    const lh = fs * 1.25;
    const totalH = lines.length * lh;
    const startY = by + (bh - totalH) / 2 + fs * 0.85 + 14;

    const tLines = lines.map((l, i) =>
      `<text x="${bx + bw / 2}" y="${startY + i * lh}" text-anchor="middle"
            font-family="'Libre Franklin', 'Segoe UI', Arial, sans-serif"
            font-size="${fs}" font-weight="900" fill="#171717" letter-spacing="0.5">${l}</text>`
    ).join('\n    ');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <g transform="rotate(-2.5 ${bx + bw / 2} ${by + bh / 2})">
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="18" ry="18"
          fill="#FFFDF8" stroke="#EB8DB7" stroke-width="8" stroke-linejoin="round"/>
    <path d="M ${bx + bw / 2 - 14} ${by + 36} C ${bx + bw / 2 - 28} ${by + 16}, ${bx + bw / 2 - 42} ${by + 40}, ${bx + bw / 2 - 14} ${by + 60} C ${bx + bw / 2 + 14} ${by + 40}, ${bx + bw / 2} ${by + 16}, ${bx + bw / 2 - 14} ${by + 36} Z"
          fill="#EB8DB7"/>
    ${tLines}
  </g>
</svg>`;
  }

  // Authentic organic speech bubble with automated parametric tail routing
  const r = Math.min(22, Math.round(bh * 0.22));
  const baseW = Math.max(30, Math.round(bw * 0.11)); // 8-12% bubble width

  let pathD = '';

  if (!entry.tailTarget) {
    // Caption/bubble without tail
    pathD = `
      M ${bx + r} ${by}
      L ${bx + bw - r} ${by}
      Q ${bx + bw} ${by} ${bx + bw} ${by + r}
      L ${bx + bw} ${by + bh - r}
      Q ${bx + bw} ${by + bh} ${bx + bw - r} ${by + bh}
      L ${bx + r} ${by + bh}
      Q ${bx} ${by + bh} ${bx} ${by + bh - r}
      L ${bx} ${by + r}
      Q ${bx} ${by} ${bx + r} ${by}
      Z
    `.replace(/\s+/g, ' ').trim();
  } else {
    const tx = entry.tailTarget.x * W / 100;
    const ty = entry.tailTarget.y * H / 100;

    // Tail emerges from the edge facing the target
    // In our panels, target is below or below-diagonal to bubble
    const baseCenterX = Math.max(bx + r + baseW / 2 + 6, Math.min(bx + bw - r - baseW / 2 - 6, bx + bw * (entry.tailCurve === 'organic-left' ? 0.25 : entry.tailCurve === 'organic-right' ? 0.75 : 0.50)));
    const p1 = { x: baseCenterX - baseW / 2, y: by + bh };
    const p2 = { x: baseCenterX + baseW / 2, y: by + bh };
    const tip = { x: tx, y: ty };

    // Organic curved bezier control points
    let c1x, c1y, c2x, c2y;
    if (entry.tailCurve === 'organic-right') {
      c1x = p1.x + (tip.x - p1.x) * 0.35 + 20;
      c1y = p1.y + (tip.y - p1.y) * 0.65;
      c2x = p2.x + (tip.x - p2.x) * 0.60 + 35;
      c2y = p2.y + (tip.y - p2.y) * 0.40;
    } else if (entry.tailCurve === 'organic-left') {
      c1x = p1.x + (tip.x - p1.x) * 0.60 - 35;
      c1y = p1.y + (tip.y - p1.y) * 0.40;
      c2x = p2.x + (tip.x - p2.x) * 0.35 - 20;
      c2y = p2.y + (tip.y - p2.y) * 0.65;
    } else {
      c1x = (p1.x + tip.x) / 2;
      c1y = (p1.y + tip.y) / 2;
      c2x = (p2.x + tip.x) / 2;
      c2y = (p2.y + tip.y) / 2;
    }

    pathD = `
      M ${bx + r} ${by}
      Q ${bx + bw / 2} ${by - 6} ${bx + bw - r} ${by}
      Q ${bx + bw + 6} ${by + bh / 2} ${bx + bw - 4} ${by + bh - r}
      Q ${bx + bw} ${by + bh} ${bx + bw - r} ${by + bh}
      L ${p2.x} ${p2.y}
      Q ${c2x} ${c2y} ${tip.x} ${tip.y}
      Q ${c1x} ${c1y} ${p1.x} ${p1.y}
      L ${bx + r} ${by + bh}
      Q ${bx} ${by + bh} ${bx} ${by + bh - r}
      Q ${bx - 6} ${by + bh / 2} ${bx + 4} ${by + r}
      Q ${bx} ${by} ${bx + r} ${by}
      Z
    `.replace(/\s+/g, ' ').trim();
  }

  // Calculate font size & text lines
  let fs = bw > 500 ? 30 : bw > 360 ? 27 : 24;
  let maxChars = Math.floor((bw - 44) / (fs * 0.58));
  let lines = wrapText(text, maxChars);
  if (lines.length > 2 && bh < 140) {
    fs = 23;
    maxChars = Math.floor((bw - 40) / (fs * 0.58));
    lines = wrapText(text, maxChars);
  }
  const lh = fs * 1.25;
  const totalH = lines.length * lh;
  const startY = by + (bh - totalH) / 2 + fs * 0.85;

  const tLines = lines.map((l, i) =>
    `<text x="${bx + bw / 2}" y="${startY + i * lh}" text-anchor="middle"
          font-family="'Libre Franklin', 'Comic Neue', Arial Black, sans-serif"
          font-size="${fs}" font-weight="800" fill="#171717" letter-spacing="0.6">${l}</text>`
  ).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <path d="${pathD}" fill="#FFF8EF" stroke="#171717" stroke-width="7.5" stroke-linejoin="round" stroke-linecap="round"/>
  ${tLines}
</svg>`;
}

// Generate all SVGs
const fileMap = {
  c4b1p1: 'c4b1p1-text',
  c4b1p2: 'c4b1p2-text',
  c4b2p1: 'c4b2p1-text',
  c4b2p2: 'c4b2p2-text',
  c4b2p3: 'c4b2p3-text',
  c4b3p1: 'c4b3p1-text',
  c4b3p2: 'c4b3p2-text',
  c4b4p1: 'c4b4p1-text',
  c4b4p2: 'c4b4p2-text',
  c4b4p3: 'c4b4p3-text',
  c4b5p1: 'c4b5p1-text',
  c4b5p2: 'c4b5p2-text',
  c4b6p1: 'c4b6p1-text',
  c4b7p2: 'c4b7p2-text',
  c4b7p3: 'c4b7p3-text',
  c4b8p1_caption: 'c4b8p1-caption',
  c4b8p1_letter: 'c4b8p1-letter'
};

let count = 0;
for (const [key, filename] of Object.entries(fileMap)) {
  const entry = bubbles[key];
  if (!entry) {
    console.warn(`No bubbles.json entry for ${key}`);
    continue;
  }
  const enSvg = generateSvg(key, entry, 'en');
  fs.writeFileSync(path.join(enDir, filename + '.svg'), enSvg, 'utf8');

  const frSvg = generateSvg(key, entry, 'fr');
  fs.writeFileSync(path.join(frDir, filename + '.svg'), frSvg, 'utf8');

  count += 2;
}

console.log(`Generated ${count} full-panel speech bubble SVGs (EN & FR) from bubbles.json!`);
