const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'boards_analysis.json'), 'utf8'));

for (const ch of ['ch1', 'ch2', 'ch3']) {
  console.log(`\n=================== ${ch.toUpperCase()} ===================`);
  for (const [boardName, code] of Object.entries(data[ch])) {
    if (!code) {
      console.log(`Board ${boardName}: NOT FOUND`);
      continue;
    }
    // Extract textures, meshes, transforms, timelines
    const textures = [...code.matchAll(/getTexture\(["']([^"']+)["']\)/g)].map(m => m[1]);
    const packerMeshes = [...code.matchAll(/createPackerMesh\(\{\s*id:["']([^"']+)["']/g)].map(m => m[1]);
    const meshes = [...code.matchAll(/createMesh\(\{\s*meshId:["']([^"']+)["']/g)].map(m => m[1]);
    const tls = [...code.matchAll(/createTL\(/g)].length;
    const gsTo = [...code.matchAll(/S\.to\(/g)].length;
    console.log(`Board ${boardName}:`);
    console.log(`  Textures:`, [...new Set(textures)].join(', '));
    console.log(`  Packer Meshes:`, [...new Set(packerMeshes)].join(', '));
    console.log(`  Meshes:`, [...new Set(meshes)].join(', '));
    console.log(`  Timelines: ${tls}, Tweens: ${gsTo}`);
  }
}
