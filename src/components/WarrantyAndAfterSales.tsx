import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Search, ShieldCheck, Star, Wrench, AlertCircle, Send } from 'lucide-react';
import { INITIAL_TICKETS, COMPANY_INFO } from '../data/mockData';
import { ServiceTicket } from '../types';

interface WarrantyAndAfterSalesProps {
  tickets: ServiceTicket[];
  onAddTicket: (ticket: ServiceTicket) => void;
}

export const WarrantyAndAfterSales: React.FC<WarrantyAndAfterSalesProps> = ({ tickets, onAddTicket }) => {
  const [searchTicket, setSearchTicket] = useState('');
  const [searchedTicket, setSearchedTicket] = useState<ServiceTicket | null>(null);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  // Quick report issue modal / form
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({
    clientName: '',
    systemLocation: '',
    systemType: 'PLTS Hybrid Residensial',
    issueDescription: '',
    phone: '',
  });
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  const stages = [
    {
      step: 1,
      title: 'Laporan Masuk',
      highlight: 'Respon Cepat < 30 Menit',
      desc: 'Pengaduan diterima melalui WhatsApp Hotline 24 Jam atau formulir tiket portal kami. Tim Service Desk langsung membuat nomor tiket dan mengonfirmasi jadwal respons.',
      icon: MessageSquare,
      color: 'amber',
    },
    {
      step: 2,
      title: 'Diagnosa Lapangan',
      highlight: 'Analisis Insinyur Bersertifikat',
      desc: 'Insinyur teknis melakukan pemeriksaan menyeluruh: analisis data log telemetri inverter, inspeksi thermal scanner sambungan kabel, dan pengujian isolasi modul.',
      icon: Search,
      color: 'blue',
    },
    {
      step: 3,
      title: 'Perbaikan Terstandar',
      highlight: 'Suku Cadang Asli & Prosedur K3',
      desc: 'Eksekusi perbaikan sesuai SOP ketat. Penggantian komponen orisinal bergaransi resmi, kalibrasi ulang MPPT, serta tune-up sistem kelistrikan.',
      icon: Wrench,
      color: 'purple',
    },
    {
      step: 4,
      title: 'Verifikasi & Rating',
      highlight: 'Komitmen Kualitas & Ulasan Klien',
      desc: 'Uji laik ulang bersama pemilik sistem. Penyerahan berita acara serah terima perbaikan, serta pengisian evaluasi kepuasan bintang layanan pelanggan.',
      icon: Star,
      color: 'emerald',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicket.trim()) return;

    const found = tickets.find((t) =>
      t.ticketNumber.toLowerCase().includes(searchTicket.trim().toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchTicket.trim().toLowerCase())
    );

    if (found) {
      setSearchedTicket(found);
      setSearchMessage(null);
    } else {
      setSearchedTicket(null);
      setSearchMessage(`Tiket "${searchTicket}" tidak ditemukan. Silakan cek kembali nomor tiket Anda.`);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.clientName || !reportForm.issueDescription) return;

    const newTicketNum = `MKA-SRV-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: ServiceTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: newTicketNum,
      clientName: reportForm.clientName,
      systemLocation: reportForm.systemLocation || 'Indonesia',
      systemType: reportForm.systemType,
      currentStage: 1,
      issueDescription: reportForm.issueDescription,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Open',
    };

    onAddTicket(newTicket);
    setReportSuccess(newTicketNum);
    setSearchedTicket(newTicket);
    setReportForm({
      clientName: '',
      systemLocation: '',
      systemType: 'PLTS Hybrid Residensial',
      issueDescription: '',
      phone: '',
    });
  };

  return (
    <section id="garansi" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
            Garansi & Layanan Purna Jual
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ textWrap: 'balance' }}>
            Komitmen Pemeliharaan Terstruktur 4 Tahap
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Investasi energi surya Anda dilindungi secara menyeluruh. MKA Energy Solution menerapkan alur purna jual transparan agar pembangkit listrik tenaga surya selalu beroperasi pada efisiensi puncak selama puluhan tahun.
          </p>
        </div>

        {/* 4-Stage Maintenance Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stages.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#0EA5E9] transition-all relative hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white font-extrabold text-xs flex items-center justify-center">
                      {st.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-[#0EA5E9] border border-sky-100">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] mb-1">
                    Tahap {st.step}: {st.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#0EA5E9] mb-3">
                    {st.highlight}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warranty Badges Row */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 mb-16 shadow-xs">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-6">
            Jaminan Garansi Perlindungan Resmi MKA
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">25 Tahun Garansi Modul</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Jaminan performa linear degradasi maksimal 0.55% per tahun dari pabrikan Tier-1.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#0EA5E9] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">5 - 10 Tahun Inverter</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Penggantian unit atau suku cadang resmi didukung distributor nasional.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">5 - 10 Tahun Baterai LiFePO4</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Garansi kapasitas retention hingga 6.000 siklus charge/discharge harian.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">1 Tahun Free Maintenance O&M</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Termasuk 2x pembersihan panel berkala dan inspeksi menyeluruh tanpa biaya tambahan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Ticket Tracker & Service Submission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Pusat Pelaporan Masuk & Pantau Status Servis
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Lacak perkembangan tiket perbaikan Anda secara real-time atau ajukan kendala teknis baru.
              </p>
            </div>

            <button
              onClick={() => {
                setShowReportForm(!showReportForm);
                setReportSuccess(null);
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0F172A] hover:bg-slate-800 rounded-lg transition-colors cursor-pointer self-start md:self-auto shadow-xs"
            >
              {showReportForm ? 'Tutup Formulir' : '+ Buat Laporan Kendala Teknis'}
            </button>
          </div>

          {/* New Report Form (Collapsible) */}
          {showReportForm && (
            <form onSubmit={handleCreateTicket} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Formulir Pengaduan Servis (Tahap 1: Laporan Masuk)
              </div>

              {reportSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                  Laporan berhasil diajukan! Nomor Tiket Anda:{' '}
                  <span className="font-bold">{reportSuccess}</span>. Tim kami akan menghubungi dalam waktu maksimal 30 menit.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pelanggan / Perusahaan
                  </label>
                  <input
                    type="text"
                    required
                    value={reportForm.clientName}
                    onChange={(e) => setReportForm({ ...reportForm, clientName: e.target.value })}
                    placeholder="Contoh: PT Surya Logistik / Bapak Roni"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={reportForm.phone}
                    onChange={(e) => setReportForm({ ...reportForm, phone: e.target.value })}
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi / Kota Instalasi
                  </label>
                  <input
                    type="text"
                    value={reportForm.systemLocation}
                    onChange={(e) => setReportForm({ ...reportForm, systemLocation: e.target.value })}
                    placeholder="Contoh: Meikarta, Cikarang / Depok"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian Kendala / Kebutuhan Maintenance
                </label>
                <textarea
                  required
                  rows={2}
                  value={reportForm.issueDescription}
                  onChange={(e) => setReportForm({ ...reportForm, issueDescription: e.target.value })}
                  placeholder="Ceritakan indikasi masalah, misal: lampu indikator merah menyala, produksi daya turun, atau permohonan cuci panel berkala."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-sky-500/20 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Laporan Servis</span>
                </button>
              </div>
            </form>
          )}

          {/* Search bar for tickets */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mb-6">
            <input
              type="text"
              value={searchTicket}
              onChange={(e) => setSearchTicket(e.target.value)}
              placeholder="Masukkan nomor tiket (contoh: MKA-SRV-TKT-1082) atau nama..."
              className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0EA5E9]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari Tiket</span>
            </button>
          </form>

          {searchMessage && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs mb-4">
              {searchMessage}
            </div>
          )}

          {/* Tracked Ticket Detail Display */}
          {searchedTicket ? (
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-xs text-slate-500">Nomor Tiket:</div>
                  <div className="text-base font-extrabold text-[#0F172A] font-mono">
                    {searchedTicket.ticketNumber}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Status:</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    searchedTicket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {searchedTicket.status}
                  </span>
                </div>
              </div>

              {/* Step indicator */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="text-center">
                    <div className={`h-1.5 rounded-full mb-1.5 ${
                      stepNum <= searchedTicket.currentStage ? 'bg-[#0EA5E9]' : 'bg-slate-200'
                    }`} />
                    <div className="text-[11px] font-semibold text-slate-700">
                      Tahap {stepNum}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-slate-500">Klien / Lokasi:</span>
                  <div className="font-semibold text-slate-800">
                    {searchedTicket.clientName} ({searchedTicket.systemLocation})
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Insinyur Bertugas:</span>
                  <div className="font-semibold text-slate-800">
                    {searchedTicket.technicianAssigned || 'Sedang Ditugaskan'}
                  </div>
                </div>
              </div>

              <div className="text-xs bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500">Kendala Dilaporkan:</span>
                <p className="text-slate-800 mt-1">{searchedTicket.issueDescription}</p>
                {searchedTicket.diagnosisNotes && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-slate-700">
                    <span className="font-semibold text-sky-700">Diagnosa Lapangan:</span>{' '}
                    {searchedTicket.diagnosisNotes}
                  </div>
                )}
                {searchedTicket.repairActions && (
                  <div className="mt-1 text-slate-700">
                    <span className="font-semibold text-emerald-700">Perbaikan Selesai:</span>{' '}
                    {searchedTicket.repairActions}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Contoh nomor tiket aktif yang dapat Anda uji:{' '}
              <button
                onClick={() => {
                  setSearchedTicket(tickets[0]);
                  setSearchTicket(tickets[0].ticketNumber);
                }}
                className="font-mono text-[#0EA5E9] underline font-semibold cursor-pointer"
              >
                MKA-SRV-TKT-1082
              </button>{' '}
              atau{' '}
              <button
                onClick={() => {
                  setSearchedTicket(tickets[1]);
                  setSearchTicket(tickets[1].ticketNumber);
                }}
                className="font-mono text-[#0EA5E9] underline font-semibold cursor-pointer"
              >
                MKA-SRV-TKT-1079
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
