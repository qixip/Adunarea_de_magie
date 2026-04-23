<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$data  = body();
$token = $data['refreshToken'] ?? '';

if ($token === '') {
    jsonError('Refresh token required', 400);
}

$hash = hash('sha256', $token);
$db   = getDb();

$stmt = $db->prepare(
    'SELECT rt.user_id, u.id, u.name, u.email, u.role
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = ? AND rt.expires_at > NOW()
     LIMIT 1'
);
$stmt->execute([$hash]);
$row = $stmt->fetch();

if (!$row) {
    jsonError('Invalid or expired refresh token', 401);
}

$user = [
    'id'    => $row['id'],
    'name'  => $row['name'],
    'email' => $row['email'],
    'role'  => $row['role'] ?? 'member',
];

$now = time();
$accessToken = jwtEncode([
    'sub'   => $user['id'],
    'name'  => $user['name'],
    'email' => $user['email'],
    'role'  => $user['role'],
    'iat'   => $now,
    'exp'   => $now + JWT_ACCESS_TTL,
]);

jsonOk([
    'accessToken'  => $accessToken,
    'refreshToken' => $token,
    'user'         => $user,
]);


