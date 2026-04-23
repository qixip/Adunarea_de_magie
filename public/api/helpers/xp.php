<?php
const XP_PER_LEVEL    = 100;
const MAX_LEVEL       = 100;

const XP_BY_EVENT_TYPE = [
    'casual-commander' => 10,
    'board-game'       => 10,
    'cedh-showdown'    => 20,
    'cedh-league'      => 20,
    'pauper'           => 15,
    'pauper-prize'     => 20,
    'special-formats'  => 15,
    'open-market'      => 15,
];

// Sorted descending so first match wins
const RANK_MILESTONES = [
    100 => 'Living Paradox',
    90  => 'Multiverse Legend',
    80  => 'Mythic Ascendant',
    70  => 'Elder Planeswalker',
    60  => 'Archmage of the Multiverse',
    50  => 'Commander Sovereign',
    40  => 'Planeswalker Adept',
    30  => 'Battlemage',
    20  => 'Spark Touched',
    15  => 'Guild Adept',
    10  => 'Spell Apprentice',
    5   => 'Initiate of Mana',
    1   => 'Noob',
];

function getLevel(int $totalXp): int {
    return min(MAX_LEVEL, (int)floor($totalXp / XP_PER_LEVEL) + 1);
}

function getRank(int $level): string {
    foreach (RANK_MILESTONES as $threshold => $rank) {
        if ($level >= $threshold) return $rank;
    }
    return 'Noob';
}

function getXpInCurrentLevel(int $totalXp): int {
    if (getLevel($totalXp) >= MAX_LEVEL) return XP_PER_LEVEL;
    return $totalXp % XP_PER_LEVEL;
}

function buildXpPayload(int $totalXp, int $lastSeenXp): array {
    $level = getLevel($totalXp);
    return [
        'totalXp'          => $totalXp,
        'lastSeenXp'       => $lastSeenXp,
        'xpSinceLastVisit' => max(0, $totalXp - $lastSeenXp),
        'level'            => $level,
        'rank'             => getRank($level),
        'xpInCurrentLevel' => getXpInCurrentLevel($totalXp),
        'xpPerLevel'       => XP_PER_LEVEL,
        'isMaxLevel'       => $level >= MAX_LEVEL,
    ];
}
