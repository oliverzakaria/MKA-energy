<?php
/**
 * MKA ENERGY SOLUTION - SESSION CHECKER & PROTECTOR
 * File: pengelola-mka-7k9q/auth_check.php
 * PT Mitra Karya Ausindo (www.mkaenergy.co.id)
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config.php';

$timeout_duration = defined('ADMIN_SESSION_TIMEOUT') ? ADMIN_SESSION_TIMEOUT : 900; // default 15 menit

// Periksa apakah admin sudah login
if (!isset($_SESSION['mka_admin_logged_in']) || $_SESSION['mka_admin_logged_in'] !== true) {
    header("Location: login.php?msg=need_login");
    exit;
}

// Periksa session timeout karena inaktivitas
if (isset($_SESSION['mka_last_activity'])) {
    $inactive_time = time() - $_SESSION['mka_last_activity'];
    if ($inactive_time > $timeout_duration) {
        // Sesi telah kedaluwarsa
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        header("Location: login.php?msg=timeout");
        exit;
    }
}

// Perbarui waktu aktivitas terakhir
$_SESSION['mka_last_activity'] = time();
