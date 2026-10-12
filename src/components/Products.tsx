import React, { useState } from 'react';
import { Product } from '../types';
import { INITIAL_PRODUCTS, COMPANY_INFO } from '../data/mockData';
import { Check, Download, FileText, Send, ShieldCheck, Zap } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  onSelectProductForSurvey: (productName: string) => void;
}

export const Products: React.FC<ProductsProps> = ({ products, onSelectProductForSurvey }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Solusi' },
    { id: 'hybrid', label: 'PLTS Hybrid' },
    { id: 'on-grid', label: 'PLTS On-Grid Industri' },
    { id: 'pats', label: 'Pompa Air Surya (PATS)' },
    { id: 'pju', label: 'PJU Tenaga Surya' },
    { id: 'off-grid', label: 'PLTS Off-Grid Mandiri' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="produk" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
              Produk & Sistem Solusi
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Sistem PLTS Berkualitas Tinggi dengan Garansi Penuh
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Setiap sistem dirancang menggunakan komponen Tier-1 dengan kompatibilitas optimal, efisiensi tinggi, dan ketahanan terhadap iklim tropis Indonesia.
            </p>
          </div>

          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <span>Konsultasi Spesifikasi Khusus</span>
          </a>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-[#0F172A] hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0EA5E9] hover:shadow-md transition-all group"
            >
              {/* Product Visual */}
              <div>
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-[#0F172A]/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    {product.capacity}
                  </div>
                </div>

                <div className="p-6">
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-[#0EA5E9]">MKA Engineering</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.warranty.split(',')[0]}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2 leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Highlight feature list */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 mb-4">
                    {product.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Spec pills replaced with clean unboxed spec table */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs space-y-1">
                    {product.specs.slice(0, 2).map((spec, sIdx) => (
                      <div key={sIdx} className="flex justify-between items-center text-slate-600">
                        <span className="text-slate-500">{spec.label}:</span>
                        <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="p-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setActiveModalProduct(product)}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Detail & Spek</span>
                </button>
                <button
                  onClick={() => onSelectProductForSurvey(product.name)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-sky-500/20 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Survey</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Datasheet / Detail Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Spesifikasi Teknis Resmi
                </span>
                <h3 className="text-xl font-bold text-neutral-900 mt-1">
                  {activeModalProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded-lg hover:bg-neutral-100 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              {activeModalProduct.description}
            </p>

            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Fitur Keunggulan Sistem:
              </h4>
              <ul className="space-y-2">
                {activeModalProduct.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Parameter & Spesifikasi Standar:
              </h4>
              <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 text-xs sm:text-sm">
                {activeModalProduct.specs.map((sp, idx) => (
                  <div key={idx} className="flex p-3 bg-white even:bg-neutral-50 justify-between">
                    <span className="text-neutral-500 font-medium">{sp.label}</span>
                    <span className="text-neutral-900 font-semibold text-right">{sp.value}</span>
                  </div>
                ))}
                <div className="flex p-3 bg-amber-50/50 justify-between">
                  <span className="text-neutral-600 font-medium">Garansi Resmi</span>
                  <span className="text-amber-800 font-bold">{activeModalProduct.warranty}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <a
                href={COMPANY_INFO.whatsappUrl + `&text=Halo%20MKA,%20saya%20ingin%20minta%20brosur%20datasheet%20untuk%20${encodeURIComponent(activeModalProduct.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Datasheet PDF</span>
              </a>

              <button
                onClick={() => {
                  const pName = activeModalProduct.name;
                  setActiveModalProduct(null);
                  onSelectProductForSurvey(pName);
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center justify-center gap-2 shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Jadwalkan Survey Sistem Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
