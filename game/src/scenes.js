// Procedural scene art: every picture is drawn in code, twice —
// variant 0 is the original panel, variant 1 is the changed panel.
// No image files, no randomness: the same inputs always draw the same frame.

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function roundRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function star(ctx, x, y, r, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(ang) * rad;
    const py = y + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function text(ctx, str, x, y, size, color, align) {
  ctx.fillStyle = color;
  ctx.font = `800 ${size}px system-ui, sans-serif`;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// ---------------------------------------------------------------- night market

const MARKET_STARS = [
  [40, 40], [90, 90], [150, 34], [200, 100], [300, 36], [360, 84],
  [420, 30], [520, 110], [540, 40], [60, 140], [330, 130], [180, 140],
];

function drawStringLights(ctx, time) {
  const spans = [
    { x1: 0, y1: 30, x2: 280, y2: 26, sag: 34 },
    { x1: 280, y1: 26, x2: 560, y2: 34, sag: 40 },
  ];
  const colors = ['#ffd97a', '#ff8fa3', '#8fe3ff', '#b6ff9e'];
  for (const span of spans) {
    ctx.strokeStyle = '#1c1030';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(span.x1, span.y1);
    ctx.quadraticCurveTo((span.x1 + span.x2) / 2, span.y1 + span.sag * 2, span.x2, span.y2);
    ctx.stroke();
    for (let i = 1; i < 9; i++) {
      const t = i / 9;
      const x = span.x1 + (span.x2 - span.x1) * t;
      const y = (1 - t) * (1 - t) * span.y1 + 2 * (1 - t) * t * (span.y1 + span.sag * 2) + t * t * span.y2;
      const glow = 0.75 + 0.25 * Math.sin(time * 2 + i * 1.7 + span.x1);
      ctx.save();
      ctx.globalAlpha = glow;
      circle(ctx, x, y + 5, 5, colors[i % colors.length]);
      ctx.restore();
    }
  }
}

function drawFruitStall(ctx, variant) {
  // Awning: red and cream stripes.
  for (let i = 0; i < 8; i++) {
    rect(ctx, 30 + i * 20, 168, 20, 26, i % 2 === 0 ? '#c93a4e' : '#ffe8c2');
  }
  poly(ctx, [[30, 194], [190, 194], [182, 210], [38, 210]], '#8f2436');
  line(ctx, 34, 210, 34, 300, '#5a3a22', 6);
  line(ctx, 186, 210, 186, 300, '#5a3a22', 6);
  // Counter and crates.
  roundRect(ctx, 28, 288, 168, 52, 6, '#7a4a26');
  roundRect(ctx, 28, 288, 168, 10, 4, '#9c6236');
  roundRect(ctx, 44, 250, 54, 40, 4, '#a9713d');
  roundRect(ctx, 128, 250, 54, 40, 4, '#a9713d');
  // Basket of round fruit: oranges in the original, green apples in the changed panel.
  const fruitColor = variant === 0 ? '#ff8c1a' : '#7ec850';
  const fruitTop = variant === 0 ? '#ffb347' : '#a4e07a';
  for (const [fx, fy] of [[100, 246], [114, 240], [128, 246], [107, 254], [121, 254]]) {
    circle(ctx, fx, fy, 8, fruitColor);
    circle(ctx, fx - 2, fy - 2, 3, fruitTop);
  }
  // Hanging lantern under the awning: red in the original, teal in the changed panel.
  const lanternColor = variant === 0 ? '#ff3b30' : '#2ec4b6';
  const lanternGlow = variant === 0 ? '#ff7a6b' : '#7ae8dc';
  line(ctx, 122, 194, 122, 140, '#2c1c10', 2);
  ellipse(ctx, 122, 158, 14, 17, lanternColor);
  ellipse(ctx, 122, 158, 7, 12, lanternGlow);
  rect(ctx, 116, 140, 12, 5, '#ffd97a');
  rect(ctx, 116, 174, 12, 5, '#ffd97a');
  // Small price sign.
  roundRect(ctx, 150, 222, 34, 20, 3, '#fff3d6');
  text(ctx, '5k', 167, 232, 12, '#7a2c1e');
}

function drawSatayStall(ctx, variant) {
  for (let i = 0; i < 8; i++) {
    rect(ctx, 362 + i * 21, 168, 21, 26, i % 2 === 0 ? '#2f7d5c' : '#ffe8c2');
  }
  poly(ctx, [[362, 194], [530, 194], [522, 210], [370, 210]], '#1d5240');
  line(ctx, 366, 210, 366, 300, '#5a3a22', 6);
  line(ctx, 526, 210, 526, 300, '#5a3a22', 6);
  roundRect(ctx, 360, 288, 172, 52, 6, '#7a4a26');
  roundRect(ctx, 360, 288, 172, 10, 4, '#9c6236');
  // Hanging sign: SATE in the original, SOTO in the changed panel.
  roundRect(ctx, 392, 196, 72, 26, 5, '#2c1c10');
  text(ctx, variant === 0 ? 'SATE' : 'SOTO', 428, 209, 16, '#ffd97a');
  // Grill with skewers and smoke.
  roundRect(ctx, 392, 252, 80, 24, 4, '#3a3a3a');
  for (let i = 0; i < 5; i++) {
    line(ctx, 398 + i * 14, 252, 398 + i * 14, 240, '#c9a86a', 2);
    circle(ctx, 398 + i * 14, 238, 3.5, '#d97b2f');
  }
  ellipse(ctx, 420, 228, 16, 6, 'rgba(255,255,255,0.18)');
  // Jars of sauce.
  roundRect(ctx, 486, 252, 18, 30, 4, '#e8b13c');
  roundRect(ctx, 508, 252, 18, 30, 4, '#c93a4e');
}

function drawMarketCart(ctx, variant, time) {
  // Umbrella over the cart.
  const sway = Math.sin(time * 0.8) * 2;
  poly(ctx, [[220, 196], [340, 196], [280, 148]], '#c93a4e');
  poly(ctx, [[240, 196], [280, 148], [280, 196]], '#ffe8c2');
  poly(ctx, [[280, 148], [320, 196], [280, 196]], '#ffe8c2');
  line(ctx, 280, 196, 280, 268, '#5a3a22', 5);
  // Cart body and wheels.
  roundRect(ctx, 224, 268, 112, 46, 6, '#8a5a2e');
  roundRect(ctx, 224, 268, 112, 10, 4, '#b07a42');
  circle(ctx, 246, 322, 13, '#2c1c10');
  circle(ctx, 246, 322, 6, '#c9a86a');
  circle(ctx, 314, 322, 13, '#2c1c10');
  circle(ctx, 314, 322, 6, '#c9a86a');
  // Steaming pots.
  ellipse(ctx, 250, 268, 18, 8, '#3a3a3a');
  ellipse(ctx, 292, 268, 18, 8, '#3a3a3a');
  ellipse(ctx, 250, 260, 12, 5, 'rgba(255,255,255,0.25)');
  ellipse(ctx, 292, 260, 12, 5, 'rgba(255,255,255,0.25)');
  // Balloon bunch: three in the original, two in the changed panel.
  const balloons = variant === 0
    ? [[284, 100, '#ff5d73'], [300, 88, '#ffd93d'], [316, 102, '#4ecdc4']]
    : [[284, 100, '#ff5d73'], [316, 102, '#4ecdc4']];
  for (const [bx, by, bc] of balloons) {
    line(ctx, bx, by + 14, 300, 196, '#e8e0d0', 1.5);
    ellipse(ctx, bx + sway, by, 11, 14, bc);
    ellipse(ctx, bx + sway - 3, by - 4, 4, 5, 'rgba(255,255,255,0.55)');
  }
}

function drawMarketCat(ctx, variant) {
  // Crate the cat sits on.
  roundRect(ctx, 196, 316, 40, 26, 3, '#a9713d');
  line(ctx, 196, 329, 236, 329, '#7a4a26', 2);
  if (variant === 1) return; // The cat vanished in the changed panel.
  // Sitting orange tabby cat, tail curled — bright enough to read at a glance.
  const fur = '#e8823a';
  const stripe = '#b45f22';
  ellipse(ctx, 216, 312, 11, 14, fur);
  circle(ctx, 216, 294, 9, fur);
  poly(ctx, [[209, 288], [212, 278], [216, 286]], fur);
  poly(ctx, [[221, 288], [224, 278], [219, 287]], fur);
  line(ctx, 211, 306, 221, 306, stripe, 2);
  line(ctx, 211, 311, 221, 311, stripe, 2);
  circle(ctx, 213, 294, 2, '#2b2b3a');
  circle(ctx, 219, 294, 2, '#2b2b3a');
  ctx.strokeStyle = fur;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(228, 318, 9, -0.6, 1.4);
  ctx.stroke();
}

function drawBicycle(ctx, variant) {
  const wheel = (x, y) => {
    ctx.strokeStyle = '#e8e0d0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      line(ctx, x, y, x + Math.cos(a) * 19, y + Math.sin(a) * 19, '#e8e0d0', 1);
    }
    circle(ctx, x, y, 3, '#ffd97a');
  };
  wheel(452, 326);
  wheel(508, 326);
  line(ctx, 452, 326, 478, 296, '#ff5d73', 4);
  line(ctx, 508, 326, 478, 296, '#ff5d73', 4);
  line(ctx, 478, 296, 470, 288, '#ff5d73', 4);
  line(ctx, 470, 288, 494, 288, '#e8e0d0', 4);
  line(ctx, 478, 296, 500, 310, '#ff5d73', 4);
  // Front basket: only in the changed panel.
  if (variant === 1) {
    roundRect(ctx, 486, 296, 22, 16, 3, '#a9713d');
    line(ctx, 486, 302, 508, 302, '#7a4a26', 2);
    circle(ctx, 494, 294, 4, '#ff8c1a');
    circle(ctx, 501, 294, 4, '#ff5d73');
  }
}

export function drawNightMarket(ctx, variant, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#241145');
  sky.addColorStop(0.5, '#5b2a68');
  sky.addColorStop(0.78, '#c65a6b');
  sky.addColorStop(1, '#3a1c3f');
  rect(ctx, 0, 0, 560, 420, sky);
  for (let i = 0; i < MARKET_STARS.length; i++) {
    const [sx, sy] = MARKET_STARS[i];
    star(ctx, sx, sy, 4, '#fff3c4', 0.5 + 0.4 * Math.sin(time * 1.5 + i));
  }
  // Extra star, only in the changed panel.
  if (variant === 1) star(ctx, 252, 56, 5, '#fff3c4', 0.95);
  // Crescent moon: opens to the right in the original, flipped in the changed
  // panel. Drawn as one even-odd path so no background-coloured overlay shows.
  const moonOff = variant === 0 ? 9 : -9;
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(470, 62, 24, 0, Math.PI * 2);
  ctx.arc(470 + moonOff, 56, 20, 0, Math.PI * 2, true);
  ctx.fill('evenodd');
  // Distant rooftops.
  poly(ctx, [[0, 300], [70, 250], [140, 300]], '#1c1030');
  poly(ctx, [[380, 300], [470, 240], [560, 300]], '#1c1030');
  rect(ctx, 0, 300, 560, 120, '#2e1c40');
  for (let i = 0; i < 12; i++) {
    ellipse(ctx, 30 + i * 48, 360 + (i % 3) * 18, 20, 7, 'rgba(255,255,255,0.05)');
  }
  drawStringLights(ctx, time);
  // Arch sign.
  roundRect(ctx, 200, 14, 160, 34, 8, '#2c1c10');
  text(ctx, 'PASAR SENJA', 280, 31, 17, '#ffd97a');
  drawFruitStall(ctx, variant);
  drawSatayStall(ctx, variant);
  drawMarketCart(ctx, variant, time);
  drawMarketCat(ctx, variant);
  drawBicycle(ctx, variant);
  // Foreground lanterns on the ground.
  ellipse(ctx, 60, 372, 12, 14, '#ff8c1a');
  ellipse(ctx, 60, 372, 6, 9, '#ffd97a');
  ellipse(ctx, 520, 388, 12, 14, '#ff5d73');
  ellipse(ctx, 520, 388, 6, 9, '#ffb3bd');
}

// ---------------------------------------------------------------- coral garden

const GARDEN_FISH = [
  { x: 330, y: 120, s: 1.1, c: '#ff9f1c' },
  { x: 420, y: 90, s: 0.8, c: '#ff6b9d' },
  { x: 240, y: 200, s: 0.9, c: '#ffd93d' },
  { x: 60, y: 120, s: 0.7, c: '#4ecdc4' },
];

function drawFish(ctx, x, y, s, color, facing) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * s, s);
  ellipse(ctx, 0, 0, 22, 11, color);
  poly(ctx, [[-18, 0], [-30, -9], [-30, 9]], color);
  circle(ctx, 9, -3, 2.5, '#12233a');
  ctx.restore();
}

