# Panduan Lengkap Deploy Website MKA Energy Solution ke CPanel

Website **MKA Energy Solution (PT Mitra Karya Ausindo)** (`www.mkaenergy.com`) telah siap di-upload ke CPanel Hosting Anda.

---

### File yang Disertakan untuk CPanel:
1. **`.htaccess`** : Konfigurasi server Apache untuk rewrite URL permalink, proteksi HTTPS otomatis, kompresi GZIP, dan header keamanan.
2. **`database.sql`** : Skema lengkap database MySQL (tabel `settings`, `users`, `products`, `projects`, `survey_requests`, `service_tickets`, `payments`) beserta data awal.
3. **`config.php`** : Koneksi database PDO PHP yang aman dan teroptimasi.
4. **`api.php`** : REST API backend PHP untuk memproses permintaan survey lokasi (validasi min. Rp 30 Juta), tiket pemeliharaan 4 tahap, dan sistem pembayaran.
5. **Aplikasi Web Interaktif (Build)** : Seluruh antarmuka frontend responsif modern (Kalkulator Daya, Monitoring Realtime IoT, Portofolio Proyek, dan Portal Admin).

---

### Langkah-Langkah Upload ke CPanel:

#### 1. Buat Database MySQL di CPanel
1. Login ke CPanel hosting Anda (`https://yourdomain.com:2083`).
2. Masuk ke menu **MySQL® Databases** (atau **MySQL Database Wizard**).
3. Buat database baru, contoh: `usernamecpanel_mkaenergy`.
4. Buat user database baru dan password yang kuat.
5. Tambahkan user tersebut ke database dengan memberikan centang pada **ALL PRIVILEGES**.

#### 2. Import File `database.sql`
1. Buka menu **phpMyAdmin** di CPanel.
2. Pilih database yang baru saja Anda buat di panel sebelah kiri.
3. Klik tab **Import** di bagian atas.
4. Pilih file `database.sql` dari komputer Anda, lalu klik **Import / Go**.

#### 3. Upload File ke CPanel File Manager
1. Buka menu **File Manager** di CPanel.
2. Masuk ke direktori **`public_html`** (atau subdirektori addon domain Anda).
3. Jalankan `npm run build` pada proyek ini, lalu upload isi folder `dist/` beserta file `.htaccess`, `config.php`, dan `api.php`.
4. Pastikan file `.htaccess` tidak tersembunyi (Aktifkan opsi *"Show Hidden Files (dotfiles)"* di Settings File Manager CPanel).

#### 4. Sesuaikan Konfigurasi `config.php`
1. Di File Manager CPanel, klik kanan file `config.php` lalu pilih **Edit**.
2. Ubah baris berikut sesuai kredensial database CPanel Anda:
   ```php
   define('DB_NAME', 'usernamecpanel_mkaenergy');
   define('DB_USER', 'usernamecpanel_mkauser');
   define('DB_PASS', 'PasswordDatabaseAnda');
   ```
3. Klik **Save Changes**.

---

### Informasi Resmi Perusahaan:
- **Nama Perusahaan**: PT Mitra Karya Ausindo (Didirikan 2019)
- **Brand**: MKA Energy Solution
- **Domain**: [www.mkaenergy.com](https://www.mkaenergy.com)
- **Kantor Pusat**: District 1 Meikarta, OAKVIEW Tower, L7-35, Jl. Orange County Boulevard, Cibatu, Cikarang Selatan, Kab. Bekasi, Jawa Barat.
- **Kantor Cabang**: Jl. Arif Rahman Hakim No. 17, Rt.02/Rw.006, Beji, Kota Depok, Jawa Barat.
- **Hotline 24 Jam**: +62 812-8888-0199
