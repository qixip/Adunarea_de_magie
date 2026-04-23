<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/jwt.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$b        = body();
$email    = trim($b['email']    ?? '');
$password =      $b['password'] ?? '';

if (!$email || !$password) jsonError('Email and password are required', 422);

$db   = getDb();
$stmt = $db->prepare('SELECT id, name, email, role, password_hash FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonError('Invalid credentials', 401);
}

$now         = time();
$accessToken = jwtEncode([
    'sub'   => $user['id'],
    'name'  => $user['name'],
    'email' => $user['email'],
    'role'  => $user['role'] ?? 'member',
    'iat'   => $now,
    'exp'   => $now + JWT_ACCESS_TTL,
]);

$refreshToken = generateRefreshToken();
$tokenHash    = hash('sha256', $refreshToken);
$expiresAt    = date('Y-m-d H:i:s', $now + JWT_REFRESH_TTL);

$db->prepare('DELETE FROM refresh_tokens WHERE user_id = ?')->execute([$user['id']]);
$db->prepare('INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)')
   ->execute([bin2hex(random_bytes(16)), $user['id'], $tokenHash, $expiresAt]);

jsonOk([
    'accessToken'  => $accessToken,
    'refreshToken' => $refreshToken,
    'user'         => [
        'id'    => $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'role'  => $user['role'] ?? 'member',
    ],
]);