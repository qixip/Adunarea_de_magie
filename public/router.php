<?php
// Router for PHP's built-in dev server: php -S localhost:8080 -t public public/router.php
// This file is NOT deployed - it only exists to simulate Apache rewrite rules locally.

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$routes = [
    '/api/auth/login'        => __DIR__ . '/api/auth/login.php',
    '/api/auth/register'     => __DIR__ . '/api/auth/register.php',
    '/api/auth/refresh'      => __DIR__ . '/api/auth/refresh.php',
    '/api/events'            => __DIR__ . '/api/events/index.php',
    '/api/events/register'   => __DIR__ . '/api/events/register.php',
    '/api/user/subscription'  => __DIR__ . '/api/user/subscription.php',
    '/api/admin/check-user'   => __DIR__ . '/api/admin/check-user.php',
    '/api/admin/create-event' => __DIR__ . '/api/admin/create-event.php',
];

if (isset($routes[$uri])) {
    require $routes[$uri];
} else {
    return false; // Let the built-in server handle static files
}
