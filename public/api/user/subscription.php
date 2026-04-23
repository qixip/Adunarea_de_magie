<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('Method not allowed', 405);

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

$stmt = $db->prepare(
    "SELECT type, valid_from, valid_until
     FROM subscriptions
     WHERE user_id = ? AND valid_from <= CURDATE() AND valid_until >= CURDATE()
     ORDER BY valid_until DESC LIMIT 1"
);
$stmt->execute([$userId]);
$sub = $stmt->fetch();

jsonOk(['subscription' => $sub ?: null]);
