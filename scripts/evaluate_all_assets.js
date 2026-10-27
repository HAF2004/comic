const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

const startIdx = bundle.indexOf('nR=[');
const endIdx = bundle.indexOf('const mo={', startIdx);
const codeSlice = bundle.substring(startIdx, endIdx);

const script = `
let Z="/textures/chapters/1/",Md="/textures/chapters/1/",ce="/textures/chapters/2/",Xx="/textures/chapters/2/",_e="/textures/chapters/3/";
${codeSlice}
module.exports = { pR, MR, LR };
`;

fs.writeFileSync(path.join(__dirname, 'scratch_eval_assets.js'), script);
const { pR, MR, LR } = require('./scratch_eval_assets.js');

console.log('Evaluated assets successfully:');
console.log('Chapter 1 asset count:', pR.length);
console.log('Chapter 2 asset count:', MR.length);
console.log('Chapter 3 asset count:', LR.length);

fs.writeFileSync(path.join(__dirname, 'evaluated_assets_123.json'), JSON.stringify({ ch1: pR, ch2: MR, ch3: LR }, null, 2));
console.log('Saved evaluated_assets_123.json');
