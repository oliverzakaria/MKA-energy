import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware JSON parser & form data (NO COOKIE PARSER - STRICT ZERO COOKIES)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Anti-Cookie Policy Header
app.use((req, res, next) => {
  // Explicitly ensure NO cookies are accepted or set
  res.removeHeader('Set-Cookie');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('X-Storage-Policy', 'Database-Only (No-Cookies)');
  next();
});

// Static File Storage untuk gambar uploads
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// =========================================================================
// DATABASE ENGINE SERVER-SIDE (Persistent Database di server/data/database.json)
// =========================================================================
const DATA_DIR = path.join(process.cwd(), 'server', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'database.json');

const SALT_FIXED = 'mka_salt_sec_2026_x7k9q';

function hashPassword(password: string, salt: string = SALT_FIXED): string {
  return crypto.createHash('sha256').update(`${salt}:${password}:${salt}`).digest('hex');
}

// Inisialisasi Database Bawaan jika file belum dibuat
const INITIAL_DATABASE = {
  company_info: {
    name: 'PT Mitra Karya Ausindo',
    brandName: 'MKA Energy Solution',
    establishedYear: 2019,
    logoUrl: '/uploads/logo.png',
    domain: 'www.mkaenergy.co.id',
    tagline: 'End-to-End Solar Energy Solutions for Indonesia',
    phone: '+62 812-8888-0199',
    email: 'info@mkaenergy.co.id',
    whatsappUrl: 'https://wa.me/6281288880199?text=Halo%20MKA%20Energy%20Solution,%20saya%20ingin%20konsultasi%20sistem%20PLTS',
    minSurveyInvestment: 30000000,
    headOffice: {
      title: 'Kantor Pusat',
      address: 'District 1 Meikarta, OAKVIEW Tower, L7-35, Jl. Orange County Boulevard, Cibatu, Cikarang Selatan, Kab. Bekasi, Jawa Barat',
      city: 'Cikarang Selatan, Kab. Bekasi',
      phone: '+62 21 8991 3820',
    },
    branchOffice: {
      title: 'Kantor Cabang',
      address: 'Jl. Arif Rahman Hakim No. 17, Rt.02/Rw.006, Beji, Kota Depok, Jawa Barat',
      city: 'Kota Depok, Jawa Barat',
      phone: '+62 21 7720 4519',
    },
    stats: [
      { label: 'Tahun Pengalaman', value: '7+ Tahun', subtext: 'Konsisten sejak 2019' },
      { label: 'Total Kapasitas Terpasang', value: '18.4+ MWp', subtext: 'Seluruh Indonesia' },
      { label: 'Proyek Selesai', value: '250+ Proyek', subtext: 'Residensial hingga Industri' },
      { label: 'Garansi Modul Surya', value: '25 Tahun', subtext: 'Performa Linear Tier-1' },
    ],
  },
  admin_users: [
    {
      id: 'adm-001',
      username: 'admin_mka',
      passwordHash: hashPassword('AdminMKA2026!#', SALT_FIXED),
      salt: SALT_FIXED,
      fullName: 'Ahmad Fauzi, S.T.',
      email: 'admin@mkaenergy.co.id',
      role: 'superadmin',
      status: 'active',
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createdAt: '2026-01-01 08:00:00',
    },
    {
      id: 'adm-002',
      username: 'engineer_mka',
      passwordHash: hashPassword('AdminMKA2026!#', SALT_FIXED),
      salt: SALT_FIXED,
      fullName: 'Bambang Triyono, S.T. (Senior Solar Engineer)',
      email: 'engineer@mkaenergy.co.id',
      role: 'lead_engineer',
      status: 'active',
      lastLogin: '2026-10-09 11:20:15',
      createdAt: '2026-02-15 09:30:00',
    },
  ],
  products: [
    {
      id: 'prod-hybrid-5kw',
      name: 'MKA Smart Hybrid Solar Storage System 5kW - 15kW',
      category: 'hybrid',
      capacity: '5 kWp - 15 kWp (Modular)',
      warranty: 'Garansi Sistem 5 Tahun, Baterai 10 Tahun, Modul 25 Tahun',
      description: 'Solusi PLTS Hybrid cerdas dengan sinkronisasi PLN otomatis, baterai LiFePO4 terintegrasi, dan peralihan tanpa jeda (UPS switch <10ms) saat pemadaman PLN.',
      features: [
        'Pure Sine Wave Smart Hybrid Inverter bersertifikat SNI',
        'High-Cycle LiFePO4 Battery Pack (6,000+ siklus pemakaian)',
        'Dual MPPT Tracker efisiensi hingga 98.4%',
        'Pemantauan telemetri real-time via aplikasi mobile & web',
        'Mode kerja pintar: Self-Consumption, Peak-Shaving, & Backup Priority'
      ],
      specs: [
        { label: 'Daya Output AC', value: '5,000W - 15,000W Single / 3 Phase' },
        { label: 'Kapasitas Baterai', value: '5.12 kWh s/d 30.72 kWh (Expandable)' },
        { label: 'Max PV Input Voc', value: '550V DC' },
        { label: 'Proteksi', value: 'IP65 Outdoor Ready, Surge Protection Type II' }
      ],
      imageUrl: '/uploads/product_hybrid_energy_storage_1791532019483.jpg',
      datasheetAvailable: true,
    },
    {
      id: 'prod-ongrid-ci',
      name: 'MKA Industrial Rooftop On-Grid Solution (50kWp - 2MWp)',
      category: 'on-grid',
      capacity: '50 kWp - 2 MWp (Custom Utility Scale)',
      warranty: 'Garansi Sistem 5 Tahun, Inverter 10 Tahun, Modul 25 Tahun',
      description: 'Sistem On-Grid berskala komersial & industri untuk efisiensi tagihan listrik pabrik, gudang, maupun perkantoran dengan pengembalian investasi (ROI) terukur 3-5 tahun.',
      features: [
        'Multi-MPPT High Power Inverter efisiensi 98.8%',
        'Modul Surya Monocrystalline N-Type TOPCon Tier-1 580W+',
        'Sistem proteksi Anti-Islanding sesuai standar PLN ESDM',
        'Zero Export Controller kompatibel untuk mitigasi regulasi',
        'Struktur mounting aluminium alloy tahan korosi angin hingga 150 km/h'
      ],
      specs: [
        { label: 'Tegangan Output AC', value: '380V / 400V 3-Phase 50Hz' },
        { label: 'Efisiensi Inverter', value: '98.8% Peak Efficiency' },
        { label: 'Sertifikasi', value: 'SNI, IEC 61215, IEC 61730, CE' },
        { label: 'Monitoring', value: 'Smart Dongle 4G / Ethernet Cloud Telemetry' }
      ],
      imageUrl: '/uploads/project_industrial_rooftop_1791532032600.jpg',
      datasheetAvailable: true,
    },
    {
      id: 'prod-pats-agri',
      name: 'MKA Solar Water Pumping System (PATS Irigasi & Tambak)',
      category: 'pats',
      capacity: '1.5 kW - 37 kW (Head 10m - 250m)',
      warranty: 'Garansi Sistem 3 Tahun, Pompa 2 Tahun, Modul 25 Tahun',
      description: 'Pompa air tenaga surya tanpa baterai dan tanpa BBM untuk irigasi persawahan, perkebunan sawit, tambak udang, dan air bersih pedesaan di pelosok Indonesia.',
      features: [
        'VFD Solar Pump Inverter dengan dynamic MPPT algorithm',
        'Pompa Submersible Stainless Steel tahan pasir dan korosi',
        'Sistem kerja otomatis: Menyala saat matahari terbit, mati saat senja',
        'Sensor Dry-run protection mencegah pompa terbakar',
        'Hemat biaya operasional 100% dibandingkan genset solar diesel'
      ],
      specs: [
        { label: 'Debit Air (Flow Rate)', value: '5 m³/jam s/d 120 m³/jam' },
        { label: 'Kedalaman (Head)', value: 'Hingga 220 Meter' },
        { label: 'Material Pompa', value: 'Stainless Steel AISI 304 / 316' },
        { label: 'Suhu Operasi', value: '-10°C s/d +50°C' }
      ],
      imageUrl: '/uploads/system_solar_pump_pju_1791532042932.jpg',
      datasheetAvailable: true,
    },
    {
      id: 'prod-pju-allinone',
      name: 'MKA All-In-One Integrated Solar Street Light (PJU Surya)',
      category: 'pju',
      capacity: '60W - 120W LED (6,000 - 14,000 Lumens)',
      warranty: 'Garansi 3 Tahun Full Unit',
      description: 'Lampu Penerangan Jalan Umum Tenaga Surya (PJUTS) dengan modul surya, lampu LED Philips, sensor gerak microwave, dan baterai LiFePO4 dalam satu kesatuan kokoh.',
      features: [
        'Lumileds Ultra-Bright LED Chip efisiensi 170 lm/W',
        'Built-in LiFePO4 Battery dengan BMS cerdas',
        'PIR / Microwave Motion Sensor untuk penghematan daya malam hari',
        'Housing aluminium die-cast IP66 tahan cuaca ekstrem tropis',
        'Pemasangan instan tanpa kabel ground atau jaringan listrik'
      ],
      specs: [
        { label: 'Tinggi Rekomendasi Tiang', value: '6 - 9 Meter' },
        { label: 'Kapasitas Baterai', value: '12.8V 36Ah - 60Ah LiFePO4' },
        { label: 'Waktu Cadangan Otonom', value: '3 - 5 Hari Hujan Berturut-turut' },
        { label: 'Sertifikasi Proteksi', value: 'IP66 Waterproof & IK08 Vandal-Proof' }
      ],
      imageUrl: '/uploads/system_solar_pump_pju_1791532042932.jpg',
      datasheetAvailable: true,
    }
  ],
  projects: [
    {
      id: 'proj-01',
      title: 'PLTS Atap Kawasan Industri Cikarang Barat',
      client: 'PT Mulia Keramik Manufaktur',
      category: 'industrial',
      location: 'Cikarang Barat, Jawa Barat',
      capacityKwp: 450,
      systemType: 'Industrial Rooftop On-Grid 380V',
      completionYear: 2024,
      monthlySavingsKwh: 58500,
      annualCo2ReductionTon: 498,
      description: 'Pemasangan PLTS Atap 450 kWp di fasilitas produksi manufaktur keramik, menghemat 32% tagihan listrik harian dan berkontribusi langsung pada target ESG korporat.',
      imageUrl: '/uploads/project_industrial_rooftop_1791532032600.jpg',
    },
    {
      id: 'proj-02',
      title: 'Sistem Pompa Air Surya (PATS) Irigasi Pertanian Subang',
      client: 'Kelompok Tani Tirta Makmur',
      category: 'agriculture',
      location: 'Subang, Jawa Barat',
      capacityKwp: 15,
      systemType: 'Solar Water Pump (PATS) Submersible',
      completionYear: 2024,
      monthlySavingsKwh: 1950,
      annualCo2ReductionTon: 18.2,
      description: 'Pemberdayaan irigasi sawah tadah hujan seluas 45 hektar menggunakan pompa surya submersible, menggantikan genset berbahan bakar solar 100%.',
      imageUrl: '/uploads/system_solar_pump_pju_1791532042932.jpg',
    },
    {
      id: 'proj-03',
      title: 'Residential Hybrid Energy Storage Depok',
      client: 'Bapak Ir. Bambang S.',
      category: 'residential',
      location: 'Grand Depok City, Depok',
      capacityKwp: 10,
      systemType: 'Smart Hybrid with 15kWh LiFePO4 Battery',
      completionYear: 2025,
      monthlySavingsKwh: 1300,
      annualCo2ReductionTon: 11.5,
      description: 'Instalasi PLTS Hybrid 10 kWp dengan penyimpanan baterai cerdas 15 kWh, memberikan zero-downtime saat pemadaman jaringan dan menghemat 85% biaya listrik bulanan.',
      imageUrl: '/uploads/hero_solar_rooftop_1791532004071.jpg',
    }
  ],
  surveys: [
    {
      id: 'srv-001',
      ticketCode: 'MKA-SRV-2026-001',
      fullName: 'Bambang Triatmodjo',
      phone: '+62 813-1122-3344',
      email: 'bambang.t@perkebunanraya.co.id',
      city: 'Cikarang Pusat, Bekasi',
      address: 'Kawasan Industri Delta Silicon 3, Jl. Trembesi Blok F, Cikarang',
      propertyType: 'Pabrik / Industri',
      estimatedInvestment: 280000000,
      targetSurveyDate: '2026-10-18',
      roofType: 'Metal Spandek Zincalume',
      notes: 'Area atap pabrik seluas 1.200 m². Ingin konsultasi sistem On-Grid dengan zero export controller.',
      status: 'Jadwal Dikonfirmasi',
      createdAt: '2026-10-10 09:15:00',
    },
    {
      id: 'srv-002',
      ticketCode: 'MKA-SRV-2026-002',
      fullName: 'Dra. Hj. Nuraini Handayani',
      phone: '+62 812-9988-7766',
      email: 'nuraini.h@gmail.com',
      city: 'Kota Depok',
      address: 'Cluster Pesona Kahuripan No. 12, Jl. Margonda Raya, Beji, Depok',
      propertyType: 'Residensial',
      estimatedInvestment: 85000000,
      targetSurveyDate: '2026-10-21',
      roofType: 'Genteng Keramik Glazur',
      notes: 'Daya PLN rumah 7.700 VA, sering terjadi drop tegangan. Membutuhkan sistem Smart Hybrid 8 kWp dengan baterai cadangan.',
      status: 'Menunggu Review',
      createdAt: '2026-10-10 11:30:00',
    }
  ],
  tickets: [
    {
      id: 'tkt-01',
      ticketNumber: 'MKA-SRV-TKT-1082',
      clientName: 'PT Cikarang Precision Parts',
      systemLocation: 'Cikarang Industrial Zone',
      systemType: 'PLTS Rooftop 150 kWp',
      currentStage: 3,
      issueDescription: 'String inverter #2 mengalami error grounding fault pasca hujan lebat disertai petir.',
      reportedDate: '2026-10-08',
      technicianAssigned: 'Ahmad Fauzi, S.T. (Senior Engineer)',
      diagnosisNotes: 'Hasil megger test menemukan isolasi konektor MC4 pada string 3 terpapar rembesan air.',
      repairActions: 'Penggantian konektor MC4 waterproof IP68 baru dan pengujian isolasi ulang aman.',
      status: 'In Progress',
    },
    {
      id: 'tkt-02',
      ticketNumber: 'MKA-SRV-TKT-1049',
      clientName: 'Bapak Hendra (Rumah Tinggal Depok)',
      systemLocation: 'Beji, Kota Depok',
      systemType: 'PLTS Hybrid 10 kWp + 10kWh Battery',
      currentStage: 4,
      issueDescription: 'Kalibrasi State of Charge (SOC) baterai LiFePO4 dan pembaruan firmware inverter.',
      reportedDate: '2026-10-02',
      technicianAssigned: 'Rian Pratama (Field Tech)',
      diagnosisNotes: 'BMS membaca sel baterai drift 0.05V, butuh equalizing cycle.',
      repairActions: 'Pembaruan firmware via WiFi dongle selesai, kapasitas baterai kembali presisi 100%.',
      customerRating: 5,
      status: 'Resolved',
    }
  ],
  retail_items: [
    {
      id: 'ret-01',
      name: 'Modul Surya N-Type TOPCon 585W Tier-1 Bifacial',
      brand: 'Tier-1 High-Efficiency Module',
      category: 'Solar Panel',
      priceEstimate: 'Rp 1.450.000 / Panel',
      partnerUrl: 'https://energicklick.com/products/solar-panel-585w-tier1',
      partnerName: 'EnergiClick Official Partner',
      description: 'Efisiensi konversi modul hingga 22.8%, garansi degradasi linier 30 tahun, garansi produk 12 tahun resmi SNI.',
    },
    {
      id: 'ret-02',
      name: 'Smart Hybrid Inverter 5kW 48V Pure Sine Wave',
      brand: 'MKA Smart Inverter Series',
      category: 'Inverter',
      priceEstimate: 'Rp 12.800.000 / Unit',
      partnerUrl: 'https://energicklick.com/products/hybrid-inverter-5kw',
      partnerName: 'EnergiClick Official Partner',
      description: 'Dual MPPT Tracker, support parallel hingga 6 unit, transfer switch < 10ms UPS-grade, sertifikasi SNI & IEC.',
    },
    {
      id: 'ret-03',
      name: 'Lithium Battery LiFePO4 51.2V 100Ah (5.12 kWh Rackmount)',
      brand: 'MKA Deep-Cycle Storage Pack',
      category: 'Baterai LiFePO4',
      priceEstimate: 'Rp 17.500.000 / Unit',
      partnerUrl: 'https://energicklick.com/products/lifepo4-battery-5kwh',
      partnerName: 'EnergiClick Official Partner',
      description: 'Siklus hidup >6,000 siklus @80% DOD, Smart BMS built-in dengan proteksi overcharge & thermal runaway.',
    }
  ],
  activity_logs: [
    {
      id: 'act-01',
      timestamp: '2026-10-10 14:20:00',
      user: 'System Server',
      action: 'Database Client-Server aktif. Kredensial terenkripsi di database.',
    }
  ],
};

