const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

const regex = /boardConfig\s*:\s*\[([^\]]+)\]/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('boardConfig found at', m.index, ':', m[0]);
}
