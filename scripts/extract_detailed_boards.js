const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

const ch1Boards = ['AK', 'FK', 'YK', 'XK', 'Fj', 'jK', 'NK', '$K', 'HK', 'GK'];
const ch2Boards = ['JK', 'ZK', 'LN', 'QK', 'eJ', 'tJ', 'nJ', 'iJ', 'sJ', 'lJ'];
const ch3Boards = ['vJ', 'bJ', 'wJ', 'MJ', 'PJ', 'TJ', 'CJ', 'zJ'];

function extractClassCode(className) {
  // Pattern: class AK extends St{
  const target = `class ${className} extends St`;
  const idx = bundle.indexOf(target);
  if (idx === -1) {
    const target2 = `class ${className} extends`;
    const idx2 = bundle.indexOf(target2);
    if (idx2 === -1) return null;
    return bundle.substring(idx2, idx2 + 3000);
  }
  return bundle.substring(idx, idx + 3500);
}

const detailedBoards = {
  ch1: {},
  ch2: {},
  ch3: {}
};

ch1Boards.forEach(b => detailedBoards.ch1[b] = extractClassCode(b));
ch2Boards.forEach(b => detailedBoards.ch2[b] = extractClassCode(b));
ch3Boards.forEach(b => detailedBoards.ch3[b] = extractClassCode(b));

fs.writeFileSync(path.join(__dirname, 'boards_analysis.json'), JSON.stringify(detailedBoards, null, 2));
console.log('Saved detailed boards analysis for all boards in ch1, ch2, ch3.');
