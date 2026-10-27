const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

// Find class St extends
const idxSt = bundle.indexOf('class St extends');
console.log('--- St (Board Base Class) ---');
console.log(bundle.substring(idxSt, idxSt + 1200));

// Find class me extends
const idxMe = bundle.indexOf('class me extends');
console.log('\n--- me (Panel Base Class) ---');
console.log(bundle.substring(idxMe, idxMe + 1200));

// Find class Tp extends
const idxTp = bundle.indexOf('class Tp extends');
console.log('\n--- Tp (Chapter Base Class) ---');
console.log(bundle.substring(idxTp, idxTp + 1200));
