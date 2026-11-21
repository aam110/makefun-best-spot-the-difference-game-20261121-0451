// Difference hit-testing and the markers drawn over found differences.

export function findDifferenceAt(level, x, y, found) {
  for (let i = 0; i < level.differences.length; i++) {
    if (found.has(i)) continue;
    const d = level.differences[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return i;
  }
  return -1;
}

export function firstUnfound(level, found) {
  for (let i = 0; i < level.differences.length; i++) {
    if (!found.has(i)) return i;
  }
  return -1;
}

export function randomUnfound(level, found) {
  const open = [];
  for (let i = 0; i < level.differences.length; i++) {
    if (!found.has(i)) open.push(i);
  }
  if (open.length === 0) return -1;
  return open[Math.floor(Math.random() * open.length)];
}

// A golden ring with a gentle pulse, drawn on both panels over a found difference.
export function drawFoundMarker(ctx, diff, time, bornAt) {
  const age = time - bornAt;
  const pop = age < 0.35 ? 1 + (0.35 - age) * 1.6 : 1;
  const pulse = 1 + 0.06 * Math.sin(time * 3 + diff.x);
  const r = diff.r * pop * pulse;
  ctx.save();
  ctx.strokeStyle = '#ffd93d';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 217, 61, 0.9)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r - 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  // A small check tick at the ring's edge.
  ctx.save();
  ctx.strokeStyle = '#ffd93d';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(diff.x + r * 0.55, diff.y - r * 0.75);
  ctx.lineTo(diff.x + r * 0.8, diff.y - r * 0.5);
  ctx.lineTo(diff.x + r * 1.15, diff.y - r * 1.0);
  ctx.stroke();
  ctx.restore();
}

export function drawAllFoundMarkers(ctx, level, found, foundAt, time) {
  for (const i of found) {
    drawFoundMarker(ctx, level.differences[i], time, foundAt[i] ?? 0);
  }
}

// A pulsing teal ring that hints at one unfound difference.
export function drawHintRing(ctx, diff, time) {
  const pulse = 1 + 0.18 * Math.sin(time * 6);
  ctx.save();
  ctx.strokeStyle = '#3ddc97';
  ctx.lineWidth = 3.5;
  ctx.setLineDash([10, 7]);
  ctx.lineDashOffset = -time * 30;
  ctx.shadowColor = 'rgba(61, 220, 151, 0.9)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r * pulse + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// A brief red X where a wrong click landed.
export function drawMissMark(ctx, x, y, age) {
  const alpha = Math.max(0, 1 - age / 0.8);
  const size = 12 + age * 6;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ff5d73';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.stroke();
  ctx.restore();
}
