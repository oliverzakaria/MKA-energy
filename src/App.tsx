/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { Products } from './components/Products';
import { ProjectsPortfolio } from './components/ProjectsPortfolio';
import { RealtimeMonitoring } from './components/RealtimeMonitoring';
import { WarrantyAndAfterSales } from './components/WarrantyAndAfterSales';
import { SolarCalculator } from './components/SolarCalculator';
import { SurveyRequestForm } from './components/SurveyRequestForm';
import { RetailAffiliate } from './components/RetailAffiliate';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import {
  INITIAL_PRODUCTS,
  INITIAL_PROJECTS,
  INITIAL_SURVEYS,
  INITIAL_TICKETS,
  RETAIL_COMPONENTS,
  COMPANY_INFO,
  INITIAL_ACTIVITY_LOGS,
} from './data/mockData';
import {
  SurveyRequest,
  ServiceTicket,
  Product,
  Project,
  RetailItem,
  CompanyInfo,
  ActivityLog,
} from './types';
import { MessageCircle } from 'lucide-react';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return (
      window.location.pathname.includes('pengelola-mka-7k9q') ||
      window.location.hash === '#admin' ||
      window.location.hash.includes('pengelola') ||
      window.location.search.includes('admin=true') ||
      window.location.search.includes('pengelola')
    );
  });

  // App-level state for interactive data persistence and full CRUD
  const [surveys, setSurveys] = useState<SurveyRequest[]>(INITIAL_SURVEYS);
  const [tickets, setTickets] = useState<ServiceTicket[]>(INITIAL_TICKETS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [retailItems, setRetailItems] = useState<RetailItem[]>(RETAIL_COMPONENTS);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(COMPANY_INFO as CompanyInfo);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Load live data from Client-Server REST Database API on mount
  React.useEffect(() => {
    let isMounted = true;
    api
      .fetchInitialData()
      .then((data) => {
        if (!isMounted) return;
        if (data.products && data.products.length > 0) setProducts(data.products);
        if (data.projects && data.projects.length > 0) setProjects(data.projects);
        if (data.surveys && data.surveys.length > 0) setSurveys(data.surveys);
        if (data.tickets && data.tickets.length > 0) setTickets(data.tickets);
        if (data.retailItems && data.retailItems.length > 0) setRetailItems(data.retailItems);
        if (data.companyInfo) setCompanyInfo(data.companyInfo);
        if (data.activityLogs && data.activityLogs.length > 0) setActivityLogs(data.activityLogs);
      })
      .catch((err) => {
        console.info('[MKA Client-Server] Inisialisasi API:', err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync URL hash / pathname and discreet keyboard shortcut (Ctrl + Shift + A)
  React.useEffect(() => {
    const handleCheckLocation = () => {
      if (
        window.location.pathname.includes('pengelola-mka-7k9q') ||
        window.location.hash === '#admin' ||
        window.location.hash.includes('pengelola') ||
        window.location.search.includes('admin=true') ||
        window.location.search.includes('pengelola')
      ) {
        setIsAdminOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Discreet admin shortcut: Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('hashchange', handleCheckLocation);
    window.addEventListener('popstate', handleCheckLocation);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleCheckLocation);
      window.removeEventListener('popstate', handleCheckLocation);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleAdmin = (open: boolean) => {
    setIsAdminOpen(open);
    if (open) {
      window.location.hash = 'admin';
    } else {
      if (window.location.hash === '#admin') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  };

  // Cross-component pre-fill data (from calculator or product card to survey form)
  const [surveyPrefill, setSurveyPrefill] = useState<{
    capacityKwp?: number;
    investment?: number;
    monthlySavings?: number;
    systemType?: string;
    productName?: string;
  } | null>(null);

  const handleApplyCalculatorToSurvey = (calcData: {
    capacityKwp: number;
    investment: number;
    monthlySavings: number;
    systemType: string;
  }) => {
    setSurveyPrefill(calcData);
    const elem = document.getElementById('survey');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProductForSurvey = (productName: string) => {
    setSurveyPrefill({ productName });
    const elem = document.getElementById('survey');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSurveySubmitted = (newSurvey: SurveyRequest) => {
    setSurveys((prev) => [newSurvey, ...prev]);
    // Persist to server database
    api.createSurvey(newSurvey).catch((err) => console.error('Error saving survey to DB:', err));

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Customer Lead',
      action: `Permintaan survey baru didaftarkan: ${newSurvey.ticketCode} (${newSurvey.fullName})`,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleAddTicket = (newTicket: ServiceTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    // Persist to server database
    api.createTicket(newTicket).catch((err) => console.error('Error saving ticket to DB:', err));

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Service Desk / Klien',
      action: `Tiket kendala servis dibuat: ${newTicket.ticketNumber} (${newTicket.clientName})`,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col bg-[#F8FAFC] text-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={handleToggleAdmin}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero
          onCalculateClick={() => scrollToSection('simulasi')}
          onSurveyClick={() => scrollToSection('survey')}
        />

        {/* 2. Tentang Kami */}
        <AboutUs companyInfo={companyInfo} />

        {/* 3. Produk & Sistem */}
        <Products
          products={products}
          onSelectProductForSurvey={handleSelectProductForSurvey}
        />

        {/* 4. Proyek Kami (Portfolio & Fast CTA) */}
        <ProjectsPortfolio projects={projects} />

        {/* 5. Monitoring Realtime (Live Telemetry Simulation) */}
        <RealtimeMonitoring />

        {/* 6. Garansi & Purna Jual (4-Stage Maintenance) */}
        <WarrantyAndAfterSales
          tickets={tickets}
          onAddTicket={handleAddTicket}
        />

        {/* 7. Simulasi Harga (Interactive Calculator) */}
        <SolarCalculator onApplyToSurvey={handleApplyCalculatorToSurvey} />

        {/* 8. Permintaan Survey Lokasi (Min. Rp30 Juta Rule) */}
        <SurveyRequestForm
          initialData={surveyPrefill}
          onSurveySubmitted={handleSurveySubmitted}
        />

        {/* 9. Belanja Retail Komponen (EnergiClick dll.) */}
        <RetailAffiliate
          retailItems={retailItems}
          companyInfo={companyInfo}
        />
      </main>

      {/* Footer */}
      <Footer
        companyInfo={companyInfo}
        onOpenAdmin={() => handleToggleAdmin(true)}
        onNavigate={scrollToSection}
      />

      {/* Floating 24-Hour WhatsApp Quick Action */}
      <a
        href={companyInfo.whatsappUrl || COMPANY_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi WhatsApp 24 Jam MKA Energy"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 stroke-[2.2]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold uppercase tracking-wider pr-1">
          Konsultasi 24 Jam
        </span>
      </a>

      {/* Admin Portal Modal */}
      {isAdminOpen && (
        <AdminPortal
          surveys={surveys}
          setSurveys={setSurveys}
          tickets={tickets}
          setTickets={setTickets}
          products={products}
          setProducts={setProducts}
          projects={projects}
          setProjects={setProjects}
          retailItems={retailItems}
          setRetailItems={setRetailItems}
          companyInfo={companyInfo}
          setCompanyInfo={setCompanyInfo}
          activityLogs={activityLogs}
          setActivityLogs={setActivityLogs}
          onClose={() => handleToggleAdmin(false)}
        />
      )}
    </div>
  );
}
