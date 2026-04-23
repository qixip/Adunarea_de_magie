<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('Method not allowed', 405);

$db      = getDb();
$payload = optionalAuth();

$events = $db->query(
    "SELECT id, title, event_type, scheduled_date, scheduled_time,
            location, capacity, spots_left, status, description,
            fee_standard, fee_member
     FROM events
     WHERE status != 'past'
     ORDER BY scheduled_date ASC, scheduled_time ASC"
)->fetchAll();

if ($payload) {
    $userId = $payload['sub'];

    $regs = $db->prepare(
        "SELECT event_id, status FROM event_registrations WHERE user_id = ?"
    );
    $regs->execute([$userId]);
    $registered = [];
    foreach ($regs->fetchAll() as $r) {
        $registered[$r['event_id']] = $r['status'];
    }

    $sub = $db->prepare(
        "SELECT type FROM subscriptions
         WHERE user_id = ? AND valid_from <= CURDATE() AND valid_until >= CURDATE()
         LIMIT 1"
    );
    $sub->execute([$userId]);
    $subscription = $sub->fetch();

    foreach ($events as &$evt) {
        $evt['userRegistrationStatus'] = $registered[$evt['id']] ?? null;
        $evt['userSubscription'] = $subscription['type'] ?? null;
    }
    unset($evt);
}

jsonOk(['events' => $events]);
