const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, '..', '_nuxt', 'CfE0pqJa.js'), 'utf8');

// Search for createTL, applyTransform, S.to, S.set, pivot across bundle sections for ch1, ch2, ch3
function analyzeChapterMotion(startPos, endPos, chapterNum) {
  const section = bundle.substring(startPos, endPos);
  
  // Timelines
  const tlMatches = [...section.matchAll(/this\.createTL\(\{([^}]+)\}\)/g)].map(m => m[1]);
  
  // Transforms / pivots
  const transformMatches = [...section.matchAll(/applyTransform\(\{([^}]+)\}\)/g)].map(m => m[1]);
  
  // GSAP tweens
  const tweenMatches = [...section.matchAll(/S\.(to|fromTo|set)\(([^,]+),\s*\{([^}]+)\}/g)].map(m => ({
    method: m[1],
    target: m[2],
    props: m[3]
  }));

  // Packer meshes
  const packerMeshes = [...section.matchAll(/createPackerMesh\(\{([^}]+)\}\)/g)].map(m => m[1]);

  return {
    chapter: chapterNum,
    timelineCount: tlMatches.length,
    timelines: tlMatches.slice(0, 10),
    transformCount: transformMatches.length,
    transforms: transformMatches.slice(0, 10),
    tweenCount: tweenMatches.length,
    tweens: tweenMatches.slice(0, 10),
    packerMeshes: packerMeshes.slice(0, 10)
  };
}

// Chapter 1 is between ~1000000 and 1785000
const ch1Motion = analyzeChapterMotion(950000, 1785000, 1);
// Chapter 2 is between ~1200000 and 1810000
const ch2Motion = analyzeChapterMotion(1200000, 1810000, 2);
// Chapter 3 is between ~1400000 and 1850000
const ch3Motion = analyzeChapterMotion(1400000, 1850000, 3);

fs.writeFileSync(path.join(__dirname, 'motion_analysis.json'), JSON.stringify({ ch1: ch1Motion, ch2: ch2Motion, ch3: ch3Motion }, null, 2));
console.log('Motion analysis written:');
console.log('Ch1:', ch1Motion.timelineCount, 'TLs,', ch1Motion.tweenCount, 'Tweens');
console.log('Ch2:', ch2Motion.timelineCount, 'TLs,', ch2Motion.tweenCount, 'Tweens');
console.log('Ch3:', ch3Motion.timelineCount, 'TLs,', ch3Motion.tweenCount, 'Tweens');
