const fs = require('fs');
const path = require('path');

function getPngInfo(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(32);
    fs.readSync(fd, buffer, 0, 32, 0);
    fs.closeSync(fd);

    // Verify PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      const bitDepth = buffer[24];
      const colorType = buffer[25];
      const hasAlpha = colorType === 4 || colorType === 6;
      const stats = fs.statSync(filePath);
      return { width, height, bitDepth, colorType, hasAlpha, size: stats.size };
    }
  } catch (e) {
    return null;
  }
  return null;
}

function scanDir(dir) {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const chapters = [1, 2, 3];
const inventory = {};

for (const ch of chapters) {
  const chDir = path.join(__dirname, '..', 'textures', 'chapters', String(ch));
  if (!fs.existsSync(chDir)) continue;
  const files = scanDir(chDir);
  inventory[ch] = files.map(f => {
    const rel = path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/');
    const ext = path.extname(f).toLowerCase();
    const stats = fs.statSync(f);
    let meta = { path: rel, ext, size: stats.size };
    if (ext === '.png') {
      const png = getPngInfo(f);
      if (png) {
        meta.width = png.width;
        meta.height = png.height;
        meta.hasAlpha = png.hasAlpha;
      }
    } else if (ext === '.json') {
      try {
        const jsonContent = JSON.parse(fs.readFileSync(f, 'utf8'));
        meta.isSpriteData = !!(jsonContent.frames || jsonContent.meta);
        if (jsonContent.frames) {
          meta.frameCount = Array.isArray(jsonContent.frames) ? jsonContent.frames.length : Object.keys(jsonContent.frames).length;
          meta.frameNames = (Array.isArray(jsonContent.frames) ? jsonContent.frames.map(x => x.filename) : Object.keys(jsonContent.frames)).slice(0, 10);
        }
      } catch (e) {}
    }
    return meta;
  });
}

fs.writeFileSync(path.join(__dirname, 'chapters_123_inventory.json'), JSON.stringify(inventory, null, 2));
console.log('Done scanning chapters 1-3. Total files:', {
  ch1: inventory[1] ? inventory[1].length : 0,
  ch2: inventory[2] ? inventory[2].length : 0,
  ch3: inventory[3] ? inventory[3].length : 0
});
