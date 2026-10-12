import { Product, Project, SurveyRequest, ServiceTicket, RetailItem } from '../types';

export const COMPANY_INFO = {
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
};

export const INITIAL_PRODUCTS: Product[] = [
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
      { label: 'Tegangan AC', value: '220V / 380V Single / 3 Phase' },
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
    capacity: '50 kWp - 2 MWp',
    warranty: 'Garansi Inverter 5-10 Tahun, Modul PV 25 Tahun Tier-1',
    description: 'Sistem PLTS Atap On-Grid skala pabrik, pergudangan, dan gedung komersial untuk menekan biaya tagihan listrik PLN secara signifikan hingga 40-70%.',
    features: [
      'Multi-MPPT High-Power String Inverters dengan efisiensi 98.8%',
      'Modul Surya Monocrystalline N-Type TopCon 580Wp+ Tier-1',
      'Zero Export Device terstandarisasi Permen ESDM',
      'Mounting Aluminium Anodized tahan korosi garam & industri',
      'Data Logger Weather Station terintegrasi (Radiasi, Suhu Modul, Wind speed)'
    ],
    specs: [
      { label: 'Tegangan Operasi', value: '380V / 400V 3 Phase AC' },
      { label: 'Monitoring Port', value: 'RS485 / Modbus / 4G LTE IoT Gateway' },
      { label: 'Proteksi DC & AC', value: 'Built-in AFCI (Arc Fault Circuit Interrupter)' },
      { label: 'Sertifikasi', value: 'IEC 61215, IEC 61730, CE, SNI' }
    ],
    imageUrl: '/uploads/hero_solar_rooftop_1791532004071.jpg',
    datasheetAvailable: true,
  },
  {
    id: 'prod-pats-pump',
    name: 'MKA Solar Water Pump (PATS) Sistem Irigasi & Air Bersih',
    category: 'pats',
    capacity: '1 HP s/d 50 HP (Deep Well Submersible / Surface)',
    warranty: 'Garansi Sistem 3 Tahun, Pompa 2 Tahun, Modul 25 Tahun',
    description: 'Sistem Pompa Air Tenaga Surya mandiri tanpa bahan bakar solar/listrik PLN, ideal untuk perkebunan, pertanian, tambak, dan air bersih desa terpencil.',
    features: [
      'Inverter Pompa VFD Solar cerdas dengan MPPT dinamis',
      'Pompa Submersible Stainless Steel AISI 304 tahan pasir & karat',
      'Otomatis menyala saat matahari terbit & mati saat senja',
      'Proteksi Dry-Run (Sensor sumur kering otomatis melindungi motor)',
      'Tanpa baterai kimia sehingga biaya perawatan mendekati nol'
    ],
    specs: [
      { label: 'Head Pompa', value: '20 meter s/d 250 meter' },
      { label: 'Debit Air (Flow)', value: '5 m³/hari s/d 400 m³/hari' },
      { label: 'Tipe Motor', value: 'Brushless DC (BLDC) / 3-Phase AC Asynchronous' },
      { label: 'Material Pompa', value: 'Stainless Steel 304 / 316' }
    ],
    imageUrl: '/uploads/system_solar_pump_pju_1791532042932.jpg',
    datasheetAvailable: true,
  },
  {
    id: 'prod-pju-solar',
    name: 'MKA All-in-One Smart Solar Street Light (PJU Tenaga Surya)',
    category: 'pju',
    capacity: '60W - 150W Super Bright LED',
    warranty: 'Garansi Unit 3 Tahun',
    description: 'Lampu Penerangan Jalan Umum Tenaga Surya terintegrasi (Panel PV, Lampu LED Philips Lumileds, Baterai LiFePO4, dan MPPT Controller dalam 1 bodi kokoh).',
    features: [
      'Luminer LED ultra-terang hingga 180 lm/Watt',
      'Penyimpanan daya baterai LiFePO4 tahan suhu tropis',
      'Sensor Gerak Radar Microwave otomatis meredup saat sepi untuk hemat energi',
      'Daya tahan otonom 3-5 hari mendung/hujan tanpa sinar matahari',
      'Housing Aluminium Alloy die-cast dengan proteksi IP66 & IK08'
    ],
    specs: [
      { label: 'Ketinggian Tiang Ideal', value: '6 meter s/d 12 meter' },
      { label: 'Sudut Penerangan', value: '140° Batwing Optical Lens' },
      { label: 'Baterai', value: 'LiFePO4 12.8V / 25.6V High Density' },
      { label: 'Ketahanan Cuaca', value: 'IP66 Anti-Hujan Badai & Anti-Karat' }
    ],
    imageUrl: '/uploads/system_solar_pump_pju_1791532042932.jpg',
    datasheetAvailable: true,
  },
  {
    id: 'prod-offgrid-rural',
    name: 'MKA Standalone Off-Grid Solar Power Plant (5kW - 50kW)',
    category: 'off-grid',
    capacity: '5 kWp s/d 50 kWp',
    warranty: 'Garansi Sistem 5 Tahun, Baterai 5-10 Tahun',
    description: 'Pembangkit listrik tenaga surya 100% mandiri untuk pulau terluar, pos militer/perbatasan, site telekomunikasi BTS, dan resort tanpa jangkauan PLN.',
    features: [
      'Off-Grid Inverter Charger dengan surge capacity hingga 200%',
      'Bank Baterai Lithium Rack-Mounted dengan BMS protektif',
      'Kompatibel dengan Generator Diesel / Genset sebagai back-up darurat',
      'Panel kontrol distribusi AC/DC lengkap dengan MCB dan Surge Arrester',
      'Sistem pendingin pasif dan aktif untuk iklim tropis ekstrem'
    ],
    specs: [
      { label: 'Tegangan Sistem DC', value: '48V DC / High Voltage 400V DC' },
      { label: 'Otonomi Cadangan', value: '1 - 3 Hari Cadangan Energi Baterai' },
      { label: 'BMS Komunikasi', value: 'CAN / RS485 Protocol Terbuka' },
      { label: 'Operasi Temperatur', value: '-10°C hingga +55°C' }
    ],
    imageUrl: '/uploads/product_hybrid_energy_storage_1791532019483.jpg',
    datasheetAvailable: true,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-cikarang-auto',
    title: 'PLTS Atap Pabrik Manufaktur Otomotif Cikarang',
    client: 'PT Astra Precision Components (Kawasan Industri Cikarang)',
    category: 'industrial',
    location: 'Cikarang Selatan, Bekasi, Jawa Barat',
    capacityKwp: 1250,
    systemType: 'On-Grid Industrial Rooftop',
    completionYear: 2024,
    monthlySavingsKwh: 148500,
    annualCo2ReductionTon: 1420,
    description: 'Instalasi 2.200 unit panel PV monocrystalline efisiensi tinggi pada atap spandek pabrik perakitan seluas 8.500 m². Menghemat biaya beban puncak pabrik hingga 38%.',
    imageUrl: '/uploads/project_industrial_rooftop_1791532032600.jpg',
  },
  {
    id: 'proj-meikarta-luxury',
    title: 'PLTS Hybrid Residensial Villa & Hunian Meikarta',
    client: 'Residensial Private Cluster Oakview',
    category: 'residential',
    location: 'District 1 Meikarta, Cikarang, Jawa Barat',
    capacityKwp: 20,
    systemType: 'Hybrid with 20kWh LiFePO4 Storage',
    completionYear: 2025,
    monthlySavingsKwh: 2400,
    annualCo2ReductionTon: 22.8,
    description: 'Sistem atap genteng beton dengan arsitektur modern estetis. Dilengkapi sistem baterai lithium untuk zero-flicker backup saat pemadaman dan pemotongan tarif beban puncak.',
    imageUrl: '/uploads/hero_solar_rooftop_1791532004071.jpg',
  },
  {
    id: 'proj-depok-commercial',
    title: 'PLTS On-Grid Kompleks Ruko & Perkantoran Margonda - Depok',
    client: 'PT Megah Graha Sentosa',
    category: 'commercial',
    location: 'Beji, Kota Depok, Jawa Barat',
    capacityKwp: 85,
    systemType: 'Commercial On-Grid Rooftop',
    completionYear: 2023,
    monthlySavingsKwh: 10200,
    annualCo2ReductionTon: 98.4,
    description: 'Sistem PLTS Atap komersial yang memasok listrik harian gedung kantor 4 lantai. Monitoring real-time dapat diakses pihak pengelola melalui dashboard MKA.',
    imageUrl: '/uploads/hero_solar_rooftop_1791532004071.jpg',
  },
  {
    id: 'proj-karawang-pats',
    title: 'Sistem Pompa Air Tenaga Surya (PATS) Kelompok Tani Mandiri',
    client: 'Kementerian Pertanian / Gapoktan Sawah Luhur',
    category: 'agriculture',
    location: 'Karawang, Jawa Barat',
    capacityKwp: 35,
    systemType: 'Solar Water Pump (PATS) 25 HP',
    completionYear: 2024,
    monthlySavingsKwh: 4200,
    annualCo2ReductionTon: 41.5,
    description: 'Memompa air sungai dengan debit 180 m³/jam untuk mengairi lebih dari 85 hektar sawah tadah hujan. Menggantikan mesin diesel genset petani secara permanen.',
    imageUrl: '/uploads/system_solar_pump_pju_1791532042932.jpg',
  },
];

