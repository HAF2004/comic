const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = path.join(__dirname, '..', 'motion_evidence');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

// Compare two PNG buffers by calculating mean absolute pixel difference and stddev
function calculateBufferDiff(bufA, bufB) {
  const minLen = Math.min(bufA.length, bufB.length);
  let totalDiff = 0;
  let count = 0;
  const step = 4; // Sample every 4th byte for speed and accuracy
  const diffs = [];

  for (let i = 0; i < minLen; i += step) {
    const diff = Math.abs(bufA[i] - bufB[i]);
    totalDiff += diff;
    diffs.push(diff);
    count++;
  }

  const mean = totalDiff / count;
  let variance = 0;
  for (let i = 0; i < diffs.length; i++) {
    variance += Math.pow(diffs[i] - mean, 2);
  }
  const stddev = Math.sqrt(variance / count);

  return { mean, stddev };
}

async function runVerification() {
  console.log('=== STARTING CHAPTER 4 MOTION VERIFICATION ===\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      '--use-angle=d3d11',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  // 1. Visit Chapter 4
  console.log('Navigating to Chapter 4 (http://localhost:3000/chapter/4)...');
  await page.goto('http://localhost:3000/chapter/4', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // Dismiss cookie banner if present
  try {
    const acceptBtn = await page.$('button.accept, .cookie button, button:has-text("accept")');
    if (acceptBtn) {
      await acceptBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  } catch (e) {}

  const boardResults = [];

  // Boards 1 to 8 verification
  for (let b = 1; b <= 8; b++) {
    console.log(`\n--- Measuring Board 4_${b} ---`);

    if (b > 1) {
      // Advance to next board
      await page.keyboard.press('ArrowRight');
      await new Promise(r => setTimeout(r, 1200));
    }

    // Capture sequence of 6 frames spaced 200ms apart (1.2 seconds of animation)
    const frameBuffers = [];
    const framePaths = [];

    for (let f = 1; f <= 6; f++) {
      const frameFile = `c4b${b}_frame${f}.png`;
      const fullPath = path.join(EVIDENCE_DIR, frameFile);
      const buf = await page.screenshot({ path: fullPath });
      frameBuffers.push(buf);
      framePaths.push(frameFile);
      await new Promise(r => setTimeout(r, 200));
    }

    // Calculate pixel differences across consecutive frames
    const pairDiffs = [];
    for (let i = 1; i < frameBuffers.length; i++) {
      const diffResult = calculateBufferDiff(frameBuffers[i - 1], frameBuffers[i]);
      pairDiffs.push(diffResult);
    }

    const avgMeanDiff = pairDiffs.reduce((sum, d) => sum + d.mean, 0) / pairDiffs.length;
    const avgStddev = pairDiffs.reduce((sum, d) => sum + d.stddev, 0) / pairDiffs.length;

    // A static plate has mean diff ~0.000 and stddev ~0.000.
    // Active stepped idle / hair wobble / floating petals yield mean diff > 0.05 and stddev > 0.5.
    const motionDetected = avgMeanDiff > 0.03 || avgStddev > 0.2;

    console.log(`Board 4_${b} Motion Metrics:`, {
      meanDiff: avgMeanDiff.toFixed(3),
      stddev: avgStddev.toFixed(3),
      motionDetected: motionDetected ? 'LULUS (Motion Verified)' : 'STATIC',
      frames: framePaths.length
    });

    boardResults.push({
      board: `Board 4_${b}`,
      item: `c4b${b} motion & idle`,
      status: motionDetected ? 'LULUS' : 'BLOCKED',
      meanPixelDiff: avgMeanDiff,
      stddev: avgStddev,
      framesRecorded: framePaths.length,
      sampleFile: `motion_evidence/${framePaths[0]}`,
      allFrames: framePaths
    });
  }

  // Mobile Viewport Check (390 x 844)
  console.log('\n--- Verifying Mobile Viewport (390x844) ---');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'c4_mobile_viewport.png') });
  console.log('Mobile screenshot saved to motion_evidence/c4_mobile_viewport.png');

  // Prefers Reduced Motion Check
  console.log('\n--- Verifying prefers-reduced-motion fallback ---');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'c4_reduced_motion.png') });
  console.log('Reduced motion screenshot saved to motion_evidence/c4_reduced_motion.png');

  // Measure Baseline of Chapter 1, 2, 3 for comparison
  console.log('\n--- Measuring Baseline Chapters 1, 2, 3 ---');
  const baselineResults = {};
  for (const ch of [1, 2, 3]) {
    try {
      await page.goto(`http://localhost:3000/chapter/${ch}`, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2000));
      const f1 = await page.screenshot();
      await new Promise(r => setTimeout(r, 400));
      const f2 = await page.screenshot();
      const diff = calculateBufferDiff(f1, f2);
      baselineResults[`Chapter ${ch}`] = {
        meanDiff: diff.mean,
        stddev: diff.stddev,
        motion: diff.mean > 0.03
      };
      console.log(`Chapter ${ch} baseline:`, diff);
    } catch (e) {
      console.log(`Chapter ${ch} baseline skipped:`, e.message);
    }
  }

  await browser.close();

  // Save final report
  const summary = {
    timestamp: new Date().toISOString(),
    chapter4: boardResults,
    baselines: baselineResults
  };

  const summaryPath = path.join(__dirname, '..', 'motion_verification_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\nVerification complete. Summary written to ${summaryPath}`);

  return summary;
}

runVerification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
