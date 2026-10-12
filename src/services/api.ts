import {
  Product,
  Project,
  SurveyRequest,
  ServiceTicket,
  RetailItem,
  CompanyInfo,
  AdminUser,
  ActivityLog,
} from '../types';

const API_BASE = '/api';
const AUTH_TOKEN_KEY = 'mka_auth_session_token';

// Headers helper: NO COOKIES EVER
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Fetch All Initial Data
  async fetchInitialData(): Promise<{
    products: Product[];
    projects: Project[];
    surveys: SurveyRequest[];
    tickets: ServiceTicket[];
    retailItems: RetailItem[];
    companyInfo: CompanyInfo;
    activityLogs: ActivityLog[];
  }> {
    const res = await fetch(`${API_BASE}/all`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Gagal mengambil data dari server (${res.status})`);
    }
    return res.json();
  },

  // Image Upload to Storage Folder
  async uploadImage(file: File): Promise<{ url: string; linkPath: string; fileName: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
            }),
          });
          const result = await res.json();
          if (res.ok && result.status === 'success') {
            resolve({
              url: result.url,
              linkPath: result.linkPath || result.url,
              fileName: result.fileName,
            });
          } else {
            reject(new Error(result.message || 'Gagal menyimpan gambar ke folder penyimpanan'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
      reader.readAsDataURL(file);
    });
  },

  // Products CRUD
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`, { headers: getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const json = await res.json();
    return json.data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const json = await res.json();
    return json.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Projects CRUD
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`, { headers: getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    const json = await res.json();
    return json.data;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    const json = await res.json();
    return json.data;
  },

  async deleteProject(id: string): Promise<void> {
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Surveys CRUD
  async getSurveys(): Promise<SurveyRequest[]> {
    const res = await fetch(`${API_BASE}/surveys`, { headers: getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async createSurvey(survey: Partial<SurveyRequest>): Promise<SurveyRequest> {
    const res = await fetch(`${API_BASE}/surveys`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(survey),
    });
    const json = await res.json();
    return json.data;
  },

  async updateSurvey(id: string, survey: Partial<SurveyRequest>): Promise<SurveyRequest> {
    const res = await fetch(`${API_BASE}/surveys/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(survey),
    });
    const json = await res.json();
    return json.data;
  },

  async deleteSurvey(id: string): Promise<void> {
    await fetch(`${API_BASE}/surveys/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Tickets CRUD
  async getTickets(): Promise<ServiceTicket[]> {
    const res = await fetch(`${API_BASE}/tickets`, { headers: getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async createTicket(ticket: Partial<ServiceTicket>): Promise<ServiceTicket> {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ticket),
    });
    const json = await res.json();
    return json.data;
  },

  async updateTicket(id: string, ticket: Partial<ServiceTicket>): Promise<ServiceTicket> {
    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(ticket),
    });
    const json = await res.json();
    return json.data;
  },

  async deleteTicket(id: string): Promise<void> {
    await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Retail Items CRUD
  async getRetailItems(): Promise<RetailItem[]> {
    const res = await fetch(`${API_BASE}/retail`, { headers: getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async createRetailItem(item: Partial<RetailItem>): Promise<RetailItem> {
    const res = await fetch(`${API_BASE}/retail`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return json.data;
  },

  async updateRetailItem(id: string, item: Partial<RetailItem>): Promise<RetailItem> {
    const res = await fetch(`${API_BASE}/retail/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return json.data;
  },

  async deleteRetailItem(id: string): Promise<void> {
    await fetch(`${API_BASE}/retail/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Company Info
  async getCompanyInfo(): Promise<CompanyInfo> {
    const res = await fetch(`${API_BASE}/company`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async updateCompanyInfo(info: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const res = await fetch(`${API_BASE}/company`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(info),
    });
    const json = await res.json();
    return json.data;
  },

  // Activity Logs CRUD
  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch(`${API_BASE}/activity-logs`, { headers: getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async createActivityLog(log: Partial<ActivityLog>): Promise<ActivityLog> {
    const res = await fetch(`${API_BASE}/activity-logs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(log),
    });
    const json = await res.json();
    return json.data;
  },

  // Admin Users & Auth (NO COOKIES - TOKEN & SESSIONSTORAGE ONLY)
  async getAdminUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE}/admin-users`, { headers: getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async createAdminUser(userData: {
    username: string;
    fullName: string;
    email: string;
    role: string;
    password: string;
  }): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admin-users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Gagal membuat admin di database');
    return json.data;
  },

  async updateAdminPassword(userId: string, newPassword: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin-users/${userId}/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ newPassword }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Gagal mengubah password');
    return true;
  },

  async deleteAdminUser(userId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin-users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Gagal menghapus admin');
    return true;
  },

  async login(username: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();

      if (res.ok && json.status === 'success') {
        // Simpan token di sessionStorage (BUKAN COOKIES)
        sessionStorage.setItem(AUTH_TOKEN_KEY, json.token);
        sessionStorage.setItem('mka_admin_auth', 'true');
        sessionStorage.setItem('mka_admin_user', JSON.stringify(json.user));
        return { success: true, user: json.user };
      } else {
        return { success: false, error: json.message || 'Username atau Password salah' };
      }
    } catch {
      return { success: false, error: 'Gagal terhubung ke database server' };
    }
  },

  logout(): void {
    // Bersihkan sesi (NO COOKIES)
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem('mka_admin_auth');
    sessionStorage.removeItem('mka_admin_user');
  },
};
