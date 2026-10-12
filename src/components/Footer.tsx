import React from 'react';
import { MapPin, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { CompanyInfo } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface FooterProps {
  companyInfo?: CompanyInfo;
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ companyInfo = COMPANY_INFO, onOpenAdmin, onNavigate }) => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Overview */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="footer" theme="dark" />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Perusahaan spesialis rekayasa energi terbarukan dan Pembangkit Listrik Tenaga Surya (PLTS) terkemuka di Indonesia sejak 2019. Menghadirkan solusi end-to-end berstandar teknis tertinggi.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <Globe className="w-4 h-4 text-[#0EA5E9]" />
              <span>Domain Resmi: <a href="https://www.mkaenergy.co.id" className="hover:text-sky-300 underline text-sky-400">www.mkaenergy.co.id</a></span>
            </div>
          </div>

          {/* Head Office (Meikarta Bekasi) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Kantor Pusat (Meikarta)</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              OAKVIEW Tower, District 1 Meikarta
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {companyInfo.headOffice.address}
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Telp: {companyInfo.headOffice.phone}
            </p>
          </div>

          {/* Branch Office (Depok) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Kantor Cabang (Depok)</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Beji - Kota Depok
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {companyInfo.branchOffice.address}
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Telp: {companyInfo.branchOffice.phone}
            </p>
          </div>

          {/* Navigation & Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Cepat
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('tentang')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('produk')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Produk & Sistem
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('proyek')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Portofolio Proyek
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('monitoring')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Monitoring Realtime
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('garansi')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Garansi & Purna Jual
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulasi')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Simulasi Harga
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('survey')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Permintaan Survey
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PT Mitra Karya Ausindo (MKA Energy Solution). Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-medium">Solusi Energi Bersih Menuju Indonesia Net Zero Emission</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
