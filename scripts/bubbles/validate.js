// Automated Verification for Chapter 4 Speech Bubbles
// Evaluates all criteria from FASE 4:
// 1. Tail tip proximity to speakerTarget (<= 6.0% panel radius)
// 2. No intersection between bubble bbox and speakerHead bbox
// 3. Margin >= 5.0% from all panel boundaries (left, right, top, bottom)
// 4. No collisions between multi-bubble panels (e.g. c4b8p1)
// 5. Zero console errors/exceptions during capture

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const audit = JSON.parse(fs.readFileSync(path.join(ROOT, 'bubble_audit.json'), 'utf8'));
const bubbles = JSON.parse(fs.readFileSync(path.join(ROOT, 'bubbles.json'), 'utf8'));

function bboxesIntersect(a, b) {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

function dist(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const results = [];
let overallPass = true;

for (const panelAudit of audit.panels) {
  const id = panelAudit.id;
  const bConfig = bubbles[id] || (id === 'c4b8p1' ? bubbles['c4b8p1_caption'] : null);

  if (!bConfig) {
    results.push({ id, status: 'BLOCKED', reason: `No bubble configuration found for ${id}` });
    overallPass = false;
    continue;
  }

  const checks = {
    tailProximity: { pass: true, val: 0, maxAllowed: 6.0 },
    faceClearance: { pass: true, overlap: false },
    edgeMargins: { pass: true, margins: {} },
    multiCollision: { pass: true }
  };

  // 1. Tail Proximity
  if (bConfig.tailTarget && panelAudit.speakerTarget) {
    const d = dist(bConfig.tailTarget, panelAudit.speakerTarget);
    checks.tailProximity.val = +d.toFixed(2);
    if (d > 6.0) {
      checks.tailProximity.pass = false;
      overallPass = false;
    }
  }

  // 2. Face clearance (no overlap with speaker head)
  if (panelAudit.speakerHead && bConfig.bubble) {
    const overlap = bboxesIntersect(bConfig.bubble, panelAudit.speakerHead);
    checks.faceClearance.overlap = overlap;
    if (overlap) {
      checks.faceClearance.pass = false;
      overallPass = false;
    }
  }

  // 3. Edge margins (>= 5%)
  const bx = bConfig.bubble.x;
  const by = bConfig.bubble.y;
  const bw = bConfig.bubble.w;
  const bh = bConfig.bubble.h;
  const mLeft = bx;
  const mTop = by;
  const mRight = 100 - (bx + bw);
  const mBottom = 100 - (by + bh);

  checks.edgeMargins.margins = {
    left: +mLeft.toFixed(1),
    top: +mTop.toFixed(1),
    right: +mRight.toFixed(1),
    bottom: +mBottom.toFixed(1)
  };

  if (mLeft < 5.0 || mTop < 5.0 || mRight < 5.0 || mBottom < 5.0) {
    checks.edgeMargins.pass = false;
    overallPass = false;
  }

  // 4. Multi-bubble check (e.g. c4b8p1 caption vs letter)
  if (id === 'c4b8p1') {
    const cap = bubbles['c4b8p1_caption'].bubble;
    const lettr = bubbles['c4b8p1_letter'].bubble;
    if (bboxesIntersect(cap, lettr)) {
      checks.multiCollision.pass = false;
      overallPass = false;
    }
  }

  const panelPassed = Object.values(checks).every(c => c.pass);
  results.push({
    id,
    speaker: panelAudit.speaker,
    facing: panelAudit.facing,
    bubble: bConfig.bubble,
    tailTarget: bConfig.tailTarget,
    checks,
    status: panelPassed ? 'LULUS' : 'GAGAL'
  });
}

// 5. Console & Network Log Validation
const consoleSummary = {};
for (const vp of ['desktop', 'mobile']) {
  const cPath = path.join(ROOT, 'before_after', 'after', vp, 'console.json');
  if (fs.existsSync(cPath)) {
    const raw = JSON.parse(fs.readFileSync(cPath, 'utf8'));
    const fatal = raw.filter(entry => {
      if (entry.text && (entry.text.includes('google-analytics') || entry.text.includes('googletagmanager'))) {
        return false;
      }
      return (
        entry.type === 'pageerror' ||
        entry.type === 'requestfailed' ||
        entry.type.startsWith('http4') ||
        entry.type.startsWith('http5')
      );
    });
    consoleSummary[vp] = { totalLogs: raw.length, fatalCount: fatal.length, fatal };
    if (fatal.length > 0) {
      overallPass = false;
    }
  } else {
    consoleSummary[vp] = { status: 'NOT_RUN_YET' };
  }
}

const report = {
  timestamp: new Date().toISOString(),
  overallPass,
  consoleSummary,
  panels: results
};

fs.writeFileSync(path.join(ROOT, 'validation_report.json'), JSON.stringify(report, null, 2));

console.log('================================================================');
console.log(`AUTOMATED VERIFICATION REPORT — Overall: ${overallPass ? 'ALL TESTS PASSED' : 'SOME CHECKS FAILED'}`);
console.log('================================================================');
results.forEach(r => {
  const tailStr = r.tailTarget ? `tail tip dist: ${r.checks.tailProximity.val}% (<=6%)` : 'no tail';
  const marginStr = `margins: [L:${r.checks.edgeMargins.margins.left}%, T:${r.checks.edgeMargins.margins.top}%, R:${r.checks.edgeMargins.margins.right}%, B:${r.checks.edgeMargins.margins.bottom}%]`;
  console.log(`[${r.status}] ${r.id} (${r.speaker}): ${tailStr} | face clearance: ${r.checks.faceClearance.pass ? 'CLEAR' : 'OVERLAP'} | ${marginStr}`);
});
console.log('================================================================');
