<?php
// Copy this file to jwt.php and replace JWT_SECRET with a random 64-char hex string.
// Generate one with: php -r "echo bin2hex(random_bytes(32));"
define('JWT_SECRET',      'replace_with_random_64_char_hex_string');
define('JWT_ACCESS_TTL',  900);       // access token: 15 minutes
define('JWT_REFRESH_TTL', 2592000);   // refresh token: 30 days

function jwtEncode(array $payload): string {
    $header = b64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $body   = b64url(json_encode($payload));
    $sig    = b64url(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    return "$header.$body.$sig";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $body, $sig] = $parts;
    $expected = b64url(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) return null;
    $payload = json_decode(b64urlDecode($body), true);
    if (!is_array($payload) || ($payload['exp'] ?? 0) < time()) return null;
    return $payload;
}

function b64url(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64urlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

function generateRefreshToken(): string {
    return bin2hex(random_bytes(32));
}
