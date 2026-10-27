const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

const regex = /chapter[123]/g;
let m;
const matches = [];
while ((m = regex.exec(bundle)) !== null) {
  matches.push({ term: m[0], idx: m.index, snippet: bundle.substring(Math.max(0, m.index - 50), m.index + 100) });
}

console.log('Matches count:', matches.length);
matches.slice(0, 15).forEach(x => console.log(x.idx, ':', x.snippet));
