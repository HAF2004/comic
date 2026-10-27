const fs = require('fs');
const path = require('path');

const bubbleData = [
  {
    id: 'c4b1p1-text',
    en: 'One last walk beneath the city lights.',
    fr: 'Dernière promenade sous les lumières de la ville.',
    w: 780, h: 220, tailX: 320, tailDir: 'down-left'
  },
  {
    id: 'c4b1p2-text',
    en: 'Home at last.',
    fr: 'Enfin chez moi.',
    w: 480, h: 180, tailX: 240, tailDir: 'down'
  },
  {
    id: 'c4b2p1-text',
    en: 'A familiar light was waiting inside.',
    fr: 'Une lumière familière brillait à la maison.',
    w: 760, h: 220, tailX: 380, tailDir: 'down'
  },
  {
    id: 'c4b2p2-text',
    en: 'CLICK!',
    fr: 'CLIC !',
    isSfx: true,
    w: 360, h: 180
  },
  {
    id: 'c4b2p3-text',
    en: 'Whew. Made it.',
    fr: 'Ouf ! Enfin rentrée.',
    w: 520, h: 180, tailX: 260, tailDir: 'down-left'
  },
  {
    id: 'c4b3p1-text',
    en: 'Just one quiet minute for herself.',
    fr: 'Une minute de calme rien que pour elle.',
    w: 740, h: 220, tailX: 370, tailDir: 'down'
  },
  {
    id: 'c4b3p2-text',
    en: 'What could be waiting?',
    fr: 'Que va-t-elle découvrir ?',
    w: 600, h: 190, tailX: 300, tailDir: 'down'
  },
  {
    id: 'c4b4p1-text',
    en: 'Wait… what is that?',
    fr: 'Attends… quelle est cette lumière ?',
    w: 620, h: 190, tailX: 310, tailDir: 'down'
  },
  {
    id: 'c4b4p2-text',
    en: 'Did that just move?',
    fr: 'Cette lumière a bougé ?',
    w: 560, h: 190, tailX: 280, tailDir: 'down'
  },
  {
    id: 'c4b4p3-text',
    en: 'Where are these petals coming from?',
    fr: 'Quelle est la source de ces pétales ?',
    w: 780, h: 220, tailX: 390, tailDir: 'down-left'
  },
  {
    id: 'c4b5p1-text',
    en: 'A little surprise slipped through the screen.',
    fr: 'Une petite surprise apparaît sur son écran.',
    w: 820, h: 220, tailX: 410, tailDir: 'down'
  },
  {
    id: 'c4b5p2-text',
    en: 'A birthday cake? For me?',
    fr: 'Un gâteau pour mon anniversaire ? Pour moi ?',
    w: 680, h: 200, tailX: 340, tailDir: 'down'
  },
  {
    id: 'c4b6p1-text',
    en: 'Twenty-three candles. One very big wish.',
    fr: 'Vingt-trois bougies. Un immense vœu.',
    w: 820, h: 220, tailX: 410, tailDir: 'down'
  },
  {
    id: 'c4b7p2-text',
    en: 'You remembered…',
    fr: 'Vous avez pensé à moi…',
    w: 520, h: 180, tailX: 260, tailDir: 'down'
  },
  {
    id: 'c4b7p3-text',
    en: 'Make a wish, Tifa!',
    fr: 'Fais un vœu, Tifa !',
    w: 540, h: 180, tailX: 270, tailDir: 'down-right'
  },
  {
    id: 'c4b8p1-caption',
    en: 'Keep this joy close.',
    fr: 'Garde cette joie tout près.',
    isCaption: true,
    w: 540, h: 140
  },
  {
    id: 'c4b8p1-letter',
    en: 'Happy 23rd, Tifa! We love you!',
    fr: 'Joyeux 23e anniversaire, Tifa ! Avec toute notre affection !',
    isLetter: true,
    w: 680, h: 240
  }
];

