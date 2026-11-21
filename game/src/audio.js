// Sounds, synthesized with WebAudio oscillators only. No audio files.

let audioCtx = null;
let enabled = true;

export function setSoundEnabled(on) {
  enabled = on;
}

export function isSoundEnabled() {
  return enabled;
}

function ctx() {
  if (audioCtx === null) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, duration, type, volume) {
  const ac = ctx();
  if (!ac || !enabled) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ac.currentTime + start;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

// A bright two-note chime when a difference is found.
export function playFind() {
  tone(880, 0, 0.22, 'sine', 0.22);
  tone(1318.5, 0.09, 0.32, 'sine', 0.2);
}

// A soft low thud for a wrong click.
export function playMiss() {
  tone(160, 0, 0.18, 'triangle', 0.25);
  tone(110, 0.02, 0.2, 'sine', 0.2);
}

// A rising arpeggio for a completed level.
export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => tone(freq, i * 0.11, 0.4, 'sine', 0.2));
}

// A short descending phrase for a failed level.
export function playFail() {
  tone(392, 0, 0.25, 'triangle', 0.2);
  tone(311.1, 0.16, 0.3, 'triangle', 0.2);
  tone(233.1, 0.32, 0.45, 'triangle', 0.18);
}

// A gentle blip for a hint.
export function playHint() {
  tone(659.25, 0, 0.15, 'sine', 0.16);
  tone(987.77, 0.08, 0.2, 'sine', 0.14);
}
