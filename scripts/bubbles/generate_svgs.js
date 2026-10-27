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

  const bx = Math.round(entry.bubble.x * W / 100);
  const by = Math.round(entry.bubble.y * H / 100);
  const bw = Math.round(entry.bubble.w * W / 100);
  const bh = Math.round(entry.bubble.h * H / 100);

  if (entry.type === 'sfx') {
    // Dynamic punchy comic starburst
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
    const fs = bw > 400 ? 28 : 24;
    const maxChars = Math.floor((bw - 60) / (fs * 0.55));
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
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="20" ry="20"
          fill="#FFFDF8" stroke="#EB8DB7" stroke-width="8" stroke-linejoin="round"/>
    <path d="M ${bx + bw / 2 - 14} ${by + 36} C ${bx + bw / 2 - 28} ${by + 16}, ${bx + bw / 2 - 42} ${by + 40}, ${bx + bw / 2 - 14} ${by + 60} C ${bx + bw / 2 + 14} ${by + 40}, ${bx + bw / 2} ${by + 16}, ${bx + bw / 2 - 14} ${by + 36} Z"
          fill="#EB8DB7"/>
    ${tLines}
  </g>
</svg>`;
  }

  if (entry.type === 'thought') {
    // Elegant comic thought bubble (pill shape with 3 descending trailing circles)
    const r = Math.round(Math.min(bw * 0.35, bh * 0.44));
    let pathD = `
      M ${bx + r} ${by}
      L ${bx + bw - r} ${by}
      A ${r} ${r} 0 0 1 ${bx + bw} ${by + r}
      L ${bx + bw} ${by + bh - r}
      A ${r} ${r} 0 0 1 ${bx + bw - r} ${by + bh}
      L ${bx + r} ${by + bh}
      A ${r} ${r} 0 0 1 ${bx} ${by + bh - r}
      L ${bx} ${by + r}
      A ${r} ${r} 0 0 1 ${bx + r} ${by}
      Z
    `.replace(/\s+/g, ' ').trim();

    const tx = Math.round(entry.tailTarget.x * W / 100);
    const ty = Math.round(entry.tailTarget.y * H / 100);
    const baseX = Math.round(bx + bw * 0.70);

    const c1 = { cx: baseX, cy: by + bh + 18, r: 11 };
    const c2 = { cx: Math.round(baseX + (tx - baseX) * 0.50), cy: Math.round(by + bh + 18 + (ty - (by + bh + 18)) * 0.50), r: 7.5 };
    const c3 = { cx: Math.round(baseX + (tx - baseX) * 0.90), cy: Math.round(by + bh + 18 + (ty - (by + bh + 18)) * 0.90), r: 5 };

    let fs = bw > 500 ? 30 : bw > 360 ? 27 : 24;
    let maxChars = Math.floor((bw - 44) / (fs * 0.58));
    let lines = wrapText(text, maxChars);
    const lh = fs * 1.25;
    const totalH = lines.length * lh;
    const startY = by + (bh - totalH) / 2 + fs * 0.85;

    const tLines = lines.map((l, i) =>
      `<text x="${bx + bw / 2}" y="${startY + i * lh}" text-anchor="middle"
            font-family="'Libre Franklin', 'Comic Neue', Arial Black, sans-serif"
            font-size="${fs}" font-weight="800" font-style="italic" fill="#171717" letter-spacing="0.6">${l}</text>`
    ).join('\n  ');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <path d="${pathD}" fill="#FFF8EF" stroke="#171717" stroke-width="7.5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${c1.cx}" cy="${c1.cy}" r="${c1.r}" fill="#FFF8EF" stroke="#171717" stroke-width="7.5"/>
  <circle cx="${c2.cx}" cy="${c2.cy}" r="${c2.r}" fill="#FFF8EF" stroke="#171717" stroke-width="7.5"/>
  <circle cx="${c3.cx}" cy="${c3.cy}" r="${c3.r}" fill="#FFF8EF" stroke="#171717" stroke-width="7.5"/>
  ${tLines}
</svg>`;
  }

  // Classic organic comic speech bubble with smooth capsule squircle and tapered tail
  const r = Math.round(Math.min(bw * 0.35, bh * 0.44));
  let pathD = '';

  if (!entry.tailTarget) {
    pathD = `
      M ${bx + r} ${by}
      L ${bx + bw - r} ${by}
      A ${r} ${r} 0 0 1 ${bx + bw} ${by + r}
      L ${bx + bw} ${by + bh - r}
      A ${r} ${r} 0 0 1 ${bx + bw - r} ${by + bh}
      L ${bx + r} ${by + bh}
      A ${r} ${r} 0 0 1 ${bx} ${by + bh - r}
      L ${bx} ${by + r}
      A ${r} ${r} 0 0 1 ${bx + r} ${by}
      Z
    `.replace(/\s+/g, ' ').trim();
  } else {
    const tx = Math.round(entry.tailTarget.x * W / 100);
    const ty = Math.round(entry.tailTarget.y * H / 100);

    const baseW = Math.max(36, Math.min(65, Math.round(bw * 0.12)));
    const minBaseX = bx + r + baseW / 2 + 8;
    const maxBaseX = bx + bw - r - baseW / 2 - 8;
    
    let anchor = 0.50;
    if (entry.tailCurve === 'organic-left') anchor = 0.28;
    else if (entry.tailCurve === 'organic-right') anchor = 0.72;
    else if (entry.tailCurve === 'organic-down') anchor = 0.50;

    const targetBaseX = bx + bw * anchor;
    const baseX = Math.round(Math.max(minBaseX, Math.min(maxBaseX, targetBaseX)));

    const p1 = { x: Math.round(baseX - baseW / 2), y: by + bh };
    const p2 = { x: Math.round(baseX + baseW / 2), y: by + bh };
    const tip = { x: tx, y: ty };

    const dx = tip.x - baseX;
    const dy = tip.y - (by + bh);

    // Natural curved Bezier control points for clean comic taper
    const c2a = { x: Math.round(p2.x + dx * 0.15), y: Math.round(p2.y + dy * 0.45) };
    const c2b = { x: Math.round(p2.x + dx * 0.70), y: Math.round(p2.y + dy * 0.85) };
    const c1b = { x: Math.round(p1.x + dx * 0.65), y: Math.round(p1.y + dy * 0.85) };
    const c1a = { x: Math.round(p1.x + dx * 0.10), y: Math.round(p1.y + dy * 0.45) };

    pathD = `
      M ${bx + r} ${by}
      L ${bx + bw - r} ${by}
      A ${r} ${r} 0 0 1 ${bx + bw} ${by + r}
      L ${bx + bw} ${by + bh - r}
      A ${r} ${r} 0 0 1 ${bx + bw - r} ${by + bh}
      L ${p2.x} ${p2.y}
      C ${c2a.x} ${c2a.y}, ${c2b.x} ${c2b.y}, ${tip.x} ${tip.y}
      C ${c1b.x} ${c1b.y}, ${c1a.x} ${c1a.y}, ${p1.x} ${p1.y}
      L ${bx + r} ${by + bh}
      A ${r} ${r} 0 0 1 ${bx} ${by + bh - r}
      L ${bx} ${by + r}
      A ${r} ${r} 0 0 1 ${bx + r} ${by}
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

console.log(`Successfully generated ${count} pristine comic speech bubble SVGs (EN & FR) from bubbles.json!`);
