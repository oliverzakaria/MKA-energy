import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdminOpen,
  setIsAdminOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'tentang', label: 'Tentang Kami' },
    { id: 'produk', label: 'Produk & Sistem' },
    { id: 'proyek', label: 'Proyek Kami' },
    { id: 'monitoring', label: 'Monitoring Realtime' },
    { id: 'garansi', label: 'Garansi & Purna Jual' },
    { id: 'simulasi', label: 'Simulasi Harga' },
    { id: 'retail', label: 'Belanja Retail' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (isAdminOpen) {
      setIsAdminOpen(false);
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand title, single line */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                setActiveTab('beranda');
                setIsAdminOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center text-left group cursor-pointer"
              aria-label="Beranda MKA Energy Solution"
            >
              <Logo size="navbar" theme="light" />
            </button>
          </div>

          {/* Zone 2: 4-7 nav links, single-line text links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`whitespace-nowrap transition-colors hover:text-sky-600 py-1 cursor-pointer ${
                  activeTab === link.id && !isAdminOpen
                    ? 'text-sky-600 border-b-2 border-sky-500 font-bold'
                    : 'text-slate-700'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (isAdminOpen && setIsAdminOpen) setIsAdminOpen(false);
                const elem = document.getElementById('survey');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-lg transition-colors shadow-sm shadow-sky-500/25 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Permintaan Survey
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-md"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminOpen && setIsAdminOpen) setIsAdminOpen(false);
                const elem = document.getElementById('survey');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-lg"
            >
              Permintaan Survey (Min. 30 Juta)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
