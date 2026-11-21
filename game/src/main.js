// Pasar Senja — spot the difference. Game state, screens, scoring and the
// animation loop. Boots from index.html as an ES module.

import { LEVELS, levelById, formatTime } from './levels.js';
import { renderFrame } from './render.js';
import { findDifferenceAt, randomUnfound } from './differences.js';
import { bindPanelClicks, bindKeyboard } from './input.js';
import { createTimer, startTimer, pauseTimer, resetTimer, setTimerRemaining, tickTimer, penalizeTimer, timerFraction, isTimerLow } from './timer.js';
import { playFind, playMiss, playWin, playFail, playHint, setSoundEnabled, isSoundEnabled } from './audio.js';
import { shotModeFromUrl, shotPlan } from './shots.js';

const POINTS_PER_FIND = 100;
const TIME_BONUS_PER_SECOND = 5;
const WRONG_CLICK_POINTS = 10;
const WRONG_CLICK_SECONDS = 3;
const HINT_COOLDOWN_SECONDS = 10;
const FROZEN_ANIMATION_TIME = 1.6;

const $ = (id) => document.getElementById(id);

const state = {
  screen: 'menu', // menu | playing | end
  level: LEVELS[0],
  found: new Set(),
  foundAt: {},
  misses: [],
  hintIndex: -1,
  hintStartedAt: 0,
  hintsLeft: 3,
  hintReadyAt: 0,
  score: 0,
  totalScore: 0,
  timer: createTimer(LEVELS[0].timeLimit),
  frozen: false,
  endKind: 'win', // win | fail | victory
  timeBonus: 0,
};

let leftCtx;
let rightCtx;
let clockStart = 0;

function nowSeconds() {
  return (performance.now() - clockStart) / 1000;
}

function animationTime() {
  return state.frozen ? FROZEN_ANIMATION_TIME : nowSeconds();
}

// ---------------------------------------------------------------- screens

function showScreen(name) {
  state.screen = name;
  $('menu-screen').classList.toggle('hidden', name !== 'menu');
  $('play-screen').classList.toggle('hidden', name !== 'playing');
  $('end-screen').classList.toggle('hidden', name !== 'end');
  // On the menu the counter, timer and hint button hide: they belong to a run.
  $('hud').classList.toggle('menu-mode', name === 'menu');
}

function showMenu() {
  pauseTimer(state.timer);
  showScreen('menu');
  updateHud();
}

function startLevel(levelId, keepScore) {
  const level = levelById(levelId);
  state.level = level;
  state.found = new Set();
  state.foundAt = {};
  state.misses = [];
  state.hintIndex = -1;
  state.hintsLeft = level.hints;
  state.hintReadyAt = 0;
  state.timeBonus = 0;
  if (!keepScore) state.score = 0;
  resetTimer(state.timer, level.timeLimit);
  $('level-name').textContent = `${level.name} — ${level.subtitle}`;
  $('message').textContent = `Find all ${level.differences.length} differences!`;
  $('message').className = '';
  showScreen('playing');
  if (!state.frozen) startTimer(state.timer, nowSeconds());
  updateHud();
}

function endLevel(kind) {
  pauseTimer(state.timer);
  state.endKind = kind;
  const level = state.level;
  if (kind === 'win' || kind === 'victory') {
    state.timeBonus = Math.round(state.timer.remaining) * TIME_BONUS_PER_SECOND;
    state.score += state.timeBonus;
    state.totalScore += state.score;
    playWin();
    $('end-title').textContent = kind === 'victory' ? 'You Found Them All!' : 'Level Complete!';
    $('end-detail').textContent = kind === 'victory'
      ? `All three worlds cleared — ${level.name} was the last.`
      : `${level.name} cleared: all ${level.differences.length} differences found.`;
    $('end-score').textContent = `Level score ${state.score} (time bonus +${state.timeBonus})  ·  Total ${state.totalScore}`;
    $('end-next').textContent = kind === 'victory' ? 'Play again (N)' : 'Next level (N)';
    $('end-next').disabled = false;
  } else {
    playFail();
    $('end-title').textContent = 'Time Ran Out';
    $('end-detail').textContent = `${level.name}: you found ${state.found.size} of ${level.differences.length} differences.`;
    $('end-score').textContent = `Score ${state.score} — try again and beat the clock.`;
    $('end-next').textContent = 'Next level (N)';
    $('end-next').disabled = true;
  }
  showScreen('end');
  updateHud();
}

