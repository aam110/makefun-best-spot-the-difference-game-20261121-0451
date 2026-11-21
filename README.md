# Pasar Senja — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/aam110/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)
![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/aam110/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)

**Pasar Senja** ("Dusk Market") is an original spot-the-difference game built for the
[make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
Two pictures look the same. They are not. Hunt every hidden change before the clock runs out.

All art is drawn procedurally in code (Canvas 2D), all sounds are synthesized with
WebAudio oscillators, and the game runs fully offline from static files — no network
requests, no webfonts, no image or audio files.

## How to play

1. Open `game/index.html` in a desktop browser (or serve `game/` with any static server).
2. Pick a level from the menu — or press **1**, **2** or **3**.
3. Study the two pictures side by side. Click a difference in **either** picture to
   mark it on both with a golden ring.
4. Find them all before the timer bar empties.

## Levels

| Level | Scene | Differences | Time |
|------:|-------|:-----------:|-----:|
| 1 | Pasar Senja — night market | 8 | 3:00 |
| 2 | Taman Karang — coral garden | 10 | 2:30 |
| 3 | Bukit Pelangi — rainbow hillside village | 12 | 2:00 |

Differences hide by design: missing and added objects, colour swaps, flipped items,
changed letters on signs, moved animals.

## Controls

| Input | Action |
|-------|--------|
| Mouse click | Mark a difference (either panel) |
| **H** | Hint — pulses a green ring around one unfound difference (3 per level, 10 s cooldown) |
| **R** | Restart the current level |
| **N** | Next level (after a win) |
| **1 / 2 / 3** | Jump to a level |
| **Esc** | Back to the menu |

## Scoring

- **+100 points** per difference found.
- **Time bonus** of +5 points per second left when a level is cleared.
- **Wrong click**: −10 points and −3 seconds, with a brief red X where you clicked.

## Source layout

- `game/index.html` — page shell, HUD, screens.
- `game/style.css` — dusk-market theme.
- `game/src/main.js` — game state, screens, scoring, animation loop.
- `game/src/levels.js` — level definitions and every difference's position.
- `game/src/scenes.js` — procedural art for all three scenes, both variants.
- `game/src/differences.js` — hit-testing, found markers, hint ring, miss marks.
- `game/src/render.js` — per-frame drawing of both panels.
- `game/src/input.js` — mouse-to-scene mapping and keyboard shortcuts.
- `game/src/audio.js` — WebAudio chimes, thuds and fanfares.
- `game/src/timer.js` — the countdown timer and its penalties.
- `game/src/shots.js` — `?shot=` staging for screenshots (cover, start, level2, win).

## Screenshots

The four screenshots in `screenshots/` are real renders of this game's own code in
headless Chromium, staged with `?shot=cover`, `?shot=start`, `?shot=level2` and
`?shot=win`.

## License

MIT — see `LICENSE`.
