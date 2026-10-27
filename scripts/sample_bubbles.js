const fs = require('fs');
const path = require('path');

const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, 'chapters_123_inventory.json'), 'utf8'));

const bubbleStats = { ch1: [], ch2: [], ch3: [] };

for (const ch of [1, 2, 3]) {
  const files = inventory[ch];
  for (const f of files) {
    if (f.path.includes('bubble') && f.ext === '.png') {
      bubbleStats[`ch${ch}`].push({
        path: f.path,
        width: f.width,
        height: f.height,
        aspect: (f.width / f.height).toFixed(2),
        sizeKb: (f.size / 1024).toFixed(1),
        hasAlpha: f.hasAlpha
      });
    }
  }
}

console.log('Sample speech bubble dimensions:');
for (const ch of [1, 2, 3]) {
  console.log(`\n--- Chapter ${ch} (${bubbleStats['ch'+ch].length} bubbles) ---`);
  bubbleStats['ch'+ch].slice(0, 10).forEach(b => {
    console.log(`${path.basename(b.path)}: ${b.width}x${b.height} (aspect ${b.aspect}, ${b.sizeKb}KB, alpha: ${b.hasAlpha})`);
  });
}
