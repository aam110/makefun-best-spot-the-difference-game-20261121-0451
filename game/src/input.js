// Mouse and keyboard input: canvas clicks mapped to scene coordinates,
// and the game's keyboard shortcuts.

import { PANEL_WIDTH, PANEL_HEIGHT } from './levels.js';

// Convert a mouse event on a panel canvas into scene coordinates.
export function canvasScenePoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = PANEL_WIDTH / rect.width;
  const scaleY = PANEL_HEIGHT / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

export function bindPanelClicks(leftCanvas, rightCanvas, onSceneClick) {
  const handler = (event) => {
    const point = canvasScenePoint(event.currentTarget, event);
    onSceneClick(point.x, point.y);
  };
  leftCanvas.addEventListener('click', handler);
  rightCanvas.addEventListener('click', handler);
}

// One keyboard map for the whole game. The handler receives the normalized key.
export function bindKeyboard(onKey) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    onKey(key, event);
  });
}