export const INITIAL_SURVEYS: SurveyRequest[] = [
  {
    id: 'srv-001',
    ticketCode: 'MKA-SRV-2026-0038',
    fullName: 'Bambang Sudarsono',
    phone: '0812-3456-7890',
    email: 'bambang.sudarsono@indomega.co.id',
    city: 'Bekasi',
    address: 'Kawasan Industri GIIC Blok AB-12, Cikarang Pusat, Kab. Bekasi',
    propertyType: 'Pabrik / Industri',
    estimatedInvestment: 450000000,
    targetSurveyDate: '2026-10-18',
    roofType: 'Metal Spandek (Area ~1.200 m²)',
    notes: 'Ingin feasibility study pemasangan PLTS 150 kWp untuk menekan tagihan listrik PLN tarif I-3.',
    status: 'Jadwal Dikonfirmasi',
    createdAt: '2026-10-05 14:22',
  },
  {
    id: 'srv-002',
    ticketCode: 'MKA-SRV-2026-0041',
    fullName: 'dr. Hendra Kurniawan',
    phone: '0811-9876-5432',
    email: 'dr.hendra.k@gmail.com',
    city: 'Depok',
    address: 'Jl. Margonda Raya Cluster Palm Residence No. 8, Beji, Depok',
    propertyType: 'Residensial',
    estimatedInvestment: 85000000,
    targetSurveyDate: '2026-10-22',
    roofType: 'Genteng Keramik Miring 25° (Area ~90 m²)',
    notes: 'Kapasitas PLN 7.700 VA, ingin pasang PLTS Hybrid 8 kWp dengan baterai cadangan 10 kWh.',
    status: 'Menunggu Review',
    createdAt: '2026-10-08 09:15',
  },
];

