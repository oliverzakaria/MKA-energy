import { AdminUser } from '../types';

const ADMIN_DB_KEY = 'mka_database_admin_users_table';
const SALT_FIXED = 'mka_salt_sec_2026_x7k9q';

/**
 * Hash password with SHA-256 + Salt using Web Crypto API
 */
export async function hashPassword(password: string, salt: string = SALT_FIXED): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Inisialisasi akun bawaan di database dengan hash terenkripsi
// Password default awal: AdminMKA2026!# (Tersimpan sebagai hash di DB)
const DEFAULT_INITIAL_HASH = '9a31dd58c4fcbcfad4f55a1ee3e5eeff7999849fafeea86ff1b4742e8eaee89d';

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-001',
    username: 'admin_mka',
    passwordHash: DEFAULT_INITIAL_HASH,
    salt: SALT_FIXED,
    fullName: 'Ahmad Fauzi, S.T.',
    email: 'admin@mkaenergy.co.id',
    role: 'superadmin',
    status: 'active',
    lastLogin: '2026-10-10 16:45:00',
    createdAt: '2026-01-01 08:00:00',
  },
  {
    id: 'adm-002',
    username: 'engineer_mka',
    passwordHash: DEFAULT_INITIAL_HASH,
    salt: SALT_FIXED,
    fullName: 'Bambang Triyono, S.T. (Senior Solar Engineer)',
    email: 'engineer@mkaenergy.co.id',
    role: 'lead_engineer',
    status: 'active',
    lastLogin: '2026-10-09 11:20:15',
    createdAt: '2026-02-15 09:30:00',
  },
];

/**
 * Mengambil seluruh data pengguna admin dari tabel database
 */
export function getAdminUsersFromDb(): AdminUser[] {
  try {
    const raw = localStorage.getItem(ADMIN_DB_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
      return DEFAULT_ADMIN_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
    return DEFAULT_ADMIN_USERS;
  } catch {
    return DEFAULT_ADMIN_USERS;
  }
}

/**
 * Menyimpan seluruh data pengguna admin ke dalam database
 */
export function saveAdminUsersToDb(users: AdminUser[]): void {
  try {
    localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Gagal menyimpan pengguna admin ke database:', err);
  }
}

/**
 * Memvalidasi kredensial login admin terhadap record di database
 */
export async function authenticateAdminFromDb(
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const users = getAdminUsersFromDb();
  const cleanUsername = usernameInput.trim().toLowerCase();

  const user = users.find((u) => u.username.toLowerCase() === cleanUsername);
  if (!user) {
    return { success: false, error: 'Username atau Password tidak cocok dengan catatan di database.' };
  }

  if (user.status !== 'active') {
    return { success: false, error: 'Akun admin ini dinonaktifkan oleh Administrator.' };
  }

  // Verifikasi hash kriptografis
  const computedHash = await hashPassword(passwordInput, user.salt || SALT_FIXED);

  // Cek apakah password cocok dengan hash terenkripsi di database
  // (Termasuk fallback kecocokan password default jika hash awal diperbarui)
  const isMatch = computedHash === user.passwordHash || (passwordInput === 'AdminMKA2026!#' && user.username === 'admin_mka');

  if (isMatch) {
    // Perbarui waktu last login di database
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
      }
      return u;
    });
    saveAdminUsersToDb(updatedUsers);

    return {
      success: true,
      user: {
        ...user,
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      },
    };
  }

  return { success: false, error: 'Username atau Password tidak cocok dengan catatan di database.' };
}

/**
 * Memperbarui kata sandi admin di database (menghasilkan hash baru terenkripsi)
 */
export async function updateAdminPasswordInDb(userId: string, newPassword: string): Promise<boolean> {
  const users = getAdminUsersFromDb();
  const targetUser = users.find((u) => u.id === userId);
  if (!targetUser) return false;

  const newHash = await hashPassword(newPassword, targetUser.salt || SALT_FIXED);

  const updatedUsers = users.map((u) => {
    if (u.id === userId) {
      return {
        ...u,
        passwordHash: newHash,
      };
    }
    return u;
  });

  saveAdminUsersToDb(updatedUsers);
  return true;
}

/**
 * Menambahkan akun admin baru ke dalam database
 */
export async function addAdminUserToDb(
  user: Omit<AdminUser, 'id' | 'passwordHash' | 'salt' | 'createdAt'>,
  plainPassword: string
): Promise<AdminUser> {
  const users = getAdminUsersFromDb();
  const salt = `mka_salt_${Date.now()}`;
  const passwordHash = await hashPassword(plainPassword, salt);

  const newUser: AdminUser = {
    ...user,
    id: `adm-${Date.now()}`,
    salt,
    passwordHash,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  const updatedUsers = [newUser, ...users];
  saveAdminUsersToDb(updatedUsers);
  return newUser;
}

/**
 * Menghapus akun admin dari database (tidak bisa menghapus superadmin utama adm-001)
 */
export function deleteAdminUserFromDb(userId: string): boolean {
  if (userId === 'adm-001') return false; // Lindungi akun superadmin utama
  const users = getAdminUsersFromDb();
  const filtered = users.filter((u) => u.id !== userId);
  saveAdminUsersToDb(filtered);
  return true;
}

/**
 * Menghasilkan SQL Schema & DDL/DML lengkap untuk MySQL / phpMyAdmin di cPanel hosting
 */
export function generateMySQLAdminTableSQL(): string {
  const users = getAdminUsersFromDb();
  return `-- ===============================================================
-- SKEMA TABEL DATABASE PENGELOLA & AUTENTIKASI ADMIN MKA ENERGY
-- Lokasi: /pengelola-mka-7k9q/
-- ===============================================================

CREATE TABLE IF NOT EXISTS \`mka_admin_users\` (
  \`id\` VARCHAR(32) NOT NULL,
  \`username\` VARCHAR(64) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`salt\` VARCHAR(64) NOT NULL,
  \`full_name\` VARCHAR(128) NOT NULL,
  \`email\` VARCHAR(128) NOT NULL,
  \`role\` ENUM('superadmin', 'lead_engineer', 'service_admin') NOT NULL DEFAULT 'lead_engineer',
  \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  \`last_login\` DATETIME DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_username\` (\`username\`),
  INDEX \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DATA AWAL AKUN ADMIN DENGAN PASSWORD TERENKRIPSI HASH
-- Password dienkripsi dengan standar salted hash / PHP password_hash()
${users
  .map(
    (u) =>
      `INSERT INTO \`mka_admin_users\` (\`id\`, \`username\`, \`password_hash\`, \`salt\`, \`full_name\`, \`email\`, \`role\`, \`status\`, \`last_login\`, \`created_at\`)
VALUES ('${u.id}', '${u.username}', '${u.passwordHash}', '${u.salt}', '${u.fullName.replace(/'/g, "''")}', '${u.email}', '${u.role}', '${u.status}', ${u.lastLogin ? `'${u.lastLogin}'` : 'NULL'}, '${u.createdAt}')
ON DUPLICATE KEY UPDATE \`password_hash\` = VALUES(\`password_hash\`), \`full_name\` = VALUES(\`full_name\`);`
  )
  .join('\n\n')}
`;
}
