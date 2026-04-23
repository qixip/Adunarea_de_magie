<?php
// Apache sets REDIRECT_URL to the original URI when rewriting internally.
// Fall back to REQUEST_URI for direct calls.
$uri = rtrim(
    parse_url($_SERVER['REDIRECT_URL'] ?? $_SERVER['REQUEST_URI'], PHP_URL_PATH),
    '/'
);

$routes = [
    '/api/auth/login'        => __DIR__ . '/auth/login.php',
    '/api/auth/register'     => __DIR__ . '/auth/register.php',
    '/api/auth/refresh'      => __DIR__ . '/auth/refresh.php',
    '/api/events'            => __DIR__ . '/events/index.php',
    '/api/events/register'   => __DIR__ . '/events/register.php',
    '/api/user/subscription' => __DIR__ . '/user/subscription.php',
    '/api/contact/send'      => __DIR__ . '/contact/send.php',
];

if (isset($routes[$uri])) {
    require $routes[$uri];
} else {
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Not found', 'uri' => $uri]);
}
