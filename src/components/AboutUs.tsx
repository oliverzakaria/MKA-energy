import React from 'react';
import { Compass, Cpu, Wrench, Shield, CheckCircle, MapPin, Building, Landmark, Home, Factory } from 'lucide-react';
import { CompanyInfo } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface AboutUsProps {
  companyInfo?: CompanyInfo;
}

export const AboutUs: React.FC<AboutUsProps> = ({ companyInfo = COMPANY_INFO }) => {
  const capabilities = [
    {
      number: '01',
      title: 'Perancangan & Engineering',
      desc: 'Simulasi radiasi matahari (PVSyst/Helioscope), pemodelan 3D bayangan (shading analysis), perhitungan struktur beban atap, dan single-line diagram elektrikal sesuai regulasi PLN & ESDM.',
      icon: Compass,
    },
    {
      number: '02',
      title: 'Pengadaan Komponen Tier-1',
      desc: 'Kemitraan langsung dengan manufaktur global modul surya Bloomberg Tier-1, inverter bergaransi resmi, baterai lithium LiFePO4 bersertifikat IEC/UL, dan material mounting tahan korosi.',
      icon: Cpu,
    },
    {
      number: '03',
      title: 'Instalasi & Commissioning',
      desc: 'Pelaksanaan instalasi oleh teknisi bersertifikasi K3 dan kompetensi ketenagalistrikan (SKTTK), pengujian isolasi megger test, sinkronisasi inverter, dan pendampingan uji laik operasi (SLO).',
      icon: Wrench,
    },
    {
      number: '04',
      title: 'Pemeliharaan & After-Sales (O&M)',
      desc: 'Pemantauan operasional IoT berbasis cloud, pembersihan berkala panel surya, pengecekan sambungan termal inframerah, dan garansi layanan 4 tahap dengan respons darurat 24/7.',
      icon: Shield,
    },
  ];

  const clientSectors = [
    { title: 'Residensial', desc: 'Rumah tinggal mewah & cluster mandiri energi', icon: Home },
    { title: 'Komersial', desc: 'Perkantoran, pusat belanja, hotel, dan ruko', icon: Building },
    { title: 'Industri Manufaktur', desc: 'Pabrik skala besar & gudang logistik', icon: Factory },
    { title: 'BUMN & Pemerintah', desc: 'PJU, PATS irigasi, dan fasilitas publik nasional', icon: Landmark },
  ];

  return (
    <section id="tentang" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
            Tentang Kami
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ textWrap: 'balance' }}>
            Spesialis Rekayasa Energi Surya Terpercaya Sejak 2019
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            PT Mitra Karya Ausindo (MKA Energy Solution) berfokus pada penyediaan sistem Pembangkit Listrik Tenaga Surya (PLTS) dan energi terbarukan komprehensif. Kami menjembatani kebutuhan efisiensi biaya listrik operasional dan pemenuhan target dekarbonisasi Net Zero Emission di Indonesia.
          </p>
        </div>

        {/* 4 End-to-End Capabilities */}
        <div className="mb-16">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2">
            <span>Kapabilitas Terintegrasi End-to-End</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.number}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:border-[#0EA5E9] transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-[#0EA5E9]">{item.number}</span>
                      <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-[#0EA5E9] border border-sky-100">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sectors Served Grid */}
        <div className="mb-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div className="max-w-2xl mb-6">
            <h3 className="text-lg font-bold text-[#0F172A]">
              Sektor Layanan di Seluruh Nusantara
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Melayani kebutuhan energi bersih dari Pulau Jawa hingga kawasan terluar Indonesia dengan standar teknik internasional.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clientSectors.map((sector, idx) => {
              const Icon = sector.icon;
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 hover:bg-sky-50/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-[#0EA5E9] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">{sector.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{sector.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Office Locations: Head Office Meikarta & Branch Office Depok */}
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-6">
            Jangkauan Kantor & Operasional Kami
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Head Office */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>{companyInfo.headOffice.title} (Kabupaten Bekasi)</span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">
                OAKVIEW Tower - District 1 Meikarta
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {companyInfo.headOffice.address}
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Telp: {companyInfo.headOffice.phone}</span>
                <span className="font-semibold text-slate-700">Pusat Rekayasa & Engineering</span>
              </div>
            </div>

            {/* Branch Office */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>{companyInfo.branchOffice.title} (Kota Depok)</span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">
                Beji - Kota Depok
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {companyInfo.branchOffice.address}
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Telp: {companyInfo.branchOffice.phone}</span>
                <span className="font-semibold text-slate-700">Layanan Operasional & Service Desk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
