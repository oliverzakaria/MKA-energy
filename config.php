<?php
/**
 * MKA ENERGY SOLUTION - CPANEL DATABASE CONFIGURATION (PDO)
 * File: config.php
 * PT Mitra Karya Ausindo (www.mkaenergy.co.id)
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'mkaenergy_db');     // Sesuaikan dengan nama database CPanel
define('DB_USER', 'mkaenergy_user');   // Sesuaikan dengan user database CPanel
define('DB_PASS', 'MKA_Energy_2026!'); // Sesuaikan dengan password database CPanel

// Durasi timeout sesi admin dalam detik (15 Menit = 900 detik, 30 menit = 1800 detik)
define('ADMIN_SESSION_TIMEOUT', 900);

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    // Return friendly error
    if (php_sapi_name() !== 'cli') {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Koneksi database CPanel gagal. Pastikan config.php telah diatur dengan nama database, user, dan password yang sesuai.'
        ]);
        exit;
    }
}
