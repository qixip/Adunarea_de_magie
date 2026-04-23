<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$payload = requireAuth();
if (($payload['role'] ?? '') !== 'admin') jsonError('Forbidden', 403);

$b = body();

$title       = trim($b['title']       ?? '');
$eventType   = trim($b['eventType']   ?? '');
$format      = trim($b['format']      ?? '');
$date        = trim($b['date']        ?? '');
$time        = trim($b['time']        ?? '');
$location    = trim($b['location']    ?? 'Locatie centrala, Bucuresti');
$capacity    = (int) ($b['capacity']  ?? 30);
$feeStandard = (float) ($b['feeStandard'] ?? 0);
$feeMember   = (float) ($b['feeMember']   ?? 0);
$description = trim($b['description'] ?? '');

if (!$title)     jsonError('title is required', 422);
if (!$eventType) jsonError('eventType is required', 422);
if (!$date)      jsonError('date is required', 422);
if (!$time)      jsonError('time is required', 422);

$validTypes = [
    'casual-commander','board-game','special-formats',
    'pauper','pauper-prize','cedh-showdown','cedh-league','open-market'
];
if (!in_array($eventType, $validTypes, true)) {
    jsonError('Invalid eventType', 422);
}

$id = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $eventType))
    . '-' . $date;

$db = getDb();
$stmt = $db->prepare(
    'INSERT INTO events
       (id, title, event_type, format, scheduled_date, scheduled_time,
        location, capacity, spots_left, status, description, fee_standard, fee_member)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->execute([
    $id, $title, $eventType, $format, $date, $time,
    $location, $capacity, $capacity, 'upcoming',
    $description, $feeStandard, $feeMember
]);

http_response_code(201);
jsonOk(['id' => $id, 'message' => 'Evenimentul a fost creat cu succes.']);
