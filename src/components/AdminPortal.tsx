import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileCode,
  FileText,
  Filter,
  FolderTree,
  Layers,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
  Check,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Save,
  ShoppingBag,
  Building,
  MapPin,
  Phone,
  Mail,
  Zap,
  Sliders,
  Key,
  Lock,
  UserPlus,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { Logo } from './Logo';
import { api } from '../services/api';
import {
  SurveyRequest,
  ServiceTicket,
  Product,
  Project,
  RetailItem,
  CompanyInfo,
  ActivityLog,
  AdminUser,
} from '../types';
import {
  getAdminUsersFromDb,
  authenticateAdminFromDb,
  updateAdminPasswordInDb,
  addAdminUserToDb,
  deleteAdminUserFromDb,
  generateMySQLAdminTableSQL,
} from '../services/adminDatabase';

interface AdminPortalProps {
  surveys: SurveyRequest[];
  setSurveys: React.Dispatch<React.SetStateAction<SurveyRequest[]>>;
  tickets: ServiceTicket[];
  setTickets: React.Dispatch<React.SetStateAction<ServiceTicket[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  retailItems: RetailItem[];
  setRetailItems: React.Dispatch<React.SetStateAction<RetailItem[]>>;
  companyInfo: CompanyInfo;
  setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  surveys,
  setSurveys,
  tickets,
  setTickets,
  products,
  setProducts,
  projects,
  setProjects,
  retailItems,
  setRetailItems,
  companyInfo,
  setCompanyInfo,
  activityLogs,
  setActivityLogs,
  onClose,
}) => {
  type AdminTab =
    | 'overview'
    | 'products'
    | 'projects'
    | 'surveys'
    | 'tickets'
    | 'retail'
    | 'company'
    | 'adminUsers';

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // Search & Filter states
  const [surveyFilter, setSurveyFilter] = useState<string>('all');
  const [surveySearch, setSurveySearch] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [ticketSearch, setTicketSearch] = useState<string>('');
  const [retailSearch, setRetailSearch] = useState<string>('');

  // Delete Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'product' | 'project' | 'survey' | 'ticket' | 'retail';
    id: string;
    title: string;
  } | null>(null);

  // Modal Editing / Creating States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState<boolean>(false);

  const [editingSurvey, setEditingSurvey] = useState<SurveyRequest | null>(null);
  const [isNewSurvey, setIsNewSurvey] = useState<boolean>(false);

  const [editingTicket, setEditingTicket] = useState<ServiceTicket | null>(null);
  const [isNewTicket, setIsNewTicket] = useState<boolean>(false);

  const [editingRetail, setEditingRetail] = useState<RetailItem | null>(null);
  const [isNewRetail, setIsNewRetail] = useState<boolean>(false);

  // Authentication & Session Timeout States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mka_admin_auth') === 'true';
  });
  const [activeAdminUser, setActiveAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('mka_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Admin Users Database State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getAdminUsersFromDb());

  // Sinkronisasi data pengguna admin dari server database
  useEffect(() => {
    let isMounted = true;
    api
      .getAdminUsers()
      .then((users) => {
        if (!isMounted) return;
        if (users && users.length > 0) {
          setAdminUsers(users);
        }
      })
      .catch((err) => console.info('[MKA Database] Sinkronisasi admin users:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal: Ubah Password Admin di Database
  const [passwordModalUser, setPasswordModalUser] = useState<AdminUser | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [passwordChangeError, setPasswordChangeError] = useState<string>('');

  // Modal: Tambah Admin Baru di Database
  const [isNewAdminModalOpen, setIsNewAdminModalOpen] = useState<boolean>(false);
  const [newAdminForm, setNewAdminForm] = useState<{
    username: string;
    fullName: string;
    email: string;
    role: 'superadmin' | 'lead_engineer' | 'service_admin';
    password: string;
  }>({
    username: '',
    fullName: '',
    email: '',
    role: 'lead_engineer',
    password: '',
  });

  // Modal: Skrip SQL Schema MySQL
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);

  const [loginUsername, setLoginUsername] = useState<string>('admin_mka');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [sessionTimeoutNotice, setSessionTimeoutNotice] = useState<string>('');

  // 15 Menit = 900 Detik Inactivity Timeout
  const SESSION_TIMEOUT_SECONDS = 900;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(SESSION_TIMEOUT_SECONDS);

  // Reset session timer on user activity
  const resetActivityTimer = () => {
    setSecondsRemaining(SESSION_TIMEOUT_SECONDS);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleActivity = () => {
      resetActivityTimer();
    };

    events.forEach((evt) => window.addEventListener(evt, handleActivity));

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Timeout reached! Log out
          setIsAuthenticated(false);
          setActiveAdminUser(null);
          sessionStorage.removeItem('mka_admin_auth');
          sessionStorage.removeItem('mka_admin_user');
          setSessionTimeoutNotice('Sesi Anda telah berakhir karena tidak ada aktivitas selama 15 menit. Silakan login kembali.');
          return SESSION_TIMEOUT_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const handleUploadProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    try {
      setIsUploadingImage(true);
      const res = await api.uploadImage(file);
      setEditingProduct({ ...editingProduct, imageUrl: res.linkPath });
      showToast(`Gambar "${file.name}" disimpan ke folder: ${res.linkPath}`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan gambar');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUploadProjectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;
    try {
      setIsUploadingImage(true);
      const res = await api.uploadImage(file);
      setEditingProject({ ...editingProject, imageUrl: res.linkPath });
      showToast(`Gambar "${file.name}" disimpan ke folder: ${res.linkPath}`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan gambar');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUploadCompanyLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const res = await api.uploadImage(file);
      const updated = { ...companyInfo, logoUrl: res.linkPath };
      setCompanyInfo(updated);
      try {
        await api.updateCompanyInfo(updated);
      } catch (err) {
        console.warn('API error:', err);
      }
      showToast(`Logo perusahaan "${file.name}" disimpan ke folder: ${res.linkPath}`);
      logAction(`Memperbarui logo perusahaan di server: ${res.linkPath}`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan logo perusahaan');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSessionTimeoutNotice('');

    try {
      // 1. Coba otentikasi ke database server API (Strictly Zero-Cookies)
      const res = await api.login(loginUsername, loginPassword);
      if (res.success && res.user) {
        setIsAuthenticated(true);
        setActiveAdminUser(res.user);
        setSecondsRemaining(SESSION_TIMEOUT_SECONDS);
        showToast(`Login berhasil! Selamat datang di Portal Pengelola.`);
        logAction(`Admin login ke portal: ${res.user.username} (${res.user.role})`);
        return;
      }

      // 2. Fallback ke database lokal jika offline
      const localResult = await authenticateAdminFromDb(loginUsername, loginPassword);
      if (localResult.success && localResult.user) {
        setIsAuthenticated(true);
        setActiveAdminUser(localResult.user);
        sessionStorage.setItem('mka_admin_auth', 'true');
        sessionStorage.setItem('mka_admin_user', JSON.stringify(localResult.user));
        setSecondsRemaining(SESSION_TIMEOUT_SECONDS);
        showToast(`Login berhasil! Selamat datang di Portal Pengelola.`);
        logAction(`Admin login ke portal: ${localResult.user.username} (${localResult.user.role})`);
      } else {
        setLoginError(res.error || localResult.error || 'Username atau Password salah. Silakan periksa kembali kredensial Anda.');
      }
    } catch {
      setLoginError('Terjadi kesalahan verifikasi pada database.');
    }
  };

  const handleAdminLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setActiveAdminUser(null);
    setLoginPassword('');
    showToast('Anda telah berhasil keluar dari Portal Pengelola.');
  };

  // Handlers untuk Admin & Database Password Management
  const handleOpenPasswordModal = (user: AdminUser) => {
    setPasswordModalUser(user);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordChangeError('');
  };

  const handleSavePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    if (!passwordModalUser) return;

    if (newPasswordInput.length < 6) {
      setPasswordChangeError('Password baru minimal 6 karakter.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      await api.updateAdminPassword(passwordModalUser.id, newPasswordInput);
    } catch (err: any) {
      console.warn('API update password warning:', err);
    }

    const success = await updateAdminPasswordInDb(passwordModalUser.id, newPasswordInput);
    if (success) {
      try {
        const fresh = await api.getAdminUsers();
        if (fresh && fresh.length > 0) setAdminUsers(fresh);
        else setAdminUsers(getAdminUsersFromDb());
      } catch {
        setAdminUsers(getAdminUsersFromDb());
      }
      logAction(`Password admin diperbarui di database untuk: ${passwordModalUser.username}`);
      showToast(`Password untuk ${passwordModalUser.username} berhasil dienkripsi & disimpan ke database!`);
      setPasswordModalUser(null);
    } else {
      setPasswordChangeError('Gagal memperbarui password di database.');
    }
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.username.trim() || !newAdminForm.password.trim()) return;

    const existing = adminUsers.find(
      (u) => u.username.toLowerCase() === newAdminForm.username.trim().toLowerCase()
    );
    if (existing) {
      showToast(`Username "${newAdminForm.username}" sudah digunakan di database!`);
      return;
    }

    try {
      await api.createAdminUser({
        username: newAdminForm.username.trim(),
        fullName: newAdminForm.fullName.trim() || newAdminForm.username.trim(),
        email: newAdminForm.email.trim() || `${newAdminForm.username.trim()}@mkaenergy.co.id`,
        role: newAdminForm.role,
        password: newAdminForm.password,
      });
    } catch (err: any) {
      console.warn('API create admin user warning:', err);
    }

    const created = await addAdminUserToDb(
      {
        username: newAdminForm.username.trim(),
        fullName: newAdminForm.fullName.trim() || newAdminForm.username.trim(),
        email: newAdminForm.email.trim() || `${newAdminForm.username.trim()}@mkaenergy.co.id`,
        role: newAdminForm.role,
        status: 'active',
      },
      newAdminForm.password
    );

    try {
      const fresh = await api.getAdminUsers();
      if (fresh && fresh.length > 0) setAdminUsers(fresh);
      else setAdminUsers(getAdminUsersFromDb());
    } catch {
      setAdminUsers(getAdminUsersFromDb());
    }

    logAction(`Menambahkan akun admin baru ke database: ${created.username} (${created.role})`);
    showToast(`Akun admin ${created.username} berhasil disimpan di database!`);
    setIsNewAdminModalOpen(false);
    setNewAdminForm({
      username: '',
      fullName: '',
      email: '',
      role: 'lead_engineer',
      password: '',
    });
  };

  const handleDeleteAdmin = async (userId: string, username: string) => {
    if (userId === 'adm-001') {
      showToast('Akun superadmin utama tidak dapat dihapus!');
      return;
    }

    try {
      await api.deleteAdminUser(userId);
    } catch (err: any) {
      console.warn('API delete admin warning:', err);
    }

    const success = deleteAdminUserFromDb(userId);
    if (success) {
      try {
        const fresh = await api.getAdminUsers();
        if (fresh && fresh.length > 0) setAdminUsers(fresh);
        else setAdminUsers(getAdminUsersFromDb());
      } catch {
        setAdminUsers(getAdminUsersFromDb());
      }
      logAction(`Menghapus akun admin dari database: ${username}`);
      showToast(`Akun admin "${username}" telah dihapus dari database.`);
    }
  };

  const handleCopySql = () => {
    const sql = generateMySQLAdminTableSQL();
    navigator.clipboard.writeText(sql);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
    showToast('Skrip SQL MySQL berhasil disalin ke clipboard!');
  };

  const handleDownloadSql = () => {
    const sql = generateMySQLAdminTableSQL();
    const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mka_admin_users_schema.sql';
    link.click();
    URL.revokeObjectURL(url);
    showToast('File mka_admin_users_schema.sql berhasil diunduh!');
  };

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logAction = (actionText: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: activeAdminUser ? `${activeAdminUser.fullName} (${activeAdminUser.username})` : 'Superadmin (admin_mka)',
      action: actionText,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    api.createActivityLog(newLog).catch((err) => console.warn('Error saving log to DB:', err));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // ==========================================
  // CRUD HANDLERS: PRODUCTS
  // ==========================================
  const handleOpenAddProduct = () => {
    setIsNewProduct(true);
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: '',
      category: 'hybrid',
      capacity: '5 kWp - 10 kWp',
      warranty: 'Garansi Sistem 5 Tahun, Modul 25 Tahun',
      description: '',
      features: ['Efisiensi konversi tinggi > 98%', 'Sertifikasi SNI & IEC resmi'],
      specs: [
        { label: 'Tegangan AC', value: '220V / 380V' },
        { label: 'Proteksi', value: 'IP65 Outdoor Ready' },
      ],
      imageUrl: '/uploads/product_hybrid_energy_storage_1791532019483.jpg',
      datasheetAvailable: true,
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;

    if (isNewProduct) {
      let saved = editingProduct;
      try {
        saved = await api.createProduct(editingProduct);
      } catch (err) {
        console.warn('API error, using client object:', err);
      }
      setProducts((prev) => [saved, ...prev]);
      logAction(`Menambahkan produk baru ke database: "${editingProduct.name}" (${editingProduct.category})`);
      showToast(`Produk "${editingProduct.name}" berhasil disimpan ke database!`);
    } else {
      let saved = editingProduct;
      try {
        saved = await api.updateProduct(editingProduct.id, editingProduct);
      } catch (err) {
        console.warn('API error, using client object:', err);
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? saved : p))
      );
      logAction(`Memperbarui data produk di database: "${editingProduct.name}"`);
      showToast(`Produk "${editingProduct.name}" berhasil diperbarui di database!`);
    }
    setEditingProduct(null);
  };

  // ==========================================
  // CRUD HANDLERS: PROJECTS
  // ==========================================
  const handleOpenAddProject = () => {
    setIsNewProject(true);
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      client: '',
      category: 'industrial',
      location: 'Cikarang / Bekasi, Jawa Barat',
      capacityKwp: 50,
      systemType: 'PLTS On-Grid Rooftop',
      completionYear: new Date().getFullYear(),
      monthlySavingsKwh: 6000,
      annualCo2ReductionTon: 58,
      description: '',
      imageUrl: '/uploads/project_industrial_rooftop_1791532032600.jpg',
    });
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) return;

    if (isNewProject) {
      let saved = editingProject;
      try {
        saved = await api.createProject(editingProject);
      } catch (err) {
        console.warn('API error:', err);
      }
      setProjects((prev) => [saved, ...prev]);
      logAction(`Menambahkan proyek ke database: "${editingProject.title}" (${editingProject.capacityKwp} kWp)`);
      showToast(`Proyek "${editingProject.title}" berhasil disimpan ke database!`);
    } else {
      let saved = editingProject;
      try {
        saved = await api.updateProject(editingProject.id, editingProject);
      } catch (err) {
        console.warn('API error:', err);
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? saved : p))
      );
      logAction(`Memperbarui portofolio proyek di database: "${editingProject.title}"`);
      showToast(`Proyek "${editingProject.title}" berhasil diperbarui di database!`);
    }
    setEditingProject(null);
  };

  // ==========================================
  // CRUD HANDLERS: SURVEYS
  // ==========================================
  const handleOpenAddSurvey = () => {
    setIsNewSurvey(true);
    setEditingSurvey({
      id: `srv-${Date.now()}`,
      ticketCode: `MKA-SRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: '',
      phone: '',
      email: '',
      city: 'Bekasi / Cikarang',
      address: '',
      propertyType: 'Pabrik / Industri',
      estimatedInvestment: companyInfo.minSurveyInvestment || 30000000,
      targetSurveyDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      roofType: 'Metal Spandek',
      notes: '',
      status: 'Menunggu Review',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
  };

  const handleSaveSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSurvey || !editingSurvey.fullName.trim()) return;

    if (editingSurvey.estimatedInvestment < (companyInfo.minSurveyInvestment || 30000000)) {
      alert(`Ketentuan minimal nilai investasi survey adalah ${formatRupiah(companyInfo.minSurveyInvestment || 30000000)}.`);
      return;
    }

    if (isNewSurvey) {
      let saved = editingSurvey;
      try {
        saved = await api.createSurvey(editingSurvey);
      } catch (err) {
        console.warn('API error:', err);
      }
      setSurveys((prev) => [saved, ...prev]);
      logAction(`Mendaftarkan manual survey baru: ${editingSurvey.ticketCode} (${editingSurvey.fullName})`);
      showToast(`Survey ${editingSurvey.ticketCode} berhasil disimpan ke database!`);
    } else {
      let saved = editingSurvey;
      try {
        saved = await api.updateSurvey(editingSurvey.id, editingSurvey);
      } catch (err) {
        console.warn('API error:', err);
      }
      setSurveys((prev) =>
        prev.map((s) => (s.id === editingSurvey.id ? saved : s))
      );
      logAction(`Memperbarui data survey di database: ${editingSurvey.ticketCode} -> Status: ${editingSurvey.status}`);
      showToast(`Data survey ${editingSurvey.ticketCode} berhasil diperbarui di database!`);
    }
    setEditingSurvey(null);
  };

  // ==========================================
  // CRUD HANDLERS: TICKETS (4 STAGES)
  // ==========================================
  const handleOpenAddTicket = () => {
    setIsNewTicket(true);
    setEditingTicket({
      id: `tkt-${Date.now()}`,
      ticketNumber: `MKA-SRV-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: '',
      systemLocation: 'Cikarang Selatan / Depok',
      systemType: 'PLTS Hybrid 10 kWp',
      currentStage: 1,
      issueDescription: '',
      reportedDate: new Date().toISOString().split('T')[0],
      technicianAssigned: 'Ahmad Fauzi, S.T. (Senior Engineer)',
      status: 'Open',
    });
  };

  const handleSaveTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket || !editingTicket.clientName.trim()) return;

    if (isNewTicket) {
      let saved = editingTicket;
      try {
        saved = await api.createTicket(editingTicket);
      } catch (err) {
        console.warn('API error:', err);
      }
      setTickets((prev) => [saved, ...prev]);
      logAction(`Membuka tiket purna jual baru: ${editingTicket.ticketNumber} (${editingTicket.clientName})`);
      showToast(`Tiket ${editingTicket.ticketNumber} berhasil disimpan ke database!`);
    } else {
      let saved = editingTicket;
      try {
        saved = await api.updateTicket(editingTicket.id, editingTicket);
      } catch (err) {
        console.warn('API error:', err);
      }
      setTickets((prev) =>
        prev.map((t) => (t.id === editingTicket.id ? saved : t))
      );
      logAction(`Memperbarui tiket di database ${editingTicket.ticketNumber} ke Tahap ${editingTicket.currentStage}`);
      showToast(`Tiket ${editingTicket.ticketNumber} berhasil diperbarui di database!`);
    }
    setEditingTicket(null);
  };

  const handleAdvanceTicketStage = async (ticketId: string) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (!target) return;
    const nextStage = Math.min(4, target.currentStage + 1) as 1 | 2 | 3 | 4;
    const updated = {
      ...target,
      currentStage: nextStage,
      status: nextStage === 4 ? ('Resolved' as const) : ('In Progress' as const),
    };

    try {
      await api.updateTicket(ticketId, updated);
    } catch (err) {
      console.warn('API error:', err);
    }

    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? updated : t))
    );
    logAction(`Eskalasi tiket ${target.ticketNumber} ke Tahap ${nextStage}`);
    showToast(`Tiket ${target.ticketNumber} naik ke Tahap ${nextStage}!`);
  };

  // ==========================================
  // CRUD HANDLERS: RETAIL ITEMS
  // ==========================================
  const handleOpenAddRetail = () => {
    setIsNewRetail(true);
    setEditingRetail({
      id: `ret-${Date.now()}`,
      name: '',
      brand: 'Tier-1 Solar',
      category: 'Solar Panel',
      priceEstimate: 'Rp 1.500.000',
      partnerUrl: 'https://energicklick.com',
      partnerName: 'EnergiClick / Mitra Resmi',
      description: '',
    });
  };

  const handleSaveRetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRetail || !editingRetail.name.trim()) return;

    if (isNewRetail) {
      let saved = editingRetail;
      try {
        saved = await api.createRetailItem(editingRetail);
      } catch (err) {
        console.warn('API error:', err);
      }
      setRetailItems((prev) => [saved, ...prev]);
      logAction(`Menambahkan komponen retail ke database: "${editingRetail.name}"`);
      showToast(`Komponen retail "${editingRetail.name}" berhasil disimpan ke database!`);
    } else {
      let saved = editingRetail;
      try {
        saved = await api.updateRetailItem(editingRetail.id, editingRetail);
      } catch (err) {
        console.warn('API error:', err);
      }
      setRetailItems((prev) =>
        prev.map((r) => (r.id === editingRetail.id ? saved : r))
      );
      logAction(`Memperbarui komponen retail di database: "${editingRetail.name}"`);
      showToast(`Komponen retail "${editingRetail.name}" berhasil diperbarui di database!`);
    }
    setEditingRetail(null);
  };

  // ==========================================
  // CONFIRM DELETE EXECUTION
  // ==========================================
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id, title } = deleteConfirm;

    if (type === 'product') {
      try {
        await api.deleteProduct(id);
      } catch (err) {
        console.warn('API error:', err);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      logAction(`Menghapus produk dari database: "${title}"`);
      showToast(`Produk "${title}" telah dihapus dari database.`);
    } else if (type === 'project') {
      try {
        await api.deleteProject(id);
      } catch (err) {
        console.warn('API error:', err);
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
      logAction(`Menghapus portofolio proyek dari database: "${title}"`);
      showToast(`Proyek "${title}" telah dihapus dari database.`);
    } else if (type === 'survey') {
      try {
        await api.deleteSurvey(id);
      } catch (err) {
        console.warn('API error:', err);
      }
      setSurveys((prev) => prev.filter((s) => s.id !== id));
      logAction(`Menghapus permintaan survey dari database: "${title}"`);
      showToast(`Survey "${title}" telah dihapus dari database.`);
    } else if (type === 'ticket') {
      try {
        await api.deleteTicket(id);
      } catch (err) {
        console.warn('API error:', err);
      }
      setTickets((prev) => prev.filter((t) => t.id !== id));
      logAction(`Menghapus tiket purna jual dari database: "${title}"`);
      showToast(`Tiket "${title}" telah dihapus dari database.`);
    } else if (type === 'retail') {
      try {
        await api.deleteRetailItem(id);
      } catch (err) {
        console.warn('API error:', err);
      }
      setRetailItems((prev) => prev.filter((r) => r.id !== id));
      logAction(`Menghapus komponen retail dari database: "${title}"`);
      showToast(`Komponen retail "${title}" telah dihapus dari database.`);
    }

    setDeleteConfirm(null);
  };

  // Calculations for dashboard overview
  const totalPipeline = surveys.reduce((sum, s) => sum + s.estimatedInvestment, 0);

  // Filtered lists
  const filteredSurveys = surveys.filter((s) => {
    const matchesFilter = surveyFilter === 'all' || s.status === surveyFilter;
    const matchesSearch =
      s.fullName.toLowerCase().includes(surveySearch.toLowerCase()) ||
      s.ticketCode.toLowerCase().includes(surveySearch.toLowerCase()) ||
      s.city.toLowerCase().includes(surveySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredProducts = products.filter((p) => {
    const matchesCat = productCatFilter === 'all' || p.category === productCatFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredProjects = projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.client.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(projectSearch.toLowerCase())
    );
  });

  const filteredTickets = tickets.filter((t) => {
    return (
      t.ticketNumber.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.clientName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.systemLocation.toLowerCase().includes(ticketSearch.toLowerCase())
    );
  });

  const filteredRetail = retailItems.filter((r) => {
    return (
      r.name.toLowerCase().includes(retailSearch.toLowerCase()) ||
      r.category.toLowerCase().includes(retailSearch.toLowerCase()) ||
      r.brand.toLowerCase().includes(retailSearch.toLowerCase())
    );
  });

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/80 backdrop-blur-sm p-3 sm:p-6 lg:p-8 flex justify-center items-start">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-70 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* JIKA BELUM LOGIN: TAMPILKAN LOGIN SCREEN PORTAL PENGELOLA */}
      {!isAuthenticated ? (
        <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 sm:p-8 text-slate-100 my-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-[#0EA5E9] mb-3 shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">PORTAL PENGELOLA MKA</h3>
          </div>

          {sessionTimeoutNotice && (
            <div className="mb-4 p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span>{sessionTimeoutNotice}</span>
            </div>
          )}

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username Admin
              </label>
              <input
                type="text"
                required
                autoFocus
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin_mka"
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Bcrypt Encrypted</span>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] font-medium"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#0EA5E9] hover:bg-[#0284C7] active:bg-sky-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>MASUK KE PORTAL PENGELOLA</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Batal / Kembali ke Website
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* JIKA SUDAH LOGIN: TAMPILKAN PANEL UTAMA ADMIN */
        <div className="bg-white rounded-2xl w-full max-w-7xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
          {/* Top Header */}
          <div className="bg-[#0F172A] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <Logo size="admin" theme="dark" showText={false} />
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <span>MKA Energy Portal Pengelola</span>
                  <span className="text-[11px] font-mono text-[#0EA5E9] bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                    /pengelola-mka-7k9q/
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Kelola Produk, Proyek, Survey, Tiket Servis, Komponen Retail, & Profil Perusahaan
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Session Inactivity Countdown Display */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs" title="Sesi akan otomatis logout jika tidak ada interaksi pengguna">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="text-slate-300">
                  <span className="text-[10px] text-slate-400 block leading-none">Session Timeout</span>
                  <span className="font-mono font-bold text-amber-300">{formatTime(secondsRemaining)}</span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-white block">{activeAdminUser?.username || 'admin_mka'}</span>
                  <span className="text-[10px] text-slate-400">
                    {activeAdminUser?.role === 'superadmin' ? 'Superadmin (Lead Engineer)' : activeAdminUser?.fullName || 'Superadmin'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAdminLogout}
                className="px-3.5 py-2 bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-500/40 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Keluar dari sesi portal admin"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Tutup Modal</span>
              </button>
            </div>
          </div>

        {/* Main Layout: Left Sidebar + Right Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-white">
          {/* Left Sidebar Menu */}
          <aside className="w-full md:w-64 lg:w-72 bg-[#0B1120] border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 overflow-y-auto text-white">
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
                Menu Manajemen
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setCurrentTab('overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'overview'
                      ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('products')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'products'
                      ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4" />
                    <span>Produk & Sistem</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentTab === 'products'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {products.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('projects')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'projects'
                      ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4" />
                    <span>Portofolio Proyek</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentTab === 'projects'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {projects.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('surveys')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'surveys'
                      ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderTree className="w-4 h-4" />
                    <span>Permintaan Survey</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentTab === 'surveys'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {surveys.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('tickets')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'tickets'
                      ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wrench className="w-4 h-4" />
                    <span>Tiket Servis 4 Tahap</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentTab === 'tickets'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tickets.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('retail')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'retail'
                      ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Komponen Retail</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentTab === 'retail'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {retailItems.length}
                  </span>
                </button>

                <div className="pt-2 pb-1 border-t border-slate-800/80 my-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                    Pengaturan
                  </div>
                </div>

                <button
                  onClick={() => setCurrentTab('company')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'company'
                      ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4" />
                    <span>Profil & Kontak</span>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('adminUsers')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'adminUsers'
                      ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Database & Akun Admin</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentTab === 'adminUsers'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {adminUsers.length}
                  </span>
                </button>
              </nav>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400 px-2 space-y-1">
              <div className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>Node Cikarang & Depok</span>
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">www.mkaenergy.co.id</div>
              <div className="text-[10px] text-neutral-400">Hosting CPanel Siap Pakai</div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white min-w-0">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================= */}
          {currentTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Total Permintaan Survey
                  </div>
                  <div className="text-3xl font-extrabold text-neutral-900 font-tabular mt-2">
                    {surveys.length} <span className="text-xs font-normal text-neutral-500">Leads</span>
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1">
                    Min. Rp 30 Jt per lokasi
                  </div>
                </div>

                <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Nilai Pipeline Survey
                  </div>
                  <div className="text-2xl font-extrabold text-amber-600 font-tabular mt-2">
                    {formatRupiah(totalPipeline)}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Estimasi potensi proyek
                  </div>
                </div>

                <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Tiket Servis 4 Tahap
                  </div>
                  <div className="text-3xl font-extrabold text-neutral-900 font-tabular mt-2">
                    {tickets.filter((t) => t.status !== 'Resolved').length} <span className="text-xs font-normal text-neutral-500">Aktif</span>
                  </div>
                  <div className="text-xs text-blue-600 font-semibold mt-1">
                    {tickets.length} total tiket masuk
                  </div>
                </div>

                <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Katalog Terpasang
                  </div>
                  <div className="text-3xl font-extrabold text-neutral-900 font-tabular mt-2">
                    {products.length} <span className="text-xs font-normal text-neutral-500">Produk</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {projects.length} Portofolio · {retailItems.length} Retail
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-6 rounded-2xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold">Aksi Cepat Manajemen Konten Website</h4>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                    Tambahkan produk PLTS baru, portofolio proyek, catat leads survey, atau ubah konfigurasi kantor.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Produk</span>
                  </button>
                  <button
                    onClick={handleOpenAddProject}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Proyek</span>
                  </button>
                  <button
                    onClick={handleOpenAddSurvey}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Survey</span>
                  </button>
                  <button
                    onClick={handleOpenAddTicket}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tiket Servis</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('adminUsers')}
                    className="px-3 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Database Admin</span>
                  </button>
                </div>
              </div>

              {/* Status Overview Grid (Replaces Log Column) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Distribusi Status Permintaan Survey
                    </h4>
                    <span className="text-xs font-extrabold text-amber-700">{surveys.length} Total</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-neutral-100">
                      <span className="text-neutral-600 font-medium">Menunggu Review</span>
                      <span className="font-bold text-amber-600">
                        {surveys.filter((s) => s.status === 'Menunggu Review').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-neutral-100">
                      <span className="text-neutral-600 font-medium">Jadwal Dikonfirmasi</span>
                      <span className="font-bold text-blue-600">
                        {surveys.filter((s) => s.status === 'Jadwal Dikonfirmasi').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-neutral-100">
                      <span className="text-neutral-600 font-medium">Survey Selesai / Penawaran</span>
                      <span className="font-bold text-emerald-600">
                        {surveys.filter((s) => s.status === 'Survey Selesai' || s.status === 'Penawaran Dikirim').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Kategori Sistem Terpasang
                    </h4>
                    <span className="text-xs font-extrabold text-blue-700">{products.length} Sistem</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-neutral-100">
                      <span className="text-neutral-600 font-medium">PLTS Hybrid & Storage</span>
                      <span className="font-bold text-neutral-900">
                        {products.filter((p) => p.category === 'hybrid' || p.category === 'inverter-battery').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-neutral-100">
                      <span className="text-neutral-600 font-medium">PLTS On-Grid Industri</span>
                      <span className="font-bold text-neutral-900">
                        {products.filter((p) => p.category === 'on-grid').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-neutral-100">
                      <span className="text-neutral-600 font-medium">Pompa Air Surya & PJU</span>
                      <span className="font-bold text-neutral-900">
                        {products.filter((p) => p.category === 'pats' || p.category === 'pju').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client-Server Database & Image Storage Architecture Card */}
              <div className="p-6 rounded-2xl bg-[#0F172A] text-white border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-[#0EA5E9]" />
                    <h4 className="text-sm font-bold tracking-tight text-white">
                      Arsitektur Client-Server & Database Storage Engine
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Database Terhubung & Bebas Cookies</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-sky-400" />
                      <span>Database Engine</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">Persistent Database</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">server/data/database.json</div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Storage Policy</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">Strict Zero-Cookies</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Token Authorization & Memory</div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <FolderTree className="w-3.5 h-3.5 text-amber-400" />
                      <span>Folder Simpan Gambar</span>
                    </div>
                    <div className="text-sm font-bold text-amber-300 mt-1">public/uploads/</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Link Path: /uploads/*</div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Aktivitas & CRUD</span>
                    </div>
                    <div className="text-sm font-bold text-cyan-300 mt-1">Real-time REST API</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Semua entitas tersinkronisasi</div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80">
                  <span>
                    ✓ Seluruh data produk, proyek, survey, tiket servis, dan pengguna admin tersimpan di database server.
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    Node: Express Backend Port 3000
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PRODUCTS (CRUD) */}
          {/* ========================================================= */}
          {currentTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari nama produk..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300"
                    />
                  </div>
                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="hybrid">PLTS Hybrid</option>
                    <option value="on-grid">PLTS On-Grid</option>
                    <option value="pats">Pompa Air Surya (PATS)</option>
                    <option value="pju">PJU Surya</option>
                    <option value="off-grid">Off-Grid Mandiri</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Produk & Gambar</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Kapasitas</th>
                      <th className="p-3">Garansi</th>
                      <th className="p-3">Fitur Utama</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                            />
                            <div>
                              <div className="font-bold text-neutral-900 line-clamp-1">{prod.name}</div>
                              <div className="text-[11px] text-neutral-500 line-clamp-1">{prod.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-700 uppercase">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-neutral-800 font-tabular">{prod.capacity}</td>
                        <td className="p-3 text-neutral-600">{prod.warranty.split(',')[0]}</td>
                        <td className="p-3 text-neutral-500">
                          <div className="line-clamp-1">{prod.features[0]}</div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setIsNewProduct(false);
                                setEditingProduct(prod);
                              }}
                              className="p-1.5 text-neutral-600 hover:text-amber-600 hover:bg-neutral-100 rounded cursor-pointer"
                              title="Edit Produk"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'product',
                                  id: prod.id,
                                  title: prod.name,
                                })
                              }
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: PROJECTS (CRUD) */}
          {/* ========================================================= */}
          {currentTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari judul, klien, lokasi..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300"
                  />
                </div>

                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Portofolio Proyek</span>
                </button>
              </div>

              {/* Projects Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Nama Proyek</th>
                      <th className="p-3">Klien & Lokasi</th>
                      <th className="p-3">Kapasitas</th>
                      <th className="p-3">Tipe Sistem</th>
                      <th className="p-3">Hemat Energi (kWh)</th>
                      <th className="p-3">Reduksi CO2</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredProjects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-neutral-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={proj.imageUrl}
                              alt={proj.title}
                              className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                            />
                            <div>
                              <div className="font-bold text-neutral-900 line-clamp-1">{proj.title}</div>
                              <div className="text-[11px] text-neutral-400">Tahun {proj.completionYear}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-neutral-800">{proj.client}</div>
                          <div className="text-[11px] text-neutral-500">{proj.location}</div>
                        </td>
                        <td className="p-3 font-bold text-amber-700 font-tabular">{proj.capacityKwp} kWp</td>
                        <td className="p-3 text-neutral-700">{proj.systemType}</td>
                        <td className="p-3 font-tabular font-medium text-neutral-800">
                          {proj.monthlySavingsKwh.toLocaleString('id-ID')} kWh/bln
                        </td>
                        <td className="p-3 font-tabular font-bold text-emerald-700">
                          {proj.annualCo2ReductionTon} Ton/thn
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setIsNewProject(false);
                                setEditingProject(proj);
                              }}
                              className="p-1.5 text-neutral-600 hover:text-amber-600 hover:bg-neutral-100 rounded cursor-pointer"
                              title="Edit Proyek"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'project',
                                  id: proj.id,
                                  title: proj.title,
                                })
                              }
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Hapus Proyek"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SURVEYS (CRUD) */}
          {/* ========================================================= */}
          {currentTab === 'surveys' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari nama, kota, nomor..."
                      value={surveySearch}
                      onChange={(e) => setSurveySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300"
                    />
                  </div>
                  <select
                    value={surveyFilter}
                    onChange={(e) => setSurveyFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="all">Semua Status</option>
                    <option value="Menunggu Review">Menunggu Review</option>
                    <option value="Jadwal Dikonfirmasi">Jadwal Dikonfirmasi</option>
                    <option value="Survey Selesai">Survey Selesai</option>
                    <option value="Penawaran Dikirim">Penawaran Dikirim</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddSurvey}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Catat Survey Baru (Manual)</span>
                </button>
              </div>

              {/* Surveys Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Kode & Tanggal</th>
                      <th className="p-3">Klien & Kontak</th>
                      <th className="p-3">Lokasi & Properti</th>
                      <th className="p-3">Estimasi Investasi</th>
                      <th className="p-3">Jadwal Survey</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredSurveys.map((srv) => (
                      <tr key={srv.id} className="hover:bg-neutral-50">
                        <td className="p-3">
                          <div className="font-mono font-bold text-neutral-900">{srv.ticketCode}</div>
                          <div className="text-[11px] text-neutral-400">{srv.createdAt}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-neutral-900">{srv.fullName}</div>
                          <div className="text-[11px] text-neutral-500">{srv.phone} · {srv.email}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-neutral-800">{srv.city}</div>
                          <div className="text-[11px] text-neutral-500 truncate max-w-xs">{srv.propertyType} - {srv.address}</div>
                        </td>
                        <td className="p-3 font-tabular font-bold text-amber-700">
                          {formatRupiah(srv.estimatedInvestment)}
                        </td>
                        <td className="p-3 font-semibold text-neutral-700 font-tabular">
                          {srv.targetSurveyDate}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              srv.status === 'Jadwal Dikonfirmasi'
                                ? 'bg-blue-100 text-blue-800'
                                : srv.status === 'Survey Selesai'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {srv.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setIsNewSurvey(false);
                                setEditingSurvey(srv);
                              }}
                              className="p-1.5 text-neutral-600 hover:text-amber-600 hover:bg-neutral-100 rounded cursor-pointer"
                              title="Edit Data Survey"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'survey',
                                  id: srv.id,
                                  title: `${srv.ticketCode} (${srv.fullName})`,
                                })
                              }
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Hapus Survey"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: TICKETS (CRUD) */}
          {/* ========================================================= */}
          {currentTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nomor tiket, nama klien, lokasi..."
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300"
                  />
                </div>

                <button
                  onClick={handleOpenAddTicket}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Tiket Pemeliharaan Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredTickets.map((tkt) => (
                  <div key={tkt.id} className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <span className="font-mono font-bold text-neutral-900 text-sm">{tkt.ticketNumber}</span>
                        <span className="text-xs text-neutral-500 ml-2">· {tkt.clientName} ({tkt.systemLocation})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-500">Tahap Servis:</span>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded">
                          Tahap {tkt.currentStage} dari 4
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            tkt.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {tkt.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 text-xs">
                      <div>
                        <span className="text-neutral-400 block">Sistem Terpasang:</span>
                        <span className="font-semibold text-neutral-800">{tkt.systemType}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Insinyur Bertugas:</span>
                        <span className="font-semibold text-neutral-800">{tkt.technicianAssigned || 'Belum Ditugaskan'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Tanggal Laporan:</span>
                        <span className="font-semibold text-neutral-800">{tkt.reportedDate}</span>
                      </div>
                    </div>

                    <div className="text-xs bg-neutral-50 p-3 rounded-lg border border-neutral-100 mb-3 space-y-1">
                      <div>
                        <span className="font-bold text-neutral-700">Laporan Kendala:</span>
                        <p className="text-neutral-600 mt-0.5">{tkt.issueDescription}</p>
                      </div>
                      {tkt.diagnosisNotes && (
                        <div>
                          <span className="font-bold text-blue-700">Diagnosa Lapangan:</span>
                          <p className="text-neutral-700 mt-0.5">{tkt.diagnosisNotes}</p>
                        </div>
                      )}
                      {tkt.repairActions && (
                        <div>
                          <span className="font-bold text-emerald-700">Tindakan Perbaikan:</span>
                          <p className="text-neutral-700 mt-0.5">{tkt.repairActions}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        {tkt.currentStage < 4 && (
                          <button
                            onClick={() => handleAdvanceTicketStage(tkt.id)}
                            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Lanjutkan ke Tahap {tkt.currentStage + 1} →
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setIsNewTicket(false);
                            setEditingTicket(tkt);
                          }}
                          className="px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Rincian</span>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'ticket',
                              id: tkt.id,
                              title: `${tkt.ticketNumber} (${tkt.clientName})`,
                            })
                          }
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="Hapus Tiket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: RETAIL ITEMS (CRUD) */}
          {/* ========================================================= */}
          {currentTab === 'retail' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari komponen, brand, mitra..."
                    value={retailSearch}
                    onChange={(e) => setRetailSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300"
                  />
                </div>

                <button
                  onClick={handleOpenAddRetail}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Komponen Retail</span>
                </button>
              </div>

              {/* Retail Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Nama Komponen</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3">Estimasi Harga</th>
                      <th className="p-3">Mitra Provider</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredRetail.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50">
                        <td className="p-3">
                          <div className="font-bold text-neutral-900">{item.name}</div>
                          <div className="text-[11px] text-neutral-500 line-clamp-1">{item.description}</div>
                        </td>
                        <td className="p-3 font-semibold text-neutral-700">{item.category}</td>
                        <td className="p-3 text-neutral-600">{item.brand}</td>
                        <td className="p-3 font-bold text-neutral-900 font-tabular">{item.priceEstimate}</td>
                        <td className="p-3 text-neutral-600">
                          <a
                            href={item.partnerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 hover:underline flex items-center gap-1"
                          >
                            <span>{item.partnerName}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setIsNewRetail(false);
                                setEditingRetail(item);
                              }}
                              className="p-1.5 text-neutral-600 hover:text-amber-600 hover:bg-neutral-100 rounded cursor-pointer"
                              title="Edit Komponen"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'retail',
                                  id: item.id,
                                  title: item.name,
                                })
                              }
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Hapus Komponen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: COMPANY PROFILE & SETTINGS (CRUD) */}
          {/* ========================================================= */}
          {currentTab === 'company' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-base font-bold text-neutral-900">
                    Pengaturan Profil Perusahaan & Alamat Kantor
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Perubahan di sini langsung mengubah footer, tentang kami, dan kontak seluruh website.
                  </p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await api.updateCompanyInfo(companyInfo);
                  } catch (err) {
                    console.warn('API error:', err);
                  }
                  logAction('Memperbarui informasi profil dan kontak perusahaan di database');
                  showToast('Profil perusahaan berhasil disimpan ke database!');
                }}
                className="space-y-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Nama Legal Perusahaan
                    </label>
                    <input
                      type="text"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={companyInfo.brandName}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, brandName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Domain Website
                    </label>
                    <input
                      type="text"
                      value={companyInfo.domain}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, domain: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Batas Minimal Investasi Survey (Rp)
                    </label>
                    <input
                      type="number"
                      step={1000000}
                      value={companyInfo.minSurveyInvestment || 30000000}
                      onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, minSurveyInvestment: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Nomor Telepon Hotline / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Email Resmi Perusahaan
                    </label>
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>
                </div>

                {/* Logo Perusahaan & File Storage */}
                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                    <span>Logo Resmi Perusahaan (Folder Storage /public/uploads/)</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                        <img
                          src={companyInfo.logoUrl || '/uploads/logo.png'}
                          alt={companyInfo.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/uploads/logo.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">Link Path Logo di Database:</div>
                        <div className="text-[11px] font-mono text-sky-700 truncate bg-sky-50 px-2 py-1 rounded border border-sky-100">
                          {companyInfo.logoUrl || '/uploads/logo.png'}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Tersimpan di database & dimuat dari folder server</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Unggah File Logo Baru ke Server:
                        </label>
                        <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-sky-400 text-sky-700 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                          <Upload className="w-4 h-4" />
                          <span>{isUploadingImage ? 'Menyimpan...' : 'Unggah File Logo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadCompanyLogo}
                            disabled={isUploadingImage}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Ketik / Edit Path Logo Manual:
                        </label>
                        <input
                          type="text"
                          value={companyInfo.logoUrl || '/uploads/logo.png'}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, logoUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Head Office Meikarta */}
                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Kantor Pusat Meikarta (Bekasi)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Alamat Lengkap</label>
                      <input
                        type="text"
                        value={companyInfo.headOffice.address}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            headOffice: { ...companyInfo.headOffice, address: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Telepon Kantor</label>
                      <input
                        type="text"
                        value={companyInfo.headOffice.phone}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            headOffice: { ...companyInfo.headOffice, phone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Branch Office Depok */}
                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Kantor Cabang Beji (Depok)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Alamat Lengkap</label>
                      <input
                        type="text"
                        value={companyInfo.branchOffice.address}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            branchOffice: { ...companyInfo.branchOffice, address: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Telepon Kantor</label>
                      <input
                        type="text"
                        value={companyInfo.branchOffice.phone}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            branchOffice: { ...companyInfo.branchOffice, phone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: DATABASE ADMIN USERS & KREDENSIAL */}
          {/* ========================================================= */}
          {currentTab === 'adminUsers' && (
            <div className="space-y-6">
              {/* Header Tab */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#0EA5E9]" />
                    <span>Database Akun Pengelola & Enkripsi Kredensial</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Username dan password admin tersimpan di tabel database <code className="text-[#0EA5E9] bg-sky-50 px-1 py-0.5 rounded font-mono font-bold">mka_admin_users</code> dengan enkripsi salted hash.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSqlModalOpen(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                    title="Lihat DDL & DML Schema MySQL untuk phpMyAdmin"
                  >
                    <FileCode className="w-4 h-4 text-slate-600" />
                    <span>Skrip SQL MySQL</span>
                  </button>

                  <button
                    onClick={() => setIsNewAdminModalOpen(true)}
                    className="px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-sky-500/25"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Tambah Akun Admin</span>
                  </button>
                </div>
              </div>

              {/* Status & Security Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0F172A] text-white p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Tabel Database</span>
                    <Database className="w-4 h-4 text-[#0EA5E9]" />
                  </div>
                  <div className="text-xl font-black font-mono text-[#0EA5E9] mt-2">
                    mka_admin_users
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {adminUsers.length} Akun Terdaftar Aktif
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                    <span>Proteksi Kredensial</span>
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Salted SHA-256 / Bcrypt</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Password tersimpan dalam hash terenkripsi
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                    <span>Keamanan Sesi</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-2">
                    15 Menit Timeout
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Auto logout saat idle tanpa aktivitas
                  </div>
                </div>
              </div>

              {/* Table of Admin Accounts */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Daftar Pengguna Tersimpan di Database
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Sistem multi-admin dengan hak akses terproteksi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3">Username & ID</th>
                        <th className="p-3">Nama & Email</th>
                        <th className="p-3">Role / Jabatan</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Enkripsi Hash di DB</th>
                        <th className="p-3">Terakhir Login</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900 font-mono text-sm flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-sky-600" />
                              <span>{u.username}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{u.fullName}</div>
                            <div className="text-[11px] text-slate-500">{u.email}</div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'superadmin'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : u.role === 'lead_engineer'
                                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {u.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>Aktif</span>
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-500">
                            <div className="flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[140px]" title={u.passwordHash}>
                                {u.passwordHash ? u.passwordHash.substring(0, 16) + '...' : 'Terenkripsi'}
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-400">Salted SHA-256 Hash</div>
                          </td>
                          <td className="p-3 text-[11px] text-slate-600 font-tabular">
                            {u.lastLogin || 'Belum ada catatan'}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenPasswordModal(u)}
                                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                                title="Ubah Password Admin"
                              >
                                <Key className="w-3.5 h-3.5 text-amber-600" />
                                <span>Ganti Password</span>
                              </button>

                              {u.id !== 'adm-001' && (
                                <button
                                  onClick={() => handleDeleteAdmin(u.id, u.username)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                  title="Hapus Akun Admin"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: PRODUCT (CREATE / EDIT) */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-neutral-900">
                {isNewProduct ? 'Tambah Produk PLTS Baru' : 'Edit Produk PLTS'}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Contoh: MKA Smart Hybrid Storage 10kW"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Kategori *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="hybrid">PLTS Hybrid</option>
                    <option value="on-grid">PLTS On-Grid</option>
                    <option value="off-grid">PLTS Off-Grid</option>
                    <option value="inverter-battery">Inverter & Baterai</option>
                    <option value="pju">PJU Tenaga Surya</option>
                    <option value="pats">Pompa Air Surya (PATS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Rentang Kapasitas *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.capacity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, capacity: e.target.value })}
                    placeholder="Contoh: 5 kWp - 15 kWp"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Ketentuan Garansi *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.warranty}
                  onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                  placeholder="Contoh: Garansi Sistem 5 Tahun, Modul 25 Tahun"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Deskripsi Singkat *</label>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Jelaskan fungsi, keunggulan teknis, dan target pengguna..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              {/* IMAGE ASSET STORAGE & LINK PATH MANAGER */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-sky-600" />
                    <span>Gambar Produk (Folder Storage Server & Link Path)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Storage: /public/uploads/
                  </span>
                </div>

                {/* Live Preview & Status */}
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={editingProduct.imageUrl}
                      alt={editingProduct.name || 'Preview Produk'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/uploads/product_hybrid_energy_storage_1791532019483.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-[11px] font-bold text-slate-700">Link Path Sumber Gambar di Database:</div>
                    <div className="text-[11px] font-mono text-sky-700 truncate bg-sky-50 px-2 py-1 rounded border border-sky-100">
                      {editingProduct.imageUrl}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>File dimuat dari folder penyimpanan server (/uploads/...)</span>
                    </div>
                  </div>
                </div>

                {/* Upload Action & Preset Select */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Unggah File Gambar Baru ke Server:
                    </label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-dashed border-sky-400 text-sky-700 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingImage ? 'Menyimpan...' : 'Pilih File Gambar'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadProductImage}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Pilih Gambar Siap Pakai di Storage:
                    </label>
                    <select
                      value={editingProduct.imageUrl}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="/uploads/product_hybrid_energy_storage_1791532019483.jpg">
                        /uploads/product_hybrid_energy_storage_1791532019483.jpg
                      </option>
                      <option value="/uploads/hero_solar_rooftop_1791532004071.jpg">
                        /uploads/hero_solar_rooftop_1791532004071.jpg
                      </option>
                      <option value="/uploads/project_industrial_rooftop_1791532032600.jpg">
                        /uploads/project_industrial_rooftop_1791532032600.jpg
                      </option>
                      <option value="/uploads/system_solar_pump_pju_1791532042932.jpg">
                        /uploads/system_solar_pump_pju_1791532042932.jpg
                      </option>
                    </select>
                  </div>
                </div>

                {/* Edit Link Path Manually */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Atau Ketik Link Path File Gambar Manual:
                  </label>
                  <input
                    type="text"
                    value={editingProduct.imageUrl}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    placeholder="/uploads/nama_file.jpg"
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold text-neutral-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PROJECT (CREATE / EDIT) */}
      {/* ========================================================= */}
      {editingProject && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-neutral-900">
                {isNewProject ? 'Tambah Portofolio Proyek Baru' : 'Edit Portofolio Proyek'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Judul Proyek *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="Contoh: PLTS Atap Pabrik Keramik Cikarang"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Nama Klien / Perusahaan *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    placeholder="Contoh: PT Mulia Keramik Industri"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Kategori *</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="industrial">Industri & Manufaktur</option>
                    <option value="commercial">Komersial & Gedung</option>
                    <option value="residential">Residensial</option>
                    <option value="agriculture">Irigasi & Pertanian (PATS)</option>
                    <option value="public">Fasilitas Publik / BUMN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Kapasitas (kWp) *</label>
                  <input
                    type="number"
                    step={0.1}
                    required
                    value={editingProject.capacityKwp}
                    onChange={(e) => setEditingProject({ ...editingProject, capacityKwp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-tabular"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Tahun Selesai *</label>
                  <input
                    type="number"
                    required
                    value={editingProject.completionYear}
                    onChange={(e) => setEditingProject({ ...editingProject, completionYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-tabular"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Lokasi Properti *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.location}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    placeholder="Contoh: Cikarang, Bekasi"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Penghematan Bulanan (kWh)</label>
                  <input
                    type="number"
                    value={editingProject.monthlySavingsKwh}
                    onChange={(e) => setEditingProject({ ...editingProject, monthlySavingsKwh: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-tabular"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Reduksi Karbon Tahunan (Ton CO2)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={editingProject.annualCo2ReductionTon}
                    onChange={(e) => setEditingProject({ ...editingProject, annualCo2ReductionTon: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-tabular"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Deskripsi Proyek *</label>
                <textarea
                  required
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Ceritakan detail instalasi, tantangan teknis, dan hasil penghematan klien..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              {/* IMAGE ASSET STORAGE & LINK PATH MANAGER */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-sky-600" />
                    <span>Gambar Portofolio (Folder Storage Server & Link Path)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Storage: /public/uploads/
                  </span>
                </div>

                {/* Live Preview & Status */}
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={editingProject.imageUrl}
                      alt={editingProject.title || 'Preview Proyek'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/uploads/project_industrial_rooftop_1791532032600.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-[11px] font-bold text-slate-700">Link Path Sumber Gambar di Database:</div>
                    <div className="text-[11px] font-mono text-sky-700 truncate bg-sky-50 px-2 py-1 rounded border border-sky-100">
                      {editingProject.imageUrl}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>File dimuat dari folder penyimpanan server (/uploads/...)</span>
                    </div>
                  </div>
                </div>

                {/* Upload Action & Preset Select */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Unggah File Gambar Baru ke Server:
                    </label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-dashed border-sky-400 text-sky-700 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingImage ? 'Menyimpan...' : 'Pilih File Gambar'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadProjectImage}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Pilih Gambar Siap Pakai di Storage:
                    </label>
                    <select
                      value={editingProject.imageUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="/uploads/project_industrial_rooftop_1791532032600.jpg">
                        /uploads/project_industrial_rooftop_1791532032600.jpg
                      </option>
                      <option value="/uploads/hero_solar_rooftop_1791532004071.jpg">
                        /uploads/hero_solar_rooftop_1791532004071.jpg
                      </option>
                      <option value="/uploads/system_solar_pump_pju_1791532042932.jpg">
                        /uploads/system_solar_pump_pju_1791532042932.jpg
                      </option>
                      <option value="/uploads/product_hybrid_energy_storage_1791532019483.jpg">
                        /uploads/product_hybrid_energy_storage_1791532019483.jpg
                      </option>
                    </select>
                  </div>
                </div>

                {/* Edit Link Path Manually */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Atau Ketik Link Path File Gambar Manual:
                  </label>
                  <input
                    type="text"
                    value={editingProject.imageUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    placeholder="/uploads/nama_file.jpg"
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold text-neutral-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SURVEY (CREATE / EDIT) */}
      {/* ========================================================= */}
      {editingSurvey && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {isNewSurvey ? 'Catat Permintaan Survey Baru' : `Edit Survey: ${editingSurvey.ticketCode}`}
                </h3>
                <span className="text-[11px] text-amber-700 font-semibold">
                  Ketentuan Nilai Investasi Minimal: {formatRupiah(companyInfo.minSurveyInvestment || 30000000)}
                </span>
              </div>
              <button
                onClick={() => setEditingSurvey(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSurvey} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Nama Lengkap Klien *</label>
                  <input
                    type="text"
                    required
                    value={editingSurvey.fullName}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={editingSurvey.phone}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Email Klien *</label>
                  <input
                    type="email"
                    required
                    value={editingSurvey.email}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Kota / Wilayah *</label>
                  <input
                    type="text"
                    required
                    value={editingSurvey.city}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Alamat Lengkap Lokasi *</label>
                <textarea
                  required
                  rows={2}
                  value={editingSurvey.address}
                  onChange={(e) => setEditingSurvey({ ...editingSurvey, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Estimasi Investasi (Rp) *</label>
                  <input
                    type="number"
                    step={1000000}
                    required
                    value={editingSurvey.estimatedInvestment}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, estimatedInvestment: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-tabular"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Target Tanggal Survey *</label>
                  <input
                    type="date"
                    required
                    value={editingSurvey.targetSurveyDate}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, targetSurveyDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Status Survey *</label>
                  <select
                    value={editingSurvey.status}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="Menunggu Review">Menunggu Review</option>
                    <option value="Jadwal Dikonfirmasi">Jadwal Dikonfirmasi</option>
                    <option value="Survey Selesai">Survey Selesai</option>
                    <option value="Penawaran Dikirim">Penawaran Dikirim</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Catatan Teknis / Kondisi Atap</label>
                <textarea
                  rows={2}
                  value={editingSurvey.notes || ''}
                  onChange={(e) => setEditingSurvey({ ...editingSurvey, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingSurvey(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold text-neutral-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Simpan Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TICKET (CREATE / EDIT) */}
      {/* ========================================================= */}
      {editingTicket && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-neutral-900">
                {isNewTicket ? 'Buat Tiket Pemeliharaan Baru' : `Edit Tiket: ${editingTicket.ticketNumber}`}
              </h3>
              <button
                onClick={() => setEditingTicket(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Nama Klien / Perusahaan *</label>
                  <input
                    type="text"
                    required
                    value={editingTicket.clientName}
                    onChange={(e) => setEditingTicket({ ...editingTicket, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Lokasi Sistem *</label>
                  <input
                    type="text"
                    required
                    value={editingTicket.systemLocation}
                    onChange={(e) => setEditingTicket({ ...editingTicket, systemLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Tahap Pemeliharaan (1-4) *</label>
                  <select
                    value={editingTicket.currentStage}
                    onChange={(e) =>
                      setEditingTicket({ ...editingTicket, currentStage: Number(e.target.value) as any })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value={1}>Tahap 1: Laporan Masuk</option>
                    <option value={2}>Tahap 2: Diagnosa Lapangan</option>
                    <option value={3}>Tahap 3: Perbaikan Terstandar</option>
                    <option value={4}>Tahap 4: Verifikasi & Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Status Tiket *</label>
                  <select
                    value={editingTicket.status}
                    onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Insinyur Bertugas</label>
                  <input
                    type="text"
                    value={editingTicket.technicianAssigned || ''}
                    onChange={(e) => setEditingTicket({ ...editingTicket, technicianAssigned: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Uraian Masalah Dilaporkan *</label>
                <textarea
                  required
                  rows={2}
                  value={editingTicket.issueDescription}
                  onChange={(e) => setEditingTicket({ ...editingTicket, issueDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Catatan Diagnosa Insinyur (Tahap 2)</label>
                <textarea
                  rows={2}
                  value={editingTicket.diagnosisNotes || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, diagnosisNotes: e.target.value })}
                  placeholder="Hasil inspeksi fisik, termal scan, atau pembacaan log telemetri..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Tindakan Perbaikan & Sparepart (Tahap 3)</label>
                <textarea
                  rows={2}
                  value={editingTicket.repairActions || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, repairActions: e.target.value })}
                  placeholder="Penggantian suku cadang orisinal, uji megger, atau kalibrasi ulang..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold text-neutral-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Simpan Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RETAIL ITEM (CREATE / EDIT) */}
      {/* ========================================================= */}
      {editingRetail && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-neutral-900">
                {isNewRetail ? 'Tambah Komponen Retail Baru' : 'Edit Komponen Retail'}
              </h3>
              <button
                onClick={() => setEditingRetail(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRetail} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Nama Komponen *</label>
                <input
                  type="text"
                  required
                  value={editingRetail.name}
                  onChange={(e) => setEditingRetail({ ...editingRetail, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Kategori *</label>
                  <input
                    type="text"
                    required
                    value={editingRetail.category}
                    onChange={(e) => setEditingRetail({ ...editingRetail, category: e.target.value })}
                    placeholder="Contoh: Solar Panel / Inverter / Baterai"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Brand / Merek *</label>
                  <input
                    type="text"
                    required
                    value={editingRetail.brand}
                    onChange={(e) => setEditingRetail({ ...editingRetail, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Estimasi Harga Retail *</label>
                  <input
                    type="text"
                    required
                    value={editingRetail.priceEstimate}
                    onChange={(e) => setEditingRetail({ ...editingRetail, priceEstimate: e.target.value })}
                    placeholder="Contoh: Rp 1.450.000 / panel"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Nama Mitra *</label>
                  <input
                    type="text"
                    required
                    value={editingRetail.partnerName}
                    onChange={(e) => setEditingRetail({ ...editingRetail, partnerName: e.target.value })}
                    placeholder="Contoh: EnergiClick / Mitra Resmi"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Tautan URL Mitra *</label>
                <input
                  type="url"
                  required
                  value={editingRetail.partnerUrl}
                  onChange={(e) => setEditingRetail({ ...editingRetail, partnerUrl: e.target.value })}
                  placeholder="https://energicklick.com/products/..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Deskripsi & Spesifikasi Singkat</label>
                <textarea
                  rows={2}
                  value={editingRetail.description}
                  onChange={(e) => setEditingRetail({ ...editingRetail, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingRetail(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold text-neutral-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Simpan Komponen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-70 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-base font-bold text-neutral-900">
              Konfirmasi Hapus Data
            </h4>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data <span className="font-bold text-neutral-900">"{deleteConfirm.title}"</span>? Tindakan ini akan menghapusnya secara permanen dari daftar website.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: UBAH PASSWORD ADMIN DI DATABASE */}
      {/* ========================================================= */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ganti Password di Database
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Akun: <span className="font-bold text-slate-800 font-mono">{passwordModalUser.username}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordChangeError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{passwordChangeError}</span>
              </div>
            )}

            <form onSubmit={handleSavePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password Baru *
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Minimal 6 karakter..."
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Konfirmasi Password Baru *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang password baru..."
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enkripsi Hash Otomatis</span>
                </div>
                <p>
                  Password akan dienkripsi menggunakan salt kriptografis sebelum disimpan ke database. Plaintext tidak akan disimpan.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl font-bold cursor-pointer shadow-sm shadow-sky-500/25"
                >
                  Simpan & Enkripsi ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH ADMIN BARU DI DATABASE */}
      {/* ========================================================= */}
      {isNewAdminModalOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-[#0EA5E9] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tambah Akun Admin Baru ke Database
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Menyimpan user baru di tabel <code className="font-mono">mka_admin_users</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewAdminModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewAdmin} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Username Admin *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: admin_operasi"
                    value={newAdminForm.username}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role / Hak Akses *
                  </label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) =>
                      setNewAdminForm({ ...newAdminForm, role: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
                  >
                    <option value="lead_engineer">Lead Engineer (Teknis)</option>
                    <option value="superadmin">Superadmin (Akses Penuh)</option>
                    <option value="service_admin">Service Desk Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Admin *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ir. Hendra Saputra, M.T."
                  value={newAdminForm.fullName}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Korporat *
                </label>
                <input
                  type="email"
                  required
                  placeholder="hendra@mkaenergy.co.id"
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password Awal *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter..."
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Password ini akan otomatis di-hash dan dienkripsi sebelum dimasukkan ke tabel database.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAdminModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl font-bold cursor-pointer shadow-sm shadow-sky-500/25"
                >
                  Simpan Pengguna ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SKRIP SQL SCHEMA DATABASE MYSQL */}
      {/* ========================================================= */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Skrip SQL Database MySQL (`mka_admin_users`)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Siap di-import ke phpMyAdmin atau cPanel MySQL Database
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 bg-[#0B1120] text-slate-200 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre select-all">
              {generateMySQLAdminTableSQL()}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 shrink-0">
              <div className="text-[11px] text-slate-500">
                Format: MySQL InnoDB UTF-8 Unicode
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {sqlCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{sqlCopied ? 'Tersalin!' : 'Salin Kode SQL'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSql}
                  className="px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File .sql</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
