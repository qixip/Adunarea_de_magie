<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('Method not allowed', 405);

$payload = requireAuth();
if (($payload['role'] ?? '') !== 'admin') jsonError('Forbidden', 403);

$db   = getDb();
$stmt = $db->prepare(
    'SELECT id, title, event_type, scheduled_time
     FROM events
     WHERE scheduled_date = CURDATE()
     ORDER BY scheduled_time ASC'
);
$stmt->execute();
$events = $stmt->fetchAll();

jsonOk(['events' => $events]);
