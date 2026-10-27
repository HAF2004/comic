const fs = require('fs');
const path = require('path');

const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, 'chapters_123_inventory.json'), 'utf8'));
const evaluated = JSON.parse(fs.readFileSync(path.join(__dirname, 'evaluated_assets_123.json'), 'utf8'));

// Categorize assets
function categorizeAsset(item) {
  const p = item.path.toLowerCase();
  const base = path.basename(p);
  
  if (base.includes('bubble') || base.includes('text')) {
    return 'TEXT_BUBBLE';
  }
  if (base.includes('sprite-data') || p.endsWith('.json')) {
    return 'SPRITE_DATA';
  }
  if (base.includes('-depth') || base.includes('-map')) {
    return 'DEPTH_MAP';
  }
  if (base.includes('sprite') || base.includes('part') || base.includes('body') || base.includes('arm') || base.includes('head') || base.includes('spin')) {
    return 'MOTION';
  }
  if (base.includes('bg') || base.includes('deco') || base.includes('table') || base.includes('walls') || base.includes('landscape') || base.includes('room') || base.includes('bus') || base.includes('seat')) {
    return 'STATIC';
  }
  // If has alpha and small dimensions, likely motion/prop
  if (item.hasAlpha && item.width < 1000 && item.height < 1000) {
    return 'MOTION';
  }
  return 'STATIC';
}

const detailedInventory = {};

for (const ch of [1, 2, 3]) {
  const codeList = evaluated[`ch${ch}`];
  const diskList = inventory[ch];
  
  const diskMap = new Map();
  diskList.forEach(d => {
    const norm = d.path.replace(/\\/g, '/');
    diskMap.set(norm, d);
    diskMap.set(path.basename(norm), d);
  });

  detailedInventory[`ch${ch}`] = codeList.map(asset => {
    const normUrl = asset.url.replace(/^\//, '').replace(/\\/g, '/');
    const diskInfo = diskMap.get(normUrl) || diskMap.get(path.basename(normUrl)) || {};
    const type = categorizeAsset({ path: normUrl, ...diskInfo });
    
    // Determine board and panel from ID (e.g. c1b2p3 -> Chapter 1, Board 2, Panel 3)
    const id = asset.id || '';
    const match = id.match(/c(\d+)b(\d+)p(\d+)/);
    const boardNum = match ? match[2] : 'unknown';
    const panelNum = match ? match[3] : 'unknown';

    return {
      id: asset.id,
      url: asset.url,
      chapter: ch,
      board: boardNum,
      panel: panelNum,
      type: type,
      width: diskInfo.width || 'N/A',
      height: diskInfo.height || 'N/A',
      dimensions: diskInfo.width ? `${diskInfo.width}x${diskInfo.height}` : 'N/A',
      hasAlpha: diskInfo.hasAlpha !== undefined ? diskInfo.hasAlpha : 'N/A',
      sizeBytes: diskInfo.size || 0,
      sizeKb: diskInfo.size ? (diskInfo.size / 1024).toFixed(1) + ' KB' : 'N/A',
      locale: !!asset.locale,
      role: type === 'TEXT_BUBBLE' ? 'Speech / Narration' :
            type === 'MOTION' ? 'Animated character part / prop' :
            type === 'DEPTH_MAP' ? 'Parallax displacement' :
            type === 'SPRITE_DATA' ? 'Atlas frames definition' : 'Panel background / scene plate',
      parentGroup: `Board ${boardNum} Panel ${panelNum}`
    };
  });
}

fs.writeFileSync(path.join(__dirname, 'detailed_asset_inventory.json'), JSON.stringify(detailedInventory, null, 2));
console.log('Detailed inventory written.');
for (const ch of [1, 2, 3]) {
  const list = detailedInventory[`ch${ch}`];
  const motionCount = list.filter(x => x.type === 'MOTION').length;
  const staticCount = list.filter(x => x.type === 'STATIC').length;
  const bubbleCount = list.filter(x => x.type === 'TEXT_BUBBLE').length;
  const depthCount = list.filter(x => x.type === 'DEPTH_MAP').length;
  const spriteDataCount = list.filter(x => x.type === 'SPRITE_DATA').length;
  console.log(`Ch ${ch}: Total=${list.length} | Motion=${motionCount} | Static=${staticCount} | Bubbles=${bubbleCount} | Depth=${depthCount} | SpriteData=${spriteDataCount}`);
}
