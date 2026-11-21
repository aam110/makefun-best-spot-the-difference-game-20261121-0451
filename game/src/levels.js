// Level definitions: names, time limits and every hidden difference.
// Coordinates are in scene space (560 x 420), shared by both panels.

export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 420;

export const LEVELS = [
  {
    id: 1,
    name: 'Pasar Senja',
    subtitle: 'Night market',
    blurb: 'Lanterns, fruit stalls and a sleepy cat. Eight things changed between the two pictures.',
    timeLimit: 180,
    hints: 3,
    differences: [
      { x: 470, y: 62, r: 26, label: 'the flipped crescent moon' },
      { x: 122, y: 158, r: 20, label: 'the lantern that changed colour' },
      { x: 214, y: 318, r: 24, label: 'the cat that vanished' },
      { x: 298, y: 112, r: 24, label: 'the missing balloon' },
      { x: 428, y: 208, r: 30, label: 'the stall sign with a new letter' },
      { x: 112, y: 252, r: 24, label: 'the fruit that changed colour' },
      { x: 252, y: 56, r: 14, label: 'the extra star' },
      { x: 478, y: 306, r: 24, label: 'the basket that appeared on the bicycle' },
    ],
  },
  {
    id: 2,
    name: 'Taman Karang',
    subtitle: 'Coral garden',
    blurb: 'Ten secrets hide under the waves: a shy turtle, a treasure chest and fish that swap colours.',
    timeLimit: 150,
    hints: 3,
    differences: [
      { x: 420, y: 296, r: 30, label: 'the turtle that swam away' },
      { x: 152, y: 148, r: 24, label: 'the fish that changed colour' },
      { x: 300, y: 372, r: 20, label: 'the extra starfish' },
      { x: 482, y: 332, r: 28, label: 'the treasure chest that opened' },
      { x: 92, y: 258, r: 22, label: 'the seahorse facing the other way' },
      { x: 252, y: 302, r: 24, label: 'the coral that changed colour' },
      { x: 470, y: 238, r: 20, label: 'the missing bubbles' },
      { x: 182, y: 382, r: 18, label: 'the shell that appeared' },
      { x: 352, y: 282, r: 20, label: 'the missing seaweed frond' },
      { x: 205, y: 62, r: 22, label: 'the missing shaft of light' },
    ],
  },
  {
    id: 3,
    name: 'Bukit Pelangi',
    subtitle: 'Rainbow hillside village',
    blurb: 'Twelve differences across the rainbow village — the windmill, the washing line and one very sneaky sun.',
    timeLimit: 120,
    hints: 3,
    differences: [
      { x: 280, y: 88, r: 30, label: 'the rainbow band that vanished' },
      { x: 92, y: 72, r: 26, label: 'the sun that grew a smile' },
      { x: 472, y: 148, r: 28, label: 'the windmill blade that went missing' },
      { x: 202, y: 258, r: 18, label: 'the window that went dark' },
      { x: 352, y: 58, r: 20, label: 'the missing bird' },
      { x: 322, y: 352, r: 22, label: 'the dog that ran off' },
      { x: 122, y: 298, r: 26, label: 'the tree that turned autumn' },
      { x: 242, y: 382, r: 16, label: 'the tulip that changed colour' },
      { x: 432, y: 48, r: 22, label: 'the cloud that drifted in' },
      { x: 302, y: 218, r: 20, label: 'the shirt missing from the line' },
      { x: 152, y: 342, r: 20, label: 'the well bucket that vanished' },
      { x: 282, y: 402, r: 16, label: 'the missing stepping stone' },
    ],
  },
];

export function levelById(id) {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0];
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${String(rest).padStart(2, '0')}`;
}
