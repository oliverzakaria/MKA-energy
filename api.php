<?php
/**
 * MKA ENERGY SOLUTION - REST API & DATA HANDLER FOR CPANEL
 * File: api.php
 * PT Mitra Karya Ausindo (www.mkaenergy.co.id)
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$route = isset($_GET['route']) ? trim($_GET['route']) : '';

// Router endpoint
switch ($route) {
    case 'admin-login':
        handleAdminLogin($pdo);
        break;

    case 'admin-check-session':
        handleAdminCheckSession();
        break;

    case 'admin-logout':
        handleAdminLogout();
        break;

    case 'surveys':
        handleSurveys($pdo);
        break;

    case 'tickets':
        handleTickets($pdo);
        break;

    case 'products':
        handleProducts($pdo);
        break;

    case 'payment-create':
        handlePaymentCreate($pdo);
        break;

    default:
        echo json_encode([
            'status' => 'success',
            'app' => 'MKA Energy Solution API',
            'version' => '1.1.0',
            'admin_portal_url' => '/pengelola-mka-7k9q/login.php',
            'company' => 'PT Mitra Karya Ausindo'
        ]);
        break;
}

function handleAdminLogin($pdo) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Username dan password wajib diisi']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, username, email, password_hash, full_name, role FROM users WHERE username = :u LIMIT 1");
        $stmt->execute([':u' => $username]);
        $user = $stmt->fetch();

        $valid = false;
        if ($user) {
            if (password_verify($password, $user['password_hash'])) {
                $valid = true;
            } elseif (hash('sha256', $password . 'mka_salt_secret') === $user['password_hash']) {
                $valid = true;
            }
        }

        if ($valid) {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            session_regenerate_id(true);
            $_SESSION['mka_admin_logged_in'] = true;
            $_SESSION['mka_admin_id'] = $user['id'];
            $_SESSION['mka_admin_user'] = $user['username'];
            $_SESSION['mka_admin_name'] = $user['full_name'];
            $_SESSION['mka_admin_role'] = $user['role'];
            $_SESSION['mka_last_activity'] = time();

            echo json_encode([
                'status' => 'success',
                'message' => 'Login berhasil',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'fullName' => $user['full_name'],
                    'role' => $user['role']
                ],
                'timeoutSeconds' => defined('ADMIN_SESSION_TIMEOUT') ? ADMIN_SESSION_TIMEOUT : 900
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Username atau password salah']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Gagal verifikasi login database: ' . $e->getMessage()]);
    }
}

function handleAdminCheckSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $timeout = defined('ADMIN_SESSION_TIMEOUT') ? ADMIN_SESSION_TIMEOUT : 900;
    
    if (isset($_SESSION['mka_admin_logged_in']) && $_SESSION['mka_admin_logged_in'] === true) {
        $inactive = time() - ($_SESSION['mka_last_activity'] ?? 0);
        if ($inactive > $timeout) {
            $_SESSION = [];
            session_destroy();
            echo json_encode(['status' => 'expired', 'message' => 'Sesi telah kedaluwarsa']);
            return;
        }
        $_SESSION['mka_last_activity'] = time();
        echo json_encode([
            'status' => 'active',
            'user' => [
                'username' => $_SESSION['mka_admin_user'] ?? 'admin_mka',
                'fullName' => $_SESSION['mka_admin_name'] ?? 'Lead Engineer',
                'role' => $_SESSION['mka_admin_role'] ?? 'superadmin'
            ],
            'remainingSeconds' => $timeout - $inactive
        ]);
    } else {
        echo json_encode(['status' => 'unauthenticated']);
    }
}

function handleAdminLogout() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION = [];
    session_destroy();
    echo json_encode(['status' => 'success', 'message' => 'Berhasil logout']);
}

function handleSurveys($pdo) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        // Validasi minimal nilai investasi 30 Juta
        $minInvestment = 30000000;
        $estInvestment = isset($input['estimatedInvestment']) ? floatval($input['estimatedInvestment']) : 0;

        if ($estInvestment < $minInvestment) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Investasi minimal untuk survey lokasi resmi MKA Energy adalah Rp 30.000.000'
            ]);
            return;
        }

        $ticketCode = 'MKA-SRV-' . date('Y') . '-' . str_pad(rand(100, 9999), 4, '0', STR_PAD_LEFT);

        try {
            $stmt = $pdo->prepare("
                INSERT INTO survey_requests 
                (ticket_code, full_name, phone_whatsapp, email, city, address, property_type, estimated_investment, target_survey_date, roof_type, notes)
                VALUES 
                (:ticket_code, :full_name, :phone, :email, :city, :address, :property_type, :investment, :target_date, :roof_type, :notes)
            ");

            $stmt->execute([
                ':ticket_code' => $ticketCode,
                ':full_name'   => $input['fullName'] ?? '',
                ':phone'       => $input['phone'] ?? '',
                ':email'       => $input['email'] ?? '',
                ':city'        => $input['city'] ?? '',
                ':address'     => $input['address'] ?? '',
                ':property_type' => $input['propertyType'] ?? 'Residensial',
                ':investment'  => $estInvestment,
                ':target_date' => $input['targetDate'] ?? date('Y-m-d', strtotime('+3 days')),
                ':roof_type'   => $input['roofType'] ?? 'Genteng',
                ':notes'       => $input['notes'] ?? ''
            ]);

            echo json_encode([
                'status' => 'success',
                'message' => 'Permintaan survey berhasil diajukan ke tim teknis MKA Energy.',
                'ticket_code' => $ticketCode
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan ke database: ' . $e->getMessage()]);
        }
    } else {
        // GET List surveys
        try {
            $stmt = $pdo->query("SELECT * FROM survey_requests ORDER BY id DESC");
            echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}

function handleTickets($pdo) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $ticketNum = 'MKA-TKT-' . date('Y') . '-' . rand(1000, 9999);

        try {
            $stmt = $pdo->prepare("
                INSERT INTO service_tickets 
                (ticket_number, client_name, system_location, system_type, current_stage, issue_description, status)
                VALUES 
                (:tkt_num, :client, :location, :system_type, 1, :issue, 'Open')
            ");

            $stmt->execute([
                ':tkt_num'     => $ticketNum,
                ':client'      => $input['clientName'] ?? '',
                ':location'    => $input['systemLocation'] ?? '',
                ':system_type' => $input['systemType'] ?? 'PLTS On-Grid',
                ':issue'       => $input['issueDescription'] ?? ''
            ]);

            echo json_encode([
                'status' => 'success',
                'message' => 'Tiket purna jual berhasil diterbitkan ke service desk.',
                'ticket_number' => $ticketNum
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } else {
        try {
            $stmt = $pdo->query("SELECT * FROM service_tickets ORDER BY id DESC");
            echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}

function handleProducts($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM products ORDER BY id ASC");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}

function handlePaymentCreate($pdo) {
    // Simulasi integrasi gateway pembayaran online (Midtrans / Xendit)
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = 'MKA-INV-' . time();
    $amount = isset($input['amount']) ? floatval($input['amount']) : 0;

    echo json_encode([
        'status' => 'success',
        'order_id' => $orderId,
        'amount' => $amount,
        'snap_token' => 'dummy_snap_token_' . md5($orderId),
        'redirect_url' => 'https://app.midtrans.com/snap/v2/vtweb/' . md5($orderId)
    ]);
}
