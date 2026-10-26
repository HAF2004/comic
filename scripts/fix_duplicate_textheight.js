const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js');
let code = fs.readFileSync(bundlePath, 'utf8');

const targetOld = `      const textZ = 0.8 + index * 0.002;
      const textHeight = 2 * Math.tan(45 * Math.PI / 360) * (5 - textZ);
      const textWidthFit = textHeight * Math.min(props.ratio, textAspect);`;

const targetNew = `      const textZ = 0.8 + index * 0.002;
      const textFrustumHeight = 2 * Math.tan(45 * Math.PI / 360) * (5 - textZ);
      const textWidthFit = textFrustumHeight * Math.min(props.ratio, textAspect);`;

if (!code.includes(targetOld)) {
  console.error('Target snippet not found in bundle!');
  process.exit(1);
}

code = code.replace(targetOld, targetNew);
fs.writeFileSync(bundlePath, code, 'utf8');
console.log('Successfully fixed duplicate textHeight identifier!');
