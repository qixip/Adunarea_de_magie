<?php
require_once __DIR__ . '/../config/jwt.php';

function getAuthorizationHeader(): string {
    if (!empty($_SERVER['HTTP_AUTHORIZATION']))          return $_SERVER['HTTP_AUTHORIZATION'];
    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (!empty($headers['Authorization']))           return $headers['Authorization'];
        if (!empty($headers['authorization']))           return $headers['authorization'];
    }
    return '';
}

function requireAuth(): array {
    $header = getAuthorizationHeader();
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        jsonError('Unauthorized', 401);
    }
    $payload = jwtDecode($m[1]);
    if (!$payload) jsonError('Invalid or expired token', 401);
    return $payload;
}

function optionalAuth(): ?array {
    $header = getAuthorizationHeader();
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) return null;
    $payload = jwtDecode($m[1]);
    return $payload ?: null;
}