function generateOrganicBubbleSvg(item, text, lang) {
  const { w, h, tailX = w / 2, isSfx, isCaption, isLetter } = item;

  if (isSfx) {
    // Dynamic comic SFX starburst
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <polygon points="
    25,90 60,35 120,45 160,15 210,48 270,20 295,65 345,60 330,110 355,145 305,150 280,175 220,155 170,175 130,150 75,170 65,125 15,115
  " fill="#FFF8EF" stroke="#171717" stroke-width="8" stroke-linejoin="round"/>
  <text x="${w / 2}" y="${h / 2 + 10}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Libre Franklin', Impact, Arial Black, sans-serif"
        font-size="44" font-weight="900" font-style="italic" fill="#F87800" stroke="#171717" stroke-width="3" letter-spacing="3">${text}</text>
</svg>`;
  }

  if (isCaption) {
    // Elegant warm caption card
    const pad = 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="14" ry="14"
        fill="#FFF8EF" stroke="#171717" stroke-width="7" stroke-linejoin="round"/>
  <text x="${w / 2}" y="${h / 2 + 4}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
        font-size="28" font-weight="800" fill="#171717" letter-spacing="1.2">${text.toUpperCase()}</text>
</svg>`;
  }

  if (isLetter) {
    // Warm birthday letter card with peony heart
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <g transform="rotate(-3 ${w / 2} ${h / 2})">
    <rect x="20" y="20" width="${w - 40}" height="${h - 40}" rx="18" ry="18"
          fill="#FFFDF8" stroke="#EB8DB7" stroke-width="8" stroke-linejoin="round"/>
    <path d="M ${w / 2 - 16} 55 C ${w / 2 - 32} 30, ${w / 2 - 50} 60, ${w / 2 - 16} 85 C ${w / 2 + 18} 60, ${w / 2} 30, ${w / 2 - 16} 55 Z"
          fill="#EB8DB7"/>
    <text x="${w / 2}" y="${h / 2 + 25}" text-anchor="middle" dominant-baseline="middle"
          font-family="'Libre Franklin', 'Segoe UI', Arial, sans-serif"
          font-size="30" font-weight="900" fill="#171717" letter-spacing="0.5">${text}</text>
  </g>
</svg>`;
  }

  // Authentic organic hand-drawn comic bubble
  const rTop = 22;
  const rBottom = h - 55;
  const rxL = 25;
  const rxR = w - 25;

  // Tail path
  const tailBase1 = tailX - 22;
  const tailBase2 = tailX + 22;
  const tailTipX = item.tailDir === 'down-left' ? tailX - 45 : item.tailDir === 'down-right' ? tailX + 45 : tailX;
  const tailTipY = h - 12;

  const bubblePath = `
    M ${rxL + 25} ${rTop}
    Q ${w / 2} ${rTop - 8} ${rxR - 25} ${rTop}
    Q ${rxR + 8} ${(rTop + rBottom) / 2} ${rxR - 12} ${rBottom}
    L ${tailBase2} ${rBottom}
    Q ${(tailBase2 + tailTipX) / 2} ${(rBottom + tailTipY) / 2} ${tailTipX} ${tailTipY}
    Q ${(tailBase1 + tailTipX) / 2} ${(rBottom + tailTipY) / 2} ${tailBase1} ${rBottom}
    L ${rxL + 25} ${rBottom}
    Q ${rxL - 10} ${(rTop + rBottom) / 2} ${rxL + 25} ${rTop}
    Z
  `.replace(/\s+/g, ' ').trim();

  // Choose appropriate font size based on text length
  const fontSize = text.length > 38 ? 26 : text.length > 25 ? 29 : 33;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <path d="${bubblePath}" fill="#FFF8EF" stroke="#171717" stroke-width="7.5" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="${w / 2}" y="${(rTop + rBottom) / 2 - 2}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Libre Franklin', 'Comic Neue', Arial Black, sans-serif"
        font-size="${fontSize}" font-weight="800" fill="#171717" letter-spacing="0.6">${text}</text>
</svg>`;
}

const enDir = path.join(__dirname, '..', 'textures', 'chapters', '4', 'text', 'en');
const frDir = path.join(__dirname, '..', 'textures', 'chapters', '4', 'text', 'fr');

fs.mkdirSync(enDir, { recursive: true });
fs.mkdirSync(frDir, { recursive: true });

bubbleData.forEach(item => {
  const enSvg = generateOrganicBubbleSvg(item, item.en, 'en');
  fs.writeFileSync(path.join(enDir, item.id + '.svg'), enSvg, 'utf8');

  const frSvg = generateOrganicBubbleSvg(item, item.fr, 'fr');
  fs.writeFileSync(path.join(frDir, item.id + '.svg'), frSvg, 'utf8');
});

console.log('Successfully regenerated all 34 speech bubbles (EN & FR) with authentic Ponpon Mania style!');
