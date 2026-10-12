export interface Product {
  id: string;
  name: string;
  category: 'on-grid' | 'hybrid' | 'off-grid' | 'inverter-battery' | 'pju' | 'pats';
  capacity: string;
  warranty: string;
  description: string;
  features: string[];
  specs: {
    label: string;
    value: string;
  }[];
  imageUrl: string;
  datasheetAvailable: boolean;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'industrial' | 'commercial' | 'residential' | 'agriculture' | 'public';
  location: string;
  capacityKwp: number;
  systemType: string;
  completionYear: number;
  monthlySavingsKwh: number;
  annualCo2ReductionTon: number;
  description: string;
  imageUrl: string;
}

export interface SurveyRequest {
  id: string;
  ticketCode: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  propertyType: 'Residensial' | 'Komersial / Ruko' | 'Pabrik / Industri' | 'Pertanian / Irigasi' | 'Instansi / BUMN';
  estimatedInvestment: number; // Minimal Rp30.000.000
  targetSurveyDate: string;
  roofType: string;
  notes?: string;
  status: 'Menunggu Review' | 'Jadwal Dikonfirmasi' | 'Survey Selesai' | 'Penawaran Dikirim';
  createdAt: string;
}

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  systemLocation: string;
  systemType: string;
  currentStage: 1 | 2 | 3 | 4;
  issueDescription: string;
  reportedDate: string;
  technicianAssigned?: string;
  diagnosisNotes?: string;
  repairActions?: string;
  customerRating?: number;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface MonitoringTelemetry {
  powerOutputKw: number;
  dailyYieldKwh: number;
  monthlyYieldMwh: number;
  totalYieldMwh: number;
  batterySoc: number; // 0 - 100
  batteryPowerKw: number;
  gridExchangeKw: number; // positive = export, negative = import
  inverterTempC: number;
  performanceRatio: number; // e.g. 84.5%
  co2SavedTotalTon: number;
  status: 'Normal' | 'Warning' | 'Standby';
}

export interface RetailItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceEstimate: string;
  partnerUrl: string;
  partnerName: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  fullName: string;
  email: string;
  role: 'superadmin' | 'lead_engineer' | 'service_admin';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface CompanyInfo {
  name: string;
  brandName: string;
  establishedYear: number;
  logoUrl?: string;
  domain: string;
  tagline: string;
  phone: string;
  email: string;
  whatsappUrl: string;
  minSurveyInvestment: number;
  headOffice: {
    title: string;
    address: string;
    city: string;
    phone: string;
  };
  branchOffice: {
    title: string;
    address: string;
    city: string;
    phone: string;
  };
  stats: {
    label: string;
    value: string;
    subtext: string;
  }[];
}
