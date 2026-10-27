const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

// Let's find classes matching Chapter1, Chapter2, Chapter3 or Board1_, Board2_, Board3_
const reChapters = /class (Chapter[123]|Board[123]_\d+)/g;
let m;
const foundClasses = [];
while ((m = reChapters.exec(bundle)) !== null) {
  foundClasses.push({ name: m[1], index: m.index });
}

console.log('Found chapter/board classes:', foundClasses.map(x => x.name));

// Let's extract snippets of each Board class to inspect motion, pivots, and layers
const boardSnippets = {};
for (let i = 0; i < foundClasses.length; i++) {
  const current = foundClasses[i];
  const next = foundClasses[i + 1];
  const end = next ? next.index : current.index + 4000;
  boardSnippets[current.name] = bundle.substring(current.index, Math.min(current.index + 2500, end));
}

fs.writeFileSync(path.join(__dirname, 'chapters_code_structure.json'), JSON.stringify(boardSnippets, null, 2));
console.log('Saved board snippets.');