export const INITIAL_TICKETS: ServiceTicket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'MKA-SRV-TKT-1082',
    clientName: 'PT Tridharma Logistik Cikarang',
    systemLocation: 'Delta Silicon 3, Cikarang',
    systemType: 'PLTS On-Grid 120 kWp',
    currentStage: 3,
    issueDescription: 'String 4 Inverter B menunjukkan pembacaan tegangan DC turun 25% saat siang terik.',
    reportedDate: '2026-10-06',
    technicianAssigned: 'Ahmad Fauzi, S.T. (Senior Solar Engineer)',
    diagnosisNotes: 'Ditemukan MC4 connector kendor pada sambungan combiner box string 4, perlu replacement isolasi & crimping ulang.',
    repairActions: 'Penggantian konektor MC4 original Stäubli EVO2 dan uji insolasi megger test.',
    status: 'In Progress',
  },
  {
    id: 'tkt-002',
    ticketNumber: 'MKA-SRV-TKT-1079',
    clientName: 'Ibu Ratna Dewi (Depok)',
    systemLocation: 'Pesona Depok Estate Blok B2',
    systemType: 'PLTS Hybrid 10 kWp + 15kWh Baterai',
    currentStage: 4,
    issueDescription: 'Pemeriksaan berkala O&M 6 bulanan dan update firmware modul BMS baterai.',
    reportedDate: '2026-10-01',
    technicianAssigned: 'Rizki Pratama (Field Service Tech)',
    diagnosisNotes: 'Sistem beroperasi 100% normal. Pembersihan debu pada permukaan 18 panel modul surya selesai.',
    repairActions: 'Cleaning panel, pengencangan baut mounting torsi 12Nm, firmware update v2.14 applied.',
    customerRating: 5,
    status: 'Resolved',
  },
];

