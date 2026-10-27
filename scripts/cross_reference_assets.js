const fs = require('fs');
const path = require('path');

const evaluated = JSON.parse(fs.readFileSync(path.join(__dirname, 'evaluated_assets_123.json'), 'utf8'));
const diskInventory = JSON.parse(fs.readFileSync(path.join(__dirname, 'chapters_123_inventory.json'), 'utf8'));

function normalizeUrl(url) {
  // remove leading /
  return url.replace(/^\//, '').replace(/\\/g, '/');
}

const report = {};

for (const ch of [1, 2, 3]) {
  const codeAssets = evaluated[`ch${ch}`];
  const diskFiles = diskInventory[ch];

  const diskPaths = new Set(diskFiles.map(d => d.path.replace(/\\/g, '/')));
  const diskMap = new Map(diskFiles.map(d => [d.path.replace(/\\/g, '/'), d]));

  const codeReferencedPaths = new Set();
  const missingInDisk = [];
  const referencedAssets = [];

  for (const asset of codeAssets) {
    const norm = normalizeUrl(asset.url);
    codeReferencedPaths.add(norm);

    // Also if locale is true, both -en. and -fr. are referenced
    if (asset.locale) {
      const frUrl = norm.replace('-en.', '-fr.').replace('/text/en/', '/text/fr/');
      codeReferencedPaths.add(frUrl);
    }

    // Check disk
    const onDisk = diskMap.get(norm);
    if (!onDisk) {
      missingInDisk.push({ id: asset.id, url: asset.url, norm });
    } else {
      referencedAssets.push({
        id: asset.id,
        url: asset.url,
        width: onDisk.width,
        height: onDisk.height,
        hasAlpha: onDisk.hasAlpha,
        size: onDisk.size,
        ext: onDisk.ext,
        locale: !!asset.locale,
        isSpriteData: onDisk.isSpriteData,
        frameCount: onDisk.frameCount,
        frameNames: onDisk.frameNames
      });
    }
  }

  // Find files on disk not directly in codeAssets
  const orphanFiles = [];
  for (const diskFile of diskFiles) {
    const p = diskFile.path.replace(/\\/g, '/');
    if (p.includes('/ktx/')) continue; // ktx basis files are loaded by BasisLoader alternate
    if (!codeReferencedPaths.has(p)) {
      orphanFiles.push(diskFile);
    }
  }

  report[`ch${ch}`] = {
    totalCodeAssets: codeAssets.length,
    totalDiskFiles: diskFiles.length,
    referencedAssetsCount: referencedAssets.length,
    missingInDisk,
    orphanCount: orphanFiles.length,
    orphanFiles: orphanFiles.slice(0, 30),
    referencedAssets
  };
}

fs.writeFileSync(path.join(__dirname, 'cross_reference_report.json'), JSON.stringify(report, null, 2));
console.log('Cross-reference report generated:');
for (const ch of [1, 2, 3]) {
  console.log(`Ch ${ch}: Code=${report['ch'+ch].totalCodeAssets}, Missing=${report['ch'+ch].missingInDisk.length}, Orphans=${report['ch'+ch].orphanCount}`);
}
