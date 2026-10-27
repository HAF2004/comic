const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const qcPath = path.join(ROOT, 'bubble_qc.json');
const qc = JSON.parse(fs.readFileSync(qcPath, 'utf8'));

qc.verdict = 'BELUM LAYAK RILIS';
qc.blockerCount = 1;
qc.majorCount = 0;
qc.minorCount = 3;

qc.findings = [
  {
    id: 'BLK_B4P3_TAIL_PIERCE_EYE',
    panel: 'c4b4p3',
    board: 4,
    panelNumber: 3,
    viewport: 'all (390px, 768px, 1024px, 1440px, 1920px)',
    criteria: 'C2, C4',
    measured: 'Tail tip at (x: 48.0%, y: 56.0%), length 36% panel height',
    threshold: 'C2: No overlap with face/eye/mouth (overlap = FAIL); C4: length <= 22%',
    evidence: 'bubble_qc_evidence/board4-panel3-desktop_1920.png, bubble_qc_evidence/board4-panel3-mobile_390.png',
    severity: 'BLOCKER',
    confidence: 'HIGH',
    description: 'Ekor bubble "Where are these petals coming from?" menjulur sepanjang 36% tinggi panel (ambang <= 22%) dan menembus tepat ke frame kacamata serta pupil mata kanan Tifa.'
  },
  {
    id: 'MIN_B8_LETTER_PADDING',
    panel: 'c4b8p1_letter',
    board: 8,
    panelNumber: 1,
    viewport: 'mobile_390',
    criteria: 'A3',
    measured: 'Padding 8% at 390px',
    threshold: '>= 12% bubble height',
    evidence: 'bubble_qc_evidence/board8-panel1-mobile_390.png',
    severity: 'MINOR',
    confidence: 'HIGH',
    description: 'Teks pada surat keepsake B8 di viewport mobile 390px memiliki margin sempit terhadap batas lipatan kertas surat.'
  },
  {
    id: 'MIN_B7_BANNER_CURVATURE',
    panel: 'c4b7p1',
    board: 7,
    panelNumber: 1,
    viewport: 'all',
    criteria: 'B5',
    measured: 'Ribbon angle fixed -2.5deg',
    threshold: 'Dynamic ribbon curve matching master',
    evidence: 'bubble_qc_evidence/board7-panel1-desktop_1920.png',
    severity: 'MINOR',
    confidence: 'MEDIUM',
    description: 'Banner pesta di B7 menggunakan ribbon lengkung statis; saat animasi masuk, rotasi pita sedikit mendatar dibanding outline gambar master.'
  },
  {
    id: 'MIN_B3P1_THOUGHT_STYLING',
    panel: 'c4b3p1',
    board: 3,
    panelNumber: 1,
    viewport: 'all',
    criteria: 'C3, B2',
    measured: 'Bentuk speech bubble dengan ekor runcing ke kepala',
    threshold: 'Thought cloud bubble atau caption box narasi',
    evidence: 'bubble_qc_evidence/board3-desktop_1920.png',
    severity: 'MINOR',
    confidence: 'HIGH',
    description: 'Teks monolog batin Tifa ("Just one quiet minute for herself.") dirender sebagai speech bubble dengan ekor tajam, bukan thought bubble awan atau caption box.'
  }
];

if (qc.panelReports['c4b4p3']) {
  qc.panelReports['c4b4p3'].passedGeometry = false;
  qc.panelReports['c4b4p3'].tailTouchingFace = true;
  qc.panelReports['c4b4p3'].tailLengthPercent = '36.0%';
}

fs.writeFileSync(qcPath, JSON.stringify(qc, null, 2));
console.log('bubble_qc.json updated successfully.');
