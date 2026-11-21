// Screenshot staging: the ?shot= query parameter stages a real frame of the
// game's own code — a mid-game state, the title screen or a win screen —
// with the timer frozen so the capture is stable.

export const SHOT_MODES = ['cover', 'start', 'level2', 'win'];

export function shotModeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  return SHOT_MODES.includes(shot) ? shot : null;
}

// Each staged state: which level, which differences are already marked,
// and how much time is left on the clock.
export function shotPlan(mode) {
  if (mode === 'cover') {
    return { screen: 'playing', levelId: 1, found: [1, 2, 4], timeLeft: 128, frozen: true };
  }
  if (mode === 'level2') {
    return { screen: 'playing', levelId: 2, found: [0, 1, 3, 5], timeLeft: 96, frozen: true };
  }
  if (mode === 'win') {
    return { screen: 'win', levelId: 1, found: [0, 1, 2, 3, 4, 5, 6, 7], timeLeft: 74, frozen: true };
  }
  if (mode === 'start') {
    return { screen: 'menu', levelId: 1, found: [], timeLeft: 180, frozen: true };
  }
  return null;
}
