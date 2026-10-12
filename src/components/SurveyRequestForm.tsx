import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, CheckCircle2, ChevronRight, MapPin, Send, ShieldAlert, Sparkles, Building2, User, Phone, Mail } from 'lucide-react';
import { SurveyRequest } from '../types';

interface SurveyRequestFormProps {
  initialData?: {
    capacityKwp?: number;
    investment?: number;
    monthlySavings?: number;
    systemType?: string;
    productName?: string;
  } | null;
  onSurveySubmitted: (survey: SurveyRequest) => void;
}

export const SurveyRequestForm: React.FC<SurveyRequestFormProps> = ({
  initialData,
  onSurveySubmitted,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Bekasi / Cikarang',
    address: '',
    propertyType: 'Residensial' as SurveyRequest['propertyType'],
    estimatedInvestment: 35000000, // Default above min 30 juta
    targetSurveyDate: '',
    roofType: 'Genteng Keramik / Beton Miring',
    notes: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<SurveyRequest | null>(null);

  // Sync with initialData if passed from Calculator or Product card
  useEffect(() => {
    if (initialData) {
      if (initialData.investment) {
        setFormData((prev) => ({
          ...prev,
          estimatedInvestment: Math.max(30000000, initialData.investment!),
        }));
      }
      if (initialData.productName) {
        setFormData((prev) => ({
          ...prev,
          notes: `Permintaan penawaran spesifik untuk: ${initialData.productName}`,
        }));
      } else if (initialData.systemType && initialData.capacityKwp) {
        setFormData((prev) => ({
          ...prev,
          notes: `Hasil Simulasi: ${initialData.systemType} kapasitas ~${initialData.capacityKwp} kWp`,
        }));
      }
    }
  }, [initialData]);

  const MIN_INVESTMENT = 30000000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.estimatedInvestment < MIN_INVESTMENT) {
      setValidationError('Nilai estimasi investasi minimal untuk penjadwalan survey lokasi teknis adalah Rp 30.000.000,-. Untuk kebutuhan di bawah nilai ini, silakan memanfaatkan menu Belanja Retail atau konsultasi online.');
      return;
    }

    setValidationError(null);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newSurvey: SurveyRequest = {
      id: `srv-${Date.now()}`,
      ticketCode: `MKA-SRV-2026-${randomNum}`,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      address: formData.address,
      propertyType: formData.propertyType,
      estimatedInvestment: Number(formData.estimatedInvestment),
      targetSurveyDate: formData.targetSurveyDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      roofType: formData.roofType,
      notes: formData.notes,
      status: 'Menunggu Review',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onSurveySubmitted(newSurvey);
    setSubmittedTicket(newSurvey);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="survey" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
            Permintaan Survey Lokasi
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ textWrap: 'balance' }}>
            Jadwalkan Survey Teknis Lapangan oleh Tim Engineering MKA
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Tim insinyur kami akan melakukan inspeksi fisik struktur atap, pemetaan orientasi arah matahari (azimuth/tilt), dan pengukuran kapasitas distribusi kelistrikan di lokasi Anda.
          </p>
        </div>

        {/* Investment Requirement Banner */}
        <div className="mb-8 p-5 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#0EA5E9] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            <span className="font-bold text-sky-900">Ketentuan Survey Lokasi:</span>{' '}
            Survey fisik teknis on-site dilayani untuk proyek dengan perkiraan minimal nilai investasi sistem sebesar{' '}
            <span className="font-bold underline decoration-sky-500 text-[#0F172A]">Rp 30.000.000,- (Tiga Puluh Juta Rupiah)</span>.
            Untuk pembelian unit terpisah atau sparepart satuan, silakan gunakan menu{' '}
            <a href="#retail" className="font-bold text-sky-700 underline hover:text-sky-900">
              Belanja Retail Komponen
            </a>.
          </div>
        </div>

        {submittedTicket ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Permintaan Berhasil Didaftarkan
              </span>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">
                Jadwal Survey Segera Dikonfirmasi
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Terima kasih, Bapak/Ibu <span className="font-semibold text-slate-900">{submittedTicket.fullName}</span>. Tim Service Desk MKA Energy Solution akan menghubungi nomor WhatsApp Anda dalam 1x24 jam untuk koordinasi teknis.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 font-tabular">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Registrasi Survey:</span>
                <span className="font-mono font-bold text-[#0F172A]">{submittedTicket.ticketCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rencana Tanggal:</span>
                <span className="font-semibold text-[#0F172A]">{submittedTicket.targetSurveyDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimasi Nilai Investasi:</span>
                <span className="font-bold text-[#0EA5E9]">{formatRupiah(submittedTicket.estimatedInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wilayah Lokasi:</span>
                <span className="font-semibold text-[#0F172A]">{submittedTicket.city}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmittedTicket(null)}
              className="px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Ajukan Permintaan Survey Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            {validationError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Nama Lengkap / Kontak Person *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Contoh: Hendra Wijaya"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Nomor WhatsApp Aktif *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: 0812-8888-xxxx"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Email Perusahaan / Pribadi *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hendra@perusahaan.co.id"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Kategori Properti / Lokasi *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0EA5E9] text-slate-800"
                >
                  <option value="Residensial">Residensial (Rumah Tinggal / Cluster)</option>
                  <option value="Pabrik / Industri">Pabrik / Kawasan Industri Manufaktur</option>
                  <option value="Komersial / Ruko">Komersial (Ruko, Kantor, Hotel, Mall)</option>
                  <option value="Pertanian / Irigasi">Pertanian / Irigasi (Pompa Air PATS)</option>
                  <option value="Instansi / BUMN">Instansi Pemerintah / BUMN / Fasilitas Publik</option>
                </select>
              </div>

              {/* City / Wilayah */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Kota / Wilayah Instalasi *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0EA5E9] text-slate-800"
                >
                  <option value="Bekasi / Cikarang (Dekat Head Office Meikarta)">Bekasi / Cikarang (Dekat Head Office Meikarta)</option>
                  <option value="Kota Depok (Dekat Branch Office Beji)">Kota Depok (Dekat Branch Office Beji)</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Bogor / Cibinong">Bogor / Cibinong</option>
                  <option value="Tangerang & Banten">Tangerang & Banten</option>
                  <option value="Karawang / Purwakarta">Karawang / Purwakarta</option>
                  <option value="Wilayah Lain (Jawa Barat / Jawa Tengah / Jawa Timur)">Wilayah Lain (Jawa Barat / Tengah / Timur)</option>
                  <option value="Luar Pulau Jawa (Sumatera / Kalimantan / Sulawesi / Bali / NTT)">Luar Pulau Jawa (Sumatera / Kalimantan / Sulawesi / NTT)</option>
                </select>
              </div>

              {/* Target Survey Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Target Tanggal Survey *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    required
                    value={formData.targetSurveyDate}
                    onChange={(e) => setFormData({ ...formData, targetSurveyDate: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Alamat Lengkap Lokasi Properti *
              </label>
              <textarea
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Nama Jalan No. XX, Nama Kompleks / Blok Kawasan Industri, Kelurahan, Kecamatan..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            {/* Investment Estimate Input with strict Minimum Rule */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Perkiraan Nilai Investasi (Minimal Rp 30.000.000,-) *
                </label>
                <span className="text-sm font-extrabold text-[#0EA5E9] font-tabular">
                  {formatRupiah(formData.estimatedInvestment)}
                </span>
              </div>
              <input
                type="range"
                min={20000000}
                max={500000000}
                step={5000000}
                value={formData.estimatedInvestment}
                onChange={(e) => setFormData({ ...formData, estimatedInvestment: Number(e.target.value) })}
                className="w-full accent-[#0EA5E9] cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span className={formData.estimatedInvestment < MIN_INVESTMENT ? 'text-red-600 font-bold' : ''}>
                  Rp 20 Jt (Di bawah min)
                </span>
                <span className="font-semibold text-slate-700">Rp 30 Juta (Batas Minimum Survey)</span>
                <span>Rp 500 Juta+</span>
              </div>

              {formData.estimatedInvestment < MIN_INVESTMENT && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  ⚠️ Nilai di bawah Rp 30.000.000,- tidak memenuhi kualifikasi survey lapangan. Harap tingkatkan nilai atau gunakan pembelian retail.
                </p>
              )}
            </div>

            {/* Roof & Electrical Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Tipe Atap Properti
                </label>
                <input
                  type="text"
                  value={formData.roofType}
                  onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                  placeholder="Contoh: Metal Spandek / Genteng Keramik / Dak Beton"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Catatan Kebutuhan Tambahan
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Contoh: Perlu sistem backup baterai jika listrik PLN padam"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Data Anda terenkripsi aman dan hanya digunakan untuk keperluan teknis MKA.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-500/25 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Permintaan Survey Lokasi</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
