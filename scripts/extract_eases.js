const fs = require('fs');
const code = fs.readFileSync('_nuxt/CfE0pqJa.js', 'utf8');

const regex = /ease:\s*['"]([^'"]+)['"]/g;
const eases = new Set();
let m;
while ((m = regex.exec(code)) !== null) {
  eases.add(m[1]);
}
console.log('Unique eases used in GSAP:', Array.from(eases));
