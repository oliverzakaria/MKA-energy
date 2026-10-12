import React from 'react';
import { ExternalLink, ShoppingBag, CheckCircle, ShieldCheck, Tag } from 'lucide-react';
import { RetailItem, CompanyInfo } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface RetailAffiliateProps {
  retailItems: RetailItem[];
  companyInfo?: CompanyInfo;
}

export const RetailAffiliate: React.FC<RetailAffiliateProps> = ({ retailItems, companyInfo = COMPANY_INFO }) => {
  return (
    <section id="retail" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
              Belanja Komponen Retail
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ textWrap: 'balance' }}>
              Pembelian Komponen Satuan & Eceran Mitra Resmi
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Butuh suku cadang, kabel PV, panel surya eceran, atau konektor MC4 tanpa paket turnkey? Kunjungi toko online mitra distributor terpercaya kami (seperti EnergiClick).
            </p>
          </div>

          <a
            href="https://energicklick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0F172A] hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 self-start md:self-auto shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#0EA5E9]" />
            <span>Katalog Lengkap EnergiClick</span>
          </a>
        </div>

        {/* Retail Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {retailItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#0EA5E9] hover:bg-white transition-all shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-[#0EA5E9]">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.brand}</span>
                </div>

                <h3 className="text-base font-bold text-[#0F172A] mb-2 leading-snug group-hover:text-[#0EA5E9] transition-colors">
                  {item.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="py-2 px-3 bg-white rounded-lg border border-slate-200 mb-4 inline-block">
                  <span className="text-[11px] text-slate-400 block">Estimasi Harga Retail:</span>
                  <span className="text-sm font-extrabold text-[#0F172A] font-tabular">
                    {item.priceEstimate}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Mitra: {item.partnerName}</span>
                <a
                  href={item.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Beli di Mitra</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Official Partnership Notice */}
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#10B981] shrink-0" />
            <div className="text-xs sm:text-sm text-slate-800">
              <span className="font-bold text-emerald-900">Keaslian Komponen 100% Terjamin:</span> Seluruh produk retail mitra kami memiliki sertifikasi internasional (IEC, TUV, SNI) dan garansi purna jual resmi.
            </div>
          </div>
          <a
            href={COMPANY_INFO.whatsappUrl + '&text=Halo%20MKA,%20saya%20ingin%20tanya%20ketersediaan%20stok%20komponen%20retail'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline whitespace-nowrap"
          >
            Tanya Ketersediaan Stok Komponen →
          </a>
        </div>
      </div>
    </section>
  );
};
