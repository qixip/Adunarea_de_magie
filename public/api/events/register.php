<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$payload = requireAuth();
$userId  = $payload['sub'];
$b       = body();
$eventId = trim($b['eventId'] ?? '');

if (!$eventId) jsonError('eventId required', 422);

$db = getDb();

$stmt = $db->prepare(
    "SELECT id, event_type, spots_left, status, fee_standard, fee_member FROM events WHERE id = ?"
);
$stmt->execute([$eventId]);
$event = $stmt->fetch();

if (!$event)                     jsonError('Event not found', 404);
if ($event['status'] === 'past') jsonError('Event already passed', 410);
if ($event['spots_left'] <= 0)   jsonError('Event is full', 409);

$stmt = $db->prepare(
    "SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?"
);
$stmt->execute([$userId, $eventId]);
if ($stmt->fetch()) jsonError('Already registered for this event', 409);

$eventType     = $event['event_type'];
$includedInLunar = ['casual-commander', 'board-game', 'special-formats'];

if ($eventType === 'open-market') {
    $amountPaid = 0.00;
    $regStatus  = 'confirmed';
} else {
    $sub = $db->prepare(
        "SELECT type FROM subscriptions
         WHERE user_id = ? AND valid_from <= CURDATE() AND valid_until >= CURDATE()
         LIMIT 1"
    );
    $sub->execute([$userId]);
    $subscription = $sub->fetch();
    $subType = $subscription['type'] ?? null;

    if ($subType === 'lunar' && in_array($eventType, $includedInLunar, true)) {
        $amountPaid = 0.00;
        $regStatus  = 'confirmed';
    } else {
        $amountPaid = $subType === 'lunar'
            ? (float) $event['fee_member']
            : (float) $event['fee_standard'];
        $regStatus  = 'pending';
    }
}

$regId = bin2hex(random_bytes(16));
$db->beginTransaction();
try {
    $db->prepare(
        "INSERT INTO event_registrations (id, user_id, event_id, amount_paid, status)
         VALUES (?, ?, ?, ?, ?)"
    )->execute([$regId, $userId, $eventId, $amountPaid, $regStatus]);

    $db->prepare(
        "UPDATE events SET spots_left = spots_left - 1 WHERE id = ? AND spots_left > 0"
    )->execute([$eventId]);

    $db->commit();
} catch (Throwable $e) {
    $db->rollBack();
    jsonError('Registration failed. Please try again.', 500);
}

$message = $regStatus === 'confirmed'
    ? 'Loc rezervat cu succes!'
    : sprintf(
        'Rezervare salvată! Achitați %s RON la sosire.',
        number_format($amountPaid, 0, ',', '.')
      );

jsonOk([
    'registrationId' => $regId,
    'status'         => $regStatus,
    'amountDue'      => $amountPaid,
    'message'        => $message,
], 201);