export const RETAIL_COMPONENTS: RetailItem[] = [
  {
    id: 'ret-1',
    name: 'Solar Panel Monocrystalline N-Type TopCon 580Wp Tier-1',
    brand: 'Jinko / Longi Solar (Tier-1 Bloomberg)',
    category: 'Solar Panel',
    priceEstimate: 'Rp 1.450.000 / panel',
    partnerUrl: 'https://energicklick.com/products/solar-panel-580w',
    partnerName: 'EnergiClick / Mitra Resmi',
    description: 'Efisiensi sel 22.6%, toleransi daya positif 0~+3%, garansi produk 12 tahun, garansi performa 25 tahun linear.'
  },
  {
    id: 'ret-2',
    name: 'Smart Hybrid Solar Inverter 5kW 48V Low Voltage with WiFi',
    brand: 'Deye / Growatt Solar',
    category: 'Inverter',
    priceEstimate: 'Rp 16.800.000',
    partnerUrl: 'https://energicklick.com/products/hybrid-inverter-5kw',
    partnerName: 'EnergiClick / Mitra Resmi',
    description: 'Dual MPPT, support generator genset otomatis, LCD touchscreen, kompatibel baterai lithium dan lead acid.'
  },
  {
    id: 'ret-3',
    name: 'Baterai LiFePO4 Server Rack 51.2V 100Ah (5.12 kWh) with Smart BMS',
    brand: 'Pylontech / Felicity Solar',
    category: 'Baterai Penyimpanan',
    priceEstimate: 'Rp 19.500.000',
    partnerUrl: 'https://energicklick.com/products/lifepo4-battery-5kwh',
    partnerName: 'EnergiClick / Mitra Resmi',
    description: '6.000 siklus DoD 90%, smart CAN/RS485 communication, stackable parallel hingga 16 modul.'
  },
  {
    id: 'ret-4',
    name: 'Kabel Solar PV1-F 1x4mm² & 1x6mm² TUV Certified (Per Rol 100m)',
    brand: 'Leader Cable / KBE Solar Germany',
    category: 'Kabel & Aksesoris',
    priceEstimate: 'Rp 1.850.000 / 100m',
    partnerUrl: 'https://energicklick.com/products/solar-pv-cable-6mm',
    partnerName: 'EnergiClick / Mitra Resmi',
    description: 'Double insulation, tahan paparan UV sinar matahari hingga 25 tahun, tahan api halogen-free.'
  },
  {
    id: 'ret-5',
    name: 'Konektor MC4 Stäubli Multi-Contact IP68 1500V DC (1 Pasang)',
    brand: 'Stäubli Switzerland',
    category: 'Konektor & Proteksi',
    priceEstimate: 'Rp 45.000 / pasang',
    partnerUrl: 'https://energicklick.com/products/staubli-mc4-connector',
    partnerName: 'EnergiClick / Mitra Resmi',
    description: 'Standar tertinggi industri PLTS, resistansi kontak ultra-rendah untuk mencegah kebakaran atap.'
  },
  {
    id: 'ret-6',
    name: 'Lampu PJU Tenaga Surya All-In-One 100W Lumileds IP66',
    brand: 'MKA Solar Lighting Series',
    category: 'Lampu Jalan PJU',
    priceEstimate: 'Rp 2.450.000',
    partnerUrl: 'https://energicklick.com/products/solar-street-light-100w',
    partnerName: 'EnergiClick / Mitra Resmi',
    description: 'Baterai LiFePO4 tanam, sensor radar otomatis, bracket adjustable cocok untuk tiang jalan 6-8 meter.'
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: 'act-1', timestamp: '2026-10-09 08:30:12', user: 'Admin Ops', action: 'Konfirmasi jadwal survey MKA-SRV-2026-0038 di Kawasan GIIC Cikarang' },
  { id: 'act-2', timestamp: '2026-10-09 07:15:40', user: 'System Telemetry', action: 'Sinkronisasi IoT Inverter Pabrik Otomotif (84.6 kW output normal)' },
  { id: 'act-3', timestamp: '2026-10-08 16:45:22', user: 'Lead Customer', action: 'Permintaan survey baru masuk dari dr. Hendra Kurniawan (Depok, Rp85 Jt)' },
  { id: 'act-4', timestamp: '2026-10-08 11:20:05', user: 'Service Desk', action: 'Update status tiket MKA-SRV-TKT-1082 ke Tahap 3 (Perbaikan Lapangan)' },
  { id: 'act-5', timestamp: '2026-10-07 14:10:33', user: 'Admin Web', action: 'Pembaruan katalog produk MKA Smart Hybrid Storage 5kW' },
];
