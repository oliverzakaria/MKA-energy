import React, { useState, useId } from 'react';
import { Calculator, Check, ArrowRight, Sparkles, TrendingUp, Sun, Leaf, Shield } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface SolarCalculatorProps {
  onApplyToSurvey: (calculation: {
    capacityKwp: number;
    investment: number;
    monthlySavings: number;
    systemType: string;
  }) => void;
}

export const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onApplyToSurvey }) => {
  const [monthlyBill, setMonthlyBill] = useState<number>(5000000); // 5 Juta IDR default
  const [tariffCategory, setTariffCategory] = useState<'R2' | 'R3' | 'B2' | 'I3'>('R2');
  const [targetOffsetPercent, setTargetOffsetPercent] = useState<number>(70); // 70% offset
  const [systemType, setSystemType] = useState<'ongrid' | 'hybrid'>('ongrid');

  // Input field IDs for accessibility
  const billSliderId = useId();
  const billInputId = useId();
  const tariffSelectId = useId();

  // Tariff rate per kWh (PLN Tariff adjustment standard IDR)
  const tariffRates: Record<string, number> = {
    R2: 1699, // Rumah Tangga 3500-5500 VA
    R3: 1699, // Rumah Tangga 6600 VA+
    B2: 1524, // Bisnis Menengah
    I3: 1114, // Industri Menengah
  };

  const ratePerKwh = tariffRates[tariffCategory] || 1699;

  // Monthly kWh consumption
  const monthlyKwh = monthlyBill / ratePerKwh;
  // Daily target solar kWh (accounting for average 3.8 - 4.0 peak sun hours in Indonesia)
  const targetMonthlyKwh = (monthlyKwh * targetOffsetPercent) / 100;
  const peakSunHoursDaily = 3.8;
  const daysPerMonth = 30;

  // Required capacity in kWp
  const calculatedKwp = Math.max(1.5, parseFloat((targetMonthlyKwh / (peakSunHoursDaily * daysPerMonth * 0.82)).toFixed(1)));

  // Roof area required (~6.5 m² per 1 kWp using high-efficiency 580Wp modules)
  const requiredRoofAreaM2 = Math.round(calculatedKwp * 6.5);

  // Investment cost calculation (Rp per Watt-peak standard Indonesian EPC market)
  // On-grid: ~Rp 13.500.000 / kWp
  // Hybrid with LiFePO4: ~Rp 21.000.000 / kWp
  const costPerKwp = systemType === 'hybrid' ? 21000000 : 13500000;
  const rawInvestment = Math.round(calculatedKwp * costPerKwp);
  // Ensure minimum realistic project scale
  const estimatedInvestment = Math.max(30000000, rawInvestment);

  // Monthly savings (Rp)
  const estimatedMonthlySavings = Math.round(targetMonthlyKwh * ratePerKwh);
  const annualSavings = estimatedMonthlySavings * 12;
  const savings25Years = Math.round(annualSavings * 25 * 1.15); // with conservative 3% electricity tariff inflation factor

  // Payback period (Years)
  const paybackPeriodYears = parseFloat((estimatedInvestment / annualSavings).toFixed(1));

  // CO2 reduction (1 kWh solar ~ 0.85 kg CO2 in Indonesian coal-heavy grid)
  const annualCo2ReductionTon = parseFloat(((targetMonthlyKwh * 12 * 0.85) / 1000).toFixed(1));

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleApply = () => {
    onApplyToSurvey({
      capacityKwp: calculatedKwp,
      investment: estimatedInvestment,
      monthlySavings: estimatedMonthlySavings,
      systemType: systemType === 'hybrid' ? 'PLTS Hybrid with Battery Storage' : 'PLTS On-Grid System',
    });
  };

  return (
    <section id="simulasi" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
            Simulasi & Kalkulator Harga
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ textWrap: 'balance' }}>
            Hitung Estimasi Kapasitas PLTS & Penghematan Bulanan Anda
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Gunakan widget interaktif ini untuk menghitung secara instan perkiraan ukuran sistem PLTS, luas atap yang dibutuhkan, total investasi, serta periode balik modal (ROI).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor={billSliderId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Rata-rata Tagihan Listrik PLN / Bulan
                </label>
                <span className="text-base font-extrabold text-[#0EA5E9] font-tabular">
                  {formatRupiah(monthlyBill)}
                </span>
              </div>
              <input
                id={billSliderId}
                aria-label="Rata-rata Tagihan Listrik PLN per Bulan Slider"
                type="range"
                min={1500000}
                max={60000000}
                step={500000}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Rp 1.5 Juta</span>
                <span>Rp 30 Juta</span>
                <span>Rp 60 Juta+</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-600">Atau ketik nominal:</span>
                <input
                  id={billInputId}
                  aria-label="Nominal Tagihan Listrik PLN per Bulan Angka"
                  type="number"
                  min={500000}
                  step={100000}
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Math.max(500000, Number(e.target.value)))}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md w-36 font-tabular focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>
            </div>

            {/* Tariff Category */}
            <div>
              <label htmlFor={tariffSelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Golongan Tarif PLN
              </label>
              <select
                id={tariffSelectId}
                aria-label="Pilih Golongan Tarif PLN"
                value={tariffCategory}
                onChange={(e) => setTariffCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0EA5E9] font-medium text-slate-800"
              >
                <option value="R2">R-2 Rumah Tangga Menengah (3.500 - 5.500 VA) @ Rp 1.699/kWh</option>
                <option value="R3">R-3 Rumah Tangga Besar (6.600 VA ke atas) @ Rp 1.699/kWh</option>
                <option value="B2">B-2 Bisnis / Komersial Ruko (6.600 - 200 kVA) @ Rp 1.524/kWh</option>
                <option value="I3">I-3 Industri Menengah (di atas 200 kVA) @ Rp 1.114/kWh</option>
              </select>
            </div>

            {/* Target Offset % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target Penghematan Daya
                </span>
                <span className="text-sm font-bold text-slate-800 font-tabular">
                  {targetOffsetPercent}% dari beban tagihan
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[50, 70, 85, 95].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTargetOffsetPercent(pct)}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      targetOffsetPercent === pct
                        ? 'bg-[#0EA5E9] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* System Type */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Konfigurasi Sistem yang Diinginkan
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSystemType('ongrid')}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    systemType === 'ongrid'
                      ? 'border-[#0EA5E9] bg-sky-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-[#0F172A]">PLTS On-Grid</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Sinkronisasi PLN, hemat biaya tanpa baterai, ROI tercepat (3-5 tahun).
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSystemType('hybrid')}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    systemType === 'hybrid'
                      ? 'border-[#0EA5E9] bg-sky-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-[#0F172A]">PLTS Hybrid + Baterai</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Dilengkapi baterai LiFePO4, bebas padam, proteksi saat PLN mati.
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Results Box */}
          <div className="lg:col-span-6 bg-[#0F172A] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Hasil Perhitungan Estimasi MKA
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  Spesifikasi Rekomendasi Sistem
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-[#0EA5E9]">
                <Sun className="w-6 h-6" />
              </div>
            </div>

            {/* Key KPI banner */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0B1120]/80 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Kapasitas Rekomendasi</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] font-tabular mt-1">
                  {calculatedKwp} <span className="text-sm font-semibold text-slate-300">kWp</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Area Atap: ±{requiredRoofAreaM2} m²
                </div>
              </div>

              <div className="bg-[#0B1120]/80 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Estimasi Hemat / Bulan</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#10B981] font-tabular mt-1">
                  {formatRupiah(estimatedMonthlySavings)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {(targetMonthlyKwh).toFixed(0)} kWh listrik bersih
                </div>
              </div>
            </div>

            {/* Breakdown Rows */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">Estimasi Nilai Investasi (Turnkey):</span>
                <span className="font-extrabold text-white font-tabular">
                  {formatRupiah(estimatedInvestment)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">Periode Balik Modal (Payback / ROI):</span>
                <span className="font-bold text-[#F59E0B] font-tabular">
                  ± {paybackPeriodYears} Tahun
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">Total Penghematan 25 Tahun:</span>
                <span className="font-extrabold text-[#10B981] font-tabular">
                  {formatRupiah(savings25Years)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">Reduksi Emisi Karbon per Tahun:</span>
                <span className="font-bold text-white font-tabular">
                  {annualCo2ReductionTon} Ton CO2 / Tahun
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleApply}
                className="w-full py-3.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-500/25 active:scale-98"
              >
                <span>Terapkan Hasil Ini ke Form Permintaan Survey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={COMPANY_INFO.whatsappUrl + `&text=Halo%20MKA,%20saya%20sudah%20hitung%20di%20kalkulator%20web:%0ATagihan:%20${encodeURIComponent(formatRupiah(monthlyBill))}%0ARekomendasi:%20${calculatedKwp}kWp%0ATipe:%20${systemType === 'hybrid' ? 'Hybrid' : 'On-Grid'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <span>Konsultasikan Rincian ini via WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              *Perhitungan ini merupakan estimasi awal berdasarkan radiasi matahari rata-rata Indonesia (3.8 peak sun hours). Nilai final dipastikan setelah survey teknis struktur atap dan kelistrikan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