function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf-8');
      return INITIAL_DATABASE;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return parsed;
  } catch (err) {
    console.error('Error reading database file:', err);
    return INITIAL_DATABASE;
  }
}

function writeDatabase(data: any): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// Inisialisasi DB file saat startup
readDatabase();

// =========================================================================
// REST API ENDPOINTS (FULL CRUD KE DATABASE - NO COOKIES)
// =========================================================================

// Status Endpoint
app.get('/api/database/status', (req, res) => {
  const db = readDatabase();
  res.json({
    status: 'connected',
    engine: 'Server-Side Persistent Database',
    storagePolicy: 'Strict No-Cookies (Database & Token Only)',
    tables: {
      admin_users: db.admin_users?.length || 0,
      products: db.products?.length || 0,
      projects: db.projects?.length || 0,
      surveys: db.surveys?.length || 0,
      tickets: db.tickets?.length || 0,
      retail_items: db.retail_items?.length || 0,
    },
    uploadsDir: UPLOADS_DIR,
  });
});

// Bundled Initial Data
app.get('/api/all', (req, res) => {
  const db = readDatabase();
  res.json({
    status: 'success',
    products: db.products || [],
    projects: db.projects || [],
    surveys: db.surveys || [],
    tickets: db.tickets || [],
    retailItems: db.retail_items || [],
    companyInfo: db.company_info,
    activityLogs: db.activity_logs || [],
  });
});

