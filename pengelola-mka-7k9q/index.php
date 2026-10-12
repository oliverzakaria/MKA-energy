<?php
/**
 * MKA ENERGY SOLUTION - DASHBOARD PORTAL PENGELOLA
 * File: pengelola-mka-7k9q/index.php
 * URL: https://mkaenergy.co.id/pengelola-mka-7k9q/
 * PT Mitra Karya Ausindo (www.mkaenergy.co.id)
 */

require_once __DIR__ . '/auth_check.php';

// Ambil data statistik dari database
$total_surveys = 0;
$total_tickets = 0;
$total_products = 0;
$surveys = [];
$tickets = [];

try {
    $stmt1 = $pdo->query("SELECT COUNT(*) FROM survey_requests");
    $total_surveys = $stmt1->fetchColumn();

    $stmt2 = $pdo->query("SELECT COUNT(*) FROM service_tickets");
    $total_tickets = $stmt2->fetchColumn();

    $stmt3 = $pdo->query("SELECT COUNT(*) FROM products");
    $total_products = $stmt3->fetchColumn();

    $stmtSurveys = $pdo->query("SELECT * FROM survey_requests ORDER BY id DESC LIMIT 10");
    $surveys = $stmtSurveys->fetchAll();

    $stmtTickets = $pdo->query("SELECT * FROM service_tickets ORDER BY id DESC LIMIT 10");
    $tickets = $stmtTickets->fetchAll();
} catch (PDOException $e) {
    // Abaikan jika tabel belum ada atau gunakan nilai default
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Pengelola | MKA Energy Solution</title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
  <script>
    // Client-side inactivity session countdown & auto-logout
    let timeoutSeconds = <?= defined('ADMIN_SESSION_TIMEOUT') ? ADMIN_SESSION_TIMEOUT : 900 ?>;
    let remainingSeconds = timeoutSeconds;

    function resetTimer() {
      remainingSeconds = timeoutSeconds;
    }

    // Reset timer on user interactions
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;
    window.onkeydown = resetTimer;

    setInterval(function() {
      remainingSeconds--;
      const timerDisplay = document.getElementById('timeoutCounter');
      if (timerDisplay) {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
      if (remainingSeconds <= 0) {
        window.location.href = 'logout.php?msg=timeout';
      }
    }, 1000);
  </script>
</head>
<body class="bg-neutral-900 text-neutral-100 min-h-screen flex flex-col selection:bg-amber-500 selection:text-neutral-900">

  <!-- Topbar -->
  <header class="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <div>
          <span class="font-extrabold text-sm tracking-tight text-white block">PORTAL PENGELOLA MKA</span>
          <span class="text-[10px] text-amber-400 font-mono tracking-widest uppercase">Folder: /pengelola-mka-7k9q/</span>
        </div>
      </div>

      <!-- User info & session countdown -->
      <div class="flex items-center gap-4 text-xs">
        <div class="hidden sm:flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Sesi Timeout: <strong id="timeoutCounter" class="text-white font-mono">15:00</strong></span>
        </div>

        <div class="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-neutral-300 font-medium"><?= htmlspecialchars($_SESSION['mka_admin_name'] ?? 'Admin MKA') ?></span>
          <span class="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold"><?= htmlspecialchars($_SESSION['mka_admin_role'] ?? 'superadmin') ?></span>
        </div>

        <a href="logout.php" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-semibold transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Keluar</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

    <!-- Hero / Quick Status Banner -->
    <div class="bg-gradient-to-r from-neutral-800 via-neutral-800 to-neutral-850 p-6 rounded-2xl border border-neutral-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          Selamat Datang, <?= htmlspecialchars($_SESSION['mka_admin_name'] ?? 'Admin') ?>!
        </h2>
        <p class="text-xs text-neutral-400 mt-1">
          Sistem portal manajemen telah diamankan dengan enkripsi password database dan proteksi session timeout otomatis.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <a href="../#admin" target="_blank" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M9 21V9"></path>
          </svg>
          <span>Buka Antarmuka Interaktif SPA</span>
        </a>
        <a href="../" target="_blank" class="px-4 py-2.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-semibold text-xs inline-flex items-center gap-2 transition-all">
          <span>Kunjungi Website Utama</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-neutral-800/80 border border-neutral-700/80 p-5 rounded-2xl">
        <span class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Permintaan Survey Masuk</span>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-amber-400"><?= intval($total_surveys) ?></span>
          <span class="text-xs text-neutral-400">Total Pengajuan</span>
        </div>
      </div>

      <div class="bg-neutral-800/80 border border-neutral-700/80 p-5 rounded-2xl">
        <span class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Tiket Layanan & Maintenance</span>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-cyan-400"><?= intval($total_tickets) ?></span>
          <span class="text-xs text-neutral-400">Tiket Aktif</span>
        </div>
      </div>

      <div class="bg-neutral-800/80 border border-neutral-700/80 p-5 rounded-2xl">
        <span class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Katalog Produk & Paket</span>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-emerald-400"><?= intval($total_products) ?></span>
          <span class="text-xs text-neutral-400">Sistem Terdaftar</span>
        </div>
      </div>
    </div>

    <!-- Tabel Permintaan Survey Terkini -->
    <div class="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl overflow-hidden shadow-xl">
      <div class="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          Data Permintaan Survey Lapangan Terbaru
        </h3>
        <span class="text-xs text-neutral-400 font-mono">Tersambung ke MySQL CPanel</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-neutral-900/80 text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-700">
            <tr>
              <th class="px-5 py-3">Kode Tiket</th>
              <th class="px-5 py-3">Nama Klien</th>
              <th class="px-5 py-3">Lokasi / Kota</th>
              <th class="px-5 py-3">Tipe Properti</th>
              <th class="px-5 py-3">Perkiraan Investasi</th>
              <th class="px-5 py-3">Target Tanggal</th>
              <th class="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-700/60 text-neutral-300">
            <?php if (empty($surveys)): ?>
              <tr>
                <td colspan="7" class="px-5 py-8 text-center text-neutral-400">
                  Belum ada data survey yang tersimpan di database MySQL. Data baru yang diajukan oleh calon klien di website akan otomatis muncul di sini.
                </td>
              </tr>
            <?php else: ?>
              <?php foreach ($surveys as $srv): ?>
                <tr class="hover:bg-neutral-750/50 transition-colors">
                  <td class="px-5 py-3 font-mono font-bold text-amber-400"><?= htmlspecialchars($srv['ticket_code'] ?? '-') ?></td>
                  <td class="px-5 py-3 font-medium text-white"><?= htmlspecialchars($srv['full_name'] ?? '-') ?></td>
                  <td class="px-5 py-3"><?= htmlspecialchars($srv['city'] ?? '-') ?></td>
                  <td class="px-5 py-3"><?= htmlspecialchars($srv['property_type'] ?? '-') ?></td>
                  <td class="px-5 py-3 font-semibold text-emerald-400">Rp <?= number_format(floatval($srv['estimated_investment'] ?? 0), 0, ',', '.') ?></td>
                  <td class="px-5 py-3"><?= htmlspecialchars($srv['target_survey_date'] ?? '-') ?></td>
                  <td class="px-5 py-3">
                    <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <?= htmlspecialchars($srv['status'] ?? 'Menunggu Review') ?>
                    </span>
                  </td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>

  </main>

  <!-- Footer -->
  <footer class="bg-neutral-950 border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <span>Portal Pengelola Sistem & PLTS MKA Energy &copy; <?= date('Y') ?> PT Mitra Karya Ausindo</span>
      <span class="font-mono text-[11px] text-neutral-400">Keamanan Terverifikasi &bull; Sesi Aktif</span>
    </div>
  </footer>

</body>
</html>
