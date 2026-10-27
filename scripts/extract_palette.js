const fs = require('fs');
const path = require('path');

// We can read pixels of uncompressed PNG files or inspect known color values
// In webcomic ligne claire:
// Outline ink is always #171717 or near #161816
// Bubble background is #FEECE3 / #FFF5EE / #FFF8EF
// Background gradients in WebGL shaders:
// Chapter 1: #F87800 (orange) -> #EB8DB7 (pink)
// Chapter 2: #F894C0 (pink) -> #7E7EFF (lavender/blue)
// Chapter 3: #7E7EFF (lavender/blue) -> #F87800 (orange)

console.log('Shader background colors:');
console.log('Chapter 1: uColor1 = #F87800, uColor2 = #EB8DB7');
console.log('Chapter 2: uColor1 = #F894C0, uColor2 = #7E7EFF');
console.log('Chapter 3: uColor1 = #7E7EFF, uColor2 = #F87800');

// Let's inspect CSS tokens
const entryCss = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'entry.C48-i2yD.css'), 'utf8');
const hexes = entryCss.match(/#[0-9a-fA-F]{3,8}/g);
console.log('\nTop CSS Hexes in entry.css:');
console.log([...new Set(hexes)]);