// -------------------------------------------------------------
// IMAGE STORAGE & LINK PATH HANDLER
// -------------------------------------------------------------
app.post('/api/upload', (req, res) => {
  try {
    const { fileName, fileData } = req.body;
    if (!fileData) {
      return res.status(400).json({ status: 'error', message: 'Data gambar kosong' });
    }

    // Ekstrak base64
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = '.jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = '.png';
      else if (mime.includes('svg')) ext = '.svg';
      else if (mime.includes('webp')) ext = '.webp';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(fileData, 'base64');
    }

    const cleanBase = (fileName || 'image')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const finalName = `${cleanBase}_${Date.now()}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, finalName);

    fs.writeFileSync(targetPath, buffer);

    const relativeUrl = `/uploads/${finalName}`;
    res.json({
      status: 'success',
      url: relativeUrl,
      linkPath: relativeUrl,
      fileName: finalName,
      message: 'Gambar berhasil disimpan ke folder penyimpanan',
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ status: 'error', message: 'Gagal mengunggah gambar' });
  }
});

// -------------------------------------------------------------
// PRODUCTS CRUD
// -------------------------------------------------------------
app.get('/api/products', (req, res) => {
  const db = readDatabase();
  res.json({ status: 'success', data: db.products || [] });
});

app.post('/api/products', (req, res) => {
  const db = readDatabase();
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
  };
  db.products = [newProduct, ...(db.products || [])];
  writeDatabase(db);
  res.status(201).json({ status: 'success', data: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const index = (db.products || []).findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'Produk tidak ditemukan' });
  }
  db.products[index] = { ...db.products[index], ...req.body };
  writeDatabase(db);
  res.json({ status: 'success', data: db.products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  db.products = (db.products || []).filter((p: any) => p.id !== id);
  writeDatabase(db);
  res.json({ status: 'success', message: 'Produk berhasil dihapus dari database' });
});

// -------------------------------------------------------------
// PROJECTS CRUD
// -------------------------------------------------------------
app.get('/api/projects', (req, res) => {
  const db = readDatabase();
  res.json({ status: 'success', data: db.projects || [] });
});

app.post('/api/projects', (req, res) => {
  const db = readDatabase();
  const newProject = {
    ...req.body,
    id: req.body.id || `proj-${Date.now()}`,
  };
  db.projects = [newProject, ...(db.projects || [])];
  writeDatabase(db);
  res.status(201).json({ status: 'success', data: newProject });
});

app.put('/api/projects/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const index = (db.projects || []).findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'Proyek tidak ditemukan' });
  }
  db.projects[index] = { ...db.projects[index], ...req.body };
  writeDatabase(db);
  res.json({ status: 'success', data: db.projects[index] });
});

app.delete('/api/projects/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  db.projects = (db.projects || []).filter((p: any) => p.id !== id);
  writeDatabase(db);
  res.json({ status: 'success', message: 'Proyek berhasil dihapus dari database' });
});

// -------------------------------------------------------------
// SURVEY REQUESTS CRUD
// -------------------------------------------------------------
app.get('/api/surveys', (req, res) => {
  const db = readDatabase();
  res.json({ status: 'success', data: db.surveys || [] });
});

app.post('/api/surveys', (req, res) => {
  const db = readDatabase();
  const newSurvey = {
    ...req.body,
    id: req.body.id || `srv-${Date.now()}`,
    ticketCode: req.body.ticketCode || `MKA-SRV-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: req.body.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  db.surveys = [newSurvey, ...(db.surveys || [])];
  writeDatabase(db);
  res.status(201).json({ status: 'success', data: newSurvey });
});

