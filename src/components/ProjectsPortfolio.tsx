import React, { useState } from 'react';
import { Project } from '../types';
import { INITIAL_PROJECTS, COMPANY_INFO } from '../data/mockData';
import { ArrowUpRight, CheckCircle2, MessageCircle, PhoneCall, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface ProjectsPortfolioProps {
  projects: Project[];
}

export const ProjectsPortfolio: React.FC<ProjectsPortfolioProps> = ({ projects }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Proyek' },
    { id: 'industrial', label: 'Industri & Manufaktur' },
    { id: 'commercial', label: 'Komersial & Gedung' },
    { id: 'residential', label: 'Residensial Mewah' },
    { id: 'agriculture', label: 'Irigasi & Pertanian (PATS)' },
  ];

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="proyek" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with direct CTA emphasis */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
              Portofolio Proyek
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ textWrap: 'balance' }}>
              Bukti Kinerja Nyata & Jejak Rekayasa PLTS di Indonesia
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Mulai dari atap pabrik skala megawatt di kawasan industri Cikarang hingga sistem pompa air mandiri di pedesaan, MKA Energy Solution memastikan efisiensi daya maksimal.
            </p>
          </div>

          {/* Quick Lead Generation CTA Box */}
          <div className="bg-[#0F172A] text-white p-5 rounded-xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>Konsultasi Proyek Cepat</span>
              </div>
              <div className="text-sm font-extrabold text-white">Konsultasi Gratis / Hotline 24 Jam</div>
            </div>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Hubungi WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-[#0F172A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#0EA5E9] hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-[#0F172A]/85 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-md">
                    {proj.systemType}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#F59E0B] text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-xs">
                    {proj.capacityKwp} kWp
                  </div>
                </div>

                <div className="p-6">
                  {/* Unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span>{proj.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>Selesai {proj.completionYear}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 leading-snug group-hover:text-[#0EA5E9] transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-500 mb-3">
                    Klien: {proj.client}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {proj.description}
                  </p>

                  {/* Impact metrics row */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <div className="text-xs text-slate-500">Estimasi Hemat Daya</div>
                      <div className="text-sm sm:text-base font-extrabold text-[#0F172A] font-tabular mt-0.5">
                        {proj.monthlySavingsKwh.toLocaleString('id-ID')} kWh/bln
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Reduksi Emisi Karbon</div>
                      <div className="text-sm sm:text-base font-extrabold text-[#10B981] font-tabular mt-0.5">
                        {proj.annualCo2ReductionTon} Ton CO2/thn
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action bar directly driving lead consultation */}
              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Tertarik dengan skema serupa?
                </span>
                <a
                  href={COMPANY_INFO.whatsappUrl + `&text=Halo%20MKA,%20saya%20tertarik%20konsultasi%20proyek%20serupa%20dengan:%20${encodeURIComponent(proj.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Konsultasi Proyek Ini</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Big Conversion Callout Section */}
        <div className="rounded-2xl bg-[#0F172A] text-white p-8 sm:p-12 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Layanan Hotline & Engineering Response 24 Jam
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Siap Menurunkan Biaya Listrik Operasional Anda?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tim insinyur MKA Energy Solution siap melakukan studi kelayakan awal gratis dan simulasi penghematan beban daya untuk properti residensial maupun industri Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-sky-500/25 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Chat WhatsApp 24 Jam</span>
            </a>
            <a
              href={`tel:${COMPANY_INFO.headOffice.phone}`}
              className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hubungi Kantor Pusat</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
