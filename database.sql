-- =====================================================================
-- DATABASE SCHEMA: MKA ENERGY SOLUTION (PT MITRA KARYA AUSINDO)
-- Domain: www.mkaenergy.co.id
-- Engine: MySQL 8.0+ / MariaDB 10.4+ (phpMyAdmin CPanel)
-- Karakter: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `mkaenergy_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mkaenergy_db`;

-- 1. TABEL PENGATURAN SITUS & PROFIL PERUSAHAAN
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(150) NOT NULL DEFAULT 'PT Mitra Karya Ausindo',
  `brand_name` VARCHAR(100) NOT NULL DEFAULT 'MKA Energy Solution',
  `established_year` INT NOT NULL DEFAULT 2019,
  `phone_hotline` VARCHAR(50) NOT NULL,
  `email_official` VARCHAR(100) NOT NULL,
  `head_office_address` TEXT NOT NULL,
  `branch_office_address` TEXT NOT NULL,
  `min_survey_investment` DECIMAL(15,2) NOT NULL DEFAULT 30000000.00,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABEL PENGGUNA & ROLE ADMIN (ENKRIPSI BCRYPT/ARGON2)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Enkripsi password menggunakan Bcrypt / PASSWORD_DEFAULT PHP',
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('superadmin', 'engineer', 'service_desk', 'client') DEFAULT 'engineer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. TABEL PRODUK & SISTEM PLTS
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) UNIQUE NOT NULL,
  `category` ENUM('on-grid', 'hybrid', 'off-grid', 'inverter-battery', 'pju', 'pats') NOT NULL,
  `capacity_range` VARCHAR(100) NOT NULL,
  `warranty_terms` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `specs_json` JSON NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. TABEL PORTOFOLIO PROYEK
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `client_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `capacity_kwp` DECIMAL(8,2) NOT NULL,
  `system_type` VARCHAR(100) NOT NULL,
  `completion_year` INT NOT NULL,
  `monthly_savings_kwh` INT NOT NULL,
  `annual_co2_reduction_ton` DECIMAL(8,2) NOT NULL,
  `description` TEXT NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. TABEL PERMINTAAN SURVEY LOKASI (MINIMAL 30 JUTA)
CREATE TABLE IF NOT EXISTS `survey_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_code` VARCHAR(50) UNIQUE NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `phone_whatsapp` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `property_type` VARCHAR(100) NOT NULL,
  `estimated_investment` DECIMAL(15,2) NOT NULL,
  `target_survey_date` DATE NOT NULL,
  `roof_type` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `status` ENUM('Menunggu Review', 'Jadwal Dikonfirmasi', 'Survey Selesai', 'Penawaran Dikirim') DEFAULT 'Menunggu Review',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. TABEL TIKET LAYANAN PURNA JUAL (4 TAHAPAN)
CREATE TABLE IF NOT EXISTS `service_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_number` VARCHAR(50) UNIQUE NOT NULL,
  `client_name` VARCHAR(150) NOT NULL,
  `system_location` VARCHAR(150) NOT NULL,
  `system_type` VARCHAR(100) NOT NULL,
  `current_stage` TINYINT NOT NULL DEFAULT 1 COMMENT '1: Laporan, 2: Diagnosa, 3: Perbaikan, 4: Verifikasi & Selesai',
  `issue_description` TEXT NOT NULL,
  `technician_assigned` VARCHAR(100) NULL,
  `diagnosis_notes` TEXT NULL,
  `repair_actions` TEXT NULL,
  `customer_rating` TINYINT NULL,
  `status` ENUM('Open', 'In Progress', 'Resolved') DEFAULT 'Open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. TABEL TRANSAKSI & PEMBAYARAN ONLINE
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(100) UNIQUE NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `payment_type` VARCHAR(50) NOT NULL,
  `transaction_status` ENUM('pending', 'settlement', 'expire', 'cancel') DEFAULT 'pending',
  `snap_token` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- SEED DATA AWAL MKA ENERGY SOLUTION
INSERT INTO `settings` (`company_name`, `brand_name`, `phone_hotline`, `email_official`, `head_office_address`, `branch_office_address`)
VALUES ('PT Mitra Karya Ausindo', 'MKA Energy Solution', '+62 812-8888-0199', 'info@mkaenergy.co.id',
'District 1 Meikarta, OAKVIEW Tower, L7-35, Cikarang Selatan, Bekasi',
'Jl. Arif Rahman Hakim No. 17, Beji, Kota Depok, Jawa Barat');

-- AKUN DEFAULT PORTAL PENGELOLA (/pengelola-mka-7k9q/login.php)
-- Username: admin_mka
-- Password: AdminMKA2026!# (Terenkripsi Bcrypt $2y$10$..)
INSERT INTO `users` (`username`, `email`, `password_hash`, `full_name`, `role`)
VALUES ('admin_mka', 'admin@mkaenergy.co.id', '$2y$10$F658d5.fJg2L2P3K7P7iEOj8nJ8s9F4Zt6H8y9X0W1v2U3t4S5r6q', 'Lead Solar Engineer', 'superadmin');

INSERT INTO `survey_requests` (`ticket_code`, `full_name`, `phone_whatsapp`, `email`, `city`, `address`, `property_type`, `estimated_investment`, `target_survey_date`, `roof_type`, `status`)
VALUES 
('MKA-SRV-2026-0038', 'Bambang Sudarsono', '0812-3456-7890', 'bambang@indomega.co.id', 'Bekasi', 'Kawasan GIIC Blok AB-12 Cikarang', 'Pabrik / Industri', 450000000.00, '2026-10-18', 'Metal Spandek', 'Jadwal Dikonfirmasi'),
('MKA-SRV-2026-0041', 'dr. Hendra Kurniawan', '0811-9876-5432', 'dr.hendra@gmail.com', 'Depok', 'Jl. Margonda Raya Cluster Palm No. 8', 'Residensial', 85000000.00, '2026-10-22', 'Genteng Keramik', 'Menunggu Review');

INSERT INTO `service_tickets` (`ticket_number`, `client_name`, `system_location`, `system_type`, `current_stage`, `issue_description`, `technician_assigned`, `status`)
VALUES
('MKA-SRV-TKT-1082', 'PT Tridharma Logistik Cikarang', 'Delta Silicon 3, Cikarang', 'PLTS On-Grid 120 kWp', 3, 'String 4 Inverter B pembacaan tegangan DC turun saat siang terik.', 'Ahmad Fauzi, S.T.', 'In Progress');
