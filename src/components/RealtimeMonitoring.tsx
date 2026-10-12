import React, { useState } from 'react';
import { Activity, BatteryCharging, CloudSun, Compass, Cpu, Gauge, RefreshCw, Sun, Zap } from 'lucide-react';
import { MonitoringTelemetry } from '../types';

export const RealtimeMonitoring: React.FC = () => {
  // Preset conditions for interactive demo
  type TimePreset = 'morning' | 'peak_noon' | 'cloudy' | 'night';

  const [activePreset, setActivePreset] = useState<TimePreset>('peak_noon');
  const [selectedInverter, setSelectedInverter] = useState<'inv-1' | 'inv-2'>('inv-1');

  const presetData: Record<TimePreset, MonitoringTelemetry> = {
    morning: {
      powerOutputKw: 42.4,
      dailyYieldKwh: 118.2,
      monthlyYieldMwh: 14.8,
      totalYieldMwh: 342.1,
      batterySoc: 72,
      batteryPowerKw: 8.5,
      gridExchangeKw: 5.2,
      inverterTempC: 38.5,
      performanceRatio: 83.2,
      co2SavedTotalTon: 284.6,
      status: 'Normal',
    },
    peak_noon: {
      powerOutputKw: 88.6,
      dailyYieldKwh: 286.4,
      monthlyYieldMwh: 15.2,
      totalYieldMwh: 342.5,
      batterySoc: 98,
      batteryPowerKw: 4.2,
      gridExchangeKw: 42.1, // High export / surplus
      inverterTempC: 45.2,
      performanceRatio: 86.4,
      co2SavedTotalTon: 285.2,
      status: 'Normal',
    },
    cloudy: {
      powerOutputKw: 24.1,
      dailyYieldKwh: 194.0,
      monthlyYieldMwh: 15.0,
      totalYieldMwh: 342.3,
      batterySoc: 85,
      batteryPowerKw: -2.1,
      gridExchangeKw: -4.8, // Importing slight power
      inverterTempC: 36.1,
      performanceRatio: 78.5,
      co2SavedTotalTon: 284.9,
      status: 'Normal',
    },
    night: {
      powerOutputKw: 0.0,
      dailyYieldKwh: 348.5,
      monthlyYieldMwh: 15.3,
      totalYieldMwh: 342.8,
      batterySoc: 64,
      batteryPowerKw: -12.4, // Discharging to load
      gridExchangeKw: -1.2,
      inverterTempC: 28.2,
      performanceRatio: 84.1,
      co2SavedTotalTon: 285.4,
      status: 'Standby',
    },
  };

  const current = presetData[activePreset];

  return (
    <section id="monitoring" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-3xl">
            <div className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
              Monitoring Realtime IoT Cloud
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ textWrap: 'balance' }}>
              Pemantauan Kinerja PLTS Jarak Jauh 24/7
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Seluruh klien MKA Energy Solution mendapatkan akses telemetri real-time melalui dashboard mobile dan web. Pantau produksi daya, kesehatan inverter, status baterai, dan penghematan biaya secara transparan kapan saja.
            </p>
          </div>

          {/* Interactive Simulation Preset Switcher */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Simulasi Kondisi Waktu & Cuaca:
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActivePreset('morning')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activePreset === 'morning'
                    ? 'bg-[#0EA5E9] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Pagi (08:30)
              </button>
              <button
                onClick={() => setActivePreset('peak_noon')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activePreset === 'peak_noon'
                    ? 'bg-[#0EA5E9] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Siang Terik (12:00)
              </button>
              <button
                onClick={() => setActivePreset('cloudy')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activePreset === 'cloudy'
                    ? 'bg-[#0EA5E9] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Mendung Berawan
              </button>
              <button
                onClick={() => setActivePreset('night')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activePreset === 'night'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Malam Hari (Baterai)
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Mockup Frame */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-white">
          {/* Dashboard Header Bar */}
          <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B1120]/70">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-[#0EA5E9] flex items-center justify-center font-bold text-xs border border-sky-500/30">
                IoT
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <span>MKA-Plant Cikarang Manufaktur (100 kWp)</span>
                  <span className="text-[11px] font-normal text-[#10B981]">
                    Sistem Online ({current.status})
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  ID Perangkat: MKA-GW-88219 · Gateway 4G LTE · Sinkronisasi 5 detik
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Unit Inverter:</span>
              <button
                onClick={() => setSelectedInverter('inv-1')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  selectedInverter === 'inv-1' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Inverter 01 (50kW)
              </button>
              <button
                onClick={() => setSelectedInverter('inv-2')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  selectedInverter === 'inv-2' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Inverter 02 (50kW)
              </button>
            </div>
          </div>

          {/* Metric Telemetry Cards */}
          <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-slate-800 bg-[#0F172A]/80">
            {/* 1. Realtime Power */}
            <div className="bg-[#0B1120]/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Daya Realtime</span>
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-tabular">
                {current.powerOutputKw.toFixed(1)} <span className="text-sm font-normal text-slate-400">kW</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Kapasitas Puncak: 100 kWp
              </div>
            </div>

            {/* 2. Today's Generation */}
            <div className="bg-[#0B1120]/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Produksi Hari Ini</span>
                <Zap className="w-4 h-4 text-[#0EA5E9]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-tabular">
                {current.dailyYieldKwh.toFixed(1)} <span className="text-sm font-normal text-slate-400">kWh</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Bulan Ini: {current.monthlyYieldMwh.toFixed(1)} MWh
              </div>
            </div>

            {/* 3. Battery State */}
            <div className="bg-[#0B1120]/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Status Baterai LiFePO4</span>
                <BatteryCharging className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-tabular">
                {current.batterySoc}% <span className="text-sm font-normal text-slate-400">SOC</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Aliran: {current.batteryPowerKw > 0 ? `+${current.batteryPowerKw} kW Charging` : `${current.batteryPowerKw} kW Discharging`}
              </div>
            </div>

            {/* 4. Performance Ratio */}
            <div className="bg-[#0B1120]/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Performance Ratio (PR)</span>
                <Gauge className="w-4 h-4 text-[#0EA5E9]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-tabular">
                {current.performanceRatio}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Suhu Inverter: {current.inverterTempC}°C (Optimal)
              </div>
            </div>
          </div>

          {/* Interactive Energy Flow Diagram */}
          <div className="p-6 sm:p-8">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Diagram Alir Energi Sistem (Live Power Flow)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-center">
              {/* PV Panels */}
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/60 relative">
                <Sun className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
                <div className="text-xs text-slate-400 font-semibold">Modul PV Surya</div>
                <div className="text-lg font-bold text-white font-tabular mt-1">
                  {current.powerOutputKw.toFixed(1)} kW
                </div>
                <div className="text-[11px] text-slate-400">Radiasi 840 W/m²</div>
              </div>

              {/* Inverter */}
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/60 relative">
                <Cpu className="w-8 h-8 text-[#0EA5E9] mx-auto mb-2" />
                <div className="text-xs text-slate-400 font-semibold">Smart Inverter</div>
                <div className="text-lg font-bold text-white font-tabular mt-1">
                  Efisiensi 98.4%
                </div>
                <div className="text-[11px] text-slate-400">Tegangan 398V AC</div>
              </div>

              {/* Battery */}
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/60 relative">
                <BatteryCharging className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                <div className="text-xs text-slate-400 font-semibold">Bank Baterai</div>
                <div className="text-lg font-bold text-white font-tabular mt-1">
                  {current.batterySoc}% Kapasitas
                </div>
                <div className="text-[11px] text-slate-400">Tegangan Bus 53.4V</div>
              </div>

              {/* PLN Grid / Load */}
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/60 relative">
                <Activity className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-xs text-slate-400 font-semibold">Beban Gedung & PLN</div>
                <div className="text-lg font-bold text-white font-tabular mt-1">
                  {current.gridExchangeKw > 0 ? `Export +${current.gridExchangeKw.toFixed(1)} kW` : `Import ${Math.abs(current.gridExchangeKw).toFixed(1)} kW`}
                </div>
                <div className="text-[11px] text-slate-400">Frekuensi 50.0 Hz</div>
              </div>
            </div>

            {/* Environmental Metric Footnote */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <div>
                Total Reduksi Karbon Seumur Hidup:{' '}
                <span className="font-bold text-[#10B981] font-tabular">
                  {current.co2SavedTotalTon.toFixed(1)} Ton CO2
                </span>{' '}
                (Setara menanam 12.800+ pohon).
              </div>
              <div className="text-slate-500">
                Peringatan Kerusakan Otomatis via WhatsApp & Push Notifikasi 24 Jam
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
