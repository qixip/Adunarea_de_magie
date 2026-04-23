<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/xp.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$payload = requireAuth();
if (($payload['role'] ?? '') !== 'admin') jsonError('Forbidden', 403);

$body    = body();
$userId  = trim($body['userId']  ?? '');
$eventId = trim($body['eventId'] ?? '');

if ($userId  === '') jsonError('userId este obligatoriu.',  422);
if ($eventId === '') jsonError('eventId este obligatoriu.', 422);

$db = getDb();

// Validate user exists
$stmt = $db->prepare('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$userId]);
$user = $stmt->fetch();
if (!$user) jsonError('Utilizatorul nu a fost găsit.', 404);

// Validate event exists and is scheduled for today
$stmt = $db->prepare(
    'SELECT id, title, event_type, scheduled_date
     FROM events WHERE id = ? AND scheduled_date = CURDATE() LIMIT 1'
);
$stmt->execute([$eventId]);
$event = $stmt->fetch();
if (!$event) jsonError('Evenimentul nu există sau nu are loc astăzi.', 422);

// Active subscription
$stmt = $db->prepare(
    'SELECT type, valid_until FROM subscriptions
     WHERE user_id = ? AND valid_until >= CURDATE()
     ORDER BY valid_until DESC LIMIT 1'
);
$stmt->execute([$userId]);
$subscription = $stmt->fetch() ?: null;

// Check for duplicate attendance
$stmt = $db->prepare(
    'SELECT id, xp_awarded FROM event_attendances
     WHERE user_id = ? AND event_id = ? LIMIT 1'
);
$stmt->execute([$userId, $eventId]);
$existing = $stmt->fetch();

// Get or initialise user_xp row
$stmt = $db->prepare('SELECT total_xp, last_seen_xp FROM user_xp WHERE user_id = ? LIMIT 1');
$stmt->execute([$userId]);
$xpRow = $stmt->fetch();
if (!$xpRow) {
    $db->prepare('INSERT IGNORE INTO user_xp (user_id, total_xp, last_seen_xp) VALUES (?, 0, 0)')
       ->execute([$userId]);
    $xpRow = ['total_xp' => 0, 'last_seen_xp' => 0];
}

$alreadyCheckedIn = (bool)$existing;
$xpAwarded        = 0;

if (!$alreadyCheckedIn) {
    $xpAwarded = XP_BY_EVENT_TYPE[$event['event_type']] ?? 0;

    $db->beginTransaction();
    try {
        $attId = bin2hex(random_bytes(16));
        $db->prepare(
            'INSERT INTO event_attendances (id, user_id, event_id, xp_awarded) VALUES (?, ?, ?, ?)'
        )->execute([$attId, $userId, $eventId, $xpAwarded]);

        if ($xpAwarded > 0) {
            $db->prepare('UPDATE user_xp SET total_xp = total_xp + ? WHERE user_id = ?')
               ->execute([$xpAwarded, $userId]);

            // Re-fetch after update
            $stmt = $db->prepare('SELECT total_xp, last_seen_xp FROM user_xp WHERE user_id = ?');
            $stmt->execute([$userId]);
            $xpRow = $stmt->fetch();
        }

        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        jsonError('Eroare internă la înregistrarea prezenței.', 500);
    }
}

$totalXp    = (int)$xpRow['total_xp'];
$lastSeenXp = (int)$xpRow['last_seen_xp'];

$message = $alreadyCheckedIn
    ? 'Jucătorul a fost deja înregistrat la acest eveniment.'
    : ($xpAwarded > 0 ? "Prezență confirmată! +{$xpAwarded} XP" : 'Prezență confirmată!');

jsonOk([
    'user'             => [
        'id'    => $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
    ],
    'subscription'     => $subscription,
    'alreadyCheckedIn' => $alreadyCheckedIn,
    'xpAwarded'        => $xpAwarded,
    'xp'               => buildXpPayload($totalXp, $lastSeenXp),
    'message'          => $message,
]);
