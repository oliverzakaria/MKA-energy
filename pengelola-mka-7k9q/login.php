<?php
/**
 * MKA ENERGY SOLUTION - PORTAL PENGELOLA LOGIN
 * File: pengelola-mka-7k9q/login.php
 * URL: https://mkaenergy.co.id/pengelola-mka-7k9q/login.php
 * PT Mitra Karya Ausindo (www.mkaenergy.co.id)
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config.php';

// Jika sudah login dan belum expired, langsung arahkan ke index portal
$timeout_duration = defined('ADMIN_SESSION_TIMEOUT') ? ADMIN_SESSION_TIMEOUT : 900;
if (isset($_SESSION['mka_admin_logged_in']) && $_SESSION['mka_admin_logged_in'] === true) {
    if (isset($_SESSION['mka_last_activity']) && (time() - $_SESSION['mka_last_activity'] <= $timeout_duration)) {
        header("Location: index.php");
        exit;
    }
}

$error_msg = '';
$info_msg = '';

if (isset($_GET['msg'])) {
    if ($_GET['msg'] === 'timeout') {
        $info_msg = 'Sesi Anda telah berakhir karena tidak ada aktivitas selama 15 menit. Silakan login kembali demi keamanan data.';
    } elseif ($_GET['msg'] === 'need_login') {
        $info_msg = 'Silakan login terlebih dahulu untuk mengakses Portal Pengelola MKA Energy.';
    } elseif ($_GET['msg'] === 'logged_out') {
        $info_msg = 'Anda telah berhasil keluar (logout) dari sistem.';
    }
}

// Proses Form POST Login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    if (empty($username) || empty($password)) {
        $error_msg = 'Username dan Password wajib diisi.';
    } else {
        try {
            $stmt = $pdo->prepare("SELECT id, username, email, password_hash, full_name, role FROM users WHERE username = :u LIMIT 1");
            $stmt->execute([':u' => $username]);
            $user = $stmt->fetch();

            $verified = false;
            if ($user) {
                // Mendukung password_verify (Bcrypt/Argon) atau fallback sha256 jika diset
                if (password_verify($password, $user['password_hash'])) {
                    $verified = true;
                } elseif (hash('sha256', $password . 'mka_salt_secret') === $user['password_hash']) {
                    $verified = true;
                }
            }

            if ($verified) {
                // Perbarui session
                session_regenerate_id(true);
                $_SESSION['mka_admin_logged_in'] = true;
                $_SESSION['mka_admin_id'] = $user['id'];
                $_SESSION['mka_admin_user'] = $user['username'];
                $_SESSION['mka_admin_name'] = $user['full_name'];
                $_SESSION['mka_admin_role'] = $user['role'];
                $_SESSION['mka_last_activity'] = time();

                // Redirect ke Dashboard Admin
                header("Location: index.php");
                exit;
            } else {
                $error_msg = 'Username atau Password salah. Akses ditolak.';
            }
        } catch (PDOException $e) {
            $error_msg = 'Gagal menghubungi database: ' . htmlspecialchars($e->getMessage());
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Portal Pengelola | MKA Energy Solution</title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-neutral-900 text-neutral-100 min-h-screen flex items-center justify-center p-4 selection:bg-amber-500 selection:text-neutral-900">

  <div class="w-full max-w-md">
    <!-- Brand Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-black text-white tracking-tight">PORTAL PENGELOLA MKA</h1>
      <p class="text-xs uppercase tracking-widest text-amber-400/90 font-bold mt-1">PT Mitra Karya Ausindo</p>
      <p class="text-xs text-neutral-400 mt-1">Area Terbatas: Sistem Manajemen Energi & Survey PLTS</p>
    </div>

    <!-- Card Login -->
    <div class="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      
      <?php if (!empty($info_msg)): ?>
        <div class="mb-5 p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div>
            <span class="font-bold block text-amber-300">Pemberitahuan:</span>
            <?= htmlspecialchars($info_msg) ?>
          </div>
        </div>
      <?php endif; ?>

      <?php if (!empty($error_msg)): ?>
        <div class="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <span class="font-bold block text-red-300">Kesalahan:</span>
            <?= htmlspecialchars($error_msg) ?>
          </div>
        </div>
      <?php endif; ?>

      <form method="POST" action="login.php" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Username Admin</label>
          <div class="relative">
            <input 
              type="text" 
              name="username" 
              required
              autofocus
              value="<?= isset($_POST['username']) ? htmlspecialchars($_POST['username']) : 'admin_mka' ?>"
              placeholder="admin_mka"
              class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
            >
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Password</label>
            <span class="text-[11px] text-neutral-400 font-mono">Enkripsi Bcrypt</span>
          </div>
          <input 
            type="password" 
            name="password" 
            required
            placeholder="••••••••••••"
            class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
          >
        </div>

        <div class="pt-2">
          <button 
            type="submit"
            class="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>MASUK KE PORTAL PENGELOLA</span>
          </button>
        </div>
      </form>

      <!-- Petunjuk Akun Default & Session Timeout -->
      <div class="mt-6 pt-5 border-t border-neutral-700/60 text-xs text-neutral-400 space-y-2">
        <div class="flex items-center justify-between bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
          <span class="text-neutral-400">Default Username:</span>
          <code class="text-amber-400 font-bold bg-neutral-950 px-2 py-0.5 rounded">admin_mka</code>
        </div>
        <div class="flex items-center justify-between bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
          <span class="text-neutral-400">Default Password:</span>
          <code class="text-amber-400 font-bold bg-neutral-950 px-2 py-0.5 rounded">AdminMKA2026!#</code>
        </div>
        <div class="p-2 text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Fitur Session Timeout Aktif: Logout otomatis jika 15 menit tanpa aktivitas.</span>
        </div>
      </div>
    </div>

    <!-- Back to Website -->
    <div class="mt-6 text-center">
      <a href="../" class="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Kembali ke Website Utama MKA Energy</span>
      </a>
    </div>

  </div>

</body>
</html>