// ---------------------------------------------------------------- HUD

function updateHud() {
  const level = state.level;
  const found = state.found.size;
  const remain = level.differences.length - found;
  $('counter').innerHTML = `${found}/${level.differences.length} found — <span class="remain">${remain} remain</span>`;
  $('score').textContent = `Score ${state.score}`;
  const bar = $('timer-bar');
  bar.style.width = `${Math.round(timerFraction(state.timer) * 100)}%`;
  bar.classList.toggle('low', isTimerLow(state.timer));
  $('timer-text').textContent = formatTime(state.timer.remaining);
  const hintBtn = $('hint-btn');
  const cooling = nowSeconds() < state.hintReadyAt;
  hintBtn.textContent = state.hintsLeft > 0
    ? (cooling ? `Hint (${Math.ceil(state.hintReadyAt - nowSeconds())}s)` : `Hint (${state.hintsLeft})`)
    : 'No hints';
  hintBtn.disabled = state.hintsLeft <= 0 || cooling || state.screen !== 'playing';
}

function flashMessage(text, kind) {
  const el = $('message');
  el.textContent = text;
  el.className = kind || '';
}

// ---------------------------------------------------------------- play actions

function onSceneClick(x, y) {
  if (state.screen !== 'playing') return;
  const level = state.level;
  const hit = findDifferenceAt(level, x, y, state.found);
  if (hit >= 0) {
    state.found.add(hit);
    state.foundAt[hit] = animationTime();
    state.score += POINTS_PER_FIND;
    playFind();
    const remain = level.differences.length - state.found.size;
    flashMessage(
      remain === 0
        ? `Found ${level.differences[hit].label}! That is all of them!`
        : `Found ${level.differences[hit].label}! ${remain} to go.`,
      'good',
    );
    updateHud();
    if (state.found.size === level.differences.length) {
      setTimeout(() => endLevel(level.id === 3 ? 'victory' : 'win'), 650);
    }
    return;
  }
  // Wrong click: a red X, points lost, seconds lost.
  state.misses.push({ x, y, at: animationTime() });
  state.score = Math.max(0, state.score - WRONG_CLICK_POINTS);
  penalizeTimer(state.timer, WRONG_CLICK_SECONDS);
  playMiss();
  flashMessage(`Not a difference — minus ${WRONG_CLICK_POINTS} points, minus ${WRONG_CLICK_SECONDS} seconds.`, 'bad');
  updateHud();
}

function useHint() {
  if (state.screen !== 'playing') return;
  if (state.hintsLeft <= 0) {
    flashMessage('No hints left for this level.', 'bad');
    return;
  }
  const t = nowSeconds();
  if (t < state.hintReadyAt) {
    flashMessage(`Hint is recharging — ${Math.ceil(state.hintReadyAt - t)}s left.`, 'bad');
    return;
  }
  const idx = randomUnfound(state.level, state.found);
  if (idx < 0) return;
  state.hintIndex = idx;
  state.hintStartedAt = animationTime();
  state.hintsLeft -= 1;
  state.hintReadyAt = t + HINT_COOLDOWN_SECONDS;
  playHint();
  flashMessage('A hint! Look inside the green ring.', 'good');
  updateHud();
  setTimeout(updateHud, 500);
}

function nextLevel() {
  const nextId = state.level.id >= 3 ? 1 : state.level.id + 1;
  startLevel(nextId, state.endKind === 'win');
}

