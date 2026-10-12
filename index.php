<?php
/**
 * MKA ENERGY SOLUTION (PT MITRA KARYA AUSINDO)
 * Website: www.mkaenergy.co.id
 * Main Application Entry for PHP / CPanel
 */

// If requested file exists, let web server serve it
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// If an API route was requested directly, route to api.php
if (strpos($requestUri, '/api/') === 0 || $requestUri === '/api') {
    require_once __DIR__ . '/api.php';
    exit;
}

// Serve the compiled single-page application
if (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
    exit;
} else {
    echo "<h1>MKA Energy Solution</h1><p>Website is loading...</p>";
}