function drawCoralBranch(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  const branch = (x0, y0, ang, len, w) => {
    const x1 = x0 + Math.cos(ang) * len;
    const y1 = y0 + Math.sin(ang) * len;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    return [x1, y1];
  };
  const [tx, ty] = branch(x, y, -Math.PI / 2, 34 * s, 7 * s);
  branch(tx, ty, -Math.PI / 2 - 0.7, 22 * s, 5 * s);
  branch(tx, ty, -Math.PI / 2 + 0.7, 22 * s, 5 * s);
  branch(x, y - 12 * s, -Math.PI / 2 - 1.1, 16 * s, 4 * s);
  branch(x, y - 12 * s, -Math.PI / 2 + 1.1, 16 * s, 4 * s);
  circle(ctx, tx, ty - 4 * s, 5 * s, color);
}

function drawSeaweed(ctx, x, baseY, h, color, time, phase) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  for (let i = 1; i <= 6; i++) {
    const t = i / 6;
    const sway = Math.sin(time * 1.2 + phase + t * 2) * 8 * t;
    ctx.lineTo(x + sway, baseY - h * t);
  }
  ctx.stroke();
}

function drawStarfish(ctx, x, y, s, color) {
  star(ctx, x, y, 14 * s, color, 1);
  circle(ctx, x, y, 4 * s, color);
}

