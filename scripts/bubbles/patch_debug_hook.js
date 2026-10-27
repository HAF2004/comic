// Adds a tiny debug registry so test tooling can locate Chapter 4 panels on screen.
// Idempotent.
const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '..', '..', '_nuxt', 'CfE0pqJa.js');
let code = fs.readFileSync(bundlePath, 'utf8');

const anchor = `    props.usePerspective = true;
    props.fov = 45;
    super(world, props);
`;
const hook = `    if (typeof window !== 'undefined') { (window.__C4_DEBUG__ = window.__C4_DEBUG__ || {})[props.id] = this; }
`;

if (code.includes('window.__C4_DEBUG__')) {
  console.log('Debug hook already present');
} else if (!code.includes(anchor)) {
  console.error('Anchor not found');
  process.exit(1);
} else {
  code = code.replace(anchor, anchor + hook);
  fs.writeFileSync(bundlePath, code, 'utf8');
  console.log('Debug hook inserted');
}
