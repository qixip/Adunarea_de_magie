export interface UserXpData {
  totalXp:          number;
  lastSeenXp:       number;
  xpSinceLastVisit: number;
  level:            number;
  rank:             string;
  xpInCurrentLevel: number;
  xpPerLevel:       number;
  isMaxLevel:       boolean;
}
