const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

// Find pR, MR, LR definitions
const idx1 = bundle.indexOf('pR=');
const pR_code = bundle.substring(idx1, idx1 + 600);
console.log('pR:', pR_code);

const idx2 = bundle.indexOf('MR=');
const MR_code = bundle.substring(idx2, idx2 + 600);
console.log('MR:', MR_code);

const idx3 = bundle.indexOf('LR=');
const LR_code = bundle.substring(idx3, idx3 + 600);
console.log('LR:', LR_code);
