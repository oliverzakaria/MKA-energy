import React, { useState } from 'react';
import { Sun } from 'lucide-react';

export interface LogoProps {
  /**
   * Ukuran standar logo:
   * - 'navbar' : Standar navigasi header atas (tinggi 44px / h-11)
   * - 'footer' : Standar footer bawah (tinggi 40px / h-10)
   * - 'admin'  : Standar sidebar Admin Portal (tinggi 36px / h-9)
   * - 'sm' | 'md' | 'lg' | 'xl' : Ukuran standar umum
   */
  size?: 'navbar' | 'footer' | 'admin' | 'sm' | 'md' | 'lg' | 'xl';
  /** Path file logo kustom. Default membaca dari './logo.png' atau './logo.svg' */
  src?: string;
  /** Tampilkan teks nama perusahaan di samping logo */
  showText?: boolean;
  /** Tema tampilan teks ('dark' untuk background gelap seperti footer/admin, 'light' untuk navbar) */
  theme?: 'light' | 'dark';
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'navbar',
  src = './logo.png',
  showText = true,
  theme = 'light',
  className = '',
  alt = 'MKA Energy Solution Logo',
}) => {
  const [imageError, setImageError] = useState(false);

  // Standar dimensi tinggi dan lebar logo yang presisi dan responsif
  const sizeConfig = {
    navbar: {
      imgClass: 'h-11 sm:h-12 w-auto max-w-[190px] object-contain',
      iconBox: 'w-11 h-11',
      iconSize: 'w-6 h-6',
      titleClass: 'text-lg sm:text-xl font-bold tracking-tight',
      subClass: 'text-[10px] font-medium tracking-wider uppercase',
    },
    footer: {
      imgClass: 'h-10 sm:h-11 w-auto max-w-[180px] object-contain',
      iconBox: 'w-10 h-10',
      iconSize: 'w-5 h-5',
      titleClass: 'text-lg font-bold tracking-tight',
      subClass: 'text-xs text-neutral-400',
    },
    admin: {
      imgClass: 'h-9 sm:h-10 w-auto max-w-[160px] object-contain',
      iconBox: 'w-9 h-9',
      iconSize: 'w-5 h-5',
      titleClass: 'text-sm font-bold tracking-tight',
      subClass: 'text-[11px] text-neutral-400',
    },
    sm: {
      imgClass: 'h-8 w-auto max-w-[140px] object-contain',
      iconBox: 'w-8 h-8',
      iconSize: 'w-4 h-4',
      titleClass: 'text-sm font-bold',
      subClass: 'text-[9px]',
    },
    md: {
      imgClass: 'h-10 w-auto max-w-[160px] object-contain',
      iconBox: 'w-10 h-10',
      iconSize: 'w-5 h-5',
      titleClass: 'text-base font-bold',
      subClass: 'text-[10px]',
    },
    lg: {
      imgClass: 'h-14 w-auto max-w-[220px] object-contain',
      iconBox: 'w-14 h-14',
      iconSize: 'w-8 h-8',
      titleClass: 'text-2xl font-bold',
      subClass: 'text-xs',
    },
    xl: {
      imgClass: 'h-20 w-auto max-w-[280px] object-contain',
      iconBox: 'w-20 h-20',
      iconSize: 'w-10 h-10',
      titleClass: 'text-3xl font-bold',
      subClass: 'text-sm',
    },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Gambar Logo dari file dengan proteksi fallback */}
      {!imageError ? (
        <div className="relative flex items-center justify-center shrink-0">
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className={`${sizeConfig.imgClass} rounded-lg select-none transition-transform duration-200 group-hover:scale-105`}
            loading="eager"
          />
        </div>
      ) : (
        /* Fallback elegan jika gambar sedang diganti atau file belum ditemukan */
        <div
          className={`${sizeConfig.iconBox} rounded-lg bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] flex items-center justify-center text-[#0EA5E9] shadow-sm border border-sky-500/30 shrink-0 transition-transform duration-200 group-hover:scale-105`}
          title="MKA Energy Solution"
        >
          <Sun className={`${sizeConfig.iconSize} stroke-[2.2] text-[#0EA5E9]`} />
        </div>
      )}

      {/* Teks Brand (Opsi jika showText aktif) */}
      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span
            className={`${sizeConfig.titleClass} ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            } whitespace-nowrap`}
          >
            MKA Energy Solution
          </span>
          <span
            className={`${sizeConfig.subClass} ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            PT Mitra Karya Ausindo
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
