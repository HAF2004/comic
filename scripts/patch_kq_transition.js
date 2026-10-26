const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js');
let code = fs.readFileSync(bundlePath, 'utf8');

// 1. Fix colors in KQ constructor
const oldColors = 'this.colors=["#EB8DB7","#EB8DB7","#7E7EFF","#F5B347"],this.colors2=["#F87800","#7E7EFF","#FFBC03","#72DA7E"]';
const newColors = 'this.colors=["#EB8DB7","#EB8DB7","#7E7EFF","#F5B347","#EB8DB7","#FFC3DA"],this.colors2=["#F87800","#7E7EFF","#FFBC03","#72DA7E","#F87800","#FC6E0A"]';

if (!code.includes(oldColors)) {
  console.error('Could not find oldColors in KQ!');
  process.exit(1);
}
code = code.replace(oldColors, newColors);
console.log('Patched KQ colors array');

// 2. Fix start(t) safe access to t.from
const oldStart = 'start(t){var l;super.start(t);const n=t.from.id,s=(l=t.to)==null?void 0:l.id;';
const newStart = 'start(t){var l;super.start(t);const n=(t.from&&t.from.id)||"chapters",s=(l=t.to)==null?void 0:l.id;';

if (!code.includes(oldStart)) {
  console.error('Could not find oldStart in KQ!');
  process.exit(1);
}
code = code.replace(oldStart, newStart);
console.log('Patched KQ start(t) safe from.id');

// 3. Fix colors index with modulo in start(t)
const oldIndex = 'let o=parseInt((s==null?void 0:s.split("chapter")[1])||"0");';
const newIndex = 'let o=parseInt((s==null?void 0:s.split("chapter")[1])||"0")%this.colors.length;';

if (!code.includes(oldIndex)) {
  console.error('Could not find oldIndex in KQ!');
  process.exit(1);
}
code = code.replace(oldIndex, newIndex);
console.log('Patched KQ o modulo indexing');

// 4. Fix onComplete t.from null check
const oldComplete = 'onComplete:()=>{t.from.isTransitioning=!1}';
const newComplete = 'onComplete:()=>{t.from&&(t.from.isTransitioning=!1)}';

if (!code.includes(oldComplete)) {
  console.error('Could not find oldComplete in KQ!');
  process.exit(1);
}
code = code.replace(oldComplete, newComplete);
console.log('Patched KQ onComplete safe check');

fs.writeFileSync(bundlePath, code, 'utf8');
console.log('Successfully patched KQ in _nuxt/CfE0pqJa.js');
