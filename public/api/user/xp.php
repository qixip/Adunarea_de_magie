<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/xp.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('Method not allowed', 405);

$payload = requireAuth();
$userId  = $payload['sub'] ?? '';
if (!$userId) jsonError('Invalid token', 401);

$db   = getDb();
$stmt = $db->prepare('SELECT total_xp, last_seen_xp FROM user_xp WHERE user_id = ? LIMIT 1');
$stmt->execute([$userId]);
$row = $stmt->fetch();

if (!$row) {
    $db->prepare('INSERT IGNORE INTO user_xp (user_id, total_xp, last_seen_xp) VALUES (?, 0, 0)')
       ->execute([$userId]);
    $row = ['total_xp' => 0, 'last_seen_xp' => 0];
}

$totalXp    = (int)$row['total_xp'];
$lastSeenXp = (int)$row['last_seen_xp'];

// Build response before updating last_seen so the frontend gets the delta to animate
$response = buildXpPayload($totalXp, $lastSeenXp);

// Advance last_seen to current so the next visit starts fresh
if ($lastSeenXp < $totalXp) {
    $db->prepare('UPDATE user_xp SET last_seen_xp = total_xp WHERE user_id = ?')
       ->execute([$userId]);
}

jsonOk($response);
