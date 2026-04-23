<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$b        = body();
$name     = trim($b['name']     ?? '');
$email    = trim($b['email']    ?? '');
$password =      $b['password'] ?? '';

if (!$name || !$email || !$password)                     jsonError('All fields are required', 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL))          jsonError('Invalid email format', 422);
if (strlen($name) < 2)                                   jsonError('Name must be at least 2 characters', 422);
if (strlen($password) < 8)                               jsonError('Password must be at least 8 characters', 422);

$db = getDb();

$stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) jsonError('Email already in use', 409);

$id   = bin2hex(random_bytes(16));
$hash = password_hash($password, PASSWORD_BCRYPT);

$db->prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)')
   ->execute([$id, $name, $email, $hash]);

jsonOk([], 201);
