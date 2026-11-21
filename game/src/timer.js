// The level countdown timer: drains in real time, pauses between screens,
// and charges a time penalty on wrong clicks.

export function createTimer(limitSeconds) {
  return {
    limit: limitSeconds,
    remaining: limitSeconds,
    running: false,
    lastTick: 0,
  };
}

export function startTimer(timer, now) {
  timer.running = true;
  timer.lastTick = now;
}

export function pauseTimer(timer) {
  timer.running = false;
}

export function resetTimer(timer, limitSeconds) {
  timer.limit = limitSeconds;
  timer.remaining = limitSeconds;
  timer.running = false;
  timer.lastTick = 0;
}

export function setTimerRemaining(timer, seconds) {
  timer.remaining = Math.max(0, Math.min(timer.limit, seconds));
}

// Advance the timer to `now` (seconds, monotonic). Returns true when time ran out.
export function tickTimer(timer, now) {
  if (!timer.running) return false;
  const dt = now - timer.lastTick;
  timer.lastTick = now;
  if (dt > 0) timer.remaining -= dt;
  if (timer.remaining <= 0) {
    timer.remaining = 0;
    timer.running = false;
    return true;
  }
  return false;
}

export function penalizeTimer(timer, seconds) {
  timer.remaining = Math.max(0, timer.remaining - seconds);
}

export function timerFraction(timer) {
  return timer.limit > 0 ? timer.remaining / timer.limit : 0;
}

export function isTimerLow(timer) {
  return timer.remaining <= 30;
}
