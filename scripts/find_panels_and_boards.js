const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

// Find all classes extending me (Panel)
const reMe = /class ([a-zA-Z0-9_$]+) extends me\b/g;
const panelClasses = [];
let m;
while ((m = reMe.exec(bundle)) !== null) {
  panelClasses.push(m[1]);
}
console.log('Panel classes (extends me):', panelClasses.length, panelClasses);

// Find all classes extending St (Board)
const reSt = /class ([a-zA-Z0-9_$]+) extends St\b/g;
const boardClasses = [];
while ((m = reSt.exec(bundle)) !== null) {
  boardClasses.push(m[1]);
}
console.log('Board classes (extends St):', boardClasses.length, boardClasses);