function onKey(key) {
  if (key === 'Escape') {
    showMenu();
    return;
  }
  if (key === 'h') {
    useHint();
    return;
  }
  if (key === 'r') {
    if (state.screen === 'playing' || state.screen === 'end') startLevel(state.level.id, false);
    return;
  }
  if (key === 'n') {
    if (state.screen === 'end' && state.endKind !== 'fail') nextLevel();
    return;
  }
  if (key === '1' || key === '2' || key === '3') {
    startLevel(Number(key), false);
  }
}

// ---------------------------------------------------------------- menu

function buildLevelCards() {
  const wrap = $('level-cards');
  for (const level of LEVELS) {
    const card = document.createElement('div');
    card.className = 'level-card';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.innerHTML =
      `<div class="card-num">LEVEL ${level.id}</div>` +
      `<h2>${level.name}</h2>` +
      `<div class="card-scene">${level.blurb}</div>` +
      `<div class="card-meta">${level.differences.length} differences · ${formatTime(level.timeLimit)} · ${level.hints} hints</div>`;
    card.addEventListener('click', () => startLevel(level.id, false));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') startLevel(level.id, false);
    });
    wrap.appendChild(card);
  }
}

// ---------------------------------------------------------------- screenshot staging

function applyShotMode(mode) {
  const plan = shotPlan(mode);
  if (!plan) return;
  state.frozen = plan.frozen;
  if (plan.screen === 'menu') {
    showMenu();
    return;
  }
  startLevel(plan.levelId, false);
  state.frozen = true;
  pauseTimer(state.timer);
  setTimerRemaining(state.timer, plan.timeLeft);
  for (const i of plan.found) {
    state.found.add(i);
    state.foundAt[i] = -10; // settled markers, past the pop animation
  }
  state.score = plan.found.length * POINTS_PER_FIND;
  if (plan.screen === 'win') {
    state.endKind = 'win';
    state.timeBonus = Math.round(plan.timeLeft) * TIME_BONUS_PER_SECOND;
    state.score += state.timeBonus;
    state.totalScore = state.score;
    $('end-title').textContent = 'Level Complete!';
    $('end-detail').textContent = `${state.level.name} cleared: all ${state.level.differences.length} differences found.`;
    $('end-score').textContent = `Level score ${state.score} (time bonus +${state.timeBonus})  ·  Total ${state.totalScore}`;
    showScreen('end');
  } else {
    flashMessage(`Found ${plan.found.length} differences — keep hunting!`, 'good');
  }
  updateHud();
}

// ---------------------------------------------------------------- boot

function boot() {
  clockStart = performance.now();
  const leftCanvas = $('panel-left');
  const rightCanvas = $('panel-right');
  leftCtx = leftCanvas.getContext('2d');
  rightCtx = rightCanvas.getContext('2d');
  buildLevelCards();
  bindPanelClicks(leftCanvas, rightCanvas, onSceneClick);
  bindKeyboard(onKey);
  $('hint-btn').addEventListener('click', useHint);
  $('sound-btn').addEventListener('click', () => {
    setSoundEnabled(!isSoundEnabled());
    $('sound-btn').textContent = isSoundEnabled() ? 'Sound on' : 'Sound off';
  });
  $('end-next').addEventListener('click', () => {
    if (state.endKind !== 'fail') nextLevel();
  });
  $('end-retry').addEventListener('click', () => startLevel(state.level.id, false));
  $('end-menu').addEventListener('click', showMenu);

  const shot = shotModeFromUrl();
  if (shot) {
    applyShotMode(shot);
  } else {
    showMenu();
  }

  const loop = () => {
    if (state.screen === 'playing') {
      renderFrame(leftCtx, rightCtx, state, animationTime());
      if (!state.frozen && tickTimer(state.timer, nowSeconds())) {
        endLevel('fail');
      } else {
        updateHud();
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// A small handle for automated play-testing in the browser console.
window.PASAR = {
  state,
  startLevel,
  useHint,
  onSceneClick,
};

boot();