export function drawCoralGarden(ctx, variant, time) {
  const water = ctx.createLinearGradient(0, 0, 0, 420);
  water.addColorStop(0, '#0b4a73');
  water.addColorStop(0.55, '#0e6b7a');
  water.addColorStop(1, '#0a4a5e');
  rect(ctx, 0, 0, 560, 420, water);
  // Shafts of light: three in the original, the middle one missing in the changed panel.
  const rays = variant === 0 ? [120, 205, 300] : [120, 300];
  for (const rx of rays) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    poly(ctx, [[rx, 0], [rx + 46, 0], [rx + 90, 420], [rx + 20, 420]], '#bfefff');
    ctx.restore();
  }
  // Sand.
  ellipse(ctx, 280, 440, 340, 90, '#e8d29a');
  rect(ctx, 0, 380, 560, 40, '#e8d29a');
  for (let i = 0; i < 14; i++) {
    ellipse(ctx, 20 + i * 40, 392 + (i % 3) * 9, 8, 3, 'rgba(120,90,40,0.35)');
  }
  // Seaweed: the frond at x 352 is missing in the changed panel.
  const fronds = variant === 0
    ? [[40, 150], [130, 120], [352, 140], [520, 160]]
    : [[40, 150], [130, 120], [520, 160]];
  fronds.forEach(([fx, fh], i) => drawSeaweed(ctx, fx, 385, fh, i % 2 ? '#2e9e6b' : '#37b06f', time, i * 1.3));
  // Corals. The big pink coral at 252 turns purple in the changed panel.
  drawCoralBranch(ctx, 252, 360, 1.25, variant === 0 ? '#ff7b9c' : '#9b7bff');
  drawCoralBranch(ctx, 200, 372, 0.9, '#ff9f1c');
  drawCoralBranch(ctx, 90, 368, 1.0, '#ff6b35');
  drawCoralBranch(ctx, 480, 300, 0.8, '#ff7b9c');
  drawCoralBranch(ctx, 540, 360, 1.1, '#c86bff');
  // Anemone.
  for (let i = 0; i < 7; i++) {
    const ax = 330 + (i - 3) * 7;
    line(ctx, ax, 380, ax + (i - 3) * 3, 352, '#ff8fa3', 4);
    circle(ctx, ax + (i - 3) * 3, 350, 4, '#ffd93d');
  }
  // Fish. The one at 152 turns blue in the changed panel.
  drawFish(ctx, 152, 148, 1.0, variant === 0 ? '#ff9f1c' : '#4e9bff', 1);
  for (const f of GARDEN_FISH) drawFish(ctx, f.x, f.y, f.s, f.c, -1);
  // Seahorse: faces right in the original, left in the changed panel.
  ctx.save();
  ctx.translate(92, 258);
  ctx.scale(variant === 0 ? 1 : -1, 1);
  ctx.strokeStyle = '#ffb347';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, 26);
  ctx.quadraticCurveTo(-12, 10, 0, 0);
  ctx.quadraticCurveTo(8, -8, 14, -12);
  ctx.stroke();
  // Curled tail and dorsal fin so the seahorse reads at a glance.
  ctx.beginPath();
  ctx.arc(-4, 28, 6, 0.4, Math.PI * 1.5);
  ctx.stroke();
  poly(ctx, [[-10, 2], [-18, -4], [-8, -8]], '#ff9f1c');
  circle(ctx, 16, -14, 7, '#ffb347');
  poly(ctx, [[20, -20], [26, -16], [20, -13]], '#ffb347');
  circle(ctx, 18, -16, 2, '#12233a');
  ctx.restore();
  // Turtle: gone in the changed panel.
  if (variant === 0) {
    ellipse(ctx, 420, 296, 30, 20, '#3aa655');
    ellipse(ctx, 420, 296, 22, 13, '#7ec850');
    circle(ctx, 452, 290, 9, '#3aa655');
    circle(ctx, 455, 288, 2, '#12233a');
    ellipse(ctx, 398, 282, 12, 6, '#3aa655');
    ellipse(ctx, 398, 312, 12, 6, '#3aa655');
    ellipse(ctx, 444, 312, 10, 5, '#3aa655');
  }
  // Treasure chest: closed in the original, open with gold in the changed panel.
  roundRect(ctx, 448, 332, 68, 34, 5, '#7a4a26');
  if (variant === 0) {
    roundRect(ctx, 448, 318, 68, 18, 8, '#9c6236');
    rect(ctx, 478, 318, 8, 48, '#ffd93d');
  } else {
    ctx.save();
    ctx.translate(448, 332);
    ctx.rotate(-0.7);
    roundRect(ctx, 0, -16, 68, 16, 6, '#9c6236');
    ctx.restore();
    for (const [gx, gy] of [[462, 330], [478, 326], [494, 330], [470, 336], [486, 336]]) {
      circle(ctx, gx, gy, 5, '#ffd93d');
    }
  }
  // Bubbles above the chest: only in the original.
  if (variant === 0) {
    for (const [bx, by, br] of [[462, 252, 4], [472, 236, 6], [480, 218, 3], [468, 200, 5]]) {
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // Starfish: two in the original, three in the changed panel.
  drawStarfish(ctx, 60, 386, 1, '#ff8c42');
  drawStarfish(ctx, 380, 396, 0.8, '#ff6b9d');
  if (variant === 1) drawStarfish(ctx, 300, 372, 0.9, '#ff8c42');
  // Shell: only in the changed panel.
  if (variant === 1) {
    ellipse(ctx, 182, 382, 12, 8, '#ffb3d9');
    for (let i = -2; i <= 2; i++) line(ctx, 182, 382, 182 + i * 5, 374, '#e58bb8', 1.5);
  }
  // Rising bubbles, common to both panels.
  for (const [bx, by, br] of [[120, 90, 3], [132, 60, 5], [300, 150, 4], [540, 120, 3]]) {
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bx, by - ((time * 12 + bx) % 40), br, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- rainbow village

function drawHouse(ctx, x, y, w, h, body, roof, litWindows, darkWindow) {
  rect(ctx, x, y, w, h, body);
  poly(ctx, [[x - 8, y], [x + w / 2, y - 30], [x + w + 8, y]], roof);
  rect(ctx, x + w / 2 - 9, y + h - 30, 18, 30, '#5a3a22');
  for (const [wx, wy] of litWindows) {
    const dark = darkWindow && darkWindow[0] === wx && darkWindow[1] === wy;
    rect(ctx, wx, wy, 16, 16, dark ? '#2b2350' : '#ffe9a8');
    line(ctx, wx + 8, wy, wx + 8, wy + 16, body, 2);
    line(ctx, wx, wy + 8, wx + 16, wy + 8, body, 2);
  }
}

function drawBird(ctx, x, y, s) {
  ctx.strokeStyle = '#2b2350';
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 6 * s, y, 6 * s, Math.PI * 1.15, Math.PI * 1.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 6 * s, y, 6 * s, Math.PI * 1.05, Math.PI * 1.85);
  ctx.stroke();
}

function drawCloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,240,220,0.92)';
  ctx.beginPath();
  ctx.arc(x, y, 14 * s, 0, Math.PI * 2);
  ctx.arc(x + 16 * s, y - 5 * s, 12 * s, 0, Math.PI * 2);
  ctx.arc(x + 30 * s, y, 13 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function drawRainbowVillage(ctx, variant, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#2e2160');
  sky.addColorStop(0.55, '#8a4a7d');
  sky.addColorStop(0.8, '#e08a5c');
  sky.addColorStop(1, '#3f6b4f');
  rect(ctx, 0, 0, 560, 420, sky);
  // Sun: plain in the original, smiling in the changed panel.
  circle(ctx, 92, 72, 30, '#ffd93d');
  circle(ctx, 92, 72, 24, '#ffec8b');
  if (variant === 1) {
    circle(ctx, 84, 68, 3, '#7a4d08');
    circle(ctx, 100, 68, 3, '#7a4d08');
    ctx.strokeStyle = '#7a4d08';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(92, 74, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  // Rainbow: six bands in the original, five in the changed panel (green missing).
  const bands = variant === 0
    ? ['#ff5d73', '#ff9f1c', '#ffd93d', '#3ddc97', '#4e9bff', '#9b7bff']
    : ['#ff5d73', '#ff9f1c', '#ffd93d', '#4e9bff', '#9b7bff'];
  ctx.lineWidth = 11;
  bands.forEach((color, i) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(280, 430, 330 - i * 11, Math.PI, Math.PI * 2);
    ctx.stroke();
  });
  // Clouds: one extra drifts in for the changed panel.
  drawCloud(ctx, 150, 52, 0.9);
  drawCloud(ctx, 330, 36, 0.7);
  if (variant === 1) drawCloud(ctx, 420, 48, 0.9);
  // Birds: three in the original, two in the changed panel.
  const birds = variant === 0 ? [[330, 58], [352, 48], [376, 60]] : [[330, 58], [376, 60]];
  for (const [bx, by] of birds) drawBird(ctx, bx + Math.sin(time * 0.5 + bx) * 3, by, 1);
  // Hills.
  ellipse(ctx, 120, 420, 260, 120, '#4a8f5c');
  ellipse(ctx, 460, 430, 280, 130, '#3a7a4c');
  ellipse(ctx, 280, 470, 340, 110, '#5da86e');
  // Houses. The window at (202, 258) goes dark in the changed panel.
  drawHouse(ctx, 180, 240, 70, 62, '#e8b13c', '#c93a4e', [[194, 252], [222, 252]], variant === 1 ? [194, 252] : null);
  drawHouse(ctx, 300, 252, 62, 56, '#7ec8e3', '#2f7d5c', [[312, 262], [336, 262]], null);
  drawHouse(ctx, 60, 268, 56, 50, '#ffb3d9', '#7a4d8f', [[72, 278]], null);
  // Windmill: four blades in the original, three in the changed panel.
  rect(ctx, 462, 190, 22, 90, '#e8dcc8');
  poly(ctx, [[458, 190], [473, 168], [488, 190]], '#c93a4e');
  circle(ctx, 473, 148, 7, '#2b2350');
  const bladeCount = variant === 0 ? 4 : 3;
  for (let i = 0; i < bladeCount; i++) {
    const a = (Math.PI * 2 * i) / 4 + time * 0.15;
    ctx.save();
    ctx.translate(473, 148);
    ctx.rotate(a);
    poly(ctx, [[0, -6], [34, -2], [34, 6], [0, 6]], '#fff3d6');
    ctx.restore();
  }
  // Laundry line: three shirts in the original, two in the changed panel.
  line(ctx, 268, 208, 340, 200, '#e8e0d0', 2);
  line(ctx, 268, 208, 268, 240, '#5a3a22', 3);
  line(ctx, 340, 200, 340, 240, '#5a3a22', 3);
  const shirts = variant === 0
    ? [[280, 206, '#ff5d73'], [302, 204, '#4e9bff'], [324, 202, '#ffd93d']]
    : [[280, 206, '#ff5d73'], [324, 202, '#ffd93d']];
  for (const [sx, sy, sc] of shirts) {
    rect(ctx, sx, sy, 16, 18, sc);
    rect(ctx, sx - 3, sy, 4, 8, sc);
    rect(ctx, sx + 15, sy, 4, 8, sc);
  }
  // Tree: green in the original, autumn orange in the changed panel.
  rect(ctx, 116, 320, 12, 34, '#5a3a22');
  const leafColor = variant === 0 ? '#2e9e6b' : '#e07b39';
  circle(ctx, 122, 302, 24, leafColor);
  circle(ctx, 104, 312, 16, leafColor);
  circle(ctx, 140, 312, 16, leafColor);
  circle(ctx, 122, 296, 10, variant === 0 ? '#4ecb8f' : '#f09a4d');
  rect(ctx, 40, 330, 9, 26, '#5a3a22');
  circle(ctx, 44, 322, 16, '#2e9e6b');
  // Well: the bucket is missing in the changed panel.
  rect(ctx, 136, 330, 32, 24, '#9c8a7a');
  ellipse(ctx, 152, 330, 18, 6, '#7a6a5a');
  line(ctx, 136, 330, 136, 306, '#5a3a22', 3);
  line(ctx, 168, 330, 168, 306, '#5a3a22', 3);
  poly(ctx, [[132, 306], [152, 292], [172, 306]], '#c93a4e');
  if (variant === 0) {
    line(ctx, 152, 306, 152, 322, '#e8e0d0', 2);
    roundRect(ctx, 146, 322, 12, 10, 2, '#a9713d');
  }
  // Dog: gone in the changed panel.
  if (variant === 0) {
    ellipse(ctx, 322, 352, 16, 9, '#c98a4b');
    circle(ctx, 336, 344, 8, '#c98a4b');
    poly(ctx, [[332, 338], [334, 330], [338, 337]], '#a9713d');
    circle(ctx, 338, 343, 1.8, '#2b2350');
    line(ctx, 308, 348, 302, 340, '#c98a4b', 4);
    line(ctx, 314, 360, 314, 368, '#a9713d', 3);
    line(ctx, 330, 360, 330, 368, '#a9713d', 3);
  }
  // Flower field. The tulip at 242 turns yellow in the changed panel.
  const flowers = [
    [60, 380, '#ff5d73'], [100, 396, '#ffd93d'], [150, 386, '#ff8fa3'], [200, 398, '#9b7bff'],
    [242, 382, variant === 0 ? '#ff3b30' : '#ffd93d'], [280, 394, '#ff8fa3'], [330, 386, '#ff5d73'],
    [380, 398, '#ffd93d'], [430, 388, '#9b7bff'], [480, 396, '#ff8fa3'], [520, 382, '#ff5d73'],
  ];
  for (const [fx, fy, fc] of flowers) {
    line(ctx, fx, fy, fx, fy - 12, '#2e9e6b', 2);
    for (let p = 0; p < 5; p++) {
      const a = (Math.PI * 2 * p) / 5;
      circle(ctx, fx + Math.cos(a) * 4, fy - 14 + Math.sin(a) * 4, 3.5, fc);
    }
    circle(ctx, fx, fy - 14, 3, '#ffd93d');
  }
  // Stepping-stone path: the stone at 282 is missing in the changed panel.
  const stones = variant === 0
    ? [[250, 368], [282, 402], [310, 372], [340, 404]]
    : [[250, 368], [310, 372], [340, 404]];
  for (const [sx, sy] of stones) ellipse(ctx, sx, sy, 14, 7, '#d8cdb8');
}

// ---------------------------------------------------------------- scene lookup

export const SCENE_DRAWERS = {
  1: drawNightMarket,
  2: drawCoralGarden,
  3: drawRainbowVillage,
};

export function drawScene(ctx, levelId, variant, time) {
  const drawer = SCENE_DRAWERS[levelId] ?? drawNightMarket;
  drawer(ctx, variant, time);
}
