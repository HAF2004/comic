const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

const regex = /cy\.(chapter[1234]|chapters)\s*=\s*([a-zA-Z0-9_$]+)/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log(`Found: ${m[1]} -> ${m[2]} at index ${m.index}`);
}
