const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

// Find backgrounds for ch1, ch2, ch3
// Search for uColor1 and uColor2 near chapter1, chapter2, chapter3
const bgMatches = [...bundle.matchAll(/uColor1:\s*\{\s*value:\s*new re\((["'][^"']+["'])\)\s*\},\s*uColor2:\s*\{\s*value:\s*new re\((["'][^"']+["'])\)/g)];
console.log('Background gradients found:');
bgMatches.forEach(m => console.log('uColor1:', m[1], 'uColor2:', m[2], 'at index', m.index));

// Also let's search for all new re("#...") in the bundle
const allHexes = new Set([...bundle.matchAll(/#([0-9a-fA-F]{3,8})\b/g)].map(m => m[0].toUpperCase()));
console.log('All unique HEX colors in bundle:', Array.from(allHexes));

// Let's search CSS files for color palette and fonts
const cssDir = path.join(__dirname, '..', '_nuxt');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
const cssContents = cssFiles.map(f => ({ name: f, content: fs.readFileSync(path.join(cssDir, f), 'utf8') }));

console.log('CSS files found:', cssFiles);
cssContents.forEach(c => {
  const fontFamilies = [...c.content.matchAll(/font-family:[^;}]+/g)].map(m => m[0]);
  const colors = [...c.content.matchAll(/#([0-9a-fA-F]{3,8})\b/g)].map(m => m[0].toUpperCase());
  console.log(`\nIn ${c.name}:`);
  console.log('Fonts:', [...new Set(fontFamilies)]);
  console.log('Sample Colors:', [...new Set(colors)].slice(0, 20));
});
