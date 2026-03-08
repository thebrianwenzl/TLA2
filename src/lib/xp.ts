export const XP_PER_EXERCISE = {
  flashcard:  5,
  mcq:        10,
  fill_blank: 15,
  matching:   10, // per matched pair
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000,
];

export function getLevel(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function xpToNextLevel(xp: number) {
  const level = getLevel(xp);
  const floor = LEVEL_THRESHOLDS[level - 1];
  const ceil  = LEVEL_THRESHOLDS[level] ?? floor + 1500;
  return { current: xp - floor, needed: ceil - floor, level };
}
