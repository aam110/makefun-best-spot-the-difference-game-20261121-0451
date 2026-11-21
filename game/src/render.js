// Frame rendering: draws both panels, the found markers, the hint ring
// and the miss marks, every animation frame.

import { drawScene } from './scenes.js';
import { drawAllFoundMarkers, drawHintRing, drawMissMark } from './differences.js';

export function renderFrame(leftCtx, rightCtx, state, time) {
  const level = state.level;
  drawScene(leftCtx, level.id, 0, time);
  drawScene(rightCtx, level.id, 1, time);
  drawAllFoundMarkers(leftCtx, level, state.found, state.foundAt, time);
  drawAllFoundMarkers(rightCtx, level, state.found, state.foundAt, time);
  if (state.hintIndex >= 0 && time - state.hintStartedAt < 2.2) {
    const diff = level.differences[state.hintIndex];
    drawHintRing(leftCtx, diff, time);
    drawHintRing(rightCtx, diff, time);
  }
  for (const miss of state.misses) {
    const age = time - miss.at;
    if (age < 0.8) {
      drawMissMark(leftCtx, miss.x, miss.y, age);
      drawMissMark(rightCtx, miss.x, miss.y, age);
    }
  }
  state.misses = state.misses.filter((miss) => time - miss.at < 0.8);
}
