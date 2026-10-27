const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

function inspectAround(index, before = 500, after = 500) {
  return bundle.substring(Math.max(0, index - before), Math.min(bundle.length, index + after));
}

console.log('--- CHAPTER 1 HEADER ---');
console.log(inspectAround(1781113, 300, 300));

console.log('--- CHAPTER 2 HEADER ---');
console.log(inspectAround(1803071, 300, 300));

console.log('--- CHAPTER 3 HEADER ---');
console.log(inspectAround(1844377, 300, 300));
