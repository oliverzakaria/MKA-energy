import React from 'react';
import { ArrowRight, Calculator, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface HeroProps {
  onCalculateClick: () => void;
  onSurveyClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCalculateClick, onSurveyClick }) => {
  return (
    <section className="relative bg-[#F8FAFC] border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
              <span>PT Mitra Karya Ausindo</span>
              <span aria-hidden="true">·</span>
              <span>Spesialis PLTS Sejak 2019</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold">mkaenergy.co.id</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Solusi Energi Terbarukan & PLTS Terintegrasi End-to-End di Indonesia
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              MKA Energy Solution menghadirkan perancangan, pengadaan komponen Tier-1, instalasi bersertifikasi, hingga sistem pemantauan realtime dan purna jual 4 tahap untuk sektor residensial, industri, BUMN, dan pemerintah.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                <span>PLTS On-Grid, Hybrid & Off-Grid Mandiri</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                <span>Garansi Performa Modul Surya 25 Tahun</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                <span>Monitoring Realtime IoT 24/7 Berbasis Cloud</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                <span>Dukungan Teknis Cepat Kantor Bekasi & Depok</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onSurveyClick}
                className="px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-[#0EA5E9] rounded-lg hover:bg-[#0284C7] transition-all shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Permintaan Survey Lokasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCalculateClick}
                className="px-6 py-3.5 text-sm font-semibold text-[#0F172A] bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-300 shadow-xs"
              >
                <Calculator className="w-4 h-4 text-[#0EA5E9]" />
                <span>Hitung Simulasi Hemat Daya</span>
              </button>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Ketentuan survey lokasi: Minimal estimasi nilai investasi Rp30.000.000,-</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white aspect-16/10 lg:aspect-4/3 group">
              <img
                src="/uploads/hero_solar_rooftop_1791532004071.jpg"
                alt="Instalasi Rooftop Solar PV MKA Energy Solution"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  <span>Teknologi Monocrystalline Tier-1</span>
                </div>
                <h3 className="text-lg font-bold">Instalasi PLTS Atap Standar Industri</h3>
                <p className="text-xs text-slate-200 mt-1">
                  Mendukung efisiensi energi optimal dan reduksi emisi karbon untuk masa depan berkelanjutan Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Proof & Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-12 border-t border-slate-200">
          {COMPANY_INFO.stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-tabular">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
