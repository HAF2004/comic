const fs = require('fs');
const path = require('path');

function generateBubblePath(W, H, bx, by, bw, bh, tx, ty) {
  const r = Math.round(Math.min(bw * 0.35, bh * 0.44));

  if (!tx || !ty) {
    return `M ${bx + r} ${by}
L ${bx + bw - r} ${by}
A ${r} ${r} 0 0 1 ${bx + bw} ${by + r}
L ${bx + bw} ${by + bh - r}
A ${r} ${r} 0 0 1 ${bx + bw - r} ${by + bh}
L ${bx + r} ${by + bh}
A ${r} ${r} 0 0 1 ${bx} ${by + bh - r}
L ${bx} ${by + r}
A ${r} ${r} 0 0 1 ${bx + r} ${by} Z`.replace(/\s+/g, ' ').trim();
  }

  const baseW = Math.max(34, Math.min(60, Math.round(bw * 0.12)));
  const minBaseX = bx + r + baseW / 2 + 6;
  const maxBaseX = bx + bw - r - baseW / 2 - 6;

  // Decide base anchor based on target position relative to bubble
  let targetBaseX;
  if (tx < bx + bw * 0.35) {
    targetBaseX = bx + bw * 0.28;
  } else if (tx > bx + bw * 0.65) {
    targetBaseX = bx + bw * 0.72;
  } else {
    targetBaseX = bx + bw * 0.50;
  }
  const baseX = Math.round(Math.max(minBaseX, Math.min(maxBaseX, targetBaseX)));

  const p1 = { x: Math.round(baseX - baseW / 2), y: by + bh };
  const p2 = { x: Math.round(baseX + baseW / 2), y: by + bh };
  const tip = { x: tx, y: ty };

  const dx = tip.x - baseX;
  const dy = tip.y - (by + bh);

  let c2a, c2b, c1b, c1a;

  if (dx >= 0) {
    // Tail points right or down-right
    c2a = { x: Math.round(p2.x + dx * 0.20), y: Math.round(p2.y + dy * 0.40) };
    c2b = { x: Math.round(p2.x + dx * 0.75), y: Math.round(p2.y + dy * 0.85) };
    c1b = { x: Math.round(p1.x + dx * 0.60), y: Math.round(p1.y + dy * 0.90) };
    c1a = { x: Math.round(p1.x + dx * 0.10), y: Math.round(p1.y + dy * 0.45) };
  } else {
    // Tail points left or down-left
    c2a = { x: Math.round(p2.x + dx * 0.10), y: Math.round(p2.y + dy * 0.45) };
    c2b = { x: Math.round(p2.x + dx * 0.60), y: Math.round(p2.y + dy * 0.90) };
    c1b = { x: Math.round(p1.x + dx * 0.75), y: Math.round(p1.y + dy * 0.85) };
    c1a = { x: Math.round(p1.x + dx * 0.20), y: Math.round(p1.y + dy * 0.40) };
  }

  return `M ${bx + r} ${by}
L ${bx + bw - r} ${by}
A ${r} ${r} 0 0 1 ${bx + bw} ${by + r}
L ${bx + bw} ${by + bh - r}
A ${r} ${r} 0 0 1 ${bx + bw - r} ${by + bh}
L ${p2.x} ${p2.y}
C ${c2a.x} ${c2a.y}, ${c2b.x} ${c2b.y}, ${tip.x} ${tip.y}
C ${c1b.x} ${c1b.y}, ${c1a.x} ${c1a.y}, ${p1.x} ${p1.y}
L ${bx + r} ${by + bh}
A ${r} ${r} 0 0 1 ${bx} ${by + bh - r}
L ${bx} ${by + r}
A ${r} ${r} 0 0 1 ${bx + r} ${by} Z`.replace(/\s+/g, ' ').trim();
}

console.log('Path generator ready');
