export const XP_PER_LEVEL = 100;
export const MAX_LEVEL    = 100;

// [level_threshold, rank_name] sorted descending so first match wins
export const RANK_MILESTONES: [number, string][] = [
  [100, 'Living Paradox'],
  [90,  'Multiverse Legend'],
  [80,  'Mythic Ascendant'],
  [70,  'Elder Planeswalker'],
  [60,  'Archmage of the Multiverse'],
  [50,  'Commander Sovereign'],
  [40,  'Planeswalker Adept'],
  [30,  'Battlemage'],
  [20,  'Spark Touched'],
  [15,  'Guild Adept'],
  [10,  'Spell Apprentice'],
  [5,   'Initiate of Mana'],
  [1,   'Noob'],
];

export function getLevel(totalXp: number): number {
  return Math.min(MAX_LEVEL, Math.floor(totalXp / XP_PER_LEVEL) + 1);
}

export function getRank(level: number): string {
  for (const [threshold, rank] of RANK_MILESTONES) {
    if (level >= threshold) return rank;
  }
  return 'Noob';
}

export function getXpInCurrentLevel(totalXp: number): number {
  if (getLevel(totalXp) >= MAX_LEVEL) return XP_PER_LEVEL;
  return totalXp % XP_PER_LEVEL;
}

/** Returns the rank name if this exact level IS a milestone, otherwise null. */
export function rankAtMilestone(level: number): string | null {
  const found = RANK_MILESTONES.find(([t]) => t === level);
  return found ? found[1] : null;
}