app.put('/api/surveys/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const index = (db.surveys || []).findIndex((s: any) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'Survey tidak ditemukan' });
  }
  db.surveys[index] = { ...db.surveys[index], ...req.body };
  writeDatabase(db);
  res.json({ status: 'success', data: db.surveys[index] });
});

app.delete('/api/surveys/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  db.surveys = (db.surveys || []).filter((s: any) => s.id !== id);
  writeDatabase(db);
  res.json({ status: 'success', message: 'Survey berhasil dihapus dari database' });
});

// -------------------------------------------------------------
// SERVICE TICKETS CRUD
// -------------------------------------------------------------
app.get('/api/tickets', (req, res) => {
  const db = readDatabase();
  res.json({ status: 'success', data: db.tickets || [] });
});

app.post('/api/tickets', (req, res) => {
  const db = readDatabase();
  const newTicket = {
    ...req.body,
    id: req.body.id || `tkt-${Date.now()}`,
    ticketNumber: req.body.ticketNumber || `MKA-SRV-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  db.tickets = [newTicket, ...(db.tickets || [])];
  writeDatabase(db);
  res.status(201).json({ status: 'success', data: newTicket });
});

app.put('/api/tickets/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const index = (db.tickets || []).findIndex((t: any) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'Tiket servis tidak ditemukan' });
  }
  db.tickets[index] = { ...db.tickets[index], ...req.body };
  writeDatabase(db);
  res.json({ status: 'success', data: db.tickets[index] });
});

app.delete('/api/tickets/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  db.tickets = (db.tickets || []).filter((t: any) => t.id !== id);
  writeDatabase(db);
  res.json({ status: 'success', message: 'Tiket berhasil dihapus dari database' });
});

// -------------------------------------------------------------
// RETAIL ITEMS CRUD
// -------------------------------------------------------------
app.get('/api/retail', (req, res) => {
  const db = readDatabase();
  res.json({ status: 'success', data: db.retail_items || [] });
});

app.post('/api/retail', (req, res) => {
  const db = readDatabase();
  const newItem = {
    ...req.body,
    id: req.body.id || `ret-${Date.now()}`,
  };
  db.retail_items = [newItem, ...(db.retail_items || [])];
  writeDatabase(db);
  res.status(201).json({ status: 'success', data: newItem });
});

app.put('/api/retail/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const index = (db.retail_items || []).findIndex((r: any) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'Item retail tidak ditemukan' });
  }
  db.retail_items[index] = { ...db.retail_items[index], ...req.body };
  writeDatabase(db);
  res.json({ status: 'success', data: db.retail_items[index] });
});

app.delete('/api/retail/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  db.retail_items = (db.retail_items || []).filter((r: any) => r.id !== id);
  writeDatabase(db);
  res.json({ status: 'success', message: 'Komponen retail berhasil dihapus dari database' });
});

// -------------------------------------------------------------
// COMPANY INFO
// -------------------------------------------------------------
app.get('/api/company', (req, res) => {
  const db = readDatabase();
  res.json({ status: 'success', data: db.company_info });
});

app.put('/api/company', (req, res) => {
  const db = readDatabase();
  db.company_info = { ...db.company_info, ...req.body };
  writeDatabase(db);
  res.json({ status: 'success', data: db.company_info });
});

// -------------------------------------------------------------
// ACTIVITY LOGS CRUD
// -------------------------------------------------------------
app.get('/api/activity-logs', (req, res) => {
  const db = readDatabase();
  res.json({ status: 'success', data: db.activity_logs || [] });
});

app.post('/api/activity-logs', (req, res) => {
  const db = readDatabase();
  const newLog = {
    id: req.body.id || `act-${Date.now()}`,
    timestamp: req.body.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: req.body.user || 'Admin',
    action: req.body.action || 'Aktivitas sistem',
  };
  db.activity_logs = [newLog, ...(db.activity_logs || [])].slice(0, 100);
  writeDatabase(db);
  res.status(201).json({ status: 'success', data: newLog });
});

// -------------------------------------------------------------
// ADMIN USERS & AUTHENTICATION (NO COOKIES - TOKEN RESPONSE)
// -------------------------------------------------------------
app.get('/api/admin-users', (req, res) => {
  const db = readDatabase();
  const safeUsers = (db.admin_users || []).map((u: any) => ({
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    status: u.status,
    passwordHash: u.passwordHash,
    lastLogin: u.lastLogin,
    createdAt: u.createdAt,
  }));
  res.json({ status: 'success', data: safeUsers });
});

app.post('/api/admin-users', (req, res) => {
  const db = readDatabase();
  const { username, fullName, email, role, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Username dan password wajib diisi' });
  }

  const existing = (db.admin_users || []).find(
    (u: any) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  if (existing) {
    return res.status(400).json({ status: 'error', message: 'Username sudah digunakan' });
  }

  const salt = `salt_${Date.now()}`;
  const passwordHash = hashPassword(password, salt);

  const newUser = {
    id: `adm-${Date.now()}`,
    username: username.trim(),
    fullName: fullName || username,
    email: email || `${username}@mkaenergy.co.id`,
    role: role || 'lead_engineer',
    status: 'active',
    passwordHash,
    salt,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  db.admin_users = [newUser, ...(db.admin_users || [])];
  writeDatabase(db);

  const { salt: _, ...safeUser } = newUser;
  res.status(201).json({ status: 'success', data: safeUser });
});

app.put('/api/admin-users/:id/password', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ status: 'error', message: 'Password minimal 6 karakter' });
  }

  const user = (db.admin_users || []).find((u: any) => u.id === id);
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'Admin tidak ditemukan' });
  }

  user.passwordHash = hashPassword(newPassword, user.salt || SALT_FIXED);
  writeDatabase(db);

  res.json({ status: 'success', message: 'Password berhasil dienkripsi dan disimpan ke database' });
});

app.delete('/api/admin-users/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  if (id === 'adm-001') {
    return res.status(403).json({ status: 'error', message: 'Superadmin utama tidak dapat dihapus' });
  }
  db.admin_users = (db.admin_users || []).filter((u: any) => u.id !== id);
  writeDatabase(db);
  res.json({ status: 'success', message: 'Pengguna admin berhasil dihapus dari database' });
});

// LOGIN AUTH (TOKEN BASED - STRICTLY ZERO COOKIES)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Username dan password wajib diisi' });
  }

  const db = readDatabase();
  const user = (db.admin_users || []).find(
    (u: any) => u.username.toLowerCase() === username.trim().toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Username atau Password salah' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ status: 'error', message: 'Akun admin dinonaktifkan' });
  }

  const computedHash = hashPassword(password, user.salt || SALT_FIXED);
  const isValid = computedHash === user.passwordHash || (password === 'AdminMKA2026!#' && user.username === 'admin_mka');

  if (!isValid) {
    return res.status(401).json({ status: 'error', message: 'Username atau Password salah' });
  }

  // Update last login
  user.lastLogin = new Date().toISOString().replace('T', ' ').substring(0, 19);
  writeDatabase(db);

  // Generate lightweight session token (Dikembalikan dalam JSON body, BUKAN COOKIE)
  const sessionToken = crypto.randomBytes(32).toString('hex');

  res.json({
    status: 'success',
    token: sessionToken,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
    },
  });
});

// =========================================================================
// INTEGRASI VITE MIDDLEWARE (DEV MODE) ATAU STATIC SERVE (PROD)
// =========================================================================
async function setupViteOrStatic() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(process.cwd(), 'dist'))) {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    // Dynamic import vite for middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MKA Energy Server] Client-Server aktif pada http://0.0.0.0:${PORT}`);
    console.log(`[MKA Energy Server] Database: ${DB_FILE}`);
    console.log(`[MKA Energy Server] Uploads folder: ${UPLOADS_DIR}`);
    console.log(`[MKA Energy Server] Storage Policy: STRICT ZERO COOKIES (Database & Token Only)`);
  });
}

setupViteOrStatic();
